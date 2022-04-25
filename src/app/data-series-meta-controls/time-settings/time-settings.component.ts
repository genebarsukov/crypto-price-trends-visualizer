import { Component, OnInit, Output, HostListener } from '@angular/core';
import { TimeSettingsSettingsService } from "../../services/settings/time-settings-settings.service";
import { PriceDataService } from '../../services/price-data.service';
import { EventEmitter } from '@angular/core';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';

@Component({
    selector: 'app-time-settings',
    templateUrl: './time-settings.component.html',
    styleUrls: [
        './time-settings.component.scss'
    ]
})

export class TimeSettingsComponent implements OnInit {
    @Output() onRebuildSvg = new EventEmitter();
    private MIN_LIMIT: number = 15;
    private MAX_LIMIT: number = 1440;

    private timeUnit: string = 'minute';
    private limit: string = '1440';
    private aggregate: string = '1';
    selectedPeriod: any;
    private periods: any[] = [
        { index: 0, name: 'Hour', unit: 'minute', limit: '60'},
        { index: 1, name: '12 Hour', unit: 'minute', limit: '720'},
        { index: 2, name: 'Day', unit: 'minute', limit: '1440'},
        { index: 3, name: 'Week', unit: 'hour', limit: '168'},
        { index: 4, name: 'Month', unit: 'hour', limit: '720'},
        { index: 5, name: '3 Months', unit: 'day', limit: '90'},
        { index: 6, name: '6 Months', unit: 'day', limit: '183'},
        { index: 7, name: 'Year', unit: 'day', limit: '365'}
    ];
    private sliderEnabled: boolean = true;


    constructor(private priceDataService: PriceDataService, 
                private timeSettingsSettingsService: TimeSettingsSettingsService, 
                private chartSettingsService: ChartSettingsService) {}

    ngOnInit() {
        this.selectedPeriod = this.periods[this.timeSettingsSettingsService.getSelectedPeriodIndex()];
        this.timeUnit = this.priceDataService.getTimeUnit();
        this.limit = this.priceDataService.getLimit();
        this.aggregate = this.priceDataService.getAggregate();

        this.updateTimeSetings();
        this.updateSelectedPeriod();
    }

    private updateTimeSetings() {
        this.priceDataService.setTimeSettings(this.timeUnit, this.limit, this.aggregate);
    }

    private switchTimeUnit(timeUnit: string) {
        this.timeUnit = timeUnit;
        this.priceDataService.setTimeUnit(timeUnit);
        this.updateSelectedPeriod();
        this.onRebuildSvg.emit();
    }

    /**
     * Enable slider after data response has returned
     */
    public enableSlider() {
        this.sliderEnabled = true;
    }

    private switchLimit(event: any) {
        this.limit = event.srcElement.value;
        if (parseInt(this.limit, 10) < this.MIN_LIMIT) {
            this.limit = this.MIN_LIMIT.toString();
        } else if (parseInt(this.limit, 10) > this.MAX_LIMIT) {
            this.limit = this.MAX_LIMIT.toString();
        }

        this.priceDataService.setLimit(this.limit);
        this.updateSelectedPeriod();
        this.onRebuildSvg.emit();

        // Disable slider while getting data
        this.sliderEnabled = false;
    }

    private updateSelectedPeriod() {
        let selectedIndex = 0;
        for (let period of this.periods) {
            if (this.timeUnit === period.unit) {
                if (parseInt(this.limit, 10) >= parseInt(period.limit, 10)) {
                    selectedIndex = period.index;
                } else {
                    if (period.index === 0) {
                        selectedIndex = 0;
                    }
                }
            }
        }

        this.selectedPeriod = this.periods[selectedIndex];
    }

    public updateData() {
        this.timeSettingsSettingsService.setSelectedPeriodIndex(this.selectedPeriod.index);

        this.limit = this.selectedPeriod.limit;
        this.timeUnit = this.selectedPeriod.unit;
        this.priceDataService.setLimit(this.limit);
        this.priceDataService.setTimeUnit(this.timeUnit);
        this.onRebuildSvg.emit();
    }

    @HostListener('mousedrag', ['$event'])
    onMousemove(event: MouseEvent) {
        console.log(event);

    }

}
