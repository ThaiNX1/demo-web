import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { RoomTable } from 'src/app/models/room-table.model';
import { ProductService } from 'src/app/service/productservice';
import { PageFilterRoomTable, RoomTableService } from 'src/app/service/room-table.service';
import AppUtil from 'src/app/utilities/app-util';
@Component({
    selector: 'app-cashier',
    templateUrl: './cashier.component.html',
    styles: [
        `
            :host ::ng-deep {
                .card-table {
                    min-height: 80vh !important;
                }

                .p-paginator {
                    padding: 0 !important;
                }

                .p-orderlist .p-orderlist-header,
                .p-orderlist .p-orderlist-filter-container {
                    display: none;
                }

                .p-tabview .p-tabview-panels {
                    padding: 0;
                }

                .p-dropdown {
                    width: 14rem;
                    font-weight: normal;
                }

                .product-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .product-description {
                    margin: 0 0 1rem 0;
                }

                .product-category-icon {
                    vertical-align: middle;
                    margin-right: 0.5rem;
                }

                .product-category {
                    font-weight: 600;
                    vertical-align: middle;
                }

                .product-list-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    width: 100%;

                    img {
                        width: 150px;
                        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
                            0 3px 6px rgba(0, 0, 0, 0.23);
                        margin-right: 2rem;
                    }

                    .product-list-detail {
                        flex: 1 1 0;
                    }

                    .p-rating {
                        margin: 0 0 0.5rem 0;
                    }

                    .product-price {
                        font-size: 1.5rem;
                        font-weight: 600;
                        align-self: flex-end;
                    }

                    .product-list-action {
                        display: flex;
                        flex-direction: column;
                    }

                    .p-button {
                        margin-bottom: 0.5rem;
                    }
                }

                .product-grid-item {
                    margin: 0.5em;
                    border: 1px solid #dee2e6;

                    .product-grid-item-top,
                    .product-grid-item-bottom {
                        display: flex;
                    }

                    img {
                        width: 75%;
                        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
                            0 3px 6px rgba(0, 0, 0, 0.23);
                        margin: 0.5rem 0;
                    }

                    .product-grid-item-content {
                        text-align: center;
                    }

                    .product-price {
                        font-size: 1.5rem;
                        font-weight: 600;
                    }
                }
            }

            .status-instock {
                text-align: right;
                font-weight: bold;
                color: green;
            }

            .status-outofstock {
                text-align: right;
                font-weight: bold;
                color: red;
            }

            .status-lowstock {
                text-align: right;
                font-weight: bold;
                color: orange;
            }

            .card {
                padding: 1rem;
                padding-bottom: 0;
                box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
                    0 1px 1px 0 rgba(0, 0, 0, 0.14),
                    0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
                border-radius: 4px !important;
            }

            @media screen and (max-width: 576px) {
                :host ::ng-deep .product-list-item {
                    flex-direction: column;
                    align-items: center;

                    img {
                        width: 75%;
                        margin: 2rem 0;
                    }

                    .product-list-detail {
                        text-align: center;
                    }

                    .product-price {
                        align-self: center;
                    }

                    .product-list-action {
                        display: flex;
                        flex-direction: column;
                    }

                    .product-list-action {
                        margin-top: 2rem;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                    }
                }
            }
        `,
    ],
})
export class CashierComponent implements OnInit {
    activeTableOrGoods: number = 0;
    activeFloor: number = 0;
    activeBill: number = 0;

    // floorTabs: any[] = Array.from({ length: 50 }, (_, i) => ({
    //     title: `Lầu ${i + 1}`,
    //     content: `Tab ${i + 1} Floor Content`,
    // }));
    floorTabs: any[] = [];

    billTabs: any[] = Array.from({ length: 50 }, (_, i) => ({
        title: `Bill ${i + 1}`,
        content: `Tab ${i + 1} Bill Content`,
    }));

    products: Product[];

    sortOptions: SelectItem[];

    sortOrder: number;

    sortField: string;

    public deskFloors: RoomTable[] = [];
    pendingRequest: any;
    loading: boolean = false;

    floors: RoomTable[];

    first = 0;

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

    constructor(
        private productService: ProductService,
        private roomTableService: RoomTableService
    ) {}

    ngOnInit() {
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' },
        ];
        this.getFloors();
    }

    onSortChange(event) {
        let value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    getFloors() {
        this.roomTableService.getListNoQuery().subscribe((res) => {
            this.floors = res.data.filter((item) => item.floorId === 0) || [];
            this.floors.forEach((item) => {
                this.floorTabs.push({
                    title: `Lầu ${item.name}`,
                    content: `Tab ${item.name} Floor Content`,
                });
            });
        });
    }

    getRoomTable(event?: any): void {
        if (this.pendingRequest) {
            this.pendingRequest.unsubscribe();
        }
        this.loading = true;
        if (event) {
            this.getParams.page = event.first / event.rows + 1;
            this.getParams.pageSize = event.rows;
        }
        this.pendingRequest = this.roomTableService
            .getList(AppUtil.cleanObject(this.getParams))
            .subscribe((response: any) => {
                AppUtil.scrollToTop();
                this.deskFloors = response.data;
                this.totalRecords = response.totalItems || 0;
                this.totalPages = response.totalItems / response.pageSize + 1;
                this.loading = false;
            });
    }
}
