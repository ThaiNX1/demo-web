import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/models/company.model';

@Component({
  selector: 'app-pxn',
  templateUrl: './pxn.component.html'
})
export class PXNComponent implements OnInit {

  @Input() company: Company;
  @Input() ledgers = [];
  
  constructor() { }

  ngOnInit(): void {
  }

}
