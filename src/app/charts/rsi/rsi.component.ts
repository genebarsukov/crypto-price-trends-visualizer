import { Component, OnInit, Input } from '@angular/core';
import { PriceLine } from './../../models/price-line.model';
import { ChartData } from './../../models/chart-data.model';
import { D3RSIService } from '../../services/d3/d3-rsi.service';
import { ChartComponent } from '../../charts/chart/chart.component';
import { IconSettingsService } from '../../services/settings/icon-settings.service';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';
import { MessageService } from '../../services/message.service';


@Component({
    selector: 'app-rsi',
    templateUrl: 'app/components/charts/rsi/rsi.component.html',
    styleUrls: [
        'app/components/charts/rsi/rsi.component.scss'
    ]
})

export class RSIComponent extends ChartComponent implements OnInit {
    @Input()
    priceLine!: PriceLine;

    private rsiData: ChartData[] = [];
    private period: number = 14;
    private overbought: number = 70;
    private oversold: number = 30;
    private SMAPeriod: number = 3;


    constructor(private d3RSIService: D3RSIService, 
                private iconSettingsService: IconSettingsService,
                protected override chartSettingsService: ChartSettingsService,
                protected override messageService: MessageService) {
        super(d3RSIService, chartSettingsService, messageService);
    }

    ngOnInit() {
        this.rsiData = this.copyData(this.priceLine.data);
        this.rsiData = this.convertData(this.rsiData);

        this.d3RSIService.setChartData(this.rsiData);
        this.d3RSIService.setPriceLine(this.priceLine);
        this.d3RSIService.setOverBought(this.overbought);
        this.d3RSIService.setOverSold(this.oversold);

        this.d3RSIService.buildChart();
    }

    private updateOverBought() {
        this.d3RSIService.setOverBought(this.overbought);
    }

    private updateOverSold() {
        this.d3RSIService.setOverSold(this.oversold);
    }

    public updateChartSettings(render: boolean, period: number, overbought: number, oversold: number, SMAPeriod: number) {
        this.period = period;
        this.overbought = overbought;
        this.oversold = oversold;
        this.SMAPeriod = SMAPeriod;
        
        this.rsiData = this.convertData(this.copyData(this.priceLine.data));
        this.d3RSIService.setChartData(this.rsiData);
        
        if (render) {
            this.d3RSIService.clearSvg();
            this.d3RSIService.buildChart();
        }
    }

    public updateRSI() {
        this.rsiData = this.convertData(this.copyData(this.priceLine.data));
        this.d3RSIService.setChartData(this.rsiData);

        this.d3RSIService.clearSvg();
        this.d3RSIService.buildChart();
    }

    /**
     * Convert the price data into an RSI - friendly 0-100 range
     */
    private convertData(data: ChartData[]) {
        let convertedData: ChartData[] = [];
        for (let index = 0; index < this.period; index++) {
            convertedData.push(<ChartData> { date: data[index].date, value: 50 });
        }

        // Calculate first value
        let avgGains = this.findFirstGains(data) / this.period;
        let avgLosses = this.findFirstLosses(data) / this.period;
        let RS = avgGains / avgLosses;
        let RSI = 100 - (100 / (1 + RS));

        convertedData.push(<ChartData> { date: data[this.period].date, value: RSI });

        // Calculate all subsequent values based on that
        for (let index = this.period + 1; index < data.length; index++) {
            let currentGain = 0;
            let currentLoss = 0;

            let diff = data[index].value - data[index - 1].value;
            if (diff > 0) {
                currentGain = diff;
            } else {
                currentLoss = -1 * diff;
            }
            avgGains = (avgGains * (this.period - 1) + currentGain) / this.period;
            avgLosses = (avgLosses * (this.period - 1) + currentLoss) / this.period;

            RS = avgGains / avgLosses;
            RSI = 100 - (100 / (1 + RS));
            RSI = this.findSMA(RSI, convertedData, this.SMAPeriod);

            convertedData.push(<ChartData> { date: data[index].date, value: RSI });
        }
        return convertedData;
    }

    private findSMA(latestValue: number, data: ChartData[], period: number) {
        let sum = latestValue;
        for (let index = (data.length - 1); index > (data.length - 1) - (period - 1); index--) {
            sum += data[index].value;
        }

        return sum / period;
    }

    private findFirstGains(data: ChartData[]) {
        let gains = 0;
        for (let index = 1; index < this.period; index++) {
            if (data[index].value > data[index - 1].value) {
                gains += (data[index].value - data[index - 1].value);
            }
        }
        return gains;
    }

    private findFirstLosses(data: ChartData[]) {
        let losses = 0;
        for (let index = 1; index <= this.period; index++) {
            if (data[index].value < data[index - 1].value) {
                losses += (data[index - 1].value - data[index].value);
            }
        }
        return losses;
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

    protected override sizeChartUp() {
        super.sizeChartUp();
        this.d3RSIService.clearSvg();
        this.d3RSIService.buildChart();
    }

    protected override sizeChartDown() {
        super.sizeChartDown();
        this.d3RSIService.clearSvg();
        this.d3RSIService.buildChart();
    }

}
