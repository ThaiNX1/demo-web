import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmptyComponent } from './components/empty/empty.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { AppMainComponent } from './layouts/app.main.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthGuard } from './interceptor/auth-guard.service';
import { JobPostingComponent } from './components/job-posting/job-posting.component';
import { FindJobComponent } from './components/find-job/find-job.component';
import { RegistComponent } from './components/regist/regist.component';
import { NewJobPostingComponent } from './components/new-job-posting/new-job-posting.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyProfileComponent } from './components/profile/components/my-profile/my-profile.component';
import { MyCompanyComponent } from './components/profile/components/my-company/my-company.component';
import { RegistEmployerComponent } from './components/regist-employer/regist-employer.component';
@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppMainComponent,
                    children:[
                        {
                            path: '',
                            component: DashboardComponent
                        }
                    ]
                },
                { path: 'login', component: LoginComponent },
                { path: 'regist-user', component: RegistComponent },
                { path: 'regist-employer', component: RegistEmployerComponent },
                { path: 'forgot-password', component: ForgotPasswordComponent },
                { path: 'find-job', component: FindJobComponent },
                {
                    path: 'uikit',
                    canActivate: [AuthGuard],
                    component: AppMainComponent,
                    children: [
                        {
                            path: 'profile',
                            component: ProfileComponent,
                            children: [
                                {
                                    path: 'my-profile',
                                    component: MyProfileComponent,
                                },
                                {
                                    path: 'my-company',
                                    component: MyCompanyComponent,
                                },
                            ],
                        },
                        { path: 'job-posting', component: JobPostingComponent },
                        {
                            path: 'new-job-posting',
                            component: NewJobPostingComponent,
                        },
                        {
                            path: 'pages/timeline',
                            component: TimelineComponent,
                        },
                        { path: 'pages/empty', component: EmptyComponent },
                    ],
                },
                { path: 'pages/error', component: ErrorComponent },
                { path: 'pages/notfound', component: NotfoundComponent },
                { path: 'pages/access', component: AccessComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
