import { AfterViewInit, ChangeDetectorRef, Component, Injector, NgZone, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { AppComponentBase } from 'src/app/app-component-base';
import { AccountGroupDetailForChildParams, AccountGroupDetailModel, ImportExportAcccountQueryParam } from 'src/app/models/account-group.model';
import { NameValueOfInt, Page } from 'src/app/models/common.model';
import { AccountGroupService } from 'src/app/service/account-group.service';
import { IsTableComponent } from 'src/app/shared/is-table/is-table.component';
import { ExcelActionType, IIsTableColumn, IsTableColumn, IsTableColumnType } from 'src/app/shared/is-table/is-table.model';
import AppUtil from 'src/app/utilities/app-util';
import { ColumnActionType, AccountGroupDetailListModel, AccountType, AccountTypeList, AddAccountDetailType } from './account.model';
import { AddEditAccountComponent } from './add-edit-account/add-edit-account.component';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AddEditAccountDetailsComponent } from './add-edit-account-details/add-edit-account-details.component';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { AddEditAccountGroupComponent } from './add-edit-account-group/add-edit-account-group.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('accountTable', { static: false }) accountTableView: IsTableComponent;
    @ViewChild('accountTableChild', { static: false }) accountTableChildView: IsTableComponent;
    @ViewChild('accountTableSecondChild', { static: false }) accountTableSecondChildView: IsTableComponent;
    @ViewChild('addEditAccount', { static: false }) addEditAccount: AddEditAccountComponent;
    @ViewChild('addEditAccountDetail', { static: false }) addEditAccountDetail: AddEditAccountDetailsComponent;
    @ViewChild('addEditAccountGroup', { static: false }) addEditAccountGroup: AddEditAccountGroupComponent;

    columnType = IsTableColumnType;
    queryParam: Page = {
        page: 1,
        pageSize: 500,
        sortField: 'id',
        isSort: true,
    };
    queryParamsForChild: AccountGroupDetailForChildParams = {
        page: 1,
        pageSize: 500,
        sortField: 'id',
        isSort: true,
        warehouseCode: ''
    };

    accountTypes = AccountType;
    accountTypeList = AccountTypeList;
    currentAccountType: AccountType = AccountType.HT;
    currentParentCode: string = '';
    currentFirstChildCode: string = '';
    tableData: AccountGroupDetailListModel[] = [];
    tableDataFirstChildNode: AccountGroupDetailListModel[] = [];
    tableDataForSecondChildNode: AccountGroupDetailListModel[] = [];
    accountDetailTypes = AddAccountDetailType;
    menuActionItems: MenuItem[] = [];

    constructor(
        private _accountGroupService: AccountGroupService,
        private _confirmationService: ConfirmationService,
        private _cdr: ChangeDetectorRef,
        private _injector: Injector,
    ) {
        super(_injector);
    }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.initTable();
        this.retrieveAccountData();
        this.menuActionItems = [{
            label: 'Tài khoản đồng bộ',
            command: () => {
                this.addEditAccountGroup.show();
            }
        }, {
            label: 'Xuất excel',
            command: () => { }
        }, {
            label: 'Nhập excel',
            command: () => { }
        }, {
            label: 'Cập nhật số dư phát sinh',
            command: () => { }
        }, {
            label: 'Xuất excel kết chuyển',
            command: () => { }
        }, {
            label: 'Nhập excel kết chuyển',
            command: () => { }
        }];
    }



    //#region For Parent table Account Table
    initTable() {
        const columns = this.getColumnTableByAccount();
        this.accountTableView.isTable.isSearchable = true;
        this.accountTableView.isTable.columns = columns;
    }

    getColumnTableByAccount(): IsTableColumn[] {
        switch (this.currentAccountType) {
            case this.accountTypes.NB:
                return [
                    new IsTableColumn(<IIsTableColumn>{
                        header: '',
                        field: 'hasDetails',
                        type: IsTableColumnType.Expand,
                        innerFields: ['expanded'],
                        styleClass: 'w--5'
                    }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.account_code',
                            field: 'code',
                            styleClass: 'w--10'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'left_menu.account',
                            field: 'name',
                            styleClass: 'w--20'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_debt_nb',
                            field: 'openingDebitNb',
                            styleClass: 'w--10',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_opening_nb',
                            field: 'openingCreditNb',
                            styleClass: 'w--10',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.currency',
                            field: 'isForeignCurrency',
                            type: IsTableColumnType.ForeignCurrency,
                            styleClass: 'w--5'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.duration',
                            field: 'duration',
                            styleClass: 'w--5'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.nature',
                            field: 'accGroup',
                            styleClass: 'w--5'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.type',
                            field: 'classification',
                            styleClass: 'w--5'
                        }),
                    new IsTableColumn(<IIsTableColumn>{
                        field: '',
                        innerFields: ['displayInsert', 'displayDelete'],
                        styleClass: 'w--20',
                        type: IsTableColumnType.AccountAction,
                    })
                ];
            default:
                return [
                    new IsTableColumn(<IIsTableColumn>{
                        header: '',
                        field: 'hasDetails',
                        type: IsTableColumnType.Expand,
                        innerFields: ['expanded'],
                        styleClass: 'w--5'
                    }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.account_code',
                            field: 'code',
                            styleClass: 'w--10'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'left_menu.account',
                            field: 'name',
                            styleClass: 'w--20'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_debt',
                            field: 'openingDebit',
                            styleClass: 'w--10',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_opening',
                            field: 'openingCredit',
                            styleClass: 'w--10',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.currency',
                            field: 'isForeignCurrency',
                            type: IsTableColumnType.ForeignCurrency,
                            styleClass: 'w--5'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.duration',
                            field: 'duration',
                            styleClass: 'w--5'
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.nature',
                            field: 'accGroup',
                            styleClass: 'w--5'
                        }),
					new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.type',
                            field: 'classification',
                            styleClass: 'w--5'
                        }),
                    new IsTableColumn(<IIsTableColumn>{
                        field: '',
                        innerFields: ['displayInsert', 'displayDelete'],
                        styleClass: 'w--25',
                        type: IsTableColumnType.AccountAction
                    })
                ];
        }
    }

    retrieveAccountData() {
        this.accountTableView.isTable.showLoading();
        this._accountGroupService.getListDetail(this.queryParam)
            .pipe(
                finalize(() => {
                    this.accountTableView.isTable.hideLoading();
                })
            )
            .subscribe(response => {

                const data = response.data.map(a => ({
                    ...a,
                    expanded: false,
                }))
                this.updateTable(data);
            })
    }

    updateTable(data: AccountGroupDetailListModel[]) {
        this.tableData = data;
        this.accountTableView.update(data);
    }

    onExpandChange(rowData: AccountGroupDetailListModel) {
        const isExpanded = !rowData.expanded;
        this.tableData.forEach(a => {
            a.expanded = a.id === rowData.id ? isExpanded : false;
        });
        this.updateTable(this.tableData);

        if (isExpanded) {
            this.currentParentCode = rowData.code;
            // settimeout to get view child
            setTimeout(() => {
                this.initFirstChildTable();
                this.retrieveFirstTableChildData();
            }, 1000);
        }
    }

    //#endregion

    //#region For First Child Node Table
    initFirstChildTable() {
        const columns = this.getColumnFirstChildTableByAccount();
        this.accountTableChildView.isTable.columns = columns;
        this._cdr.detectChanges();
    }

    getColumnFirstChildTableByAccount(): IsTableColumn[] {
        switch (this.currentAccountType) {
            case this.accountTypes.NB:
                return [
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: '',
                            field: 'hasDetails',
                            type: IsTableColumnType.Expand,
                            innerFields: ['expanded']
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.warehouse_code',
                            field: 'warehouseCode',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.account_code',
                            field: 'code',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'left_menu.account',
                            field: 'name',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.SL',
                            field: 'openingStockQuantityNB',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.stock_unit',
                            field: 'stockUnit',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.stock_price_nb',
                            field: 'stockUnitPriceNb',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_debt_nb',
                            field: 'openingDebitNb',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_opening_nb',
                            field: 'openingCreditNb',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(<IIsTableColumn>{
                        field: '',
                        innerFields: ['displayInsert', 'displayDelete'],
                        styleClass: 'w-20rem',
                        type: IsTableColumnType.AccountAction
                    })
                ];
            default:
                return [
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: '',
                            field: 'hasDetails',
                            type: IsTableColumnType.Expand,
                            innerFields: ['expanded']
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.warehouse_code',
                            field: 'warehouseCode',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.account_code',
                            field: 'code',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'left_menu.account',
                            field: 'name',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.SL',
                            field: 'openingStockQuantity',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.stock_unit',
                            field: 'stockUnit',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.stock_price',
                            field: 'stockUnitPrice',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_debt',
                            field: 'openingDebit',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            header: 'label.residual_opening',
                            field: 'openingCredit',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(<IIsTableColumn>{
                        field: '',
                        innerFields: ['displayInsert', 'displayDelete'],
                        styleClass: 'w-20rem',
                        type: IsTableColumnType.AccountAction
                    })
                ];
        }
    }

    retrieveFirstTableChildData() {
        this._accountGroupService
            .getListDetailForChildNode(this.currentParentCode, this.queryParamsForChild)
            .subscribe(response => {

                const data = response.data.map(a => ({
                    ...a,
                    expanded: false
                }))
                this.updateFirstTableChild(data);
            })
    }

    updateFirstTableChild(data: any[]) {
        this.tableDataFirstChildNode = data;
        this.accountTableChildView.update(data);
    }

    onExpandChildNodeChange(rowData: AccountGroupDetailListModel) {
        const isExpanded = !rowData.expanded;
        this.tableDataFirstChildNode.forEach(a => {
            a.expanded = a.id === rowData.id ? !a.expanded : false;
        });

        if (isExpanded) {
            this.currentFirstChildCode = rowData.code;

            // settimeout to get view child
            setTimeout(() => {
                this.initSecondChildTable();
                this.retrieveSecondChildTableData();
            });
        }
    }
    //#endregion

    //#region For Second Child node table
    initSecondChildTable() {
        const columns = this.getColumnSecondChildTableByAccount();
        this.accountTableSecondChildView.isTable.columns = columns;
    }

    getColumnSecondChildTableByAccount(): IsTableColumn[] {
        switch (this.currentAccountType) {
            case this.accountTypes.NB:
                return [
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: '',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'warehouseCode',
                            styleClass: 'w-9rem',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'code',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'name',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'openingStockQuantityNB',
                            styleClass: 'w-5rem',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'stockUnit',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'stockUnitPriceNb',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'openingDebitNb',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'openingCreditNb',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(<IIsTableColumn>{
                        field: '',
                        innerFields: ['displayInsert', 'displayDelete'],
                        styleClass: 'w-20rem',
                        type: IsTableColumnType.AccountActionDetail2
                    })
                ];
            default:
                return [
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: '',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'warehouseCode',
                            styleClass: 'w-9rem',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'code',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'name',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'openingStockQuantity',
                            styleClass: 'w-5rem',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'stockUnit',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'stockUnitPrice',
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'openingDebit',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(
                        <IIsTableColumn>{
                            field: 'openingCredit',
                            type: IsTableColumnType.DoubleInString
                        }),
                    new IsTableColumn(<IIsTableColumn>{
                        field: '',
                        innerFields: ['', 'displayDelete'],
                        styleClass: 'w-20rem',
                        type: IsTableColumnType.AccountActionDetail2
                    })
                ];
        }
    }

    retrieveSecondChildTableData() {
        this._accountGroupService
            .getListDetailForChildNode(this.currentParentCode + ':' + this.currentFirstChildCode, this.queryParamsForChild)
            .subscribe(response => {

                const data = response.data.map(a => ({
                    ...a,
                    expanded: false
                }));

                this.updateSecondChildTable(data);
            })
    }

    updateSecondChildTable(data: any[]) {
        this.tableDataForSecondChildNode = data;
        this.accountTableSecondChildView.update(data);
    }

    //#endregion

    handleLoadingTable() {
        this.accountTableView.isTable.showLoading();
        setTimeout(() => {
            this.accountTableView.isTable.hideLoading();
        }, 3000);
    }
    updateTableByAccountType() {
        this.accountTableView.updateColumns(this.getColumnTableByAccount());

        if (this.accountTableChildView) {
            this.accountTableChildView.updateColumns(this.getColumnFirstChildTableByAccount())
        }
        if (this.accountTableSecondChildView) {
            this.accountTableSecondChildView.updateColumns(this.getColumnSecondChildTableByAccount());
        }

    }

    onExcelActionChange(action: { type: ExcelActionType, data: { rowData: any, file: FormData } }) {
        if (action.type === ExcelActionType.Export) {
            this._accountGroupService.exportTaiKhoanNoiBoChiTiet1(<ImportExportAcccountQueryParam>{
                code: action.data.rowData.code,
                Loai: this.currentAccountType === this.accountTypes.HT ? 0 : 1
            }).subscribe(res => {
                saveAs(res, `Danh_Sach_Tai_Khoan_${format(new Date(), 'ddMMyyHHmm')}`);
            });
        } else {
            this._accountGroupService.importExcelTaiKhoan(action.data.rowData.code, action.data.file).subscribe();
        }
    }

    onExcelActionForFirstChildChange(action: { type: ExcelActionType, data: any }) {
        const parentCode = action.data.parentRef + ":" + action.data.code;
        if (action.type === ExcelActionType.Export) {
            this._accountGroupService.exportTaiKhoanNoiBoChiTiet1(<ImportExportAcccountQueryParam>{
                code: parentCode,
                Loai: this.currentAccountType === this.accountTypes.HT ? 0 : 1
            }).subscribe(res => {
                saveAs(res, `Danh_Sach_Tai_Khoan_${format(new Date(), 'ddMMyyHHmm')}`)
            });
        } else {
            this._accountGroupService.importTaiKhoanCT1(parentCode, action.data.file).subscribe();
        }
    }

    onChangeHTNB(type: NameValueOfInt) {
        this.currentAccountType = type.value;

        this.accountTableView.refresh(this.getColumnTableByAccount());
    }

    onAddAccount() {
        this.addEditAccount.show();
    }

    onActionClick(event: { event: any, data: AccountGroupDetailListModel, type: ColumnActionType }) {
        switch (event.type) {
            case ColumnActionType.Edit:
                this.addEditAccount.show(event.data);
                break;
            case ColumnActionType.Delete:
                this._confirmationService.confirm({
                    target: event.event.target,
                    message: AppUtil.translate(
                        this.translateService,
                        'question.delete_confirm'
                    ),
                    acceptLabel: AppUtil.translate(this.translateService, 'label.yes'),
                    rejectLabel: AppUtil.translate(this.translateService, 'label.no'),
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this._accountGroupService.deleteAccount(event.data.id).subscribe(_ => {
                            this.retrieveAccountData();
                            this.messageService.add({
                                severity: 'success',
                                detail: AppUtil.translate(
                                    this.translateService,
                                    'success.delete'
                                ),
                            });
                        });
                    },
                    reject: () => {
                    }
                });
                break;
            default:
                this.addEditAccountDetail.show(this.accountDetailTypes.CT1, event.data);
        }
    }

    onActionDetail1Click(event: { event: any, data: AccountGroupDetailListModel, type: ColumnActionType }) {
        switch (event.type) {
            case ColumnActionType.Edit:
                this.addEditAccountDetail.show(this.accountDetailTypes.CT1, event.data, event.data);
                break;
            case ColumnActionType.Delete:
                this._confirmationService.confirm({
                    target: event.event.target,
                    acceptLabel: AppUtil.translate(this.translateService, 'label.yes'),
                    rejectLabel: AppUtil.translate(this.translateService, 'label.no'),
                    message: AppUtil.translate(
                        this.translateService,
                        'question.delete_confirm'
                    ),
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this._accountGroupService.deleteDetail(event.data.id).subscribe(_ => {
                            this.retrieveAccountData();
                            this.messageService.add({
                                severity: 'success',
                                detail: AppUtil.translate(
                                    this.translateService,
                                    'success.delete'
                                ),
                            });
                        });
                    },
                    reject: () => {
                    }
                });
                break;
            default:
                this.addEditAccountDetail.show(this.accountDetailTypes.CT2, event.data);
        }
    }

    onActionDetail2Click(event: { event: any, data: AccountGroupDetailListModel, type: ColumnActionType }) {
        switch (event.type) {
            case ColumnActionType.Edit:
                this.addEditAccountDetail.show(this.accountDetailTypes.CT2, event.data, event.data);
                break;
            case ColumnActionType.Delete:
                this._confirmationService.confirm({
                    target: event.event.target,
                    message: AppUtil.translate(
                        this.translateService,
                        'question.delete_confirm'
                    ),
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this._accountGroupService.deleteDetail(event.data.id).subscribe(_ => {
                            this.retrieveAccountData();
                            this.messageService.add({
                                severity: 'success',
                                detail: AppUtil.translate(
                                    this.translateService,
                                    'success.delete'
                                ),
                            });
                        });
                    },
                    reject: () => {
                    }
                });
                break;
        }
    }

    onAddEditAccountSuccessfull() {
        this.retrieveAccountData();
    }

    onAddEditFirstChildAccountSuccessfull() {
        this.retrieveAccountData();
        this.retrieveFirstTableChildData();
    }
}
