import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { of } from 'rxjs';
import { ColumnActionType } from 'src/app/components/accounting-module/account/account.model';
import { NameValue, NameValueOfInt } from 'src/app/models/common.model';
import { IsTemplateDirective } from '../directives/is-template.directive';
import { IsTableClass } from './is-table.class';
import { AccountGroupSyncAutoComplete, ExcelActionType, ExcelActionTypeList, IIsTableColumn, IsTableColumnType } from './is-table.model';

@Component({
  selector: 'is-table',
  templateUrl: './is-table.component.html',
  styleUrls: ['./is-table.component.scss']
})
export class IsTableComponent implements OnInit, AfterContentInit, OnChanges, AfterViewInit{

  @Input() styleClass = '';
  @Input() headerDropdownOptions: any[] = [];
  @Input() showHeaderDropdown = false;
  @Input() showHeaderButton = false;
  @Input() scrollable = false;
  @Input() scrollHeight = '';
  @Input() headerActionLabel = '';
  @Input() headerActionItems: MenuItem[] = [];

  @Output() expandChange = new EventEmitter<any>();
  @Output() excelActionChange = new EventEmitter<{type: ExcelActionType, data: any}>();
  @Output() changeHeaderDropdown = new EventEmitter<any>();
  @Output() headerButtonClick = new EventEmitter();
  @Output() actionButtonClick = new EventEmitter<any>();

  @ContentChildren(PrimeTemplate) templates: QueryList<any>;
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef<HTMLInputElement>;

  isTable: IsTableClass = new IsTableClass();
  columnType = IsTableColumnType;
  expandTemplate: TemplateRef<any>;
  excelAction: NameValueOfInt;
  excelActions = ExcelActionTypeList;
  columnActionType = ColumnActionType;
  isShow = true;
  autoCompleteResults = [];

  constructor(
    private _cdr: ChangeDetectorRef,
    private _host: ElementRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.handleAddScroll();
  }

  ngAfterContentInit(): void {
    this.templates.forEach(template => {
      switch(template.getType()) {
        case this.columnType.Expand.toString():
          this.expandTemplate = template.template;
      }
    })
  }

  refresh(columns: IIsTableColumn[]) {
    this.isShow = false;
    setTimeout(() => {
      this.isShow = true;
      this.isTable.columns = columns;
      this.update(this.isTable.data);
    })
  }

  handleAddScroll() {
    if (this.scrollable) {
      const pTableWrapper = this._host.nativeElement.querySelector('.p-datatable-wrapper');
      if (pTableWrapper) {
        pTableWrapper.style.height = this.scrollHeight;
        this._cdr.detectChanges();
      }
    }
  }

  update(data: any[]) {
    this.isTable.update(data);
    this._cdr.detectChanges();
  }

  updateColumns(columns: IIsTableColumn[]) {
    this.isTable.columns = columns;
    this._cdr.detectChanges();
  } 

  onExpand(rowData: any) {
    this.expandChange.emit(rowData);
  }

  onRowCollapse(eventData: any) {
    console.log(eventData);
  }

  onChangeExcelAction(data: NameValueOfInt, rowData: any) {
    if (data.value === ExcelActionType.Import) {
      this.fileUpload.nativeElement.click();
    } else {
      this.excelActionChange.emit({type: data.value, data: {rowData: rowData, file: null}});
    }
  }

  onFileSelected(event: any, rowData: any) {
    const file:File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("thumbnail", file);
      this.excelActionChange.emit({type: ExcelActionType.Import, data: {rowData: rowData, file: formData}});
    }
  }

  onChangeHeaderDropdown(data: {event: any, value: any}) {
    this.changeHeaderDropdown.emit(data.value);
  }

  onHeaderButtonClick(){
    this.headerButtonClick.emit();
  }

  onActionButtonClick(event: any, data: any, type: ColumnActionType) {
    this.actionButtonClick.emit({event, data, type});
  }

  onAccountAutoCompleteSearch(event: any, rowDataColumn: AccountGroupSyncAutoComplete) {
    rowDataColumn.search$.subscribe(value => {
      this.autoCompleteResults = value.filter(a => a.indexOf(event.query) >= 0);
    });
  }
}
