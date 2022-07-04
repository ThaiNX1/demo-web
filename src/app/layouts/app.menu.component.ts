import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li
                    app-menu
                    class="layout-menuitem-category"
                    *ngFor="let item of model; let i = index"
                    [item]="item"
                    [index]="i"
                    [root]="true"
                    role="none"
                >
                    <div
                        class="layout-menuitem-root-text"
                        [attr.aria-label]="item.label | translate"
                        [translate]="item.label"
                    ></div>
                    <ul role="menu">
                        <li
                            app-menuitem
                            *ngFor="let child of item.items"
                            [item]="child"
                            [index]="i"
                            role="none"
                        ></li>
                    </ul>
                </li>
            </ul>
        </div>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[];

    constructor(
        public appMain: AppMainComponent,
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.model = [
            {
                label: 'left_menu.account_management',
                items: [
                    {
                        label: 'left_menu.my_account',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/uikit/profile/my-profile'],
                    },
                    {
                        label: 'left_menu.my_company',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/uikit/profile/my-company'],
                    },
                ],
            },
            {
                label: 'left_menu.job_posting_management',
                items: [
                    {
                        label: 'left_menu.create_new_job_posting',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/uikit/new-job-posting'],
                    },
                    {
                        label: 'left_menu.job_posting_list',
                        icon: 'pi pi-fw pi-check-circle',
                        routerLink: ['/uikit/job-posting'],
                    },
                ],
            },
            {
                label: 'left_menu.setting',
                items: [
                    {
                        label: 'left_menu.sign_out',
                        icon: 'pi pi-fw pi-sign-out',
                        command: (event) => {
                            this.doLogout();
                        },
                    },
                ],
            },
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = <HTMLDivElement>event.target;
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }

    doLogout(): void {
        this.authService.clearSession();
        this.router.navigate(['']);
    }
}
