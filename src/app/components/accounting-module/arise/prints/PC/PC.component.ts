import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/models/company.model';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'PC',
    templateUrl: './PC.component.html',
})
export class PCComponent implements OnInit {

    constructor() { }

    @Input() company: Company;
    @Input() dataPrint: any;
    dateStr = '';
    @Input() debitCodes = [];
    order = '';
    @Input() total: number;
    orginalDescription = '';
    ngOnInit(): void {
        const date = new Date(this.dataPrint.orginalBookDate);
        const day = date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate();
        const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : '' + (date.getMonth() + 1);
        this.dateStr = `Ngày ${day} tháng ${month} năm ${date.getFullYear()}`;
        this.order = this.dataPrint.orginalVoucherNumber.split("/")[0];
        this.debitCodes.forEach((ele: any) =>{
            if(this.orginalDescription.indexOf(ele.orginalDescription) < 0)
            this.orginalDescription = this.orginalDescription + "; "+ ele.orginalDescription;
                    })
    }



}
