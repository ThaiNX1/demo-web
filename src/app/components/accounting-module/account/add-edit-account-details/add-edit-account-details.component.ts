import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, filter, mergeMap, Observable, of } from 'rxjs';
import { AppComponentBase } from 'src/app/app-component-base';
import { AccountGroupAddEditModel, AccountGroupDetailModel, AccountGroupType } from 'src/app/models/account-group.model';
import { Page } from 'src/app/models/common.model';
import { AccountGroupService } from 'src/app/service/account-group.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import AppUtil from 'src/app/utilities/app-util';
import { AccountType, AddAccountDetailType } from '../account.model';


@Component({
  selector: 'add-edit-account-details',
  templateUrl: './add-edit-account-details.component.html',
  styleUrls: ['./add-edit-account-details.component.scss']
})
export class AddEditAccountDetailsComponent extends AppComponentBase implements OnInit {

  @Input() accountType: AccountType;
  @Output() updateSuccessfull = new EventEmitter();


  title = '';
  display = false;
  formGroup: FormGroup;
  wareHouses: any[] = [];
  accountTypes = AccountType;
  accountGroupTypes = AccountGroupType;
  accountDetailTypes = AddAccountDetailType;
  currentParentAccount: AccountGroupDetailModel;
  currentDetail: AccountGroupDetailModel;
  accountDetailType: AddAccountDetailType;

  get valid(): boolean {
    if (this.formGroup && this.formGroup.valid) {
      return true;
    }
    return false;
  }

