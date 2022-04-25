import { Injectable } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { ChartData } from '../../models/chart-data.model';

import * as d3Axis from 'd3-axis';

@Injectable()
export class D3ChartService {
    protected margin = {top: 20, right: 20, bottom: 30, left: 50};
    protected width: number = 900;
    protected height: number = 350;
    protected svg: any;
    protected x: any;
    protected y: any;
    protected priceLine: PriceLine;
    protected chartData: ChartData[];
    protected selected: boolean = false;
    protected chartType: string = '';


    constructor() {
        this.width = this.width - this.margin.left - this.margin.right;
        this.height = this.height - this.margin.top - this.margin.bottom;
    }

    public setSvgSize(width: number, height: number) {
        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;
    }

    public getSvgSize() {
        return [
            this.width + this.margin.left + this.margin.right,
            this.height + this.margin.top + this.margin.bottom
        ];
    }

    public setChartVariables(svg: any, x: any, y: any) {
        this.svg = svg;
        this.x = x;
        this.y = y;
    }

    public getChartVariables() {
        return [this.svg, this.x, this.y];
    }

    public setPriceLine(priceLine: PriceLine) {
        this.priceLine = priceLine;
    }

    public clearSvg() {
        if (this.svg) {
            this.svg.selectAll('*').remove();
        }
    }

    public setChartData(chartData: ChartData[]) {
        this.chartData = chartData;
    }

    public getChartData() {
        return this.chartData;
    }

    public getSvg() {
        return this.svg;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getBuyLimit(): any {
        return null;
    }

    public getSellLimit(): any {
        return null;
    }

    public setSelected() {
        this.selected = true;
    }

    public clearSelected() {
        this.selected = false;
    }

    public isSelected() {
        return this.selected;
    }

    public setChartType(chartType: string) {
        this.chartType = chartType;
    }

    public getChartType() {
        return this.chartType;
    }

    public updateColor(priceLine: PriceLine) {}

    public makeXGridlines() {
        return d3Axis.axisBottom(this.x);
    }

    public makeYGridlines() {
        return d3Axis.axisLeft(this.y);
    }

    public drawAxis() {
        
        // X axis
        this.svg.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(d3Axis.axisBottom(this.x));

        // Y axis left
        this.svg.append('g')
            .attr('class', 'axis axis--y')
            .call(d3Axis.axisLeft(this.y))
            .append('text')
            .attr('class', 'axis-title')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Price ($)');

        // Add X gridlines
        this.svg.append('g')
                .attr('class', 'grid')
                .attr('opacity', '0.1')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(this.makeXGridlines()
                    .tickSize(-this.height)
                    .tickFormat('')
                );

        // Add Y gridlines
        this.svg.append('g')
                .attr('class', 'grid')
                .attr('opacity', '0.1')
                .call(this.makeYGridlines()
                    .tickSize(-this.width)
                    .tickFormat('')
                );
    }
    
}