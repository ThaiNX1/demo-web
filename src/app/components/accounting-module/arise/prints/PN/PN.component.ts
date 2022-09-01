import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/models/company.model';
import { TaxrateService } from "src/app/core/services/taxrate.service";
import { TaxRate } from 'src/app/shared/models/taxrate.model';


@Component({
    selector: 'PN',
    templateUrl: './PN.component.html',
})
export class PNComponent implements OnInit {
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
    @Input() dataPrint: any;
    @Input() debitCodes = [];
    @Input() creditCodes = [];
    @Input() ledgers = [];
    dateStr = '';
    debitCodeStr = '';
    creditCodeStr = '';
    dataTables = [];
    total = 0;
    order = '';
    orginalDescription= '';
    async ngOnInit() {
        this.order = this.dataPrint.orginalVoucherNumber.split("/")[0];

        const date = new Date(this.dataPrint.orginalBookDate);
        const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
        const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
        this.dateStr = `Ngày ${day} tháng ${month} năm ${date.getFullYear()}`;
        this.debitCodeStr = this.debitCodes.map(x => x.debitCode).join(', ');
        this.creditCodeStr = this.creditCodes.map(x => x.creditCode).join(', ');
        this.creditCodes.forEach((ele: any) =>{
            if(this.orginalDescription.indexOf(ele.orginalDescription) < 0)
            this.orginalDescription = this.orginalDescription + "; "+ ele.orginalDescription;
                    })
        this.dataTables = this.ledgers.map(x => {
            this.total += x.amount;
            return {
                orginalDescription: x.orginalDescription,
                code: x.debitDetailCodeSecond ? x.debitDetailCodeSecond :
                    x.debitDetailCodeFirst ? x.debitDetailCodeFirst :
                        x.deditCode,
                dvt: x.debitDetailCodeSecond ? x.debitDetailCodeSecondName :
                    x.debitDetailCodeFirst ? x.debitDetailCodeFirstName :
                        x.debitCodeName,
                quantity: x.quantity,
                unitPrice: x.unitPrice,
                amount: x.amount
            };
        });
        await this.getTaxRatesByCode(this.dataPrint?.invoiceCode);
    }

    calTax() {
        this.tax = this.dataPrint?.amount * ((parseInt(this.taxRate?.percent) || 0) / 100);
        return this.tax;
    }
}
