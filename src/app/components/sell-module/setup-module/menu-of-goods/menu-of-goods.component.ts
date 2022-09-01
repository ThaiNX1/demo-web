import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import AppUtil from 'src/app/utilities/app-util';
import { environment } from 'src/environments/environment';
import { RoomTable } from 'src/app/models/room-table.model';
import { MenuOfGoodsFormComponent } from './component/menu-of-goods-form/menu-of-goods-form.component';
import { CategoryService, PageFilterCategory } from 'src/app/service/category.service';

@Component({
    selector: 'app-menu-of-goods',
    templateUrl: './menu-of-goods.component.html',
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
export class MenuOfGoodsComponent implements OnInit {
    appUtil = AppUtil;
    @ViewChild('categoryForm') categoryForm: MenuOfGoodsFormComponent;
    loading: boolean = true;

    sortFields: any[] = [];
    sortTypes: any[] = [];

    first = 0;

    public getParams: PageFilterCategory = {
        page: 1,
        pageSize: 5,
        sortField: 'id',
        isSort: true,
        type: 0,
        searchText: '',
    };
    public totalRecords = 0;
    public totalPages = 0;

    public isLoading: boolean = false;

    public categories: RoomTable[] = [];

    display: boolean = false;

    isMobile = screen.width <= 1199;

    formData: any = {};
    isEdit: boolean = false;
    isReset: boolean = false;

    pendingRequest: any;

    types: any = {};

    constructor(
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService,
        private readonly categoryService: CategoryService
    ) {}

    ngOnInit() {
        this.appUtil.getRoomTableSortTypes(this.translateService).subscribe((res) => {
            this.sortFields = res;
        }
        );
        this.appUtil.getSortTypes(this.translateService).subscribe((res) => {
            this.sortTypes = res;
        });
        this.types = this.appUtil.getCategoryTypes();
    }

    onSearch(event) {
        if (event.key === 'Enter') {
            this.getCategories();
        }
    }

    onChangeSort(event, type) {
        if (type === 'sortType') {
            this.getParams.isSort = event.value;
        }
        this.getCategories();
    }

    getCategories(event?: any, isExport: boolean = false): void {
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
        this.pendingRequest = this.categoryService
            .getPaging(this.getParams)
            .subscribe((response: any) => {
                AppUtil.scrollToTop();
                this.categories = response.data;
                this.totalRecords = response.totalItems || 0;
                this.totalPages = response.totalItems / response.pageSize + 1;
                this.loading = false;
            });
    }

    getDetail(id) {
        this.isEdit = true;
        this.categoryForm.getDetail(id);
        this.display = true;
    }

    onAddCategory() {
        this.isEdit = false;
        this.categoryForm.onReset();
        this.display = true;
    }

    onDelete(id) {
        let message;
        this.translateService
            .get('question.delete_category_content')
            .subscribe((res) => {
                message = res;
            });
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.categoryService
                    .deleteCategory(id)
                    .subscribe((response: any) => {
                        this.getCategories();
                    });
            },
        });
    }

    baseUrlImage(image) {
        return `${environment.serverURL}/${image}`;
    }

    getCategoryTypeName(value: number) {
        let category = this.types.category.find(x => x.value === value);
        return category ? category.label : '';
    }
}
