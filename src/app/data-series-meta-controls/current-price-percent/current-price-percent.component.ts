import { Component, Input, OnInit } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';


@Component({
    selector: 'app-current-price-percent',
    templateUrl: './current-price-percent.component.html',
    styleUrls: [
        './current-price-percent.component.scss'
    ]
})

export class CurrentPricePercentComponent implements OnInit {
    @Input()
    priceLine!: PriceLine;
    price: number = 100;
    pastPrice: number = 100;
    percent!: number;
    percentArrow!: string;


    constructor(public chartSettingsService: ChartSettingsService) {}

    ngOnInit() {
        this.updateData();
    }

    public updateData() {
        if (this.priceLine.data) {
            this.price = this.priceLine.data[this.priceLine.data.length - 1].value;
            this.pastPrice = this.priceLine.data[0].value;

            if (this.price && this.pastPrice) {
                this.percent = this.round(((this.price - this.pastPrice) / this.pastPrice) * 100, 2);
                this.percentArrow = this.percent > 0 ? 'up' : 'down';
                this.percent = Math.abs(this.percent);
            }
        }
    }

    public round(number: number, precision: number) {
        let factor = Math.pow(10, precision);
        let tempNumber = number * factor;
        let roundedTempNumber = Math.round(tempNumber);

        return roundedTempNumber / factor;
    }

}
