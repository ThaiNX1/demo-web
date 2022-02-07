import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ProductComponent } from './product.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { PipesModule } from 'src/app/shares/share-modules/pipes.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    NzPaginationModule,
    NzInputModule,
    PipesModule,
    NzSelectModule,
    FormsModule,
    NzGridModule
  ]
})
export class ProductModule { }
