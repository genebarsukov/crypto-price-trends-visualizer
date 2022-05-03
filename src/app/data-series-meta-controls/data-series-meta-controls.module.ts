import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentPricePercentComponent } from './current-price-percent/current-price-percent.component';
import { LineSettingsComponent } from './line-settings/line-settings.component';
import { TimeSettingsComponent } from './time-settings/time-settings.component';
import { FormsModule } from '@angular/forms';
import { UiBuildingBlocksModule } from '../ui-building-blocks/ui-building-blocks.module';



@NgModule({
  declarations: [
    CurrentPricePercentComponent,
    LineSettingsComponent,
    TimeSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UiBuildingBlocksModule
  ],
  exports: [
    CurrentPricePercentComponent,
    LineSettingsComponent,
    TimeSettingsComponent
  ]
})
export class DataSeriesMetaControlsModule { }
