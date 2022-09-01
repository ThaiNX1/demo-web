import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IsFunnelChartModel } from './is-funnel-chart.model';

@Component({
  selector: 'is-funnel-chart',
  templateUrl: './is-funnel-chart.component.html',
  styleUrls: ['./is-funnel-chart.component.scss']
})
export class IsFunnelChartComponent implements OnInit, OnChanges {

  @Input() data: IsFunnelChartModel;
  @Input() height: string;

  widthPerItem: string;
  marginBottomPerItem: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.data) {
      this.widthPerItem = ((100/this.data.data.length)*0.7) + '%';
      this.marginBottomPerItem = ((100/(this.data.data.length - 1))*0.12) + '%';
    }
  }
  ngOnInit() {
  }
  

}
