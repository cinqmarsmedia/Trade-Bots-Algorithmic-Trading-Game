import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";
import { DefaultBotName } from "../../constants";
import * as throttle from 'lodash.throttle';
import * as isEqual from 'lodash.isequal';
import * as cloneDeep from 'lodash.clonedeep';
import { Storage } from "@ionic/storage";
import { EngineData } from "../nodes/types";
import { Simulator } from "../simulator/simulator";


export type BuyOrSell = "BUY" | "SELL" | "SHORT" | "COVER"
export type TradeType = "MARKET" | "LIMIT"
export type MarketOrder = {
  buyOrSell: BuyOrSell,
  amount: number,
  date: Date,
  dateIndex: number,
  type: TradeType
}
export type State = {
  tradeHistory: {
    [nodeId: string]: MarketOrder[]
  },
  variables: {
    [botName: string]: { [varName: string]: number | boolean }
  },
  logs: {
    [botName: string]: LogObj[]
  },
  logSwitches: {
    [nodeId: string]: boolean
  }
}
export enum LogType {
  message,
  warning,
  error,
  alert
}

export type TraceInfo = {
  date: Date,
  dateKeyIndex: number,
  botName: string,
  timestamp: number,
  nodeID: string
}

export type LogObj = {
  type: LogType,
  message: string,
  detail?: string,
  timestamp: number,
  dateKeyIndex: number,
  botName: string,
  nodeID: string,
  cash: number,
  invested: number,
  netWorth: number,
  fee: number,
  date: Date,
  loanData: { [key: string]: any }
}

const SMID = "StateMachine"

export type StateMachineAction = "SET_VARIABLE" | "MARKET_ORDER"
export type MarketOrderPayload = {
  nodeId: string,
  buyOrSell: BuyOrSell,
  amount: number,
  price: number,
  date: Date,
  dateIndex: number,
  cash: number,
  invested: number,
  netWorth: number,
  loanData: EngineData["loanData"]
}

export type LogItem = {
  type: LogType,
  message: string,
  detail: string,
  dateKeyIndex: number,
  nodeID: string,
  cash: number,
  invested: number,
  netWorth: number,
  date: Date,
  loanData: EngineData["loanData"]
}

const defaultState: State = { tradeHistory: {}, variables: {}, logs: {}, logSwitches: {} }
type StateMachinePayload = MarketOrderPayload

@Injectable()
export class StateMachine {
  state: State = defaultState;
  activeBotName: string = DefaultBotName
  fee: number;
  subscriptions: { [name: string]: ((val: any) => void)[] } = {};
  homePage: any;
  traces: { [dateKeyIndex: number]: any } = {};
  pendingLogItems: LogItem[] = [];
  public simulating: boolean;

  public pauseFlag: boolean = false;
  public paused: boolean = false;


  constructor(private events: Events, private storage: Storage) {
    this.readState();
  }

  private async readState() {
    this.state = await this.storage.get(SMID)
    if (!this.state) {
      this.state = defaultState
    }
    // let stateStr = localStorage.getItem(SMID);
    // let state;
    // if (stateStr) {
    //   state = JSON.parse(stateStr);
    // }
    // function boolify(state) {
    //   if (typeof state === "object") {
    //     for (const key in state) {
    //       state[key] = boolify(state[key]);
    //     }
    //     return state
    //   }
    //   if (state === 'true') {
    //     return true
    //   }
    //   if (state === 'false') {
    //     return false
    //   }
    //   return state;
    // }
    // this.state = boolify(state);
  }

  public persistState(): Promise<any> {
    return this.storage.set(SMID, this.state);
    //localStorage.setItem(SMID, JSON.stringify(this.state))
  }

  private persistStateThrottled = throttle(() => {
    if (!this.simulating) {
      this.storage.set(SMID, this.state);
    }
  }, 500); //logs are persisted min 500ms apart

  public getState(): State {
    return this.state
  }

  public reset() {
    this.state = defaultState;
    this.persistState();
  }

  public resetTrades() {
    this.state.tradeHistory = {};
    this.persistState();
  }

  public placeMarketOrder(order: MarketOrderPayload, tradeCallback: Function): boolean | void {
    const { nodeId, amount, price, date, dateIndex, buyOrSell, cash, invested, netWorth, loanData } = order;
    let buyvssell: boolean, longvsshort: boolean
    switch (buyOrSell) {
      case "BUY": {
        buyvssell = true;
        longvsshort = true;
        break;
      }
      case "SELL": {
        buyvssell = false;
        longvsshort = true;
        break;
      }
      case "COVER": {
        buyvssell = true;
        longvsshort = false;
        break;
      }
      case "SHORT": {
        buyvssell = false;
        longvsshort = false;
        break;
      }
    }
    //place the order
    let tradeObj = {
      bot: true,
      amt: amount,
      price,
      buyvssell,
      longvsshort
    }

    const ret: string = tradeCallback.apply(null, [tradeObj]);
    if (ret) {
      this.writeLog({
        type: LogType.error,
        message: ret,
        detail: ret,
        dateKeyIndex: dateIndex,
        nodeID: nodeId,
        cash,
        invested,
        netWorth,
        date,
        loanData
      });
      return false;
    }

    // this.events.publish("trade", tradeObj);

    const state = this.state;
    if (!state.tradeHistory[nodeId]) {
      state.tradeHistory[nodeId] = []
    };
    state.tradeHistory[nodeId] = state.tradeHistory[nodeId].concat({
      buyOrSell, amount, date, dateIndex, type: "MARKET"
    });
    if (!this.simulating) {
      this.persistStateThrottled();
    }
  }

