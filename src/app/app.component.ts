import { Component, OnInit , OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageServiceService } from './Services/message-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit , OnDestroy {
  title = 'nft-generator-frontend';
  unsubscribe = new Subject();

  constructor(
    private msg: MessageServiceService,
    private router: Router
  ){

  }
  ngOnInit(): void {

    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe(events => this.getRouterEvents(events));
    
  }

  getRouterEvents = (events: any) =>{

    if(events instanceof NavigationEnd){
      
      const {url} = events;
      switch (url) {
        case "/dashboard":
          this.msg.changeMessage('hide-navbar')
          break;
        case '/':
          this.msg.changeMessage('show-navbar');
          break;
        case '/login':
          this.msg.changeMessage('hide-nav-controls');
          break;
        case '/signup':
          this.msg.changeMessage('hide-nav-controls');
          break;
        default:
          break;
      }
    }

  }

  ngOnDestroy(): void {

    this.unsubscribe.next('');
    this.unsubscribe.complete();
    
  }



}
