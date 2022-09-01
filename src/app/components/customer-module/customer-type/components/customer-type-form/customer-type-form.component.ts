import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import AppConstant from 'src/app/utilities/app-constants';
import AppData from 'src/app/utilities/app-data';
import AppUtil from 'src/app/utilities/app-util';
import { Province } from 'src/app/models/province.model';
import { District } from 'src/app/models/district.model';
import { Ward } from 'src/app/models/ward.model';
import { Branch } from 'src/app/models/branch.model';
import * as moment from 'moment';
import { Major } from 'src/app/models/major.model';
import { Store } from 'src/app/models/store.model';
import { PositionDetail } from 'src/app/models/position-detail.model';
import { Target } from 'src/app/models/target.model';
import { ContractType } from 'src/app/models/contract-type.model';
import { environment } from 'src/environments/environment';
import { CustomerService } from 'src/app/service/customer.service';
import { ChartOfAccount } from 'src/app/models/case.model';
import { TypeData } from 'src/app/models/common.model';
import { AutoComplete } from 'primeng/autocomplete';
import { CustomerClassificationService } from 'src/app/service/customer-classification.service';

@Component({
    selector: 'app-customer-type-form',
    templateUrl: './customer-type-form.component.html',
    styles: [
        `
            :host ::ng-deep {
                .p-dropdown.p-dropdown-clearable .p-dropdown-label {
                    min-height: 37px;
                }

                .p-dropdown {
                    min-height: 39px;
                }
            }
        `,
    ],
})
export class CustomerTypeFormComponent implements OnInit, OnChanges {
    public appConstant = AppConstant;
    public appUtil = AppUtil;
    @Input('formData') formData: any = {};
    @Input('provinces') provinces: Province[] = [];
    @Input('nativeProvinces') nativeProvinces: Province[] = [];
    @Input('branches')
    branches: Branch[] = [];
    @Input('majors') majors: Major[] = [];
    @Input('warehouses') warehouses: Store[] = [];
    @Input('positionDetails') positionDetails: PositionDetail[] = [];
    @Input('targets') targets: Target[] = [];
    @Input('symbols') symbols: Symbol[] = [];
    @Input('contractTypes') contractTypes: ContractType[] = [];
    @Input('roles')
    roles: any[] = [];
    @Input('isReset') isReset: boolean = false;
    @Input('isEdit') isEdit: boolean = false;
    @Input('display') display: boolean = false;
    @Output() onCancel = new EventEmitter();

    serverURLImage = environment.serverURLImage;

    optionCountries = AppData.COUNTRIES;
    title: string = '';

    districts: District[] = [];
    wards: Ward[] = [];
    nativeDistricts: District[] = [];
    nativeWards: Ward[] = [];
    customerType: FormGroup = new FormGroup({});

    countryCodes: any[] = [];

    isSubmitted = false;
    isInvalidForm = false;

    debitDetailCodeFirstOption: TypeData<ChartOfAccount>[] = [];
    debitDetailCodeSecondOption: any[] = [];

    chartOfAccounts: any[] = [];
    filteredDebitNames: any[] = [];
    debits1: any[] = [];
    filteredDebit1Names: any[] = [];
    debits2: any[] = [];
    filteredDebit2Names: any[] = [];

    selectedDebit: any = {};
    selectedDebit1: any = {};
    selectedDebit2: any = {};

    @ViewChild('debit') public vcDebit: AutoComplete;
    @ViewChild('debit1') vcDebit1: AutoComplete;
    @ViewChild('debit2') vcDebit2: AutoComplete;

    types: any = {};

