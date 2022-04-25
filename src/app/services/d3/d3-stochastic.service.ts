import { Injectable } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { ChartData } from '../../models/chart-data.model';
import { D3ChartService } from './d3-chart.service';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';


@Injectable()
export class D3StochasticService extends D3ChartService {
    private line: d3Shape.Line<[number, number]>;
    private overBoughtLine: d3Shape.Line<[number, number]>;
    private overSoldLine: d3Shape.Line<[number, number]>;

    private overbought: number = 70;
    private oversold: number = 30;


    constructor() {
        super();
        this.setChartType('stochastic');
    }

    public setOverBought(overbought: number) {
        this.overbought = overbought;
    }
    public setOverSold(oversold: number) {
        this.oversold = oversold;
    }

    public getBuyLimit() {
        return this.oversold;
    }

    public getSellLimit() {
        return this.overbought;
    }

    public buildChart() {
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawLine();
    }

    public updateColor(priceLine: PriceLine) {
        if (priceLine.data) {
            this.svg.selectAll('.line-' + priceLine.index.toString()).remove();
            this.drawLine();
        }
    }

    public initSvg() {
        this.svg = d3.select('svg.stochastic-chart')
                     .append('g')
                     .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private initAxis() {
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.x.domain(d3Array.extent(this.chartData, (d) => d.date ));
        this.y.domain(d3Array.extent([{value: 0}, {value: 100}], (d) => d.value ));
    }

    private drawLine() {
        this.line = d3Shape.line()
                           .x( (d: any) => this.x(d.date) )
                           .y( (d: any) => this.y(d.value) );

        this.overBoughtLine = d3Shape.line()
                           .x( (d: any) => this.x(d.date) )
                           .y( (d: any) => this.y(this.overbought) );

        this.overSoldLine = d3Shape.line()
                           .x( (d: any) => this.x(d.date) )
                           .y( (d: any) => this.y(this.oversold) );

        // Add the price line
        this.svg.append('path')
                .datum(this.chartData)
                .attr('class', 'line line-' + this.priceLine.index)
                .attr('fill', 'none')
                .attr('stroke', this.priceLine.color)
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.5)
                .attr('d', this.line);

        this.svg.selectAll('dot')
                .data(this.chartData)
                .enter()
                .append('circle')
                .filter((d: any) => { return d.value > this.overbought; })
                .style('fill', 'limegreen')
                .attr('r', 4)
                .attr('cx', (d: any) => { return this.x(d.date); })
                .attr('cy', (d: any) => { return this.y(d.value); });

        this.svg.selectAll('dot')
                .data(this.chartData)
                .enter()
                .append('circle')
                .filter((d: any) => { return d.value < this.oversold; })
                .style('fill', 'red')
                .attr('r', 4)
                .attr('cx', (d: any) => { return this.x(d.date); })
                .attr('cy', (d: any) => { return this.y(d.value); });;

        this.svg.selectAll('dot')
                .data(this.chartData)
                .enter()
                .append('circle')
                .filter((d: any) => { return d.value > 99; })
                .style('fill', 'orange')
                .attr('r', 7)
                .attr('cx', (d: any) => { return this.x(d.date); })
                .attr('cy', (d: any) => { return this.y(d.value); });;

        // Add the overbought line
        this.svg.append('path')
                .datum(this.chartData)
                .attr('class', 'line line-' + this.priceLine.index)
                .attr('fill', 'none')
                .attr('stroke', 'limegreen')
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1)
                .style('stroke-dasharray', ('3, 3'))
                .attr('d', this.overBoughtLine);

        // Add the oversold line
        this.svg.append('path')
            .datum(this.chartData)
            .attr('class', 'line line-' + this.priceLine.index)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 1)
            .style('stroke-dasharray', ('3, 3'))
            .attr('d', this.overSoldLine);

        // add end value labels
        this.svg.selectAll('g')
                .data(this.chartData)
                .enter()
                .append('text')
                .filter((d: any, i: any) => { return i === 0 || i === (this.chartData.length - 2); } )
                .text((d: any, i: any) => {
                    return d.value;
                })
                .style('text-anchor', 'left')
                .style('fill', '#555')
                .style('font-family', 'Arial')
                .style('font-weight', 'bold')
                .style('user-select', 'none')
                .style('cursor', 'default')
                .style('font-size', 10)
                .attr('class', 'line-' + this.priceLine.index)
                .attr('x', (d: any) => { return this.x(d.date); })
                .attr('y', (d: any) => { return this.y(d.value); });
    }

}
