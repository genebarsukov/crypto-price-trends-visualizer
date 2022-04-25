import { Injectable } from '@angular/core';


@Injectable()
export class IconSettingsService {
    // Total: ['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'MCO', 'OMG', 'BNT', 'ADA', 'NEO', 'LSK', 'BQX', 'ARK', 'NAV', '1ST', 'MYST', 'BTG', 'MIOTA', 'XLM', 'DASH', 'XMR', 'ZEC', 'QTUM', 'XVG', 'MONA', 'XEM', 'XZC', 'RDD', 'SKY', 'NEBL', 'GBYTE', 'PPC', 'DCR']},
    private exchanges: any = {
        Bittrex: {name: 'Bittrex', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'MCO', 'OMG', 'BNT', 'ADA', 'NEO', 'LSK', 'ARK', 'NAV', '1ST', 'MYST', 'BTG', 'XLM', 'DASH', 'XMR', 'ZEC', 'QTUM', 'XVG', 'MONA', 'XEM', 'XZC', 'RDD', 'GBYTE', 'PPC', 'DCR']},
        Gdax: {name: 'Gdax', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC']},
        Binance: {name: 'Binance', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'MCO', 'OMG', 'BNT', 'ADA', 'NEO', 'LSK', 'BQX', 'ARK', 'BTG', 'MIOTA', 'XLM', 'DASH', 'XMR', 'ZEC', 'QTUM', 'XVG', 'XZC']},
        CEXIO: {name: 'CEX.IO', availableCoins: ['BTC', 'BCH', 'BTG', 'ETH', 'XRP', 'DASH', 'ZEC', 'GHS']},
        Kraken: {name: 'Kraken', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'DASH', 'EOS', 'ETC', 'GNO', 'ICN', 'MLN', 'REP', 'XDG', 'XLM', 'XMR', 'ZEC']},
        Coinbase: {name: 'Coinbase', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC']},
        Poloniex: {name: 'Poloniex', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'XLM', 'DASH', 'XMR', 'ZEC']},
        Bitfinex: {name: 'Bitfinex', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'OMG', 'BTG', 'NEO', 'DASH', 'XMR', 'ZEC']},
        Bitstamp: {name: 'Bitstamp', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC']},
        Gemini: {name: 'Gemini', availableCoins: ['BTC', 'ETH']},
        Gatecoin: {name: 'Gatecoin', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', '1ST']},
        Exmo: {name: 'Exmo', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'XRP', 'DASH', 'XMR', 'ZEC', 'DOGE', 'WAVES', 'KICK']},
        YoBit: {name: 'YoBit', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'MCO', 'BNT', 'LSK', 'NAV', 'BTG', 'DASH', 'ZEC', 'XVG', 'XEM', 'RDD', 'PPC', 'DCR']},
        Cryptopia: {name: 'Cryptopia', availableCoins: ['BTC', 'BCH', 'ETH', 'LTC', 'OMG', 'NEO', 'ARK', 'NAV', 'DASH', 'XMR', 'ZEC', 'QTUM', 'XVG', 'XEM', 'XZC', 'RDD', 'SKY', 'NEBL', 'GBYTE', 'PPC', 'DCR']}
    };

    private icons: any = {
        USD: {name: 'US Dollar', symbol: 'USD', path: 'app/images/cash', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        BTC: {name: 'Bitcoin', symbol: 'BTC', path: 'app/images/coins/bitcoin', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        BCH: {name: 'Bit Cash', symbol: 'BCH', path: 'app/images/coins/bit-cash', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        BTG: {name: 'Bitcoin Gold', symbol: 'BTG', path: 'app/images/coins/bitcoin_gold', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        ETH: {name: 'Etherium', symbol: 'ETH', path: 'app/images/coins/etherium', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        LTC: {name: 'Lite Coin', symbol: 'LTC', path: 'app/images/coins/lite-coin', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        XRP: {name: 'Ripple', symbol: 'XRP', path: 'app/images/coins/ripple', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        ADA: {name: 'Cardano', symbol: 'ADA', path: 'app/images/coins/cardano', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        NEO: {name: 'Neo', symbol: 'NEO', path: 'app/images/coins/neo', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        LSK: {name: 'Lisk', symbol: 'LSK', path: 'app/images/coins/lisk', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        BQX: {name: 'Ethos', symbol: 'BQX', path: 'app/images/coins/ethos', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        ARK: {name: 'Ark', symbol: 'ARK', path: 'app/images/coins/ark', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        NAV: {name: 'Nav', symbol: 'NAV', path: 'app/images/coins/nav', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        '1ST': {name: 'First Blood', symbol: '1ST', path: 'app/images/coins/first-blood', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        MYST: {name: 'Mysterium', symbol: 'MYST', path: 'app/images/coins/mysterium', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        MCO: {name: 'Monaco', symbol: 'MCO', path: 'app/images/coins/monaco', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        OMG: {name: 'OmiseGO', symbol: 'OMG', path: 'app/images/coins/omg', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        BNT: {name: 'Bancor', symbol: 'BNT', path: 'app/images/coins/bancor', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        MIOTA: {name: 'IOTA', symbol: 'MIOTA', path: 'app/images/coins/iota', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        XLM: {name: 'Stellar', symbol: 'XLM', path: 'app/images/coins/stellar', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        DASH: {name: 'Dash', symbol: 'DASH', path: 'app/images/coins/dash', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        XMR: {name: 'Monero', symbol: 'XMR', path: 'app/images/coins/monero', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        ZEC: {name: 'Zcash', symbol: 'ZEC', path: 'app/images/coins/zcash', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        QTUM: {name: 'Quantum', symbol: 'QTUM', path: 'app/images/coins/quantum', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        XVG: {name: 'Verge', symbol: 'XVG', path: 'app/images/coins/verge', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        MONA: {name: 'MonaCoin', symbol: 'MONA', path: 'app/images/coins/mona_coin', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        XEM: {name: 'NEM', symbol: 'XEM', path: 'app/images/coins/nem', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        XZC: {name: 'ZCoin', symbol: 'XZC', path: 'app/images/coins/zcoin', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        RDD: {name: 'ReddCoin', symbol: 'RDD', path: 'app/images/coins/redd_coin', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        SKY: {name: 'SkyCoin', symbol: 'SKY', path: 'app/images/coins/sky_coin', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        NEBL: {name: 'Neblio', symbol: 'NEBL', path: 'app/images/coins/neblio', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        GBYTE: {name: 'Byteball', symbol: 'GBYTE', path: 'app/images/coins/byteball2', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        PPC: {name: 'PeerCoin', symbol: 'PPC', path: 'app/images/coins/peer_coin', small: '_20', medium: '_32', large: '_50', extension: '.png'},
        DCR: {name: 'Decred', symbol: 'DCR', path: 'app/images/coins/decred', small: '_20', medium: '_32', large: '_50', extension: '.png'}
    };

    public getIconUrlBySymbol(symbol: string, size: string) {
        if (!this.icons[symbol] || !this.icons[symbol][size]) {
            return '';
        }
        let icon = this.icons[symbol].path + this.icons[symbol][size] + this.icons[symbol].extension;

        return icon;
    }

    public getExchanges() {
        return this.exchanges;
    }
}