    constructor(
        private fb: FormBuilder,
        private translateService: TranslateService,
        private messageService: MessageService,
        private readonly customerService: CustomerService,
        private readonly customerClassificationService: CustomerClassificationService
    ) {
        this.customerType = this.fb.group({
            id: [''],
            userCreated: [''],
            userUpdated: [''],
            name: ['', [Validators.required]],
            purchase: ['', [Validators.required]],
            status: [''],
            color: ['', [Validators.required]],
            note: ['']
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.isEdit &&
            !this.appUtil.isEmpty(this.formData) &&
            Object.keys(this.formData).length > 0
        ) {
            console.log('customerTypeForm', this.customerType)
            console.log('formData', this.formData)
            this.customerType.setValue({
                id: this.formData.id,
                userCreated: this.formData.userCreated,
                userUpdated: this.formData.userUpdated,
                name: this.formData.name,
                purchase: this.formData.purchase,
                status: this.formData.status,
                color: this.formData.color,
                note: this.formData.note
            });
        }
    }

    onReset() {
        this.isInvalidForm = false;
        this.customerType.reset();
    }

    ngOnInit() {
        console.log('init: ', this.formData)
        this.countryCodes = AppUtil.getCountries();
        this.types = this.appUtil.getUserTypes();
    }

    checkValidValidator(fieldName: string) {
        return ((this.customerType.controls[fieldName].dirty ||
            this.customerType.controls[fieldName].touched) &&
            this.customerType.controls[fieldName].invalid) ||
            (this.isInvalidForm &&
                this.customerType.controls[fieldName].invalid)
            ? 'ng-invalid ng-dirty'
            : '';
    }

    checkValidMultiValidator(fieldNames: string[]) {
        for (let i = 0; i < fieldNames.length; i++) {
            if (
                ((this.customerType.controls[fieldNames[i]].dirty ||
                    this.customerType.controls[fieldNames[i]].touched) &&
                    this.customerType.controls[fieldNames[i]].invalid) ||
                (this.isInvalidForm &&
                    this.customerType.controls[fieldNames[i]].invalid)
            ) {
                return true;
            }
        }
        return false;
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isInvalidForm = false;
        if (this.customerType.invalid) {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(
                    this.translateService,
                    'info.please_check_again'
                ),
            });
            this.isInvalidForm = true;
            this.isSubmitted = false;
            return;
        }

        let newData = this.cleanObject(
            AppUtil.cleanObject(this.customerType)
        );
        if (this.isEdit) {
            this.customerClassificationService.updateCustomerClassification(newData.value, this.formData.id)
                .subscribe(() => {
                    this.onCancel.emit({});
                });
        } else {
            this.customerClassificationService.createCustomerClassification(newData)
                .subscribe(() => {
                    this.onCancel.emit({});
                });
        }
    }

    cleanObject(data) {
        let newData = Object.assign({}, data);
        if (!(newData.id > 0)) {
            newData.id = 0;
        }

        // newData.createAt = this.appUtil.formatLocalTimezone(
        //     moment(
        //         (newData.createAt && newData.createAt !== 'Invalid date') ? newData.createAt : new Date(),
        //         this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
        //     ).format(this.appConstant.FORMAT_DATE.T_DATE)
        // );
        // newData.deleteAt = this.appUtil.formatLocalTimezone(
        //     moment(
        //         (newData.deleteAt && newData.deleteAt !== 'Invalid date') ? newData.deleteAt : new Date(),
        //         this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
        //     ).format(this.appConstant.FORMAT_DATE.T_DATE)
        // );
        // newData.updateAt = this.appUtil.formatLocalTimezone(
        //     moment(
        //         (newData.updateAt && newData.updateAt !== 'Invalid date') ? newData.updateAt : new Date(),
        //         this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
        //     ).format(this.appConstant.FORMAT_DATE.T_DATE)
        // );
        newData.userCreated = parseInt(newData.userCreated) || 0;
        newData.userUpdated = parseInt(newData.userUpdated) || 0;
        newData.purchase = parseInt(newData.purchase) || 0;
        newData.status = newData.status === 'true';
        return newData;
    }

    getDayOfWeek(date: any) {
        return new Date(date.year, date.month, date.day).getDay();
    }

    onFocus(dataBinding) {
        setTimeout(() => {
            dataBinding.focusInput();
        }, 200);
    }

    setEmptyData(columnName) {
        this.customerType.controls[columnName].setValue('');
    }
}
