import { Injectable } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { ChartData } from '../../models/chart-data.model';
import { D3ChartService } from './d3-chart.service';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';


@Injectable()
export class D3PriceChartService extends D3ChartService {
    private line: d3Shape.Line<[number, number]>;
    private lines: PriceLine[] = [];
    private lineType: string = 'line';


    constructor() {
        super();
        this.setChartType('price');
    }

    public setLines(lines: PriceLine[]) {
        this.lines = lines;
        this.setChartData(this.lines[0].data);
    }

    public setLineType(lineType: string) {
        this.lineType = lineType;
    }

    public buildChart() {
        this.clearSvg();
        this.initSvg();
        this.initAxis();
        this.drawAxis();

        for (let line of this.lines) {
            this.drawLine(line);
        }
    }

    public updateColor(priceLine: PriceLine) {
        if (priceLine.data) {
            this.svg.selectAll('.line-' + priceLine.index.toString()).remove();
            this.drawLine(priceLine);
        }
    }

    public removeLine(lineIndex: number) {
        this.lines.splice(lineIndex, 1);
        for (let index = 0; index < this.lines.length; index++) {
            this.lines[index].index = index;
        }
        this.svg.selectAll('.line-' + lineIndex.toString()).remove();
        this.buildChart();
    }

    public initSvg() {
        this.svg = d3.select('svg.price-chart')
                     .append('g')
                     .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    public initAxis() {
        let allData: ChartData[] = [];

        for (let line of this.lines) {
            if (line.data) {
                allData = allData.concat(line.data);
            }
        }

        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.x.domain(d3Array.extent(allData, (d) => d.date ));
        this.y.domain(d3Array.extent(allData, (d) => d.value ));
    }

    public drawLine(priceLine: PriceLine) {
        this.line = d3Shape.line()
                           .x( (d: any) => this.x(d.date) )
                           .y( (d: any) => this.y(d.value) )

        // Add the price line
        if (this.lineType === 'line') {
            this.svg.append('path')
                    .datum(priceLine.data)
                    .attr('class', 'line line-' + priceLine.index)
                    .attr('fill', 'none')
                    .attr('stroke', priceLine.color)
                    .attr('stroke-linejoin', 'round')
                    .attr('stroke-linecap', 'round')
                    .attr('stroke-width', 1.5)
                    .attr('d', this.line);
        }
        if (this.lineType === 'candle') {
            // Open - Close ticks
            this.svg.selectAll('dot')
                    .data(priceLine.data)
                    .enter()
                    .append('line')
                    .attr('class', 'line-' + priceLine.index)
                    .attr('stroke', (d: any) => {
                        if (this.x(d.close) > this.x(d.open)) {
                            return '#5dd55d';
                        } else {
                            return '#ff3333';
                        }
                    })
                    .attr('stroke-width', (100 / priceLine.data.length) * 8)
                    .attr('x1', (d: any) => { return this.x(d.date); })
                    .attr('x2', (d: any) => { return this.x(d.date); })
                    .attr('y1', (d: any) => { return this.y(d.open); })
                    .attr('y2', (d: any) => { return this.y(d.close); });

            // High - Low ticks
            this.svg.selectAll('dot')
                    .data(priceLine.data)
                    .enter()
                    .append('line')
                    .attr('class', 'line-' + priceLine.index)
                    .attr('stroke', (d: any) => {
                        if (this.x(d.close) > this.x(d.open)) {
                            return '#5dd55d';
                        } else {
                            return '#ff3333';
                        }
                    })
                    .attr('stroke-width', 1)
                    .attr('x1', (d: any) => { return this.x(d.date); })
                    .attr('x2', (d: any) => { return this.x(d.date); })
                    .attr('y1', (d: any) => { return this.y(d.high); })
                    .attr('y2', (d: any) => { return this.y(d.low); });
        }

        // add end value labels
        this.svg.selectAll('g')
                .data(priceLine.data)
                .enter()
                .append('text')
                .filter((d: any, i: any) => { return i === 0 || i === (priceLine.data.length - 1);} )
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
                .attr('class', 'line-' + priceLine.index)
                .attr('x', (d: any) => { return this.x(d.date); })
                .attr('y', (d: any) => { return this.y(d.value); });
    }

}