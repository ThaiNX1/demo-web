import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/logged-in-guard.service';
import { LayoutComponent } from './layouts/layout.component';
import { Error404Component } from './modules/error404/error404.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: '404',
    component: Error404Component,
    data: {
      title: '404',
    },
  },
  {
    path: '',
    component: LayoutComponent,
    data: {
      title: 'Layout',
    },
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/home/home.module').then((m) => m.HomeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./modules/cart/cart.module').then((m) => m.CartModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'product-detail/:id',
        loadChildren: () =>
          import('./modules/product-detail/product-detail.module').then(
            (m) => m.ProductDetailModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./modules/product/product.module').then(
            (m) => m.ProductModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
