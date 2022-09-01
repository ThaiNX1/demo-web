import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { TaxRatesService } from 'src/app/service/tax-rates.service';
@Component({
    selector: 'app-bills-form',
    templateUrl: './bills-form.component.html',
    styles: [
        `
            :host ::ng-deep {
            }
        `,
    ],
})
export class BillsFormComponent implements OnInit, OnChanges {
    public appConstant = AppConstant;
    public appUtil = AppUtil;

    @Input('formData') formData: any = {};
    @Input('isEdit') isEdit: boolean = false;
    @Input('display') display: boolean = false;
    @Output() onCancel = new EventEmitter();
    title: string = '';

    billsForm: FormGroup = new FormGroup({});

    isSubmitted = false;
    isInvalidForm = false;
    existCode: boolean = false;

    chartOfAccounts: any[];

    types: any = {};

    constructor(
        private fb: FormBuilder,
        private translateService: TranslateService,
        private messageService: MessageService,
        private chartOfAccountService: ChartOfAccountService,
        private taxRatesService: TaxRatesService,
    ) {
        this.billsForm = this.fb.group({
            id: [''],
            code: ['', [Validators.required]],
            name: ['', [Validators.required]],
            percent: ['', [Validators.required]],
            description: [''],
            type: ['', [Validators.required]],
            order: ['', [Validators.required]],
            debitCode: [''],
            debitCodeName: [''],
            creditCode: [''],
            creditCodeName: [''],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.isEdit &&
            this.formData &&
            Object.keys(this.formData).length > 0
        ) {
            this.billsForm.setValue({
                id: this.formData.id,
                code: this.formData.code,
                name: this.formData.name,
                percent: this.formData.percent,
                description: this.formData.description,
                type: this.formData.type,
                order: this.formData.order,
                debitCode: this.formData.debitCode,
                debitCodeName: this.formData.debitCodeName,
                creditCode: this.formData.creditCode,
                creditCodeName: this.formData.creditCodeName
            });
        }
    }

    onReset() {
        this.isInvalidForm = false;
        this.billsForm.reset();
    }

    ngOnInit() {
        this.types = this.appUtil.getBillsTypes();
        this.getAllByDisplayInsert();
    }

    getAllByDisplayInsert() {
        this.chartOfAccountService.getAllByDisplayInsert().subscribe((res: any) => {
            this.chartOfAccounts = res;
        });
    }

    checkValidValidator(fieldName: string) {
        return ((this.billsForm.controls[fieldName].dirty ||
            this.billsForm.controls[fieldName].touched) &&
            this.billsForm.controls[fieldName].invalid) ||
            (this.isInvalidForm &&
                this.billsForm.controls[fieldName].invalid) ||
            (fieldName === 'code' && this.existCode)
            ? 'ng-invalid ng-dirty'
            : '';
    }

    checkValidMultiValidator(fieldNames: string[]) {
        for (let i = 0; i < fieldNames.length; i++) {
            if (
                ((this.billsForm.controls[fieldNames[i]].dirty ||
                    this.billsForm.controls[fieldNames[i]].touched) &&
                    this.billsForm.controls[fieldNames[i]].invalid) ||
                (this.isInvalidForm &&
                    this.billsForm.controls[fieldNames[i]].invalid)
            ) {
                return true;
            }
        }
        return false;
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isInvalidForm = false;
        if (this.billsForm.invalid) {
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
            AppUtil.cleanObject(this.billsForm.value)
        );
        if (this.isEdit) {
            this.taxRatesService
                .updateTaxRates(newData, this.billsForm.value.id)
                .subscribe((res: any) => {
                    if (res && res.status != 605) {
                        this.onCancel.emit({});
                        this.messageService.add({
                            severity: 'success',
                            detail: 'Cập nhật thành công',
                        });
                    } else this.existCode = true;
                });
        } else {
            this.taxRatesService
                .createTaxRates(newData)
                .subscribe((res: any) => {
                    if (res && res.status != 605) {
                        this.onCancel.emit({});
                        this.messageService.add({
                            severity: 'success',
                            detail: 'Thêm mới thành công',
                        });
                    } else this.existCode = true;
                });
        }
    }

    cleanObject(data) {
        let newData = Object.assign({}, data);
        if (!(newData.id > 0)) {
            newData.id = 0;
        }
        newData.debitCodeName = this.getChartOfAccountName(newData.debitCode);
        newData.creditCodeName = this.getChartOfAccountName(newData.creditCode);
        return newData;
    }

    onChangeCode() {
        if (this.existCode) {
            this.existCode = false;
        }
    }

    onBack() {
        this.onCancel.emit({});
    }

    getChartOfAccountName(code) {
        let chartOfAccount = this.chartOfAccounts.find((x) => x.code === code);
        return chartOfAccount? chartOfAccount.name: '';
    }
}
