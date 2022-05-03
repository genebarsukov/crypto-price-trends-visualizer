import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { TextPickerComponent } from './text-picker/text-picker.component';


@NgModule({
  declarations: [
    ColorPickerComponent,
    TextPickerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TextPickerComponent,
    ColorPickerComponent
  ]
})
export class UiBuildingBlocksModule { }
