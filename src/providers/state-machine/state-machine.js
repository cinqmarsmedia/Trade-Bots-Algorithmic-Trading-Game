var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";
import { DefaultBotName } from "../../constants";
import * as throttle from 'lodash.throttle';
import * as isEqual from 'lodash.isequal';
import * as cloneDeep from 'lodash.clonedeep';
import { Storage } from "@ionic/storage";
export var LogType;
(function (LogType) {
    LogType[LogType["message"] = 0] = "message";
    LogType[LogType["warning"] = 1] = "warning";
    LogType[LogType["error"] = 2] = "error";
    LogType[LogType["alert"] = 3] = "alert";
})(LogType || (LogType = {}));
var SMID = "StateMachine";
var defaultState = { tradeHistory: {}, variables: {}, logs: {}, logSwitches: {} };
var StateMachine = /** @class */ (function () {
    function StateMachine(events, storage) {
        this.events = events;
        this.storage = storage;
        this.state = defaultState;
        this.activeBotName = DefaultBotName;
        this.subscriptions = {};
        this.traces = {};
        this.persistStateThrottled = throttle(this.persistState, 500); //logs are persisted min 500ms apart
        this.baklavaInited = false;
        this.readState();
    }
    StateMachine.prototype.readState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.storage.get(SMID)];
                    case 1:
                        _a.state = _b.sent();
                        if (!this.state) {
                            this.state = defaultState;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StateMachine.prototype.persistState = function () {
        this.storage.set(SMID, this.state);
        //localStorage.setItem(SMID, JSON.stringify(this.state))
    };
    StateMachine.prototype.getState = function () {
        return this.state;
    };
    StateMachine.prototype.reset = function () {
        this.state = defaultState;
        this.persistState();
    };
    StateMachine.prototype.placeMarketOrder = function (order) {
        var nodeId = order.nodeId, amount = order.amount, price = order.price, date = order.date, dateIndex = order.dateIndex, buyOrSell = order.buyOrSell;
        var buyvssell, longvsshort;
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
                buyvssell = false;
                longvsshort = false;
                break;
            }
            case "SHORT": {
                buyvssell = true;
                longvsshort = false;
                break;
            }
        }
        //place the order
        var tradeObj = {
            bot: true,
            amt: amount,
            price: price,
            buyvssell: buyvssell,
            longvsshort: longvsshort
        };
        this.events.publish("trade", tradeObj);
        var state = this.state;
        if (!state.tradeHistory[nodeId]) {
            state.tradeHistory[nodeId] = [];
        }
        ;
        state.tradeHistory[nodeId] = state.tradeHistory[nodeId].concat({
            buyOrSell: buyOrSell,
            amount: amount,
            date: date,
            dateIndex: dateIndex,
            type: "MARKET"
        });
        this.persistStateThrottled();
    };
    StateMachine.prototype.getNodeOrders = function (nodeId) {
        return this.state.tradeHistory[nodeId];
    };
    StateMachine.prototype.setVariable = function (name, value) {
        if (!this.state.variables[this.activeBotName]) {
            this.state.variables[this.activeBotName] = {};
        }
        if (!isEqual(this.state.variables[this.activeBotName][name], value)) {
            this.state.variables[this.activeBotName][name] = value;
            this.persistStateThrottled();
            if (this.subscriptions[name]) {
                this.subscriptions[name].forEach(function (fn) { return fn(value); });
            }
        }
        // console.log("SET ", name)
        // console.log(this.state.variables[this.activeBotName][name])
    };
    StateMachine.prototype.getVariable = function (name) {
        if (!this.state.variables[this.activeBotName]) {
            //console.warn("bot variables not initailised")
            return;
        }
        // console.log("GET ", name)
        // console.log(this.state.variables[this.activeBotName][name])
        return cloneDeep(this.state.variables[this.activeBotName][name]);
    };
    StateMachine.prototype.writeLog = function (type, message, detail, dateKeyIndex, nodeID, cash, invested, netWorth, date, loanData) {
        if (detail === void 0) { detail = message; }
        return __awaiter(this, void 0, void 0, function () {
            var logObj;
            return __generator(this, function (_a) {
                logObj = { type: type, message: message, detail: detail, dateKeyIndex: dateKeyIndex, nodeID: nodeID, cash: cash, invested: invested, netWorth: netWorth, date: date, loanData: loanData, fee: this.fee, timestamp: (new Date()).getTime(), botName: this.activeBotName };
                if (!this.state.logs[this.activeBotName]) {
                    this.state.logs[this.activeBotName] = [];
                }
                this.state.logs[this.activeBotName].push(logObj);
                this.persistStateThrottled();
                this.events.publish("newLog", logObj);
                this.events.publish("newLogBaklava", logObj);
                return [2 /*return*/];
            });
        });
    };
    StateMachine.prototype.clearLogs = function (botName) {
        if (botName === void 0) { botName = this.activeBotName; }
        this.state.logs[botName] = [];
        this.persistState();
        this.events.publish("clearLogs");
    };
    StateMachine.prototype.getLogs = function (botName) {
        if (botName === void 0) { botName = this.activeBotName; }
        return this.state.logs[botName];
    };
    StateMachine.prototype.startLogging = function (nodeId) {
        if (this.state.logSwitches[nodeId] === true) {
            return;
        }
        this.state.logSwitches[nodeId] = true;
        this.persistState();
    };
    StateMachine.prototype.stopLogging = function (nodeId) {
        if (this.state.logSwitches[nodeId] === false) {
            return;
        }
        this.state.logSwitches[nodeId] = false;
        this.persistState();
    };
    StateMachine.prototype.toggleLogging = function (nodeId) {
        if (this.state.logSwitches[nodeId]) {
            this.state.logSwitches[nodeId] = false;
        }
        else {
            this.state.logSwitches[nodeId] = true;
        }
        this.persistStateThrottled();
    };
    StateMachine.prototype.shouldLog = function (nodeId) {
        if (this.state.logSwitches[nodeId]) {
            return this.state.logSwitches[nodeId];
        }
        else {
            this.stopLogging(nodeId);
            return false;
        }
    };
    //this is called by home.ts
    StateMachine.prototype.setActiveBotName = function (name) {
        this.activeBotName = name;
    };
    StateMachine.prototype.setFee = function (fee) {
        this.fee = fee;
    };
    StateMachine.prototype.subscribe = function (name, callback) {
        if (!this.subscriptions[name]) {
            this.subscriptions[name] = [];
        }
        this.subscriptions[name].push(callback);
    };
    StateMachine.prototype.unsubscribe = function (name, callback) {
        if (!this.subscriptions[name]) {
            return;
        }
        if (!callback) {
            delete this.subscriptions[name];
            return;
        }
        this.subscriptions[name] = this.subscriptions[name].filter(function (fn) { return fn != callback; });
    };
    StateMachine.prototype.registerHomePage = function (ref) {
        this.homePage = ref;
    };
    Object.defineProperty(StateMachine.prototype, "advancedBots", {
        get: function () {
            return Object.keys(this.homePage.advancedBots);
        },
        enumerable: false,
        configurable: true
    });
    StateMachine.prototype.switchBot = function (botName) {
        if (this.advancedBots.indexOf(botName) < 0) {
            return;
        }
        this.homePage.switchBot(botName);
    };
    StateMachine.prototype.saveTrace = function (data) {
        var _this = this;
        var dateKeyIndex = data.dateKeyIndex;
        return new Promise(function (res) {
            _this.events.subscribe("trace", function (trace) {
                _this.events.unsubscribe("trace");
                _this.traces[dateKeyIndex] = trace;
                res();
            });
            _this.events.publish("requestTrace");
        });
    };
    StateMachine.prototype.showTrace = function (log) {
        var dateKeyIndex = log.dateKeyIndex, botName = log.botName, timestamp = log.timestamp, date = log.date, nodeID = log.nodeID;
        var trace = this.traces[dateKeyIndex];
        var traceInfo = {
            botName: botName,
            timestamp: timestamp,
            date: date,
            dateKeyIndex: dateKeyIndex,
            nodeID: nodeID
        };
        this.events.publish("showTrace", trace, traceInfo);
    };
    StateMachine = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Events, Storage])
    ], StateMachine);
    return StateMachine;
}());
export { StateMachine };
//# sourceMappingURL=state-machine.js.map