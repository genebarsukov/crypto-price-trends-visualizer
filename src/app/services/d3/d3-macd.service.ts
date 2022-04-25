import { Injectable } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { MACDData } from '../../models/macd-data.model';
import { D3ChartService } from './d3-chart.service';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';


@Injectable()
export class D3MACDService extends D3ChartService {
    private line: d3Shape.Line<[number, number]>;
    private MACDLine: d3Shape.Line<[number, number]>;
    private signalLine: d3Shape.Line<[number, number]>;


    constructor() {
        super();
        this.setChartType('macd');
    }

    public getBuyLimit() {
        return 0;
    }

    public getSellLimit() {
        return 0;
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
        this.svg = d3.select('svg.macd-chart')
                     .append('g')
                     .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    private initAxis() {
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.x.domain(d3Array.extent(this.chartData, (d) => d.date ));
        this.y.domain(d3Array.extent(this.chartData, (d) => d.value ));
    }

    private drawLine() {
        this.line = d3Shape.line()
                           .x( (d: any) => this.x(d.date) )
                           .y( (d: any) => this.y(d.value) );

        this.MACDLine = d3Shape.line()
                           .x( (d: any) => this.x(d.date) )
                           .y( (d: any) => this.y(d.MACDLine) );

        this.signalLine = d3Shape.line()
                           .x( (d: any) => this.x(d.date) )
                           .y( (d: any) => this.y(d.signalLine) );

        // Add the MACD histogram
        this.svg.selectAll('dot')
                .data(this.chartData)
                .enter()
                .append('line')
                .attr('class', 'line-' + this.priceLine.index)
                .attr('stroke', (d: any) => {
                    if (this.y(d.value) < this.y(0)) {
                        return '#5dd55d';
                    } else {
                        return '#ff3333';
                    }
                })
                .attr('stroke-width', (100 / this.chartData.length) * 8)
                .attr('x1', (d: any) => { return this.x(d.date); })
                .attr('x2', (d: any) => { return this.x(d.date); })
                .attr('y1', (d: any) => { return this.y(d.value); })
                .attr('y2', (d: any) => { return this.y(0); });


        // // Add the MACD line
        // this.svg.append('path')
        //         .datum(this.chartData)
        //         .attr('class', 'line line-' + this.priceLine.index)
        //         .attr('fill', 'none')
        //         .attr('stroke', 'black')
        //         .attr('stroke-linejoin', 'round')
        //         .attr('stroke-linecap', 'round')
        //         .attr('stroke-width', 1)
        //         .attr('d', this.MACDLine);

        // // Add the Signal line
        // this.svg.append('path')
        //     .datum(this.chartData)
        //     .attr('class', 'line line-' + this.priceLine.index)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'red')
        //     .attr('stroke-linejoin', 'round')
        //     .attr('stroke-linecap', 'round')
        //     .attr('stroke-width', 1)
        //     .attr('d', this.signalLine);

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
