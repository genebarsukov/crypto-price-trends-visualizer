import { Component, OnInit, Input } from '@angular/core';
import { PriceLine } from './../../models/price-line.model';
import { ChartData } from './../../models/chart-data.model';
import { ChartComponent } from '../chart/chart.component';
import { D3MACDService } from '../../services/d3/d3-macd.service';
import { MACDData } from '../../models/macd-data.model';
import { IconSettingsService } from '../../services/settings/icon-settings.service';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';
import { MessageService } from '../../services/message.service';


@Component({
    selector: 'app-macd',
    templateUrl: './macd.component.html',
    styleUrls: [
        './macd.component.scss'
    ]
})

export class MACDComponent extends ChartComponent implements OnInit {
    @Input()
    priceLine!: PriceLine;

    private chartData: MACDData[] = [];
    private smallPeriod: number = 12;
    private largePeriod: number = 26;
    private signalPeriod: number = 9;

    constructor(private d3MACDService: D3MACDService,
                private iconSettingsService: IconSettingsService,
                protected override chartSettingsService: ChartSettingsService,
                protected override messageService: MessageService) {
        super(d3MACDService, chartSettingsService, messageService);
    }

    ngOnInit() {
        this.chartData = this.convertData(this.copyData(this.priceLine.data));
        this.d3MACDService.setChartData(this.chartData);

        this.d3MACDService.setPriceLine(this.priceLine);
        this.d3MACDService.buildChart();
    }

    public updateChartSettings(render: boolean, smallPeriod: number, largePeriod: number, signalPeriod: number) {
        this.smallPeriod = smallPeriod;
        this.largePeriod = largePeriod;
        this.signalPeriod = signalPeriod;

        this.chartData = this.convertData(this.copyData(this.priceLine.data));
        this.d3MACDService.setChartData(this.chartData);

        if (render) {
            this.d3MACDService.clearSvg();
            this.d3MACDService.buildChart();
        }
    }

    public updateMACD() {
        this.chartData = this.convertData(this.copyData(this.priceLine.data));
        this.d3MACDService.setChartData(this.chartData);

        this.d3MACDService.clearSvg();
        this.d3MACDService.buildChart();
    }

    /**
     * Convert the price data into an MACD histogram
     * All other MACD lines are also added to the data
     */
    private convertData(data: ChartData[]) {
        let convertedData: MACDData[] = [];
        let smallEMA = data[0].value;
        let largeEMA = data[0].value;
        let signalLine = 0;

        for (let index = 1; index < data.length; index++) {
            smallEMA = this.findEMA(this.smallPeriod, data[index].value, smallEMA);
            largeEMA = this.findEMA(this.largePeriod, data[index].value, largeEMA);
            let MACDLine = smallEMA - largeEMA;
            signalLine = this.findEMA(this.signalPeriod, MACDLine, signalLine);
            let MACDHistogram = MACDLine - signalLine;

            convertedData.push(<MACDData> {
                date: data[index].date,
                value: MACDHistogram,
                smallEMA: smallEMA,
                largeEMA: largeEMA,
                MACDLine: MACDLine,
                signalLine: signalLine,
                MACDHistogram: MACDHistogram,
                open: data[index].open,
                close: data[index].close,
                high: data[index].high,
                low: data[index].low,
            });
        }
        return convertedData;
    }


    /**
     * Initial SMA: 10-period sum / 10 
     * Multiplier: (2 / (Time periods + 1) ) = (2 / (10 + 1) ) = 0.1818 (18.18%)
     * EMA: {Close - EMA(previous day)} x multiplier + EMA(previous day).
     */
    private findEMA(period: number, close: number, previousEMA: number) {
        let multiplier = 2 / (period + 1);
        let EMA = (close - previousEMA) * multiplier + previousEMA;

        return EMA;
    }

    /**
     * Deep copy the price data so as not to disturb it
     */
    private copyData(originalData: ChartData[]) {
        let dataCopy = [];

        for (let originalDataPoint of originalData) {
            let dataPointCopy = <ChartData> { date: new Date(originalDataPoint.date.getTime()), value: originalDataPoint.value };
            dataCopy.push(dataPointCopy);
        }
        return dataCopy;
    }

    /**
     * Increase chart size
     */
    protected override sizeChartUp() {
        super.sizeChartUp();
        this.d3MACDService.clearSvg();
        this.d3MACDService.buildChart();
    }

    /**
     * Decrease chart size
     */
    protected override sizeChartDown() {
        super.sizeChartDown();
        this.d3MACDService.clearSvg();
        this.d3MACDService.buildChart();
    }

}
