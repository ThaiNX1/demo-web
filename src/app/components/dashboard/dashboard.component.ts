import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../configs/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { fadeIn } from 'ngx-animate';
import { transition, trigger, useAnimation } from '@angular/animations';
import AppUtil from 'src/app/utilities/app-util';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/service/job.service';
import { EmployerService } from 'src/app/service/employer.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    animations: [
        trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    ],
    styles: [
        `
            #main {
                min-height: 300px;
            }

            :host ::ng-deep {
                #searchbox .p-card .p-card-body {
                    width: 612px;
                    height: 200px;
                }

                .jobType .p-badge {
                    height: 35px;
                    padding: 14px;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                }

                #searchGroup {
                    margin-top: 200px;
                }
            }

            @media screen and (max-width: 768px) {
                :host ::ng-deep {
                    .p-inputgroup .p-inputtext {
                        width: 1%;
                    }

                    #searchbox .p-card .p-card-body {
                        max-width: 375px;
                        height: auto;
                        padding-bottom: 6px;
                    }

                    .p-card .p-card-content {
                        padding: 0.25rem 0;
                    }

                    .p-carousel .p-carousel-indicators {
                        padding: 0.5rem;
                    }

                    #searchGroup {
                        margin-top: 0;
                    }
                }
            }
        `,
    ],
})
export class DashboardComponent implements OnInit, OnDestroy {
    config: AppConfig;

    subscription: Subscription;

    fadeIn: any;

    responsiveOptions;
    products: any[] = [];

    selectedJob;
    selectedProvince;
    jobTypes: any[] = [];
    employers: any[] = [];
    jobs: any[] = [];
    provinces: any[] = [];

    isMobile = window.innerWidth <= 768;

    constructor(
        public configService: ConfigService,
        public router: Router,
        private translateService: TranslateService,
        private jobService: JobService,
        private employerService: EmployerService
    ) {
        this.responsiveOptions = [
            {
                breakpoint: this.isMobile ? '768px' : '1024px',
                numVisible: 3,
                numScroll: 3,
            },
            {
                breakpoint: this.isMobile ? '768px' : '1024px',
                numVisible: 2,
                numScroll: 2,
            },
            {
                breakpoint: this.isMobile ? '768px' : '1024px',
                numVisible: 1,
                numScroll: 1,
            },
        ];
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
        this.jobService.getListJobWebHome().subscribe((res) => {
            this.jobTypes = res.data;
        });
        this.employerService.getListEmployerWebHome().subscribe((res) => {
            this.employers = res.data;
        });
        this.products = [
            {
                name: 'Trắc nghiệm tính cách',
                image: 'assets/images/banner-dashboard-2.jpg',
            },
            {
                name: 'JWKJOB - Phần mềm "Chất", Doanh nghiệp "Chất"',
                image: 'assets/images/banner-dashboard-1.jpg',
                url: '',
            },
            {
                name: 'Tìm ghế trong mơ - Đập tan nỗi sợ',
                image: 'assets/images/banner-dashboard-3.jpg',
            },
        ];
        this.jobs = [
            { id: 1, name: 'job 1' },
            { id: 2, name: 'job 2' },
            { id: 3, name: 'job 3' },
        ];
        this.provinces = [
            { id: 1, name: 'province 1' },
            { id: 2, name: 'province 2' },
            { id: 3, name: 'province 3' },
        ];
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
