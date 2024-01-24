//ADVANCED INDICATOR NODE

import { NodeOption } from "@baklavajs/core";
import { LogType, MarketOrder } from "../../state-machine/state-machine";
import { Supstance } from "../../supstance/supstance";
import { BaseNode } from "../base-node";
import { EngineData, WhenStrategy } from "../types";
import { sort } from 'fast-sort';


export type AdvIndicatorOption = "SMA" | "EMA" | "Bollinger" | "MACD" | "Pivot Point" | "Ichimoku" | "ADX" | "AROON" | "ATR" | "RSI" | "Stochastic" | "Williams%";
type WhenOption = "Today" | "Yesterday" | "N Day(s) Ago" | "N Week(s) Ago" | "N Month(s) Ago" | "N Year(s) Ago" | "Bot Start" | "Last Trade" | "Last Sell" | "Last Buy";
export type StochasticOption = "Fast (1 day)" | "Slow (3 day)";
export type BollingerOption = "Upper" | "Middle" | "Lower";
export type MacdTypeOption = "Line" | "Signal";

type IfUndefinedOption = "Pause Execution" | "Custom Value" | "Closest Value"
type WhenStrategyOption = IfUndefinedOption
type PivotOption = "Woodie" | "Camarilla" | "Fibonacci" | "Floor";
type PivotLineOption = "S1" | "S2" | "S3" | "PV" | "R1" | "R2" | "R3";
type IchimokuOption = "tenkanSen" | "kijunSen" | "senkouSpanA" | "senkouSpanB";
type AroonOption = "Up-Down" | "Up" | "Down"
type Option = AdvIndicatorOption | WhenOption | StochasticOption | BollingerOption | PivotOption | PivotLineOption | WhenStrategyOption | IfUndefinedOption | IchimokuOption | AroonOption | MacdTypeOption


type IndicatorHideWhen = { [indicator in AdvIndicatorOption]?: OptionName[] }
type WhenHideWhen = { [when in WhenOption]?: OptionName[] }
type WhenStrategyHideWhen = { [when in WhenStrategyOption]?: OptionName[] }
type IfUndfinedHideWhen = { [when in IfUndefinedOption]?: OptionName[] }
type HideWhen = IndicatorHideWhen | WhenHideWhen | WhenStrategyHideWhen | IfUndfinedHideWhen;

type OptionName = "If Undefined" | "Where N is" | "Log Message + Data" | "Indicator" | "period (days)" | "multiplier" | "Stochastic Type" | "Bollinger Bound" | "When" | "Return" | "period (days)" | "multiplier" | "Stochastic Type" | "Bollinger Bound" | "Pivot Alg" | "Pivot Line" | "Aroon Type" | "Ichimoku Line" | "tenkanSen" | "kijunSen" | "senkouSpanB" | "fast" | "slow" | "signal" | "MACD Type" | "Ichimoku Type" | "Overbought" | "Oversold" | "Middle"



export class AdvValNode extends BaseNode {
    type: string = "AdvValNode"
    name: string = "Adv. Indicator";

    indicatorOptions: AdvIndicatorOption[] = ["SMA", "EMA", "Bollinger", "MACD", "Pivot Point", "Ichimoku", "ADX", "AROON", "ATR", "RSI", "Stochastic", "Williams%"];
    whenOptions: WhenOption[] = ["Today", "Yesterday", "N Day(s) Ago", "N Week(s) Ago", "N Month(s) Ago", "N Year(s) Ago", "Bot Start", "Last Buy", "Last Sell", "Last Trade"];
    stochasticOptions: StochasticOption[] = ["Fast (1 day)", "Slow (3 day)"];
    bollingerOptions: BollingerOption[] = ["Upper", "Middle", "Lower"];
    pivotOptions: PivotOption[] = ["Camarilla", "Fibonacci", "Floor", "Woodie"];

