import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ColumnFilter, Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api'
import { TypeData } from 'src/app/models/common.model';
import { environment } from 'src/environments/environment';
import AppUtil from 'src/app/utilities/app-util';
import { User, UserStatisticsModel } from 'src/app/models/user.model';
import { DistrictService } from 'src/app/service/district.service';
import { District } from 'src/app/models/district.model';
import { ProvinceService } from 'src/app/service/province.service';
import { WardService } from 'src/app/service/ward.service';
import { Province } from 'src/app/models/province.model';
import { Ward } from 'src/app/models/ward.model';
import { TranslateService } from '@ngx-translate/core';
import { UserFormComponent } from './components/user-form/user-form.component';
import AppConstant from 'src/app/utilities/app-constants';
import { PageFilterUser, UserService } from 'src/app/service/user.service';
import { UserRoleService } from 'src/app/service/user-role.service';
import { BranchService } from 'src/app/service/branch.service';
import { MajorService } from 'src/app/service/major.service';
import { StoreService } from 'src/app/service/store.service';
import { PositionDetailService } from 'src/app/service/position-detail.service';
import { TargetService } from 'src/app/service/target.service';
import { SymbolService } from 'src/app/service/symbol.service';
import { ContractTypeService } from 'src/app/service/contract-type.service';
import { DocumentService } from 'src/app/service/document.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

type AOA = any[][];

