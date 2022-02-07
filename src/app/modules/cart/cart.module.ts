import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CartComponent } from './cart.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { PipesModule } from 'src/app/shares/share-modules/pipes.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    NzTableModule,
    NzInputModule,
    PipesModule,
    NzSelectModule,
    FormsModule,
    NzIconModule
  ]
})
export class CartModule { }
