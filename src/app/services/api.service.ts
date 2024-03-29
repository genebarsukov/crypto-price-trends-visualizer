import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
    private static BASE_URL = 'https://min-api.cryptocompare.com/data';
    private static APP_NAME = 'coin';

    private timeUnit: string = 'minute'; // day hour, minute 
    private limit: string = '1440';
    private aggregate: string = '1';


    constructor(private http: HttpClient) {}

    public setTimeUnit(timeUnit: string) {
        this.timeUnit = timeUnit;
    }
    public getTimeUnit(): string {
        return this.timeUnit;
    }

    public setLimit(limit: string) {
        this.limit = limit;
    }
    public getLimit(): string {
        return this.limit;
    }

    public setAggregate(aggregate: string) {
        this.aggregate = aggregate;
    }
    public getAggregate() {
        return this.aggregate;
    }

    setTimeSettings(timeUnit: string, limit: string, aggregate: string) {
        this.timeUnit = timeUnit;
        this.limit = limit;
        this.aggregate = aggregate;
    }

    /**
     * Get new historical data from the API
     */
    public getHistoricalData(fromSymbol: string, toSymbol: string, exchange: string) {
        let params = {
            fsym: fromSymbol,
            tsym: toSymbol,
            limit: this.limit,
            aggregate: this.aggregate,
            e: exchange,
            extraParams: ApiService.APP_NAME
        };
        let paramList = [];

        for (let param in params) {
            if (params.hasOwnProperty(param)) {
                paramList.push(param + '=' + params[param as keyof Object]);
            }
        }
        let url = ApiService.BASE_URL + '/histo' + this.timeUnit + '?'  + paramList.join('&');

        return this.http.get(url)
    }

    /**
     * Get new historical data for one point in time from the API
     */
    public getHistoricalDataPoint(fromSymbol: string, exchange: string, timeStamp: string) {
        let url = ApiService.BASE_URL +
            '/pricehistorical?' +
            'fsym=' + fromSymbol + '&' +
            'tsyms=USD&' +
            'ts=' + timeStamp + '&' +
            'e=' + exchange + '&' +
            'extraParams=' + ApiService.APP_NAME;

        console.log(url);

        return this.http.get(url)
    }

}