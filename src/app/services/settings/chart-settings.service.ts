import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChartSettingsService {
    settings = {
        theme: 'dark',
        general: {
            tooltips: { name: 'Show  Help Tooltips', active: false },
            movableCharts: { name: 'Movable Charts', active: false },
            movableControls: { name: 'Movable Controls', active: false }
        },
        chart: {
            PriceChart: { name: 'Price Chart', active: true },
            RSI: { name: 'RSI', active: true},
            Stochastic: { name: 'Stochastic', active: false },
            MACD: { name: 'MACD', active: true },
            SpreadChart: { name: 'Spread Chart', active: false }
        },
        line: {
            color: 'steelblue',
            fromSymbol: 'BTC',
            toSymbol: 'USD',
            exchange: 'Bittrex'
        }
    }

    private subs = new Subject<any>();
    private stream = this.subs.asObservable();
    private errorMesage: string = '';


    constructor() {
        if (! this.getSessionData()) {
            this.setSessionData();
        }
    }

    /**
     * Get an observable to substribe to and get notified when settings get updated
     */
    public getStream() {
        return this.stream;
    }

    /**
     * Notify subscribers when a setting is updated
     * @param settingsCategory The top level settings category that changed
     */
    private notifySubs(settingsCategory: string) {
        this.subs.next(settingsCategory);
    }


    public getGeneralSettings() {
        return this.settings.general;
    }
    public getChartSettings() {
        return this.settings.chart;
    }
    public getLineSettings() {
        return this.settings.line;
    }
    public getTheme() {
        return this.settings.theme;
    }

    public setTheme(theme: string) {
        this.settings.theme = theme;
        this.notifySubs('theme');
        this.setSessionData();
    }

    public setGeneralSettings(generalSettings: any) {
        this.settings.general = generalSettings;
        this.notifySubs('general');
        this.setSessionData();
    }

    public setChartSettings(chartSettings: any) {
        this.settings.chart = chartSettings;
        this.notifySubs('chart');
        this.setSessionData();
    }

    public setLineSettings(lineSettings: any) {
        this.settings.line = lineSettings;
        this.notifySubs('line');
        this.setSessionData();
    }

    public getActiveCharts(): any[] {
        let activeIndicators = [];

        for (let setting in this.settings.chart) {
            if (this.settings.chart[setting].active) {
                activeIndicators.push(setting);
            }
        }
        return activeIndicators;
    }

    public getSetting(settingType: string, setting: string) {
        return this.settings[settingType][setting];
    }

    public setSessionData() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    public getSessionData(): boolean {
        let settingsString = localStorage.getItem('settings');

        if (settingsString) {
            let retRievedSettings = JSON.parse(settingsString);
            retRievedSettings = this.updateSessionSettings(retRievedSettings);

            this.settings = retRievedSettings;

            return true;
        } else {
            return false;
        }
    }

    /**
     * If some new settings were added to the settings object, add these to the settion data
     * There is a case when we add a new key to the settings and then get an error because the old session data never reads from the old data
     */
    private updateSessionSettings(sessionSettings: any) {
        for (let key in this.settings) {
            if (!sessionSettings[key]) {
                sessionSettings[key] = this.settings[key];
            }
        }
        return sessionSettings;
    }
}