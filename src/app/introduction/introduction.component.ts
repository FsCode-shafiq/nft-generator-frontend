import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../Services/general.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  constructor(
    private general: GeneralService
  ) { }

  ngOnInit(): void {
  }

  getStarted(){
    this.general.getStarted();
  }

}
