import { Injectable } from '@angular/core';
import { ChartData } from '../../models/chart-data.model';
import { D3ChartService } from './d3-chart.service';

import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';


/**
 * Adds a shape area to the curve on an alredy existing and set up chart
 * Adds an area bounded by the maxes and mins of the graph data
 */
@Injectable()
export class D3CurveShapeService extends D3ChartService {
    private minLine: d3Shape.Line<[number, number]>;
    private maxLine: d3Shape.Line<[number, number]>;

    private smallPeriod: number = 12;
    private largePeriod: number = 26;
    private signalPeriod: number = 5;

    private mins: ChartData[];
    private maxes: ChartData[];
    public chartBuilt: boolean = false;


    constructor() {
        super();
    }

    /**
     * Convert the price data into an MACD histogram
     * All other MACD lines are also added to the data
     */
    private convertData(data: ChartData[], shapeIterations: number) {
        let maxes = this.findMaxes(data);
        let mins = this.findMins(data);
        
        for (let index = 0; index < shapeIterations; index++) {
            maxes = this.findMaxes(maxes);
            mins = this.findMins(mins);
        }
        
        (maxes.length % 2) != 0 ? maxes.splice(0, 1) : false;
        (mins.length % 2) != 0 ? maxes.splice(0, 1) : false;

        return [mins, maxes];
    }

    private findMaxes(data: any) {
        let maxes: any[] = [];
        let previousMax = 0;
        let savedMax = 0;
        maxes.push({ date: data[0].date, value: data[0].value });
        maxes.push({ date: data[0].date, value: data[0].value });

        for (let index = 1; index < data.length - 1; index++) {
            if (data[index].value > previousMax) {
                previousMax = data[index].value;
            }
            if (data[index].value < previousMax) {
                maxes.push({ date: new Date(data[index - 1].date.getTime()), value: data[index - 1].value });
                savedMax = previousMax;
                previousMax = 0;
            }
        }
         maxes.push({ date: data[data.length - 1].date, value: data[data.length - 1].value });
        
        return maxes;
    }

    private findMins(data: any) {
        let mins: any[] = [];
        let previousMin = 9999999;
        let savedMin = 0;
         mins.push({ date: data[0].date, value: data[0].value });
         mins.push({ date: data[0].date, value: data[0].value });

        for (let index = 1; index < data.length - 1; index++) {
            if (data[index].value < previousMin) {
                previousMin = data[index].value;
            } 
            else if (data[index].value > previousMin) {
                mins.push({ date: data[index - 1].date, value: data[index - 1].value });
                savedMin = previousMin;
                previousMin = 9999999;
            }
        }
         mins.push({ date: data[data.length - 1].date, value: data[data.length - 1].value });

        return mins;
    }

    public buildChart(shapeIterations: number) {
        [this.mins, this.maxes] = this.convertData(this.chartData, shapeIterations);
        this.drawLine();
        this.chartBuilt = true;
    }

    public clearChart() {
        this.svg.selectAll('.area').remove();
        this.chartBuilt = false;
    }
    private drawLine() {
        this.minLine = d3Shape.line()
                              .x( (d: any) => this.x(d.date) )
                              .y( (d: any) => this.y(d.value) );

        this.maxLine = d3Shape.line()
                              .x( (d: any) => this.x(d.date) )
                              .y( (d: any) => this.y(d.value) );

        // Add 2 lines connecting the maxes and mins
        // Min line
        // this.svg.append('path')
        //     .datum(this.mins)
        //     .attr('class', 'area line-' + this.priceLine.index)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'red')
        //     .attr('stroke-linejoin', 'round')
        //     .attr('stroke-linecap', 'round')
        //     .attr('stroke-width', 1.5)
        //     .attr('d', this.minLine);

        // Max line
        // this.svg.append('path')
        //     .datum(this.maxes)
        //     .attr('class', 'area line-' + this.priceLine.index)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'lime')
        //     .attr('stroke-linejoin', 'round')
        //     .attr('stroke-linecap', 'round')
        //     .attr('stroke-width', 1.5)
        //     .attr('d', this.maxLine);

        let area = d3.area()
            .x0( (d: any, i: any) => { return this.x(this.mins[i] ? this.mins[i].date : 0); })
            .x1( (d: any, i: any) => { return this.x(this.maxes[i] ? this.maxes[i].date : 0); })
            .y0( (d: any, i: any) => { return this.y(this.mins[i] ? this.mins[i].value : 0); })
            .y1( (d: any, i: any) => { return this.y(this.maxes[i] ? this.maxes[i].value : 0); });

        this.svg.append('path')
            .datum(this.maxes)
            .attr('fill', this.priceLine.color)
            .attr('opacity', '0.5')
            .attr('class', 'area line-' + this.priceLine.index)
            .attr("d", area);
    }

}
