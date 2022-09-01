import { User } from 'src/app/models/user.model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import AppUtil from '../utilities/app-util';
import { TranslateService } from '@ngx-translate/core';
import { CompanyService } from '../service/company.service';
import { Company } from '../models/company.model';
import { LayoutService } from '../service/system-setting/app.layout.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [
        `
            :host ::ng-deep {
                .p-password,
                #oldPassword div .p-inputtext,
                #confirmPassword div .p-inputtext,
                #password div .p-inputtext {
                    width: 100% !important;
                }
            }
        `,
    ],
})
export class AppTopBarComponent implements OnInit {
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    items: MenuItem[];
    authUser: User | undefined;
    registFrm: FormGroup = new FormGroup({});

    company: Company;

    displayChangePassword: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private translateService: TranslateService,
        public layoutService: LayoutService,
        public appMain: AppMainComponent,
        private companyService: CompanyService
    ) {
        this.registFrm = this.fb.group({
            id: [''],
            oldPassword: [null, [Validators.required]],
            password: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.authUser = this.authService.user;
        this.companyService.getLastCompanyInfo().subscribe((response: any) => {
            this.company = response.data;
        });
    }

    doLogout(): void {
        this.authService.clearSession();
        this.router.navigate(['']);
    }

    onChangePass() {
        if (
            this.registFrm.controls['oldPassword'].invalid ||
            this.registFrm.controls['password'].invalid ||
            this.registFrm.controls['confirmPassword'].invalid
        ) {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(
                    this.translateService,
                    'info.please_check_again'
                ),
            });
            return;
        }
        if (
            this.registFrm.value.oldPassword === this.registFrm.value.password
        ) {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(
                    this.translateService,
                    'info.new_password_do_not_matching_old_password'
                ),
            });
            return;
        }
        if (
            this.registFrm.value.password !==
            this.registFrm.value.confirmPassword
        ) {
            this.messageService.add({
                severity: 'error',
                detail: AppUtil.translate(
                    this.translateService,
                    'info.new_password_do_matching_confirm_password'
                ),
            });
            return;
        }
        const params: any = {
            id: this.authService.user.id,
            oldPassword: this.registFrm.value.oldPassword,
            password: this.registFrm.value.password,
        };
        console.log(params);
        this.authService.changePassword(params).subscribe((res) => {
            if (res && res.status !== 603) {
                this.messageService.add({
                    severity: 'success',
                    detail: AppUtil.translate(
                        this.translateService,
                        'success.change_pass_successfully'
                    ),
                });
                this.displayChangePassword = false;
            }
        });
    }

    checkValidValidator(fieldName: string) {
        return (this.registFrm.controls[fieldName].dirty ||
            this.registFrm.controls[fieldName].touched) &&
            this.registFrm.controls[fieldName].invalid
            ? 'ng-invalid ng-dirty'
            : '';
    }
}
