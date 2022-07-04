import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../configs/appconfig';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import AppUtil from 'src/app/utilities/app-util';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import AppConstant from 'src/app/utilities/app-constants';
import { AuthData } from 'src/app/models/auth.model';
import { AccountService } from 'src/app/service/account.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .p-inputtext {
                width: 100%;
                padding: 1rem;
            }

            :host ::ng-deep .pi-eye {
                transform: scale(1.6);
                cursor: pointer;
                color: var(--primary-color) !important;
            }

            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                cursor: pointer;
                color: var(--primary-color) !important;
            }

            :host ::ng-deep .p-dropdown {
                width: auto !important;
            }

            :host ::ng-deep {
                #login-gmail .p-button {
                    background-color: white;
                    color: var(--primary-color);
                    padding-left: 25px;
                    padding-right: 25px;
                }
            }
        `,
    ],
})
export class LoginComponent implements OnInit, OnDestroy {
    appUtil = AppUtil;
    valCheck: string[] = ['remember'];

    password: string;

    config: AppConfig;

    subscription: Subscription;

    loginFrm: FormGroup = new FormGroup({});

    isSubmitting: boolean = false;

    languages: any[];

    selectedLanguage: any;

    constructor(
        public configService: ConfigService,
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private translateService: TranslateService,
        private accountService: AccountService
    ) {}

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
        this.languages = [
            {
                code: 'vn',
                name: 'Viet Nam',
                path: 'assets/flag-country/vietnam.svg',
            },
            {
                code: 'en',
                name: 'United Kingdom',
                path: 'assets/flag-country/united-kingdom.svg',
            },
            {
                code: 'ko',
                name: 'South Korea',
                path: 'assets/flag-country/south-korea.svg',
            },
        ];
        let language = localStorage.getItem(AppConstant.STORAGE_KEYS.LANGUAGE);
        if (!language) {
            language = 'vn';
        }
        this.translateService.use(language);
        this.selectedLanguage = language;
        this.loginFrm = this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]],
            remember: [false],
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    doLogin() {
        this.loginFrm.markAllAsTouched();
        if (
            !this.loginFrm.value.username.trim() ||
            !this.loginFrm.value.password.trim()
        ) {
            return;
        }
        this.isSubmitting = true;
        const params = this.loginFrm.value;
        this.authService
            .login(this.appUtil.toSnakeCaseKey(params))
            .subscribe((res: any): void => {
                if (res.status === 601 || res.status === 602) {
                    return;
                }
                if (res.data.id !== 0) {
                    this.authService.setToken(res.data.token);
                    const authUser: AuthData = res.data;
                    this.authService.setAuthUser(authUser);
                    this.router
                        .navigate(['/uikit/profile/my-profile'])
                        .then(() => {});
                }
            });
    }

    onChangeLanguage(event: any) {
        localStorage.setItem(AppConstant.STORAGE_KEYS.LANGUAGE, event.value);
        this.translateService.use(
            localStorage.getItem(AppConstant.STORAGE_KEYS.LANGUAGE)
        );
    }

    facebookLogin() {
        this.accountService.facebookLogin().subscribe((res: fb.AuthResponse) => {
            console.log(res);
            this.accountService.getAccountInfo(res.accessToken).subscribe(res => {
                console.log('account info ', res);
            });
        });

        // this.accountService.logout();
    }
}
