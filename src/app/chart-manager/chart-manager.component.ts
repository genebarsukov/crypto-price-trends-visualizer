import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { PriceLine } from '../models/price-line.model';
import { PriceDataService } from '../services/price-data.service';
import { RSIComponent } from '../charts/rsi/rsi.component';
import { StochasticComponent } from '../charts/stochastic/stochastic.component';
import { MACDComponent } from '../charts/macd/macd.component';
import { CurrentPricePercentComponent } from '../data-series-meta-controls/current-price-percent/current-price-percent.component';
import { ChartSettingsService } from '../services/settings/chart-settings.service';
import { PriceChartComponent } from '../charts/price-chart/price-chart.component';
import { SpreadChartComponent } from '../charts/spread-chart/spread-chart.component';
import { AlgoTesterComponent } from '../algo-tester/algo-tester.component';
import { TimeSettingsComponent } from '../data-series-meta-controls//time-settings/time-settings.component';
import { MessageService } from '../services/message.service';
import { ChartData } from '../models/chart-data.model';


@Component({
    selector: 'app-chart-manager',
    templateUrl: 'app/components/chart-manager/chart-manager.component.html',
    styleUrls: [
        'app/components/chart-manager/chart-manager.component.scss'
    ],
    viewProviders: [DragulaService],
})
export class ChartManagerComponent implements OnInit {
    @ViewChild('horizontalRuler')
    horizontalRuler!: ElementRef;
    @ViewChild('verticalRuler')
    verticalRuler!: ElementRef;
    @ViewChild('priceChartComponent')
    priceChartComponent!: PriceChartComponent;
    @ViewChild('rsiComponent')
    rsiComponent!: RSIComponent;
    @ViewChild('stochasticComponent')
    stochasticComponent!: StochasticComponent;
    @ViewChild('macdComponent')
    macdComponent!: MACDComponent;
    @ViewChild('spreadChartComponent')
    spreadChartComponent!: SpreadChartComponent;
    @ViewChild('currentPricePercentComponent')
    currentPricePercentComponent!: CurrentPricePercentComponent;
    @ViewChild('algoTester')
    algoTesterComponent!: AlgoTesterComponent;
    @ViewChild('timeSettings')
    timeSettingsComponent!: TimeSettingsComponent;
    
    private horizontalRulerHidden: boolean = true;
    private verticalRulerHidden: boolean = true;
    private rulerType = 'line';
    private scale: boolean = false;
    private scalePercent: boolean = false;
    private lines: PriceLine[] = [];
    private dataRequests: number = 0;
    private lineType: string = 'line';
    private isLoading: boolean = false;
    private initSetup: boolean = true;
    private errorMessage: string = '';
    private algoTesterIsShown!: boolean;

    private row1: any = [];
    private row2: any = [];
    private row3: any = [];
    private row4: any = [];
    private row5: any = [];
    private row6: any = [];
    private row7: any = [];
    private row8: any = [];
    private row9: any = [];
    private row10: any = [];
    private row11: any = [];
    private row12: any = [];
    private containerRows: any[] = [
        this.row1,
        this.row2,
        this.row3,
        this.row4,
        this.row5,
        this.row6,
        this.row7,
        this.row8,
        this.row9,
        this.row10,
        this.row11,
        this.row12
    ];


    constructor(private priceDataService: PriceDataService,
                private dragulaService: DragulaService,
                private chartSettingsService: ChartSettingsService,
                private messageService: MessageService) {}

    ngOnInit() {
        this.row1.push('LineSettings');
        this.row2.push('CurrentPricePercent');
        this.row5.push('TimeSettings');

        this.dragulaService.createGroup('bag', {
            invalid: (el: any, handle: any) => el.classList.contains('undraggable')
        });

        this.lines.push(this.buildNewLine());

        this.priceDataService.getDataStream().subscribe(
            (dataResponse: { data: ChartData[]; index: string | number; }) => {
                if (dataResponse && dataResponse.data && dataResponse.data) {
                    this.lines[dataResponse.index as number].data = dataResponse.data;

                    let p = this.lines[dataResponse.index as number]
                    if (this.dataRequests > 0) {
                        this.dataRequests--;
                        if (this.dataRequests === 0) {
                            this.isLoading = false;
                            this.populateContainers();
                            this.updateCharts();
                            this.timeSettingsComponent.enableSlider();
                        } else {
                            this.priceDataService.getPriceData(this.lines[this.dataRequests - 1]);
                        }
                    } else {
                        this.isLoading = false;
                        this.populateContainers();
                        this.updateCharts();
                        this.timeSettingsComponent.enableSlider();
                    }
                } else {
                    this.isLoading = false;
                    this.errorMessage = 'Got Empty Data Response. ' +
                          'The selected exchange probably does not have the crypto coin that you have selected. ' +
                          'Try selecting a different coin. Most exchanges will have BTC.';
                    this.timeSettingsComponent.enableSlider();
                }
            },
            (error: any) => {
                console.log(error);
                this.timeSettingsComponent.enableSlider();
            }
        );
        this.turnOnLoading();
        this.priceDataService.getPriceData(this.lines[this.lines.length - 1]);

        this.dragulaService.over().subscribe((value: any) => { this.onOver(value.slice(1)); });
        this.dragulaService.out().subscribe((value: any) => { this.onOut(value.slice(1)); });
        this.dragulaService.drop().subscribe((value: any) => { this.onDrop(value.slice(1)); });

    }

