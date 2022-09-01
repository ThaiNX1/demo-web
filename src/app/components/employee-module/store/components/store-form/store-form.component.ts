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
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BranchService } from 'src/app/service/branch.service';
import { StoreService } from 'src/app/service/store.service';
import AppConstant from 'src/app/utilities/app-constants';
import AppUtil from 'src/app/utilities/app-util';

@Component({
    selector: 'app-store-form',
    templateUrl: './store-form.component.html',
    styles: [``],
})
export class StoreFormComponent implements OnInit, OnChanges {
    public appConstant = AppConstant;
    @Input('formData') formData: any = {};
    @Input('isReset') isReset: boolean = false;
    @Input('isEdit') isEdit: boolean = false;
    @Input('display') display: boolean = false;
    @Input('listBranch') listBranch = [];
    @Output() onCancel = new EventEmitter();
    title: string = '';

    storeForm: FormGroup = new FormGroup({});

    isSubmitted = false;
    isInvalidForm = false;
    failPassword: boolean = false;

    constructor(
        private fb: FormBuilder,
        private translateService: TranslateService,
        private messageService: MessageService,
        private storeService: StoreService,
        private router: Router,
        private route: ActivatedRoute,
        private branchService: BranchService
    ) {
        this.storeForm = this.fb.group({
            id: [''],
            code: ['', [Validators.required]],
            name: ['', [Validators.required]],
            managerName: ['', [Validators.required]],
            branchId: [''],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            this.isEdit &&
            this.formData &&
            Object.keys(this.formData).length > 0
        ) {
            this.title = AppUtil.translate(
                this.translateService,
                'label.edit_store'
            );
            this.storeForm.setValue({
                id: this.formData.id,
                code: this.formData.code,
                name: this.formData.name,
                managerName: this.formData.managerName,
                branchId: this.formData.branchId,
            });
        } else {
            this.title = AppUtil.translate(
                this.translateService,
                'label.add_store'
            );
        }
    }

    onReset() {
        this.isInvalidForm = false;
        this.storeForm.reset();
    }

    ngOnInit() {}

    checkValidValidator(fieldName: string) {
        return ((this.storeForm.controls[fieldName].dirty ||
            this.storeForm.controls[fieldName].touched) &&
            this.storeForm.controls[fieldName].invalid) ||
            (this.isInvalidForm && this.storeForm.controls[fieldName].invalid)
            ? 'ng-invalid ng-dirty'
            : '';
    }

    checkValidMultiValidator(fieldNames: string[]) {
        for (let i = 0; i < fieldNames.length; i++) {
            if (
                ((this.storeForm.controls[fieldNames[i]].dirty ||
                    this.storeForm.controls[fieldNames[i]].touched) &&
                    this.storeForm.controls[fieldNames[i]].invalid) ||
                (this.isInvalidForm &&
                    this.storeForm.controls[fieldNames[i]].invalid)
            ) {
                return true;
            }
        }
        return false;
    }

    getStoreDetail(id) {
        this.storeService.getStoreDetail(id).subscribe(
            (res) => {
                this.storeForm.setValue({
                    id: res?.id,
                    code: res?.code,
                    name: res?.name,
                    managerName: res?.managerName,
                });
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    detail: 'Lỗi lấy dữ liệu',
                });
            }
        );
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isInvalidForm = false;
        if (this.storeForm.invalid) {
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
            AppUtil.cleanObject(this.storeForm.value)
        );
        if (this.isEdit) {
            this.storeService
                .updateStore(newData, this.storeForm.value.id)
                .subscribe((res: any) => {
                    if (res?.code === 400) {
                        this.messageService.add({
                            severity: 'error',
                            detail: res?.msg || '',
                        });
                        return;
                    } else {
                        this.onCancel.emit({});
                        this.messageService.add({
                            severity: 'success',
                            detail: 'Cập nhật thành công',
                        });
                    }
                });
        } else {
            this.storeService.createStore(newData).subscribe((res: any) => {
                if (res?.code === 400) {
                    this.messageService.add({
                        severity: 'error',
                        detail: res?.msg || '',
                    });
                    return;
                } else {
                    this.onCancel.emit({});
                    this.messageService.add({
                        severity: 'success',
                        detail: 'Thêm mới thành công',
                    });
                }
            });
        }
    }

    cleanObject(data) {
        let newData = Object.assign({}, data);
        if (!(newData.id > 0)) {
            newData.id = 0;
        }
        return newData;
    }

    onBack() {
        this.onCancel.emit({});
    }
}
