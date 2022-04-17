import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {

  private message = new BehaviorSubject('');
  currentMsg = this.message.asObservable();


  constructor() { }

  changeMessage(message:string){
    this.message.next(message);
  }
}
