import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectPropertiesPipe } from './object-properties.pipe';
import { ExcludePipe } from './exclude.pipe';

@NgModule({
  declarations: [
    ObjectPropertiesPipe,
    ExcludePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ObjectPropertiesPipe,
    ExcludePipe
  ]
})
export class PipesModule { }
