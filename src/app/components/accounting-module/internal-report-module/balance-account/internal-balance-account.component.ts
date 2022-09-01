import { Component, OnInit } from '@angular/core';
import AppUtil from 'src/app/utilities/app-util';
@Component({
    selector: 'app-internal-balance-account',
    templateUrl: './balance-account.component.html',
    styles: [``],
})
export class InternalBalanceAccountComponent implements OnInit {
    appUtil = AppUtil;
    types = {};

    constructor() {}

    getParams = {
        filterType: null,
        printType: [],
        fillName: false,
        scheduler: '',
        accountId: 0,
        documentMonth: new Date().getMonth() + 1,
        startMonth: `${new Date().getMonth() + 1}`,
        endMonth: `${new Date().getMonth() + 1}`,
        startDate: new Date(),
        endDate: new Date(),
        page: 0,
        pageSize: 20,
    };
    ngOnInit(): void {
        this.types = this.appUtil.getAriseReportTypes();
    }

    onPreview() {
        alert('on preview');
        console.log(this.getParams);
    }

    onPrint() {
        alert('on print');
        console.log(this.getParams);
    }

    onPrintExcel() {
        alert('on print excel');
        console.log(this.getParams);
    }
}
