import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../configs/appconfig';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styles: [
        `
            #hero {
                background: linear-gradient(
                        0deg,
                        rgba(255, 255, 255, 0.2),
                        rgba(255, 255, 255, 0.2)
                    ),
                    radial-gradient(
                        77.36% 256.97% at 77.36% 57.52%,
                        #eeefaf 0%,
                        #c3e3fa 100%
                    );
                height: 700px;
                overflow: hidden;
            }

            .pricing-card:hover {
                border: 2px solid var(--cyan-200) !important;
            }

            @media screen and (min-width: 768px) {
                #hero {
                    -webkit-clip-path: ellipse(150% 87% at 93% 13%);
                    clip-path: ellipse(150% 87% at 93% 13%);
                    height: 530px;
                }
            }

            @media screen and (min-width: 1300px) {
                #hero > img {
                    position: absolute;
                    transform: scale(1.2);
                    top: 15%;
                }

                #hero > div > p {
                    max-width: 450px;
                }
            }

            @media screen and (max-width: 1300px) {
                #hero {
                    height: 600px;
                }

                #hero > img {
                    position: static;
                    transform: scale(1);
                    margin-left: auto;
                }

                #hero > div {
                    width: 100%;
                }

                #hero > div > p {
                    width: 100%;
                    max-width: 100%;
                }
            }
        `,
    ],
})
export class ProfileComponent implements OnInit, OnChanges, OnDestroy {
    @Input('changeTab') changeTab = false;
    config: AppConfig;

    subscription: Subscription;

    constructor(
        public configService: ConfigService,
        public router: Router,
        private activeRoute: ActivatedRoute
    ) {
        console.log('on contructure');
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log('on changes');
        console.log(this.changeTab);
    }

    tabItems: any[] = [];
    selectedTab: number = 0;

    ngOnInit(): void {
        console.log('on init');
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
        this.tabItems = [
            {
                id: 0,
                tabName: 'my-profile',
                label: 'Thông tin tài khoản',
                icon: 'pi pi-fw pi-user',
                command: (event) => {
                    this.activateMenu(event); // this one won't be triggered because tab is disabled
                },
            },
            {
                id: 1,
                tabName: 'my-company',
                label: 'Thông tin công ty',
                icon: 'pi pi-fw pi-calendar',
                command: (event) => {
                    this.activateMenu(event); // this one won't be triggered because tab is disabled
                },
            },
        ];
        this.selectedTab = this.tabItems[0];
    }

    activateMenu(event) {
        this.selectedTab = this.tabItems[event.item.id];
        this.router.navigate([`uikit/profile/${event.item.tabName}`]);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
