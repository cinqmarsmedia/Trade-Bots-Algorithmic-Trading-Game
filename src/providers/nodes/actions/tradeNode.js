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
var TradeNode = /** @class */ (function (_super) {
    __extends(TradeNode, _super);
    function TradeNode() {
        var _this = _super.call(this) || this;
        _this.type = "TradeNode";
        _this.name = "Market Trade";
        _this.addInputInterface("Trigger");
        _this.addOption("Type", "SelectOption", "Buy", undefined, { items: ["Buy", "Sell", "Short", "Cover"], hideWhen: { "Buy": ["warning", "% Invested"], "Sell": ["warning", "% Cash"], "Short": ["% Invested"], "Cover": ["warning", "% Cash"] } });
        _this.addOption("Times", "SelectOption", "Unlimited", undefined, { items: ["Unlimited", "Once Per 7 Days", "Once Per N Days", "Once", "N Times"], hideWhen: { "Unlimited": ["Where N is"], "Once Per 7 Days": ["Where N is"], "Once": ["Where N is"] } });
        _this.addOption("Where N is", "IntegerOption", 10, undefined, { min: 1, max: 999 });
        //this.addOption("Within", "SelectOption", "No time limit", undefined, { items: ["1 day", "7 days", "30 days", "X days", "No time limit"], hideWhen: { "1 day": ["Where X is"], "7 days": ["Where X is"], "30 days": ["Where X is"], "No time limit": ["Where X is"] } })
        //this.addOption("Where X is", "IntegerOption", 90, undefined, { min: 1, max: 100 })
        _this.addOption("warning", "TextOption", "Long investments will auto-sell");
        _this.addOption("% Invested", "IntegerOption", 100, undefined, { min: 1, max: 100 });
        _this.addOption("% Cash", "IntegerOption", 100, undefined, { min: 1, max: 100 });
        _this.addOption("Days are", "SelectOption", "Traded Days", undefined, { isSetting: true, items: ["Actual Days", "Traded Days"] });
        _this.addOption("Min $ Amt", "NumberOption", 1, undefined, { min: 1, max: 1000, isSetting: true });
        _this.addOption("Log Message + Data", "InputOption");
        return _this;
    }
    TradeNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        //the first condition for a market order to be placed is that the trigger for the order should be true:
        var trigger = this.getInterface("Trigger").value;
        var minAmt = this.getOptionValue("Min $ Amt");
        if (typeof trigger !== "boolean") {
            this.log(LogType.error, "Invalid trigger to node - trigger is not a boolean", "This node only accepts a boolean trigger (having a value of true or false). The type of input passed to this node is not acceptable.");
            return;
        }
        if (typeof trigger === "undefined") {
            this.log(LogType.error, "Missing trigger", "This node will only function with a boolean trigger as an input. Missing input.");
            return;
        }
        if (!trigger) {
            return;
        }
        var currentDate = data.currentData[data.dateKeyIndex].date;
        currentDate.setHours(0, 0, 0, 0);
        var currentDateIndex = data.dateKeyIndex;
        var percentage, amount;
        var type = this.getOptionValue("Type").toUpperCase();
        if (type == "BUY" || type == "SHORT") {
            percentage = this.getOptionValue("% Cash");
            var amountBeforeFees = percentage / 100 * data.cash;
            amount = amountBeforeFees / (1 + this.stateMachine.fee);
            if (amount == 0) {
                this.log(LogType.warning, "Not placing order because of insufficient cash", "The cash left is zero. Order will therefore not be placed.");
                return;
            }
        }
        if (type == "COVER" || type == "SELL") {
            percentage = this.getOptionValue("% Invested");
            amount = percentage / 100 * data.invested;
            if (amount == 0) {
                this.log(LogType.warning, "Not placing order because of insufficient amount invested", "The amount currently invested is zero. Order will therefore not be placed.");
                return;
            }
        }
        var times = this.getOptionValue("Times");
        var withinDays;
        var numTimes;
        switch (times) {
            case "Unlimited": {
                numTimes = 999999;
                withinDays = 999999;
                break;
            }
            case "Once Per 7 Days": {
                numTimes = 1;
                withinDays = 7;
                break;
            }
            case "Once": {
                numTimes = 1;
                withinDays = 999999;
                break;
            }
            case "Once Per N Days": {
                numTimes = 1;
                withinDays = this.getOptionValue("Where N is");
                break;
            }
            case "N Times": {
                numTimes = this.getOptionValue("Where N is");
                withinDays = 999999;
                break;
            }
        }
        // let within: WithinOption = this.getOptionValue("Within");
        // switch (within) {
        //     case "1 day": {
        //         withinDays = 1;
        //         break;
        //     }
        //     case "30 days": {
        //         withinDays = 30;
        //         break;
        //     }
        //     case "7 days": {
        //         withinDays = 7;
        //         break;
        //     }
        //     case "No time limit": {
        //         withinDays = 99999;
        //         break;
        //     }
        //     case "X Days": {
        //         withinDays = this.getOptionValue("Where X is");
        //         break;
        //     }
        // }
        var daysAre = this.getOptionValue("Days are");
        var withinStrategy = daysAre == "Traded Days" ? 'TRADING_DAYS' : 'ACTUAL_DAYS';
        var presentOrders = this.stateMachine.getNodeOrders(this.id);
        if (!presentOrders) {
            presentOrders = [];
        }
        var relevantOrders = [];
        if (withinStrategy == "ACTUAL_DAYS") {
            relevantOrders = presentOrders.filter(function (order) {
                var daysElapsedSinceOrder = (currentDate.getTime() - order.date.getTime()) / (1000 * 24 * 3600);
                console.log("days elapsed = ", daysElapsedSinceOrder, " within days = ", withinDays);
                return !(daysElapsedSinceOrder > withinDays);
            });
        }
        if (withinStrategy == "TRADING_DAYS") {
            relevantOrders = presentOrders.filter(function (order) {
                var daysElapsedSinceOrder = currentDateIndex - order.dateIndex;
                return !(daysElapsedSinceOrder > withinDays);
            });
        }
        if (relevantOrders.length >= numTimes) {
            this.log(LogType.message, "Order already completed", "Not placing an order as the order has already been placed " + relevantOrders.length + " times against the set limit of " + numTimes + " times.");
            //nothing to be done now
            return;
        }
        // we are here means that an order has to be placed
        // let's prepare the object for the order
        var orderObj = {
            "buyOrSell": type,
            "date": currentDate,
            "dateIndex": currentDateIndex,
            "nodeId": this.id,
            "amount": amount,
            "price": data.price
        };
        if (amount < minAmt) {
            //  console.log("amt < minamt")
            this.log(LogType.warning, "Amount below Min $ Amount", "Not placing an order as the amount (".concat(amount, ") is below the Min $ Amount for orders (").concat(minAmt, "). The Min $ Amount can be configured by clicking on the settings icon in this node."));
            return;
        }
        var todaysOrders = presentOrders.filter(function (order) { return order.date.getTime() == currentDate.getTime(); });
        var opposingOrder = todaysOrders.find(function (order) { return order.buyOrSell != type; });
        if (opposingOrder) {
            this.log(LogType.warning, "Already placed an order in the opposite direction at this date", "Placing an order of ".concat(type, " type, however a ").concat(opposingOrder.buyOrSell, " order has already been placed in the same day."));
        }
        //console.error(data);
        var verbose = data.metadata.ticker + " - NetWorth: $" + data.netWorth.toLocaleString("en-US") + " - Prior Cash: $" + data.cash.toLocaleString("en-US") + " - Prior Holdings: $" + data.invested + " - Loan: $" + data.loanData.amt + " - Exact Trade Val: $" + orderObj.amount.toLocaleString("en-US");
        this.log(LogType.alert, " &nbsp;<b>".concat(orderObj.buyOrSell == 'BUY' ? "<span class='buy'>Buy</span>" : "<span class='sell'>Sell</span>", "</b> @ <i>$").concat(orderObj.price.toLocaleString("en-US"), "</i> for <b>$").concat(this.nFormat(orderObj.amount), "</b>"), verbose);
        this.stateMachine.placeMarketOrder(orderObj);
    };
    TradeNode.prototype.nFormat = function (num, digits) {
        if (digits === void 0) { digits = 2; }
        var lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "B" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function (item) {
            return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    };
    TradeNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    TradeNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    TradeNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    TradeNode.prototype.addInputInterface = function (name) {
        return _super.prototype.addInputInterface.call(this, name);
    };
    return TradeNode;
}(BaseNode));
export { TradeNode };
//# sourceMappingURL=tradeNode.js.map