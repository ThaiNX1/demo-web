import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TranslateService } from '@ngx-translate/core';
import { ColumnFilter, Table } from 'primeng/table';
import {
    PageFilterRoomTable,
} from 'src/app/service/room-table.service';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import { GoodsService } from 'src/app/service/goods.service';
import { Goods } from 'src/app/models/goods.model';
import { GoodsFormComponent } from './goods-form/goods-form.component';
@Component({
    selector: 'app-list-of-goods',
    templateUrl: './list-of-goods.component.html',
    providers: [MessageService, ConfirmationService],
    styles: [
        `
            :host ::ng-deep .p-frozen-column {
                font-weight: bold;
            }
            :host ::ng-deep .p-datatable-frozen-tbody {
                font-weight: bold;
            }
            :host ::ng-deep .p-progressbar {
                height: 0.5rem;
            }
            :host ::ng-deep .p-panel .p-panel-header .p-panel-header-icon {
                position: absolute;
                top: 80px;
                right: 30px;
            }
            :host ::ng-deep .p-button {
                height: 40px;
            }
        `,
    ],
})
export class ListOfGoodsComponent implements OnInit {
    @ViewChild('goodsForm') goodsForm: GoodsFormComponent;
    loading: boolean = true;

    sortFields: any[] = [];
    sortTypes: any[] = [];

    first = 0;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    public getParams: PageFilterRoomTable = {
        page: 1,
        pageSize: 5,
        sortField: 'id',
        isSort: true,
        floorId: 0,
        isFloor: 'true',
        searchText: '',
    };
    public totalRecords = 0;
    public totalPages = 0;
    public myTarget: number;

    public isLoading: boolean = false;

    public goodsList: Goods[] = [];

    display: boolean = false;

    isMobile = screen.width <= 1199;

    formData: any = {};
    isEdit: boolean = false;
    isReset: boolean = false;

    floors: Goods[];

    pendingRequest: any;

    constructor(
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly goodsServices: GoodsService
    ) {}

    ngOnInit() {
        AppUtil.getRoomTableSortTypes(this.translateService).subscribe(
            (res) => {
                this.sortFields = res;
            }
        );
        AppUtil.getSortTypes(this.translateService).subscribe((res) => {
            this.sortTypes = res;
        });
    }

    onSearch(event) {
        if (event.key === 'Enter') {
            this.getGoods();
        }
    }

    onChangeSort(event, type) {
        if (type === 'sortType') {
            this.getParams.isSort = event.value;
        }
        this.getGoods();
    }

    clearFilter(columnFilter: ColumnFilter, field: string) {
        columnFilter.clearFilter();
    }

    getGoods(event?: any, isExport: boolean = false): void {
        if (this.pendingRequest) {
            this.pendingRequest.unsubscribe();
        }
        this.loading = true;
        if (event) {
            this.getParams.page = event.first / event.rows + 1;
            this.getParams.pageSize = event.rows;
        }
        Object.keys(this.getParams).forEach(
            (k) => this.getParams[k] == null && delete this.getParams[k]
        );
        this.pendingRequest = this.goodsServices
            .getList(this.getParams)
            .subscribe((response: any) => {
                AppUtil.scrollToTop();
                this.goodsList = response.data;
                this.totalRecords = response.totalItems || 0;
                this.totalPages = response.totalItems / response.pageSize + 1;
                this.loading = false;
            });
    }

    getDetail(id) {
        this.goodsForm.getDetail(id);
        this.display = true;
    }

    onAddGoods() {
        this.isEdit = false;
        this.goodsForm.onReset();
        this.display = true;
    }

    onDelete(id) {
        let message;
        this.translateService
            .get('question.delete_room_table')
            .subscribe((res) => {
                message = res;
            });
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.goodsServices
                    .deleteGoods(id)
                    .subscribe((response: any) => {
                        this.getGoods();
                    });
            },
        });
    }

    baseUrlImage(image) {
        return `${environment.serverURL}/${image}`;
    }

    checkCodeRequired(deskFloor) {
        return deskFloor.code === 'Floor' || deskFloor.code === 'Live';
    }
}
