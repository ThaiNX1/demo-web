import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PipesModule } from 'src/app/shares/share-modules/pipes.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NzGridModule,
    PipesModule,
    CarouselModule,
    NzIconModule
  ]
})
export class HomeModule { }
