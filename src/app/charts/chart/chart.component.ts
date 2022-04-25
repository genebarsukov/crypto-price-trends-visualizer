import { Component } from '@angular/core';
import { D3ChartService } from '../../services/d3/d3-chart.service';
import { PriceLine } from '../../models/price-line.model';
import { MessageService } from '../../services/message.service';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';

@Component({
    selector: 'app-chart',
    templateUrl: 'app/components/charts/chart/chart.component.html',
    styleUrls: [
        'app/components/charts/chart/chart.component.scss'
    ]
})

export class ChartComponent {
    protected SVG_WIDTH_MAX = 1800;
    protected SVG_HEIGHT_MAX = 800;
    protected SVG_WIDTH_MIN = 600;
    protected SVG_HEIGHT_MIN = 200;
    protected SVG_WIDTH_STEP = 300;
    protected SVG_HEIGHT_STEP = 150;
    protected svgWidth: number;
    protected svgHeight: number;

    constructor(private d3ChartService: D3ChartService,
                protected chartSettingsService: ChartSettingsService,
                protected messageService: MessageService) {
        let [width, height] = this.d3ChartService.getSvgSize();
        this.svgWidth = width;
        this.svgHeight = height;
    }

    protected sizeChartUp() {
        if (this.svgWidth < this.SVG_WIDTH_MAX && this.svgHeight < this.SVG_HEIGHT_MAX) {
            this.svgWidth += this.SVG_WIDTH_STEP;
            this.svgHeight += this.SVG_HEIGHT_STEP;
        }
        this.d3ChartService.setSvgSize(this.svgWidth, this.svgHeight);
    }

    protected sizeChartDown() {
        if (this.svgWidth > this.SVG_WIDTH_MIN && this.svgHeight > this.SVG_HEIGHT_MIN) {
            this.svgWidth -= this.SVG_WIDTH_STEP;
            this.svgHeight -= this.SVG_HEIGHT_STEP;
        }
        this.d3ChartService.setSvgSize(this.svgWidth, this.svgHeight);
    }

    public updateColor(priceLine: PriceLine) {
        this.d3ChartService.updateColor(priceLine);
    }

    public closeChart(chart: string) {
        let chartSetting = this.chartSettingsService.getChartSettings()[chart as keyof Object] as unknown as { name: string; active: boolean };
        if (chartSetting !== null) {
            chartSetting.active = false;
            this.messageService.setMessage("You can re-enable this chart by using the Settings &#9881; in the top right.");
            this.chartSettingsService.setChartSettings(this.chartSettingsService.getChartSettings());
        }
    }

}
