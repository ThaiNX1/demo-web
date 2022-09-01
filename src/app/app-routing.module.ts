import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './components/accounting-module/account/account.component';
import { AriseComponent } from './components/accounting-module/arise/arise.component';
import { BillsComponent } from './components/accounting-module/category-module/bills/bills.component';
import { EndOfTermEndingComponent } from './components/accounting-module/category-module/end-of-term-ending/end-of-term-ending.component';
import { TypeOfDocumentComponent } from './components/accounting-module/category-module/type-of-document/type-of-document.component';
import { ToolsFixedAssetsComponent } from './components/accounting-module/tools-fixed-assets/tools-fixed-assets.component';
import { CustomerTypeComponent } from './components/customer-module/customer-type/customer-type.component';
import { CustomersComponent } from './components/customer-module/customers/customers.component';
import { IncomingTextFormComponent } from './components/document-module/incoming-text/component/incoming-text-form.component';
import { IncomingTextComponent } from './components/document-module/incoming-text/incoming-text.component';
import { TextGoFormComponent } from './components/document-module/text-go/component/text-go-form.component';
import { TextGoComponent } from './components/document-module/text-go/text-go.component';
import { BranchComponent } from './components/employee-module/branch/branch.component';
import { BranchFormComponent } from './components/employee-module/branch/components/branch-form/branch-form.component';
import { DepartmentFormComponent } from './components/employee-module/department/components/department-form/department-form.component';
import { DepartmentComponent } from './components/employee-module/department/department.component';
import { EmployeeTypeFormComponent } from './components/employee-module/employee-type/employee-type-form/employee-type-form.component';
import { EmployeeTypeComponent } from './components/employee-module/employee-type/employee-type.component';
import { JobTitleDetailsComponent } from './components/employee-module/job-title-details/job-title-details.component';
import { ShiftComponent } from './components/employee-module/shift/shift.component';
import { SpecializedComponent } from './components/employee-module/specialized/specialized.component';
import { StoreFormComponent } from './components/employee-module/store/components/store-form/store-form.component';
import { StoreComponent } from './components/employee-module/store/store.component';
import { TimekeepingPositionComponent } from './components/employee-module/timekeeping-position/timekeeping-position.component';
import { TitleComponent } from './components/employee-module/title/title.component';
import { UserComponent } from './components/employee-module/user/user.component';
import { BeginDeclareComponent } from './components/main-module/begin-declare/begin-declare.component';
import { CompanyComponent } from './components/main-module/company/company.component';
import { DashboardComponent } from './components/main-module/dashboard/dashboard.component';
import { AccessComponent } from './components/others-module/access/access.component';
import { CrudComponent } from './components/others-module/crud/crud.component';
import { EmptyComponent } from './components/others-module/empty/empty.component';
import { ErrorComponent } from './components/others-module/error/error.component';
import { LandingComponent } from './components/others-module/landing/landing.component';
import { NotfoundComponent } from './components/others-module/notfound/notfound.component';
import { TimelineComponent } from './components/others-module/timeline/timeline.component';
import { RelationComponent } from './components/relationship-module/relation/relation.component';
import { RelativesComponent } from './components/relationship-module/relatives/relatives.component';
import { CashierComponent } from './components/sell-module/cashier/cashier.component';
import { ListOfGoodsComponent } from './components/sell-module/list-of-goods/list-of-goods.component';
import { PaymentHistoryComponent } from './components/sell-module/sell-report-module/payment-history/payment-history.component';
import { ProfitAfterTaxComponent } from './components/sell-module/sell-report-module/profit-after-tax/profit-after-tax.component';
import { ProfitBeforeTaxComponent } from './components/sell-module/sell-report-module/profit-before-tax/profit-before-tax.component';
import { SellDetailsBookComponent } from './components/sell-module/sell-report-module/sell-details-book/sell-details-book.component';
import { SellerComponent } from './components/sell-module/seller/seller.component';
import { AccountingLinkComponent } from './components/sell-module/setup-module/accounting-link/accounting-link.component';
import { ComboComponent } from './components/sell-module/setup-module/combo/combo.component';
import { DefectiveGoodsComponent } from './components/sell-module/setup-module/defective-goods/defective-goods.component';
import { InventoryControlComponent } from './components/sell-module/setup-module/inventory-control/inventory-control.component';
import { MenuOfGoodsComponent } from './components/sell-module/setup-module/menu-of-goods/menu-of-goods.component';
import { QuotaComponent } from './components/sell-module/setup-module/quota/quota.component';
import { RoomTableFormComponent } from './components/sell-module/setup-module/room-table/component/room-table-form/room-table-form.component';
import { RoomTableComponent } from './components/sell-module/setup-module/room-table/room-table.component';
import { WarehouseComponent } from './components/sell-module/warehouse/warehouse.component';
import { WebsiteOrdersComponent } from './components/sell-module/website-orders/website-orders.component';
import { TimekeepingHistoryComponent } from './components/timekeeping-module/timekeeping-history/timekeeping-history.component';
import { TimekeepingReportComponent } from './components/timekeeping-module/timekeeping-report/timekeeping-report.component';
import { TimekeepingComponent } from './components/timekeeping-module/timekeeping/timekeeping.component';
import { ForgotPasswordComponent } from './components/unauthenticate-module/forgot-password/forgot-password.component';
import { LoginComponent } from './components/unauthenticate-module/login/login.component';
import { BranchWebComponent } from './components/website-module/branch-web/branch-web.component';
import { IntroWebComponent } from './components/website-module/intro-web/intro-web.component';
import { NewsWebComponent } from './components/website-module/news-web/news-web.component';
import { ProductWebComponent } from './components/website-module/product-web/product-web.component';
import { RecruitWebComponent } from './components/website-module/recruit-web/recruit-web.component';
import { SliderWebComponent } from './components/website-module/slider-web/slider-web.component';
import { SocialNetworkWebComponent } from './components/website-module/social-network-web/social-network-web.component';
import { WorkflowTypeComponent } from './components/workflow-module/workflow-type/workflow-type.component';
import { WorkflowComponent } from './components/workflow-module/workflow/workflow.component';
import { AuthGuard } from './interceptor/auth-guard.service';
import { AppMainComponent } from './layouts/app.main.component';
import {WorkflowFormComponent} from "./components/workflow-module/workflow/workflow-form/workflow-form.component";
import {DocumentTypeComponent} from "./components/document-module/document-type/document-type.component";
import { CustomerStatusComponent } from './components/customer-module/customer-status/customer-status.component';
import { CustomerJobComponent } from './components/customer-module/customer-job/customer-job.component';
import { DecideComponent } from './components/employee-module/decide/decide.component';
import { AchievementsComponent } from './components/employee-module/achievements/achievements.component';
import { InternalBalanceAccountComponent } from './components/accounting-module/internal-report-module/balance-account/internal-balance-account.component';
import { OverreachBalanceAccountComponent } from './components/accounting-module/overreach-report-module/balance-account/overreach-balance-account.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: '', component: LoginComponent },
                { path: 'forgot-password', component: ForgotPasswordComponent },
                {
                    path: 'uikit',
                    // canActivate: [AuthGuard],
                    component: AppMainComponent,
                    children: [
                        { path: '', component: DashboardComponent },
                        // main module
                        { path: 'company-info', component: CompanyComponent },
                        {
                            path: 'odd-decimal',
                            component: BeginDeclareComponent,
                        },
                        // employee module
                        {
                            path: 'employee',
                            component: UserComponent,
                        },
                        {
                            path: 'decide',
                            component: DecideComponent,
                        },
                        {
                            path: 'achievements',
                            component: AchievementsComponent,
                        },
                        {
                            path: 'branch',
                            component: BranchComponent,
                        },
                        {
                            path: 'store',
                            component: StoreComponent,
                        },
                        {
                            path: 'employee-type',
                            component: EmployeeTypeComponent,
                        },
                        {
                            path: 'employee-type/:id',
                            component: EmployeeTypeFormComponent,
                        },
                        {
                            path: 'specialized',
                            component: SpecializedComponent,
                        },
                        {
                            path: 'department',
                            component: DepartmentComponent,
                        },
                        {
                            path: 'department/:id',
                            component: DepartmentFormComponent,
                        },
                        {
                            path: 'title',
                            component: TitleComponent,
                        },
                        {
                            path: 'job-title-details',
                            component: JobTitleDetailsComponent,
                        },
                        {
                            path: 'timekeeping-position',
                            component: TimekeepingPositionComponent,
                        },
                        {
                            path: 'shift',
                            component: ShiftComponent,
                        },

                        // relationship module
                        {
                            path: 'relatives',
                            component: RelativesComponent,
                        },
                        {
                            path: 'relation',
                            component: RelationComponent,
                        },

                        // customer module
                        {
                            path: 'customers',
                            component: CustomersComponent,
                        },
                        {
                            path: 'customer-type',
                            component: CustomerTypeComponent,
                        },
                        {
                            path: 'customer-status',
                            component: CustomerStatusComponent,
                        },
                        {
                            path: 'customer-job',
                            component: CustomerJobComponent,
                        },

                        // timekeeping module
                        {
                            path: 'timekeeping',
                            component: TimekeepingComponent,
                        },
                        {
                            path: 'timekeeping-history',
                            component: TimekeepingHistoryComponent,
                        },
                        {
                            path: 'timekeeping-report',
                            component: TimekeepingReportComponent,
                        },

                        // workflow module
                        {
                            path: 'workflow',
                            component: WorkflowComponent,
                        },
                        {
                            path: 'workflow/:id',
                            component: WorkflowFormComponent,
                        },
                        {
                            path: 'workflow-type',
                            component: WorkflowTypeComponent,
                        },

                        // sell module
                        {
                            path: 'cashier',
                            component: CashierComponent,
                        },
                        {
                            path: 'seller',
                            component: SellerComponent,
                        },
                        {
                            path: 'warehouse',
                            component: WarehouseComponent,
                        },
                        {
                            path: 'website-orders',
                            component: WebsiteOrdersComponent,
                        },
                        {
                            path: 'list-of-goods',
                            component: ListOfGoodsComponent,
                        },

                        // setup module
                        {
                            path: 'setup',
                            children: [
                                {
                                    path: 'room-table',
                                    component: RoomTableComponent,
                                },
                                {
                                    path: 'quota',
                                    component: QuotaComponent,
                                },
                                {
                                    path: 'combo',
                                    component: ComboComponent,
                                },
                                {
                                    path: 'menu-of-goods',
                                    component: MenuOfGoodsComponent,
                                },
                                {
                                    path: 'inventory-control',
                                    component: InventoryControlComponent,
                                },
                                {
                                    path: 'defective-goods',
                                    component: DefectiveGoodsComponent,
                                },
                                {
                                    path: 'accounting-link',
                                    component: AccountingLinkComponent,
                                },
                            ],
                        },

                        // sell report module
                        {
                            path: 'sell-report',
                            children: [
                                {
                                    path: 'payment-history',
                                    component: PaymentHistoryComponent,
                                },
                                {
                                    path: 'profit-before-tax',
                                    component: ProfitBeforeTaxComponent,
                                },
                                {
                                    path: 'profit-after-tax',
                                    component: ProfitAfterTaxComponent,
                                },
                                {
                                    path: 'sell-details-book',
                                    component: SellDetailsBookComponent,
                                },
                            ],
                        },

                        // accounting module
                        {
                            path: 'arise',
                            component: AriseComponent,
                        },
                        {
                            path: 'account',
                            component: AccountComponent,
                        },
                        {
                            path: 'list-of-goods',
                            component: ListOfGoodsComponent,
                        },

                        // category module
                        {
                            path: 'category',
                            children: [
                                {
                                    path: 'type-of-document',
                                    component: TypeOfDocumentComponent,
                                },
                                {
                                    path: 'bills',
                                    component: BillsComponent,
                                },
                                {
                                    path: 'end-of-term-ending',
                                    component: EndOfTermEndingComponent,
                                },
                            ],
                        },

                        // overreach Report module
                        {
                            path: 'overreach',
                            children: [
                                {
                                    path: 'balance-account',
                                    component: OverreachBalanceAccountComponent,
                                },
                            ],
                        },

                        // internal report module
                        {
                            path: 'internal',
                            children: [
                                {
                                    path: 'balance-account',
                                    component: InternalBalanceAccountComponent,
                                },
                            ],
                        },

                        {
                            path: 'tools-fixed-assets',
                            component: ToolsFixedAssetsComponent,
                        },

                        // document module
                        {
                            path: 'incoming-text',
                            component: IncomingTextComponent,
                        },
                        {
                            path: 'incoming-text/:id',
                            component: IncomingTextFormComponent,
                        },
                        {
                            path: 'text-go',
                            component: TextGoComponent,
                        },
                        {
                            path: 'text-go/:id',
                            component: TextGoFormComponent,
                        },
                        {
                            path: 'document-type',
                            component: DocumentTypeComponent,
                        },

                        // website module
                        {
                            path: 'slider-web',
                            component: SliderWebComponent,
                        },
                        {
                            path: 'intro-web',
                            component: IntroWebComponent,
                        },
                        {
                            path: 'product-web',
                            component: ProductWebComponent,
                        },
                        {
                            path: 'branch-web',
                            component: BranchWebComponent,
                        },
                        {
                            path: 'recruit-web',
                            component: RecruitWebComponent,
                        },
                        {
                            path: 'news-web',
                            component: NewsWebComponent,
                        },
                        {
                            path: 'social-network-web',
                            component: SocialNetworkWebComponent,
                        },

                        // others module
                        { path: 'pages/crud', component: CrudComponent },
                        {
                            path: 'pages/timeline',
                            component: TimelineComponent,
                        },
                        { path: 'pages/empty', component: EmptyComponent },
                    ],
                },
                { path: 'pages/landing', component: LandingComponent },
                { path: 'pages/error', component: ErrorComponent },
                { path: 'pages/notfound', component: NotfoundComponent },
                { path: 'pages/access', component: AccessComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
