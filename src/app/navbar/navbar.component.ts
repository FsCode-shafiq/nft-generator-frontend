import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private vp: ViewportScroller) { }

  ngOnInit(): void {
  }

  scrollto (id:string){
    this.vp.scrollToAnchor(id)
  }

}
