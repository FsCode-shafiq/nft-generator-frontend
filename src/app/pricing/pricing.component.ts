import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../Services/general.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  constructor(
    private general: GeneralService
  ) { }

  ngOnInit(): void {
  }
  getStarted(){
    this.general.getStarted();
  }

}
