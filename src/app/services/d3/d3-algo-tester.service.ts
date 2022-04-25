import { Injectable } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { ChartData } from '../../models/chart-data.model';
import { D3ChartService } from './d3-chart.service';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { D3RSIService } from './d3-rsi.service';
import { D3PriceChartService } from './d3-price-chart.service';
import { D3StochasticService } from './d3-stochastic.service';
import { D3MACDService } from './d3-macd.service';


@Injectable()
export class D3AlgoTesterService {
    private testResults: any[] = [];
    private chartServiceMap: any = {
        'RSI': null,
        'Stochastic': null,
        'MACD': null
    };
    private priceService: D3PriceChartService;
    selectedService: D3ChartService;

    private buyPoints: ChartData[] = [];
    private sellPoints: ChartData[] = []; 
    private algoProfit: number = 0;
    private chartProfit: number = 0;
    private tradeFee: number = 0;
    private coinsPerTrade: number = 0;


    constructor(private d3PriceChartService: D3PriceChartService,
                private d3RSIService: D3RSIService,
                private d3StochasticService: D3StochasticService,
                private d3MACDService: D3MACDService) {
        this.priceService = this.d3PriceChartService;
        this.chartServiceMap.RSI = this.d3RSIService;
        this.chartServiceMap.Stochastic = this.d3StochasticService;
        this.chartServiceMap.MACD = this.d3MACDService;
    }

    public setSelectedChartService(chartService: string) {
        this.selectedService = this.chartServiceMap[chartService];
    }

    public setTradeFee(tradeFee: number) {
        this.tradeFee = tradeFee;
    }
    
    public setCoinsPerTrade(coinsPerTrade: number) {
        this.coinsPerTrade = coinsPerTrade;
    }

    public getAlgoProfit() {
        return this.algoProfit;
    }

    public getChartProfit() {
        return this.chartProfit;
    }

    public getInitialCoinPrice() {
        return this.priceService.getChartData()[0].value;
    }

    public createChartOverlays() {
        this.clearOverlays();
        
        // Draw the buy and sell markers for the selected indicator chart
        this.clculateBuyAndSellPoints(this.selectedService);
        this.drawOverlay(this.selectedService);

        // Draw the buy and sell markers for the price chart
        this.copyBuyAndSellPoints(this.priceService);
        this.drawOverlay(this.priceService);
    }


    public clculateBuyAndSellPoints(chartService: D3ChartService) {
        let previousPointType = '';
        let previousBuyValue = 0;
        for (let index = 1; index < chartService.getChartData().length; index++) {

            if (previousPointType !== 'buy' 
                && chartService.getChartData()[index - 1].value < chartService.getBuyLimit() 
                && chartService.getChartData()[index].value > chartService.getBuyLimit()) {
                    
                this.buyPoints.push(<ChartData> {
                        date: new Date(chartService.getChartData()[index].date.getTime()), 
                        value: chartService.getChartData()[index].value
                    });
                previousBuyValue = chartService.getChartData()[index].value;
                previousPointType = 'buy';
            }
            else if (previousPointType == 'buy' 
                     && chartService.getChartData()[index - 1].value > chartService.getSellLimit() 
                     && chartService.getChartData()[index].value < chartService.getSellLimit()) {

                this.sellPoints.push(<ChartData> {
                    date: new Date(chartService.getChartData()[index].date.getTime()), 
                    value: chartService.getChartData()[index].value
                });
                this.sellPoints[this.sellPoints.length - 1]['profit'] = Math.round(this.sellPoints[this.sellPoints.length - 1].value - previousBuyValue);
                previousPointType = 'sell';
            }
        }
    }

