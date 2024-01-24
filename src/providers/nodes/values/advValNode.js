//ADVANCED INDICATOR NODE
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { LogType } from "../../state-machine/state-machine";
import { Supstance } from "../../supstance/supstance";
import { BaseNode } from "../base-node";
var AdvValNode = /** @class */ (function (_super) {
    __extends(AdvValNode, _super);
    function AdvValNode() {
        var _this = _super.call(this) || this;
        _this.type = "AdvValNode";
        _this.name = "Adv. Indicator";
        _this.indicatorOptions = ["SMA", "EMA", "Bollinger", "MACD", "Pivot Point", "Ichimoku", "ADX", "AROON", "ATR", "RSI", "Stochastic", "Williams%"];
        _this.whenOptions = ["Today", "Yesterday", "N Day(s) Ago", "N Week(s) Ago", "N Month(s) Ago", "N Year(s) Ago", "Bot Start"];
        _this.stochasticOptions = ["Fast Stochastic", "Slow Stochastic"];
        _this.bollingerOptions = ["Upper", "Middle", "Lower"];
        _this.pivotOptions = ["Camarilla", "Fibonacci", "Floor", "Woodie"];
        _this.indicatorHideWhen = { "SMA": ["multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type"], "EMA": ["MACD Type", "Ichimoku Type", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal"], "Bollinger": ["MACD Type", "Ichimoku Type", "Stochastic Type", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal"], "MACD": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "Ichimoku Type", "tenkanSen", "kijunSen", "senkouSpanB"], "Pivot Point": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type"], "Ichimoku": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "fast", "slow", "signal", "MACD Type"], "ADX": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type"], "AROON": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type"], "ATR": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type"], "RSI": ["period (days)", "multiplier", "Stochastic Type", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type"], "Stochastic": ["period (days)", "multiplier", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type", "Ichimoku Type"], "Williams%": ["period (days)", "multiplier", "Bollinger Bound", "Pivot Alg", "Pivot Line", "Aroon Type", "Ichimoku Line", "tenkanSen", "kijunSen", "senkouSpanB", "fast", "slow", "signal", "MACD Type"] };
        _this.whenHideWhen = { "Today": ["Where N is"], "Yesterday": ["Where N is"], "Bot Start": ["Where N is"] };
        _this.addOption("Indicator", "SelectOption", "SMA", undefined, { items: _this.indicatorOptions, hideWhen: _this.indicatorHideWhen });
        //------------------------------------------
        _this.addOption("Pivot Alg", "SelectOption", "Floor", undefined, { items: _this.pivotOptions });
        _this.addOption("Pivot Line", "SelectOption", "S1", undefined, { items: ["S1", "S2", "S3", "PV", "R1", "R2", "R3"] });
        _this.addOption("Stochastic Type", "SelectOption", "Fast (1 day)", undefined, { items: ["Fast (1 day)", "Slow (3 day)"] });
        _this.addOption("Aroon Type", "SelectOption", "Up-Down", undefined, { items: ["Up-Down", "Up", "Down"] });
        _this.addOption("Bollinger Bound", "SelectOption", "Upper", undefined, { items: ["Upper", "Middle", "Lower"] });
        // williams is good
        // adx is good
        // RSI is good
        _this.addOption("MACD Type", "SelectOption", "Line", undefined, { items: ["Line", "Signal"] });
        _this.addOption("Ichimoku Type", "SelectOption", "tenkanSen", undefined, { items: ["tenkanSen", "kijunSen", "senkouSpanA", "senkouSpanB"] });
        //this.addOption("Ichimoku Line", "SelectOption", "Tenkan-sen", undefined, { items: ["Tenkan-sen", "Kijun-sen", "Senoku Span A", "Senoku Span B", "Chikou Span"] })
        _this.addOption("period (days)", "IntegerOption", 20);
        _this.addOption("multiplier", "NumberOption", 2, undefined, { isSetting: true });
        _this.addOption("tenkanSen", "NumberOption", 9, undefined, { isSetting: true });
        _this.addOption("kijunSen", "NumberOption", 26, undefined, { isSetting: true });
        _this.addOption("senkouSpanB", "NumberOption", 52, undefined, { isSetting: true });
        _this.addOption("fast", "NumberOption", 12, undefined, { isSetting: true });
        _this.addOption("slow", "NumberOption", 26, undefined, { isSetting: true });
        _this.addOption("signal", "NumberOption", 9, undefined, { isSetting: true });
        //-----------------------------------
        _this.addOption("When", "SelectOption", "Today", undefined, { items: ["Today", "Yesterday", "N Day(s) Ago", "N Week(s) Ago", "N Month(s) Ago", "N Year(s) Ago", "Bot Start"], hideWhen: _this.whenHideWhen });
        _this.addOption("Where N is", "IntegerOption", 1, undefined, { min: 1, max: 9999 });
        _this.addOption("If Undefined", "SelectOption", "Custom Value", undefined, { isSetting: true, items: ["Pause Execution", "Custom Value", "Closest Value"], hideWhen: { "Pause Execution": ["Return"], "Closest Value": ["Return"] } });
        _this.addOption("Return", "NumberOption", 0, undefined, { isSetting: true });
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Output");
        return _this;
    }
    AdvValNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    AdvValNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    AdvValNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var indicator = this.getOptionValue("Indicator");
        var period = this.getOptionValue("period (days)");
        var multiplier = this.getOptionValue("multiplier");
        var stochasticType = this.getOptionValue("Stochastic Type");
        var bollingerBound = this.getOptionValue("Bollinger Bound");
        var macdType = this.getOptionValue("MACD Type");
        var when = this.getOptionValue("When");
        var number = this.getOptionValue("Where N is");
        var chartsProvider = data.chartsProvider;
        //some charts may not have period in the future, hence the period option may not always be there:
        if (typeof period === "undefined") {
            period = -1;
        }
        //let's find the date at which the indicator is to be calculated:
        //(dt will be undefined if not found)
        var dt;
        var whenStrategyOpt = this.getOptionValue("If Undefined");
        var whenStrategy;
        var specifiedVal = 0;
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
        //NOTE: The below code will reject cases where the index is equal to period. However, for EMA and SMA that value is actually acceptable. But for simplification we ignore that particualr case. If the period is 7 days, day 8 is valid. Day 7 would be invalid in our approach. 
        switch (when) {
            case "Today": {
                var index = data.dateKeyIndex;
                if (index > period) {
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "Yesterday": {
                var index = data.dateKeyIndex - 1;
                if (index > period) {
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Day(s) Ago": {
                var index = data.dateKeyIndex - number;
                if (index > period) {
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Week(s) Ago": {
                var index = void 0;
                var currentDate = data.currentData[data.dateKeyIndex].date;
                var targetDate = (new Date());
                targetDate.setDate(currentDate.getDate() - 7 * number);
                for (var i = data.dateKeyIndex; i--; i >= 0) {
                    if (data.currentData[i].date.getTime() <= targetDate.getTime()) {
                        index = i;
                        break;
                    }
                }
                if (index && index > period) {
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Month(s) Ago": {
                var index = void 0;
                var currentDate = data.currentData[data.dateKeyIndex].date;
                var targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - number, currentDate.getDate());
                for (var i = data.dateKeyIndex; i--; i >= 0) {
                    if (data.currentData[i].date.getTime() <= targetDate.getTime()) {
                        index = i;
                        break;
                    }
                }
                if (index && index > period) {
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "N Year(s) Ago": {
                var index = void 0;
                var currentDate = data.currentData[data.dateKeyIndex].date;
                var targetDate = new Date(currentDate.getFullYear() - number, currentDate.getMonth(), currentDate.getDate());
                for (var i = data.dateKeyIndex; i--; i >= 0) {
                    if (data.currentData[i].date.getTime() <= targetDate.getTime()) {
                        index = i;
                        break;
                    }
                }
                if (index && index > period) {
                    dt = data.currentData[index].date;
                }
                break;
            }
            case "Bot Start": {
                dt = data.currentData[0].date;
                break;
            }
        }
        //if there is no date, then we need to do something about it:
        if (typeof dt === "undefined") {
            switch (whenStrategy) {
                case "PAUSE_WHEN_UNAVAILABLE": {
                    this.getInterface("Output").value = undefined;
                    this.log(LogType.message, "Data for " + specifiedVal + " unavailable. Bot Paused.", "Pausing Execution. Change settings under 'If Undefined' to handle differently");
                    return;
                }
                case "USE_SPECIFIED": {
                    this.getInterface("Output").value = specifiedVal;
                    this.log(LogType.message, "Data for specified date unavailable. Using '" + specifiedVal + "' instead.", "Returning custom value. Change settings under 'If Undefined' to handle differently");
                    return;
                }
                case "USE_WHATS_AVAILABLE": {
                    if (data.currentData.length > period) {
                        dt = data.currentData[period].date;
                        this.log(LogType.warning, "Data for " + specifiedVal + " unavailable. Using " + new Date(dt).toDateString() + " instead.", "Using the closest available value. Change settings under 'If Undefined' to handle differently");
                    }
                    else {
                        this.getInterface("Output").value = undefined;
                        this.log(LogType.warning, "Data unavailable for specified date. Bot Paused.", "Closest value is beyond nearness threshold.");
                        return;
                    }
                    break;
                }
            }
        }
        //now that we have the date, let's find the indicator's value:
        var output;
        switch (indicator) {
            case "MACD": {
                var out = chartsProvider.calculateData("macd", dt, {}, data.currentData);
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
            case "ATR": {
                var out = chartsProvider.calculateData("atr", dt, { period: period }, data.currentData);
                if (out && out.value) {
                    output = out.value;
                }
                break;
            }
            case "Bollinger": {
                //TODO period is hard-coded to 20 days, set period: 20 here to bring that to effect.
                var out = chartsProvider.calculateData("bollinger", dt, { period: period }, data.currentData);
                if (out) {
                    switch (bollingerBound) {
                        case "Lower":
                            if (out.lowerBand) {
                                output = out.lowerBand;
                            }
                            break;
                        case "Middle":
                            if (out.middleBand) {
                                output = out.middleBand;
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
                var out = chartsProvider.calculateData("ema", dt, { period: period }, data.currentData);
                if (out && out.value) {
                    output = out.value;
                }
                break;
            }
            case "SMA": {
                var out = chartsProvider.calculateData("sma", dt, { period: period }, data.currentData);
                if (out && out.value) {
                    output = out.value;
                }
                break;
            }
            case "RSI": {
                var out = chartsProvider.calculateData("rsi", dt, { period: period }, data.currentData);
                if (out && out.rsi) {
                    output = out.rsi;
                }
                break;
            }
            case "Stochastic": {
                var out = chartsProvider.calculateData("stochastic", dt, { periodD: 3, period: period }, data.currentData);
                if (out) {
                    switch (stochasticType) {
                        case "Slow Stochastic": {
                            if (out.stochasticD) {
                                output = out.stochasticD;
                            }
                            ;
                            break;
                        }
                        case "Fast Stochastic": {
                            if (out.stochasticK) {
                                output = out.stochasticK;
                            }
                            ;
                            break;
                        }
                    }
                }
                break;
            }
            case "Williams%": {
                var out = chartsProvider.calculateData("williams", dt, { period: period }, data.currentData);
                if (out && out.williams) {
                    output = out.williams;
                }
                break;
            }
            case "ADX": {
                var out = chartsProvider.calculateData("adx", dt, { period: period }, data.currentData);
                if (out && out.adx) {
                    output = out.adx;
                }
                break;
            }
            case "Pivot Point": {
                var alg = this.getOptionValue("Pivot Alg");
                var line = this.getOptionValue("Pivot Line");
                var lines = Supstance.calculate(data.currentData, alg);
                var pl = lines[0], r1 = lines[1], r2 = lines[2], r3 = lines[3], s1 = lines[4], s2 = lines[5], s3 = lines[6];
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
                break;
            }
            case "AROON": {
                var out = chartsProvider.calculateData("aroon", dt, { period: period }, data.currentData);
                if (out && out.aroon) {
                    output = out.aroon;
                }
                break;
            }
            case "Ichimoku": {
                var out = chartsProvider.calculateData("ichimoku", dt, {}, data.currentData);
                // switch (this.getOptionValue("Ichimoku Type")) {
                //     case "tenkanSen": {
                //         output = out.tenkanSen
                //         break
                //     }
                //     case "kijunSen": {
                //         output = out.kijunSen
                //         break
                //     }
                //     case "senkouSpanA": {
                //         output = out.senkouSpanA
                //         break
                //     }
                //     case "senkouSpanB": {
                //         output = out.senkouSpanB
                //         break
                //     }
                // }
                output = out[this.getOptionValue("Ichimoku Type")];
                break;
            }
        }
        if (typeof output === "undefined") {
            switch (whenStrategy) {
                case "PAUSE_WHEN_UNAVAILABLE": {
                    this.getInterface("Output").value = undefined;
                    this.log(LogType.message, "Pausing node execution as no data is available for the specified date");
                    return;
                }
                case "USE_SPECIFIED": {
                    this.getInterface("Output").value = specifiedVal;
                    this.log(LogType.message, "Data for the specified date is not available, using specified value (" + specifiedVal + ") instead.");
                    return;
                }
                // case "USE_WHATS_AVAILABLE": {
                //     //NOTE for stochastic it is still sometimes possible to get a valid output (in the sense of use what's available - there is some data possibly avaialbla but we are stoill returning undefined). If required, code can be added for that.
                //     this.getInterface("Output").value = undefined;
                //     this.log(LogType.warning, "Pausing node execution as no data is available for the specified date")
                //     return;
                // }
            }
        }
        else {
            this.getInterface("Output").value = output;
            this.log(LogType.message, "Output data = " + output);
        }
    };
    return AdvValNode;
}(BaseNode));
export { AdvValNode };
//# sourceMappingURL=advValNode.js.map