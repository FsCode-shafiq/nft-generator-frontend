import { Component, OnInit } from '@angular/core';
import { from, Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../Services/snackbar.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  unsubscribe = new Subject();

  showInformation = true;
  showGenartingScreen = false;
  files: NgxFileDropEntry[] = [];
  generatorForm: FormGroup | any;
  layers!: FormArray;
  constructor(
    private msg: MessageServiceService,
    private fb: FormBuilder,
    private snack: SnackbarService,
  ) { }

  ngOnInit(): void {
    
    this.setAttr();
    this.msg.currentMsg.pipe(takeUntil(this.unsubscribe)).subscribe(msg => this.msgHandler(msg));
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
        this.showGenartingScreen = true;
        break;

      default:
        break;
    }
  }

  setAttr() {
    this.generatorForm = this.fb.group({
      collectionName: ['', Validators.required],
      collectionSize: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      discription: ['', Validators.required],
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
          console.log(file);
          const fileReader: FileReader = new FileReader();

          fileReader.onload = () => {
            // console.log(fileReader.result);
            
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


  buttonMessage = (msg: string) => {
    this.msg.changeMessage(msg);
  }

}
