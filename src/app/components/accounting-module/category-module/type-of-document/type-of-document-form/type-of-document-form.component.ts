import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';
import { ChartOfAccountService } from 'src/app/service/chart-of-account.service';
import { DocumentService } from 'src/app/service/document.service';
import { User } from 'src/app/models/user.model';
@Component({
    selector: 'app-type-of-document-form',
    templateUrl: './type-of-document-form.component.html',
    styles: [
        `
            :host ::ng-deep {
            }
        `,
    ],
})
export class TypeOfDocumentFormComponent implements OnInit, OnChanges {
    public appConstant = AppConstant;
    public appUtil = AppUtil;

    @Input('users') users: User[];
    @Input('formData') formData: any = {};
    @Input('isEdit') isEdit: boolean = false;
    @Input('display') display: boolean = false;
    @Output() onCancel = new EventEmitter();
    title: string = '';

    documentForm: FormGroup = new FormGroup({});

    isSubmitted = false;
    isInvalidForm = false;
    existCode: boolean = false;

    chartOfAccounts: any[];

    types: any = {};

    constructor(
        private fb: FormBuilder,
        private chartOfAccountService: ChartOfAccountService,
        private translateService: TranslateService,
        private messageService: MessageService,
        private documentService: DocumentService
    ) {
        this.documentForm = this.fb.group({
            id: [''],
            stt: ['', [Validators.required]],
            code: ['', [Validators.required]],
            name: ['', [Validators.required]],
            debitCode: [''],
            nameDebitCode: [''],
            creditCode: [''],
            nameCreditCode: [''],
            userId: [''],
            userCode: [''],
            userFullName: [''],
            title: [''],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.isEdit &&
            this.formData &&
            Object.keys(this.formData).length > 0
        ) {
            this.documentForm.setValue({
                id: this.formData.id,
                stt: this.formData.stt,
                code: this.formData.code,
                name: this.formData.name,
                debitCode: this.formData.debitCode,
                nameDebitCode: this.formData.nameDebitCode,
                creditCode: this.formData.creditCode,
                nameCreditCode: this.formData.nameCreditCode,
                userId: this.formData.userId,
                userCode: this.formData.userCode,
                userFullName: this.formData.userFullName,
                title: this.formData.title,
            });
        }
    }

    getAllByDisplayInsert() {
        this.chartOfAccountService
            .getAllByDisplayInsert()
            .subscribe((res: any) => {
                this.chartOfAccounts = res;
            });
    }

    onReset() {
        this.isInvalidForm = false;
        this.documentForm.reset();
    }

    ngOnInit() {
        this.types = this.appUtil.getBillsTypes();
        this.getAllByDisplayInsert();
    }

    checkValidValidator(fieldName: string) {
        return ((this.documentForm.controls[fieldName].dirty ||
            this.documentForm.controls[fieldName].touched) &&
            this.documentForm.controls[fieldName].invalid) ||
            (this.isInvalidForm &&
                this.documentForm.controls[fieldName].invalid) ||
            (fieldName === 'code' && this.existCode)
            ? 'ng-invalid ng-dirty'
            : '';
    }

    checkValidMultiValidator(fieldNames: string[]) {
        for (let i = 0; i < fieldNames.length; i++) {
            if (
                ((this.documentForm.controls[fieldNames[i]].dirty ||
                    this.documentForm.controls[fieldNames[i]].touched) &&
                    this.documentForm.controls[fieldNames[i]].invalid) ||
                (this.isInvalidForm &&
                    this.documentForm.controls[fieldNames[i]].invalid)
            ) {
                return true;
            }
        }
        return false;
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isInvalidForm = false;
        if (this.documentForm.invalid) {
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
            AppUtil.cleanObject(this.documentForm.value)
        );
        if (this.isEdit) {
            this.documentService
                .updateDocument(this.documentForm.value.id, newData)
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
            this.documentService
                .createDocument(newData)
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
        newData.nameDebitCode = this.getChartOfAccountName(newData.debitCode);
        newData.nameCreditCode = this.getChartOfAccountName(newData.creditCode);
        newData.userFullName = this.getUserFullName(newData.userCode);
        newData.userId = this.getUserId(newData.userCode);
        return newData;
    }

    getUserFullName(code) {
        let user = this.users.find((x) => x.code === code);
        return user ? user.fullName : '';
    }

    getUserId(code) {
        let user = this.users.find((x) => x.code === code);
        return user ? user.id.toString() : '';
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
        return chartOfAccount ? chartOfAccount.name : '';
    }
}
