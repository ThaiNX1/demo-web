import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layouts/layout.component';
import { LayoutModule } from './layouts/layout.module';
import { CartModule } from './modules/cart/cart.module';
import { Error404Component } from './modules/error404/error404.component';
import { HomeModule } from './modules/home/home.module';
import { LoginComponent } from './modules/login/login.component';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';
import { RegisterComponent } from './modules/register/register.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AuthGuard } from './guard/logged-in-guard.service';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductModule } from './modules/product/product.module';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    Error404Component,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HomeModule,
    CartModule,
    ProductModule,
    ProductDetailModule,
    LayoutModule,
    NzAffixModule,
    NzCarouselModule,
    NzSpinModule,
    NzNotificationModule,
    BrowserAnimationsModule 
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
