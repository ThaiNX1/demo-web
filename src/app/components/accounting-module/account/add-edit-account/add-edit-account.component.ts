import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { AppComponentBase } from 'src/app/app-component-base';
import { AccountClassificationList, AccountClassificationType, AccountDurationList, AccountDurationType, AccountGroupAddEditModel, AccountGroupDetailModel, AccountGroupList, AccountGroupType, AccountProtectedList, AccountProtectedType } from 'src/app/models/account-group.model';
import { AccountGroupService } from 'src/app/service/account-group.service';
import { IsConfirmationType } from 'src/app/shared/is-confirmation/is-comfirmation.model';
import { IsConfirmationService } from 'src/app/shared/is-confirmation/is-comfirmation.service';
import AppUtil from 'src/app/utilities/app-util';
import { AccountType } from '../account.model';

@Component({
  selector: 'add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.scss']
})
export class AddEditAccountComponent extends AppComponentBase implements OnInit {

  @Input() accountType: AccountType;
  @Output() updateSuccessfull = new EventEmitter();

  title = '';
  display = false;
  formGroup: FormGroup;
  accountTypes = AccountType;
  durationList = AccountDurationList;
  groupList = AccountGroupList;
  classificationList = AccountClassificationList;
  protectedList = AccountProtectedList;
  currentAccount: AccountGroupDetailModel;

  get valid(): boolean {
    if (this.formGroup && this.formGroup.valid) {
      return true;
    }
    return false;
  }

  constructor(private _fb: FormBuilder,
    private _accountGroupService: AccountGroupService,
    private _isConfirmationService: IsConfirmationService,
    private _injector: Injector,
    private _host: ElementRef) {
    super(_injector);
  }

  ngOnInit() {
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (this.display)
      switch (event.code) {
        case 'F8':
          this.valid && this.onAdd(event);
          break;
        case 'F9':
          this.onCancel();
          break;
        case 'F10':
          !this.currentAccount && this.valid && this.onAddContinue(event);
          break;
      }
  }

