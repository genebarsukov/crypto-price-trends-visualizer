import { Component, OnInit, Input } from '@angular/core';
import { PriceLine } from './../../models/price-line.model';
import { D3PriceChartService } from '../../services/d3/d3-price-chart.service';
import { D3CurveShapeService } from '../../services/d3/d3-curve-shape.service';
import { ChartComponent } from '../charts/../chart/chart.component';
import { ScalingService } from '../../services/scaling.service';
import { IconSettingsService } from '../../services/settings/icon-settings.service';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';
import { MessageService } from '../../services/message.service';


@Component({
    selector: 'app-price-chart',
    templateUrl: './price-chart.component.html',
    styleUrls: [
        './price-chart.component.scss'
    ]
})
export class PriceChartComponent extends ChartComponent implements OnInit {
    @Input() lines: PriceLine[] = [];
    @Input() scale: boolean = false;
    @Input() scalePercent: boolean = false;
    shapeIterations: number = 3;

    constructor(private d3PriceChartService: D3PriceChartService,
                public d3CurveShapeService: D3CurveShapeService,
                private scalingService: ScalingService,
                public iconSettingsService: IconSettingsService,
                public override chartSettingsService: ChartSettingsService,
                protected override messageService: MessageService) {
                    super(d3PriceChartService, chartSettingsService, messageService);
                }

    ngOnInit() {
        this.updateChart();
    }

    public updateChart() {
        this.d3PriceChartService.setLines(this.lines);
        this.handleScaling();
        this.d3PriceChartService.buildChart();
    }

    /**
     * Decides what type of scaling to apply, if any
     */
    private handleScaling() {
        if (this.scale) {
            this.scalingService.scaleLines(this.lines);
        }
        if (this.scalePercent) {
            this.scalingService.scaleLinesPercent(this.lines);
        }
    }

    public setLineType(lineType: string) {
        this.d3PriceChartService.setLineType(lineType);
    }

    public removeLine(lineIndex: number) {
        this.d3PriceChartService.removeLine(lineIndex);
    }

    /**
     * Chart sizing
     */
    override sizeChartUp() {
        super.sizeChartUp();
        this.d3PriceChartService.buildChart();
    }

    override sizeChartDown() {
        super.sizeChartDown();
        this.d3PriceChartService.buildChart();
    }

    /**
     * Add an area bounded by the maxes and mins of the graph data
     */
    toggleCurveShape() {
        if (this.d3CurveShapeService.chartBuilt) {
            this.d3CurveShapeService.clearChart();
        }
        else {
            let [svg, x, y] = this.d3PriceChartService.getChartVariables();
            this.d3CurveShapeService.setChartVariables(svg, x, y);
            this.d3CurveShapeService.setPriceLine(this.lines[0]);
            this.d3CurveShapeService.setChartData(this.lines[0].data);
            this.d3CurveShapeService.buildChart(this.shapeIterations);
        }

    }

    /**
     * Remove curve shape
     */
    removeCurveShape() {

    }

}
