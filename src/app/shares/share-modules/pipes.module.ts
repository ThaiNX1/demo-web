import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyTypePipe } from '../pipes/money-type.pipe';



@NgModule({
  declarations: [MoneyTypePipe],
  imports: [
    CommonModule
  ],
  exports:[
    MoneyTypePipe
  ]
})
export class PipesModule { }
