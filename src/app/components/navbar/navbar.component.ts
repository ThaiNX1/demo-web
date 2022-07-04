import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../configs/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { fadeIn } from 'ngx-animate';
import { transition, trigger, useAnimation } from '@angular/animations';
import { ViewportScroller } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    animations: [
        trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    ],
    styles: [
        `
            :host ::ng-deep {
                #badgeNew .p-badge {
                    background: #ffffff;
                    color: var(--primary-color);
                }
            }
        `,
    ],
})
export class NavbarComponent implements OnInit, OnDestroy {
    config: AppConfig;

    subscription: Subscription;

    fadeIn: any;

    constructor(
        public configService: ConfigService,
        public router: Router,
        private viewportScroller: ViewportScroller
    ) {}

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
        this.viewportScroller.setHistoryScrollRestoration('manual');
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    scrollFn($event: any): void {
        console.log($event);
        if ($event.deltaY > 0) {
            // scrolling down
            // this.viewportScroller.scrollToAnchor('pricing');
            // window.scrollTo({ top: 1000, behavior: 'smooth' });
            // this.viewportScroller.setOffset([1000,1000]);
        }
    }
}
