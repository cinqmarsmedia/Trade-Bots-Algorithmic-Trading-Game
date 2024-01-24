import { _appIdRandomProviderFactory } from "@angular/core/src/application_tokens";
import { Node, NodeInterface, NodeOption } from "@baklavajs/core";
import { IndicatorOption, AdvIndicatorOption, BollingerOption, StochasticOption, ValNode } from "..";
import { LogType, MarketOrder } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData, WhenStrategy } from "../types";
import { AdvValNode, MacdTypeOption } from "../values/advValNode";
import { sort } from 'fast-sort';
import { Supstance } from "../../supstance/supstance";

type OptionName = "Log Message + Data" | "Statistic" | "TextOption" | "Days are" | "Where N is" | "If Undefined" | "Return" | "Between Indicator And"
type InputName = "Indicator";
type OutputName = "Output";

type InterfaceName = OptionName | InputName | OutputName;

type StatOption = "Largest" | "Smallest" | "Mean" | "STDV" | "Median" | "Mode" | "% Growth" | "Variance"
type DaysOption = 'Actual Days' | 'Trading Days'
type IfUndefinedOption = "Pause Execution" | "Custom Value"



export class RangeNode extends BaseNode {
    type: string = "RangeNode";
    name: string = "Get Range Val";

    constructor() {
        super();
        this.addInputInterface("Indicator")

        this.addOption("Statistic", "SelectOption", "Mean", undefined, { items: ["Largest", "Smallest", "% Growth", "Mean", "STDV", "Median", "Mode", "Variance"] })
        this.addOption("TextOption", "TextOption", "Between Indicator And")
        this.addOption("Between Indicator And", "SelectOption", "N day(s) ago", undefined, { isSetting: false, items: ['N day(s) ago', 'Last Trade', 'Last Buy', 'Last Sell', 'Bot Start'], hideWhen: { "Last Trade": ["Where N is"], "Last Buy": ["Where N is"], "Last Sell": ["Where N is"], "Bot Start": ["Where N is"] } });
        this.addOption("Where N is", "IntegerOption", 1, undefined, { min: 1, max: 1000 })
        this.addOption("Days are", "SelectOption", "Trading Days", undefined, { isSetting: true, items: ['Actual Days', 'Trading Days'] },)
        this.addOption("Log Message + Data", "InputOption")
        this.addOption("If Undefined", "SelectOption", "Custom Value", undefined, { isSetting: true, items: ["Pause Execution", "Custom Value"], hideWhen: { "Pause Execution": ["Return"] } })
        this.addOption("Return", "NumberOption", 0, undefined, { isSetting: true });
        this.addOutputInterface("Output")
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        let stat: StatOption = this.getOptionValue("Statistic");
        let daysBefore: number = this.getOptionValue("Where N is");
        let currentDate = data.currentData[data.dateKeyIndex].date;
        let daysOption: DaysOption = this.getOptionValue("Days are");
        let targetIndex = 0;

        const specificValue: number = this.getOptionValue("Return");
        switch (daysOption) {
            case "Actual Days": {
                let targetTime = currentDate.getTime() - daysBefore * 24 * 3600 * 1000;
                for (let i = data.dateKeyIndex; i >= 0; i--) {
                    if (data.currentData[i].date.getTime() <= targetTime) {
                        targetIndex = i
                        break;
                    }
                }
                break;
            }
            case "Trading Days": {
                targetIndex = data.dateKeyIndex - daysBefore;
                break;
            }
        }

        let betweenIndicatorAnd = this.getOptionValue("Between Indicator And");
        if (["Last Trade", "Last Sell", "Last Buy", "Bot Start"].indexOf(betweenIndicatorAnd) !== -1) {
            const tradeHistoryObj = this.stateMachine.state.tradeHistory;
            let tradeHistory: MarketOrder[] = [];
            for (let nodeId in tradeHistoryObj) {
                tradeHistory.push(...tradeHistoryObj[nodeId]);
            }
            tradeHistory = sort(tradeHistory).asc(h => h.dateIndex);

            switch (betweenIndicatorAnd) {
                case "Last Trade": {
                    targetIndex = 0;
                    if (tradeHistory.length > 0) {
                        targetIndex = tradeHistory[tradeHistory.length - 1].dateIndex
                    }
                    break;
                }
                case "Last Sell": {
                    targetIndex = 0;
                    for (let i = tradeHistory.length - 1; i >= 0; i--) {
                        let trade = tradeHistory[i];
                        if (trade.buyOrSell == "SELL") {
                            targetIndex = trade.dateIndex;
                            break;
                        }
                    }
                    break;
                }
                case "Last Buy": {
                    targetIndex = 0;
                    for (let i = tradeHistory.length - 1; i >= 0; i--) {
                        let trade = tradeHistory[i];
                        if (trade.buyOrSell == "BUY") {
                            targetIndex = trade.dateIndex;
                            break;
                        }
                    }
                    break;
                }
                case "Bot Start": {
                    targetIndex = 0;
                    break;
                }
            }
        }



        let ifUndefinedOption: IfUndefinedOption = this.getOptionValue("If Undefined");
        let whenStrategyOption: WhenStrategy;
        switch (ifUndefinedOption) {
            case "Custom Value": {
                whenStrategyOption = "USE_SPECIFIED";
                break;
            }
            case "Pause Execution": {
                whenStrategyOption = "PAUSE_WHEN_UNAVAILABLE";
                break;
            }
        }

        if (targetIndex < 0) {
            switch (whenStrategyOption) {
                case "PAUSE_WHEN_UNAVAILABLE": {
                    this.log(LogType.message, "Pausing as no output from connected indicator", "There was no output from the connected indicator hence this node has been paused. You can control what happens when there is no output by clicking on the settings icon in the node.");
                    return;
                }
                case "USE_SPECIFIED": {
                    this.log(LogType.message, "No output from connected indicator, using specified value instead", `No output was received from the connected indicator, hence the node is using the default value of ${specificValue} instead.`)
                    this.getInterface("Output").value = specificValue;
                    this.log(LogType.message, "Setting output to " + specificValue);
                    return;
                }
            }
        }

        //figure out what is the indicator
        //there are two connections, one is from range node to the output node, and one is from the input node to the range node. We don't know the order. Hence the below code.
        let indicatorNode: AdvValNode | ValNode
        if (this["editorInstance"]._connections && Array.isArray(this["editorInstance"].connections)) {
            let conns: Array<any> = this["editorInstance"].connections;
            for (let i = 0; i < conns.length; i++) {
                if (conns[i].to.parent.id == this.id) {
                    indicatorNode = conns[i].from.parent;
                }
            }
        }
        if (!indicatorNode) {
            this.log(LogType.warning, "Nothing connected to range node", "Range node will not execute as nothing is connected to range node.")
            return;
        }

        let indicatorNodeName = indicatorNode.constructor.name
        if (indicatorNodeName != "ValNode" && indicatorNodeName != "AdvValNode") {
            this.log(LogType.error, "Invalid input connected", `Please note that the input should be a valid indicator. The indicator node can be of type "Basic Indicator" or "Adv. Indicator". However, connected node has a type of ${indicatorNodeName}.`)
            return;
        }
        let indicatorName: AdvIndicatorOption | IndicatorOption;
        Array.from(indicatorNode.options).forEach(([key, option]) => {
            if (key == "Indicator") {
                indicatorName = option.value;
            }
        })


        let period: number;
        if (indicatorNodeName == "AdvValNode") {
            period = (indicatorNode as AdvValNode).getOptionValue("period (days)");
            if (typeof period === "undefined") {
                period = -1;
            }
        }


        const chartsProvider = data.chartsProvider;
        const indicatorArray: number[] = [];
        switch (indicatorName) {
            case "Close": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].close)
                }
                break;
            }
            case "Open": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].open)
                }
                break;
            }
            case "High": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].high)
                }
                break;
            }
            case "Low": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].low)
                }
                break;
            }
            case "Volume": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].volume)
                }
                break;
            }
            case "Adj Close": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].adj)
                }
                break;
            }
            case "ADX": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("adx", data.currentData[i].date, { period }, data.currentData.slice(0, i + 1))
                    if (out && out.adx) {
                        indicatorArray.push(out.adx);
                    }
                }
                break;
            }
            case "AROON": {
                const aroonType = (indicatorNode as AdvValNode).getOptionValue("Aroon Type");
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("aroon", data.currentData[i].date, { period }, data.currentData.slice(0, i + 1))
                    if (out) {
                        switch (aroonType) {
                            case "Down": {
                                indicatorArray.push(out.down);
                                break;
                            }
                            case "Up": {
                                indicatorArray.push(out.up);
                                break;
                            }
                            case "Up-Down": {
                                indicatorArray.push(out.oscillator);
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case "ATR": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("atr", data.currentData[i].date, { period }, data.currentData.slice(0, i + 1))
                    if (out && out.value) {
                        indicatorArray.push(out.value);
                    }
                }
                break;
            }
            case "Bollinger": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("bollinger", data.currentData[i].date, { period, sdMultiplication: (indicatorNode as AdvValNode).getOptionValue("multiplier") }, data.currentData.slice(0, i + 1))
                    if (out) {
                        const x = 12;
                        const bollingerBound: BollingerOption = (indicatorNode as AdvValNode).getOptionValue("Bollinger Bound");
                        switch (bollingerBound) {
                            case "Lower":
                                if (out.lowerBand) {
                                    indicatorArray.push(out.lowerBand)
                                }
                                break;
                            case "Middle":
                                if (out.middleBand) {
                                    indicatorArray.push(out.middleBand)
                                }
                                break;
                            case "Upper":
                                if (out.upperBand) {
                                    indicatorArray.push(out.upperBand);
                                }
                                break;
                        }
                    }
                }
                break;
            }
            case "EMA": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("ema", data.currentData[i].date, { period }, data.currentData.slice(0, i + 1))
                    if (out && out.value) {
                        indicatorArray.push(out.value);
                    }
                }
                break;
            }
            case "Ichimoku": {
                let node = (indicatorNode as AdvValNode)
                const tenkanSen = node.getOptionValue("tenkanSen");
                const kijunSen = node.getOptionValue("kijunSen");
                const senkouSpanB = node.getOptionValue("senkouSpanB");
                const ichimokuType = node.getOptionValue("Ichimoku Type");
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("ichimoku", data.currentData[i].date, { tenkanSen, kijunSen, senkouSpanB }, data.currentData.slice(0, i + 1))
                    if (out && out[ichimokuType]) {
                        indicatorArray.push(out[ichimokuType]);
                    }
                }
                break;
            }
            case "MACD": {
                let node = (indicatorNode as AdvValNode)

                const fast = node.getOptionValue("fast");
                const slow = node.getOptionValue("slow");
                const signal = node.getOptionValue("signal");

                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("macd", data.currentData[i].date, { fast, slow, signal }, data.currentData.slice(0, i + 1))
                    const macdType: MacdTypeOption = (indicatorNode as AdvValNode).getOptionValue("MACD Type");
                    if (out) {
                        if (macdType == "Line") {
                            if (out.macd) {
                                indicatorArray.push(out.macd);
                            } else {
                                indicatorArray.push(0);
                            }
                        }
                        if (macdType == "Signal") {
                            if (out.signal) {
                                indicatorArray.push(out.signal);
                            } else {
                                indicatorArray.push(0);
                            }
                        }
                    }
                }
                break;
            }

            case "Pivot Point": {
                let node = indicatorNode as AdvValNode;
                const alg = node.getOptionValue("Pivot Alg");
                const line = node.getOptionValue("Pivot Line");
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let lines = Supstance.calculate(data.currentData.slice(0, i + 1), { name: alg });
                    const [pl, r1, r2, r3, s1, s2, s3] = lines;
                    let output: any;
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
                    indicatorArray.push(output);
                }
                break;
            }

            case "RSI": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("rsi", data.currentData[i].date, { period }, data.currentData.slice(0, i + 1))
                    if (out && out.value) {
                        indicatorArray.push(out.value);
                    }
                }
                break;
            }
            case "SMA": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("sma", data.currentData[i].date, { period }, data.currentData.slice(0, i + 1))
                    if (out && out.value) {
                        indicatorArray.push(out.value);
                    }
                }
                break;
            }
            case "Stochastic": {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    const stochasticType: StochasticOption = (indicatorNode as AdvValNode).getOptionValue("Stochastic Type");
                    let out = chartsProvider.calculateData("stochastic", data.currentData[i].date, { periodD: 3 }, data.currentData.slice(0, i + 1))
                    if (out) {
                        switch (stochasticType) {
                            case "Slow (3 day)": {
                                if (out.stochasticD) {
                                    indicatorArray.push(out.stochasticD);
                                };
                                break;
                            }
                            case "Fast (1 day)": {
                                if (out.stochasticK) {
                                    indicatorArray.push(out.stochasticK);
                                };
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case "Williams%": {
                let node = indicatorNode as AdvValNode
                const overbought = node.getOptionValue("Overbought");
                const oversold = node.getOptionValue("Oversold");
                const middle = node.getOptionValue("Middle");

                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    let out = chartsProvider.calculateData("williams", data.currentData[i].date, { period, overbought, oversold, middle }, data.currentData.slice(0, i + 1))
                    if (out && out.value) {
                        indicatorArray.push(out.value);
                    }
                }
                break;
            }

            default: {
                for (let i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(0)
                }
            }
        }

        //from https://stackoverflow.com/a/53577159
        const getStandardDeviation = (array: number[]): number => {
            const n = array.length as number
            const mean: number = array.reduce((a, b) => (a + b)) / n;
            return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
        }

        const getVariance = (array: number[]): number => {
            const n = array.length as number
            const mean: number = array.reduce((a, b) => (a + b)) / n;
            return (array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
        }


        let out: number;
        if (indicatorArray.length == 0) {
            switch (whenStrategyOption) {
                case "PAUSE_WHEN_UNAVAILABLE": {
                    this.log(LogType.message, "Pausing as no output from connected indicator", "There was no output from the connected indicator hence this node has been paused. You can control what happens when there is no output by clicking on the settings icon in the node.");
                    return;
                }
                case "USE_SPECIFIED": {
                    this.log(LogType.message, "No output from connected indicator, using specified value instead", `No output was received from the connected indicator, hence the node is using the default value of ${specificValue} instead.`)
                    out = specificValue;
                    console.log(out);
                }
            }
        } else {
            switch (stat) {
                case "Largest": {
                    let max = indicatorArray[0];
                    for (let i = 0; i < indicatorArray.length; i++) {
                        if (indicatorArray[i] > max) {
                            max = indicatorArray[i];
                        }
                    }
                    out = max;
                    break;
                }
                case "Smallest": {
                    let min = indicatorArray[0];
                    for (let i = 0; i < indicatorArray.length; i++) {
                        if (indicatorArray[i] < min) {
                            min = indicatorArray[i];
                        }
                    }
                    out = min;
                    break;
                }
                case "% Growth": {
                    let base = indicatorArray[0];
                    let end = indicatorArray[indicatorArray.length - 1];

                    out = (end - base) / base * 100;
                    break;
                }
                case "Mean": {
                    let sum = 0;
                    for (let i = 0; i < indicatorArray.length; i++) {
                        sum += indicatorArray[i];
                    }
                    out = sum / indicatorArray.length;
                    break;
                }
                case "Median": {
                    let arr = indicatorArray.slice(); //make a copy
                    arr.sort();
                    if (arr.length % 2 == 1) {
                        out = arr[arr.length / 2]
                    } else {
                        out = (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2
                    }
                    break;
                }
                case "Mode": {
                    let arr = indicatorArray.slice();
                    arr.sort();
                    let max = 0;
                    let index = 0;
                    for (let i = 0; i < indicatorArray.length; i++) {
                        const check = (i: number): number => {
                            if (i < indicatorArray.length - 1 && arr[i] == arr[i + 1]) {
                                return 1 + check(i + 1);
                            }
                            return 0;
                        }
                        let curr = check(i);
                        if (curr > max) {
                            max = curr;
                            index = i;
                        }
                    }
                    out = arr[index];
                    break;
                }
                case "STDV": {
                    out = getStandardDeviation(indicatorArray);
                    break;
                }
                case "Variance": {
                    out = getVariance(indicatorArray);
                    break;
                }
            }
        }

        this.getInterface("Output").value = out;
        this.log(LogType.message, "Setting output to " + out)
    }

    addOption(name: OptionName, component: string, defaultVal?: any, sideBarComponent?: string, additionalOptions?: Record<string, any>): NodeOption {
        return super.addOption(name, component, defaultVal, sideBarComponent, additionalOptions);
    }

    getOptionValue(name: OptionName) {
        return super.getOptionValue(name);
    }

    getInterface(name: InterfaceName): NodeInterface {
        return super.getInterface(name);
    }

    addInputInterface(name: InputName): NodeInterface {
        return super.addInputInterface(name);
    }

    addOutputInterface(name: OutputName, additionalProperties?: Record<string, any>): NodeInterface {
        return super.addOutputInterface(name, additionalProperties);
    }
}