import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {

  unsubscribe = new Subject();

  showInformation = true;
  files: NgxFileDropEntry[] = [];

  constructor(
    private msg: MessageServiceService
  ) { }

  ngOnInit(): void {
    this.msg.currentMsg.pipe(takeUntil(this.unsubscribe)).subscribe(msg=> this.msgHandler(msg));
  }

  msgHandler = (msg: any) =>{
    switch (msg) {
      case 'proceed':
        this.showInformation = false
        break;
      case 'back':
        this.showInformation = true;
        break;
      default:
        break;
    }
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  
  buttonMessage = (msg: string) =>{
    this.msg.changeMessage(msg);
  }

}