  constructor(private _fb: FormBuilder,
    private _accountGroupService: AccountGroupService,
    private _warehouseService: WarehouseService,
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
        this.valid && this.onAdd();
        break;
      case 'F9':
        this.onCancel();
        break;
      case 'F10':
        !this.currentDetail && this.valid && this.onAddContinue();
        break;
    }
  }

  getFormGroup(): FormGroup {
    if (this.accountType === AccountType.HT) {
      switch (this.currentParentAccount.accGroup) {
        case AccountGroupType.Inventory:
          return this._fb.group({
            warehouseCode: this._fb.control(null),
            code: this._fb.control(null, [Validators.required]),
            name: this._fb.control(null, [Validators.required]),
            stockUnit: this._fb.control(null),
            openingStockQuantity: this._fb.control(null),
            stockUnitPrice: this._fb.control(null),
            openingDebit: this._fb.control(null),
            isForeignCurrency: this._fb.control(false),
            openingForeignDebit: this._fb.control({ value: null, disabled: true }),
          });
        case AccountGroupType.ImportExport:
          return this._fb.group({
            code: this._fb.control(null, [Validators.required]),
            name: this._fb.control(null, [Validators.required]),
            stockUnit: this._fb.control(null),
            openingStockQuantity: this._fb.control(null),
            stockUnitPrice: this._fb.control(null),
            openingDebit: this._fb.control(null),
            isForeignCurrency: this._fb.control(false),
            openingForeignDebit: this._fb.control({ value: null, disabled: true }),
          });
        default:
          return this._fb.group({
            code: this._fb.control(null, [Validators.required]),
            name: this._fb.control(null, [Validators.required]),
            openingDebit: this._fb.control(null),
            openingCredit: this._fb.control(null),
            isForeignCurrency: this._fb.control(false),
            openingForeignCredit: this._fb.control({ value: null, disabled: true }),
            openingForeignDebit: this._fb.control({ value: null, disabled: true }),
          });
      }
    } else {
      switch (this.currentParentAccount.accGroup) {
        case AccountGroupType.Inventory:
          return this._fb.group({
            warehouseCode: this._fb.control(null),
            code: this._fb.control(null, [Validators.required, Validators.min(100)]),
            name: this._fb.control(null, [Validators.required]),
            stockUnit: this._fb.control(null),
            openingStockQuantityNb: this._fb.control(null),
            stockUnitPriceNb: this._fb.control(null),
            openingDebitNb: this._fb.control(null),
            isForeignCurrency: this._fb.control(false),
            openingForeignDebitNb: this._fb.control({ value: null, disabled: true }),
          });
        case AccountGroupType.ImportExport:
          return this._fb.group({
            code: this._fb.control(null, [Validators.required, Validators.min(100)]),
            name: this._fb.control(null, [Validators.required]),
            stockUnit: this._fb.control(null),
            openingStockQuantityNb: this._fb.control(null),
            stockUnitPriceNb: this._fb.control(null),
            openingDebitNb: this._fb.control(null),
            isForeignCurrency: this._fb.control(false),
            openingForeignDebitNb: this._fb.control({ value: null, disabled: true }),
          });
        default:
          return this._fb.group({
            code: this._fb.control(null, [Validators.required, Validators.min(100)]),
            name: this._fb.control(null, [Validators.required]),
            openingDebitNb: this._fb.control(null),
            openingCreditNb: this._fb.control(null),
            isForeignCurrency: this._fb.control(false),
            openingForeignCreditNb: this._fb.control({ value: null, disabled: true }),
            openingForeignDebitNb: this._fb.control({ value: null, disabled: true }),
          });
      }
    }

  }

  initFormGroup() {

    this.formGroup = this.getFormGroup();
    this.subsribeIsForeignCurrency();

    this.subscribeStockUnitPrice('openingStockQuantity', 'stockUnitPrice', 'openingDebit');
    this.subscribeStockUnitPrice('openingStockQuantityNb', 'stockUnitPriceNb', 'openingDebitNb');
    this.patchFormValue();
    this.setDisableState();
  }

  subsribeIsForeignCurrency() {
    this.formGroup.controls.isForeignCurrency.valueChanges.subscribe(value => {
      if (this.accountType === AccountType.HT) {
        if (value) {
          this.formGroup.controls.openingForeignCredit && this.formGroup.controls.openingForeignCredit.enable();
          this.formGroup.controls.openingForeignDebit.enable();
        } else {
          this.formGroup.controls.openingForeignCredit && this.formGroup.controls.openingForeignCredit.disable();
          this.formGroup.controls.openingForeignDebit.disable();
        }
      } else {
        if (value) {
          this.formGroup.controls.openingForeignCreditNb && this.formGroup.controls.openingForeignCreditNb.enable();
          this.formGroup.controls.openingForeignDebitNb.enable();
        } else {
          this.formGroup.controls.openingForeignCreditNb && this.formGroup.controls.openingForeignCreditNb.disable();
          this.formGroup.controls.openingForeignDebitNb.disable();
        }
      }
    })
  }

  subscribeStockUnitPrice(stockQuanlityName: string, stockPrice: string, openingDebit: string) {
    const stockQualityControl = this.formGroup.get(stockQuanlityName);
    const stockPriceControl = this.formGroup.get(stockPrice);
    const openingDebitControl = this.formGroup.get(openingDebit);
    if (stockQualityControl && stockPriceControl) {
      combineLatest(
        stockQualityControl.valueChanges,
        stockPriceControl.valueChanges
      )
      .pipe(
        filter(([stockQuanlity, stockPrice]) => stockQuanlity && stockPrice)
      )
      .subscribe(([stockQuanlity, stockPrice]) => {
        openingDebitControl.setValue(stockQuanlity*stockPrice);
      })
    }
  }

  setDisableState() {
    if (this.accountDetailType === this.accountDetailTypes.CT2 && 
        this.currentParentAccount.accGroup === AccountGroupType.Inventory) {
          this.formGroup.controls.warehouseCode.disable();
    }
  }

  patchFormValue() {
    if (this.currentDetail) {
      this.formGroup.patchValue(this.currentDetail);
    } else {
      if (this.accountDetailType === this.accountDetailTypes.CT2 && this.currentParentAccount &&
        this.currentParentAccount.accGroup === AccountGroupType.Inventory) {
          this.formGroup.controls.warehouseCode.setValue(this.currentParentAccount.warehouseCode);
    }
    }
  }

  onBlurStockUnitPrice() {
    const openingDebitControl = this._host.nativeElement.querySelector('#openingDebitControl input');
    if (openingDebitControl) {
      openingDebitControl.focus();
    }
  }

  show(type: AddAccountDetailType, parentData: AccountGroupDetailModel, data?: AccountGroupDetailModel) {
    this.currentDetail = data;
    this.accountDetailType = type;
    this.currentParentAccount = parentData;
    this.getTitle().subscribe(title => {
      this.title = title;
    });
    this.initFormGroup();
    this.getWareHouseList();
    this.display = true;
  }

  getWareHouseList() {
    if (this.currentParentAccount.accGroup === this.accountGroupTypes.Inventory) {
      this._warehouseService.getWarehouse(<Page>{
        page: 1,
      }).subscribe(response => {
        this.wareHouses = response.data;
        if (this.wareHouses.length > 0 && !this.formGroup.controls.warehouseCode) {
          this.formGroup.controls.warehouseCode.setValue(this.wareHouses[0].code);
        }
      })
    }
  }

  getTitle(): Observable<string> {
    if (this.currentParentAccount.accGroup == AccountGroupType.Normal) {
      return AppUtil.translate$(this.translateService, !this.currentDetail ? 'label.add_details' : 'label.edit_details');
    } else {
      return AppUtil.translateWithParams$(this.translateService,(!this.currentDetail ? 'label.add_details_number' : 'label.edit_details_number'), {number: this.currentParentAccount.accGroup});
    }
  }

  onAddContinue() {
    this.handleAdd(true);
  }

  onCancel() {
    this.display = false;
  }

  onAdd() {
    this.handleAdd();
  }

  handleAdd(isContinue?: boolean) {
    if (this.valid) {
      let formData = this.formGroup.getRawValue();
      formData = {
        ...formData,
        type: this.accountDetailType == this.accountDetailTypes.CT1 ? 5 : 6,
        parentRef: this.accountDetailType == this.accountDetailTypes.CT1 ? this.currentParentAccount.code : (this.currentParentAccount.parentRef + ':' + this.currentParentAccount.code)
      };

      let api$: Observable<any>;
      if (this.currentDetail) { // edit
        const data = new AccountGroupAddEditModel(this.currentDetail);
        const input = {
          ...data,
          ...formData
        };
        delete input.expanded;
        api$ = this._accountGroupService.putDetail(input);
      } else { // add
        const data = new AccountGroupAddEditModel(this.currentParentAccount);
        const input = {
          ...data,
          id: 0,
          ...formData
        };
        delete input.expanded;
        api$ = this._accountGroupService.postCreateDetail(input);
      }

      api$
      .pipe(
        filter(a => a.status !== 400)
      ).subscribe(_ => {
        if (isContinue) {
          this.formGroup.reset();
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
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

}
