import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PriceLine } from './../../models/price-line.model';
import { ChartComponent } from '../charts/../chart/chart.component';
import { ScalingService } from '../../services/scaling.service';
import { D3SpreadChartService } from '../../services/d3/d3-spread-chart.service';
import { ChartData } from '../../models/chart-data.model';
import { ErrorService } from '../../services/error.service';
import { IconSettingsService } from '../../services/settings/icon-settings.service';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';
import { MessageService } from '../../services/message.service';


@Component({
    selector: 'app-spread-chart',
    templateUrl: '.spread-chart.component.html',
    styleUrls: [
        './spread-chart.component.scss'
    ]
})
export class SpreadChartComponent extends ChartComponent implements OnInit {
    @Input() lines: PriceLine[] = [];
    @Input() firstLineIndex: number = 0;
    @Input() secondLineIndex: number = 1;

    private warning: string = 'Warning: Not enough lines to build spread between. Must have at least 2. Please add more lines to the chart. Showing last rendered chart.';
    private scaledLines: PriceLine[] = [];
    private scaleType: string = 'Percent';
    // private errorMessage: string;


    constructor(private d3SpreadChartService: D3SpreadChartService,
                private scalingService: ScalingService,
                private errorService: ErrorService,
                private iconSettingsService: IconSettingsService,
                protected override chartSettingsService: ChartSettingsService,
                protected override messageService: MessageService) {
        super(d3SpreadChartService, chartSettingsService, messageService);
    }

    ngOnInit() {
        this.updateChart();
    }

    public updateChart() {
        if (this.lines.length >= 2) {
            if (this.lines[this.firstLineIndex].data && this.lines[this.secondLineIndex].data) {

                this.scaledLines = this.scalingService.copyLines([this.lines[this.firstLineIndex], this.lines[this.secondLineIndex]]);
                if (this.scaleType === 'Percent') {
                    this.scalingService.scaleLinesPercent(this.scaledLines);
                } else {
                    this.scalingService.scaleLines(this.scaledLines);
                }
                this.d3SpreadChartService.setPriceLines(this.scaledLines);
                this.d3SpreadChartService.setChartData(this.calculateSpread());

                this.d3SpreadChartService.buildChart();
            } else {
                this.errorService.setErrorMessage('Data missing from one of the price lines');
                console.log('SpreadChartComponent: Data missing from one of the price lines');
            }
        }
    }

    private calculateSpread() {
        let spread: ChartData[] = [];

        if (this.scaledLines.length == 2) {
            if (this.scaledLines[0].data.length == this.scaledLines[1].data.length) {
                for (let index in this.scaledLines[0].data) {

                    if (this.scaledLines[0].data[index] && this.scaledLines[1].data[index]) {

                        if (new Date(this.scaledLines[0].data[index].date).getTime() === new Date(this.scaledLines[1].data[index].date).getTime()) {
                            let spreadDataPoint = <ChartData> {
                                date: this.scaledLines[0].data[index].date, 
                                value: this.scaledLines[0].data[index].value - this.scaledLines[1].data[index].value
                            };
                            spread.push(spreadDataPoint);
                        }
                    }
                }
            } else {
                this.errorService.setErrorMessage('Received empty data');
                console.log('SpreadChartComponent: Received empty data');
            }
        }
        return spread;
    }

    private toggleScaleType() {
        this.scaleType = this.scaleType === 'Percent' ? 'Price' : 'Percent';
        this.updateChart();
    }

    public override updateColor(priceLine: PriceLine) {
        this.updateChart();
    }

    /**
     * Chart sizing
     */
    protected override sizeChartUp() {
        super.sizeChartUp();
        if (this.lines.length >= 2) {
            this.d3SpreadChartService.buildChart();
        }
    }

    protected override sizeChartDown() {
        super.sizeChartDown();
        if (this.lines.length >= 2) {
            this.d3SpreadChartService.buildChart();
        }
    }

}