@Component({
    templateUrl: './user.component.html',
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
export class UserComponent implements OnInit {
    public appConstant = AppConstant;
    @ViewChild('userForm') userFormComponent: UserFormComponent | undefined;

    loading: boolean = true;

    sortFields: any[] = [];
    sortTypes: any[] = [];

    pendingRequest: any;

    first = 0;
    serverImg = environment.serverURLImage + '/'
    number_order_display=true;
    avatar_display = true;
    code_display = true;
    full_name_display = true;
    gender_display = true;
    birthday_display = true;
    phone_number_display = true;
    identify_display = true;
    send_salary_Date_display = true;
    department_display = true;
    role_display = false;
    last_login_display = false;
    cols:any[] =[
        {header:"label.number_order", value:"id",width:"width:70px",display:true,classify:"personal_info",optionHide:false},
        {header:"label.avatar", value:`avatar`,width:"width:100px",display:true,classify:"personal_info",optionHide:false},
        {header:"label.code", value:"username",width:"width:100px",display:true,classify:"account",optionHide:false},
        {header:"label.full_name", value:"fullName",width:"width:200px",display:true,classify:"personal_info",optionHide:false},
        {header:"label.gender", value:"gender",width:"width:100px",display:true,classify:"personal_info",optionHide:true},
        {header:"label.birthday", value:"birthDay",width:"width:120px",display:true,classify:"personal_info",optionHide:true},
        {header:"label.phone_number", value:"phone",width:"width:120px",display:true,classify:"personal_info",optionHide:true},
        {header:"label.identify", value:"identify",width:"width:150px",display:false,classify:"personal_info",optionHide:true},
        {header:"label.send_salary_Date", value:"sendSalaryDate",width:"width:150px",display:false,classify:"identify",optionHide:true},
        {header:"label.department", value:"departmentName",width:"width:150px",display:true,classify:"account",optionHide:true},
        {header:"label.branch", value:"branchId",width:"width:150px",display:false,classify:"account",optionHide:true},
        {header:"label.warehouse", value:"warehouse",width:"width:150px",display:false,classify:"account",optionHide:true},
        {header:"label.role", value:"userRoleName",width:"width:150px",display:true,classify:"account",optionHide:true},
        {header:"label.position_detail", value:"positionDetailId",width:"width:150px",display:false,classify:"account",optionHide:true},
        {header:"label.language", value:"language",width:"width:150px",display:false,classify:"account",optionHide:true},
        {header:"label.note", value:"note",width:"width:150px",display:false,classify:"account",optionHide:true},
        {header:"label.last_login", value:"lastLogin",width:"width:150px",display:false,classify:"account",optionHide:true},
        {header:"label.address", value:"addressFull",width:"width:150px",display:false,classify:"personal_info",optionHide:true},
        {header:"label.facebook", value:"facebook",width:"width:150px",display:false,classify:"personal_info",optionHide:true},
        {header:"label.email", value:"email",width:"width:150px",display:false,classify:"personal_info",optionHide:true},
        {header:"label.religion", value:"religion",width:"width:150px",display:false,classify:"personal_info",optionHide:true},
        {header:"label.license_plates", value:"licensePlates",width:"width:150px",display:false,classify:"personal_info",optionHide:true},
        {header:"label.literacy", value:"literacy",width:"width:150px",display:false,classify:"education",optionHide:true},
        {header:"label.literacy_detail", value:"literacyDetail",width:"width:150px",display:false,classify:"education",optionHide:true},
        {header:"label.major", value:"majorId",width:"width:150px",display:false,classify:"education",optionHide:true},
        {header:"label.certificate", value:"certificateOther",width:"width:150px",display:false,classify:"education",optionHide:true},
        {header:"label.bank_account", value:"bankAccount",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.bank_name", value:"bank",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.share_holder_code", value:"shareHolderCode",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.no_of_leave_date", value:"noOfLeaveDate",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.send_salary_date", value:"sendSalaryDate",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.number_of_workdays", value:"numberWorkdays",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.salary", value:"salary",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.social_insurance_salary", value:"socialInsuranceSalary",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.day_off", value:"dayOff",width:"width:150px",display:false,classify:"salary_leave_share_holder_number",optionHide:true},
        {header:"label.personal_tax_code", value:"personalTaxCode",width:"width:150px",display:false,classify:"personal_tax",optionHide:true},
        {header:"label.social_insurance_created", value:"socialInsuranceCreated",width:"width:150px",display:false,classify:"personal_tax",optionHide:true},
        {header:"label.social_insurance_code", value:"socialInsuranceCode",width:"width:150px",display:false,classify:"personal_tax",optionHide:true},

    ]

    @ViewChild('dt') table: Table;

    @ViewChild('filter') filter: ElementRef;

    public getParams: PageFilterUser = {
        page: 1,
        pageSize: 5,
        sortField: 'id',
        isSort: true,
        keyword: '',
    };
    public paramsSearch:PageFilterUser ={
        page: 0
    };
    public totalRecords = 0;
    public totalPages = 0;
    public myTarget: number;

    public isLoading: boolean = false;

    public lstUsers: User[] = [];

    display: boolean = false;

    isMobile = screen.width <= 1199;

    formData: any = {};
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
    positions: any[]=[];
    departments: any[]=[];
    degrees: any[]=[];
    certificates: any[]=[];
    chooseSearhBirth:boolean=false;
    searchFor:any[] = [{key:"forAge",value:false,label:"label.forAge"},{key:"forBirth",value:true,label:"label.forBirth"}]
    requestToResetPassword: any[]= [{key:'all', value:false,label:"label.all"},{key:"not_request",value: true,label:"label.not_request"}];
    status: any[] =[{key:'Tất cả', value:""},{key:"Đang làm",value: true},{key:"Đã nghỉ việc",value: false}];
    genders: any[] =[{key:'Tất cả', value:-1},{key:"Nam",value: 1},{key:"Nữ",value: 1}];
    searchAdvancedForm: FormGroup = new FormGroup({});

    userStatisticsGenderData: any;
    userStatisticsBirthdayInMonthData: any;

    constructor(
        private messageService: MessageService,
        private readonly userService: UserService,
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
        private readonly documentService: DocumentService,
        private fb: FormBuilder,
    ) {
     this.initForm()
    }

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
        this.getListPosition();
        this.getListDeparments();
        this.getListDegrees();
        this.geListtCertificate();
        this.getUserStatistics();
        AppUtil.getUserSortTypes(this.translateService).subscribe((res) => {
            this.sortFields = res;
        });
        AppUtil.getSortTypes(this.translateService).subscribe((res) => {
            this.sortTypes = res;
        });
        // console.log(this.documentService.getTargetsList());
    }
    initForm(){
        this.searchAdvancedForm = this.fb.group({
            chooseSearhBirth:[''],
            keyword:[''],
            startDate:[''],
            endDate:[''],
            startAge:null,
            endAge:null,
            department:[''],
            position:[''],
            target:[''],
            degree:[''],
            certificate:[''],
            gender:[''],
            quit:[''],
            resetPassword:[''],
        })
    }
    formatCurrency(value) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    onSearch(event) {
        if (event.key === 'Enter') {
            this.getUsers();
        }
    }

    onChangeSort(event, type) {
        if (type === 'sortType') {
            this.getParams.isSort = event.value;
        }
        this.getUsers();
    }

    clearFilter(columnFilter: ColumnFilter, field: string) {
        columnFilter.clearFilter();
    }

    private openDownloadFile(_fileName: string, _ft: string) {
        try {
            this.isLoading = false;
            var _l = this.userService.getFolderPathDownload(_fileName, _ft);
            if (_l) window.open(_l);
        } catch (ex) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'File invalid',
            });
        }
    }

    getUsers(event?: any, isExport: boolean = false): void {
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
            this.userService
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
        // console.log('this params', this.getParams);

        this.pendingRequest = this.userService
            .getPagingUser(this.getParams)
            .subscribe((response: TypeData<User>) => {
                AppUtil.scrollToTop();
                this.lstUsers = response.data;
                this.totalRecords = response.totalItems || 0;
                this.totalPages = response.totalItems / response.pageSize + 1;
                this.loading = false;
            });
            
    }

    getDetail(userId) {
        this.userService.getUserDetail(userId).subscribe((response: User) => {
            this.formData = response;
            this.isEdit = true;
            this.showDialog();
        });
    }

    onDelete(userId) {
        let message;
        this.translateService
            .get('question.delete_user_content')
            .subscribe((res) => {
                message = res;
            });
        this.confirmationService.confirm({
            message: message,
            accept: () => {
                this.userService
                    .deleteUser(userId)
                    .subscribe((response: User) => {
                        this.getUsers();
                    });
            },
        });
    }

    baseUrlImage(image) {
        return `${environment.serverURL}/${image}`;
    }

    showDialog() {
        this.userFormComponent.onReset();
        this.display = true;
    }

    getListPosition(){
        this.documentService.getPositionList().subscribe(data =>{
            this.positions = data.data;
        })
    }

    getListDeparments(){
        this.documentService.getDepartmentList().subscribe(data =>{
            this.departments = data.data;
        })
    }
    getListDegrees(){
        this.documentService.getDegreeList().subscribe(data =>{
            this.degrees = data.data;
        })
    }

    geListtCertificate(){
        this.documentService.getCertificatesList().subscribe(data =>{
            this.certificates = data.data;
        })
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
    onUpload(e){
        console.log(e);

    }
    search(){
        if(this.searchAdvancedForm.value.keyword){
            this.paramsSearch.keyword = this.searchAdvancedForm.value.keyword
        }
        if(!this.chooseSearhBirth){
            
            if(this.searchAdvancedForm.value.startAge!=null){
                let tmp = new Date();
                tmp.setFullYear(tmp.getFullYear(),1,1)
                tmp.setHours(0,0,0,0)
                let startAge: number = this.searchAdvancedForm.value.startAge
                tmp.setFullYear(tmp.getFullYear()- startAge,11,31)
                this.paramsSearch.endDate =  moment(tmp).format("YYYY-MM-DDTh:mm:ss");
                console.log("startAge",moment(moment(tmp).format("YYYY-MM-DDTh:mm:ss"),"YYYY-MM-DDTh:mm:ss"));
                // this.paramsSearch.endDate = moment(moment(tmp).format("YYYY-MM-DDTh:mm:ss"),"YYYY-MM-DDTh:mm:ss")
            }
            if(this.searchAdvancedForm.value.endAge !=null && this.searchAdvancedForm.value.endAge>=this.searchAdvancedForm.value.startAge){
                let tmp = new Date();
                tmp.setFullYear(tmp.getFullYear(),1,1);
                tmp.setHours(0,0,0,0)
                let endAge: number = this.searchAdvancedForm.value.endAge
                tmp.setFullYear(tmp.getFullYear()- endAge,0,1)
                this.paramsSearch.startDate = moment(tmp).format("YYYY-MM-DDTh:mm:ss")
            }   
        }
        else{
            
            if(this.searchAdvancedForm.value.startDate){
                this.paramsSearch.startDate =  moment(this.searchAdvancedForm.value.startDate).format("YYYY-MM-DDTh:mm:ss") 
            }
            if(this.searchAdvancedForm.value.endDate){
            this.paramsSearch.startDate =moment(this.searchAdvancedForm.value.endDate).format("YYYY-MM-DDTh:mm:ss") 
            }   
        }
         
        if(this.searchAdvancedForm.value.department){
            this.paramsSearch.departmentId =this.searchAdvancedForm.value.department.id
        }   
        if(this.searchAdvancedForm.value.position){
            this.paramsSearch.positionId =this.searchAdvancedForm.value.position.id
        }  
        if(this.searchAdvancedForm.value.target){
            this.paramsSearch.targetId =this.searchAdvancedForm.value.target.id
        }  
        if(this.searchAdvancedForm.value.degree){
            this.paramsSearch.degreeId =this.searchAdvancedForm.value.degree.id
        }  
        if(this.searchAdvancedForm.value.certificate){
            this.paramsSearch.certificatedId =this.searchAdvancedForm.value.certificate.id
        }  
         if(this.searchAdvancedForm.value.gender){
            this.paramsSearch.gender =this.searchAdvancedForm.value.gender.value
        }  
         if(this.searchAdvancedForm.value.quit){
            this.paramsSearch.quit =this.searchAdvancedForm.value.quit.value
        }  
         if(this.searchAdvancedForm.value.resetPassword){
            this.paramsSearch.requestPassword =this.searchAdvancedForm.value.resetPassword.value
        }  
        this.pendingRequest = this.userService
            .getPagingUser(this.paramsSearch)
            .subscribe((response: TypeData<User>) => {
                AppUtil.scrollToTop();
                this.lstUsers = response.data;
                this.totalRecords = response.totalItems || 0;
                this.totalPages = response.totalItems / response.pageSize + 1;
                this.loading = false;
            });
        
    }
    resetForm(){
        this.searchAdvancedForm.setValue({
            chooseSearhBirth:false,
            keyword:null,
            startDate:null,
            endDate:null,
            startAge:null,
            endAge:null,
            department:null,
            position:null,
            target:null,
            degree:null,
            certificate:null,
            gender:null,
            quit:null,
            resetPassword:null,
        })
    }

    getUserStatistics() {
        this.userService.userStatistics().subscribe(response => {
            const userStatisticsData = response.data as UserStatisticsModel;
            this.userStatisticsGenderData = {
                labels: [
                    AppUtil.translateWithParams(this.translateService, 'label.male_number', {number: userStatisticsData.totalMale}),
                    AppUtil.translateWithParams(this.translateService, 'label.female_number', {number: userStatisticsData.totalFemale}),
                ],
                datasets: [
                    {
                        data: [
                            userStatisticsData.totalMale,
                            userStatisticsData.totalFemale,
                        ],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    }
                ]
            };

            this.userStatisticsBirthdayInMonthData = {
                labels: userStatisticsData.birthDayOfUsers.map(a => AppUtil.translateWithParams(this.translateService, 'label.number_month', {month: a.month})),
                datasets: [
                    {
                        label: AppUtil.translate(this.translateService, 'label.male'),
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
                        data: userStatisticsData.birthDayOfUsers.map(a => a.male),
                    },
                    {
                        label: AppUtil.translate(this.translateService, 'label.female'),
                        backgroundColor: '#78909C',
                        yAxisID: 'y1',
                        data: userStatisticsData.birthDayOfUsers.map(a => a.female),
                    },
                ]
            };
        })
    }

    onSelectBirthdayMonth(event: any) {
        const selectedMonth = event.element.index + 1;
        this.getParams.month = selectedMonth;
        this.getUsers();
    }
}
