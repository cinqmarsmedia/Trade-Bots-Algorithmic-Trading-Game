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
import { BaseNode } from "../base-node";
var RangeNode = /** @class */ (function (_super) {
    __extends(RangeNode, _super);
    function RangeNode() {
        var _this = _super.call(this) || this;
        _this.type = "RangeNode";
        _this.name = "Get Range Value";
        _this.addInputInterface("Indicator");
        _this.addOption("Statistic", "SelectOption", "Mean", undefined, { items: ["Largest", "Smallest", "% Growth", "Mean", "STDV", "Median", "Mode", "Variance"] });
        _this.addOption("TextOption", "TextOption", "Between Indicator And");
        _this.addOption("Days Before", "IntegerOption", 1, undefined, { min: 1, max: 1000 });
        _this.addOption("Days are", "SelectOption", "Trading Days", undefined, { isSetting: true, items: ['Actual Days', 'Trading Days'] });
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOption("If Undefined", "SelectOption", "Custom Value", undefined, { isSetting: true, items: ["Pause Execution", "Custom Value"], hideWhen: { "Pause Execution": ["Return"] } });
        _this.addOption("Return", "NumberOption", 0, undefined, { isSetting: true });
        _this.addOutputInterface("Output");
        return _this;
    }
    RangeNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var stat = this.getOptionValue("Statistic");
        var daysBefore = this.getOptionValue("Days Before");
        var currentDate = data.currentData[data.dateKeyIndex].date;
        var daysOption = this.getOptionValue("Days are");
        var targetIndex = 0;
        var specificValue = this.getOptionValue("Return");
        switch (daysOption) {
            case "Actual Days": {
                var targetTime = currentDate.getTime() - daysBefore * 24 * 3600 * 1000;
                for (var i = data.dateKeyIndex; i >= 0; i--) {
                    if (data.currentData[i].date.getTime() <= targetTime) {
                        targetIndex = i;
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
        var ifUndefinedOption = this.getOptionValue("If Undefined");
        var whenStrategyOption;
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
                    this.log(LogType.message, "No output from connected indicator, using specified value instead", "No output was received from the connected indicator, hence the node is using the default value of ".concat(specificValue, " instead."));
                    this.getInterface("Output").value = specificValue;
                    this.log(LogType.message, "Setting output to " + specificValue);
                    return;
                }
            }
        }
        //figure out what is the indicator
        //there are two connections, one is from range node to the output node, and one is from the input node to the range node. We don't know the order. Hence the below code.
        var indicatorNode;
        if (this["editorInstance"]._connections && Array.isArray(this["editorInstance"].connections)) {
            var conns = this["editorInstance"].connections;
            for (var i = 0; i < conns.length; i++) {
                if (conns[i].to.parent.constructor.name == "RangeNode") {
                    indicatorNode = conns[i].from.parent;
                }
            }
        }
        if (!indicatorNode) {
            this.log(LogType.warning, "Nothing connected to range node", "Range node will not execute as nothing is connected to range node.");
            return;
        }
        var indicatorNodeName = indicatorNode.constructor.name;
        if (indicatorNodeName != "ValNode" && indicatorNodeName != "AdvValNode") {
            this.log(LogType.error, "Invalid input connected", "Please note that the input should be a valid indicator. The indicator node can be of type \"Basic Indicator\" or \"Adv. Indicator\". However, connected node has a type of ".concat(indicatorNodeName, "."));
            return;
        }
        var indicatorName;
        Array.from(indicatorNode.options).forEach(function (_a) {
            var key = _a[0], option = _a[1];
            if (key == "Indicator") {
                indicatorName = option.value;
            }
        });
        var period;
        if (indicatorNodeName == "AdvValNode") {
            period = indicatorNode.getOptionValue("period (days)");
            if (typeof period === "undefined") {
                period = -1;
            }
        }
        var chartsProvider = data.chartsProvider;
        var indicatorArray = [];
        switch (indicatorName) {
            case "Close": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].close);
                }
                break;
            }
            case "Open": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].open);
                }
                break;
            }
            case "High": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].high);
                }
                break;
            }
            case "Low": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].low);
                }
                break;
            }
            case "Volume": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].volume);
                }
                break;
            }
            case "Adj Close": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(data.currentData[i].adj);
                }
                break;
            }
            case "ATR": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var out_1 = chartsProvider.calculateData("atr", data.currentData[i].date, { period: period }, data.currentData.slice(0, i + 1));
                    if (out_1 && out_1.value) {
                        indicatorArray.push(out_1.value);
                    }
                }
                break;
            }
            case "Bollinger": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var out_2 = chartsProvider.calculateData("bollinger", data.currentData[i].date, { period: period }, data.currentData.slice(0, i + 1));
                    if (out_2) {
                        var x = 12;
                        var bollingerBound = indicatorNode.getOptionValue("Bollinger Bound");
                        switch (bollingerBound) {
                            case "Lower":
                                if (out_2.lowerBand) {
                                    indicatorArray.push(out_2.lowerBand);
                                }
                                break;
                            case "Middle":
                                if (out_2.middleBand) {
                                    indicatorArray.push(out_2.middleBand);
                                }
                                break;
                            case "Upper":
                                if (out_2.upperBand) {
                                    indicatorArray.push(out_2.upperBand);
                                }
                                break;
                        }
                    }
                }
                break;
            }
            case "EMA": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var out_3 = chartsProvider.calculateData("ema", data.currentData[i].date, { period: period }, data.currentData.slice(0, i + 1));
                    if (out_3 && out_3.value) {
                        indicatorArray.push(out_3.value);
                    }
                }
                break;
            }
            case "RSI": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var out_4 = chartsProvider.calculateData("rsi", data.currentData[i].date, { period: period }, data.currentData.slice(0, i + 1));
                    if (out_4 && out_4.value) {
                        indicatorArray.push(out_4.value);
                    }
                }
                break;
            }
            case "SMA": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var out_5 = chartsProvider.calculateData("sma", data.currentData[i].date, { period: period }, data.currentData.slice(0, i + 1));
                    if (out_5 && out_5.value) {
                        indicatorArray.push(out_5.value);
                    }
                }
                break;
            }
            case "Stochastic": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var stochasticType = indicatorNode.getOptionValue("Stochastic Type");
                    var out_6 = chartsProvider.calculateData("stochastic", data.currentData[i].date, { periodD: 3, period: period }, data.currentData.slice(0, i + 1));
                    if (out_6) {
                        switch (stochasticType) {
                            case "Slow Stochastic": {
                                if (out_6.stochasticD) {
                                    indicatorArray.push(out_6.stochasticD);
                                }
                                ;
                                break;
                            }
                            case "Fast Stochastic": {
                                if (out_6.stochasticK) {
                                    indicatorArray.push(out_6.stochasticK);
                                }
                                ;
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case "Williams%": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var out_7 = chartsProvider.calculateData("williams", data.currentData[i].date, { period: period }, data.currentData.slice(0, i + 1));
                    if (out_7 && out_7.value) {
                        indicatorArray.push(out_7.value);
                    }
                }
                break;
            }
            case "MACD": {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    var out_8 = chartsProvider.calculateData("macd", data.currentData[i].date, {}, data.currentData.slice(0, i + 1));
                    var macdType = indicatorNode.getOptionValue("MACD Type");
                    if (out_8) {
                        if (macdType == "Line") {
                            if (out_8.macd) {
                                indicatorArray.push(out_8.macd);
                            }
                            else {
                                indicatorArray.push(0);
                            }
                        }
                        if (macdType == "Signal") {
                            if (out_8.signal) {
                                indicatorArray.push(out_8.signal);
                            }
                            else {
                                indicatorArray.push(0);
                            }
                        }
                    }
                }
                break;
            }
            default: {
                for (var i = targetIndex; i <= data.dateKeyIndex; i++) {
                    indicatorArray.push(0);
                }
            }
        }
        //from https://stackoverflow.com/a/53577159
        var getStandardDeviation = function (array) {
            var n = array.length;
            var mean = array.reduce(function (a, b) { return (a + b); }) / n;
            return Math.sqrt(array.map(function (x) { return Math.pow(x - mean, 2); }).reduce(function (a, b) { return a + b; }) / n);
        };
        var getVariance = function (array) {
            var n = array.length;
            var mean = array.reduce(function (a, b) { return (a + b); }) / n;
            return (array.map(function (x) { return Math.pow(x - mean, 2); }).reduce(function (a, b) { return a + b; }) / n);
        };
        var out;
        if (indicatorArray.length == 0) {
            switch (whenStrategyOption) {
                case "PAUSE_WHEN_UNAVAILABLE": {
                    this.log(LogType.message, "Pausing as no output from connected indicator", "There was no output from the connected indicator hence this node has been paused. You can control what happens when there is no output by clicking on the settings icon in the node.");
                    return;
                }
                case "USE_SPECIFIED": {
                    this.log(LogType.message, "No output from connected indicator, using specified value instead", "No output was received from the connected indicator, hence the node is using the default value of ".concat(specificValue, " instead."));
                    out = specificValue;
                    console.log(out);
                }
            }
        }
        else {
            switch (stat) {
                case "Largest": {
                    var max_1 = indicatorArray[0];
                    for (var i = 0; i < indicatorArray.length; i++) {
                        if (indicatorArray[i] > max_1) {
                            max_1 = indicatorArray[i];
                        }
                    }
                    out = max_1;
                    break;
                }
                case "Smallest": {
                    var min_1 = indicatorArray[0];
                    for (var i = 0; i < indicatorArray.length; i++) {
                        if (indicatorArray[i] < min_1) {
                            min_1 = indicatorArray[i];
                        }
                    }
                    out = min_1;
                    break;
                }
                case "% Growth": {
                    var base = indicatorArray[0];
                    var end = indicatorArray[indicatorArray.length - 1];
                    out = (end - base) / base * 100;
                    break;
                }
                case "Mean": {
                    var sum = 0;
                    for (var i = 0; i < indicatorArray.length; i++) {
                        sum += indicatorArray[i];
                    }
                    out = sum / indicatorArray.length;
                    break;
                }
                case "Median": {
                    var arr = indicatorArray.slice(); //make a copy
                    arr.sort();
                    if (arr.length % 2 == 1) {
                        out = arr[arr.length / 2];
                    }
                    else {
                        out = (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
                    }
                    break;
                }
                case "Mode": {
                    var arr_1 = indicatorArray.slice();
                    arr_1.sort();
                    var max_2 = 0;
                    var index = 0;
                    var _loop_1 = function (i) {
                        var check = function (i) {
                            if (i < indicatorArray.length - 1 && arr_1[i] == arr_1[i + 1]) {
                                return 1 + check(i + 1);
                            }
                            return 0;
                        };
                        var curr = check(i);
                        if (curr > max_2) {
                            max_2 = curr;
                            index = i;
                        }
                    };
                    for (var i = 0; i < indicatorArray.length; i++) {
                        _loop_1(i);
                    }
                    out = arr_1[index];
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
        this.log(LogType.message, "Setting output to " + out);
    };
    RangeNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    RangeNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    RangeNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    RangeNode.prototype.addInputInterface = function (name) {
        return _super.prototype.addInputInterface.call(this, name);
    };
    RangeNode.prototype.addOutputInterface = function (name, additionalProperties) {
        return _super.prototype.addOutputInterface.call(this, name, additionalProperties);
    };
    return RangeNode;
}(BaseNode));
export { RangeNode };
//# sourceMappingURL=rangeNode.js.map