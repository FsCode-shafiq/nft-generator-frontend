import { ViewportScroller } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from '../Services/message-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit , OnDestroy{

  unsubscribe = new Subject();

  navbar = true;
  userFlow = false;
  constructor(
    private vps: ViewportScroller,
    private msg: MessageServiceService
    ) { }
    
    ngOnInit(): void {
      
      this.msg.currentMsg.pipe(takeUntil(this.unsubscribe)).subscribe(msg=> this.msgHandler(msg));
      
    }

    msgHandler = (msg:string) =>{
      console.log(msg);
      switch (msg) {
        case 'hide-navbar':
          this.navbar = false;
          break;
        case 'show-navbar':
          this.navbar = true;
          this.userFlow = false;
          break;
        case 'hide-nav-controls':
          this.userFlow = true;
          break;
        default:
          break;
      }

    }
    
    scrollto (id:string){
      this.vps.scrollToAnchor(id)
    }


    ngOnDestroy(): void {

      this.unsubscribe.next('');
      this.unsubscribe.complete();
      
    }

}
