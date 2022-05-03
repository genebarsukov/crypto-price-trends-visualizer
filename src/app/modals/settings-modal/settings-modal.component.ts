import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';

@Component({
    selector: 'app-settings-modal',
    templateUrl: './settings-modal.component.html',
    styleUrls: [
        './settings-modal.component.scss'
    ]
})

export class SettingsModalComponent implements OnInit {
    @Input()
    messageHeader!: string;
    @Input()
    messageButtonText!: string;
    @Input()
    isShown!: boolean;

    @Output() onModalDismissed: EventEmitter<string> = new EventEmitter();

    generalSettings: any = {};
    chartSettings: any = {};

    constructor(public chartSettingsService: ChartSettingsService) {}

    ngOnInit() {
        this.chartSettings = this.chartSettingsService.getChartSettings();
        this.generalSettings = this.chartSettingsService.getGeneralSettings();
    }

    changeTheme(theme: string) {
        this.chartSettingsService.setTheme(theme);
    }

    toggleSetting(setting: any) {
        setting.active = setting.active ? false : true;
    }

    toggleChartSetting(chartSetting: any) {
        chartSetting.active = chartSetting.active ? false : true;
        this.chartSettingsService.setChartSettings(this.chartSettingsService.getChartSettings());
    }

    dismissModal() {
        this.chartSettingsService.setSessionData();
        this.onModalDismissed.emit();
    }

}
