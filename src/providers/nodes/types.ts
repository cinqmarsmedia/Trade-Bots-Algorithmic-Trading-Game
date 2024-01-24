import { ChartsProvider, DataOhlc } from "../charts/charts";

export type Metadata = {
    name: string,
    sector: string,
    exchange: string,
    ticker: string
}

type tradeObj = { buyOrSell: boolean, longOrShort: boolean, price: number, amount: number }

export interface EngineData {
    currentData: DataOhlc,
    dateKeyIndex: number,
    cash: number,
    invested: number,
    price: number,
    netWorth: number,
    longVsShort: boolean,
    loanData: { [key: string]: any },
    chartsProvider: ChartsProvider,
    metadata: Metadata,
    trade: (obj: tradeObj) => void,
    halt: () => void,

}


export type WhenStrategy = "PAUSE_WHEN_UNAVAILABLE" | "USE_WHATS_AVAILABLE" | "USE_SPECIFIED"

export type WithinStrategy = "ACTUAL_DAYS"|'TRADING_DAYS'

export type InterfaceToggles = {[interfaceName: string]: boolean}

export type TrainingData = {
    input: number[],
    output: number[]
}[]