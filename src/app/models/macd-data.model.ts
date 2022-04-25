export interface MACDData {
    date: Date;
    value: number;
    smallEMA: number;
    largeEMA: number;
    MACDLine: number;
    signalLine: number;
    MACDHistogram: number;
    open: number;
    close: number;
    high: number;
    low: number;
}