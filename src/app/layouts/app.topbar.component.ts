import { User } from 'src/app/models/user.model';
import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import AppUtil from '../utilities/app-util';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [
        `
            p-menubar {
                width: 100%;
            }

            p-menubar .p-menubar {
                padding: 1rem 0 !important;
            }

            @media screen and (max-width: 768px) {
                .layout-topbar-logo {
                    margin-left: 50px;
                }
            }
        `,
    ],
})
export class AppTopBarComponent implements OnInit {
    authUser: User | undefined;

    menuItems: MenuItem[] = [];

    constructor(
        private authService: AuthService,
        private router: Router,
        public appMain: AppMainComponent
    ) {
        this.menuItems = [
            {
                label: 'Thông tin cá nhân',
                icon: 'pi pi-fw pi-user',
                routerLink: ['/uikit/profile/my-profile']
            },
            {
                label: 'Đăng xuất',
                icon: 'pi pi-fw pi-sign-out',
                command: (event) => {
                    this.doLogout();
                },
            },
        ];
    }

    ngOnInit(): void {

    }

    doLogout(): void {
        this.authService.clearSession();
        this.router.navigate(['']);
    }
}
