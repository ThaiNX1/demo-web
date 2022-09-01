import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { map, of } from 'rxjs';
import { AppComponentBase } from 'src/app/app-component-base';
import { Page } from 'src/app/models/common.model';
import { AccountGroupLinkService } from 'src/app/service/account-group-link.service';
import { AccountGroupSyncService } from 'src/app/service/account-group-sync.service';
import { AccountGroupService } from 'src/app/service/account-group.service';
import { IsConfirmationType } from 'src/app/shared/is-confirmation/is-comfirmation.model';
import { IsConfirmationService } from 'src/app/shared/is-confirmation/is-comfirmation.service';
import { IsTableComponent } from 'src/app/shared/is-table/is-table.component';
import { AccountGroupSyncAutoComplete, IIsTableColumn, IsTableColumn, IsTableColumnType } from 'src/app/shared/is-table/is-table.model';
import AppUtil from 'src/app/utilities/app-util';
import { ColumnActionType } from '../account.model';
import { AddAccountGroupSyncComponent } from './add-account-group-sync/add-account-group-sync.component';
import { AddEditAccountGroupTableModel } from './add-edit-account-group.model';

@Component({
  selector: 'add-edit-account-group',
  templateUrl: './add-edit-account-group.component.html',
  styleUrls: ['./add-edit-account-group.component.scss']
})
export class AddEditAccountGroupComponent extends AppComponentBase implements OnInit, AfterViewInit {

  @ViewChild('accountGroupTable', { static: false }) accountGroupTable: IsTableComponent;
  @ViewChild('addAccountGroupSync', { static: false }) addAccountGroupSync: AddAccountGroupSyncComponent;

  display = false;

  constructor(
    private _injector: Injector,
    private _accountGroupSyncService: AccountGroupSyncService,
    private _accountGroupService: AccountGroupService,
    private _accountGroupLinkService: AccountGroupLinkService,
    private _isConfirmationService: IsConfirmationService
  ) { 
    super(_injector);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initTable();
  }

  show() {
    this.retrieveData();
    this.display = true;
  }

  hide() {
    this.display = false;
  }

  initTable() {
    const columns: IsTableColumn[] = [
      new IsTableColumn(
        <IIsTableColumn>{
          header: 'label.STT',
          field: '',
          styleClass: 'w--5',
          type: IsTableColumnType.Index
        }),
      new IsTableColumn(
        <IIsTableColumn>{
          header: 'label.code',
          styleClass: 'w--10',
          field: 'code',
        }),
      new IsTableColumn(
        <IIsTableColumn>{
          header: 'label.group_name',
          field: 'name',
          styleClass: 'w--20',
        }),
      new IsTableColumn(
        <IIsTableColumn>{
          header: 'label.account',
          field: 'accountAutocompleteModel',
          type: IsTableColumnType.AccountGroupAutoComplete,
          styleClass: 'w--45',
        }),
      new IsTableColumn(
        <IIsTableColumn>{
          header: 'label.actions',
          field: '',
          type: IsTableColumnType.AccountGroupSyncActions,
          styleClass: 'w--20',
        })
    ];
    this.accountGroupTable.isTable.columns = columns;
  }

  retrieveData() {
    const queryParam: Page = {
      page: 1,
      pageSize: 500,
      sortField: 'id',
      isSort: true,
    };
    this._accountGroupSyncService.get(queryParam).subscribe(res => {
      const dataMapped = res.data.map(a => {
        const data = new AddEditAccountGroupTableModel(a);
        data.accountAutocompleteModel = new AccountGroupSyncAutoComplete();
        data.accountAutocompleteModel.search$ = this._accountGroupLinkService.availableSelection().pipe(
          map(res => res.map(a => a.code))
        );
        return data;
      });
      this.accountGroupTable.update(dataMapped);
    })
  }

  onAddGroup() {
    this.addAccountGroupSync.show();
  }

  onAddSuccessfull() {
    this.retrieveData();
  }

  onActionButtonClick(event: { event: any, data: AddEditAccountGroupTableModel, type: ColumnActionType }) {
    switch (event.type) {
      case ColumnActionType.Edit:

        break;
      case ColumnActionType.Delete:
        this._isConfirmationService.confirm({
          type: IsConfirmationType.PopUp,
          confirmation: {
            target: event.event.target,
            message: AppUtil.translate(
              this.translateService,
              'question.delete_confirm'
            ),
            acceptLabel: AppUtil.translate(this.translateService, 'label.yes'),
            rejectLabel: AppUtil.translate(this.translateService, 'label.no'),
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this._accountGroupSyncService.delete(event.data.id).subscribe(_ => {
                this.retrieveData();
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
          }
        });
        break;
      default:
        break;
    }
  }

}
