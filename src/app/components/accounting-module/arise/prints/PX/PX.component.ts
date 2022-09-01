import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/models/company.model';


@Component({
    selector: 'PX',
    templateUrl: './PX.component.html',
})
export class PXComponent implements OnInit {

    constructor() { }

    @Input() company: Company;
    @Input() dataPrint: any;
    @Input() creditCodes = [];
    @Input() ledgers = [];
    dateStr = '';
    codeStr = '';
    dataTables = [];
    total = 0;
    order = '';
    orginalDescription  = '';
    ngOnInit(): void {
        const date = new Date(this.dataPrint.orginalBookDate);
        const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
        const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
        this.dateStr = `Ngày ${day} tháng ${month} năm ${date.getFullYear()}`;
        this.codeStr = this.creditCodes.map(x => x.creditCode).join(', ');
        this.creditCodes.forEach((ele: any) =>{
            if(this.orginalDescription.indexOf(ele.orginalDescription) < 0)
            this.orginalDescription = this.orginalDescription + "; "+ ele.orginalDescription;
                    })
        this.dataTables = this.ledgers.map(x => {
            this.total += x.amount;
            return {
                orginalDescription: x.orginalDescription,
                code: x.creditDetailCodeSecond ? x.creditDetailCodeSecond :
                    x.creditDetailCodeFirst ? x.creditDetailCodeFirst :
                        x.creditCode,
                dvt: x.creditDetailCodeSecond ? x.creditDetailCodeSecondName :
                    x.creditDetailCodeFirst ? x.creditDetailCodeFirstName :
                        x.creditCodeName,
                quantity: x.quantity,
                unitPrice: x.unitPrice,
                amount: x.amount
            };
        });
        this.order = this.dataPrint.orginalVoucherNumber.split("/")[0];

    }



}
