import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {MessageService} from 'primeng/api';
import {AutoComplete} from 'primeng/autocomplete';
import {ChartOfAccountService} from 'src/app/service/chart-of-account.service';
import {DescriptionService} from 'src/app/service/description.service';
import {LedgerService} from 'src/app/service/ledger.service';
import {PayerService} from 'src/app/service/payer.service';
import {TaxRatesService} from 'src/app/service/tax-rates.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import {ChartOfAccount} from "../../../../models/case.model";

// get the height
@Component({
    selector: 'app-add-ledger',
    templateUrl: './add-ledger.component.html',
    styles: [
        `
            :host ::ng-deep {
                .p-dropdown,
                .p-multiselect,
                .p-inputnumber,
                .p-inputnumber-input,
                p-inputMask .p-inputtext,
                .p-inputtext,
                .p-dropdown-panel .p-dropdown-items .p-dropdown-item,
                .w-full,
                .p-inputgroup > .p-element + .p-inputgroup-addon,
                .p-inputgroup .p-inputwrapper {
                    height: 24px !important;
                }

                .p-button {
                    height: 12px !important;
                }

                .p-disabled,
                .p-component:disabled,
                input[readonly] {
                    background-color: var(--text-color-secondary) !important;
                    cursor: default;
                }

                .p-inputtext:enabled:focus {
                    box-shadow: none !important;
                }

                .p-inputgroup-addon {
                    padding: 0 !important;
                }

                .grid > [class*='col'] {
                    padding: 1px 8px 1px 4px;
                }

                .p-divider.p-divider-horizontal {
                    padding: 0.1rem 0;
                    margin: 0.5rem 0;
                }

                .p-inputmask-clear-icon {
                    right: 8px;
                }

                p-inputMask {
                    min-width: 100px !important;
                }

                .p-dropdown.p-dropdown-clearable .p-dropdown-label {
                    padding: 0.25rem;
                }

                .p-inputgroup .p-inputwrapper > .p-component {
                    width: 100% !important;
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                }

                .p-autocomplete-clear-icon {
                    right: 4px !important;
                }

                .p-inputgroup-addon {
                    min-width: 2rem !important;
                }

                label {
                    margin-top: 4px !important;
                }

                .p-dropdown-panel .p-dropdown-items .p-dropdown-item,
                .p-dropdown-panel
                .p-dropdown-items:not(.p-dropdown-virtualscroll) {
                    padding-top: 6px !important;
                    padding-bottom: 2px !important;
                }

                p-inputMask .p-inputtext {
                    padding: 4px 0 0 4px !important;
                }

                .p-inputtext,
                .p-dropdown.p-dropdown-clearable .p-dropdown-label {
                    padding: 4px !important;
                }

                .p-dropdown .p-dropdown-trigger {
                    width: 2rem;
                }

                #internalType {
                    min-width: 60px !important;
                }
            }
        `,
    ],
})
export class AddLedgerComponent implements OnInit, OnChanges {
    public appConstant = AppConstant;
    public appUtil = AppUtil;

    @ViewChild('invoiceCode') public vcInvoiceCode: AutoComplete;
    @ViewChild('debit') public vcDebit: AutoComplete;
    @ViewChild('debit1') vcDebit1: AutoComplete;
    @ViewChild('debit2') vcDebit2: AutoComplete;
    @ViewChild('credit') vcCredit: AutoComplete;
    @ViewChild('credit1') vcCredit1: AutoComplete;
    @ViewChild('credit2') vcCredit2: AutoComplete;
    @ViewChild('orginalCompanyName') orginalCompanyName: AutoComplete;

    @Input('formData') formData: any = {};
    @Input('isEdit') isEdit: boolean = false;
    @Input('types') types: any = {};
    @Input('nextStt') nextStt: number = 0;
    @Input('paramToGetLedgers') paramToGetLedgers: any = {};
    @Output('onCancel') onCancel = new EventEmitter();

    creditFirstDetailCaseList: any[] = [];
    creditSecondDetailCaseList: any[] = [];

    buttonMenus: any[] = [];

    ledgerForm: FormGroup = new FormGroup({});

    isSubmitted: boolean = false;
    isInvalidForm: boolean = false;
    isForeignCurrency: boolean = false;

    chartOfAccounts: any[] = [];
    filteredDebitNames: any[] = [];
    filteredCreditNames: any[] = [];
    taxRates: any[] = [];
    filteredTaxRates: any[] = [];
    selectedTaxRate: any = {};
    descriptions: any[] = [];
    filteredDescNames: any[] = [];
    payers: any[] = [];
    filteredPayerNames: any[] = [];
    debits1: any[] = [];
    filteredDebit1Names: any[] = [];
    debits2: any[] = [];
    filteredDebit2Names: any[] = [];
    credits1: any[] = [];
    filteredCredit1Names: any[] = [];
    credits2: any[] = [];
    filteredCredit2Names: any[] = [];

    selectedDebit: any = {};
    selectedDebitPrevious: any = {};
    isDebitClear: boolean = false;
    selectedDebit1: any = {};
    isDebit1Clear: boolean = false;
    selectedDebit2: any = {};
    isDebit2Clear: boolean = false;
    selectedCredit: any = {};
    isCreditClear: boolean = false;
    selectedCredit1: any = {};
    isCredit1Clear: boolean = false;
    selectedCredit2: any = {};
    isCredit2Clear: boolean = false;
    warehouseCode: any = "";
    warehouseName: any = "";

