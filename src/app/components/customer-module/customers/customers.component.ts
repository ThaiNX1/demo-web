import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColumnFilter, Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api'
import { TypeData } from 'src/app/models/common.model';
import { environment } from 'src/environments/environment';
import AppUtil from 'src/app/utilities/app-util';
import { DistrictService } from 'src/app/service/district.service';
import { District } from 'src/app/models/district.model';
import { ProvinceService } from 'src/app/service/province.service';
import { WardService } from 'src/app/service/ward.service';
import { Province } from 'src/app/models/province.model';
import { Ward } from 'src/app/models/ward.model';
import { TranslateService } from '@ngx-translate/core';
import AppConstant from 'src/app/utilities/app-constants';
import { UserRoleService } from 'src/app/service/user-role.service';
import { BranchService } from 'src/app/service/branch.service';
import { MajorService } from 'src/app/service/major.service';
import { StoreService } from 'src/app/service/store.service';
import { PositionDetailService } from 'src/app/service/position-detail.service';
import { TargetService } from 'src/app/service/target.service';
import { SymbolService } from 'src/app/service/symbol.service';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { CustomersFormComponent } from './components/customers-form/customers-form.component';
import { CustomerService, PageFilterCustomer } from 'src/app/service/customer.service';
import { Customer } from 'src/app/models/customer.model';
import { CustomerTaxService } from 'src/app/service/customer-tax.service';
import { CustomerTax } from 'src/app/models/customer-tax.model';
import { IsFunnelChartModel } from 'src/app/shared/is-funnel-chart/is-funnel-chart.model';
import { forkJoin } from 'rxjs';
@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    providers: [MessageService, ConfirmationService],
    styleUrls: ['../../../../assets/demo/badges.scss'],
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
        `,
    ],
})
export class CustomersComponent implements OnInit {
    public appConstant = AppConstant;
    @ViewChild('customersForm') customersFormComponent: CustomersFormComponent | undefined;

    loading: boolean = true;

    sortFields: any[] = [];
    sortTypes: any[] = [];

    pendingRequest: any;

    first = 0;

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    public getParams: PageFilterCustomer = {
        page: 1,
        pageSize: 5,
        sortField: 'id',
        isSort: true,
        keyword: '',
    };
    public totalRecords = 0;
    public totalPages = 0;
    public myTarget: number;

    public isLoading: boolean = false;

    public lstCustomers: Customer[] = [];

    display: boolean = false;

    isMobile = screen.width <= 1199;

    formData: any = {};
    formCustomerTaxData: any = {};
    isEdit: boolean = false;
    isReset: boolean = false;

    districts: District[] = [];
    provinces: Province[] = [];
    nativeProvinces: Province[] = [];
    wards: Ward[] = [];
    roles: any[] = [];
    branches: any[] = [];
    majors: any[] = [];
    warehouses: any[] = [];
    positionDetails: any[] = [];
    targets: any[] = [];
    symbols: any[] = [];
    contractTypes: any[] = [];

    statisChartCustomerData: IsFunnelChartModel;
    statisticsBirthdayInMonthData: any;

    constructor(
        private messageService: MessageService,
        private readonly customerService: CustomerService,
        private readonly districtService: DistrictService,
        private readonly provinceService: ProvinceService,
        private readonly wardService: WardService,
        private readonly translateService: TranslateService,
        private readonly userRoleService: UserRoleService,
        private readonly branchService: BranchService,
        private readonly majorService: MajorService,
        private readonly warehouseService: StoreService,
        private readonly positionDetailService: PositionDetailService,
        private readonly targetService: TargetService,
        private readonly symbolService: SymbolService,
        private readonly contractTypeService: ContractTypeService,
        private readonly confirmationService: ConfirmationService,
        private readonly customerTaxService: CustomerTaxService,
        private _host: ElementRef
    ) {}

    ngOnInit() {
        this.getListDistrict();
        this.getListProvince();
        this.getListWard();
        this.getListRole();
        this.getListBranch();
        this.getListMajor();
        this.getListWarehouse();
        this.getListPositionDetail();
        this.getListTarget();
        this.getListSymbol();
        this.getListContractType();
        this.getStatisData();
        AppUtil.getCustomerSortTypes(this.translateService).subscribe((res) => {
            this.sortFields = res;
        });
        AppUtil.getSortTypes(this.translateService).subscribe((res) => {
            this.sortTypes = res;
        });
    }

    getStatisData() {
        this.statisChartCustomerData = new IsFunnelChartModel({
            labels: [
                'Khách truy cập',
                'Khách tiềm năng',
                'Khách chất lượng',
                'Khách mua hàng'
            ],
            backgroundColors: [
                '#FF6384', '#FFCE56', '#36A2EB', "#66BB6A",
            ],                            
            data: [
                '2.000', '1.500', '1.000', '500'
            ]
        });

        forkJoin([
            AppUtil.translate$(this.translateService, 'label.month_prefix'),
            AppUtil.translate$(this.translateService, 'label.male'),
            AppUtil.translate$(this.translateService, 'label.female')
        ])
        .subscribe(([monthPrefix, male, female]) => {
            this.statisticsBirthdayInMonthData = {
                labels: [1,2,3,4,5,6,7,8,9,10,11,12].map(a => monthPrefix + a),
                datasets: [
                    {
                        label: male,
                        backgroundColor: [
                            '#EC407A',
                            '#AB47BC',
                            '#42A5F5',
                            '#7E57C2',
                            '#66BB6A',
                            '#FFCA28',
                            '#26A69A',
                        ],
                        yAxisID: 'y',
                        data: [1,2,3,4,5,6,7,8,9,10,11,12],
                    },
                    {
                        label: female,
                        backgroundColor: '#78909C',
                        yAxisID: 'y1',
                        data: [1,2,3,4,5,6,7,8,9,10,11,12],
                    },
                ]
            };
        });

    }

    formatCurrency(value) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    onSearch(event) {
        if (event.key === 'Enter') {
            this.getCustomers();
        }
    }

    onChangeSort(event, type) {
        if (type === 'sortType') {
            this.getParams.isSort = event.value;
        }
        this.getCustomers();
    }

    clearFilter(columnFilter: ColumnFilter, field: string) {
        columnFilter.clearFilter();
    }

    private openDownloadFile(_fileName: string, _ft: string) {
        try {
            this.isLoading = false;
            var _l = this.customerService.getFolderPathDownload(_fileName, _ft);
            if (_l) window.open(_l);
        } catch (ex) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'File invalid',
            });
        }
    }

    getCustomers(event?: any, isExport: boolean = false): void {
        if (this.pendingRequest) {
            this.pendingRequest.unsubscribe();
        }
        this.loading = true;
        if (event) {
            //     this.first = event.first / event.rows;
            //     this.getParams.ascSort = event.sortOrder === 1;
            //     this.getParams.pageNumber = event.first / event.rows + 1;
            //     this.getParams.pageSize = event.rows;
            this.getParams.page = event.first / event.rows + 1;
            this.getParams.pageSize = event.rows;
        }
        if (isExport) {
            this.customerService
                .getExcelReport(this.getParams)
                .subscribe((res: any) => {
                    AppUtil.scrollToTop();
                    this.openDownloadFile(res.data, 'excel');
                });
        }
        // remove undefined value
        Object.keys(this.getParams).forEach(
            (k) => this.getParams[k] == null && delete this.getParams[k]
        );
        console.log('this params', this.getParams);

        this.pendingRequest = this.customerService
            .getPagingCustomer(this.getParams)
            .subscribe((response: TypeData<Customer>) => {
                AppUtil.scrollToTop();
                this.lstCustomers = response.data;
                this.totalRecords = response.totalItems || 0;
                this.totalPages = response.totalItems / response.pageSize + 1;
                this.loading = false;
            });
    }

    getDetail(customerId: number) {
        this.customerService.getCustomerDetail(customerId).subscribe((response: any) => {
            this.formData = response.data;
            this.isEdit = true;
            this.showDialog();
        });
        this.getCustomerTaxDetail(customerId);
    }

    getCustomerTaxDetail(customerId: number) {
        this.customerTaxService.getCustomerTaxDetailByCustomerId(customerId).subscribe((response: CustomerTax) => {
            this.formCustomerTaxData = response;
            this.isEdit = true;
            this.showDialog();
        });
    }

    onDelete(userId) {
        let message;
        this.translateService
            .get('question.delete_customer_content')
            .subscribe((res) => {
                message = res;
            });
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.customerService
                    .deleteCustomer(userId)
                    .subscribe((response: Customer) => {
                        this.getCustomers();
                    });
            },
        });
    }

    baseUrlImage(image) {
        return `${environment.serverURL}/${image}`;
    }

    showDialog() {
        this.customersFormComponent.onReset();
        this.display = true;
    }

    getListAccountCustomer() {

    }

    getListDistrict() {
        this.districtService
            .getListDistrict()
            .subscribe((response: District[]) => {
                this.districts = response;
            });
    }

    getListProvince() {
        this.provinceService
            .getListProvince()
            .subscribe((response: Province[]) => {
                this.provinces = response;
                this.nativeProvinces = this.provinces;
            });
    }

    getListWard() {
        this.wardService.getListWard().subscribe((response: Ward[]) => {
            this.wards = response;
        });
    }

    getListRole() {
        this.userRoleService.getAllUserRole().subscribe((response: any) => {
            console.log(this.roles);
            this.roles = response.data;
        });
    }

    getListBranch() {
        this.branchService.getAllBranch().subscribe((response: any) => {
            this.branches = response.data;
        });
    }

    getListMajor() {
        this.majorService.getAllMajor().subscribe((response: any) => {
            this.majors = response.data;
        });
    }

    getListWarehouse() {
        this.warehouseService.getAllStore().subscribe((response: any) => {
            this.warehouses = response.data;
        });
    }

    getListPositionDetail() {
        this.positionDetailService
            .getAllPositionDetail()
            .subscribe((response: any) => {
                this.positionDetails = response.data;
            });
    }

    getListTarget() {
        this.targetService.getAllTarget().subscribe((response: any) => {
            this.targets = response.data;
        });
    }

    getListSymbol() {
        this.symbolService.getAllSymbol().subscribe((response: any) => {
            this.symbols = response.data;
        });
    }

    getListContractType() {
        this.contractTypeService.getAllContractType().subscribe((response: any) => {
            this.contractTypes = response.data;
        });
    }

    getRoleName(id) {
        let role = this.roles.find((x) => x.id === id);
        return role ? role.title : '';
    }
}
