import { Component, OnInit } from '@angular/core';
import { AuthData } from '../models/auth.model';
import { AuthService } from '../service/auth.service';
import { LayoutService } from '../service/system-setting/app.layout.service';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styles: [
        `
            :host ::ng-deep {
                #year .p-calendar {
                    max-width: 100px;
                }

                #year .p-calendar .p-inputtext {
                    text-align: center;
                    min-width: 50px;
                }

                #year .p-calendar .p-datepicker {
                    min-width: 200px;
                    z-index: 100000 !important;
                }
            }
        `,
    ],
})
export class AppMenuComponent implements OnInit {
    model: any[];
    selectedYear: any = new Date();

    constructor(
        public appMain: AppMainComponent,
        private authService: AuthService,
        public layoutService: LayoutService,
    ) {}

    ngOnInit() {
        console.log(this.authService.user);
        let user = Object.assign({}, this.authService.user);
        // if (user.roleName === 'admin') {
        // }
        this.model = [
            {
                // home
                label: 'left_menu.home',
                items: [
                    {
                        label: 'left_menu.dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/uikit'],
                    },
                ],
            },
            {
                // category
                label: 'left_menu.categories',
                items: [
                    {
                        // employee
                        label: 'left_menu.employee_management',
                        icon: 'pi pi-fw pi-id-card',
                        items: [
                            {
                                label: 'left_menu.employee',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['/uikit/employee'],
                            },
                            {
                                label: 'left_menu.decide',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['/uikit/decide'],
                            },
                            {
                                label: 'left_menu.achievements',
                                icon: 'pi pi-fw pi-sitemap',
                                routerLink: ['/uikit/achievements'],
                            },
                            {
                                label: 'left_menu.branch',
                                icon: 'pi pi-fw pi-sitemap',
                                routerLink: ['/uikit/branch'],
                            },
                            {
                                label: 'left_menu.store',
                                icon: 'pi pi-fw pi-sun',
                                routerLink: ['/uikit/store'],
                            },
                            {
                                label: 'left_menu.employee_type',
                                icon: 'pi pi-fw pi-reddit',
                                routerLink: ['/uikit/employee-type'],
                            },
                            {
                                label: 'left_menu.specialized',
                                icon: 'pi pi-fw pi-user-edit',
                                routerLink: ['/uikit/specialized'],
                            },
                            {
                                label: 'left_menu.department',
                                icon: 'pi pi-fw pi-building',
                                routerLink: ['/uikit/department'],
                            },
                            {
                                label: 'left_menu.title',
                                icon: 'pi pi-fw pi-sort',
                                routerLink: ['/uikit/title'],
                            },
                            {
                                label: 'left_menu.job_title_details',
                                icon: 'pi pi-fw pi-user-minus',
                                routerLink: ['/uikit/job-title-details'],
                            },
                            {
                                label: 'left_menu.timekeeping_position',
                                icon: 'pi pi-fw pi-stop-circle',
                                routerLink: ['/uikit/timekeeping-position'],
                            },
                            {
                                label: 'left_menu.shift',
                                icon: 'pi pi-fw pi-tag',
                                routerLink: ['/uikit/shift'],
                            },
                        ],
                    },
                    {
                        // relationship
                        label: 'left_menu.relationship',
                        icon: 'pi pi-fw pi-sitemap',
                        items: [
                            {
                                label: 'left_menu.relatives',
                                icon: 'pi pi-fw pi-user-plus',
                                routerLink: ['/uikit/relatives'],
                            },
                            {
                                label: 'left_menu.relation',
                                icon: 'pi pi-fw pi-sitemap',
                                routerLink: ['/uikit/relation'],
                            },
                        ],
                    },
                    {
                        // customer
                        label: 'left_menu.customer',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'left_menu.customers',
                                icon: 'pi pi-fw pi-users',
                                routerLink: ['/uikit/customers'],
                            },
                            {
                                label: 'left_menu.customer_type',
                                icon: 'pi pi-fw pi-id-card',
                                routerLink: ['/uikit/customer-type'],
                            },
                            {
                                label: 'left_menu.customer_status',
                                icon: 'pi pi-fw pi-comment',
                                routerLink: ['/uikit/customer-status'],
                            },
                            {
                                label: 'left_menu.customer_job',
                                icon: 'pi pi-fw pi-database',
                                routerLink: ['/uikit/customer-job'],
                            },
                        ],
                    },
                    {
                        // timekeeping
                        label: 'left_menu.timekeeping',
                        icon: 'pi pi-fw pi-eye',
                        items: [
                            {
                                label: 'left_menu.timekeeping',
                                icon: 'pi pi-fw pi-eye',
                                routerLink: ['/uikit/timekeeping'],
                            },
                            {
                                label: 'left_menu.timekeeping_history',
                                icon: 'pi pi-fw pi-calendar-times',
                                routerLink: ['/uikit/timekeeping-history'],
                            },
                            {
                                label: 'left_menu.timekeeping_report',
                                icon: 'pi pi-fw pi-chart-pie',
                                routerLink: ['/uikit/timekeeping-report'],
                            },
                        ],
                    },
                    {
                        // work flow
                        label: 'left_menu.workflow_management',
                        icon: 'pi pi-fw pi-th-large',
                        items: [
                            {
                                label: 'left_menu.workflow_management',
                                icon: 'pi pi-fw pi-th-large',
                                routerLink: ['/uikit/workflow'],
                            },
                            {
                                label: 'left_menu.workflow_type',
                                icon: 'pi pi-fw pi-clone',
                                routerLink: ['/uikit/workflow-type'],
                            },
                        ],
                    },
                    {
                        // sell
                        label: 'left_menu.sell',
                        icon: 'pi pi-fw pi-wallet',
                        items: [
                            {
                                label: 'left_menu.cashier',
                                icon: 'pi pi-fw pi-android',
                                routerLink: ['/uikit/cashier'],
                            },
                            {
                                label: 'left_menu.seller',
                                icon: 'pi pi-fw pi-github',
                                routerLink: ['/uikit/seller'],
                            },
                            {
                                label: 'left_menu.warehouse',
                                icon: 'pi pi-fw pi-inbox',
                                routerLink: ['/uikit/warehouse'],
                            },
                            {
                                label: 'left_menu.website_orders',
                                icon: 'pi pi-fw pi-phone',
                                routerLink: ['/uikit/website-orders'],
                            },
                            {
                                label: 'left_menu.list_of_goods',
                                icon: 'pi pi-fw pi-server',
                                routerLink: ['/uikit/list-of-goods'],
                            },
                            {
                                // setup
                                label: 'left_menu.setup',
                                icon: 'pi pi-fw pi-cog',
                                items: [
                                    {
                                        label: 'left_menu.room_table',
                                        icon: 'pi pi-fw pi-desktop',
                                        routerLink: ['/uikit/setup/room-table'],
                                    },
                                    {
                                        label: 'left_menu.quota',
                                        icon: 'pi pi-fw pi-compass',
                                        routerLink: ['/uikit/setup/quota'],
                                    },
                                    {
                                        label: 'left_menu.combo',
                                        icon: 'pi pi-fw pi-shopping-cart',
                                        routerLink: ['/uikit/setup/combo'],
                                    },
                                    {
                                        label: 'left_menu.menu_of_goods',
                                        icon: 'pi pi-fw pi-tag',
                                        routerLink: [
                                            '/uikit/setup/menu-of-goods',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.inventory_control',
                                        icon: 'pi pi-fw pi-send',
                                        routerLink: [
                                            '/uikit/setup/inventory-control',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.defective_goods',
                                        icon: 'pi pi-fw pi-ticket',
                                        routerLink: [
                                            '/uikit/setup/defective-goods',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.accounting_link',
                                        icon: 'pi pi-fw pi-share-alt',
                                        routerLink: [
                                            '/uikit/setup/accounting-link',
                                        ],
                                    },
                                ],
                            },
                            {
                                // report
                                label: 'left_menu.report',
                                icon: 'pi pi-fw pi-filter-fill',
                                items: [
                                    {
                                        label: 'left_menu.payment_history',
                                        icon: 'pi pi-fw pi-filter-fill',
                                        routerLink: [
                                            '/uikit/sell-report/payment-history',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.profit_before_tax',
                                        icon: 'pi pi-fw pi-filter',
                                        routerLink: [
                                            '/uikit/sell-report/profit-before-tax',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.profit_after_tax',
                                        icon: 'pi pi-fw pi-filter-slash',
                                        routerLink: [
                                            '/uikit/sell-report/profit-after-tax',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.details_book',
                                        icon: 'pi pi-fw pi-hashtag',
                                        routerLink: [
                                            '/uikit/sell-report/sell-details-book',
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        // accounting
                        label: 'left_menu.accounting',
                        icon: 'pi pi-fw pi-sort-amount-up',
                        items: [
                            {
                                label: 'left_menu.arise',
                                icon: 'pi pi-fw pi-upload',
                                routerLink: ['/uikit/arise'],
                            },
                            {
                                label: 'left_menu.account',
                                icon: 'pi pi-fw pi-sort-alpha-down',
                                routerLink: ['/uikit/account'],
                            },
                            {
                                // category
                                label: 'left_menu.category',
                                icon: 'pi pi-fw pi-sort-amount-down',
                                items: [
                                    {
                                        label: 'left_menu.type_of_document',
                                        icon: 'pi pi-fw pi-send',
                                        routerLink: [
                                            '/uikit/category/type-of-document',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.bills',
                                        icon: 'pi pi-fw pi-clone',
                                        routerLink: ['/uikit/category/bills'],
                                    },
                                    {
                                        label: 'left_menu.end_of_term_ending',
                                        icon: 'pi pi-fw pi-cloud-upload',
                                        routerLink: [
                                            '/uikit/category/end-of-term-ending',
                                        ],
                                    },
                                ],
                            },
                            {
                                // overreach report
                                label: 'left_menu.overreach_report',
                                icon: 'pi pi-fw pi-database',
                                items: [
                                    {
                                        label: 'left_menu.account_balance_sheet',
                                        icon: 'pi pi-fw pi-comment',
                                        routerLink: ['/uikit/overreach/balance-account']
                                    },
                                    {
                                        label: 'left_menu.license',
                                        icon: 'pi pi-fw pi-compass',
                                        routerLink: [
                                            '/uikit/license-overreach',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.list_of_vouchers',
                                        icon: 'pi pi-fw pi-flag',
                                        routerLink: [
                                            '/uikit/list-of-vouchers-overreach',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.ledger',
                                        icon: 'pi pi-fw pi-external-link',
                                        routerLink: ['/uikit/ledger-overreach'],
                                    },
                                    {
                                        label: 'left_menu.sign_up_for_vouchers',
                                        icon: 'pi pi-fw pi-info-circle',
                                        routerLink: [
                                            '/uikit/sign-up-for-vouchers-overreach',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.accounting_balance_sheet',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: [
                                            '/uikit/accounting-balance-sheet-overreach',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.cash_flow_table',
                                        icon: 'pi pi-fw pi-mobile',
                                        routerLink: [
                                            '/uikit/cash-flow-table-overreach',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.state_obligations',
                                        icon: 'pi pi-fw pi-star',
                                        routerLink: [
                                            '/uikit/state-obligations-overreach',
                                        ],
                                    },
                                ],
                            },
                            {
                                // internal report
                                label: 'left_menu.internal_report',
                                icon: 'pi pi-fw pi-desktop',
                                items: [
                                    {
                                        label: 'left_menu.account_balance_sheet',
                                        icon: 'pi pi-fw pi-comment',
                                        routerLink: ['/uikit/internal/balance-account']
                                    },
                                    {
                                        label: 'left_menu.license',
                                        icon: 'pi pi-fw pi-compass',
                                        routerLink: ['/uikit/license-internal'],
                                    },
                                    {
                                        label: 'left_menu.list_of_vouchers',
                                        icon: 'pi pi-fw pi-flag',
                                        routerLink: [
                                            '/uikit/list-of-vouchers-internal',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.ledger',
                                        icon: 'pi pi-fw pi-external-link',
                                        routerLink: ['/uikit/ledger-internal'],
                                    },
                                    {
                                        label: 'left_menu.sign_up_for_vouchers',
                                        icon: 'pi pi-fw pi-info-circle',
                                        routerLink: [
                                            '/uikit/sign-up-for-vouchers-internal',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.accounting_balance_sheet',
                                        icon: 'pi pi-fw pi-list',
                                        routerLink: [
                                            '/uikit/accounting-balance-sheet-internal',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.cash_flow_table',
                                        icon: 'pi pi-fw pi-mobile',
                                        routerLink: [
                                            '/uikit/cash-flow-table-internal',
                                        ],
                                    },
                                    {
                                        label: 'left_menu.state_obligations',
                                        icon: 'pi pi-fw pi-star',
                                        routerLink: [
                                            '/uikit/state-obligations-internal',
                                        ],
                                    },
                                ],
                            },
                            {
                                label: 'left_menu.tools_fixed_assets',
                                icon: 'pi pi-fw pi-video',
                                routerLink: ['/uikit/tools-fixed-assets'],
                            },
                        ],
                    },
                    {
                        // document
                        label: 'left_menu.document',
                        icon: 'pi pi-fw pi-sign-out',
                        items: [
                            {
                                label: 'left_menu.incomming_text',
                                icon: 'pi pi-fw pi-arrow-right',
                                routerLink: ['/uikit/incoming-text'],
                            },
                            {
                                label: 'left_menu.text_go',
                                icon: 'pi pi-fw pi-arrow-left',
                                routerLink: ['/uikit/text-go'],
                            },
                            {
                                label: 'left_menu.document_type',
                                icon: 'pi pi-file',
                                routerLink: ['/uikit/document-type'],
                            },
                        ],
                    },
                    {
                        // website
                        label: 'left_menu.website',
                        icon: 'pi pi-fw pi-globe',
                        items: [
                            {
                                label: 'left_menu.slider',
                                icon: 'pi pi-fw pi-camera',
                                routerLink: ['/uikit/slider-web'],
                            },
                            {
                                label: 'left_menu.intro',
                                icon: 'pi pi-fw pi-github',
                                routerLink: ['/uikit/intro-web'],
                            },
                            {
                                label: 'left_menu.product',
                                icon: 'pi pi-fw pi-palette',
                                routerLink: ['/uikit/product-web'],
                            },
                            {
                                label: 'left_menu.branch',
                                icon: 'pi pi-fw pi-qrcode',
                                routerLink: ['/uikit/branch-web'],
                            },
                            {
                                label: 'left_menu.recruit',
                                icon: 'pi pi-fw pi-send',
                                routerLink: ['/uikit/recruit-web'],
                            },
                            {
                                label: 'left_menu.news',
                                icon: 'pi pi-fw pi-slack',
                                routerLink: ['/uikit/news-web'],
                            },
                            {
                                label: 'left_menu.social_network',
                                icon: 'pi pi-fw pi-star-fill',
                                routerLink: ['/uikit/social-network-web'],
                            },
                        ],
                    },
                    {
                        // initial declaration
                        label: 'left_menu.initial_declaration',
                        icon: 'pi pi-fw pi-check-square',
                        items: [
                            {
                                label: 'left_menu.company_info',
                                icon: 'pi pi-fw pi-book',
                                routerLink: ['/uikit/company-info'],
                            },
                            {
                                label: 'left_menu.odd_decimal',
                                icon: 'pi pi-fw pi-circle-on',
                                routerLink: ['/uikit/odd-decimal'],
                            },
                        ],
                    },
                ],
            },
            // {
            //     label: 'Pages',
            //     items: [
            //         {
            //             label: 'Crud',
            //             icon: 'pi pi-fw pi-user-edit',
            //             routerLink: ['/uikit/pages/crud'],
            //         },
            //         {
            //             label: 'Timeline',
            //             icon: 'pi pi-fw pi-calendar',
            //             routerLink: ['/uikit/pages/timeline'],
            //         },
            //         {
            //             label: 'Landing',
            //             icon: 'pi pi-fw pi-globe',
            //             routerLink: ['/pages/landing'],
            //         },
            //         {
            //             label: 'Error',
            //             icon: 'pi pi-fw pi-times-circle',
            //             routerLink: ['/pages/error'],
            //         },
            //         {
            //             label: 'Not Found',
            //             icon: 'pi pi-fw pi-exclamation-circle',
            //             routerLink: ['/pages/notfound'],
            //         },
            //         {
            //             label: 'Access Denied',
            //             icon: 'pi pi-fw pi-lock',
            //             routerLink: ['/pages/access'],
            //         },
            //         {
            //             label: 'Empty',
            //             icon: 'pi pi-fw pi-circle',
            //             routerLink: ['/pages/empty'],
            //         },
            //     ],
            // },
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            // event.preventDefault();
        }
    }
}