    constructor(
        private fb: FormBuilder,
        private ledgerService: LedgerService,
        private taxRatesService: TaxRatesService,
        private chartOfAccountService: ChartOfAccountService,
        private payerService: PayerService,
        private descriptionService: DescriptionService,
        private messageService: MessageService,
        private translateService: TranslateService
    ) {
        this.ledgerForm = this.fb.group({
            id: [''],
            type: [''],
            month: [''],
            voucherNumber: [''],
            orginalAddress: [''],
            orginalVoucherNumber: [''],
            orginalBookDate: [''],
            referenceVoucherNumber: [''],
            referenceBookDate: [''],
            referenceFullName: [''],
            referenceAddress: [''],
            isInternal: [''],
            attachVoucher: [''],
            invoiceCode: [''],
            invoiceName: [''],
            invoiceTaxCode: [''],
            invoiceAddress: [''],
            invoiceProductItem: [''],
            invoiceAdditionalDeclarationCode: [''],
            invoiceSerial: [''],
            invoiceNumber: [''],
            invoiceDate: [''],
            // taxCode: [''],
            debitCode: [{value: '', label: ''}],
            debitDetailCodeFirst: [{value: '', label: ''}],
            debitDetailCodeSecond: [{value: '', label: ''}],
            creditCode: [{value: '', label: ''}],
            creditDetailCodeFirst: [{value: '', label: ''}],
            creditDetailCodeSecond: [{value: '', label: ''}],
            debitWarehouse: [''],
            creditWarehouse: [''],
            projectCode: [''],
            depreciaMonth: [''],
            orginalCurrency: [''],
            exchangeRate: [''],
            quantity: [''],
            unitPrice: [''],
            amount: [''],
            //payer
            orginalCompanyName: [''],
            //description
            orginalDescription: [''],
        });
    }

