import { Injectable } from '@angular/core';


@Injectable()
export class TimeSettingsSettingsService {
    private selectedPeriodIndex: number = 0;

    public setSelectedPeriodIndex(selectedPeriodIndex: number) {
        this.selectedPeriodIndex = selectedPeriodIndex;
    }

    public getSelectedPeriodIndex() {
        return this.selectedPeriodIndex;
    }
}