export const optimizations = {
    RSI: {
        period: [14, 12, 7],
        overbought: [70, 90, 80],
        oversold: [30, 10, 20],
        SMAPeriod: [3, 1]
    },
    Stochastic: {
        period: [14, 12, 7],
        overbought: [80, 90, 70],
        oversold: [20, 10, 30],
        SMAPeriod: [5, 3]
    },
    MACD: {
        smallPeriod: [12, 24],
        largePeriod: [26, 52],
        signalPeriod: [9, 18, 6]
    }

}