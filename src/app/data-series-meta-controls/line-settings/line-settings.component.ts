import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { PriceLine } from '../../models/price-line.model';
import { ChartSettingsService } from '../../services/settings/chart-settings.service';
import { IconSettingsService } from '../../services/settings/icon-settings.service';

@Component({
    selector: 'app-line-settings',
    templateUrl: './line-settings.component.html',
    styleUrls: [
        './line-settings.component.scss'
    ]
})
export class LineSettingsComponent implements OnInit {
    @Input()
    priceLine!: PriceLine;

    @Output() onRebuildSvg = new EventEmitter();
    @Output() onColorUpdated = new EventEmitter();
    @Output() onRemove = new EventEmitter();

    exchanges: any[] = [
        {name: 'Bittrex', value: 'Bittrex'},
        {name: 'Gdax', value: 'Gdax'},
        {name: 'Binance', value: 'Binance'},
        {name: 'CEX.IO', value: 'CEXIO'},
        {name: 'Kraken', value: 'Kraken'},
        {name: 'Coinbase', value: 'Coinbase'},
        {name: 'Poloniex', value: 'Poloniex'},
        {name: 'Bitfinex', value: 'Bitfinex'},
        {name: 'Bitstamp', value: 'Bitstamp'},
        {name: 'Gemini', value: 'Gemini'},
        {name: 'Gatecoin', value: 'Gatecoin'},
        {name: 'Exmo', value: 'Exmo'},
        {name: 'YoBit', value: 'YoBit'},
        {name: 'Cryptopia', value: 'Cryptopia'}
    ]

    fromCoins: any[] = [
        {name: 'Bitcoin', value: 'BTC', icon: 'BTC'},
        {name: 'Bit Cash', value: 'BCH', icon: 'BCH'},
        {name: 'Bitcoin Gold', value: 'BTG', icon: 'BTG'},
        {name: 'Etherium', value: 'ETH', icon: 'ETH'},
        {name: 'Lite Coin', value: 'LTC', icon: 'LTC'},
        {name: 'Ripple', value: 'XRP', icon: 'XRP'},
        {name: 'Cardano', value: 'ADA', icon: 'ADA'},
        {name: 'Neo', value: 'NEO', icon: 'NEO'},
        {name: 'Lisk', value: 'LSK', icon: 'LSK'},
        {name: 'Ethos', value: 'BQX', icon: 'BQX'},
        {name: 'Ark', value: 'ARK', icon: 'ARK'},
        {name: 'Nav', value: 'NAV', icon: 'NAV'},
        {name: 'First Blood', value: '1ST', icon: '1ST'},
        {name: 'Mysterium', value: 'MYST', icon: 'MYST'},
        {name: 'Monaco', value: 'MCO', icon: 'MCO'},
        {name: 'OmiseGO', value: 'OMG', icon: 'OMG'},
        {name: 'Bancor', value: 'BNT', icon: 'BNT'},
        {name: 'IOTA', value: 'MIOTA', icon: 'MIOTA'},
        {name: 'Stellar', value: 'XLM', icon: 'XLM'},
        {name: 'Dash', value: 'DASH', icon: 'DASH'},
        {name: 'Monero', value: 'XMR', icon: 'XMR'},
        {name: 'Zcash', value: 'ZEC', icon: 'ZEC'},
        {name: 'Quantum', value: 'QTUM', icon: 'QTUM'},
        {name: 'Verge', value: 'XVG', icon: 'XVG'},
        {name: 'MonaCoin', value: 'MONA', icon: 'MONA'},
        {name: 'NEM', value: 'XEM', icon: 'XEM'},
        {name: 'ZCoin', value: 'XZC', icon: 'XZC'},
        {name: 'ReddCoin', value: 'RDD', icon: 'RDD'},
        {name: 'SkyCoin', value: 'SKY', icon: 'SKY'},
        {name: 'Neblio', value: 'NEBL', icon: 'NEBL'},
        {name: 'Byteball', value: 'GBYTE', icon: 'GBYTE'},
        {name: 'PeerCoin', value: 'PPC', icon: 'PPC'},
        {name: 'Decred', value: 'DCR', icon: 'DCR'},
    ];

    toCoins: any[] = [
        {name: '', value: 'USD', icon: 'USD'},
        {name: '', value: 'BTC', icon: 'BTC'},
        {name: '', value: 'ETH', icon: 'ETH'}
    ];


    constructor(public chartSettingsService: ChartSettingsService, private iconSettingsService: IconSettingsService) {}

    ngOnInit() {
        this.updateDisabled();
    }

    updateDisabled() {
        for (let coin of this.toCoins) {
            coin.disabled = (this.priceLine.fromSymbol == coin.value || (this.priceLine.fromSymbol == 'BTC' && coin.value != 'USD'));
        }

        for (let coin of this.fromCoins) {
            coin.disabled = (this.priceLine.toSymbol == coin.value || 
                            (coin.value == 'BTC' && this.priceLine.toSymbol != 'USD') ||
                            ! this.iconSettingsService.getExchanges()[this.priceLine.exchange].availableCoins.includes(coin.value));
        }
    }
    /**
     * Update parent chart so that the line color gets updated
     */
    updateColor(color: string) {
        this.onColorUpdated.emit(this.priceLine);
    }

    switchFromSymbol(fromSymbol: string) {
        this.priceLine.fromSymbol = fromSymbol;
        this.onRebuildSvg.emit(this.priceLine);
    }

    switchToSymbol(toSymbol: string) {
        this.priceLine.toSymbol = toSymbol;
        this.onRebuildSvg.emit(this.priceLine);
    }

    switchExchange(exchange: string) {
        this.priceLine.exchange = exchange;
        this.onRebuildSvg.emit(this.priceLine);
    }

    /**
     * Remove the line settings and the corresponding line graph from the chart
     */
    removeLine() {
        this.onRemove.emit(this.priceLine.index);
    }

}