    /**
     * Show the loading spinner
     */
    private turnOnLoading() {
        this.isLoading = true;
    }

    /**
     * This will place out charts on the layout in the correct containers
     * They will be able to get dragged and dropped
     */
    private populateContainers() {
        if (this.initSetup) {
            this.row3.push('PriceChartComponent');
            this.row7.push('RSIComponent');
            this.row9.push('MACDComponent');
            this.row11.push('StochasticComponent');
            this.row12.push('SpreadChartComponent');
        }
        this.initSetup = false;
    }

    /**
     * Update Indicator chart data
     */
    private updateCharts() {
        this.saveSettings();

        if (this.priceChartComponent) {
            this.priceChartComponent.updateChart();
        }
        if (this.rsiComponent) {
            this.rsiComponent.updateRSI();
        }
        if (this.rsiComponent) {
            this.rsiComponent.updateRSI();
        }
        if (this.stochasticComponent) {
            this.stochasticComponent.updateStochastic();
        }
        if (this.macdComponent) {
            this.macdComponent.updateMACD();
        }
        if (this.spreadChartComponent) {
            this.spreadChartComponent.updateChart();
        }
        if (this.currentPricePercentComponent) {
            this.currentPricePercentComponent.updateData();
        }
        if (this.algoTesterComponent) {
            if (this.algoTesterComponent.getIndicators().length) {
                this.algoTesterComponent.updateParameters();

                if (this.algoTesterComponent.getOptimizationResults().length) {
                    this.algoTesterComponent.optimizeAlgo();
                }
            }
        }
    }

    private saveSettings() {
        if (this.lines) {
            let line = {
                color: this.lines[0].color,
                fromSymbol: this.lines[0].fromSymbol,
                toSymbol: this.lines[0].toSymbol,
                exchange: this.lines[0].exchange,
            }
            this.chartSettingsService.setLineSettings(line);
            this.chartSettingsService.setSessionData();
        }
        
    }

    private updateColors(priceLine: PriceLine) {
        this.saveSettings();
        
        if (this.priceChartComponent) {
            this.priceChartComponent.updateColor(priceLine);
        }
        if (this.rsiComponent) {
            this.rsiComponent.updateColor(priceLine);
        }
        if (this.rsiComponent) {
            this.rsiComponent.updateColor(priceLine);
        }
        if (this.stochasticComponent) {
            this.stochasticComponent.updateColor(priceLine);
        }
        if (this.macdComponent) {
            this.macdComponent.updateColor(priceLine);
        }
        if (this.spreadChartComponent) {
            this.spreadChartComponent.updateColor(priceLine);
        }
    }

    /**
     * Rebuild the chart after a setting changes
     */
    private rebuildSvg(priceLine: PriceLine) {
        this.turnOnLoading();
        this.priceDataService.getPriceData(priceLine);
    }

    /**
     * Rebuild the chart after a setting changes
     * dataRequests is our queue so to speak
     * Every time we get notified of new data it gets decremented
     * When it reaches 0 we rebuild the graph
     */
    private updateAllAndRebuildSvg() {
        this.dataRequests = this.lines.length;
        this.turnOnLoading();
        this.priceDataService.getPriceData(this.lines[this.dataRequests - 1]);
    }

    private colorUpdated(priceLine: PriceLine) {
        this.updateColors(priceLine);
        
    }

    private removeLine(lineIndex: number) {
        this.priceChartComponent.removeLine(lineIndex);
    }

    /**
     * Bring up the interface to add another line to the chart
     */
    addLine() {
        let newLine = this.buildNewLine();
        this.lines.push(newLine);
        this.turnOnLoading();
        this.priceDataService.getPriceData(newLine);
    }

