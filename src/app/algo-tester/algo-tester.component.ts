import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { D3AlgoTesterService } from '../services/d3/d3-algo-tester.service';
import { ChartSettingsService } from '../services/settings/chart-settings.service';
import { ErrorService } from '../services/error.service';
import { Optimizations, optimizations } from './optimizations';


@Component({
    selector: 'app-algo-tester',
    templateUrl: './algo-tester.component.html',
    styleUrls: [
        './algo-tester.component.scss'
    ]
})

export class AlgoTesterComponent implements OnInit {
    @Output() onDismissed: EventEmitter<string> = new EventEmitter();
    @Output() onUpdateChartSettings: EventEmitter<any> = new EventEmitter();
    private availableIndicators: string[] = [
        'RSI',
        'Stochastic',
        'MACD'
    ];
    public isLoading = false;
    public tradeFees: number[] = [
        0,
        0.1,
        0.25,
        0.5,
        1.1,
        2.0,
        2.5,
        3.0,
        4.0,
        5.0
    ];
    public excludedHeadings: string[] = ['chartType', 'index', 'render'];
    public indicators: string[] = [];
    public selectedIndicator!: string;
    public testResults: any[] = [];
    public optimizationResults: any[] = [];
    public algoProfit: number = 0;
    public chartProfit: number = 0;
    public profitDiff: number = 0;
    public profitDiffPercent: string = '';
    public maxOptimizedProfit: number = 0;
    public optimizedSettingToRender: any = {};
    public optimizationExpanded: boolean = false;
    public lastSortOrder: any = {};
    public tradeFee: number = 0;       // Trade fees are given as a percentage of total trade cost
    public coinsPerTrade: number = 1;  // Cost of the inital trade. Currently the same coin amount is assumed for all trades
    public costPerTrade: number = 0;


    constructor(public chartSettingsService: ChartSettingsService, 
                private d3AlgoTesterService: D3AlgoTesterService,
                private errorService: ErrorService) {}

    ngOnInit() {
        this.chartSettingsService.getStream().subscribe(
            (setting: string) => {
                if (setting == 'chart') {
                    this.updateParameters();
                }
            },
            (error: any) => {
                console.log(error);
            }
        )
        this.updateParameters();
    }

    public getOptimizationResults() {
        return this.optimizationResults;
    }
    public getIndicators() {
        return this.indicators;
    }

    public updateComponentAndOptimize() {
        this.setSelectedChartService(this.selectedIndicator);
        this.setTradeFee(this.tradeFee);
        this.setCoinsPerTrade();

        this.updateComponent();
        if (this.optimizationResults.length) {
            this.optimizeAlgo();
        }
    }

    /**
     * Invoked when a new indicator is picked from the UI
     * @param chartService The service for the indicator that is picked
     */
    setSelectedChartService(chartService: string) {
        this.clearOverlays();
        this.d3AlgoTesterService.setSelectedChartService(chartService);
        this.updateComponent();
    
        if (this.optimizationResults.length) {
            this.optimizeAlgo();
        }
    }

    /**
     * Invoked when a new trade fee is picked from the UI
     * @param tradeFee The fee that the supposed exchange chardes per trade
     */
    setTradeFee(tradeFee: number) {
        this.d3AlgoTesterService.setTradeFee(tradeFee);
        this.clearOverlays();
        this.updateComponent();
    
        if (this.optimizationResults.length) {
            this.optimizeAlgo();
        }
    }

    /**
     * Invoked when a new amount of coins per trade is set
     */
    setCoinsPerTrade() {
        this.costPerTrade = this.d3AlgoTesterService.round(this.coinsPerTrade * this.d3AlgoTesterService.getInitialCoinPrice(), 1);
        this.d3AlgoTesterService.setCoinsPerTrade(this.coinsPerTrade);
    }

