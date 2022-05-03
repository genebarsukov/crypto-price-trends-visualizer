import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlgoTesterComponent } from './algo-tester.component';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AlgoTesterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PipesModule
  ],
  exports: [
    AlgoTesterComponent
  ]
})
export class AlgoTesterModule { }
