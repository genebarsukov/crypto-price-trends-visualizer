import 'rxjs/add/operator/map';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PriceData } from '../models/price-data.model';
import { ChartData } from '../models/chart-data.model';
import { PriceLine } from '../models/price-line.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PriceDataService {
    private priceDataSubs = new Subject<any>();
    private dataStream = this.priceDataSubs.asObservable();

    private priceDataPointSubs: Subject<any> = new Subject<any>();
    private dataPointStream: Observable<any> = this.priceDataPointSubs.asObservable();
    private bitcoinPrices: any = {};


    constructor(private apiService: ApiService) {}

    public setTimeUnit(timeUnit: string) {
        this.apiService.setTimeUnit(timeUnit);
    }
    public getTimeUnit() {
        return this.apiService.getTimeUnit();
    }

    public setLimit(limit: string) {
        this.apiService.setLimit(limit);
    }
    public getLimit() {
        return this.apiService.getLimit();
    }

    public setAggregate(aggregate: string) {
        this.apiService.setAggregate(aggregate);
    }
    public getAggregate() {
        return this.apiService.getAggregate();
    }
    setTimeSettings(timeUnit: string, limit: string, aggregate: string) {
        this.apiService.setTimeSettings(timeUnit, limit, aggregate);
    }

    /**
     * Get an observable to substribe to and get notified when new data comes in
     */
    public getDataStream() {
        return this.dataStream;
    }

    /**
     * Get an observable to substribe to and get notified when a new datapoint comes in
     */
    public getDataPointStream() {
        return this.dataPointStream;
    }

    /**
     * Notify subscribers when new data is received
     * @param chartData ChartData object
     */
    private notifySubs(priceLine: PriceLine) {
        this.priceDataSubs.next(priceLine);
    }

    private notifyDataPointSubs(priceLine: PriceLine) {
        this.priceDataPointSubs.next(priceLine);
    }

    /**
     * Get price data from the API
     */
    public getPriceData(priceLine: PriceLine) {
        if (priceLine.exchange ==  'Bittrex' || priceLine.exchange ==  'Binance' || priceLine.exchange ==  'Cryptopia') {
            if (priceLine.fromSymbol == 'BTC' || priceLine.fromSymbol == 'ETH' || priceLine.fromSymbol == 'LTC') {
                this.getHistoricalData(priceLine);
            }
            else if (priceLine.toSymbol == 'USD') {
                this.getConvertedData(priceLine);
            }
            else {
                this.getHistoricalData(priceLine);
            }
        }
        else {
            this.getHistoricalData(priceLine);
        }
    }

    private getHistoricalData(priceLine: PriceLine) {
        let fromSymbol = priceLine.fromSymbol;
        let toSymbol = priceLine.toSymbol;

        if ((priceLine.exchange == 'Binance' || priceLine.exchange == 'Cryptopia') && priceLine.toSymbol == 'USD') {
            toSymbol = 'USDT';
        }
        if (priceLine.exchange == 'Binance' && priceLine.fromSymbol == 'MIOTA') {
            fromSymbol = 'IOTA';
        }

        this.apiService.getHistoricalData(fromSymbol, toSymbol, priceLine.exchange)
            .subscribe(
                response => {
                    if (response && response.length) {
                        priceLine.data = this.formatResponseData(response);
                        this.notifySubs(priceLine);
                    } else {
                        this.notifySubs(null);
                    }
                },
                error => {
                    console.log('Error Getting Data');
                }
            )
        }

    /**
     * Cutom method to get Converted data in USD for exchanges that do not serve it by default
     * @param priceLine Contains parameters to send to the API
     */
    private getConvertedData(priceLine: PriceLine) {
        let fromSymbol = priceLine.fromSymbol;
        let toSymbol = 'USD';
    
        if (priceLine.exchange == 'Binance' || priceLine.exchange == 'Cryptopia') {
            toSymbol = 'USDT';
        }
        if (priceLine.exchange == 'Binance' && priceLine.fromSymbol == 'MIOTA') {
            fromSymbol = 'IOTA';
        }

        this.apiService.getHistoricalData('BTC', toSymbol, priceLine.exchange)
            .subscribe(
                response => {
                    if (response && response.length) {
                        // Get Bitcoin price in USD
                        this.bitcoinPrices[priceLine.exchange] = response;
                        // Get target coin price in BTC and convert it to USD when the response comes back
                        this.apiService.getHistoricalData(fromSymbol, 'BTC', priceLine.exchange)
                            .subscribe(
                                response => {
                                    if (response && response.length) {
                                        let convertedData = this.convertData(response, priceLine.exchange);
                                        priceLine.data = this.formatResponseData(response);
                                        this.notifySubs(priceLine);
                                    } else {
                                        this.notifySubs(null);
                                    }
                                },
                                error => {
                                    console.log('Error Getting Data');
                                }
                            )
                    } else {
                        console.log('Error Getting Data');
                    }
                },
                error => {
                    console.log('Error Getting Data');
                }
            )
    }

    /**
     * Converts data from prices in BTC to prices in USD for certain exchanges that do not have straight USD data
     * Currenctly Bittrex and Binance
     */
    private convertData(data: any[], exchange: string) {
        let newData = [];
        for (let index in data) {
            if (index >= this.bitcoinPrices[exchange].length) {
                for (let priceType of ['open', 'high', 'low', 'close']) {
                    data[index][priceType] = 0;
                }
            } else {
                for (let priceType of ['open', 'high', 'low', 'close']) {
                    data[index][priceType] = this.round(data[index][priceType] * this.bitcoinPrices[exchange][index][priceType], 4);
                }
            }
        }
        return data;
    }

    /**
     * Get single price at a given time
     */
    public getPriceDataPoint(fromSymbol: string, exchange: string, timeStamp: string, priceType: string) {
        this.apiService.getHistoricalDataPoint(fromSymbol, exchange, timeStamp)
        .subscribe(
            response => {
                response.priceType = priceType;
                this.notifyDataPointSubs(response);
            },
            error => {
                console.log('Error Getting Data');
            }
        )
    }

    /**
     * Format the API response data to be usable in our chart
     * @param responseData Api response object
     */
    private formatResponseData(responseData: PriceData[]) {
        let chartData = [];
        let conversionFactor = 1000;

        for (let priceDataPoint of responseData) {
            let chartDataPoint: ChartData = {
                date: new Date(priceDataPoint.time * conversionFactor),
                value: priceDataPoint.close,
                open: priceDataPoint.open,
                close: priceDataPoint.close,
                high: priceDataPoint.high,
                low: priceDataPoint.low
            }
            chartData.push(chartDataPoint);
        }

        return chartData;
    }

    public round(number: number, precision: number) {
        let factor = Math.pow(10, precision);
        let tempNumber = number * factor;
        let roundedTempNumber = Math.round(tempNumber);

        return roundedTempNumber / factor;
    }

}