    public copyBuyAndSellPoints(chartService: D3ChartService) {
        let buyIndex = 0;
        let sellIndex = 0;
        let previousBuyValue = 0;
        let previousPointType = '';

        if (chartService.getChartData().length) {
            this.chartProfit = (chartService.getChartData()[chartService.getChartData().length - 1].value - chartService.getChartData()[0].value) * this.coinsPerTrade * (1 - this.tradeFee);
            this.chartProfit = this.round(this.chartProfit, 2);
        }

        for (let index = 1; index < chartService.getChartData().length; index++) {

            if (previousPointType !== 'buy' 
                && this.buyPoints.length > buyIndex 
                && chartService.getChartData()[index].date.getTime() == this.buyPoints[buyIndex].date.getTime()) {

                this.buyPoints[buyIndex].value = chartService.getChartData()[index].value;
                previousBuyValue = chartService.getChartData()[index].value;
                buyIndex ++;
                previousPointType = 'buy';
            }
            else if (previousPointType == 'buy' 
                     && this.sellPoints.length > sellIndex 
                     && chartService.getChartData()[index].date.getTime() == this.sellPoints[sellIndex].date.getTime()) {

                this.sellPoints[sellIndex].value = chartService.getChartData()[index].value;
                let profit = this.round((chartService.getChartData()[index].value - previousBuyValue) * this.coinsPerTrade, 2);
                this.sellPoints[sellIndex]['profit'] = profit;
                this.algoProfit += (profit * (1 - this.tradeFee));
                this.testResults.push({ buy: previousBuyValue, sell: chartService.getChartData()[index].value, profit: profit });
                sellIndex ++;
                previousPointType = 'sell';
            }
        }
    }

    public clearOverlays() {
        this.buyPoints = []
        this.sellPoints = []
        this.algoProfit = 0;
        this.testResults = [];

        if (this.priceService) {
            this.clearOverlay(this.priceService);
        }
        if (this.selectedService) {
            this.clearOverlay(this.selectedService);
        }
    }

    public clearOverlay(chartService: D3ChartService) {
        if (chartService.getSvg()) {
            chartService.getSvg().selectAll('.algo-tester-marker').remove();
        }
    }

    public getTestResults() {
        return this.testResults;
    }

    public round(number: number, precision: number) {
        let factor = Math.pow(10, precision);
        let tempNumber = number * factor;
        let roundedTempNumber = Math.round(tempNumber);

        return roundedTempNumber / factor;
    }

    public drawOverlay(chartService: D3ChartService) {
        // Buy markers
        chartService.getSvg().selectAll('dot')
                             .data(this.buyPoints)
                             .enter()
                             .append('text')
                             .html('&#x25B2;')
                             .style('text-anchor', 'middle')
                             .style('fill', 'lime')
                             .style('opacity', '0.7')
                             .style('background-color', 'lime')
                             .style('font-family', 'Arial')
                             .style('font-weight', 'bold')
                             .style('user-select', 'none')
                             .style('cursor', 'default')
                             .style('font-size', 20)
                             .attr('class', 'algo-tester-marker buy-marker')
                             .attr('x', (d: any) => { return chartService.getX()(d.date); })
                             .attr('y', (d: any) => { return chartService.getY()(d.value); })

        // Sell markers
        chartService.getSvg().selectAll('dot')
                             .data(this.sellPoints)
                             .enter()
                             .append('text')
                             .html('&#x25BC')
                             .style('text-anchor', 'middle')
                             .style('fill', 'red')
                             .style('opacity', '0.7')
                             .style('font-family', 'Arial')
                             .style('font-weight', 'bold')
                             .style('user-select', 'none')
                             .style('cursor', 'default')
                             .style('font-size', 20)
                             .attr('class', 'algo-tester-marker sell-marker')
                             .attr('x', (d: any) => { return chartService.getX()(d.date); })
                             .attr('y', (d: any) => { return chartService.getY()(d.value); });

        // Profit labels for sell markers
        chartService.getSvg().selectAll('dot')
                    .data(this.sellPoints)
                    .enter()
                    .append('text')
                    .text((d: any, i: any) => {
                        return d.profit;
                    })
                    .style('text-anchor', 'middle')
                    .style('fill', (d: any) => {
                        if (d.profit > 0) {
                            return '#5dd55d';
                        } else {
                            return '#ff3333';
                        }
                    })
                    .style('opacity', '1.0')
                    .style('font-family', 'Arial')
                    .style('font-weight', 'bold')
                    .style('user-select', 'none')
                    .style('cursor', 'default')
                    .style('font-size', 14)
                    .attr('class', 'algo-tester-marker sell-marker')
                    .attr('x', (d: any) => { return chartService.getX()(d.date); })
                    .attr('y', (d: any) => { return chartService.getY()(d.value) - 20; });
    }

}