    /**
     * Build a new PriceLine object with some default params but without chart data
     */
    buildNewLine(): PriceLine {
        let color = this.chartSettingsService.getLineSettings().color;
        if (this.lines.length > 0) {
            color = this.pickRandomColor();
        }
        let newLine = <PriceLine> {
            index: this.lines.length,
            color: color,
            fromSymbol: this.chartSettingsService.getLineSettings().fromSymbol,
            toSymbol: this.chartSettingsService.getLineSettings().toSymbol,
            exchange: this.chartSettingsService.getLineSettings().exchange,
        };
        return newLine;
    }

    private pickRandomColor() {
        let colors = [
            'blue',
            'dodgerblue',
            'green',
            'limegreen',
            'yellow',
            'gold',
            'red',
            'firebrick',
            'deeppink',
            'fuchsia',
            'black',
            'dimgray'
        ]
        let randomIndex = Math.floor(Math.random() * 12);

        return colors[randomIndex];
    }

    /**
     * Copy all the settings from the passed in Price Line aside from the data
     */
    copyPriceLineSettings(priceLine: PriceLine) {
        let newLine = <PriceLine> {
            data: [],
            index: priceLine.index,
            color: priceLine.color,
            fromSymbol: priceLine.fromSymbol,
            toSymbol: priceLine.toSymbol,
            exchange: priceLine.exchange
        };
        return newLine;
    }

    toggleScale() {
        this.scale = this.scale ? false : true;
        this.scalePercent = this.scale ? false : this.scalePercent;
        this.updateAllAndRebuildSvg();
    }

    toggleScalePercent() {
        this.scalePercent = this.scalePercent ? false : true;
        this.scale = this.scalePercent ? false : this.scale;
        this.updateAllAndRebuildSvg();
    }

    updateRulePosition(event: any) {
        if (!this.horizontalRuler.nativeElement.hidden) {
            this.horizontalRuler.nativeElement.style.top = event.pageY - (70 * this.lines.length) + 'px';
        }
        if (!this.verticalRuler.nativeElement.hidden) {
            this.verticalRuler.nativeElement.style.left = event.pageX + 10 + 'px';
        }
    }

    toggleChartRuler() {
        if (this.rulerType === 'line') {
            this.verticalRulerHidden = false;
            this.rulerType = 'crosshair';
        } else if (this.rulerType === 'crosshair') {
          this.rulerType = '';
            this.horizontalRulerHidden = false;
        } else {
            this.horizontalRulerHidden = true;
            this.verticalRulerHidden = true;
            this.rulerType = 'line';
        }
    }

    toggleLineType() {
        if (this.lineType === 'line') {
            this.lineType = 'candle';
        } else {
            this.lineType = 'line';
        }
        this.priceChartComponent.setLineType(this.lineType);
        for (let line of this.lines) {
            this.priceChartComponent.updateColor(line);
        }
    }

    /**
     * Dragula event handlers
     */
    private onOver(args: any) {
        let [el, target, source] = args;
        target.classList.add('target-drop-container');
    }

    private onOut(args: any) {
        let [el, target, source] = args;
        target.classList.remove('target-drop-container');
    }
    private onDrop(args: any) {
        let [el, target, source] = args;
        console.log(args);
        target.classList.remove('target-drop-container');
    }

    private hideErrorModal() {
        this.errorMessage = '';
    }
    

    /**
     * Show / Hide algo tester window.
     */
    private toggleAlgoTester() {
        this.algoTesterIsShown = this.algoTesterIsShown ? false : true;
        if (!this.algoTesterIsShown) {
            this.algoTesterComponent.clearOverlays();
        }
    }

    /**
     * Update the indicator parameters to new values - done when running algorithm optimization testing
     * @param chartSettings Settings object received from the algo tester
     */
    private updateChartSettings(chartSettings: any) {
        if (chartSettings.chartType == 'RSI') {
            this.rsiComponent.updateChartSettings(chartSettings.render, chartSettings.period, chartSettings.overbought, chartSettings.oversold, chartSettings.SMAPeriod);
        } else if (chartSettings.chartType == 'Stochastic') {
            this.stochasticComponent.updateChartSettings(chartSettings.render, chartSettings.period, chartSettings.overbought, chartSettings.oversold, chartSettings.SMAPeriod);
        } else if (chartSettings.chartType == 'MACD') {
            this.macdComponent.updateChartSettings(chartSettings.render, chartSettings.smallPeriod, chartSettings.largePeriod, chartSettings.signalPeriod);
        }
    }
    
}
