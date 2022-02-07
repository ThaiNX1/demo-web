import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailComponent } from './product-detail.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PipesModule } from 'src/app/shares/share-modules/pipes.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductDetailComponent],
  imports: [
    CommonModule,
    ProductDetailRoutingModule,
    NzGridModule,
    PipesModule,
    CarouselModule,
    NzIconModule,
    FormsModule,
  ],
})
export class ProductDetailModule {}
