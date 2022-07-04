import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../configs/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { fadeIn } from 'ngx-animate';
import { transition, trigger, useAnimation } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-regist-employer',
    templateUrl: './regist-employer.component.html',
    animations: [
        trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    ],
    styles: [
        `
            #password {
                width: 100%;
            }

            #confirmPassword {
                width: 100%;
            }

            #password div .p-inputtext {
                width: 100%;
            }

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

            :host ::ng-deep {
                #login-gmail .p-button {
                    background-color: white;
                    color: var(--primary-color);
                    padding-left: 25px;
                    padding-right: 25px;
                }

                .p-password,
                .p-password .p-inputtext {
                    width: 100%;
                }
            }
        `,
    ],
})
export class RegistEmployerComponent implements OnInit, OnDestroy {
    config: AppConfig;

    subscription: Subscription;

    fadeIn: any;
    fadeInLeft: any;
    isSubmitting = false;

    registFrm: FormGroup = new FormGroup({});

    constructor(
        private fb: FormBuilder,
        public configService: ConfigService,
        private authService: AuthService,
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
        this.registFrm = this.fb.group({
            fullName: [null, [Validators.required]],
            username: [null, [Validators.required]],
            email: [null, [Validators.required]],
            telephoneNumber: [null, [Validators.required]],
            password: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required]],
        });
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

    doRegist() {
        this.registFrm.markAllAsTouched();
        if (this.registFrm.invalid) {
            return;
        }
        this.isSubmitting = true;
        const params = Object.assign({}, this.registFrm.value);
        delete params.confirmPassword;
        this.authService.registUser(params).subscribe((res: any): void => {
            this.router.navigate(['/login']);
        });
    }
}
