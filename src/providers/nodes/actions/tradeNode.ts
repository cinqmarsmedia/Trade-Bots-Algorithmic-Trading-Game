import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType, MarketOrder, MarketOrderPayload } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData, InterfaceToggles, WithinStrategy } from "../types";

type OptionName = "Log Message + Data" | "Type" | "warning" | "% Invested" | "Where N is" | "Times" | "Within" | "% Invested" | "% Cash" | "Where X is" | "Days Are" | "Min $ Amt" | "Value Type" | "Value Type " | "Mode"
type InputName = "Trigger" | "Value";

type InterfaceName = OptionName | InputName;

type TypeOption = "BUY" | "SELL" | "SHORT" | "COVER";
type TimesOption = "Unlimited" | "N Times" | "Every 7 Days" | "Every N Days" | "Once"
type WithinOption = "1 day" | "7 days" | "30 days" | "X Days" | "No time limit"


export class TradeNode extends BaseNode {
    type: string = "TradeNode";
    name: string = "Market Trade";
    public interfaceToggles: InterfaceToggles = { "Value": false }

    constructor() {
        super();
        this.addInputInterface("Trigger")
        this.addInputInterface("Value")


        this.addOption("Type", "SelectOption", "Buy", undefined, { items: ["Buy", "Sell", "Short", "Cover"], hideWhen: { "Buy": ["warning", "% Invested", "Value Type"], "Sell": ["warning", "% Cash", "Value Type "], "Short": ["% Invested", "Value Type"], "Cover": ["warning", "% Cash", "Value Type "] } })
        this.addOption("Times", "SelectOption", "Unlimited", undefined, { items: ["Unlimited", "Every 7 Days", "Every N Days", "Once", "N Times"], hideWhen: { "Unlimited": ["Where N is"], "Every 7 Days": ["Where N is"], "Once": ["Where N is"] } })
        this.addOption("Where N is", "IntegerOption", 10, undefined, { min: 1, max: 999 })
        //this.addOption("Within", "SelectOption", "No time limit", undefined, { items: ["1 day", "7 days", "30 days", "X days", "No time limit"], hideWhen: { "1 day": ["Where X is"], "7 days": ["Where X is"], "30 days": ["Where X is"], "No time limit": ["Where X is"] } })
        //this.addOption("Where X is", "IntegerOption", 90, undefined, { min: 1, max: 100 })
        this.addOption("warning", "TextOption", "Long investments will auto-sell")
        this.addOption("Value Type", "SelectOption", "% Invested", undefined, { items: ["% Invested", "$ Amount"] })
        this.addOption("Value Type ", "SelectOption", "% Cash", undefined, { items: ["% Cash", "$ Amount"] })
        this.addOption("% Invested", "IntegerOption", 50, undefined, { min: 1, max: 100 })
        this.addOption("% Cash", "IntegerOption", 50, undefined, { min: 1, max: 100 })

               this.addOption("Mode", "SelectOption", "Simple", undefined, { items: ["Simple", "Variable"], isSetting: true, hideWhen: { "Simple": ["Value Type", "Value Type "], "Variable": ["% Invested", "% Cash"] } })

        this.addOption("Days Are", "SelectOption", "Traded Days", undefined, { isSetting: true, items: ["Actual Days", "Traded Days"] })

        this.addOption("Min $ Amt", "NumberOption", 1, undefined, { min: 1, max: 1000, isSetting: true })

        this.addOption("Log Message + Data", "InputOption")
 

        this.events.update.addListener(this, event => {
            if (event && event.name && event.name == 'Mode') {
                if (event.option && event.option.value) {
                    if (event.option.value == "Variable") {
                        this.interfaceToggles["Value"] = true;
                    }
                    if (event.option.value == "Simple") {
                        this.interfaceToggles["Value"] = false;
                    }
                }
            }
        });
    }