  initFormGroup() {
    this.formGroup = this.accountType === AccountType.HT ? this._fb.group({
      code: this._fb.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(6)]),
      name: this._fb.control(null, [Validators.required]),
      openingDebit: this._fb.control(null),
      openingCredit: this._fb.control(null),
      isForeignCurrency: this._fb.control(false),
      openingForeignCredit: this._fb.control({ value: null, disabled: true }),
      openingForeignDebit: this._fb.control({ value: null, disabled: true }),
      duration: this._fb.control(null, [Validators.required]),
      accGroup: this._fb.control(null, [Validators.required]),
      classification: this._fb.control(null, [Validators.required]),
      protected: this._fb.control(null, [Validators.required]),
    }) : this._fb.group({
      code: this._fb.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(6)]),
      name: this._fb.control(null, [Validators.required]),
      openingDebitNb: this._fb.control(null),
      openingCreditNb: this._fb.control(null),
      isForeignCurrency: this._fb.control(false),
      openingForeignCreditNb: this._fb.control({ value: null, disabled: true }),
      openingForeignDebitNb: this._fb.control({ value: null, disabled: true }),
      duration: this._fb.control(null, [Validators.required]),
      accGroup: this._fb.control(null, [Validators.required]),
      classification: this._fb.control(null, [Validators.required]),
      protected: this._fb.control(null, [Validators.required]),
    });

    this.subsribeIsForeignCurrency();
  }

  subsribeIsForeignCurrency() {
    this.formGroup.controls.isForeignCurrency.valueChanges.subscribe(value => {
      if (this.accountType === AccountType.HT) {
        if (value) {
          this.formGroup.controls.openingForeignCredit.enable();
          this.formGroup.controls.openingForeignDebit.enable();
        } else {
          this.formGroup.controls.openingForeignCredit.disable();
          this.formGroup.controls.openingForeignDebit.disable();
        }
      } else {
        if (value) {
          this.formGroup.controls.openingForeignCreditNb.enable();
          this.formGroup.controls.openingForeignDebitNb.enable();
        } else {
          this.formGroup.controls.openingForeignCreditNb.disable();
          this.formGroup.controls.openingForeignDebitNb.disable();
        }
      }
    })
  }

  show(data?: AccountGroupDetailModel) {
    this.initFormGroup();
    this.display = true;
    this.currentAccount = data;
    this.title = 'label.add_account';
    if (this.currentAccount) {
      this.title = 'label.edit_account';
      this.formGroup.patchValue(
        {
          ...data,
          protected: data.protected ? data.protected : AccountProtectedType.Debit
        });
    } else {
      this.formGroup.patchValue({
        duration: AccountDurationType.n,
        accGroup: AccountGroupType.Normal,
        classification: AccountClassificationType.Normal,
        protected: AccountProtectedType.Debit
      });
    }
  }

  onAddContinue(event: any) {
    this.handleAddAccount(event, true);
  }

  onCancel() {
    this.display = false;
  }

  onAdd(event: any) {
    this.handleAddAccount(event);
  }

  handleAddAccount(event: any, isContinue?: boolean) {
    if (this.valid) {
      this.addAccount(isContinue);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  addAccount(isContinue?: boolean) {
    let formData = this.formGroup.getRawValue();

    formData = {
      ...formData,
      type: formData.code.toString().length - 2,
    };

    let api$: Observable<any>;
    if (this.currentAccount) {
      const data = new AccountGroupAddEditModel(this.currentAccount);
      const input = {
        ...data,
        ...formData
      };
      api$ = this._accountGroupService.putAccount(input);
    } else {
      const data = new AccountGroupAddEditModel();
      const input = {
        ...data,
        ...formData
      };
      api$ = this._accountGroupService.postCreateAccount(input);
    }

    api$.subscribe(response => {
      if (response.status === 200) {
        if (isContinue) {
          this.formGroup.reset();
          this.formGroup.patchValue({
            duration: AccountDurationType.n,
            accGroup: AccountGroupType.Normal,
            classification: AccountClassificationType.Normal,
            protected: AccountProtectedType.Debit
          });
        } else {
          this.display = false;
        }
        this.updateSuccessfull.emit();
        this.messageService.add({
          severity: 'success',
          detail: AppUtil.translate(
            this.translateService,
            'success.update'
          ),
        });
      }
      
    });
  }

  onBlurCode() {
    const code = this.formGroup.controls.code.value.trim();
    if (!this.currentAccount && this.formGroup.controls.code.valid && code) {
      this._accountGroupService.validateExistingAccount(code)
        .subscribe(response => {
          if (response.message) {
            if (!response.code) {
              this._isConfirmationService.confirm({
                confirmation: {
                  header: AppUtil.translate(this.translateService, 'label.add_account'),
                  icon: 'pi pi-exclamation-triangle',
                  acceptLabel: AppUtil.translate(this.translateService, 'label.yes'),
                  rejectLabel: AppUtil.translate(this.translateService, 'label.no'),
                  message: response.message,
                  accept: () => {
                    this.formGroup.controls.name.setValue(null);
                    this._host.nativeElement.querySelector('#name').focus();
                  },
                  reject: () => {
                    this.formGroup.controls.code.setValue(null);
                    this._host.nativeElement.querySelector('#code').focus();
                  }
                }
              });
            } else if (response.code === 'ACCOUNT_EXIST') {
              this._isConfirmationService.confirm({
                confirmation: {
                  header: AppUtil.translate(this.translateService, 'label.add_account'),
                  icon: 'pi pi-exclamation-triangle',
                  acceptLabel: AppUtil.translate(this.translateService, 'label.yes'),
                  message: response.message,
                  rejectVisible: false,
                  accept: () => {
                    this.formGroup.controls.code.setValue(null);
                    this._host.nativeElement.querySelector('#code').focus();
                  },
                }
              });
            }
            
          } else {
            this.formGroup.controls.name.setValue(response.data.name);
            this._host.nativeElement.querySelector('#name').focus();
          }
        });
    }

  }

}
