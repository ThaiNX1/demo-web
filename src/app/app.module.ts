import { MyCompanyComponent } from './components/profile/components/my-company/my-company.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpBackend, HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { StyleClassModule } from 'primeng/styleclass';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { SpeedDialModule } from 'primeng/speeddial';

import { AppComponent } from './app.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmptyComponent } from './components/empty/empty.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { LandingComponent } from './components/landing/landing.component';

import { ProductService } from './service/productservice';
import { MenuService } from './service/app.menu.service';
import { ConfigService } from './service/app.config.service';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { appInitializer } from './interceptor/app.initializer';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { SpinnerInterceptor } from './interceptor/spinner.interceptor';
import { AuthService } from './service/auth.service';
import { SpinnerOverlayComponent } from './shared/spinner-overlay/spinner-overlay.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppConfigComponent } from './configs/app.config.component';
import { AppTopBarComponent } from './layouts/app.topbar.component';
import { AppFooterComponent } from './layouts/app.footer.component';
import { AppMenuComponent } from './layouts/app.menu.component';
import { AppMenuitemComponent } from './layouts/app.menuitem.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { JobPostingComponent } from './components/job-posting/job-posting.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FindJobComponent } from './components/find-job/find-job.component';
import { RegistComponent } from './components/regist/regist.component';
import { NewJobPostingComponent } from './components/new-job-posting/new-job-posting.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MyProfileComponent } from './components/profile/components/my-profile/my-profile.component';
import { AccountService } from './service/account.service';
import { RegistEmployerComponent } from './components/regist-employer/regist-employer.component';
import {AppMainModule} from "./layouts/app.main.module";
export function createTranslateLoader(http: HttpBackend) {
    return new TranslateHttpLoader(
        new HttpClient(http),
        'assets/i18n/',
        '.json'
    );
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        SpeedDialModule,
        ChipsModule,
        ChipModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        OverlayModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TagModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeSelectModule,
        TreeTableModule,
        VirtualScrollerModule,
        StyleClassModule,
        TranslateModule.forRoot({
            defaultLanguage: 'vn',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpBackend],
            },
        }),
        AppMainModule
    ],
    declarations: [
        // main component
        AppComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        DashboardComponent,
        SpinnerOverlayComponent,
        EmptyComponent,
        TimelineComponent,
        LandingComponent,
        LoginComponent,
        ErrorComponent,
        NotfoundComponent,
        AccessComponent,

        // category component
        NavbarComponent,
        ForgotPasswordComponent,
        JobPostingComponent,
        NewJobPostingComponent,
        ProfileComponent,
        MyProfileComponent,
        MyCompanyComponent,
        FindJobComponent,
        RegistComponent,
        RegistEmployerComponent,
    ],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        ProductService,
        AccountService,
        MenuService,
        ConfigService,
        MessageService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [AuthService],
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SpinnerInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
