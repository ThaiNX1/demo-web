import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import * as moment from 'moment';
import { Document } from 'src/app/models/document.model';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { DocumentService } from 'src/app/service/document.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
@Component({
    selector: 'app-report-filter',
    templateUrl: './report-filter.component.html',
    styles: [
        `
            :host ::ng-deep {
                .p-button,
                .p-dropdown,
                .p-multiselect {
                    height: 35px;
                }

                .p-button {
                    width: auto;
                }

                .p-dropdown,
                .p-inputtext-sm .p-inputtext {
                    min-width: 100px;
                }

                .p-multiselect {
                    width: 190px;
                }

                .p-multiselect .p-multiselect-label {
                    font-size: 0.875rem;
                }

                .p-panel .p-panel-header {
                    background-color: var(--primary-color);
                    color: var(--surface);
                }
            }
        `,
    ],
})
export class ReportFilterComponent implements OnInit {
    @Input('types') types: any = {};

    appUtil = AppUtil;
    appConstant = AppConstant;
    @Input() filter = {
        filterType: 1,
        printType: [],
        fillName: false,
        scheduler: '',
        accountId: 0,
        documentMonth: new Date().getMonth() + 1,
        startMonth: `${new Date().getMonth() + 1}`,
        endMonth: `${new Date().getMonth() + 1}`,
        startDate: moment(new Date()).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE),
        endDate: moment(new Date()).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE),
        page: 0,
        pageSize: 20,
    };
    @Output() onPreview = new EventEmitter();
    @Output() onPrint = new EventEmitter();
    @Output() onPrintExcel = new EventEmitter();
    chartOfAccounts: any[] = [];
    constructor(private readonly chartOfAccountService: ChartOfAccountService) {}

    ngOnInit() {
        this.getChartOfAccounts();
    }

    // get list chart of account
    getChartOfAccounts() {
        this.chartOfAccountService.getAllByDisplayInsert().subscribe((res: any) => {
            this.chartOfAccounts = res;
        });
    }

    onChangePreview() {
        this.onPreview.emit(this.filter);
    }

    onChangePrint() {
        this.onPrint.emit(this.filter);
    }

    onChangePrintExcel() {
        this.onPrintExcel.emit(this.filter);
    }

    onChangeType() {
        if(this.filter.filterType === 1) {
            this.filter.startDate = moment(new Date()).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE);
            this.filter.endDate = moment(new Date()).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE);
        }
        if(this.filter.filterType === 2) {
            this.filter.startMonth = '1';
            this.filter.endMonth = '1';
        }
    }
}
