import { Component, OnInit, Input } from '@angular/core';
import { PriceLine } from './../../../models/price-line.model';
import { ChartData } from './../../../models/chart-data.model';
import { D3StochasticService } from '../../../services/d3/d3-stochastic.service';
import { ChartComponent } from '../chart/chart.component';
import { IconSettingsService } from '../../../services/settings/icon-settings.service';
import { ChartSettingsService } from '../../../services/settings/chart-settings.service';
import { MessageService } from '../../../services/message.service';


@Component({
    selector: 'app-stochastic',
    templateUrl: 'app/components/charts/stochastic/stochastic.component.html',
    styleUrls: [
        'app/components/charts/stochastic/stochastic.component.scss'
    ]
})

export class StochasticComponent extends ChartComponent implements OnInit {
    @Input() priceLine: PriceLine;

    private stochasticData: ChartData[] = [];
    private period: number = 14;
    private overbought: number = 80;
    private oversold: number = 20;
    private SMAPeriod: number = 5;


    constructor(private d3StochasticSrvice: D3StochasticService,
                private iconSettingsService: IconSettingsService,
                protected chartSettingsService: ChartSettingsService,
                protected messageService: MessageService) {
        super(d3StochasticSrvice, chartSettingsService, messageService);
    }

    ngOnInit() {
        this.stochasticData = this.copyData(this.priceLine.data);
        this.stochasticData = this.convertData(this.stochasticData);

        this.d3StochasticSrvice.setChartData(this.stochasticData);
        this.d3StochasticSrvice.setPriceLine(this.priceLine);
        this.d3StochasticSrvice.setOverBought(this.overbought);
        this.d3StochasticSrvice.setOverSold(this.oversold);

        this.d3StochasticSrvice.buildChart();
    }

    private updateOverBought() {
        this.d3StochasticSrvice.setOverBought(this.overbought);
    }

    private updateOverSold() {
        this.d3StochasticSrvice.setOverSold(this.oversold);
    }

    public updateChartSettings(render: boolean, period: number, overbought: number, oversold: number, SMAPeriod: number) {
        this.period = period;
        this.overbought = overbought;
        this.oversold = oversold;
        this.SMAPeriod = SMAPeriod;

        this.stochasticData = this.convertData(this.copyData(this.priceLine.data));
        this.d3StochasticSrvice.setChartData(this.stochasticData);

        if (render) {
            this.d3StochasticSrvice.clearSvg();
            this.d3StochasticSrvice.buildChart();
        }
    }

    public updateStochastic() {
        this.stochasticData = this.convertData(this.copyData(this.priceLine.data));
        this.d3StochasticSrvice.setChartData(this.stochasticData);

        this.d3StochasticSrvice.clearSvg();
        this.d3StochasticSrvice.buildChart();
    }

    /**
     * Convert the price data into a Stochastic - friendly 0-100 range
     * 100 * (close - lowest low) 
     *       (highest high - lowest low)
     */
    private convertData(data: ChartData[]) {
        let convertedData: ChartData[] = [];
        for (let index = 0; index <= this.period; index++) {
            convertedData.push(<ChartData>{ date: data[index].date, value: 50 });
        }

        let lowestLow = { value: 1000000, position: 0 };
        let highestHigh = { value: 0, position: 0 };

        // Calculate all subsequent values based on that
        for (let index = this.period + 1; index < data.length; index++) {
            let close = data[index].value;

            // Reset max and mins if they are older than the current range
            if ((index - lowestLow.position) > this.period) {
                lowestLow.value = 1000000;
            }
            if ((index - highestHigh.position) > this.period) {
                highestHigh.value = 0;
            }

            // Find lowest low
            if (close < lowestLow.value) {
                lowestLow.value = close;
                lowestLow.position = index;
            } else {
                lowestLow = this.findMin(data, index);
            }

            // Find highest high
            if (close > highestHigh.value) {
                highestHigh.value = close;
                highestHigh.position = index;
            } else {
                highestHigh = this.findMax(data, index);
            }
            let K = 50;
            if ((highestHigh.value - lowestLow.value) !== 0) {
                K = 100 * ((close - lowestLow.value) / (highestHigh.value - lowestLow.value));
            }
            K = this.findSMA(K, convertedData, this.SMAPeriod);

            convertedData.push({ date: data[index].date, value: K });
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

    private findMin(data: ChartData[], currentIndex: number) {
        let min = { value: 1000000, position: 0 };

        for (let index = currentIndex; index > currentIndex - this.period; index--) {
            if (data[index].value < min.value) {
                min.value = data[index].value;
                min.position = index;
            }
        }
        return min;
    }

    private findMax(data: ChartData[], currentIndex: number) {
        let max = { value: 0, position: 0 };

        for (let index = currentIndex; index > currentIndex - this.period; index--) {
            if (data[index].value > max.value) {
                max.value = data[index].value;
                max.position = index;
            }
        }
        return max;
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

    protected sizeChartUp() {
        super.sizeChartUp();
        this.d3StochasticSrvice.clearSvg();
        this.d3StochasticSrvice.buildChart();
    }

    protected sizeChartDown() {
        super.sizeChartDown();
        this.d3StochasticSrvice.clearSvg();
        this.d3StochasticSrvice.buildChart();
    }

}
