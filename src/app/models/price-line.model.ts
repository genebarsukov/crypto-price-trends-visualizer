import { ChartData } from './chart-data.model';

export interface PriceLine {
    data: ChartData[];
    index: number;
    color: string;
    fromSymbol: string;
    toSymbol: string;
    exchange: string;
}