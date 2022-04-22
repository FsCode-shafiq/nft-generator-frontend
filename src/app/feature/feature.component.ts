import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../Services/general.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {

  constructor(
    private general: GeneralService
  ) { }

  ngOnInit(): void {
  }

  getStarted(){
    this.general.getStarted();
  }

}
