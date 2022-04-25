import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { MACDComponent } from './macd/macd.component';
import { PriceChartComponent } from './price-chart/price-chart.component';
import { RSIComponent } from './rsi/rsi.component';
import { SpreadChartComponent } from './spread-chart/spread-chart.component';
import { StochasticComponent } from './stochastic/stochastic.component';



@NgModule({
  declarations: [
    ChartComponent,
    MACDComponent,
    PriceChartComponent,
    RSIComponent,
    SpreadChartComponent,
    StochasticComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ChartsModule { }
