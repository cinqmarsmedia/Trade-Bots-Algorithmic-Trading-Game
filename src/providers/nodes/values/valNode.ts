//BASIC INDICATOR NODE

import { Node, NodeOption } from "@baklavajs/core";
import { EngineData, InterfaceToggles, WhenStrategy, WithinStrategy } from "../types";
import { BaklavaState } from "../../../providers/baklava-state/baklavaState";
import { BaseNode } from "../base-node";
import { LogType, MarketOrder } from "../../state-machine/state-machine";
import { sort } from 'fast-sort';


export type IndicatorOption = "Net Worth" | "Invested" | "Adj Close" | "Close" | "Open" | "High" | "Low" | "Volume" | "Cash" | "Holdings" | "Short Position";
type WhenOption = "Today" | "Yesterday" | "N Day(s) Ago" | "N Week(s) Ago" | "N Month(s) Ago" | "N Year(s) Ago" | "Bot Start" | "Last Trade" | "Last Sell" | "Last Buy";
type WithinOption = "Actual Days" | "Trading Days"
type WhenStrategyOption = "Pause execution" | "Use specific value" | "Use closest available value"
type IfUndefinedOption = "Closest Value" | "Pause Execution" | "Custom Value";
type Option = IndicatorOption | WhenOption | WithinOption | WhenStrategyOption | IfUndefinedOption;

type WhenHideWhen = { [when in WhenOption]?: OptionName[] }
type WhenStrategyHideWhen = { [when in WhenStrategyOption]?: OptionName[] }
type IfUndefinedHideWhen = { [when in IfUndefinedOption]?: OptionName[] }

type HideWhen = WhenHideWhen | WhenStrategyHideWhen | IfUndefinedHideWhen

type OptionName = "If Undefined" | "Where N is" | "Log Message + Data" | "Indicator" | "When" | "Number" | "Days are" | "Return"

export class ValNode extends BaseNode {

    public type: string = "ValNode"
    public name: string = "Basic Indicator"

    //example of interface toggle:
    public interfaceToggles: InterfaceToggles = { "Output": true }

    public indicatorOptions: IndicatorOption[] = ["Close", "Open", "High", "Low", "Volume", "Holdings", "Cash", "Net Worth","Short Position"];
    public whenOptions: WhenOption[] = ["Today", "Yesterday", "N Day(s) Ago", "N Week(s) Ago", "N Month(s) Ago", "N Year(s) Ago", "Bot Start", "Last Trade", "Last Buy", "Last Sell"];

    whenHideWhen: WhenHideWhen = { "Today": ["Where N is"], "Yesterday": ["Where N is"], "Bot Start": ["Where N is"], "Last Trade": ["Where N is"], "Last Buy": ["Where N is"], "Last Sell": ["Where N is"] }

    addOption(name: OptionName, component: string, defaultVal?: Option | number | boolean, sideBarComponent?: string, additionalOptions?: { hideWhen?: HideWhen, items?: Option[], min?: number, max?: number, isSetting?: boolean }): NodeOption {
        return super.addOption(name, component, defaultVal, sideBarComponent, additionalOptions);
    }

    getOptionValue(name: OptionName) {
        return super.getOptionValue(name);
    }

    constructor() {
        super();
        if (BaklavaState.getState("unlock") > 0) {
            // this.indicatorOptions.push("Profit", "%Gain", "Loan", "Margin Rate")
        }
        //alert();

        this.addOption("Indicator", "SelectOption", "Close", undefined, { items: this.indicatorOptions }) //()()();
        this.addOption("When", "SelectOption", "Today", undefined, { items: this.whenOptions, hideWhen: this.whenHideWhen });
        this.addOption("Where N is", "IntegerOption", 1, undefined, { min: 1, max: 9999 });
        this.addOption("Days are", "SelectOption", "Trading Days", undefined, { isSetting: true, items: ["Actual Days", "Trading Days"] });

        this.addOption("If Undefined", "SelectOption", "Closest Value", undefined, { isSetting: true, items: ["Pause Execution", "Closest Value", "Custom Value"], hideWhen: { "Pause Execution": ["Return"], "Closest Value": ["Return"] } })
        this.addOption("Return", "NumberOption", 0, undefined, { isSetting: true });
        this.addOption("Log Message + Data", "InputOption");
        this.addOutputInterface("Output");

    }

    public nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        const indicator: IndicatorOption = this.getOptionValue("Indicator");
        const when: WhenOption = this.getOptionValue("When");
        const Number: number = this.getOptionValue("Where N is");
        let output: number | boolean;

        let index: number = data.dateKeyIndex;
        const currentDate: Date = data.currentData[data.dateKeyIndex].date;


        let whenStrategyOpt: IfUndefinedOption = this.getOptionValue("If Undefined");
        let withinStrategyOpt: WithinOption = this.getOptionValue("Days are");
        let whenStrategy: WhenStrategy;
        let withinStrategy: WithinStrategy;
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

