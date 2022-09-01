import { Component, Input, OnInit } from '@angular/core';
import { TaxrateService } from 'src/app/core/services';
import { Company } from 'src/app/shared/models/company.model';
import { TaxRate } from 'src/app/shared/models/taxrate.model';

@Component({
  selector: 'app-pnpc',
  templateUrl: './pnpc.component.html'
})
export class PNPCComponent implements OnInit {
  public taxRate: TaxRate;
  public tax = 0;
  constructor(
      private readonly taxRateService: TaxrateService,
  ) { 
      
  }

  private async getTaxRatesByCode(code:string) {
      try {
          var res = await this.taxRateService.getTaxRateByCode(code).toPromise();
          if (res && res.dt && res.dt.length) {
              this.taxRate = res.dt[0];
              console.log(this.taxRate);
          }
      } catch (e) {
      }
  }

  @Input() company: Company;
  @Input() ledgers = [];
  async ngOnInit() {
      console.log(this.ledgers)
  }

  calTax(data) {
      console.log(data)
    this.getTaxRatesByCode(data.data[0].invoiceCode);
      this.tax = data.total * ((parseInt(this.taxRate?.percent) || 0) / 100);
      return this.tax;
  }
}
