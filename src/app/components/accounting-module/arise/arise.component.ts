import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Arise } from 'src/app/models/arise.model';
import { Ledger } from 'src/app/models/ledger.model';
import { LedgerService } from 'src/app/service/ledger.service';
import AppUtil from 'src/app/utilities/app-util';
import { AddLedgerComponent } from './add-ledger/add-ledger.component';
import { DecimalPipe } from '@angular/common';

// get the height
@Component({
    selector: 'app-arise',
    templateUrl: './arise.component.html',
    providers: [MessageService, ConfirmationService, DecimalPipe],
    styles: [
        `
            .card {
                padding: 0 !important;
            }

            :host ::ng-deep {
                .p-fluid .p-button-icon-only {
                    width: 1.8rem;
                    height: 1.5rem;
                }

                .p-datatable-scrollable-both .p-datatable-thead > tr > th {
                    padding: 2px 2px;
                    font-size: 11px;
                }

                .p-datatable-scrollable-both .p-datatable-tbody > tr > td {
                    padding: 2px 2px;
                    font-size: 11px;
                }

                .p-paginator {
                    height: 2rem;
                    padding: 0 !important;
                    margin: 0 !important;
                    margin-top: 1px !important;
                    background-color: inherit;
                }

                .p-paginator .p-dropdown {
                    height: 2rem !important;
                }

                .p-paginator .p-paginator-prev,
                .p-paginator .p-paginator-next,
                .p-paginator .p-paginator-pages .p-paginator-page {
                    min-width: auto !important;
                    min-width: 2rem !important;
                    height: 1.5rem !important;
                }

                .p-paginator .p-dropdown .p-dropdown-label {
                    padding: 5px !important;
                }

                .p-paginator .p-paginator-first,
                .p-paginator .p-paginator-last,
                .p-paginator-rpp-options {
                    display: none !important;
                }

                .p-link:focus {
                    outline: 0 none;
                    outline-offset: 0;
                    box-shadow: none !important;
                }

                .p-paginator
                    .p-paginator-prev:not(.p-disabled):not(.p-highlight):hover {
                    background-color: inherit;
                }

                .p-datatable table {
                    height: 30vh !important;
                }

                .p-datatable-tbody {
                    min-height: 270px !important;
                    height: 100% !important;
                }

                .p-button.p-button-sm {
                    height: 1.5rem !important;
                }

                .marquee {
                    width: 300px;
                }

                .row-accessories {
                    background-color: var(--invalid-primary-color) !important;
                    color: var(--surface-a) !important;
                }

                .p-button-danger {
                    background-color: rgb(255, 99, 132);
                    border-color: rgb(255, 99, 132);
                }

                .p-button-danger:hover {
                    background-color: rgb(255, 99, 132) !important;
                    opacity: 0.5;
                    border-color: rgb(255, 99, 132) !important;
                }
            }
        `,
    ],
})
export class AriseComponent implements OnInit {
    @ViewChild('addLedgerForm') addLedgerForm: AddLedgerComponent;

    appUtil = AppUtil;

    public arise: Arise;
    public arises: Arise[] = [];
    public selectedArise: any;
    public selectedArises: Arise[] = [];
    public selectedAriseContext: Arise[] = [];
    public formData: any = {};
    public isEdit: boolean = false;
    public ledgers: Ledger[] = [];

    pendingRequest: any;

    public totalRecords = 0;
    public totalPages = 0;

    items: MenuItem[];
    paramToGetLedgers: any = {
        keyword: null,
        documentType: 'PT',
        filterMonth: new Date().getMonth() + 1,
        payer: null,
        address: null,
        page: 0,
        pageSize: 10,
    };
    nextStt: number = 0;

    public documentList: Document[] = [];
    isMobile = screen.width <= 1199;

    types: any = {};

    constructor(
        private readonly ledgerService: LedgerService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly decimalPipe: DecimalPipe
    ) {}

    ngOnInit() {
        this.getLedgers();
        this.items = [
            {
                label: 'Hủy DS chọn',
                icon: 'pi pi-fw pi-replay',
                command: () => (this.selectedArises = []),
            },
            {
                label: 'Xóa DS chọn',
                icon: 'pi pi-fw pi-trash',
                command: () => this.onRemoveSelectedArises(),
            },
        ];
        this.types = this.appUtil.getAriseTypes();
    }

    selectRecord(selectedLedger: Ledger) {
        this.selectedArise = Object.assign({}, selectedLedger);
        this.isEdit = true;
        this.formData = this.selectedArise;
    }

    onRemoveSelectedArises() {
        this.onDelete(this.selectedArises.map(x => x.id), true);
        console.log(this.selectedArises.map(x => x.id));
    }

    public getLedgers(event?) {
        if (this.pendingRequest) {
            this.pendingRequest.unsubscribe();
        }
        if (event) {
            this.paramToGetLedgers.page = event.first / event.rows + 1;
            this.paramToGetLedgers.pageSize = event.rows;
        }

        this.pendingRequest = this.ledgerService
            .getList(this.paramToGetLedgers)
            .subscribe((resp) => {
                this.ledgers = [...resp.data];
                this.totalRecords = resp.totalItems || 0;
                this.totalPages = resp.totalItems / resp.pageSize + 1;
                this.nextStt = resp.nextStt;
            });
    }

    onDelete(id, isMulti = false) {
        let message;
        this.translateService
            .get('question.delete_arise_content')
            .subscribe((res) => {
                message = res;
            });
        let idsTemp = [];
        if(!isMulti) {
            idsTemp.push(id);
        }
        else {
            idsTemp = id;
        }
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.ledgerService
                    .deleteLedger({ ids: idsTemp.join(',')})
                    .subscribe((response: any) => {
                        this.getLedgers();
                    });
            },
        });
    }

    // get tooltip hover row
    getToolTipRow(arise: Ledger) {
        return `Tổng tiền: ${this.decimalPipe.transform(arise.amount)} \n Mã chứng từ: ${arise.orginalVoucherNumber}`;
    }
}
