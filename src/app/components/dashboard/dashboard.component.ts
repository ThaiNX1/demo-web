import {Component, OnInit, OnDestroy} from '@angular/core';
import {ConfigService} from '../../service/app.config.service';
import {AppConfig} from '../../configs/appconfig';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {fadeIn} from 'ngx-animate';
import {transition, trigger, useAnimation} from '@angular/animations';
import AppUtil from 'src/app/utilities/app-util';
import {TranslateService} from '@ngx-translate/core';
import {JobService} from 'src/app/service/job.service';
import {EmployerService} from 'src/app/service/employer.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    animations: [
        trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    ],
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    visibleSidebarTop = false;

    config: AppConfig;

    subscription: Subscription;

    fadeIn: any;

    responsiveOptions;
    products: any[] = [];

    selectedJob;
    selectedProvince;
    jobTypes: any[] = [];
    // employers: any[] = [];
    jobs: any[] = [];
    provinces: any[] = [];

    isMobile = window.innerWidth <= 768;

    hotJobs = []
    newJobs = []
    employers = []

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
        // this.jobService.getListJobWebHome().subscribe((res) => {
        //     this.jobTypes = res.data;
        // });
        // this.employerService.getListEmployerWebHome().subscribe((res) => {
        //     this.employers = res.data;
        // });
        this.products = [
            {
                // name: 'Trắc nghiệm tính cách',
                image: 'assets/images/banner-dashboard-2.jpg',
            },
            {
                // name: 'JWKJOB - Phần mềm "Chất", Doanh nghiệp "Chất"',
                image: 'assets/images/banner-dashboard-1.jpg',
                // url: '',
            },
            {
                // name: 'Tìm ghế trong mơ - Đập tan nỗi sợ',
                image: 'assets/images/banner-dashboard-3.jpg',
            },
        ];
        this.jobs = [
            {id: 1, name: 'job 1'},
            {id: 2, name: 'job 2'},
            {id: 3, name: 'job 3'},
        ];
        this.provinces = [
            {id: 1, name: 'province 1'},
            {id: 2, name: 'province 2'},
            {id: 3, name: 'province 3'},
        ];
        const jobs = []
        const employers = []
        for (let i = 0; i < 17; i++) {
            jobs.push(
                {
                    id: 1,
                    name: `Công việc ${i + 1}`,
                    companyName: `Công ty ${i + 1}`,
                    salary: '10Tr',
                    address: `Hà Nội ${i + 1}`,
                    url: 'https://cdn1.vieclam24h.vn/upload/files_cua_nguoi_dung/logo/2019/03/19/1552989626_lg_T.w-62.h-62.padding-1.PNG?v=220513'
                })
        }
        for (let i = 0; i < 6; i++) {
            employers.push({
                id: i + 1,
                url: 'https://cdn1.vieclam24h.vn/images/employer_avatar/2022/02/08/images/164431105585.w-128.h-128.jpeg',
                name: `Nhà tuyển dụng ${i + 1}`
            })
        }
        this.hotJobs = [
            {
                jobs: jobs
            },
            {
                jobs: jobs
            },
            {
                jobs: jobs
            }
        ]
        this.employers = [
            {
                list:employers
            },
            {
                list:employers
            },
            {
                list:employers
            },
            {
                list:employers
            },
        ]
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