  public getNodeOrders(nodeId: string) {
    return this.state.tradeHistory[nodeId];
  }

  public setVariable(name: string, value: any) {
    if (!this.state.variables[this.activeBotName]) {
      this.state.variables[this.activeBotName] = {};
    }
    if (!isEqual(this.state.variables[this.activeBotName][name], value)) {
      this.state.variables[this.activeBotName][name] = value;
      this.persistStateThrottled();
      if (this.subscriptions[name]) {
        this.subscriptions[name].forEach(fn => fn(value))
      }
    }
    // console.log("SET ", name)
    // console.log(this.state.variables[this.activeBotName][name])
  }

  public getVariable(name: string): any {
    if (!this.state.variables[this.activeBotName]) {
      //console.warn("bot variables not initailised")
      return;
    }
    // console.log("GET ", name)
    // console.log(this.state.variables[this.activeBotName][name])
    return cloneDeep(this.state.variables[this.activeBotName][name]);
  }

  public writePendingLogs() {
    let logItem: LogItem;
    while (logItem = this.pendingLogItems.shift()) {
      this._writeLog(logItem);
    }
  }

  public writeLog(logItem: LogItem) {
    if (this.simulating) {
      this.pendingLogItems.push(logItem);
      return;
    }
    this._writeLog(logItem);
  }
  private _writeLog(logItem: LogItem) {
    const logObj: LogObj = { type: logItem.type, message: logItem.message, detail: logItem.detail, dateKeyIndex: logItem.dateKeyIndex, nodeID: logItem.nodeID, cash: logItem.cash, invested: logItem.invested, netWorth: logItem.netWorth, date: logItem.date, loanData: logItem.loanData, fee: this.fee, timestamp: (new Date()).getTime(), botName: this.activeBotName }
    if (!this.state.logs[this.activeBotName]) {
      this.state.logs[this.activeBotName] = [];
    }
    this.state.logs[this.activeBotName].push(logObj);
    if (!this.simulating) {
      this.persistStateThrottled();
    }
    this.events.publish("newLog", logObj);
    this.events.publish("newLogBaklava", logObj);
  }

  public clearLogs(botName: string = this.activeBotName): void {
    this.state.logs[botName] = [];
    this.persistState();
    this.events.publish("clearLogs");
  }
  public getLogs(botName: string = this.activeBotName): LogObj[] {
    return this.state.logs[botName];
  }

  public startLogging(nodeId: string) {
    if (this.state.logSwitches[nodeId] === true) {
      return;
    }
    this.state.logSwitches[nodeId] = true;
    this.persistState();
  }

  public stopLogging(nodeId: string) {
    if (this.state.logSwitches[nodeId] === false) {
      return;
    }
    this.state.logSwitches[nodeId] = false;
    this.persistState();
  }

  public toggleLogging(nodeId: string) {
    if (this.state.logSwitches[nodeId]) {
      this.state.logSwitches[nodeId] = false;
    } else {
      this.state.logSwitches[nodeId] = true;
    }
    this.persistStateThrottled();
  }

  public shouldLog(nodeId: string) {
    if (this.state.logSwitches[nodeId]) {
      return this.state.logSwitches[nodeId]
    } else {
      this.stopLogging(nodeId);
      return false;
    }
  }

  //this is called by home.ts
  public setActiveBotName(name: string) {
    this.activeBotName = name;
  }

  public setFee(fee: number) {
    this.fee = fee;
  }

  public subscribe(name: string, callback: (val: any) => void) {
    if (!this.subscriptions[name]) {
      this.subscriptions[name] = [];
    }
    this.subscriptions[name].push(callback);
  }
  public unsubscribe(name: string, callback?: (val: any) => void) {
    if (!this.subscriptions[name]) {
      return;
    }
    if (!callback) {
      delete this.subscriptions[name];
      return
    }
    this.subscriptions[name] = this.subscriptions[name].filter(fn => fn != callback);
  }

  public registerHomePage(ref: any) {
    this.homePage = ref;
  }

  get advancedBots(): string[] {
    return Object.keys(this.homePage.advancedBots);
  }

  public switchBot(botName: string) {
    if (this.advancedBots.indexOf(botName) < 0) {
      return;
    }
    this.homePage.switchBot(botName);
  }

  public baklavaInited: boolean = false;

  public saveTrace(data: EngineData): Promise<void> {
    const { dateKeyIndex } = data;
    return new Promise((res) => {
      this.events.subscribe("trace", (trace: any) => {
        this.events.unsubscribe("trace");
        this.traces[dateKeyIndex] = trace;
        res();
      });
      this.events.publish("requestTrace");
    });
  }

  public showTrace(log: LogObj) {
    const { dateKeyIndex, botName, timestamp, date, nodeID } = log
    let trace = this.traces[dateKeyIndex];

    let traceInfo: TraceInfo = {
      botName, timestamp, date, dateKeyIndex, nodeID
    };
    this.events.publish("showTrace", trace, traceInfo);
  }

}