    indicatorHideWhen: IndicatorHideWhen = {
        "SMA": ["multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type", "Overbought", "Oversold", "Middle"],
        "EMA": ["MACD Type", "Ichimoku Type", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "Overbought", "Oversold", "Middle"],
        "Bollinger": ["MACD Type", "Ichimoku Type", "Stochastic Type", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "Overbought", "Oversold", "Middle"],
        "MACD": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "Ichimoku Type", "tenkanSen", "kijunSen", "senkouSpanB", "Overbought", "Oversold", "Middle"],
        "Pivot Point": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type", "Overbought", "Oversold", "Middle"],
        "Ichimoku": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "fast", "slow", "signal", "MACD Type", "Overbought", "Oversold", "Middle"],
        "ADX": ["multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type", "Overbought", "Oversold", "Middle"],
        "AROON": ["multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type", "Overbought", "Oversold", "Middle"],
        "ATR": ["multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type", "Overbought", "Oversold", "Middle"],
        "RSI": ["multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type", "Overbought", "Oversold", "Middle"],
        "Stochastic": ["period (days)", "multiplier", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type", "Overbought", "Oversold", "Middle"],
        "Williams%": ["Ichimoku Type", "multiplier", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "Stochastic Type", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type"]
    }
    whenHideWhen: WhenHideWhen = { "Today": ["Where N is"], "Yesterday": ["Where N is"], "Bot Start": ["Where N is"], "Last Buy": ["Where N is"], "Last Sell": ["Where N is"], "Last Trade": ["Where N is"] };


    chartsProvider: any;

    addOption(name: OptionName, component: string, defaultVal?: any, sideBarComponent?: string, additionalOptions?: { hideWhen?: HideWhen, items?: Option[], min?: number, max?: number, isSetting?: boolean }): NodeOption {
        return super.addOption(name, component, defaultVal, sideBarComponent, additionalOptions);
    }

    getOptionValue(name: OptionName) {
        return super.getOptionValue(name);
    }

    calculateData(...args) {
        // let t = performance.now();
        return this.chartsProvider.calculateData(...args, this.data.metadata.ticker);
        // console.log(`calculateData call took ${Math.round(performance.now() - t)} milliseconds.`);
        // return x;
    }

    constructor() {
        super();

        this.addOption("Indicator", "SelectOption", "SMA", undefined, { items: this.indicatorOptions, hideWhen: this.indicatorHideWhen })



        //------------------------------------------
        this.addOption("Pivot Alg", "SelectOption", "Floor", undefined, { items: this.pivotOptions })
        this.addOption("Pivot Line", "SelectOption", "S1", undefined, { items: ["S1", "S2", "S3", "PV", "R1", "R2", "R3"] })
        this.addOption("Stochastic Type", "SelectOption", "Fast (1 day)", undefined, { items: ["Fast (1 day)", "Slow (3 day)"] })
        this.addOption("Aroon Type", "SelectOption", "Up-Down", undefined, { items: ["Up-Down", "Up", "Down"] })
        this.addOption("Bollinger Bound", "SelectOption", "Upper", undefined, { items: ["Upper", "Middle", "Lower"] })
        // williams is good
        // adx is good
        // RSI is good

        this.addOption("MACD Type", "SelectOption", "Line", undefined, { items: ["Line", "Signal"] })
        this.addOption("Ichimoku Type", "SelectOption", "tenkanSen", undefined, { items: ["tenkanSen", "kijunSen", "senkouSpanA", "senkouSpanB"] })

        //this.addOption("Ichimoku Line", "SelectOption", "Tenkan-sen", undefined, { items: ["Tenkan-sen", "Kijun-sen", "Senoku Span A", "Senoku Span B", "Chikou Span"] })

        this.addOption("period (days)", "IntegerOption", 20)
        this.addOption("multiplier", "NumberOption", 2, undefined, { isSetting: true })

        this.addOption("tenkanSen", "NumberOption", 9, undefined, { isSetting: true })
        this.addOption("kijunSen", "NumberOption", 26, undefined, { isSetting: true })
        this.addOption("senkouSpanB", "NumberOption", 52, undefined, { isSetting: true })

        this.addOption("fast", "NumberOption", 12, undefined, { isSetting: true })
        this.addOption("slow", "NumberOption", 26, undefined, { isSetting: true })
        this.addOption("signal", "NumberOption", 9, undefined, { isSetting: true })

        this.addOption("Overbought", "NumberOption", 80, undefined, { isSetting: true });
        this.addOption("Oversold", "NumberOption", 20, undefined, { isSetting: true });
        this.addOption("Middle", "NumberOption", 50, undefined, { isSetting: true });
        //-----------------------------------



        this.addOption("When", "SelectOption", "Today", undefined, { items: ["Today", "Yesterday", "N Day(s) Ago", "N Week(s) Ago", "N Month(s) Ago", "N Year(s) Ago", "Bot Start", "Last Buy", "Last Sell", "Last Trade"], hideWhen: this.whenHideWhen })
        this.addOption("Where N is", "IntegerOption", 1, undefined, { min: 1, max: 9999 })


        this.addOption("If Undefined", "SelectOption", "Custom Value", undefined, { isSetting: true, items: ["Pause Execution", "Custom Value", "Closest Value"], hideWhen: { "Pause Execution": ["Return"], "Closest Value": ["Return"] } })
        this.addOption("Return", "NumberOption", 0, undefined, { isSetting: true });
        this.addOption("Log Message + Data", "InputOption")

        this.addOutputInterface("Output")

        // this.events.update.addListener(this, event => {
        //     if (this.chartsProvider) {
        //         this.chartsProvider.clearCache(this.data.metadata.ticker, this.getIndicatorName())
        //     }
        // });
    }

    getIndicatorName() {
        let ind: string = this.getOptionValue("Indicator");
        return ind.toLowerCase().replace(/[^a-z ]/g, "");
    }

    nodeCalculate(data: EngineData) {
        let t0 = performance.now();
        let x: any = this._nodeCalculate(data);
        //console.log(`advValNode took ${performance.now() - t0} milliseconds.`);
        return x;
    }
    _nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        const indicator: AdvIndicatorOption = this.getOptionValue("Indicator");
        let period: number = this.getOptionValue("period (days)");
        const multiplier: number = this.getOptionValue("multiplier");
        const stochasticType: StochasticOption = this.getOptionValue("Stochastic Type");
        const bollingerBound: BollingerOption = this.getOptionValue("Bollinger Bound");
        const macdType: MacdTypeOption = this.getOptionValue("MACD Type");


        const overbought: number = this.getOptionValue("Overbought");
        const middle: number = this.getOptionValue("Middle");
        const oversold: number = this.getOptionValue("Oversold");

        const tenkanSen: number = this.getOptionValue("tenkanSen");
        const kijunSen: number = this.getOptionValue("kijunSen");
        const senkouSpanB: number = this.getOptionValue("senkouSpanB");

        const fast: number = this.getOptionValue("fast");
        const slow: number = this.getOptionValue("slow");
        const signal: number = this.getOptionValue("signal");

        const aroonType: AroonOption = this.getOptionValue("Aroon Type");



        const when: WhenOption = this.getOptionValue("When");
        const number: number = this.getOptionValue("Where N is");
        this.chartsProvider = data.chartsProvider;

        //some charts may not have period in the future, hence the period option may not always be there:
        if (typeof period === "undefined") {
            period = -1;
        }

        //let's find the date at which the indicator is to be calculated:
        //(dt will be undefined if not found)
        let dt: Date;
        let dateKeyIndex: number;


        let whenStrategyOpt: WhenStrategyOption = this.getOptionValue("If Undefined");
        let whenStrategy: WhenStrategy;
        let specifiedVal: number = 0;


        switch (whenStrategyOpt) {
            case "Pause Execution": {
                whenStrategy = "PAUSE_WHEN_UNAVAILABLE";
                break;
            }
            case "Closest Value": {
                whenStrategy = "USE_WHATS_AVAILABLE";
                break;
            }
            case "Custom Value": {
                whenStrategy = "USE_SPECIFIED";
                specifiedVal = this.getOptionValue("Return");
                break;
            }
        }

        let tradeHistory: MarketOrder[] = [];
        if (["Last Trade", "Last Sell", "Last Buy"].indexOf(when) !== -1) {
            const tradeHistoryObj = this.stateMachine.state.tradeHistory;
            for (let nodeId in tradeHistoryObj) {
                tradeHistory.push(...tradeHistoryObj[nodeId]);
            }
            tradeHistory = sort(tradeHistory).asc(h => h.dateIndex);
        }


        //NOTE: The below code will reject cases where the index is equal to period. However, for EMA and SMA that value is actually acceptable. But for simplification we ignore that particualr case. If the period is 7 days, day 8 is valid. Day 7 would be invalid in our approach. 
        switch (when) {
            case "Today": {
                let index = data.dateKeyIndex;
                if (index > period) {
                    dateKeyIndex = index;
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "Yesterday": {
                let index = data.dateKeyIndex - 1;
                if (index > period) {
                    dateKeyIndex = index;
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Day(s) Ago": {
                let index = data.dateKeyIndex - number;
                if (index > period) {
                    dateKeyIndex = index;
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Week(s) Ago": {
                let index: number;
                let currentDate: Date = data.currentData[data.dateKeyIndex].date;
                let targetDate: Date = (new Date());
                targetDate.setDate(currentDate.getDate() - 7 * number);
                for (let i = data.dateKeyIndex; i--; i >= 0) {
                    if (data.currentData[i].date.getTime() <= targetDate.getTime()) {
                        index = i;
                        break;
                    }
                }
                if (index && index > period) {
                    dateKeyIndex = index;
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Month(s) Ago": {
                let index: number;
                let currentDate: Date = data.currentData[data.dateKeyIndex].date;
                let targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - number, currentDate.getDate());
                for (let i = data.dateKeyIndex; i--; i >= 0) {
                    if (data.currentData[i].date.getTime() <= targetDate.getTime()) {
                        index = i;
                        break;
                    }
                }
                if (index && index > period) {
                    dateKeyIndex = index;
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Year(s) Ago": {
                let index: number;
                let currentDate: Date = data.currentData[data.dateKeyIndex].date;
                let targetDate = new Date(currentDate.getFullYear() - number, currentDate.getMonth(), currentDate.getDate());
                for (let i = data.dateKeyIndex; i--; i >= 0) {
                    if (data.currentData[i].date.getTime() <= targetDate.getTime()) {
                        index = i;
                        break;
                    }
                }
                if (index && index > period) {
                    dateKeyIndex = index;
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "Bot Start": {
                dateKeyIndex = 0;
                dt = data.currentData[0].date;
                break;
            }
            case "Last Trade": {
                dateKeyIndex = 0;
                if (tradeHistory.length > 0) {
                    dateKeyIndex = tradeHistory[tradeHistory.length - 1].dateIndex
                }
                dt = data.currentData[dateKeyIndex].date;
                break;
            }
            case "Last Sell": {
                dateKeyIndex = 0;
                for (let i = tradeHistory.length - 1; i >= 0; i--) {
                    let trade = tradeHistory[i];
                    if (trade.buyOrSell == "SELL") {
                        dateKeyIndex = trade.dateIndex;
                        break;
                    }
                }
                dt = data.currentData[dateKeyIndex].date;
                break;
            }
            case "Last Buy": {
                dateKeyIndex = 0;
                for (let i = tradeHistory.length - 1; i >= 0; i--) {
                    let trade = tradeHistory[i];
                    if (trade.buyOrSell == "BUY") {
                        dateKeyIndex = trade.dateIndex;
                        break;
                    }
                }
                dt = data.currentData[dateKeyIndex].date;
                break;
            }
        }


        //if there is no date, then we need to do something about it:
        if (typeof dt === "undefined") {
            switch (whenStrategy) {
                case "PAUSE_WHEN_UNAVAILABLE": {
                    this.getInterface("Output").value = undefined;
                    this.log(LogType.message, "Data for the specified date unavailable. Bot Paused.", "Pausing Execution. Change settings under 'If Undefined' to handle differently")
                    return
                }
                case "USE_SPECIFIED": {
                    this.getInterface("Output").value = specifiedVal;
                    this.log(LogType.message, "Data for specified date unavailable. Using '" + specifiedVal + "' instead.", "Returning custom value. Change settings under 'If Undefined' to handle differently")
                }
                case "USE_WHATS_AVAILABLE": {
                    if (dateKeyIndex >= period) {
                        dateKeyIndex -= period;
                        dt = data.currentData[dateKeyIndex].date;
                        this.log(LogType.warning, "Data for the specified date unavailable. Using " + new Date(dt).toDateString() + " instead.", "Using the closest available value. Change settings under 'If Undefined' to handle differently")
                    } else {
                        this.getInterface("Output").value = undefined;
                        this.log(LogType.warning, "Data unavailable for specified date. Bot Paused.", "Closest value is beyond nearness threshold. There are insufficient data points to calculate the value of this indicator. Bot will therefore remain paused till enough data points are available. If you would like the bot to start anyways, please change the setting under 'If Undefined' to 'Custom Value'.")
                        return;
                    }
                    break;
                }
            }
        }

        //now that we have the date, let's find the indicator's value:
        let output: any
        switch (indicator) {

            case "ADX": {
                let out = this.calculateData("adx", dateKeyIndex, { period }, data.currentData)
                if (out && out.adx) {
                    output = out.adx
                }
                break;
            }

            case "AROON": {
                let out = this.calculateData("aroon", dateKeyIndex, { period }, data.currentData)
                if (out) {
                    switch (aroonType) {
                        case "Down": {
                            output = out.down;
                            break;
                        }
                        case "Up": {
                            output = out.up;
                            break;
                        }
                        case "Up-Down": {
                            output = out.oscillator;
                            break;
                        }
                    }
                }
                break;
            }

            case "ATR": {
                let out = this.calculateData("atr", dateKeyIndex, { period }, data.currentData)
                if (out && out.value) {
                    output = out.value;
                }
                break;
            }
            case "Bollinger": {
                let out = this.calculateData("bollinger", dateKeyIndex, { period, sdMultiplication: multiplier }, data.currentData)
                if (out) {
                    switch (bollingerBound) {
                        case "Lower":
                            if (out.lowerBand) {
                                output = out.lowerBand
                            }
                            break;
                        case "Middle":
                            if (out.middleBand) {
                                output = out.middleBand
                            }
                            break;
                        case "Upper":
                            if (out.upperBand) {
                                output = out.upperBand;
                            }
                            break;
                    }
                }
                break;
            }



            case "EMA": {
                let out = this.calculateData("ema", dateKeyIndex, { period }, data.currentData)
                if (out && out.value) {
                    output = out.value
                }
                break;
            }

            case "Ichimoku": {
                let out = this.calculateData("ichimoku", dateKeyIndex, { tenkanSen, kijunSen, senkouSpanB }, data.currentData)
                output = out[this.getOptionValue("Ichimoku Type")];
                break;
            }

            case "MACD": {
                let out = this.calculateData("macd", dateKeyIndex, { fast, slow, signal }, data.currentData);
                if (out) {
                    switch (macdType) {
                        case "Line": {
                            if (out.macd) {
                                output = out.macd;
                                break;
                            }
                        }
                        case "Signal": {
                            if (out.signal) {
                                output = out.signal;
                                break;
                            }
                        }
                    }
                }
                break;
            }

            case "Pivot Point": {
                let alg = this.getOptionValue("Pivot Alg");
                let line = this.getOptionValue("Pivot Line");
                let lines = Supstance.calculate(data.currentData, { name: alg });
                const [pl, r1, r2, r3, s1, s2, s3] = lines;

                switch (line) {
                    case "S1": {
                        output = s1;
                        break;
                    }
                    case "S2": {
                        output = s2;
                        break;
                    }
                    case "S3": {
                        output = s3;
                        break;
                    }
                    case "R1": {
                        output = r1;
                        break;
                    }
                    case "R2": {
                        output = r2;
                        break;
                    }
                    case "R3": {
                        output = r3;
                        break;
                    }
                    case "PV": {
                        output = pl;
                        break;
                    }
                }
                if (Array.isArray(output)) {
                    output = output[0];
                }
                break;
            }




            case "RSI": {
                let out = this.calculateData("rsi", dateKeyIndex, { period }, data.currentData)
                if (out && out.rsi) {
                    output = out.rsi
                }
                break;
            }


            case "SMA": {
                let out = this.calculateData("sma", dateKeyIndex, { period }, data.currentData);
                if (out && out.value) {
                    output = out.value
                }
                break;
            }



            case "Stochastic": {
                let out = this.calculateData("stochastic", dateKeyIndex, { periodD: 3 }, data.currentData)
                if (out) {
                    switch (stochasticType) {
                        case "Fast (1 day)": {
                            if (out.stochasticD) {
                                output = out.stochasticD;
                            };
                            break;
                        }
                        case "Slow (3 day)": {
                            if (out.stochasticK) {
                                output = out.stochasticK;
                            };
                            break;
                        }
                    }
                }
                break;
            }
            case "Williams%": {
                let out = this.calculateData("williams", dateKeyIndex, { period, overbought, oversold, middle }, data.currentData)
                if (out && out.williams) {
                    output = out.williams
                }
                break;
            }


        }

        if (typeof output === "undefined") {
            switch (whenStrategy) {
                case "PAUSE_WHEN_UNAVAILABLE": {
                    this.getInterface("Output").value = undefined;
                    this.log(LogType.message, "Pausing node execution as no data is available for the specified date")
                    return
                }
                case "USE_SPECIFIED": {
                    this.getInterface("Output").value = specifiedVal;
                    this.log(LogType.message, "Data for the specified date is not available, using specified value (" + specifiedVal + ") instead.")
                    return;
                }
                // case "USE_WHATS_AVAILABLE": {
                //     //NOTE for stochastic it is still sometimes possible to get a valid output (in the sense of use what's available - there is some data possibly avaialbla but we are stoill returning undefined). If required, code can be added for that.
                //     this.getInterface("Output").value = undefined;
                //     this.log(LogType.warning, "Pausing node execution as no data is available for the specified date")
                //     return;
                // }
            }
        } else {
            this.getInterface("Output").value = output;
            this.log(LogType.message, "Output data = " + output)
        }
    }
}