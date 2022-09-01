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
import { UserService } from 'src/app/service/user.service';
import { DistrictService } from 'src/app/service/district.service';
import { WardService } from 'src/app/service/ward.service';
import { Branch } from 'src/app/models/branch.model';
import * as moment from 'moment';
import { Major } from 'src/app/models/major.model';
import { Store } from 'src/app/models/store.model';
import { PositionDetail } from 'src/app/models/position-detail.model';
import { Target } from 'src/app/models/target.model';
import { ContractType } from 'src/app/models/contract-type.model';
import { environment } from 'src/environments/environment';
import { CustomerService } from 'src/app/service/customer.service';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { ChartOfAccount } from 'src/app/models/case.model';
import { TypeData } from 'src/app/models/common.model';
import { CustomerTaxService } from 'src/app/service/customer-tax.service';
import { CustomerTax } from 'src/app/models/customer-tax.model';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
    selector: 'app-customers-form',
    templateUrl: './customers-form.component.html',
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
export class CustomersFormComponent implements OnInit, OnChanges {
    public appConstant = AppConstant;
    public appUtil = AppUtil;
    @Input('formData') formData: any = {};
    @Input('formCustomerTaxData') formCustomerTaxData: any = {};
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
    customerForm: FormGroup = new FormGroup({});

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
        private userService: UserService,
        private readonly districtService: DistrictService,
        private readonly wardService: WardService,
        private readonly customerService: CustomerService,
        private chartOfAccountService: ChartOfAccountService,
        private readonly customerTaxService: CustomerTaxService
    ) {
        this.customerForm = this.fb.group({
            id: [''],
            code: ['', [Validators.required]],
            name: ['', [Validators.required]],
            avatar: [''],
            birthday: [''],
            gender: [''],
            phone: [''],
            provinceId: [''],
            districtId: [''],
            wardId: [''],
            email: ['', [Validators.required]],
            sendEmail: [''],
            facebook: [''],
            address: [''],
            identityCardNo: [''],
            identityCardIssueDate: [''],
            identityCardIssuePlace: [''],
            identityCardValidUntil: [''],
            identityCardProvinceId: [''],
            identityCardDistrictId: [''],
            identityCardWardId: [''],
            identityCardPlaceOfPermanent: [''],
            identityCardAddressInCard: [''],
            userCreated: [''],
            userUpdated: [''],
            password: [''],
            debitCode: [''],
            debitDetailCodeFirst: [''],
            debitDetailCodeSecond: [''],
            customerClassficationId: [''],

            taxId: [''],
            customerId: [''],
            companyNameTax: [''],
            addressTax: [''],
            taxCode: [''],
            accountNumberTax: [''],
            bankTax: [''],
            phoneTax: [''],
            accountantTax: [''],
            positionTax: [''],
            phoneOfAccountantTax: [''],
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.isEdit &&
            !this.appUtil.isEmpty(this.formData) &&
            !this.appUtil.isEmpty(this.formCustomerTaxData) &&
            Object.keys(this.formData).length > 0
        ) {
            console.log(this.formCustomerTaxData);
            this.customerForm.setValue({
                id: this.formData.id,
                code: this.formData.code,
                name: this.formData.name,
                avatar: this.formData.avatar,
                birthday: moment(this.formData.birthday).format(
                    this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
                ),
                gender: this.formData.gender.toString(),
                phone: this.formData.phone,
                provinceId: this.formData.provinceId,
                districtId: this.formData.districtId,
                wardId: this.formData.wardId,
                email: this.formData.email,
                sendEmail: this.formData.sendEmail,
                facebook: this.formData.facebook,
                address: this.formData.address,
                identityCardNo: this.formData.identityCardNo,
                identityCardIssueDate: moment(
                    this.formData.identityCardIssueDate
                ).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE),
                identityCardIssuePlace: this.formData.identityCardIssuePlace,

                identityCardValidUntil: moment(
                    this.formData.identityCardValidUntil
                ).format(this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE),
                identityCardProvinceId: this.formData.identityCardProvinceId,
                identityCardDistrictId: this.formData.identityCardDistrictId,

                identityCardWardId: this.formData.identityCardWardId,

                identityCardPlaceOfPermanent:
                    this.formData.identityCardPlaceOfPermanent,
                identityCardAddressInCard:
                    this.formData.identityCardAddressInCard,
                userCreated: this.formData.userCreated,
                userUpdated: this.formData.userUpdated,
                password: this.formData.password,
                debitCode: this.formData.debitCode,
                debitDetailCodeFirst: this.formData.debitDetailCodeFirst,
                debitDetailCodeSecond: this.formData.debitDetailCodeSecond,
                customerClassficationId: this.formData.customerClassficationId,

                taxId: this.formCustomerTaxData.id,
                customerId: this.formCustomerTaxData.customerId,

                companyNameTax: this.formCustomerTaxData.companyName,
                addressTax: this.formCustomerTaxData.address,
                taxCode: this.formCustomerTaxData.taxCode,
                accountNumberTax: this.formCustomerTaxData.accountNumber,
                bankTax: this.formCustomerTaxData.bank,
                phoneTax: this.formCustomerTaxData.phone,

                accountantTax: this.formCustomerTaxData.accountant,
                positionTax: this.formCustomerTaxData.position,
                phoneOfAccountantTax:
                    this.formCustomerTaxData.phoneOfAccountant,
            });
            if (this.formData.provinceId > 0) {
                this.getDistrict({
                    value: this.formData.provinceId,
                });
            }
            if (this.formData.identityCardProvinceId > 0) {
                this.getNativeDistrict({
                    value: this.formData.identityCardProvinceId,
                });
            }
        }
    }

    onReset() {
        this.isInvalidForm = false;
        this.customerForm.reset();
    }

    ngOnInit() {
        this.countryCodes = AppUtil.getCountries();
        this.types = this.appUtil.getUserTypes();
        this.getChartOfAccounts();
    }

    checkValidValidator(fieldName: string) {
        return ((this.customerForm.controls[fieldName].dirty ||
            this.customerForm.controls[fieldName].touched) &&
            this.customerForm.controls[fieldName].invalid) ||
            (this.isInvalidForm &&
                this.customerForm.controls[fieldName].invalid)
            ? 'ng-invalid ng-dirty'
            : '';
    }

    checkValidMultiValidator(fieldNames: string[]) {
        for (let i = 0; i < fieldNames.length; i++) {
            if (
                ((this.customerForm.controls[fieldNames[i]].dirty ||
                    this.customerForm.controls[fieldNames[i]].touched) &&
                    this.customerForm.controls[fieldNames[i]].invalid) ||
                (this.isInvalidForm &&
                    this.customerForm.controls[fieldNames[i]].invalid)
            ) {
                return true;
            }
        }
        return false;
    }

    onSubmit() {
        console.log(this.customerForm);
        this.isSubmitted = true;
        this.isInvalidForm = false;
        if (this.customerForm.invalid) {
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
            AppUtil.cleanObject(this.customerForm.value)
        );
        console.log(newData);
        if (this.isEdit) {
            this.customerService
                .updateCustomer(newData, this.formData.id)
                .subscribe(() => {
                    let taxInfo: CustomerTax = {
                        id: newData.taxId,
                        customerId: newData.customerId,
                        companyName: newData.companyNameTax,
                        address: newData.addressTax,
                        taxCode: newData.taxCode,
                        accountNumber: newData.accountNumberTax,
                        bank: newData.bankTax,
                        phone: newData.phoneTax,
                        accountant: newData.accountantTax,
                        position: newData.positionTax,
                        phoneOfAccountant: newData.phoneOfAccountantTax,
                    };
                    this.customerTaxService
                        .updateCustomerTax(taxInfo, taxInfo.id)
                        .subscribe(() => {
                            this.onCancel.emit({});
                        });
                });
        } else {
            this.customerService
                .createCustomer(newData)
                .subscribe((res: any) => {
                    let taxInfo: CustomerTax = {
                        id: 0,
                        customerId: res.data.id,
                        companyName: newData.companyNameTax,
                        address: newData.addressTax,
                        taxCode: newData.taxCode,
                        accountNumber: newData.accountNumberTax,
                        bank: newData.bankTax,
                        phone: newData.phoneTax,
                        accountant: newData.accountantTax,
                        position: newData.positionTax,
                        phoneOfAccountant: newData.phoneOfAccountantTax,
                    };
                    this.customerTaxService
                        .createCustomerTax(taxInfo)
                        .subscribe(() => {
                            this.onCancel.emit({});
                        });
                });
        }
    }

    cleanObject(data) {
        let newData = Object.assign({}, data);
        if (!(newData.id > 0)) {
            newData.id = 0;
        }
        newData.districtId = parseInt(newData.districtId) || 0;
        newData.provinceId = parseInt(newData.provinceId) || 0;
        newData.wardId = parseInt(newData.wardId) || 0;
        newData.avatar = newData.avatar || '';
        newData.gender = newData.gender === 'true';
        newData.identityCardProvinceId =
            parseInt(newData.identityCardProvinceId) || 0;
        newData.identityCardDistrictId =
            parseInt(newData.identityCardDistrictId) || 0;
        newData.identityCardWardId = parseInt(newData.identityCardWardId) || 0;

        newData.userCreated = parseInt(newData.userCreated) || 0;
        newData.userUpdated = parseInt(newData.userUpdated) || 0;
        newData.customerClassficationId =
            parseInt(newData.customerClassficationId) || 0;
        newData.birthday = this.appUtil.formatLocalTimezone(
            moment(
                (newData.birthday && newData.birthday !== 'Invalid date') ? newData.birthday : new Date(),
                this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
            ).format(this.appConstant.FORMAT_DATE.T_DATE)
        );
        newData.identityCardIssueDate = this.appUtil.formatLocalTimezone(
            moment(
                (newData.identityCardIssueDate && newData.identityCardIssueDate !== 'Invalid date') ? newData.identityCardIssueDate : new Date(),
                this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
            ).format(this.appConstant.FORMAT_DATE.T_DATE)
        );
        newData.identityCardValidUntil = this.appUtil.formatLocalTimezone(
            moment(
                (newData.identityCardValidUntil && newData.identityCardValidUntil !== 'Invalid date') ? newData.identityCardValidUntil : new Date(),
                this.appConstant.FORMAT_DATE.VN_DATE_PIPE_SHORT_DATE
            ).format(this.appConstant.FORMAT_DATE.T_DATE)
        );
        return newData;
    }

    getDayOfWeek(date: any) {
        return new Date(date.year, date.month, date.day).getDay();
    }

    getDistrict(id) {
        this.districts = [];
        this.wards = [];
        if (id.value > 0) {
            this.districtService
                .getDistrictForProvince(id.value)
                .subscribe((response: District[]) => {
                    this.districts = response;
                    if (
                        this.districts !== undefined &&
                        this.districts.length > 0
                    ) {
                        this.getWard({
                            value: this.customerForm.value.districtId,
                        });
                    }
                });
        }
    }
    getNativeDistrict(id) {
        this.nativeDistricts = [];
        this.nativeWards = [];
        if (id.value > 0) {
            this.districtService
                .getDistrictForProvince(id.value)
                .subscribe((response: District[]) => {
                    this.nativeDistricts = response;
                    if (
                        this.nativeDistricts !== undefined &&
                        this.nativeDistricts.length > 0
                    ) {
                        this.getNativeWard({
                            value: this.customerForm.value.identityCardDistrictId,
                        });
                    }
                });
        }
    }
    getWard(id) {
        this.wards = [];
        if (id.value > 0) {
            this.wardService
                .getWardForDistrict(id.value)
                .subscribe((response: Ward[]) => {
                    this.wards = response;
                });
        }
    }

    getNativeWard(id) {
        this.nativeWards = [];
        if (id.value > 0) {
            this.wardService
                .getWardForDistrict(id.value)
                .subscribe((response: Ward[]) => {
                    this.nativeWards = response;
                });
        }
    }

    getChartOfAccounts() {
        this.chartOfAccountService.getAllCustomer().subscribe((res: any) => {
            this.chartOfAccounts = res.data;
        });
    }

    getChartOfAccountDetails(accountCode, type): any {
        let oldAccountCode = accountCode;
        // custom accountCode
        if (type === 'debit1') {
            accountCode = `${this.selectedDebit.code}:${accountCode}`;
        }

        this.chartOfAccountService
            .getDetail(accountCode)
            .subscribe((res: any) => {
                console.log(res.data);
                switch (type) {
                    case 'debit':
                        this.debits1 = res.data;
                        this.selectedDebit = this.getCreditDebitObject(
                            oldAccountCode,
                            'debit'
                        );
                        this.onFocus(this.vcDebit1);
                        break;
                    case 'debit1':
                        this.debits2 = res.data;
                        this.selectedDebit1 = this.getCreditDebitObject(
                            oldAccountCode,
                            'debit1'
                        );
                        this.onFocus(this.vcDebit2);
                        break;
                    case 'debit2':
                        this.selectedDebit2 = this.getCreditDebitObject(
                            oldAccountCode,
                            'debit2'
                        );
                        break;
                }
                return res.data;
            });
    }

    onFocus(dataBinding) {
        setTimeout(() => {
            dataBinding.focusInput();
        }, 200);
    }

    getCreditDebitObject(code, type) {
        switch (type) {
            case 'debit':
                return this.chartOfAccounts.find((x) => x.code === code);
            case 'debit1':
                return this.debits1.find((x) => x.code === code);
            case 'debit2':
                return this.debits2.find((x) => x.code === code);
        }
    }

    doAttachFile(event: any): void {
        let image: FormData = new FormData();
        image.append('file', event.target?.files[0]);
        this.userService.uploadFiles(image).subscribe((res) => {
            if (res && res.body) {
                this.customerForm.controls['avatar'].setValue(
                    res.body.imageUrl
                );
            }
        });
    }

    onDebitSelect(event) {
        if (event.includes('|')) {
            this.customerForm.controls['debitCode'].setValue(
                event.split('|')[0].trim()
            );
             this.onChangeCreditDebit(
                 { value: event.split('|')[0].trim() },
                 'debit'
             );
        }
    }

    filterDebitName(event) {
        let filtered: any[] = [];
        let query = event.query;
        for (let i = 0; i < this.chartOfAccounts.length; i++) {
            if (
                this.chartOfAccounts[i].code
                    .toLowerCase()
                    .includes(query.toLowerCase())
            ) {
                filtered.push(
                    `${this.chartOfAccounts[i].code} | ${this.chartOfAccounts[i].name} | Thuộc tính ${this.chartOfAccounts[i].classification}`
                );
            }
        }
        this.filteredDebitNames = filtered;
    }

    onDebit1Select(event) {
        if (event.includes('|')) {
            this.customerForm.controls['debitDetailCodeFirst'].setValue(
                event.split('|')[0].trim()
            );
            this.onChangeCreditDebit(
                { value: event.split('|')[0].trim() },
                'debit1'
            );
        }
    }

    filterDebit1Name(event) {
        let filtered: any[] = [];
        let query = event.query;
        for (let i = 0; i < this.debits1.length; i++) {
            if (
                this.debits1[i].code.toLowerCase().includes(query.toLowerCase())
            ) {
                filtered.push(
                    `${this.debits1[i].code} | ${this.debits1[i].name} | Thuộc tính ${this.debits1[i].classification}`
                );
            }
        }
        this.filteredDebit1Names = filtered;
    }

    onDebit2Select(event) {
        if (event.includes('|')) {
            this.customerForm.controls['debitDetailCodeSecond'].setValue(
                event.split('|')[0].trim()
            );
            this.onChangeCreditDebit(
                { value: event.split('|')[0].trim() },
                'debit2'
            );
        }
    }

    filterDebit2Name(event) {
        let filtered: any[] = [];
        let query = event.query;
        for (let i = 0; i < this.debits2.length; i++) {
            if (
                this.debits2[i].code.toLowerCase().includes(query.toLowerCase())
            ) {
                filtered.push(
                    `${this.debits2[i].code} | ${this.debits2[i].name} | Thuộc tính ${this.debits2[i].classification}`
                );
            }
        }
        this.filteredDebit2Names = filtered;
    }

    onChangeCreditDebit(event, type) {
        // case all != debit2 && != credit2
        if (event && event.value && type !== 'debit2' && type !== 'credit2') {
            this.getChartOfAccountDetails(event.value, type);
        }
        // case debit2
        else if (event && event.value && type == 'debit2') {
            this.selectedDebit2 = this.getCreditDebitObject(
                event.value,
                'debit2'
            );
        }
        // set default (reset form data)
        else if (!event || !event.value) {
            switch (type) {
                case 'debit':
                    this.setEmptyData('debitCode');
                    this.setEmptyData('debitDetailCodeFirst');
                    this.setEmptyData('debitDetailCodeSecond');
                    this.selectedDebit = {};
                    this.selectedDebit1 = {};
                    this.selectedDebit2 = {};
                    this.debits1 = [];
                    this.debits2 = [];
                    break;
                case 'debit1':
                    this.setEmptyData('debitDetailCodeFirst');
                    this.setEmptyData('debitDetailCodeSecond');
                    this.selectedDebit1 = {};
                    this.selectedDebit2 = {};
                    this.debits2 = [];
                    break;
                case 'debit2':
                    this.setEmptyData('debitDetailCodeSecond');
                    this.selectedDebit2 = {};
                    break;
            }
        }
    }

    setEmptyData(columnName) {
        this.customerForm.controls[columnName].setValue('');
    }
}
