import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../Services/snackbar.service';
import * as _ from 'lodash';
import { GeneralService } from '../Services/general.service';
import { NftService } from '../Services/nft.service';

// import a from '../worker/upload.worker'

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit, OnDestroy {

  @ViewChild('canvas') canvas!: ElementRef;
  unsubscribe = new Subject();

  showInformation = true;
  showGenartingScreen = false;
  files: NgxFileDropEntry[] = [];
  generatorForm: FormGroup | any;
  layers!: FormArray;
  selectedLayer: any = 0;
  images!: any;
  options: any = [];
  noOfUploaded: number = 0;
  imagesArr: Array<any> = [];
  worker!: Worker;
  id: any;
  ctx!: CanvasRenderingContext2D | any ;
  constructor(
    private msg: MessageServiceService,
    private fb: FormBuilder,
    private snack: SnackbarService,
    private general: GeneralService,
    private cdr: ChangeDetectorRef,
    private nft: NftService
  ) { }


  ngOnInit(): void {
    this.setUpWorker();
    this.setAttr();
    this.msg.currentMsg.pipe(takeUntil(this.unsubscribe)).subscribe(msg => this.msgHandler(msg));
  }

  setUpWorker() {
    this.worker = new Worker(new URL('../worker/upload.worker.ts', import.meta.url));
    console.log('initializing-worker');
    this.worker.onmessage = ({ data }) => {
      let { message } = data;
      let url = JSON.parse(message.url);

      if (this.generatorForm.value.collectionSize >= this.noOfUploaded) {
        console.log("cs:", this.generatorForm.value.collectionSize - 1, 'us:', this.noOfUploaded);
        this.imagesArr.push(url.message.Location)
        this.noOfUploaded += 1;
      }
      if (this.generatorForm.value.collectionSize == this.noOfUploaded) {

        let auth: any = localStorage.getItem('auth');
        auth = JSON.parse(auth);
        let { email } = auth;
        this.nft.setImages({ id: this.id, images: this.imagesArr }).pipe(takeUntil(this.unsubscribe)).subscribe(res => {
          let { Error } = res;
          if (!Error) {
            this.snack.openSnackBar("nft-generated successfully")
          }
        })
        console.log(this.imagesArr);
      }
    }
  }
  msgHandler = (msg: any) => {
    switch (msg) {
      case 'proceed':
        this.proceed();
        break;
      case 'back':
        this.showInformation = true;
        break;
      case 'show-generating-screen':
        console.log(this.generatorForm.value);
        this.startCreatingNft();
        break;

      default:
        break;
    }
  }

  setAttr() {
    this.generatorForm = this.fb.group({
      collectionName: ['11', Validators.required],
      collectionSize: ['10', Validators.required],
      width: ['512', Validators.required],
      height: ['512', Validators.required],
      discription: ['2222', Validators.required],
      layers: new FormArray([])
    })
  }

  addLayer() {
    this.layers = this.generatorForm.get('layers') as FormArray;
    this.layers.push(
      this.fb.group({
        layerName: 'Layer',
        images: [new FormArray([]), Validators.required]
      })
    );
  }

  deleteLayer(i: any) {
    const layers: FormArray = this.generatorForm.controls.layers;
    layers.removeAt(i);
  }

  proceed() {
    let isVlaid = true;
    const formKeys = Object.keys(this.generatorForm.value);
    formKeys.forEach((key: String) => {
      if (!this.generatorForm.get(key).value && key !== 'layers') {
        isVlaid = false;
        this.snack.openSnackBar('Please Fill all Required Fields')
      }
    });
    if (isVlaid) {
      this.showInformation = false
    }
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          const fileReader: FileReader = new FileReader();

          fileReader.onload = () => {

            this.images = this.generatorForm.get('layers') as FormArray;
            this.images.value[this.selectedLayer].images.push(
              this.fb.group({
                imageName: file.name,
                source: fileReader.result
              })
            )

          }

          fileReader.readAsDataURL(file)

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  selectLayer(i: number) {
    this.selectedLayer = i;
  }

  deletImage(layerIndex: number, imageIndex: number) {
    const images: FormArray = this.generatorForm.controls.layers.get(`${layerIndex}`).value.images;
    images.removeAt(imageIndex);
  }


  buttonMessage = (msg: string) => {
    this.msg.changeMessage(msg);
  }

  async startCreatingNft() {
    this.showGenartingScreen = true;
    this.noOfUploaded = 0;
    let editionCount = 1;
    let failedCount = 0;
    let dnaList = new Set();

    const data = this.general._deepClone(this.generatorForm);
    let {
      layers,
      collectionName,
      collectionSize,
      discription,
      height,
      width
    } = data;

    let auth: any = localStorage.getItem('auth');
    auth = JSON.parse(auth);

    let { email } = auth;

    this.nft.setInformation({
      name: collectionName,
      size: collectionSize,
      discription: discription,
      height: height,
      width: width,
      email: email
    }).pipe(takeUntil(this.unsubscribe)).subscribe(async res => {
      let { Error, message } = res;

      if (!Error) {
        let { _id } = message;
        this.id = _id;
        const _Layers = this.layerSetup(layers);
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        while (editionCount <= collectionSize) {
          let ctx = canvas.getContext('2d');
          let newDna = this.createDna(_Layers);
          if (this.isDnaUnique(dnaList, newDna)) {
            let results: any[] = this.constructLayerToDna(newDna, _Layers);
            canvas.width = width;
            canvas.height = height;
            
            for (let index = 0; index < results.length; index++) {
              let imageSrc = await this.loadImage(results[index].selectedElement?.path);
              ctx?.drawImage(imageSrc, 0, 0);
              
            }

            let source: any = canvas.toDataURL();
            this.worker.postMessage({ filename: `${_id}-${editionCount}.png`, content: source });
            this.ctx?.clearRect(0, 0, width, height);
            editionCount++
            dnaList.add(this.filterDNAOptions(newDna));

          } else {
            failedCount++;
            if (failedCount > 10000) {
              this.snack.openSnackBar('your need more layers and images to grow your collection');
              break;
            }
          }
        }
        console.log('done');
      } else {
        this.snack.openSnackBar(message)
      }
    })

  }

  async loadImage(src:any){

    let image = new Image();

    image.src = src;

    await image.decode();

    return image;
  }
  
  layerSetup(layers: Array<any>) {
    const setLayers = layers.map((layerObject, index) => {
      return {
        id: index,
        elements: this.getElement(layerObject.images),
        name: layerObject.layerName
      }
    })
    return setLayers;
  }

  getElement(images: Array<any>) {
    const rarity = 100 / images.length;
    return images.map((image, ind) => {
      let source = new Image();
      source.src = image.source;
      source.id = `${ind}`;
      source.width = this.generatorForm.value.width;
      source.height = this.generatorForm.value.height;
      
      return {
        id: ind,
        name: image.imageName,
        filename: ind,
        path: image.source,
        weight: rarity
      }
    })
  }

  createDna(_layers: any) {
    let randNum: any[] = [];
    _layers.forEach((layer: any) => {
      var totalWeight = 0;
      layer.elements.forEach((element: any) => {
        totalWeight += element.weight;
      });
      // number between 0 - totalWeight
      let random = Math.floor(Math.random() * totalWeight);
      for (var i = 0; i < layer.elements.length; i++) {
        // subtract the current weight from the random weight until we reach a sub zero value.
        random -= layer.elements[i].weight;
        if (random < 0) {
          return randNum.push(
            `${layer.elements[i].id}:${layer.elements[i].filename}${layer.bypassDNA ? "?bypassDNA=true" : ""
            }`
          );
        }
      }
    });
    return randNum.join("-");
  }

  isDnaUnique(_DnaList = new Set(), _dna = "") {
    const _filteredDNA = this.filterDNAOptions(_dna);
    return !_DnaList.has(_filteredDNA);
  };

  filterDNAOptions(_dna: any) {
    const dnaItems = _dna.split("-");
    const filteredDNA = dnaItems.filter((element: any) => {
      const query = /(\?.*$)/;
      const querystring = query.exec(element);
      if (!querystring) {
        return true;
      }
      const options: any = querystring[1].split("&").reduce((r, setting) => {
        const keyPairs = setting.split("=");
        return { ...r, [keyPairs[0]]: keyPairs[1] };
      }, []);

      return options.bypassDNA;
    });

    return filteredDNA.join("-");
  };

  constructLayerToDna(_dna = "", _layers: any[]) {
    let mappedDnaToLayers = _layers.map((layer: any, index) => {
      let selectedElement = layer.elements.find(
        (e: any) => e.id == this.cleanDna(_dna.split("-")[index])
      );
      return {
        name: layer.name,
        blend: layer.blend,
        opacity: layer.opacity,
        selectedElement: selectedElement,
      };
    });
    return mappedDnaToLayers;
  };

  cleanDna = (_str: any) => {
    const withoutOptions = this.removeQueryStrings(_str);
    var dna = Number(withoutOptions.split(":").shift());
    return dna;
  };

  removeQueryStrings(_dna: any) {
    const query = /(\?.*$)/;
    return _dna.replace(query, "");
  };
  ngOnDestroy(): void {
    this.unsubscribe.next('');
    this.unsubscribe.complete();
    this.worker.terminate();
  }
}


