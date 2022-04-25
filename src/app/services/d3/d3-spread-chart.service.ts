import { Injectable } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { ChartData } from '../../models/chart-data.model';
import { D3ChartService } from './d3-chart.service';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';


@Injectable()
export class D3SpreadChartService extends D3ChartService {
    private firstLine: d3Shape.Line<[number, number]>;
    private secondLine: d3Shape.Line<[number, number]>;

    private priceLines: PriceLine[];

    constructor() {
        super();
        this.setChartType('spread');
    }

    public buildChart() {
        this.clearSvg();
        this.initSvg();
        this.initAxis();
        this.drawAxis();
        this.drawLine();
    }

    public setPriceLines(priceLines: PriceLine[]) {
        this.priceLines = priceLines;
    }

    public initSvg() {
        this.svg = d3.select('svg.spread-chart')
                     .append('g')
                     .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    public initAxis() {
        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.x.domain(d3Array.extent(this.chartData, (d) => d.date ));
        this.y.domain(d3Array.extent(this.chartData, (d) => d.value ));
    }

    public drawLine() {
        this.firstLine = d3Shape.line()
                                .x( (d: any) => this.x(d.date) )
                                .y( (d: any) => this.y(d.value) )

        this.secondLine = d3Shape.line()
                                 .x( (d: any) => this.x(d.date) )
                                 .y( (d: any) => this.y(0) )

        // Add the spread histogram
        this.svg.selectAll('dot')
                .data(this.chartData)
                .enter()
                .append('line')
                .attr('class', 'line-' + this.priceLines[0].index)
                .attr('stroke', (d: any) => {
                    if (d.value > 0) {
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

        // Add the first spread line
        this.svg.append('path')
                .datum(this.chartData)
                .attr('class', 'line line-' + this.priceLines[0].index)
                .attr('fill', 'none')
                .attr('stroke', this.priceLines[0].color)
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1)
                .attr('d', this.firstLine);

        // Add the second spread line
        this.svg.append('path')
                .datum(this.chartData)
                .attr('class', 'line line-' + this.priceLines[1].index)
                .attr('fill', 'none')
                .attr('stroke', this.priceLines[1].color)
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.5)
                .attr('d', this.secondLine);

        // add end value labels
        this.svg.selectAll('g')
                .data(this.chartData)
                .enter()
                .append('text')
                .filter((d: any, i: any) => { return i === 0 || i === (this.chartData.length - 1);} )
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
                .attr('class', 'line-' + this.priceLines[1].index)
                .attr('x', (d: any) => { return this.x(d.date); })
                .attr('y', (d: any) => { return this.y(d.value); });
    }

}