    /**
     * Invoked when a new initial trade dollar amount is set
     */
    setCostPerTrade() {
        this.coinsPerTrade = this.d3AlgoTesterService.round(this.costPerTrade / this.d3AlgoTesterService.getInitialCoinPrice(), 4);
        this.d3AlgoTesterService.setCoinsPerTrade(this.coinsPerTrade);
    }

    /**
     * Updates list of available indicators in the UI
     * Sets the selected indicator and trade fee to the first values in the respective lists
     * Updates the component - re-runs the algo and rebuilds the buy and sell points
     * Invoked on initial start up
     * Invoked when a chart is added or removed such as in the settings
     * 
     */
    public updateParameters() {
        let activeCharts = this.chartSettingsService.getActiveCharts();
        let trimmedIndicators = [];

        for(let index = 0; index < this.availableIndicators.length; index++) {
            if (activeCharts.indexOf(this.availableIndicators[index]) != -1) {
                trimmedIndicators.push(this.availableIndicators[index]);
            }
        }
        this.indicators = trimmedIndicators.slice();

        if (this.indicators.length) {
            this.selectedIndicator = this.indicators[0];
            this.tradeFee = this.tradeFees[0];

            this.setSelectedChartService(this.selectedIndicator);
            this.setTradeFee(this.tradeFee);
            this.setCoinsPerTrade();

            this.updateComponent();
        } else {
            this.errorService.setErrorMessage('Algorithm Tester: No active indicators found. Open an indicator to be able to run test algorithms');
        }
    }

    /**
     * Recalculates the algo profits
     * Draws the buy and sell points on the charts
     */
    public updateComponent() {
        this.d3AlgoTesterService.setTradeFee(this.tradeFee);
        this.d3AlgoTesterService.createChartOverlays();
        this.testResults = this.d3AlgoTesterService.getTestResults();
        this.algoProfit = this.d3AlgoTesterService.round(this.d3AlgoTesterService.getAlgoProfit(), 2);
        this.chartProfit = this.d3AlgoTesterService.getChartProfit();
        this.profitDiff = this.d3AlgoTesterService.round(this.algoProfit - this.chartProfit, 2);
        if (this.chartProfit > 0) {
            this.profitDiffPercent = (this.d3AlgoTesterService.round(((this.algoProfit - this.chartProfit) / this.chartProfit) * 100, 0)).toString();
        }
        else {
            this.profitDiffPercent = '&#8734';
        }
    }

    public clearOverlays() {
        if (this.selectedIndicator) {
            this.d3AlgoTesterService.clearOverlays();
        }
    }
    
    closeAlgoTester() {
        this.onDismissed.emit();
    }

    toggleOptimization() {
        this.optimizationExpanded = this.optimizationExpanded ? false : true;
    }

    /**
     * Run through all of the different combinations of optimization parameters for a given indicator
     * Find the set of parameters that gives the best results (most profit)
     */
    public optimizeAlgo() {
        this.optimizationExpanded = true;
        this.optimizationResults.length = 0;
        this.maxOptimizedProfit = -999999;
        this.clearOverlays();
        
        // optimizations is a separately loaded object that contains the settings for all of the optimizations
        let selectedOptimization = optimizations[this.selectedIndicator as keyof Optimizations];

        let chartSettings = {}
        let settingsList: any[] = [];

        // Recursively build a list of all chart settings combinations that will be used for the optimization test
        this.buildchartSettings(selectedOptimization, Object.keys(selectedOptimization)[0], 0, chartSettings, settingsList);

        // Build an object to remember the sort order
        if (settingsList.length) {
            for (let prop in settingsList[0]) {
                this.lastSortOrder[prop] = 'desc';
            }
        }

        let settingIndex = 0;
        for (let setting of settingsList) {
            setting['chartType'] = this.selectedIndicator;
            setting['render'] = false;
            setting['index'] = settingIndex;
            settingIndex ++;
            setting = this.recalculateChartWithNewSettings(setting);
            this.optimizationResults.push(setting);

            if (this.algoProfit >= this.maxOptimizedProfit) {
                this.maxOptimizedProfit = this.algoProfit;
                this.optimizedSettingToRender = setting;
            }
        }

        this.optimizationResults.sort(this.compareBy('Profit', 'desc'));

        this.optimizedSettingToRender['render'] = true;
        this.recalculateChartWithNewSettings(this.optimizedSettingToRender);
    }