    async ngOnChanges(changes: SimpleChanges) {
        console.log('onc ', this.formData);
        if (
            this.isEdit &&
            this.formData &&
            Object.keys(this.formData).length > 0
        ) {
            this.ledgerForm.setValue({
                id: this.formData.id,
                type: this.formData.type,
                month: this.formData.month,
                voucherNumber: this.formData.voucherNumber,
                orginalAddress: this.formData.orginalAddress,
                orginalVoucherNumber: this.formData.orginalVoucherNumber,
                orginalBookDate: moment(this.formData.orginalBookDate).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE),
                referenceVoucherNumber: this.formData.referenceVoucherNumber,
                referenceBookDate: moment(this.formData.referenceBookDate).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE),
                referenceFullName: this.formData.referenceFullName,
                isInternal: this.formData.isInternal,
                referenceAddress: this.formData.referenceAddress,
                attachVoucher: this.formData.attachVoucher,
                invoiceCode: this.formData.invoiceCode,
                invoiceName: this.formData.invoiceName,
                invoiceTaxCode: this.formData.invoiceTaxCode,
                invoiceAddress: this.formData.invoiceAddress,
                invoiceProductItem: this.formData.invoiceProductItem,
                invoiceAdditionalDeclarationCode: this.formData.invoiceAdditionalDeclarationCode,
                invoiceSerial: this.formData.invoiceSerial,
                invoiceNumber: this.formData.invoiceNumber,
                invoiceDate: moment(this.formData.invoiceDate).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE),
                debitCode: {
                    value: this.formData.debitCode,
                    label: ''
                },
                debitDetailCodeFirst: {
                    value: this.formData.debitDetailCodeFirst,
                    label: ''
                },
                debitDetailCodeSecond: {
                    value: this.formData.debitDetailCodeSecond,
                    label: ''
                },
                creditCode: {
                    value: this.formData.creditCode,
                    label: ''
                },
                creditDetailCodeFirst: {
                    value: this.formData.creditDetailCodeFirst,
                    label: ''
                },
                creditDetailCodeSecond: {
                    value: this.formData.creditDetailCodeSecond,
                    label: ''
                },
                debitWarehouse: this.formData.debitWarehouse,
                creditWarehouse: this.formData.creditWarehouse,
                projectCode: this.formData.projectCode,
                depreciaMonth: this.formData.depreciaMonth,
                orginalCurrency: this.formData.orginalCurrency,
                exchangeRate: this.formData.exchangeRate,
                quantity: this.formData.quantity,
                unitPrice: this.formData.unitPrice,
                amount: this.formData.amount,
                orginalCompanyName: this.formData.orginalCompanyName,
                orginalDescription: this.formData.orginalDescription,
            });
            // this.getChartOfAccountDetails(null, this.formData.debitCode, this.appConstant.ACCOUNT_TYPE.DEBIT, true);
            // this.getChartOfAccountDetails(null, this.formData.creditCode, this.appConstant.ACCOUNT_TYPE.CREDIT, true);
            // this.getChartOfAccountDetails(this.formData.debitCode, this.formData.debitDetailCodeFirst, this.appConstant.ACCOUNT_TYPE.DEBIT_1, true);
            // this.getChartOfAccountDetails(this.formData.creditCode, this.formData.creditDetailCodeFirst, this.appConstant.ACCOUNT_TYPE.CREDIT_1, true);
            // Cần update get ct 2 name vào chỗ này - Giúp em nha
            //
            await this.getChartOfAccountDetails_1(this.formData.debitCode, '', this.appConstant.ACCOUNT_TYPE.DEBIT_1)
            await this.getChartOfAccountDetails_1(this.formData.debitCode, this.formData.debitDetailCodeFirst, this.appConstant.ACCOUNT_TYPE.DEBIT_2)
            await this.getChartOfAccountDetails_1(this.formData.creditCode, '', this.appConstant.ACCOUNT_TYPE.CREDIT_1)
            await this.getChartOfAccountDetails_1(this.formData.debitCode, this.formData.creditDetailCodeFirst, this.appConstant.ACCOUNT_TYPE.CREDIT_2)

            this.selectedDebit = this.getCreditDebitObject(this.formData.debitCode, this.appConstant.ACCOUNT_TYPE.DEBIT) || {}
            this.selectedDebit1 = this.getCreditDebitObject(this.formData.debitDetailCodeFirst, this.appConstant.ACCOUNT_TYPE.DEBIT_1) || {}
            this.selectedDebit2 = this.getCreditDebitObject(this.formData.debitDetailCodeSecond, this.appConstant.ACCOUNT_TYPE.DEBIT_2) || {}
            this.selectedCredit = this.getCreditDebitObject(this.formData.creditCode, this.appConstant.ACCOUNT_TYPE.CREDIT) || {}
            this.selectedCredit1 = this.getCreditDebitObject(this.formData.creditDetailCodeFirst, this.appConstant.ACCOUNT_TYPE.CREDIT_1) || {}
            this.selectedCredit2 = this.getCreditDebitObject(this.formData.creditDetailCodeSecond, this.appConstant.ACCOUNT_TYPE.CREDIT_2) || {}

            console.log('ledgerForm',this.ledgerForm)
        } else {
            // generate orginalVoucherNumber
            this.ledgerForm.controls['orginalVoucherNumber'].setValue(
                `${this.appUtil
                    .addLeadingZeros(this.nextStt, 3)
                    .toString()}/${this.appUtil
                    .addLeadingZeros(new Date().getMonth() + 1, 2)
                    .toString()}/${this.paramToGetLedgers.documentType}`
            );
            // generate voucherNumber
            this.ledgerForm.controls['voucherNumber'].setValue(
                `${this.appUtil
                    .addLeadingZeros(new Date().getMonth() + 1, 2)
                    .toString()}/${this.paramToGetLedgers.documentType}`
            );
            this.ledgerForm.controls['orginalBookDate'].setValue(
                moment(new Date()).format(
                    this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
                )
            );
        }
    }

    ngOnInit() {
        this.buttonMenus = this.appUtil.getButtonAriseMenu();
        this.getTaxRates();
        this.getChartOfAccounts();
        this.getPayers();
        this.getDescriptions();
        // first focus is orginalBookDate
        this.onFocusInputMask('orginalBookDate');
    }

    // event focus input mask
    onFocusInputMask(id) {
        (<HTMLElement>document.getElementById(id).children[0]).focus();
    }

    // get list chart of account
    getChartOfAccounts() {
        this.chartOfAccountService.getAllByDisplayInsert().subscribe((res: any) => {
            this.chartOfAccounts = res;
        });
    }

    // call ledger service to get info of credit or debit
    getChartOfAccountDetails(parentCode, accountCode, type, isInit = false, selectdisplay?: any): any {
        let oldAccountCode = accountCode;
        // custom accountCode
        if (type === this.appConstant.ACCOUNT_TYPE.DEBIT_1 || (isInit && type === this.appConstant.ACCOUNT_TYPE.DEBIT_2)) {
            accountCode = `${parentCode}:${accountCode}`;
        }
        if (type === this.appConstant.ACCOUNT_TYPE.CREDIT_1 || (isInit && type === this.appConstant.ACCOUNT_TYPE.CREDIT_2)) {
            accountCode = `${parentCode}:${accountCode}`;
        }

        this.chartOfAccountService
            .getDetail(accountCode)
            .subscribe((res: any) => {
                switch (type) {
                    case this.appConstant.ACCOUNT_TYPE.DEBIT:
                        this.debits1 = res.data;
                        if (selectdisplay == 'select') {
                            this.selectedDebitPrevious = this.selectedDebit;
                        }
                        this.selectedDebit = this.getCreditDebitObject(oldAccountCode, this.appConstant.ACCOUNT_TYPE.DEBIT) || {};

                        if (res.data.length > 0 && !isInit) {
                            this.onFocus(this.vcDebit1);
                        } else if (res.data.length = 0 && this.selectedDebit.name == 'Ngoại tệ') {
                        } else {
                            this.onFocus(this.vcCredit);
                        }
                        this.checkCreditDebitRef();
                        break;
                    case this.appConstant.ACCOUNT_TYPE.DEBIT_1:
                        this.debits2 = res.data;
                        this.selectedDebit1 = this.getCreditDebitObject(oldAccountCode, this.appConstant.ACCOUNT_TYPE.DEBIT_1) || {};
                        if (res.data.length > 0 && !isInit) {
                            this.onFocus(this.vcDebit2);
                        } else if (!isInit) {
                            this.onFocus(this.vcCredit);
                        }
                        break;
                    case this.appConstant.ACCOUNT_TYPE.DEBIT_2:
                        this.selectedDebit2 = this.getCreditDebitObject(oldAccountCode, this.appConstant.ACCOUNT_TYPE.DEBIT_2) || {};
                        if (!isInit) this.onFocus(this.vcCredit);
                        break;
                    case this.appConstant.ACCOUNT_TYPE.CREDIT:
                        this.credits1 = res.data;
                        this.selectedCredit = this.getCreditDebitObject(oldAccountCode, this.appConstant.ACCOUNT_TYPE.CREDIT) || {};
                        if (!isInit) this.onFocus(this.vcCredit1);
                        this.checkCreditDebitRef();
                        break;
                    case this.appConstant.ACCOUNT_TYPE.CREDIT_1:
                        this.credits2 = res.data;
                        this.selectedCredit1 = this.getCreditDebitObject(oldAccountCode, this.appConstant.ACCOUNT_TYPE.CREDIT_1) || {};
                        if (this.credits2.length > 0 && !isInit) {
                            this.onFocus(this.vcCredit2);
                        }
                        break;
                    case this.appConstant.ACCOUNT_TYPE.CREDIT_2:
                        this.selectedCredit2 = this.getCreditDebitObject(oldAccountCode, this.appConstant.ACCOUNT_TYPE.CREDIT_2) || {};
                        break;
                }
                this.checkedIsForeignCurrency();
                return res.data;
            });
    }

    // event change credit or debit
    onChangeCreditDebit(event, type, selectdisplay?: any) {
        // case all != debit2 && != credit2
        if (event && event.value && type !== this.appConstant.ACCOUNT_TYPE.DEBIT_2 && type !== this.appConstant.ACCOUNT_TYPE.CREDIT_2) {
            this.getChartOfAccountDetails(type.includes('debit') ? this.selectedDebit.code : this.selectedCredit.code, event.value, type, false, selectdisplay);
        }
        // case debit2
        else if (event && event.value && type == this.appConstant.ACCOUNT_TYPE.DEBIT_2) {
            this.selectedDebit2 = this.getCreditDebitObject(
                event.value,
                this.appConstant.ACCOUNT_TYPE.DEBIT_2
            );
            this.onFocus(this.vcCredit);
        }
        // case credit2
        else if (event && event.value && type == this.appConstant.ACCOUNT_TYPE.CREDIT_2) {
            this.selectedCredit2 = this.getCreditDebitObject(
                event.value,
                this.appConstant.ACCOUNT_TYPE.CREDIT_2
            );
        }
        // set default (reset form data)
        else if (!event || !event.value) {
            switch (type) {
                case this.appConstant.ACCOUNT_TYPE.DEBIT:
                    this.setEmptyData('debitCode');
                    this.setEmptyData('debitDetailCodeFirst');
                    this.setEmptyData('debitDetailCodeSecond');
                    this.selectedDebit = {};
                    this.selectedDebit1 = {};
                    this.selectedDebit2 = {};
                    this.debits1 = [];
                    this.debits2 = [];
                    break;
                case this.appConstant.ACCOUNT_TYPE.DEBIT_1:
                    this.setEmptyData('debitDetailCodeFirst');
                    this.setEmptyData('debitDetailCodeSecond');
                    this.selectedDebit1 = {};
                    this.selectedDebit2 = {};
                    this.debits2 = [];
                    break;
                case this.appConstant.ACCOUNT_TYPE.DEBIT_2:
                    this.setEmptyData('debitDetailCodeSecond');
                    this.selectedDebit2 = {};
                    break;
                case this.appConstant.ACCOUNT_TYPE.CREDIT:
                    this.setEmptyData('creditCode');
                    this.setEmptyData('creditDetailCodeFirst');
                    this.setEmptyData('creditDetailCodeSecond');
                    this.selectedCredit = {};
                    this.selectedCredit1 = {};
                    this.selectedCredit2 = {};
                    this.credits1 = [];
                    this.credits2 = [];
                    break;
                case this.appConstant.ACCOUNT_TYPE.CREDIT_1:
                    this.setEmptyData('creditDetailCodeFirst');
                    this.setEmptyData('creditDetailCodeSecond');
                    this.selectedCredit1 = {};
                    this.selectedCredit2 = {};
                    this.credits2 = [];
                    break;
                case this.appConstant.ACCOUNT_TYPE.CREDIT_2:
                    this.setEmptyData('creditDetailCodeSecond');
                    this.selectedCredit2 = {};
                    break;
            }
            this.checkedIsForeignCurrency();
        }
    }

    // set empty data
    setEmptyData(columnName, value?) {
        this.ledgerForm.controls[columnName].setValue(value ? value : '');
    }

    setEmptyDebit() {
        this.setEmptyData('debitCode');
        this.selectedDebit = {};
    }

    setEmptyDebit1() {
        this.setEmptyData('debitDetailCodeFirst');
        this.selectedDebit1 = {};
    }

    setEmptyDebit2() {
        this.setEmptyData('debitDetailCodeSecond');
        this.selectedDebit2 = {};
    }

    setEmptyCredit() {
        this.setEmptyData('creditCode');
        this.selectedCredit = {};
    }

    setEmptyCredit1() {
        this.setEmptyData('creditDetailCodeFirst');
        this.selectedCredit1 = {};
    }

    setEmptyCredit2() {
        this.setEmptyData('creditDetailCodeSecond');
        this.selectedCredit2 = {};
    }

    // reset form of invoice
    onClearInvoice() {
        this.setEmptyData('invoiceSerial');
        this.setEmptyData('invoiceNumber');
        this.ledgerForm.controls['invoiceDate'].setValue(
            moment(new Date()).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE)
        );
        this.setEmptyData('invoiceTaxCode');
        this.setEmptyData('invoiceName');
        this.setEmptyData('invoiceAddress');
        this.setEmptyData('invoiceProductItem');
    }

    // event check exist foreign currency
    checkedIsForeignCurrency() {
        this.isForeignCurrency = (this.selectedDebit1 && this.selectedDebit1.isForeignCurrency === true) ||
            (this.selectedDebit2 && this.selectedDebit2.isForeignCurrency === true) ||
            (this.selectedCredit1 && this.selectedCredit1.isForeignCurrency === true) ||
            (this.selectedCredit2 && this.selectedCredit2.isForeignCurrency === true);
    }

    // get object of credit or debit
    getCreditDebitObject(code, type) {
        switch (type) {
            case this.appConstant.ACCOUNT_TYPE.DEBIT:
            case this.appConstant.ACCOUNT_TYPE.CREDIT:
                return this.chartOfAccounts.find((x) => x.code === code);
            case this.appConstant.ACCOUNT_TYPE.DEBIT_1:
                return this.debits1.find((x) => x.code === code);
            case this.appConstant.ACCOUNT_TYPE.DEBIT_2:
                return this.debits2.find((x) => x.code === code);
            case this.appConstant.ACCOUNT_TYPE.CREDIT_1:
                return this.credits1.find((x) => x.code === code);
            case this.appConstant.ACCOUNT_TYPE.CREDIT_2:
                return this.credits2.find((x) => x.code === code);
        }
    }

    // get list payer
    getPayers() {
        this.payerService.getList().subscribe((res) => {
            this.payers = res.data;
        });
    }

    // get list description
    getDescriptions() {
        this.descriptionService.getList().subscribe((res) => {
            this.descriptions = res.data;
        });
    }

    // get list tax rates
    getTaxRates() {
        this.taxRatesService.getAllTaxRates().subscribe((res: any) => {
            this.taxRates = res.data;
        });
    }

    // save form event
    onSave() {
        this.isSubmitted = true;
        this.isInvalidForm = false;

        let ledger = Object.assign({}, this.ledgerForm.value);
        // check account code valid
        if (
            // check account required
            !this.ledgerForm.value.debitCode || !this.ledgerForm.value.creditCode ||
            (!this.ledgerForm.value.debitDetailCodeFirst && this.debits1.length > 0) ||
            (!this.ledgerForm.value.debitDetailCodeSecond && this.debits2.length > 0) ||
            (!this.ledgerForm.value.creditDetailCodeFirst && this.credits1.length > 0) ||
            (!this.ledgerForm.value.creditDetailCodeSecond && this.credits2.length > 0) ||
            // recheck again exist account type in parent account
            !this.chartOfAccounts.map(x => x.code).includes(this.ledgerForm.value.debitCode) ||
            !this.chartOfAccounts.map(x => x.code).includes(this.ledgerForm.value.creditCode) ||
            (!this.debits1.map(x => x.code).includes(this.ledgerForm.value.debitDetailCodeFirst) && this.debits1.length > 0) ||
            (!this.debits2.map(x => x.code).includes(this.ledgerForm.value.debitDetailCodeSecond) && this.debits2.length > 0) ||
            (!this.credits1.map(x => x.code).includes(this.ledgerForm.value.creditDetailCodeFirst) && this.credits1.length > 0) ||
            (!this.credits2.map(x => x.code).includes(this.ledgerForm.value.creditDetailCodeSecond) && this.credits2.length > 0)
        ) {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(this.translateService, 'info.please_check_again_account'),
            });
            this.isInvalidForm = true;
            this.isSubmitted = false;
            return;
        }

        let newData = this.cleanObject(AppUtil.cleanObject(ledger));
        this.ledgerService.createLedger(newData).subscribe((res) => {
            this.onCancel.emit({});
        });
    }

    // clear data to mapping data of API
    cleanObject(data) {
        let newData = Object.assign({}, data);
        if (!(newData.id > 0)) {
            newData.id = 0;
        }

        if (this.paramToGetLedgers.documentType !== 'PC') {
            newData.referenceVoucherNumber = newData.referenceVoucherNumber || '';
            newData.referenceFullName = newData.referenceFullName || '';
            newData.referenceAddress = newData.referenceAddress || '';
        }

        newData.amount = parseInt(newData.amount) || 0;
        newData.depreciaMonth = parseInt(newData.depreciaMonth) || 0;
        newData.month = parseInt(this.paramToGetLedgers.filterMonth) || 0;
        newData.isInternal = parseInt(this.paramToGetLedgers.transferModelTypeData.value) || 0;
        newData.type = this.paramToGetLedgers.documentType;
        newData.orginalCurrency = newData.orginalCurrency ? parseInt(newData.orginalCurrency) : 0;
        newData.exchangeRate = newData.exchangeRate ? newData.exchangeRate : 0;
        newData.quantity = newData.quantity ? parseInt(newData.quantity) : 0;
        newData.unitPrice = newData.unitPrice ? parseInt(newData.unitPrice) : 0;
        newData.invoiceAdditionalDeclarationCode = newData.invoiceAdditionalDeclarationCode.toString() || '';
        newData.bookDate = this.appUtil.formatLocalTimezone(
            moment(newData.bookDate ? newData.bookDate : new Date(),
                this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
            ).format(this.appConstant.FORMAT_DATE.T_DATE)
        );
        newData.orginalBookDate = this.appUtil.formatLocalTimezone(
            moment(newData.orginalBookDate ? newData.orginalBookDate : new Date(),
                this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
            ).format(this.appConstant.FORMAT_DATE.T_DATE)
        );
        newData.referenceBookDate = this.appUtil.formatLocalTimezone(
            moment(newData.referenceBookDate ? newData.referenceBookDate : new Date(),
                this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
            ).format(this.appConstant.FORMAT_DATE.T_DATE)
        );
        newData.invoiceDate = this.appUtil.formatLocalTimezone(
            moment(newData.invoiceDate ? newData.invoiceDate : new Date(),
                this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
            ).format(this.appConstant.FORMAT_DATE.T_DATE)
        );
        return newData;
    }

    // check and set account calc info
    checkCreditDebitRef() {
        // set diabled projectCode event
        if (!(this.selectedDebit.classification === 6 || this.selectedCredit.classification === 6)) {
            this.setEmptyData('projectCode');
        }
        if (!(this.selectedDebit.classification === 4 || this.selectedDebit.classification === 5)) {
            this.setEmptyData('depreciaMonth', 0);
        }
        if (!this.isForeignCurrency) {
            this.setEmptyData('orginalCurrency', 0);
            this.setEmptyData('exchangeRate', 0);
        }
        if ((this.appUtil.isEmpty(this.selectedDebit) && this.appUtil.isEmpty(this.selectedCredit)) && (!(this.selectedDebit.classification === 3 || this.selectedDebit.classification === 6)) && (!(this.selectedCredit.classification === 3 || this.selectedCredit.classification === 6))) {
            this.setEmptyData('quantity', 0);
            this.setEmptyData('unitPrice', 0);
        }
    }

    // ----------------------- buttons form ----------------------
    // cancel button
    onCancelEvent() {
        let oldData = Object.assign({}, this.ledgerForm.value);
        this.ledgerForm.reset();
        this.ledgerForm.controls['orginalVoucherNumber'].setValue(oldData.orginalVoucherNumber);
        this.ledgerForm.controls['voucherNumber'].setValue(oldData.voucherNumber);
        this.ledgerForm.controls['orginalBookDate'].setValue(oldData.orginalBookDate);
        this.resetDebitCredit();
    }

    // add chartOfAccount button
    onAddChartOfAccount() {
        let oldData = Object.assign({}, this.ledgerForm.value);
        this.ledgerForm.reset();
        this.setOldInfo(oldData);
        this.setOldBill(oldData);
        this.resetDebitCredit();
        this.onFocus(this.vcDebit);
    }

    // add bill button
    onAddBills() {
        let oldData = Object.assign({}, this.ledgerForm.value);
        this.ledgerForm.reset();
        this.setOldInfo(oldData);
        this.resetDebitCredit();
        this.onFocus(this.vcInvoiceCode);
    }

    // skip only account info
    setOldAccount(oldData) {
        this.ledgerForm.controls['orginalVoucherNumber'].setValue(oldData.orginalVoucherNumber);
        this.ledgerForm.controls['voucherNumber'].setValue(oldData.voucherNumber);
        this.ledgerForm.controls['orginalBookDate'].setValue(oldData.orginalBookDate);
    }

    // skip only origin info
    setOldInfo(oldData) {
        this.setOldAccount(oldData);
        this.ledgerForm.controls['orginalCompanyName'].setValue(oldData.orginalCompanyName);
        this.ledgerForm.controls['orginalAddress'].setValue(oldData.orginalAddress);
        this.ledgerForm.controls['orginalDescription'].setValue(oldData.orginalDescription);
        this.ledgerForm.controls['attachVoucher'].setValue(oldData.attachVoucher);
    }

    // skip only bill info
    setOldBill(oldData) {
        this.setOldAccount(oldData);
        this.ledgerForm.controls['invoiceCode'].setValue(oldData.invoiceCode);
        this.ledgerForm.controls['isInternal'].setValue(oldData.isInternal);
        this.ledgerForm.controls['invoiceSerial'].setValue(oldData.invoiceSerial);
        this.ledgerForm.controls['invoiceNumber'].setValue(oldData.invoiceNumber);
        this.ledgerForm.controls['invoiceDate'].setValue(oldData.invoiceDate);
        this.ledgerForm.controls['invoiceTaxCode'].setValue(oldData.invoiceTaxCode);
        this.ledgerForm.controls['invoiceName'].setValue(oldData.invoiceName);
        this.ledgerForm.controls['invoiceAddress'].setValue(oldData.invoiceAddress);
        this.ledgerForm.controls['invoiceProductItem'].setValue(oldData.invoiceProductItem);
    }

    defineTax() {
    }

    // ----------------------- end buttons form ----------------------

    // event waiting debit
    isWaitingDebit() {
        return (this.ledgerForm.value.debitCode && !this.ledgerForm.value.debitDetailCodeFirst && this.debits1.length > 0) ||
            (this.ledgerForm.value.debitCode && !this.ledgerForm.value.debitDetailCodeSecond && this.debits2.length > 0);
    }

    // event reset debit credit
    resetDebitCredit() {
        this.onChangeCreditDebit(false, this.appConstant.ACCOUNT_TYPE.DEBIT);
        this.onChangeCreditDebit(false, this.appConstant.ACCOUNT_TYPE.CREDIT);
    }

    // event filter description
    filterDescriptionName(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.descriptions.length; i++) {
            if (this.descriptions[i].name.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(this.descriptions[i].name);
            }
        }
        this.filteredDescNames = filtered;
    }

    // event filter payer
    filterPayerName(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.payers.length; i++) {
            if (this.payers[i].name.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(this.payers[i].name);
            }
        }
        this.filteredPayerNames = filtered;
    }

    // event filter payer
    onInvoiceNameSelect(event) {
        if (event) {
            this.ledgerForm.controls['invoiceCode'].setValue(event.split('|')[0].trim());
        }
    }

    // event filter invoice code
    filterInvoiceName(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.taxRates.length; i++) {
            if (this.taxRates[i].name.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(
                    `${this.taxRates[i].code} | ${this.taxRates[i].name}`
                );
            }
        }
        this.filteredTaxRates = filtered;
    }

    // event change debit
    onDebitSelect(event, type): any {
        // check is waiting clear
        if (this.isDebitClear) {
            this.isDebitClear = false;
            return;
        }
        if (type === 'clear') {
            this.isDebitClear = true;
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.DEBIT);
            this.checkCreditDebitRef();
            return;
        }
        let debit;
        if (type === 'hide') {
            debit = this.ledgerForm.value.debitCode;
        }
        if (type === 'select') {
            debit = event.toString();
            if (this.selectedDebit.code != this.selectedDebitPrevious.code) {
                this.setEmptyData('debitCode');
                this.setEmptyData('debitDetailCodeFirst');
                this.setEmptyData('debitDetailCodeSecond');
                this.selectedDebit = {};
                this.selectedDebit1 = {};
                this.selectedDebit2 = {};
                this.debits1 = [];
                this.debits2 = [];
            }

        }

        if (debit) {
            debit = debit.toString().split('|')[0].trim();
            this.onChangeCreditDebit({value: debit}, this.appConstant.ACCOUNT_TYPE.DEBIT, type);
            this.ledgerForm.controls['debitCode'].setValue(debit);
        } else {
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.DEBIT);
        }
    }

    // event filter debit
    filterDebitName(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.chartOfAccounts.length; i++) {
            if (this.chartOfAccounts[i].code.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(`${this.chartOfAccounts[i].code} | ${this.chartOfAccounts[i].name} | Thuộc tính ${this.chartOfAccounts[i].classification}`);
            }
        }
        this.filteredDebitNames = filtered;
    }

    // event change debit1
    onDebit1Select(event, type) {
        if (this.isDebit1Clear) {
            this.isDebit1Clear = false;
            return;
        }
        if (type === 'clear') {
            this.isDebit1Clear = true;
            this.onChangeCreditDebit(null, 'debit1');
            return;
        }
        let debit1;
        if (type === 'hide') {
            debit1 = this.ledgerForm.value.debitDetailCodeFirst;
        }
        if (type === 'select') debit1 = event.toString();
        if (debit1) {
            debit1 = debit1.toString().split('|')[0].trim();
            this.ledgerForm.controls['debitDetailCodeFirst'].setValue(debit1);
            this.onChangeCreditDebit({value: debit1}, this.appConstant.ACCOUNT_TYPE.DEBIT_1);
        } else {
            this.onChangeCreditDebit(null, 'debit1');
        }
    }

    // event filter debit1
    filterDebit1Name(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.debits1.length; i++) {
            if (this.debits1[i].code.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(`${this.debits1[i].code} | ${this.debits1[i].name} | Thuộc tính ${this.debits1[i].classification}`);
            }
        }
        this.filteredDebit1Names = filtered;
    }

    // event change debit2
    onDebit2Select(event, type) {
        if (this.isDebit2Clear) {
            this.isDebit2Clear = false;
            return;
        }
        let debit2;
        if (type === 'clear') {
            this.isDebit2Clear = true;
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.DEBIT_2);
            return;
        }
        if (type === 'hide') {
            debit2 = this.ledgerForm.value.debitDetailCodeSecond;
        }
        if (type === 'select') debit2 = event.toString();
        if (debit2) {
            debit2 = debit2.toString().split('|')[0].trim();
            this.ledgerForm.controls['debitDetailCodeSecond'].setValue(debit2);
            this.onChangeCreditDebit({value: debit2}, this.appConstant.ACCOUNT_TYPE.DEBIT_2);
        } else {
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.DEBIT_2);
        }
    }

    // event filter debit2
    filterDebit2Name(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.debits2.length; i++) {
            if (this.debits2[i].code.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(`${this.debits2[i].code} | ${this.debits2[i].name} | Thuộc tính ${this.debits2[i].classification}`);
            }
        }
        this.filteredDebit2Names = filtered;
    }

    // event change credit
    onCreditSelect(event, type) {
        if (this.isCreditClear) {
            this.isCreditClear = false;
            return;
        }
        if (type === 'clear') {
            this.isCreditClear = true;
            this.onChangeCreditDebit(null, 'credit');
            this.checkCreditDebitRef();
            return;
        }
        let credit;
        if (type === 'hide') {
            credit = this.ledgerForm.value.creditCode;
        }
        if (type === 'select') credit = event.toString();
        if (credit) {
            credit = credit.toString().split('|')[0].trim();
            this.ledgerForm.controls['creditCode'].setValue(credit);
            this.onChangeCreditDebit({value: credit}, this.appConstant.ACCOUNT_TYPE.CREDIT);
        } else {
            this.onChangeCreditDebit(null, 'credit');
        }
    }

    // event filter credit
    filterCreditName(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.chartOfAccounts.length; i++) {
            if (this.chartOfAccounts[i].code.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(`${this.chartOfAccounts[i].code} | ${this.chartOfAccounts[i].name} | Thuộc tính ${this.chartOfAccounts[i].classification}`);
            }
        }
        this.filteredCreditNames = filtered;
    }

    // event change credit1
    onCredit1Select(event, type) {
        if (this.isCredit1Clear) {
            this.isCredit1Clear = false;
            return;
        }
        let credit1;
        if (type === 'clear') {
            this.isCredit1Clear = true;
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.CREDIT_1);
            return;
        }
        if (type === 'hide') {
            credit1 = this.ledgerForm.value.creditDetailCodeFirst;
        }
        if (type === 'select') credit1 = event.toString();
        if (credit1) {
            credit1 = credit1.toString().split('|')[0].trim();
            this.ledgerForm.controls['creditDetailCodeFirst'].setValue(credit1);
            this.onChangeCreditDebit({value: credit1}, this.appConstant.ACCOUNT_TYPE.CREDIT_1);
        } else {
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.CREDIT_1);
        }
    }

    // event filter credit1
    filterCredit1Name(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.credits1.length; i++) {
            if (this.credits1[i].code.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(`${this.credits1[i].code} | ${this.credits1[i].name} | Thuộc tính ${this.credits1[i].classification}`);
            }
        }
        this.filteredCredit1Names = filtered;
    }

    // event change credit2
    onCredit2Select(event, type) {
        if (this.isCredit2Clear) {
            this.isCredit2Clear = false;
            return;
        }
        let credit2;
        if (type === 'clear') {
            this.isCredit2Clear = true;
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.CREDIT_2);
            return;
        }
        if (type === 'hide') {
            credit2 = this.ledgerForm.value.creditDetailCodeSecond;
        }
        if (type === 'select') credit2 = event.toString();
        if (credit2) {
            credit2 = credit2.toString().split('|')[0].trim();
            this.ledgerForm.controls['creditDetailCodeSecond'].setValue(credit2);
            this.onChangeCreditDebit({value: credit2}, this.appConstant.ACCOUNT_TYPE.CREDIT_2);
        } else {
            this.onChangeCreditDebit(null, this.appConstant.ACCOUNT_TYPE.CREDIT_2);
        }
    }

    // event change filter credit2
    filterCredit2Name(event) {
        let filtered: any[] = [];
        for (let i = 0; i < this.credits2.length; i++) {
            if (this.credits2[i].code.toLowerCase().includes(event.query.toLowerCase())) {
                filtered.push(`${this.credits2[i].code} | ${this.credits2[i].name} | Thuộc tính ${this.credits2[i].classification}`);
            }
        }
        this.filteredCredit2Names = filtered;
    }

    // Focus event handlers
    onFocus(dataBinding) {
        setTimeout(() => {
            dataBinding.focusInput();
        }, 200);
    }

    invoiceCodeOnPress(event) {
        if (!event.target.value) {
            this.onFocus(this.vcDebit);
        }
    }

    clearValue(formGroup: FormGroup, formControl) {
        formGroup.controls[formControl].setValue(null)
    }

    /** ThaiNX **/

    /**
     * Danh sách chi tiêt tài khoản
     * @param accountCode
     * Mã Tài khoản nợ/có
     * @param accountCodeDetail1
     * Mã chi tiêt 1
     * @param type
     * Loại tài khoản có/nợ/chi tiết 1/chi tiê 2
     */
    async getChartOfAccountDetails_1(accountCode, accountCodeDetail1, type) {
        let parentRef = ''
        switch (type) {
            case this.appConstant.ACCOUNT_TYPE.DEBIT_1:
            case this.appConstant.ACCOUNT_TYPE.CREDIT_1:
                parentRef = accountCode
                break
            case this.appConstant.ACCOUNT_TYPE.DEBIT_2:
            case this.appConstant.ACCOUNT_TYPE.CREDIT_2:
                parentRef = `${accountCode}:${accountCodeDetail1}`
                break
        }
        const responseDetail = await this.chartOfAccountService.getDetail1(parentRef)
        switch (type) {
            case this.appConstant.ACCOUNT_TYPE.DEBIT_1:
                this.debits1 = responseDetail.data || []
                break
            case this.appConstant.ACCOUNT_TYPE.DEBIT_2:
                this.debits2 = responseDetail.data || []
                break
            case this.appConstant.ACCOUNT_TYPE.CREDIT_1:
                this.credits1 = responseDetail.data || []
                break
            case this.appConstant.ACCOUNT_TYPE.CREDIT_2:
                this.credits2 = responseDetail.data || []
                break
        }
    }

    /** Tài khoản nợ **/

    resetDebit() {
        this.selectedDebit = {}
        this.ledgerForm.patchValue({
            debitDetailCodeFirst: {
                value: '',
                label: ''
            },
            debitDetailCodeSecond: {
                value: '',
                label: ''
            }
        })
        this.debits1 = []
        this.debits2 = []
        this.selectedDebit1 = {}
        this.selectedDebit2 = {}
    }

    resetDebit1() {
        this.selectedDebit1 = {}
        this.ledgerForm.patchValue({
            debitDetailCodeSecond: {
                value: '',
                label: ''
            }
        })
        this.debits2 = []
        this.selectedDebit2 = {}
    }

    resetDebit2() {
        this.selectedDebit2 = {}
    }

    filterDebitName1(event) {
        const debitCode = this.ledgerForm.value.debitCode
        if (event?.isTrusted || event.query !== debitCode?.value) {
            this.resetDebit()
        }
        this.filteredDebitNames = this.chartOfAccounts?.reduce((arr, curr) => {
            if (curr.code?.toLowerCase()?.includes(event.query?.toLowerCase()) || event?.isTrusted)
                arr.push({
                    value: curr.code,
                    label: `${curr.code} | ${curr.name} | Thuộc tính ${curr.classification}`
                })
            return arr
        }, []) || []
    }

    async onDebitSelect1(event) {
        this.ledgerForm.patchValue({
            debitDetailCodeFirst: {
                value: '',
                label: ''
            },
            debitDetailCodeSecond: {
                value: '',
                label: ''
            }
        })
        const debitCode = this.ledgerForm.value.debitCode?.value
        this.selectedDebit = this.chartOfAccounts?.find(acc => acc.code === debitCode) || {}
        await this.getChartOfAccountDetails_1(debitCode, '', this.appConstant.ACCOUNT_TYPE.DEBIT_1)
        if (this.debits1?.length)
            this.onFocus(this.vcDebit1)
        else
            this.onFocus(this.vcCredit)
    }

    filterDebit1Name1(event) {
        const debit1Code = this.ledgerForm.value.debitDetailCodeFirst
        if (event?.isTrusted || event.query !== debit1Code?.value)
            this.resetDebit1()
        this.filteredDebit1Names = this.debits1?.reduce((arr, curr) => {
            if (curr.code?.toLowerCase()?.includes(event.query?.toLowerCase()) || event?.isTrusted)
                arr.push({
                    value: curr.code,
                    label: `${curr.code} | ${curr.name} | Thuộc tính ${curr.classification}`
                })
            return arr
        }, []) || []
    }

    async onDebit1Select1(event) {
        this.ledgerForm.patchValue({
            debitDetailCodeSecond: {
                value: '',
                label: ''
            }
        })
        const debit1Code = this.ledgerForm.value.debitDetailCodeFirst?.value
        this.selectedDebit1 = this.debits1?.find(acc => acc.code === debit1Code)
        await this.getChartOfAccountDetails_1(this.ledgerForm.value.debitCode?.value, debit1Code, this.appConstant.ACCOUNT_TYPE.DEBIT_2)
        if (this.debits2?.length)
            this.onFocus(this.vcDebit2)
        else
            this.onFocus(this.vcCredit)
    }

    filterDebit2Name1(event) {
        const debit2Code = this.ledgerForm.value.debitDetailCodeSecond
        if (event?.isTrusted || event.query !== debit2Code?.value) {
            this.resetDebit2()
        }
        this.filteredDebit2Names = this.debits2?.reduce((arr, curr) => {
            if (curr.code?.toLowerCase()?.includes(event.query?.toLowerCase()) || event?.isTrusted)
                arr.push({
                    value: curr.code,
                    label: `${curr.code} | ${curr.name} | Thuộc tính ${curr.classification}`
                })
            return arr
        }, []) || []
    }

    async onDebit2Select1(event) {
        const debit2Code = this.ledgerForm.value.debitDetailCodeSecond?.value
        this.selectedDebit2 = this.debits2?.find(acc => acc.code === debit2Code)
        this.onFocus(this.vcCredit)
    }

    /** Tài khoản có **/

    resetCredit() {
        this.selectedCredit = {}
        this.ledgerForm.patchValue({
            creditDetailCodeFirst: {
                value: '',
                label: ''
            },
            creditDetailCodeSecond: {
                value: '',
                label: ''
            }
        })
        this.credits1 = []
        this.credits2 = []
        this.selectedCredit1 = {}
        this.selectedCredit2 = {}
    }

    resetCredit1() {
        this.selectedCredit1 = {}
        this.ledgerForm.patchValue({
            creditDetailCodeSecond: {
                value: '',
                label: ''
            }
        })
        this.credits2 = []
        this.selectedCredit2 = {}
    }

    resetCredit2() {
        this.selectedCredit2 = {}
    }

    filterCreditName1(event) {
        const creditCode = this.ledgerForm.value.creditCode
        if (event?.isTrusted || event.query !== creditCode?.value) {
            this.resetCredit()
        }
        this.filteredCreditNames = this.chartOfAccounts?.reduce((arr, curr) => {
            if (curr.code?.toLowerCase()?.includes(event.query?.toLowerCase()) || event?.isTrusted)
                arr.push({
                    value: curr.code,
                    label: `${curr.code} | ${curr.name} | Thuộc tính ${curr.classification}`
                })
            return arr
        }, []) || []
    }

    async onCreditSelect1(event) {
        this.ledgerForm.patchValue({
            creditDetailCodeFirst: {
                value: '',
                label: ''
            },
            creditDetailCodeSecond: {
                value: '',
                label: ''
            },
        })
        const creditCode = this.ledgerForm.value.creditCode?.value
        this.selectedCredit = this.chartOfAccounts?.find(acc => acc.code === creditCode) || {}
        await this.getChartOfAccountDetails_1(creditCode, '', this.appConstant.ACCOUNT_TYPE.CREDIT_1)
        if (this.credits1?.length)
            this.onFocus(this.vcCredit1)
    }

    filterCredit1Name1(event) {
        const credit1Code = this.ledgerForm.value.creditDetailCodeFirst
        if (event?.isTrusted || event.query !== credit1Code?.value) {
            this.resetCredit1()
        }
        this.filteredCredit1Names = this.credits1?.reduce((arr, curr) => {
            if (curr.code?.toLowerCase()?.includes(event.query?.toLowerCase()) || event?.isTrusted)
                arr.push({
                    value: curr.code,
                    label: `${curr.code} | ${curr.name} | Thuộc tính ${curr.classification}`
                })
            return arr
        }, []) || []
    }

    async onCredit1Select1(event) {
        this.ledgerForm.patchValue({
            creditDetailCodeSecond: {
                value: '',
                label: ''
            },
        })
        const credit1Code = this.ledgerForm.value.creditDetailCodeFirst?.value
        this.selectedCredit1 = this.credits1?.find(acc => acc.code === credit1Code)
        await this.getChartOfAccountDetails_1(this.ledgerForm.value.creditCode?.value, credit1Code, this.appConstant.ACCOUNT_TYPE.CREDIT_2)
        if (this.credits2?.length)
            this.onFocus(this.vcCredit2)
    }

    filterCredit2Name1(event) {
        const credit2Code = this.ledgerForm.value.creditDetailCodeSecond
        if (event?.isTrusted || event.query !== credit2Code?.value) {
            this.resetCredit2()
        }
        this.filteredCredit2Names = this.credits2?.reduce((arr, curr) => {
            if (curr.code?.toLowerCase()?.includes(event.query.toLowerCase()) || event?.isTrusted)
                arr.push({
                    value: curr.code,
                    label: `${curr.code} | ${curr.name} | Thuộc tính ${curr.classification}`
                })
            return arr
        }, []) || []
    }

    async onCredit2Select1(event) {
        const credit2Code = this.ledgerForm.value.creditDetailCodeSecond?.value
        this.selectedCredit2 = this.credits2?.find(acc => acc.code === credit2Code)
    }
}
