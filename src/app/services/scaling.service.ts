import { Injectable } from '@angular/core';
import { PriceLine } from '../models/price-line.model';
import { ChartData } from '../models/chart-data.model';


@Injectable()
export class ScalingService {

    /**
     * Scale all lines to the first line
     */
    public scaleLines(lines: PriceLine[]) {
        for (let index in lines) {
            if (parseInt(index, 10) > 0) {
                let offsetValue = lines[0].data[0].value - lines[index].data[0].value;
                let offsetOpen = lines[0].data[0].open - lines[index].data[0].open;
                let offsetClose = lines[0].data[0].close - lines[index].data[0].close;
                let offsetHigh = lines[0].data[0].high - lines[index].data[0].high;
                let offsetLow = lines[0].data[0].low - lines[index].data[0].low;

                for (let dataPoint of lines[index].data) {
                    dataPoint.value = dataPoint.value + offsetValue;
                    dataPoint.open = dataPoint.open + offsetOpen;
                    dataPoint.close = dataPoint.close + offsetClose;
                    dataPoint.high = dataPoint.high + offsetHigh;
                    dataPoint.low = dataPoint.low + offsetLow;
                }
            }
        }
    }

    /**
     * Scale all lines as a percentage of their first value
     */
    public scaleLinesPercent(lines: PriceLine[]) {
        for (let line of lines) {
            let scalerValue = line.data[0].value;
            let scalerOpen = line.data[0].open;
            let scalerClose = line.data[0].close;
            let scalerHigh = line.data[0].high;
            let scalerLow = line.data[0].low;
            for (let dataPoint of line.data) {
                dataPoint.value = (dataPoint.value / scalerValue) * 100;
                dataPoint.open = (dataPoint.open / scalerOpen) * 100;
                dataPoint.close = (dataPoint.close / scalerClose) * 100;
                dataPoint.high = (dataPoint.high / scalerHigh) * 100;
                dataPoint.low = (dataPoint.low / scalerLow) * 100;
            }
        }
    }

    /**
     * Deep copy the price data so as not to disturb it
     */
    public copyLines(lines: PriceLine[]) {
        let copiedLines: PriceLine[] = [];

        for (let line of lines) {

            let lineCopy = <PriceLine> {
                data: [],
                index: line.index,
                color: line.color,
                fromSymbol: line.fromSymbol,
                toSymbol: line.toSymbol,
                exchange: line.exchange
            };

            for (let originalDataPoint of line.data) {
                let dataPointCopy = <ChartData> { date: new Date(originalDataPoint.date.getTime()), value: originalDataPoint.value };
                lineCopy.data.push(dataPointCopy);
            }
            copiedLines.push(lineCopy);
        }
        return copiedLines;
    }

}