        switch (withinStrategyOpt) {
            case "Actual Days": {
                withinStrategy = "ACTUAL_DAYS";
                break;
            }
            case "Trading Days": {
                withinStrategy = "TRADING_DAYS";
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

        switch (when) {
            case "Today": {
                break;
            }
            case "Yesterday": {
                index = index - 1;
                if (index < 0) {
                    switch (whenStrategy) {
                        case "PAUSE_WHEN_UNAVAILABLE": {
                            //stop propogation now
                            this.getInterface("Output").value = undefined;
                            this.log(LogType.warning, "Stopping propogation as data is not available for yesterday")
                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for yesterday is not available, so using today's data instead")
                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for yesterday is not available so using specified value: " + specifiedVal)
                            return;
                        }
                    }
                }
                break;
            }
            case "N Day(s) Ago": {
                if (withinStrategy == "TRADING_DAYS") {
                    index = index - Number;
                    if (index < 0) {
                        switch (whenStrategy) {
                            case "PAUSE_WHEN_UNAVAILABLE": {
                                //stop propogation now
                                this.getInterface("Output").value = undefined;
                                this.log(LogType.warning, "Stopping propogation as data is not available for the specified day")
                                return;
                            }
                            case "USE_WHATS_AVAILABLE": {
                                index = 0;
                                this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead")
                                break;
                            }
                            case "USE_SPECIFIED": {
                                this.getInterface("Output").value = specifiedVal;
                                this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal)
                                return;
                            }
                        }
                    }
                }

                if (withinStrategy == "ACTUAL_DAYS") {
                    let targetDate = new Date(currentDate.getTime() - 24 * 3600 * 1000 * Number);
                    let found: boolean = false;
                    for (let i = data.dateKeyIndex - 1; i >= 0; i--) {
                        let d = data.currentData[i].date;
                        if (d < targetDate) {
                            index = i;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        switch (whenStrategy) {
                            case "PAUSE_WHEN_UNAVAILABLE": {
                                //stop propogation now
                                this.getInterface("Output").value = undefined;
                                this.log(LogType.warning, "Stopping propogation as data is not available for the specified day")

                                return;
                            }
                            case "USE_WHATS_AVAILABLE": {
                                index = 0;
                                this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead")
                                break;
                            }
                            case "USE_SPECIFIED": {
                                this.getInterface("Output").value = specifiedVal;
                                this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal)

                                return;
                            }
                        }
                    }

                }
                break;
            }
            case "N Week(s) Ago": {
                index = index - 7 * Number;
                if (index < 0) {
                    switch (whenStrategy) {
                        case "PAUSE_WHEN_UNAVAILABLE": {
                            //stop propogation now
                            this.getInterface("Output").value = undefined;
                            this.log(LogType.warning, "Stopping propogation as data is not available for the specified day")

                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead")
                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal)

                            return;
                        }
                    }
                }
                break;
            }
            case "N Month(s) Ago": {
                let targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - Number, currentDate.getDate());
                let found: boolean = false;
                for (let i = data.dateKeyIndex - 1; i >= 0; i--) {
                    let d = data.currentData[i].date;
                    if (d < targetDate) {
                        index = i;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    switch (whenStrategy) {
                        case "PAUSE_WHEN_UNAVAILABLE": {
                            //stop propogation now
                            this.getInterface("Output").value = undefined;
                            this.log(LogType.warning, "Stopping propogation as data is not available for the specified day")

                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead")

                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal)

                            return;
                        }
                    }
                }
                break;
            }
            case "N Year(s) Ago": {
                let targetDate = new Date(currentDate.getFullYear() - Number, currentDate.getMonth(), currentDate.getDate());
                let found: boolean = false;
                for (let i = data.dateKeyIndex - 1; i >= 0; i--) {
                    let d = data.currentData[i].date;
                    if (d < targetDate) {
                        index = i;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    switch (whenStrategy) {
                        case "PAUSE_WHEN_UNAVAILABLE": {
                            //stop propogation now
                            this.getInterface("Output").value = undefined;
                            this.log(LogType.warning, "Stopping propogation as data is not available for the specified day")

                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead")

                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal)

                            return;
                        }
                    }
                }
                break;
            }
            case "Bot Start": {
                index = 0;
                break;
            }
            case "Last Trade": {
                index = 0;
                if (tradeHistory.length > 0) {
                    index = tradeHistory[tradeHistory.length - 1].dateIndex
                }
                break;
            }
            case "Last Sell": {
                index = 0;
                for (let i = tradeHistory.length - 1; i >= 0; i--) {
                    let trade = tradeHistory[i];
                    if (trade.buyOrSell == "SELL") {
                        index = trade.dateIndex;
                        break;
                    }
                }
                break;
            }
            case "Last Buy": {
                index = 0;
                for (let i = tradeHistory.length - 1; i >= 0; i--) {
                    let trade = tradeHistory[i];
                    if (trade.buyOrSell == "BUY") {
                        index = trade.dateIndex;
                        break;
                    }
                }
                break;
            }
        }

        let currDataPoint = data.currentData[index]

        //get input value  
        switch (indicator) {
            case "Close": {
                output = currDataPoint.close;
                break;
            }
            case "Open": {
                output = currDataPoint.open;
                break;
            }
            case "High": {
                output = currDataPoint.high;
                break;
            }
            case "Low": {
                output = currDataPoint.low;
                break;
            }
            case "Adj Close": {
                output = currDataPoint.adj;
                break;
            }
            case "Volume": {
                output = currDataPoint.volume;
                break;
            }
            case "Cash": {
                output = data.cash;
                break;
            }
            case "Holdings": {
                output = data.invested;
                break;
            }
            case "Net Worth": {
                output = data.netWorth;
                break;
            }
            case "Short Position": {
                if (data.invested !== 0) {
                    output = data.longVsShort;
                }
                break;
            }
        }

        this.getInterface("Output").value = output;
        this.log(LogType.message, "Value = " + output, `The ${indicator} value for ${Number} ${when} is ${output} and written to the output of this node. `)

    }
}