    public recalculateChartWithNewSettings(setting: any) {
        this.onUpdateChartSettings.emit(setting);
        this.updateComponent();
        setting['Profit'] = this.algoProfit;

        return setting;
    }
    
    renderSelectedSetting(selectedSetting: any) {
        this.optimizedSettingToRender = selectedSetting;
        this.optimizedSettingToRender['render'] = true;
        this.recalculateChartWithNewSettings(this.optimizedSettingToRender);
    }

    public sortOptimizations(sortProperty: string) {
        this.optimizationResults.sort(this.compareBy(sortProperty, this.lastSortOrder[sortProperty]));
        this.lastSortOrder[sortProperty] = this.lastSortOrder[sortProperty] == 'desc' ? 'asc' : 'desc';
    }

    public compareByProfit(a: any, b: any) {
        if (a.Profit < b.Profit)
            return 1;
        if (a.Profit > b.Profit)
            return -1;
        return 0;
    }

    private compareBy(compareProp: string, sortDirection: string) {
        if (sortDirection == 'desc') {
            return (a: any, b: any) => a[compareProp] < b[compareProp] ? 1 : (a[compareProp] > b[compareProp] ? -1 : 0);
        } else if (sortDirection == 'asc') {
            return (a: any, b: any) => a[compareProp] > b[compareProp] ? 1 : (a[compareProp] < b[compareProp] ? -1 : 0);
        } else { // desc
            return (a: any, b: any) => a[compareProp] < b[compareProp] ? 1 : (a[compareProp] > b[compareProp] ? -1 : 0);
        }
    }

    /**
     * Recursive method that creates a list of all of the combinations of the chart settings for the selected indicators optimization
     * @param selectedOptimization The optimization object that was selected
     * @param key The setting in the optimization object that contains an array of chart settings
     * @param index The index of the chart settings array for a particular key
     * @param chartSettings A single chart settings combination used for one test run
     * @param settingsList The final list of all of the chart  combinations
     */
    private buildchartSettings(selectedOptimization: any, key: string, index: number, chartSettings: any, settingsList: any[]) {
        if (! selectedOptimization[key]) {
            if(Object.keys(chartSettings).length == Object.keys(selectedOptimization).length) {
                settingsList.push(chartSettings);
            }
            
            return;
        }
        let currentKeyIndex = Object.keys(selectedOptimization).indexOf(key);
        
        if (currentKeyIndex > (Object.keys(selectedOptimization).length - 1)) {
            settingsList.push(chartSettings);
            return
        }
        // once we reach the end of key attributes array
        if (index >= selectedOptimization[key].length) {
            let nextKey = Object.keys(selectedOptimization)[currentKeyIndex + 1];
            this.buildchartSettings(selectedOptimization, nextKey, 0, chartSettings, settingsList);

            return;
            
        }
        chartSettings[key] = selectedOptimization[key][index];
        
        let nextKey = Object.keys(selectedOptimization)[currentKeyIndex + 1];
        let settingsKeys = Object.keys(chartSettings).slice(0, Object.keys(chartSettings).length - 1);
        let newSettings = {};

        for (let settingKey of settingsKeys) {
            newSettings[settingKey as keyof Object] = chartSettings[settingKey];
        }
        this.buildchartSettings(selectedOptimization, key, index + 1, newSettings, settingsList);
        this.buildchartSettings(selectedOptimization, nextKey, 0, chartSettings, settingsList);

    }
    /**
     * [Subject - comparison - value] and/or [Subject - comparison - value] 
     * 
     */

}
