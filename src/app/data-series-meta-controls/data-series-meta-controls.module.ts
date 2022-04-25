import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentPricePercentComponent } from './current-price-percent/current-price-percent.component';
import { LineSettingsComponent } from './line-settings/line-settings.component';
import { TimeSettingsComponent } from './time-settings/time-settings.component';



@NgModule({
  declarations: [
    CurrentPricePercentComponent,
    LineSettingsComponent,
    TimeSettingsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DataSeriesMetaControlsModule { }
