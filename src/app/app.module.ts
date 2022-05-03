import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule , DragulaService } from 'ng2-dragula'
import { AlgoTesterModule } from './algo-tester/algo-tester.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from './charts/charts.module';
import { DataSeriesMetaControlsModule } from './data-series-meta-controls/data-series-meta-controls.module';
import { ModalsModule } from './modals/modals.module';
import { ApiService } from './services/api.service';
import { D3AlgoTesterService } from './services/d3/d3-algo-tester.service';
import { D3ChartService } from './services/d3/d3-chart.service';
import { D3CurveShapeService } from './services/d3/d3-curve-shape.service';
import { D3MACDService } from './services/d3/d3-macd.service';
import { D3PriceChartService } from './services/d3/d3-price-chart.service';
import { D3RSIService } from './services/d3/d3-rsi.service';
import { D3SpreadChartService } from './services/d3/d3-spread-chart.service';
import { D3StochasticService } from './services/d3/d3-stochastic.service';
import { ErrorService } from './services/error.service';
import { PriceDataService } from './services/price-data.service';
import { ScalingService } from './services/scaling.service';
import { ChartSettingsService } from './services/settings/chart-settings.service';
import { IconSettingsService } from './services/settings/icon-settings.service';
import { TimeSettingsSettingsService } from './services/settings/time-settings-settings.service';
import { UiBuildingBlocksModule } from './ui-building-blocks/ui-building-blocks.module';
import { MessageService } from './services/message.service';
import { ChartManagerComponent } from './chart-manager/chart-manager.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  declarations: [
    AppComponent,
    ChartManagerComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    DragulaModule,
    AppRoutingModule,
    AlgoTesterModule,
    ChartsModule,
    DataSeriesMetaControlsModule,
    ModalsModule,
    UiBuildingBlocksModule,
    PipesModule
  ],
  providers: [
    ApiService,
    PriceDataService,
    D3ChartService,
    D3PriceChartService,
    D3RSIService,
    D3StochasticService,
    D3MACDService,
    DragulaService,
    ScalingService,
    D3CurveShapeService,
    TimeSettingsSettingsService,
    ChartSettingsService,
    D3SpreadChartService,
    D3AlgoTesterService,
    ErrorService,
    IconSettingsService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