    //HOT
    nodeCalculate(data: EngineData) {
        // let t0 = performance.now();
        let x: any = this._nodeCalculate(data);
        //console.log(`tradeNode took ${performance.now() - t0} milliseconds.`);
        return x;
    }

    //HOT
    _nodeCalculate(data: EngineData) {
        let t0 = performance.now();
        super.nodeCalculate(data);

        //the first condition for a market order to be placed is that the trigger for the order should be true:
        let trigger = this.getInterface("Trigger").value;
        let minAmt: number = this.getOptionValue("Min $ Amt");

        if (typeof trigger !== "boolean") {
            this.log(LogType.error, "Invalid trigger to node - trigger is not a boolean", "This node only accepts a boolean trigger (having a value of true or false). The type of input passed to this node is not acceptable.")
            return;
        }

        if (typeof trigger === "undefined") {
            this.log(LogType.error, "Missing trigger", "This node will only function with a boolean trigger as an input. Missing input.")
            return;
        }

        if (!trigger) {
            return;
        }

        let currentDate = data.currentData[data.dateKeyIndex].date;
        currentDate.setHours(0, 0, 0, 0);
        let currentDateIndex = data.dateKeyIndex;

        let percentage: number, amount: number;
        let type: TypeOption = (this.getOptionValue("Type") as string).toUpperCase() as TypeOption;
        //console.log(`tradeNode part1 took ${performance.now() - t0} milliseconds.`);

        if (type == "BUY" || type == "SHORT") {
            if (this.getOptionValue("Mode") == "Simple") {
                percentage = this.getOptionValue("% Cash");
                const amountBeforeFees = percentage / 100 * data.cash;
                amount = amountBeforeFees / (1 + this.stateMachine.fee);
                if (amount == 0) {
                    this.log(LogType.warning, "Not placing order because of insufficient cash", "The cash left is zero. Order will therefore not be placed.")
                    return;
                }
            }
            if (this.getOptionValue("Mode") == "Variable") {
                if (this.getOptionValue("Value Type ") == "% Cash") {
                    percentage = this.getInterface("Value").value;
                    if (percentage > 100) {
                        percentage = 100;
                        this.log(LogType.warning, "Percentage specified is greater than 100", "The percentage specified was greater than 100%. Defaulting to 100%.");
                    }
                    if (percentage <= 0) {
                        this.log(LogType.warning, "Not placing order because percentage <= 0", "The percentage provided is less than or equal to zero. Order will therefore not be placed.")
                        return;
                    }
                    const amountBeforeFees = percentage / 100 * data.cash;
                    amount = amountBeforeFees / (1 + this.stateMachine.fee);
                    if (amount == 0) {
                        this.log(LogType.warning, "Not placing order because of insufficient cash", "The cash left is zero. Order will therefore not be placed.")
                        return;
                    }
                }
                if (this.getOptionValue("Value Type ") == "$ Amount") {
                    amount = this.getInterface("Value").value;
                    if (amount > data.cash) {
                        amount = data.cash;
                        this.log(LogType.warning, "Amount specified is more than cash available", "The amount specified was more than the cash available. The order will be placed using 100% of the available cash.")
                    }
                    if (amount <= 0) {
                        this.log(LogType.warning, "Not placing order as amount <= 0", "The amount specified is less than or equal to 0. Order will therefore not be placed.")
                        return;
                    }
                }
            }
        }
        if (type == "COVER" || type == "SELL") {
            if (this.getOptionValue("Mode") == "Simple") {
                percentage = this.getOptionValue("% Invested");
                amount = percentage / 100 * data.invested;
                if (amount == 0) {
                    this.log(LogType.warning, "Not placing order because of insufficient amount invested", "The amount currently invested is zero. Order will therefore not be placed.")
                    return;
                }
            }
            if (this.getOptionValue("Mode") == "Variable") {
                if (this.getOptionValue("Value Type") == "% Invested") {
                    percentage = this.getInterface("Value").value;
                    if (percentage > 100) {
                        percentage = 100;
                        this.log(LogType.warning, "Percentage specified is greater than 100", "The percentage specified was greater than 100%. Defaulting to 100%.");
                    }
                    if (percentage <= 0) {
                        this.log(LogType.warning, "Not placing order because percentage <= 0", "The percentage provided is less than or equal to zero. Order will therefore not be placed.")
                        return;
                    }
                    amount = percentage / 100 * data.invested;
                    if (amount == 0) {
                        this.log(LogType.warning, "Not placing order because of insufficient cash", "The cash left is zero. Order will therefore not be placed.")
                        return;
                    }
                }
                if (this.getOptionValue("Value Type") == "$ Amount") {
                    amount = this.getInterface("Value").value;
                    if (amount > data.invested) {
                        amount = data.invested;
                        this.log(LogType.warning, "Amount specified is more than amount invested", "The amount specified was more than the amount invested. The order will be placed using 100% of the invested amount.")
                    }
                    if (amount <= 0) {
                        this.log(LogType.warning, "Not placing order as amount <= 0", "The amount specified is less than or equal to 0. Order will therefore not be placed.")
                        return;
                    }
                }
            }
        }



        let times: TimesOption = this.getOptionValue("Times");
        let withinDays: number;
        let numTimes: number;
        switch (times) {
            case "Unlimited": {
                numTimes = 999999;
                withinDays = 999999;
                break;
            }
            case "Every 7 Days": {
                numTimes = 1;
                withinDays = 7;
                break;
            }
            case "Once": {
                numTimes = 1;
                withinDays = 999999;
                break;
            }
            case "Every N Days": {
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
        let daysAre = this.getOptionValue("Days Are");
        let withinStrategy: WithinStrategy = daysAre == "Traded Days" ? 'TRADING_DAYS' : 'ACTUAL_DAYS';
        let presentOrders: MarketOrder[] = this.stateMachine.getNodeOrders(this.id);
        if (!presentOrders) {
            presentOrders = [];
        }
        let relevantOrders: MarketOrder[] = [];
        if (withinStrategy == "ACTUAL_DAYS") {
            relevantOrders = presentOrders.filter(order => {
                let daysElapsedSinceOrder = (currentDate.getTime() - order.date.getTime()) / (1000 * 24 * 3600)
                return (daysElapsedSinceOrder > 0) && !(daysElapsedSinceOrder > withinDays)
            })
        }
        if (withinStrategy == "TRADING_DAYS") {
            relevantOrders = presentOrders.filter(order => {
                let daysElapsedSinceOrder = currentDateIndex - order.dateIndex;
                return (daysElapsedSinceOrder > 0) && !(daysElapsedSinceOrder > withinDays)
            })
        }
//withinDays
        if (relevantOrders.length >= numTimes) {
var title="Within "+withinDays+" Days: Ignoring"
var mesg="Not placing trade as an order has already been placed within the specified " + withinDays + " day interval.";

if (numTimes>1 || withinDays>999){
mesg="Not placing trade as an the specified limit of "+numTimes+" times has been satisfied.";
title="Executed "+numTimes+"Already: Ignoring"
}
//numTimes

            this.log(LogType.warning, title, mesg)
            //nothing to be done now
            return;
        }
        //console.log(`tradeNode part2 took ${performance.now() - t0} milliseconds.`);


        // we are here means that an order has to be placed
        // let's prepare the object for the order
        let orderObj: MarketOrderPayload = {
            "buyOrSell": type,
            "date": currentDate,
            "dateIndex": currentDateIndex,
            "nodeId": this.id,
            "amount": amount,
            "price": data.price,
            "cash": data.cash,
            "invested": data.invested,
            "netWorth": this.data.netWorth,
            "loanData": this.data.loanData
        };
        if (amount < minAmt) {
            //  console.log("amt < minamt")
            this.log(LogType.warning, "Amount below Min $ Amount", `Not placing an order as the amount (${amount}) is below the Min $ Amount for orders (${minAmt}). The Min $ Amount can be configured by clicking on the settings icon in this node.`)
            return;
        }
//        console.log(`tradeNode part3 took ${performance.now() - t0} milliseconds.`);

        //todaysOrders = presentOrders.filter(order => order.date.getTime() == currentDate.getTime());
        let todaysOrders: MarketOrder[] = [];
        for (let i = 0; i < presentOrders.length; i++) {
            if (presentOrders[i].dateIndex == currentDateIndex) {
                todaysOrders.push(presentOrders[i]);
            }
        }

        //        console.log(`tradeNode part31 took ${performance.now() - t0} milliseconds.`);
        //let opposingOrder: MarketOrder = todaysOrders.find(order => order.buyOrSell != type);
        let opposingOrder: MarketOrder;
        for (let i = 0; i < todaysOrders.length; i++) {
            if (todaysOrders[i].buyOrSell != type) {
                opposingOrder = todaysOrders[i];
                break;
            }
        }
//        console.log(`tradeNode part32 took ${performance.now() - t0} milliseconds.`);

        if (opposingOrder) {
            this.log(LogType.warning, "Already placed an order in the opposite direction at this date", `Placing an order of ${type} type, however a ${opposingOrder.buyOrSell} order has already been placed in the same day.`)
        }
//        console.log(`tradeNode part33 took ${performance.now() - t0} milliseconds.`);

        if (this.stateMachine.placeMarketOrder(orderObj, data.trade) === false) {
            return;
        }

        var verbose = "<b>"+data.metadata.ticker + "</b> - NetWorth: <b>$" + this.nFormat(data.netWorth) + "</b> - Prior Cash: <b>$" + this.nFormat(data.cash) + "</b> <br>Prior Holdings: <b>$" + this.nFormat(data.invested) + "</b> - Loan: <b>$" + this.nFormat(data.loanData.amt) + "</b> <br>Exact Trade Val: <b>$" + (Math.floor(orderObj.amount*100)/100).toLocaleString()+"</b>"
        //        console.log(`tradeNode part4 took ${performance.now() - t0} milliseconds.`);
        this.log(LogType.alert, ` &nbsp;<b>${(orderObj.buyOrSell == 'BUY' || orderObj.buyOrSell == 'COVER') ? ("<span class='buy'>"+(orderObj.buyOrSell == 'BUY'?"Buy":"Cover")+"</span>") : "<span class='sell'>"+(orderObj.buyOrSell == 'SELL'?"Sell":"Short")+"</span>"}</b> @ <i>$${(Math.floor(orderObj.price*100)/100).toLocaleString()}</i> for <b>$${this.nFormat(orderObj.amount)}</b>`, verbose)
//        console.log(`tradeNode part5 took ${performance.now() - t0} milliseconds.`);

//        console.log(`tradeNode part6 took ${performance.now() - t0} milliseconds.`);


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


    nFormat(num, digits: any = 2) {
        const lookup = [
            {
                "value": 1000000000000000000,
                "symbol": "E"
            },
            {
                "value": 1000000000000000,
                "symbol": "P"
            },
            {
                "value": 1000000000000,
                "symbol": "T"
            },
            {
                "value": 1000000000,
                "symbol": "B"
            },
            {
                "value": 1000000,
                "symbol": "M"
            },
            {
                "value": 1000,
                "symbol": "k"
            },
            {
                "value": 1,
                "symbol": ""
            }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let item: typeof lookup[number];
        for (let i = 0; i < lookup.length; i++) {
            if (num >= lookup[i].value) {
                item = lookup[i];
                break;
            }
        }
        // item = lookup.find(function (item) {
        //     return num >= item.value;
        // });

        if (num<1000){
            return (Math.floor(num*100)/100).toFixed(2)
        }else{
 return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
        }
       
    }

}
