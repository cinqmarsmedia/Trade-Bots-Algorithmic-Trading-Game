//BASIC INDICATOR NODE
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
import { BaklavaState } from "../../../providers/baklava-state/baklavaState";
import { BaseNode } from "../base-node";
import { LogType } from "../../state-machine/state-machine";
var ValNode = /** @class */ (function (_super) {
    __extends(ValNode, _super);
    function ValNode() {
        var _this = _super.call(this) || this;
        _this.type = "ValNode";
        _this.name = "Basic Indicator";
        //example of interface toggle:
        _this.interfaceToggles = { "Output": true };
        _this.indicatorOptions = ["Close", "Open", "High", "Low", "Volume", "Holdings", "Cash", "Net Worth"];
        _this.whenOptions = ["Today", "Yesterday", "N Day(s) Ago", "N Week(s) Ago", "N Month(s) Ago", "N Year(s) Ago", "Bot Start"];
        _this.whenHideWhen = { "Today": ["Where N is"], "Yesterday": ["Where N is"], "Bot Start": ["Where N is"] };
        if (BaklavaState.getState("unlock") > 0) {
            // this.indicatorOptions.push("Profit", "%Gain", "Loan", "Margin Rate")
        }
        //alert();
        _this.addOption("Indicator", "SelectOption", "Close", undefined, { items: _this.indicatorOptions }); //()()();
        _this.addOption("When", "SelectOption", "Today", undefined, { items: _this.whenOptions, hideWhen: _this.whenHideWhen });
        _this.addOption("Where N is", "IntegerOption", 1, undefined, { min: 1, max: 9999 });
        _this.addOption("Days are", "SelectOption", "Trading Days", undefined, { isSetting: true, items: ["Actual Days", "Trading Days"] });
        _this.addOption("If Undefined", "SelectOption", "Closest Value", undefined, { isSetting: true, items: ["Pause Execution", "Closest Value", "Custom Value"], hideWhen: { "Pause Execution": ["Return"], "Closest Value": ["Return"] } });
        _this.addOption("Return", "NumberOption", 0, undefined, { isSetting: true });
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Output");
        return _this;
    }
    ValNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    ValNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    ValNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var indicator = this.getOptionValue("Indicator");
        var when = this.getOptionValue("When");
        var Number = this.getOptionValue("Where N is");
        var output;
        var index = data.dateKeyIndex;
        var currentDate = data.currentData[data.dateKeyIndex].date;
        var whenStrategyOpt = this.getOptionValue("If Undefined");
        var withinStrategyOpt = this.getOptionValue("Days are");
        var whenStrategy;
        var withinStrategy;
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
                            this.log(LogType.warning, "Stopping propogation as data is not available for yesterday");
                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for yesterday is not available, so using today's data instead");
                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for yesterday is not available so using specified value: " + specifiedVal);
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
                                this.log(LogType.warning, "Stopping propogation as data is not available for the specified day");
                                return;
                            }
                            case "USE_WHATS_AVAILABLE": {
                                index = 0;
                                this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead");
                                break;
                            }
                            case "USE_SPECIFIED": {
                                this.getInterface("Output").value = specifiedVal;
                                this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal);
                                return;
                            }
                        }
                    }
                }
                if (withinStrategy == "ACTUAL_DAYS") {
                    var targetDate = new Date(currentDate.getTime() - 24 * 3600 * 1000 * Number);
                    var found = false;
                    for (var i = data.dateKeyIndex - 1; i >= 0; i--) {
                        var d = data.currentData[i].date;
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
                                this.log(LogType.warning, "Stopping propogation as data is not available for the specified day");
                                return;
                            }
                            case "USE_WHATS_AVAILABLE": {
                                index = 0;
                                this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead");
                                break;
                            }
                            case "USE_SPECIFIED": {
                                this.getInterface("Output").value = specifiedVal;
                                this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal);
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
                            this.log(LogType.warning, "Stopping propogation as data is not available for the specified day");
                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead");
                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal);
                            return;
                        }
                    }
                }
                break;
            }
            case "N Month(s) Ago": {
                var targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - Number, currentDate.getDate());
                var found = false;
                for (var i = data.dateKeyIndex - 1; i >= 0; i--) {
                    var d = data.currentData[i].date;
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
                            this.log(LogType.warning, "Stopping propogation as data is not available for the specified day");
                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead");
                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal);
                            return;
                        }
                    }
                }
                break;
            }
            case "N Year(s) Ago": {
                var targetDate = new Date(currentDate.getFullYear() - Number, currentDate.getMonth(), currentDate.getDate());
                var found = false;
                for (var i = data.dateKeyIndex - 1; i >= 0; i--) {
                    var d = data.currentData[i].date;
                    if (d < targetDate) {
                        index = i;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.log("NOT FOUND");
                    switch (whenStrategy) {
                        case "PAUSE_WHEN_UNAVAILABLE": {
                            //stop propogation now
                            this.getInterface("Output").value = undefined;
                            this.log(LogType.warning, "Stopping propogation as data is not available for the specified day");
                            return;
                        }
                        case "USE_WHATS_AVAILABLE": {
                            index = 0;
                            this.log(LogType.warning, "Data for the specified day is not available, so using the data from the earliest available day instead");
                            break;
                        }
                        case "USE_SPECIFIED": {
                            this.getInterface("Output").value = specifiedVal;
                            this.log(LogType.warning, "Data for the specified day is not available so using specified value: " + specifiedVal);
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
        }
        var currDataPoint = data.currentData[index];
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
            case "Invested": {
                output = data.invested;
                break;
            }
            case "Net Worth": {
                output = data.netWorth;
                break;
            }
        }
        this.getInterface("Output").value = output;
        this.log(LogType.message, "Value = " + output, "The ".concat(indicator, " value for ").concat(Number, " ").concat(when, " is ").concat(output, " and written to the output of this node. "));
    };
    return ValNode;
}(BaseNode));
export { ValNode };
//# sourceMappingURL=valNode.js.map