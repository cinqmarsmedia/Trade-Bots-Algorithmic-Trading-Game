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
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { BrowserControlProvider } from "../../providers/browser-control/browser-control";
import { ModalController, AlertController, NavController, } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";
import { Slides } from "ionic-angular";
import _ from "lodash";
import * as howler from "howler";
import * as fflate from 'fflate';
import * as throttle from 'lodash.throttle';
//import { LitegraphPage } from "../../pages/litegraph/litegraph";
import { BaklavaPage } from "../../pages/baklava/baklava";
//import ApexCharts from 'apexcharts'
import { mtDB, rawUpgrades, demoUpgrades, learning, mtScores, MTactiveTickers, marketMovement, mtStartIndex, etfDB, cryptoDB, etfScores, etfActiveTickers, cryptoScores, cryptoActiveTickers, 
//cryptoActive,
//etfActive,
//KGactiveTickers,
configDefault, emailDomainBlacklist, indicatorData, DefaultBotName, debugBot, DefaultSimpleBotName, DefaultTraceBotName } from "./../../constants";
import { ChartsProvider } from "../../providers/charts/charts";
import { extrasModal, logsModal, upgradesModal, learnModal, loanModal, statsModal, maModal, indicatorModal, simpleBotModal, customDataModal, idleModal, disclaimerModal, tutorialModal } from "../../pages/home/modals";
import * as tw from "trendyways";
import { processBot } from "./processBot";
import { scoreTabulation, quantifyScores, sliceBrokenData, testBrokenDates, genActive, genAverages, furtherNarrowSlice } from "./scoreTabulation";
import { StateMachine } from "../../providers/state-machine/state-machine";
import { BaklavaState } from "../../providers/baklava-state/baklavaState";
import { BaklavaProvider } from "../../providers/baklava/baklava";
var iziToast = window["iziToast"];
var techan = window["techan"];
//const regression=window["regression"];
var d3 = window["d3"];
//const slideshowLibrary = { "tutorial": [1, 5] }
var version = '0.8.7';
var marginUpgrade = "loanMax3_10";
var jumpToBaklava = false;
var features = ['crypto', 'etf', 'sandbox']; // 'crypto','full','intraday'
var startingLearn = { "basics": 10, "candlesticks": 10 };
var persist = true;
var debugMode = false;
var debugTools = true;
var debugSimpleBot = false;
var demoMode = false;
var startingRecords = 30;
var startingInterestRate = 14;
//const RecordsVisible = 300;
var fee = 0.03;
var marginCallPercent = .2;
var startMaxLoan = 100;
//const minXRecords = 14;
var startingCash = 0;
var verticalProportion = 1;
var warnings = { marginCallPop: false, marginCallPop2: false, marginCallWarn: false, tooltips: !debugMode, upgradePop: false, limit: false, fee: false, fiftyper: false, sellupgrade: false, limitTrigger: false, limitNavAway: false, simpleNavAway: false, advancedNavAway: false, upgradeConfirmRew: false, upgradeConfirmNoRew: false, restartRemind: false, autoContinue: false, notifications: true, performance: false, new: { neural: false, value: false, operation: false, action: false, deploy: false, brush: false, ovr: false, leading: false, ext: false, auto: false, pip: false, techanRadio: false } };
var opportunities = {
    'breakdown': { completed: false, reward: 15, name: 'Developer Breakdown', intro: 'Watch Developer Summarize Functionality', embed: 'GNbWApp3VYs', info: 'https://www.youtube.com/watch?v=GNbWApp3VYs' },
    'email': { completed: false, reward: 15, name: 'Newsletter', intro: 'Sign-Up for Our Newsletter' },
    'copy': { adNum: 3, completed: false, reward: 10, steam: 'steam://install/1489760', name: 'Copy Editor', intro: 'A Regular Expression Puzzle Game', embed: 'PzdjtkP3NWY', info: 'https://www.cinqmarsmedia.com/copyeditor/' },
    'devil': { adNum: 1, completed: false, reward: 10, steam: 'steam://install/1023820', name: "The Devil's Calculator", intro: 'A Math Puzzle Game Featured In The PAX10', embed: 'scJW6ufWTCg', info: 'https://www.cinqmarsmedia.com/devilscalculator/' },
    'chess': { adNum: 2, completed: false, reward: 10, steam: 'https://store.steampowered.com/app/1558020/Lazy_Chess/', name: 'Lazy Chess', intro: 'Innovative and Addictive New Chess Game', embed: 'oE38hXKWuzQ', info: 'https://www.cinqmarsmedia.com/lazychess/' },
    'synonymy': { adNum: 5, completed: false, reward: 10, steam: 'https://store.steampowered.com/app/342890/Synonymy/', name: 'Synonymy', intro: 'A Word Game Narrated By Richard Dawkins', embed: 'Y1cu0i-4gb8', info: 'https://www.cinqmarsmedia.com/synonymy/' },
    'chameleon': { adNum: 6, completed: false, reward: 10, steam: 'steam://install/834170', name: 'Chameleon Video Player', intro: 'A Free Utility That Displays Video Transparently', embed: 'vhTlnjp7fdU', info: 'https://www.cinqmarsmedia.com/chameleonvideoplayer/' },
    'anagraphs': { adNum: 4, completed: false, reward: 10, steam: 'steam://install/1654280', name: 'Anagraphs', intro: 'A Free New Word Game With A Twist', embed: 'MRJ4UACqBpo', info: 'https://www.cinqmarsmedia.com/anagraphs/' }
};
var milestones = { "pip": { amt: 1000, title: "YouTube PIP", txt: "You have now unlocked the ability to watch Learn & Earn videos while continuing the simulation. Beside the desired video, click the new icon to the right of the topic which will load the video in a movable pip box on the main screen.", unique: false }, "techanRadio": { amt: 50000, title: "Techan Radio", txt: "You have now unlocked the ability to listen to Technical Analysis Radio in game. Access through the new option in the menu.", unique: false }, "botPort1": { amt: 7000000, title: "Bot Export", txt: "You have now unlocked the ability to export bots. Consult the new menu in the node bots interface." }, "leaderboard": { amt: 50000000, title: "Leaderboards", txt: "You have now unlocked leadboards for your asset class.", unique: true } }; //"techanRadio":1000,"backtest":10000
var storageID = "tradebots";
var campaignReset = ['marginCallPercent', 'marginDays', 'marginWarning', 'simSpeed', 'manual', 'currentDate', 'obfuscatePrice', 'currentData', 'dateKeyIndex', 'portfolio', 'config', 'currPrice', 'currentTicker', 'loanData', 'indiData', 'indicatorColors', 'prePaperState', 'purchasedUpgrades', 'movingGain', 'obfuscateYear'];
var sharedPersist = ['fullscreenState', 'unlockModeState', 'advancedBots', 'simpleBot', 'finishedStocks', 'earnedLearnings', 'sandbox', 'opportunities', 'tutorialState', 'tutorialDB', 'lastSaveCampaign', 'muteSFX', 'demoState'];
var persistVars = ['unlockedMilestones', 'visibleExtraGraphs', 'movingAverages', 'longShortShow', 'fee', 'idleData', 'marginCallPercent', 'displayInfo', 'marginDays', 'statsData', 'marginWarning', 'movingGain', 'simSpeed', 'manual', 'currentDate', 'obfuscatePrice', 'unlockModeState', 'currentData', 'warnings', 'dateKeyIndex', 'portfolio', 'config', 'limitStops', 'advancedBots', 'simpleBot', 'currPrice', 'currentTicker', 'statsData', 'finishedStocks', 'loanData', 'indiData', 'indicatorColors', 'prePaperState', 'purchasedUpgrades', 'earnedLearnings', 'bakState'];
var paperPersist = ['marginCallPercent', 'dateKeyIndex', 'portfolio', 'currPrice', 'currentTicker', 'statsData', 'loanData'];
var uniquePersist = persistVars.filter(function (n) { return !sharedPersist.includes(n); });
var basicSimpleBot = { "data": { "nodes": [{ "type": "AdvValNode", "id": "node_166660955673617", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "Today"], ["Where N is", 1], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673618", "value": null }]], "position": { "x": 73, "y": 83 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "AdvValNode", "id": "node_166660955673619", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "N Day(s) Ago"], ["Where N is", 5], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673620", "value": null }]], "position": { "x": 73, "y": 193 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "ConditionalNode", "id": "node_166660955673621", "name": "If (Conditional)", "options": [["Conditional", "A>B"], ["B Multiplier", 1.02], ["Log Message + Data", null]], "state": {}, "interfaces": [["Input A", { "id": "ni_166660955673622", "value": null }], ["Input B", { "id": "ni_166660955673623", "value": null }], ["Then", { "id": "ni_166660955673624", "value": null }], ["Else", { "id": "ni_166660955673625", "value": null }]], "position": { "x": 310, "y": 138 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "TradeNode", "id": "node_166660955673630", "name": "Market Trade", "options": [["Type", "Buy"], ["Times", "Unlimited"], ["Where N is", 10], ["Within", "No time limit"], ["Where X is", 90], ["warning", "Long investments will auto-sell"], ["% Invested", 100], ["% Cash", 25], ["Days are", "Traded Days"], ["Min $ Amt", 1], ["Log Message + Data", null]], "state": {}, "interfaces": [["Trigger", { "id": "ni_166660955673631", "value": null }]], "position": { "x": 547, "y": 138 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "AdvValNode", "id": "node_166660955673634", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "N Day(s) Ago"], ["Where N is", 5], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673635", "value": null }]], "position": { "x": 73, "y": 303 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "AdvValNode", "id": "node_166660955673736", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "Today"], ["Where N is", 1], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673737", "value": null }]], "position": { "x": 73, "y": 413 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "ConditionalNode", "id": "node_166660955673738", "name": "If (Conditional)", "options": [["Conditional", "A>B"], ["B Multiplier", 1.02], ["Log Message + Data", null]], "state": {}, "interfaces": [["Input A", { "id": "ni_166660955673739", "value": null }], ["Input B", { "id": "ni_166660955673740", "value": null }], ["Then", { "id": "ni_166660955673741", "value": null }], ["Else", { "id": "ni_166660955673742", "value": null }]], "position": { "x": 310, "y": 358 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "TradeNode", "id": "node_166660955673747", "name": "Market Trade", "options": [["Type", "Sell"], ["Times", "Unlimited"], ["Where N is", 10], ["Within", "No time limit"], ["Where X is", 90], ["warning", "Long investments will auto-sell"], ["% Invested", 25], ["% Cash", 100], ["Days are", "Traded Days"], ["Min $ Amt", 1], ["Log Message + Data", null]], "state": {}, "interfaces": [["Trigger", { "id": "ni_166660955673748", "value": null }]], "position": { "x": 547, "y": 358 }, "width": 200, "twoColumn": false, "customClasses": "" }], "connections": [{ "id": "166660955673627", "from": "ni_166660955673618", "to": "ni_166660955673622" }, { "id": "166660955673629", "from": "ni_166660955673620", "to": "ni_166660955673623" }, { "id": "166660955673633", "from": "ni_166660955673624", "to": "ni_166660955673631" }, { "id": "166660955673744", "from": "ni_166660955673635", "to": "ni_166660955673739" }, { "id": "166660955673746", "from": "ni_166660955673737", "to": "ni_166660955673740" }, { "id": "166660955673750", "from": "ni_166660955673741", "to": "ni_166660955673748" }], "panning": { "x": 0, "y": 0 }, "scaling": 1 }, "gains": null, "logs": [], "mode": 1, "name": DefaultSimpleBotName, "sim": 0, "tutState": -1 };
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, modalCtrl, events, storage, chartsProvider, alertCtrl, browserControl, stateMachine, baklava, CDRef) {
        var _a;
        var _this = this;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.storage = storage;
        this.chartsProvider = chartsProvider;
        this.alertCtrl = alertCtrl;
        this.browserControl = browserControl;
        this.stateMachine = stateMachine;
        this.baklava = baklava;
        this.CDRef = CDRef;
        this.debug = debugMode;
        this.debugTools = debugMode || debugTools;
        this.tutorialState = [-1, null];
        this.tutorialDB = (_a = { 'intro': { prompt: 'Intro Tutorial Complete', start: 0, completed: false, unlocked: true, reward: 10 } }, _a[marginUpgrade] = { prompt: 'Margin Tutorial', start: 50, completed: false, unlocked: false, reward: 50 }, _a['limitstop'] = { prompt: 'Limit/Stop Order Tutorial Complete', start: 100, completed: false, unlocked: false, reward: 100 }, _a['longshort'] = { prompt: 'Shorting Tutorial Complete', start: 150, completed: false, unlocked: false, reward: 200 }, _a['simpleBots'] = { prompt: 'Simple Bots Tutorial Complete', start: 200, completed: false, unlocked: false, reward: 300 }, _a['simpleBots2'] = { prompt: 'Simple Bots Tutorial Complete', start: 250, completed: false, unlocked: false, reward: 300 }, _a['simpleBots3'] = { prompt: 'Simple Bots Tutorial Complete', start: 300, completed: false, unlocked: false, reward: 300 }, _a['vizBots'] = { prompt: 'Advanced Bots Tutorial Complete', start: 350, completed: false, unlocked: false, reward: 500 }, _a);
        this.initedBots = [];
        this.demo = demoMode || window.location.href.split('?')[1] == 'demo';
        this.demoPrompt = false;
        this.radio = false;
        this.marginWarningThreshold = .05;
        this.mode = "stock"; //crypto, sandbox
        this.version = version;
        this.opportunities = opportunities;
        this.extraAvail = 0;
        this.unlockModeState = { "stock": { worth: 0, progress: 0, tickerProgress: 0 } }; // {"intraday":{worth:,progress:},"crypto":{worth:,progress:}}
        this.elevatorMusic = new howler.Howl({
            src: "assets/audio/slideBck.mp3",
            loop: true,
            volume: 1
        });
        this.noDataWarning = false;
        this.realSpeed = [0, 0];
        this.idleData = { stamp: null, factor: 3 };
        this.bakState = {};
        this.paperState = { mode: -1 };
        this.indiData = JSON.parse(JSON.stringify(indicatorData));
        this.movingGain = [0, 0];
        this.movingGainPeriod = 7;
        this.brushThreshold = [153, 360];
        this.demoProgress = false;
        this.unlockedMilestones = [];
        this.storageKillSwitch = false;
        this.upgradeLength = Object.keys((this.demo ? demoUpgrades : rawUpgrades)).length;
        this.EarnLearnCount = Object.keys(learning).length;
        this.slideIndex = 0;
        this.slideFX = new howler.Howl({ src: ["/assets/audio/slide.mp3"] });
        this.botTracker = DefaultBotName;
        this.simRealDataTracker = {};
        this.sandbox = false;
        this.campaignStore = {};
        this.lastSaveCampaign = true;
        this.muteSFX = false;
        // ApexChart:any;
        this.marginWarning = false;
        this.dateKeyIndex = -1; // -1?
        this.portfolio = [startingCash, 0, false, false];
        this.currPrice = [0, false, 0];
        this.buyvssell = true;
        this.tradeVolume = Math.floor(startingCash / 2);
        this.showStats = false;
        this.customBrush = -1;
        this.defaults = {};
        this.pipVid = false;
        this.tutHold = 0;
        //overheadInterest:any=5;
        //recordsToDate: any = { candle: [[], [], []], bar: [] };
        this.displayInfo = 0;
        this.longShortShow = false;
        this.longVsShort = true;
        this._fee = fee;
        this.features = features;
        this.marginCallPercent = marginCallPercent;
        this.loanData = { rate: startingInterestRate, amt: 0, cycle: 0, min: 0, max: startMaxLoan, mo: 0, upgradeMinus: 0 };
        //gainloss: any = 0;
        this.investedSkin = 0;
        this.manual = 0;
        this.cumulativeGain = 1;
        this.chart = {};
        this.limitStops = [];
        this.limDeduction = [0, 0];
        this.purchasedUpgrades = []; // array of ids
        this.earnedLearnings = []; // array of ids
        this.horizonUpgrades = [];
        this.availUpgrades = 0;
        this.newUpgrades = 0;
        this.numActiveTickers = 0;
        this.maxAmtUpgrades = 0;
        this.dimension = "Day";
        this.simRec = 1;
        this.maxSim = 1;
        //marginDays:any=3;
        this.obfuscateYear = true;
        this.obfuscatePrice = true;
        this.finishedStocks = [];
        this.totalPortfolio = 0;
        this.simSpeed = [0, 15, 15]; // Start with [2] being 10 -- current, last, max 1-10,000X 100kX *10 for spread
        this.calculatedScores = {};
        this.secPerSimSpeed = 5;
        this.remindCounter = 15;
        this.portfolioMomentum = null;
        this.math = Math;
        this.warnings = warnings;
        //movingAverageState: any = 0;
        this.cashVsInvested = [startingCash, 0];
        this.historicalCashInvested = [[startingCash, 0]];
        this.debugNum = 0;
        this.tradeDefault = .7;
        this.balanceOptions = { persist: false, marginCallSupress: false, supress: false };
        //feeWarning:any=false;
        this.advancedBotNames = [];
        this.advancedBots = {};
        this.debugSimpleBot = debugSimpleBot;
        this.simpleBot = { logs: [], stopThresh: 50, entry: [], exit: [], entryAmt: 25, exitAmt: 25, entryFreq: 5, exitFreq: 5, short: false, entryUndef: 0, exitUndef: 0 };
        this._activeBot = DefaultBotName;
        this.docStyle = getComputedStyle(document.documentElement);
        // bind external ts
        this.processBot = processBot.bind(this);
        this.scoreTabulation = scoreTabulation.bind(this);
        this.testBrokenDates = testBrokenDates.bind(this);
        this.genActive = genActive.bind(this);
        this.genAverages = genAverages.bind(this);
        //testBrokenData:any=testBrokenData.bind(this);
        this.sliceBrokenData = sliceBrokenData.bind(this);
        this.furtherNarrowSlice = furtherNarrowSlice.bind(this);
        this.quantifyScores = quantifyScores.bind(this);
        this.mainMenu = false;
        this.mainMenuEnd = false;
        this.capslockOn = false;
        //---
        this.movingAverages = {
            sma: [],
            ema: [],
            smaColors: [this.docStyle.getPropertyValue('--sma1')],
            emaColors: [this.docStyle.getPropertyValue('--ema1')],
        };
        //indiUnlock:any={volume:0,ichimoku:0,atrTrailingStop:0,bollinger:0,movingavg:0,rsi:0,aroon:0,atr:0,macd:0,stochastic:0,williams:0};
        //this.statsData.totalFeeAmt+=
        this.visibleExtraGraphs = [];
        this.showAd = [false, null];
        this.statsData = {
            globalGain: 0,
            stockGain: 0,
            totalTrades: 0,
            stockTrades: 0,
            totalFeeAmt: 0,
            stockFeeAmt: 0,
            daysSimmed: 0,
            riseFall: [],
            portfolioHistory: [],
            stockHistory: [],
            dailyStockGains: [],
            aggStockGains: [],
            globalRecords: 0,
            stockRecords: 0,
            netWorth: 0,
            netWorthBefore: 0,
            finished: 0,
            restarts: 0,
            totalInterestAmt: 0,
            stockInterestAmt: 0,
            startingCash: 0,
            addedMaxLoan: 0,
            wins: 0,
            restartedStocks: [],
        };
        this.fullscreenState = false;
        this.debugParam = false;
        //firstTime: any = true;
        this.indicatorColors = { 'close': this.docStyle.getPropertyValue('--close'), 'adj': this.docStyle.getPropertyValue('--adj'), 'gains': this.docStyle.getPropertyValue('--gains'), 'vol': this.docStyle.getPropertyValue('--vol'), 'atr': this.docStyle.getPropertyValue('--atr'), 'dxy': this.docStyle.getPropertyValue('--dxy'), 'unemployment': this.docStyle.getPropertyValue('--unemployment'), 'housing': this.docStyle.getPropertyValue('--housing'), 'yields': this.docStyle.getPropertyValue('--yields'), 'sp': this.docStyle.getPropertyValue('--sp'), 'recess': this.docStyle.getPropertyValue('--recess'), 'industry': this.docStyle.getPropertyValue('--industry'), 'vix': this.docStyle.getPropertyValue('--vix') };
        this.simpleBotActive = false;
        this.failedLearn = {};
        this.dataProcessed = [0, 0];
        this.infusedCash = 0;
        this.isStockDoneAlert = false;
        this.simsPerSecond = 0;
        this.simsThisSecond = 0;
        this.lastSimCountTime = 0;
        this.detectChanges = throttle(this._detectChanges.bind(this), 500);
        this.detached = false;
        this.initBotIfRequired = function () {
            if (!_this.activeBot || _this.activeBot == DefaultBotName || _this.initedBots.indexOf(_this.activeBot) != -1) {
                return Promise.resolve();
            }
            console.log("initing bot...", _this.activeBot);
            document.querySelector("page-home").classList.add("force-visible");
            return _this.navCtrl.push(BaklavaPage, _this.baklavaParams(_this.advancedBots[_this.activeBot]))
                .then(function () {
                return _this.navCtrl.pop();
            })
                .then(function () {
                document.querySelector("page-home").classList.remove("force-visible");
                _this.initedBots.push(_this.activeBot);
                console.log("bot inited");
            });
        };
        this.playSFX = _.throttle(this.playSFXInner.bind(this), this.simSpeed[0] < 100 ? 30 : 20);
        this.saveState = throttle(function (fq, demoDone) {
            if (fq === void 0) { fq = false; }
            if (demoDone === void 0) { demoDone = false; }
            if (!_this.realVsDebugState() || _this.balanceOptions.persist) {
                return;
            }
            if (_this.storageKillSwitch) {
                console.error("storageKILL");
                return;
            }
            var progress = (_this.purchasedUpgrades.length - 2) / (_this.upgradeLength - 2);
            if (progress < 0) {
                progress = 0;
            }
            _this.unlockModeState[_this.mode] = { worth: _this.portfolio[0], progress: progress, tickerProgress: _this.finishedStocks.length / _this.getActive("tickers").length };
            if (_this.mode == "stock") {
                _this.lastSaveCampaign = true;
                var store_1 = {};
                persistVars.forEach(function (data) {
                    store_1[data] = _this[data];
                });
                sharedPersist.forEach(function (data) {
                    store_1[data] = _this[data];
                });
                if (demoDone) {
                    store_1['demoDone'] = true;
                }
                _this.storage.set(storageID + _this.demo ? '_demo' : '', store_1).then(function () {
                    if (fq) {
                        console.error('force quit?');
                        if (window["electron"]) {
                            window["electron"].forceQuit();
                        }
                    }
                });
            }
            else {
                _this.lastSaveCampaign = false;
                /*
            progress should also be a function of the number of materials you've gone through, huh?
            
                */
                sharedPersist.forEach(function (data) {
                    _this.campaignStore[data] = _this[data];
                });
                _this.storage.set(storageID, _this.campaignStore).then(function () {
                    var substore = {};
                    uniquePersist.forEach(function (data) {
                        substore[data] = _this[data];
                    });
                    _this.storage.set(storageID + (_this.demo ? '_demo' : '') + "_" + _this.mode, substore).then(function () {
                        if (fq) {
                            window["electron"].forceQuit();
                        }
                    });
                });
            }
            //console.log(JSON.stringify(this));
        }, 500);
        this.updateChart = throttle(this._updateChart.bind(this), 500);
        window["home"] = this;
        window["cdref"] = this.CDRef;
        window["navctrl"] = this.navCtrl;
        window["baklava"] = BaklavaPage;
        // setInterval(() => {
        //   this.simsPerSecond = this.simsThisSecond;
        //   this.simsThisSecond = 0;
        // }, 1000);
        //this.defineSimpleBot(true); // ()() debug
        //this.stats();
        //this.loan();
        //if (this.debug){this.warnings.tooltips=false}
        stateMachine.registerHomePage(this);
        this.calculatedScores.stock = this.quantifyScores(mtScores);
        this.calculatedScores.etf = this.quantifyScores(etfScores);
        this.calculatedScores.crypto = this.quantifyScores(cryptoScores);
        this.numActiveTickers = this.getActive("tickers").length;
        //mtStartIndex
        // this.furtherNarrowSlice(d3,MTactiveTickers,0,mtStartIndex,{},[])
        //this.tutorial();
        //setTimeout(()=>{this.stockDone()},1000)
        //console.log(this.calculatedScores);
        //console.log(this.calculatedScores);
        //console.log('avg daily return', marketValues);
        //this.testBrokenDates(d3,MTactiveTickers,0,{})
        //this.testBrokenData(d3,KGactiveTickers,0,{})
        //this.genActive(d3,0,{},cryptoScores,[],{});
        //this.genAverages(d3,MTactiveTickers,0,{},true);
        /*
       
           var sortable = [];
           for (var tick in mtScores) {
       
               sortable.push([tick,mtScores[tick][4]/mtScores[tick][2]]);
           }
           
           sortable.sort(function(a, b) {
               return b[1] - a[1];
           });
           
           console.log(sortable);
           */
        /**/
        var bad = [];
        for (var tick in mtScores) {
            if (mtScores[tick][4] / mtScores[tick][2] > 2000 && MTactiveTickers.includes(tick)) {
                bad.push(tick);
            }
        }
        console.log(MTactiveTickers.filter(function (el) { return !bad.includes(el); }));
        //console.log(regression.linear([[0, 1], [32, 67], [12, 79]]));
        //this.scoreTabulation(d3,mtDB,kgDB,mtStartIndex);
        //this.scoreTabulation(d3,mtDB,kgDB,kgStartIndex);
        //this.sliceBrokenData(d3,KGactiveTickers,0,{},kgScores)
        //console.log(this);
        //console.log(JSON.stringify(HomePage));
        //console.log(Ng2IziToastModule);
        // DEBUG ()()()()()
        /*
        setTimeout(()=>{
          //this.learnEarn()
        this.globalModal = this.modalCtrl.create(quizModal, {
              data: { "intro": "Read Candlestick Charts", "description": "The Candlestick shows the open, high, low and close of the day. It is the foundation of understanding trends in the market.", "reward": 10, "data": { "resources": [ { "name": "Investopedia", "link": "https://www.investopedia.com/trading/candlestick-charting-what-is-it/" }, { "name": "YouTube", "id": "1rwVV_8uUxc" } ], "quiz": [ [ "Which of these do candlesticks NOT show?", "Volume the last of thre fds fdjkslj fkdsjkjkd fdlsk fjdks jfkdsj kfjds jkfdjsk fd", "Open", "Low", "High" ], [ "What does the candle indicate?", "Open and closing prices", "Moving average", "High and low prices", "Trading volume" ], [ "What do the candle wicks indicate?", "High and low prices", "Moving average", "Open and closing prices", "Trading volume" ], [ "What does a bearish candlestick pattern mean?", "The price is likely to fall.", "The trading volume is likely to decrease.", "The price is likely to rise.", "The trading volume is likely to increase." ], [ "If the candle has no height (is flat and black), this means:", "The open and close are the same.", "The data is corrupted.", "No trading took place that day.", "The price is likely to rise." ], [ "If the candle has no wick(s), this means:", "The high and low are equal to the open and close.", "The data is corrupted.", "No trading took place that day.", "The price is likely to rise." ] ] }, "name": "Candlestick Charts"},
            }, { cssClass: 'quizModal' });
            this.globalModal.present();
        
        },500)
        */
        //---------------()()()()()()()() debug
        /*
        setTimeout(()=>{
          this.mainMenuButton('stock');
          var name="Candlestick Charts";
            this.earnedLearnings.push(name);
              this.addCash(learning[name].reward);
              this.calcLearnEarn();
              this.setTradeVol();
              this.learnEarn();
        },1000)
        */
        //---------------
        if (window["electron"]) {
            window["electron"].onBeforeQuit().then(function () {
                _this.saveState(true);
            }); //electron.forceQuit()});
        }
        else {
            window.onbeforeunload = function (e) {
                _this.saveState();
            };
        }
        events.subscribe("extraCompleted", function (id) {
            _this.opportunities[id].completed = true;
            _this.addCash(_this.opportunities[id].reward);
            _this.notification(['success', 'Earned $' + _this.opportunities[id].reward, " Extra Opportunity Completed"]);
            _this.calcLearnEarn();
            _this.setTradeVol();
            _this.calcExtraAvail();
            _this.saveState();
        });
        events.subscribe("idle", function (days) { return __awaiter(_this, void 0, void 0, function () {
            var recur, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recur = Math.ceil(days / 13);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < recur)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.pushData(recur, false, false, true)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        /**/
        events.subscribe("tutorialOpen", function (thing) {
            _this.tutorialState[0] = 1;
            /*
              if (thing=='upgrades'){
            
            this.upgrades();
              }else if (thing=='learn'){
            this.learnEarn();
              }
            
            */
        });
        events.subscribe("openPip", function (id) {
            _this.openPip(id);
            _this.warnings.new.pip = false;
        });
        events.subscribe("learned", function (name) {
            if (!learning[name]) {
                console.error('fatal, no learning by the name ' + name);
                return;
            }
            _this.earnedLearnings.push(name);
            _this.addCash(_this.getLearnReward(name));
            _this.notification(['success', 'Earned $' + _this.getLearnReward(name), " Quiz Completed"]);
            _this.calcLearnEarn();
            _this.setTradeVol();
            _this.globalModal.dismiss();
            _this.saveState();
        });
        events.subscribe("paperState", function (state) {
            if (state == 1) {
                // turn off
                _this.unwrapPaper();
            }
            else {
                _this.paperState = { mode: state == 0 ? 0 : 1 };
                paperPersist.forEach(function (field) {
                    _this.paperState[field] = _this[field];
                });
                _this.saveState();
            }
        });
        events.subscribe("newLog", function (log) {
            var view = _this.navCtrl.getActive().component.name;
            var logObj = log; //process Log from Jitin
            if (view == "HomePage") {
                if (_this.activeBot !== DefaultBotName) {
                    logObj.date = _this.currentDate;
                    _this.advancedBots[_this.activeBot].logs.push(logObj);
                }
            }
        });
        events.subscribe("simFromBaklava", function (start, speedMode, testMode) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(speedMode == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.pushData(1)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!start) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.pushData(1)];
                    case 3:
                        _a.sent();
                        if (speedMode == 1) {
                            this.simSpeed[0] = 18;
                        }
                        else if (speedMode == 2) {
                            this.simSpeed[0] = 37;
                        }
                        else if (speedMode == 3) {
                            this.simSpeed[0] = 80;
                        }
                        else if (speedMode == 4) {
                            this.simSpeed[0] = 174;
                        }
                        else if (speedMode == 5) {
                            this.simSpeed[0] = 370;
                        }
                        this.realtimeSim();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.playButton()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        /*
                events.subscribe("failed", (name) => {
                  var stamp=Date.now();
                  this.failedLearn[name]=stamp;
            });
        
        */
        window.addEventListener("resize", function () {
            if (_this.mainMenu) {
                /*
                        this.animDimension();
                        this.chartsProvider.render("#anim", this.configAnim);
                */
            }
            else {
                if (_this.config) {
                    _this.setDimensions();
                    _this.chartsProvider.render("#d3el", _this.config);
                }
            }
        });
        events.subscribe("saveBot", function (bot) {
            _this.initedBots.push(bot);
            _this.advancedBots[bot[0]] = bot[1];
            console.error(_this.advancedBots);
            _this.saveState();
            //save
        });
        var initBaklavaIfRequired = function () {
            _this.updateUnlockBaklavaState();
            if (_this.stateMachine.baklavaInited && !_this.debugSimpleBot) {
                return Promise.resolve();
            }
            if (!_this.debugSimpleBot) {
                document.querySelector("page-home").classList.add("force-visible");
            }
            return navCtrl.push(BaklavaPage, _this.baklavaParams({ "name": "Bot #1", "mode": 1, "logs": [], "sim": 0, "gains": null, "data": { "nodes": [], "connections": [], "panning": { "x": 0, "y": 0 }, "scaling": 1 } }))
                .then(function () {
                if (!_this.debugSimpleBot) {
                    return navCtrl.pop();
                }
            })
                .then(function () {
                if (!_this.debugSimpleBot) {
                    document.querySelector("page-home").classList.remove("force-visible");
                }
            });
        };
        events.subscribe("saveSimpleBot", function (rules) {
            _this.simpleBot = rules;
            initBaklavaIfRequired().then(function () {
                events.publish("compileSimpleBot", _this.simpleBot);
            });
            _this.advancedBotNames = Object.keys(_this.advancedBots);
            // console.error('save simple bot, compile it down');
            _this.saveState();
            // this.activeBot="_simple_";
        });
        events.subscribe("updateIndicators", function (indicator, param, val) {
            //console.log(indicator, param, val)
            if (indicator == 'bollinger') {
                if (param == "period") {
                    _this.config.candlestick.bollinger = [val];
                }
                else {
                    _this.config.candlestick.bollingerSdMultiplication = val;
                }
            }
            else if (indicator.includes('atr')) {
                if (param == "period") {
                    _this.config.candlestick.atrTrailingStop = [val];
                }
                else {
                    _this.config.candlestick.atrTrailingStopMultiplier = val;
                }
            }
            else if (indicator == 'ichimoku') {
                _this.config.candlestick[param] = val;
            }
            else if (indicator == 'pivot') {
                _this.config.candlestick.supstance.algorithmConfig.name = val;
            }
            else {
                _this.config[indicator][param] = val;
            }
            _this.indiData[indicator].vals[param] = val;
        });
        events.subscribe("setMA", function (ma) {
            _this.movingAverages = ma;
        });
        events.subscribe("loan", function (amt) {
            //console.log('hello world');
            if (_this.tutorialState[0] == 10) {
                _this.tutorialState[0] = 11;
            }
            var diff = amt - _this.loanData.amt;
            var accrued = Math.floor(_this.loanData.cycle * _this.loanData.amt / 360 * _this.loanData.rate) / 100;
            _this.loanData.amt = amt;
            _this.loanData.cycle = 0;
            var message = 'Current Loan is $' + _this.loanData.amt;
            if (accrued > 0) {
                message += ", $" + accrued + " paid in accrued interest";
            }
            _this.notification(['success', 'Margin Loan Updated', message]);
            //console.error('warning about accrued interest loan etc? PUT INFO IN PORTFOLIO');
            _this.addCash(diff - accrued);
            _this.setTradeVol();
            _this.calcInterestRate();
        });
        events.subscribe("upgrade", function (id, cost, warnings) {
            //console.log('hello world');
            _this.warnings = warnings;
            _this.processUpgrade(id);
            _this.addCash(cost * -1);
            _this.calcLearnEarn();
            _this.setTradeVol();
        });
        events.subscribe("sfx", function (name) {
            _this.playSFX(name);
        });
        events.subscribe("openModal", function (id) {
            if (id == 'learn') {
                _this.learnEarn();
            }
            else if (id == 'extras') {
                _this.extraMenu();
            }
        });
        events.subscribe("updateMarginWarnings", function (stuff) {
            _this.marginWarningThreshold = stuff[0];
            _this.warnings.marginCallWarn = stuff[1];
        });
        events.subscribe("guide", function (name) {
            alert('open guide');
        });
        events.subscribe("backStackTrace", function (obj) {
            console.log(obj);
            _this.openLog(obj.botName);
        });
        events.subscribe("readLog", function (obj) {
            if (obj.clear) {
                _this.advancedBots[obj.name].logs = [];
                _this.advancedBots[obj.name].read = 0;
            }
            else {
                _this.advancedBots[obj.name].read = _this.advancedBots[obj.name].logs.length;
            }
            _this.saveState();
        });
        events.subscribe("tutState", function (state, overrride) {
            if (overrride === void 0) { overrride = false; }
            state = parseInt(state);
            if (_this.demoState && state == 1) {
                _this.tutorialState = [-1, null];
                _this.processUpgrade('step', true);
                _this.processUpgrade('margin', true);
                _this.notification(['success', _this.tutorialDB['intro'].prompt, '$' + _this.tutorialDB['intro'].reward + ' Added to Account']);
                _this.addCash(_this.tutorialDB['intro'].reward);
                _this.setTradeVol();
                return;
            }
            if (state == 260 || state == 308 || state == 55) {
                if (state == 55) {
                    _this.notification(['warning', 'Margin Calls Active', 'You Will Be Forced to Restart if 10% Or More of Your Loan Is Lost']);
                    setTimeout(function () {
                        _this.tutorialState[0] = -1;
                        _this.endTutorial();
                    }, 2500);
                }
                else {
                    _this.tutorialState[0] = state + 1;
                    _this.endTutorial();
                }
            }
            else {
                _this.tutorialState[0] = state;
            }
        });
        events.subscribe("trade", function (tradeObj) {
            _this.trade(true, true, tradeObj);
        });
        this.chartsProvider.onBrush(function () {
            var start = _this.chartsProvider.getCurrentBrush().startDate;
            var end = _this.chartsProvider.getCurrentBrush().endDate;
            var first = _this.currentData.findIndex(function (e) {
                return e.date.toDateString() == start.toDateString();
            });
            var last = _this.currentData.findIndex(function (e) {
                return e.date.toDateString() == end.toDateString();
            });
            //console.log(first,last);
            if (_this.chartsProvider.getBrushSize().tradingDays < _this.chartsProvider.config.minimumBrushSize) {
                _this.checkBrushData(first, last);
            }
            else {
                _this.checkBrushData(0, _this.dateKeyIndex);
            }
        });
    }
    Object.defineProperty(HomePage.prototype, "fee", {
        get: function () {
            return this._fee;
        },
        set: function (fee) {
            this._fee = fee;
            this.stateMachine.setFee(fee);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HomePage.prototype, "activeBot", {
        get: function () {
            if (!this._activeBot) {
                this._activeBot = DefaultBotName;
            }
            return this._activeBot;
        },
        set: function (botName) {
            this._activeBot = botName;
            this.stateMachine.setActiveBotName(botName);
            console.log("initing bot");
            this.initBotIfRequired();
        },
        enumerable: false,
        configurable: true
    });
    HomePage.prototype.switchBot = function (botName) {
        this.activeBot = botName;
        console.log("switching");
        this.navCtrl.pop();
        this.navCtrl.push(BaklavaPage, this.baklavaParams(this.advancedBots[botName]));
    };
    HomePage.prototype.onColorFocus = function (i) {
        document.getElementById("color-dropdown-parent" + i).style.display = "block";
    };
    HomePage.prototype.onColorFocusOut = function (i) {
        document.getElementById("color-dropdown-parent" + i).style.display = null;
    };
    HomePage.prototype._detectChanges = function () {
        this.CDRef.detectChanges();
    };
    HomePage.prototype.detachCD = function () {
        if (this.detached) {
            return;
        }
        this.CDRef.detach();
        this.detached = true;
    };
    HomePage.prototype.attachCD = function () {
        if (!this.detached) {
            return;
        }
        this.CDRef.reattach();
        this.CDRef.detectChanges();
        this.detached = false;
    };
    HomePage.prototype.demoPopup = function () {
        var _this = this;
        var message = "We hope you are enjoying this demo of Trade Bots. Our intention with this demo was to give you a small taste of all that's available in the full version, which includes 20+ indicators and 100+ upgrades, including advanced features like neural networks, backtesting and bot export to name just a few. Please consider supporting our 501(c)3 non-profit by upgrading. Much of your progress from this demo will carry over to the full version including Learn and Earn Quizzes.";
        var alert = this.alertCtrl.create({
            cssClass: 'earlyAccessAlert',
            enableBackdropDismiss: false,
            title: "Demo Version",
            message: message,
            buttons: [
                {
                    text: "Later",
                    handler: function () {
                    },
                },
                {
                    text: "Upgrade",
                    handler: function (data) {
                        _this.openLink('https://store.steampowered.com/app/1899350/Trade_Bots_A_Technical_Analysis_Simulation/');
                        return false;
                    },
                }
            ],
        });
        alert.present();
    };
    HomePage.prototype.feedback = function () {
        window.open("mailto:info@cinqmarsmedia.org?subject=TradeBots " + (this.demo ? "d" : "v") + this.version + "&body=Please describe how to reproduce your issue in detail and attach any relevant screenshots. Thank you for your time and feedback!", "_self", "frame=true,nodeIntegration=no");
    };
    HomePage.prototype.openLink = function (link, self) {
        if (self === void 0) { self = false; }
        this.playSFX('generic');
        window.open(link, self ? "_self" : "_blank", "frame=true,nodeIntegration=no");
    };
    HomePage.prototype.earlyAccessPrompt = function (start, back) {
        var _this = this;
        if (start === void 0) { start = true; }
        if (back === void 0) { back = false; }
        var message;
        if (start) {
            message = "Thank you for participating our non-profit's early access release. As the first version of the game, it is sparse and missing a great deal of content and we hope that with your feedback and balancing etc... Have fun and keep in touch by signing up for our newsletter if you haven't already!";
        }
        else {
            message = "Thank you for participating our non-profit's early access release. This is currently as far as this version goes but look forward tthe project goes blah blah look forward for new releases";
        }
        var alert = this.alertCtrl.create({
            cssClass: 'earlyAccessAlert',
            enableBackdropDismiss: false,
            title: "Early Access v" + this.version,
            message: message,
            inputs: [
                {
                    name: "email",
                    placeholder: "Your Email",
                },
            ],
            buttons: [
                {
                    text: "Later",
                    handler: function () {
                    },
                },
                {
                    text: "Sign-Up",
                    handler: function (data) {
                        if (!window.navigator.onLine) {
                            _this.generalPopup("No Internet", "Signing Up requires an internet connection");
                            _this.playSFX('error');
                            return false;
                        }
                        var postAt = data.email.match(/@(.+)/i);
                        if (/(.+)@(.+){2,}\.(.+){2,}/.test(data.email) &&
                            data.email.length > 7 &&
                            postAt &&
                            !emailDomainBlacklist.includes(postAt[1])) {
                            fetch("<signupEmail>", {
                                method: "POST",
                                mode: "no-cors",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                                },
                                body: "EMAIL=" + data.email,
                            });
                        }
                        else {
                            // alert('please enter a valid email');
                            alert.setMessage('<span class="red">Please Enter a Valid Email</span>');
                            return false;
                        }
                    },
                }
            ],
        });
        alert.present();
    };
    HomePage.prototype.ionViewCanEnter = function () {
        this.advancedBotNames = Object.keys(this.advancedBots);
        if (this.advancedBotNames.length == 0) {
            this.activeBot = DefaultBotName;
        }
    };
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        if (window["electron"]) {
            window["electron"].zoom(1.1);
        }
        this.events.subscribe("showTrace", function (trace, traceInfo) {
            _this.showTrace(trace, traceInfo);
        });
        return new Promise(function (resolve, reject) {
            _this.storage.get(storageID + _this.demo ? '_demo' : '').then(function (val) { return __awaiter(_this, void 0, void 0, function () {
                var localHost, param;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            localHost = window.location.href.includes('localhost');
                            param = window.location.href.split('?')[1];
                            if (!localHost && !param) {
                                this.debug = false;
                            }
                            if (param) {
                                this.debugParam = param;
                                this.debug = true;
                                this.muteSFX = true;
                            }
                            this.mainMenuGo(true);
                            this.initDefaults();
                            if (!val) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.initState(val)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            if (!this.debug && !this.debugParam) {
                                this.disclaimer(true);
                                this.playMusic();
                            }
                            if (!this.demo) {
                                // check demo stuff
                                this.storage.get(storageID + '_demo').then(function (val) {
                                    if (val) {
                                        // ()()()()() load perks from demo
                                        var runningTotal = 0;
                                        Object.keys(val.opportunities).forEach(function (ky) {
                                            if (val.opportunities[ky].completed) {
                                                _this.opportunities[ky].completed = true;
                                                runningTotal += _this.opportunities[ky].reward;
                                            }
                                        });
                                        _this.demoState = { learned: val.earnedLearnings, tutorial: val.tutorialDB };
                                        //  tutorialDB:any={'intro':{prompt:'Intro Tutorial Complete',start:0,completed:false,unlocked:true, reward:10
                                        runningTotal += _this.tutorialDB['intro'].reward;
                                        _this.tutorialDB['intro'].completed = true;
                                        _this.addCash(runningTotal);
                                        _this.notification(['success', 'Demo Opportunities, $' + runningTotal + ' Added to Account']);
                                        _this.demoProgress = true;
                                        _this.calcLearnEarn();
                                        _this.setTradeVol();
                                        _this.calcExtraAvail();
                                    }
                                });
                            }
                            console.log('NEW GAME');
                            _a.label = 3;
                        case 3:
                            resolve(true);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    /*
    initModeStorage(){
    
      let cryptoStore = {}
    
        uniquePersist.forEach((data) => {
          cryptoStore[data] = this[data];
        })
    
        this.storage.set(storageID+"_crypto", cryptoStore);
    
    let sandboxStore={}
    
      uniquePersist.forEach((data) => {
          sandboxStore[data] = this[data];
        })
    
        this.storage.set(storageID+"_sandbox", sandboxStore);
    
    }
    */
    HomePage.prototype.disclaimer = function (agree) {
        if (agree === void 0) { agree = true; }
        this.globalModal = this.modalCtrl.create(disclaimerModal, {
            agree: agree
        }, { enableBackdropDismiss: !agree, cssClass: 'disclaimerModal' });
        this.globalModal.present();
    };
    HomePage.prototype.toggleMute = function (e) {
        this.muteSFX = !e;
        if (this.music && this.music.playing()) {
            this.music.stop();
        }
        if (this.mainMenu && !this.muteSFX) {
            this.playMusic();
        }
        else if (e) {
            this.playSFX('toggle');
        }
        //console.error(this.muteSFX);
        this.saveState();
    };
    HomePage.prototype.mainMenuGo = function (init) {
        if (init === void 0) { init = false; }
        console.log("main menu go", init);
        if (!init && (!this.music || !this.music.playing()) && !this.muteSFX) {
            this.playMusic();
        }
        this.showAds();
        this.mainMenu = true;
        this.mainMenuEnd = false;
        //this.animateOpening()
    };
    HomePage.prototype.unwrapPaper = function (botname) {
        if (botname === void 0) { botname = false; }
        return __awaiter(this, void 0, void 0, function () {
            var diff;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.paperState.mode == 0)) return [3 /*break*/, 2];
                        diff = this.dateKeyIndex - this.paperState.dateKeyIndex;
                        paperPersist.forEach(function (field) {
                            _this[field] = _this.paperState[field];
                        });
                        return [4 /*yield*/, this.pushData(diff)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        //backtest
                        paperPersist.forEach(function (field) {
                            _this[field] = _this.paperState[field];
                        });
                        _a.label = 3;
                    case 3:
                        this.paperState = { mode: -1 };
                        this.saveState();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.notification = function (data) {
        if (!this.warnings.notifications) {
            return;
        }
        this.playSFX('notification');
        var dat = {
            title: data[1],
            message: data[2],
            position: "topLeft"
        };
        if (data[3]) {
            dat['color'] = data[3];
        }
        iziToast[data[0]](dat);
    };
    HomePage.prototype.balSimOptions = function (smart) {
        var _this = this;
        if (smart === void 0) { smart = false; }
        var alert = this.alertCtrl.create({
            title: "Sim With AI",
            //message:"A Simple AI that plays the game",
            inputs: [
                /*  */
                {
                    type: "text",
                    name: "ticker",
                    placeholder: "Ticker",
                    value: "continue",
                },
                {
                    type: "text",
                    name: "fee",
                    placeholder: "Starting Fee",
                    value: "0.05",
                },
                {
                    type: "text",
                    name: "interest",
                    placeholder: "Starting Interest",
                    value: "0.1",
                },
                {
                    type: "text",
                    name: "reward",
                    placeholder: "Reward Factor",
                    value: "1",
                },
                {
                    type: "text",
                    name: "maxLoan",
                    placeholder: "Max Loan Factor",
                    value: "1",
                },
                {
                    type: "text",
                    name: "passive",
                    placeholder: "Passive Threshold",
                    value: "0.1",
                },
                {
                    type: "text",
                    name: "smart",
                    placeholder: "BuyThresh,SellThresh,SMAP,DayOffset",
                    value: ".05,.1,10,3",
                },
                {
                    type: "text",
                    name: "iterations",
                    placeholder: "Days",
                    value: "1000",
                } /*,
                {
                  type: "checkbox",
                  name: "Smart Mode",
                  value: "dontshow",
                }
                */
            ],
            buttons: [
                {
                    text: "Smart",
                    handler: function (data) {
                        var ticker = data.ticker;
                        if (ticker !== "continue" && ticker !== "random") {
                            ticker = data.ticker.toUpperCase();
                            if (!_this.getActive("tickers").includes(ticker)) {
                                alert.setMessage('<span class="red">Please Enter a Valid Ticker</span>');
                                return false;
                            }
                        }
                        _this.simAI(data, true, ticker);
                    },
                },
                {
                    text: "Dumb",
                    handler: function (data) {
                        var ticker = data.ticker;
                        if (ticker !== "continue" && ticker !== "random") {
                            ticker = data.ticker.toUpperCase();
                            if (!_this.getActive("tickers").includes(ticker)) {
                                alert.setMessage('<span class="red">Please Enter a Valid Ticker</span>');
                                return false;
                            }
                        }
                        _this.simAI(data, false, ticker);
                    },
                },
            ],
        });
        alert.present();
    };
    HomePage.prototype.playSFXInner = function (name, vol, loop) {
        if (vol === void 0) { vol = 1; }
        if (loop === void 0) { loop = false; }
        if (name == 'generic') {
            vol = .95;
        }
        if (name == 'mode') {
            vol = .2;
        }
        if (name == 'toggle') {
            vol = .37;
        }
        if (name == 'alt') {
            vol = .2;
        }
        if (name == 'error') {
            vol = .7;
        }
        if (name == 'notification') {
            vol = 1;
        }
        if (name == 'tick') {
            vol = -0.095 * Math.log(this.simSpeed[0]) + .51;
            if (vol > .28) {
                vol = .28;
            }
            if (vol < .04) {
                vol = .04;
            }
        }
        if (!this.muteSFX) {
            var sfx = new howler.Howl({
                src: "assets/audio/" + name + ".mp3",
                loop: loop,
                volume: vol
            });
            sfx.play();
        }
    };
    HomePage.prototype.playMusic = function () {
        var _this = this;
        if (this.music && this.music.playing()) {
            console.warn('music playing twice?');
            return;
        }
        this.music = new howler.Howl({
            src: "assets/audio/music.mp3",
            loop: true,
            volume: .35,
            onend: function () { if (!_this.mainMenu) {
                _this.music.stop();
            } }
        });
        this.music.play();
    };
    HomePage.prototype.simAI = function (data, smart, ticker) {
        var _this = this;
        if (ticker !== "continue") {
            if (ticker == "random") {
                this.initStock();
            }
            else {
                this.initStock(ticker);
            }
        }
        document.getElementById("d3el").style.opacity = ".1";
        var temp = data.smart.split(',');
        setTimeout(function () {
            _this.fee = parseFloat(data.fee);
            _this.loanData.rate = parseFloat(data.interest) * 100;
            _this.balanceSim(smart, parseFloat(data.reward), parseFloat(data.maxLoan), parseInt(data.iterations), parseFloat(data.passive), [parseFloat(temp[0]), parseFloat(temp[1]), parseInt(temp[2]), parseInt(temp[3])]);
        }, 400);
    };
    HomePage.prototype.balanceSim = function (smart, rewardFactor, loanFactor, iterations, passiveThresh, smartData) {
        // output time milestones with each upgrade...
        var _this = this;
        if (smart === void 0) { smart = false; }
        if (rewardFactor === void 0) { rewardFactor = 1; }
        if (loanFactor === void 0) { loanFactor = 1; }
        if (iterations === void 0) { iterations = 100; }
        if (passiveThresh === void 0) { passiveThresh = .1; }
        //console.log(smartData);
        var output = [];
        var elapsedRecords = 0;
        var timeSpent = 0;
        var maxGrowth = 1;
        var minGrowth = 1;
        var fees = 0;
        var trades = 0;
        var rewards = 0;
        smartData[0] += 1;
        smartData[1] += 1;
        this.balanceOptions.persist = true;
        this.brushThreshold[1] = 7;
        this.balanceOptions.suppress = true;
        this.balanceOptions.marginCallSupress = true;
        Object.keys(this.warnings).forEach(function (ky) {
            _this.warnings[ky] = true;
        });
        this.warnings.notifications = false;
        //console.log(this.warnings);
        var balanceInt = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var genUpgrades, signal, tenSMA, tenSMA_DaysAgo, growth, alert_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // take out max loan
                        if (this.loanData.max !== this.loanData.amt) {
                            this.events.publish("loan", this.loanData.max);
                        }
                        genUpgrades = [];
                        Object.keys((this.demo ? demoUpgrades : rawUpgrades)).forEach(function (key) {
                            if (!_this.purchasedUpgrades.includes(key)) {
                                var upgrade = (_this.demo ? demoUpgrades : rawUpgrades)[key];
                                upgrade.id = key;
                                Object.keys(learning).forEach(function (ky) {
                                    if (learning[ky].upgrade == upgrade.id) {
                                        upgrade.reward = learning[ky].reward;
                                    }
                                });
                                genUpgrades.push(upgrade);
                            }
                        });
                        // always buy learn and earn and get rewards
                        if (rewardFactor > 0) {
                            genUpgrades.forEach(function (upgrade) {
                                var _a;
                                if (upgrade.reward >= upgrade.cost && _this.portfolio[0] >= upgrade.cost) {
                                    _this.events.publish("upgrade", upgrade.id, upgrade.cost, _this.warnings);
                                    rewards += upgrade.reward;
                                    _this.addCash((upgrade.reward - upgrade.cost) * rewardFactor + upgrade.cost);
                                    output.push((_a = {}, _a[upgrade.id] = [Math.floor(timeSpent / 60 * 100) / 100 + " min"], _a));
                                }
                            });
                        }
                        /**/
                        genUpgrades.forEach(function (upgrade) {
                            var _a;
                            if (!upgrade.reward && _this.portfolio[0] >= upgrade.cost) {
                                var maxLoan = _this.loanData.max;
                                if (
                                // if upgrade is less than 10% of wealth, just buy it
                                upgrade.cost / _this.portfolio[0] < passiveThresh ||
                                    // if loan will increase funds buy it
                                    (upgrade.id.slice(0, 7) == "loanMax" && _this.portfolio[0] > upgrade.cost &&
                                        _this.loanData.max * parseInt(upgrade.id.split("_")[1]) - maxLoan > upgrade.cost)) {
                                    _this.events.publish("upgrade", upgrade.id, upgrade.cost, _this.warnings);
                                    output.push((_a = {}, _a[upgrade.id] = Math.floor(timeSpent / 60 * 100) / 100 + " min", _a));
                                }
                            }
                        });
                        //this.setTradeVol();
                        // invest all money in stock always
                        if (!smart) {
                            this.tradeVolume = this.cashVsInvested[0] - this.cashVsInvested[0] * this.fee;
                            if (this.tradeVolume > 1) {
                                this.buyvssell = true;
                                this.trade(true);
                            }
                        }
                        else {
                            signal = false;
                            tenSMA = this.chartsProvider.calculateData("sma", new Date(this.currentDate), { period: smartData[2] }).value;
                            tenSMA_DaysAgo = this.chartsProvider.calculateData("sma", new Date(this.currentData[this.dateKeyIndex - smartData[3]].date), { period: smartData[2] }).value;
                            growth = tenSMA / tenSMA_DaysAgo;
                            if (growth > maxGrowth) {
                                maxGrowth = growth;
                                //console.log(maxGrowth);
                            }
                            if (growth < minGrowth) {
                                minGrowth = growth;
                                //console.log(minGrowth);
                            }
                            //console.log(growth,smartData[0],1/smartData[1]);
                            if (growth > 1 && growth > smartData[0]) {
                                signal = 'buy';
                            }
                            else if (growth < 1 && growth < (1 / smartData[1])) {
                                signal = 'sell';
                            }
                            // Buy Signal
                            if (signal == 'buy') {
                                console.log('buy');
                                this.tradeVolume = this.cashVsInvested[0] - this.cashVsInvested[0] * this.fee;
                                if (this.tradeVolume > 1) {
                                    trades++;
                                    fees += this.cashVsInvested[0] * this.fee;
                                    this.buyvssell = true;
                                    this.trade(true);
                                }
                                else {
                                    console.error('already fully invested', elapsedRecords);
                                }
                            }
                            // Sell Signal
                            if (signal == 'sell') {
                                console.log('sell');
                                this.tradeVolume = this.cashVsInvested[1] - this.cashVsInvested[1] * this.fee;
                                if (this.tradeVolume > 1) {
                                    trades++;
                                    fees += this.cashVsInvested[1] * this.fee;
                                    this.buyvssell = false;
                                    this.trade(true);
                                }
                                else {
                                    console.error('already fully divested', elapsedRecords);
                                }
                            }
                        }
                        if (!(this.dateKeyIndex < this.currentData.length - 2)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.pushData(1, true)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        elapsedRecords++;
                        timeSpent += 1 * this.showRealSim(this.simSpeed[2] / 10);
                        if (this.cashVsInvested[0] < 0) {
                            //console.log(elapsedRecords,this.cashVsInvested[0],this.portfolio[1])
                        }
                        //console.log(this.dateKeyIndex,this.currentData.length);
                        if (elapsedRecords >= iterations || (this.dateKeyIndex >= this.currentData.length - 2)) {
                            clearInterval(balanceInt);
                            console.error(this.currentTicker[0]);
                            console.error(output);
                            document.getElementById("d3el").style.opacity = "1";
                            if (this.dateKeyIndex >= this.currentData.length - 2) {
                                this.stockDone();
                            }
                            alert_1 = this.alertCtrl.create({
                                title: "Results for " + this.currentTicker[5] + " : " + this.currentTicker[0] + " (" + elapsedRecords + " days)",
                                message: JSON.stringify(output) + "...." + JSON.stringify({ fees: Math.round(fees), trades: trades, maxSignalLoss: Math.round(((1 / minGrowth) - 1) * 100) / 100, maxSignalGain: Math.round((maxGrowth - 1) * 100) / 100, assets: Math.round(this.portfolio[0]), profitperdayminusrewards: Math.round((this.portfolio[0] - rewards) / elapsedRecords) }),
                                buttons: [
                                    {
                                        text: "Dismiss",
                                        handler: function (data) { },
                                    },
                                ],
                            });
                            alert_1.present();
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 0);
    };
    HomePage.prototype.clearLimitOrders = function () {
        for (var i = this.limitStops.length - 1; i > -1; i--) {
            this.rmLimitStop(i);
        }
        this.limitStops = [];
    };
    HomePage.prototype.limitStopBlur = function () {
        if (!this.limitStop) {
            this.limitStop = this.currPrice[0];
        }
        if (this.buyvssell && this.limitStop > this.currPrice[0]) {
            this.limitStop = this.currPrice[0];
        }
        else if (this.limitStop < 0) {
            this.limitStop = 0;
        }
        //253
        this.limitRender = this.limitStop.toFixed(2);
        console.error(this.limitRender);
    };
    HomePage.prototype.limitStopChange = function (event) {
        var limitStopCursorPosition = (event.target.selectionStart);
        var amt = event.target.value;
        if (amt[amt.length - 1] == ".") {
            if (amt.split('.').length == 2) {
                return;
            }
        }
        if (amt.split('.').length > 2) {
            this.limitRender = 0;
            this.CDRef.detectChanges();
            this.limitRender = amt.split('.').slice(0, 2).join(".");
            return;
        }
        var re = new RegExp(/^[\d\.]*$/);
        if (!re.test(amt)) {
            this.limitRender = 0;
            this.CDRef.detectChanges();
            this.limitRender = amt.replace(/[^\d\.]/, '');
            setTimeout(function () {
                event.target.selectionStart = limitStopCursorPosition - 1;
                event.target.selectionEnd = limitStopCursorPosition - 1;
            });
            return;
        }
        this.limitStop = +amt;
        var decimals = (String(amt).split('.')[1] || []).length;
        if (decimals > 2) {
            this.limitRender = this.limitStop.toFixed(2);
        }
        if (this.buyvssell && amt > this.currPrice[0]) {
            this.limitStop = this.currPrice[0];
            this.limitRender = +this.limitStop.toFixed(2);
        }
        if (this.limitStop < 0) {
            this.limitStop = 0;
            this.limitRender = +this.limitStop.toFixed(2);
        }
        if (this.tutorialState[0] == 102 && amt < this.currPrice[0]) {
            this.tutorialState[0] = 103;
            if (this.tradeVolume < 0.1) {
                this.quickCash(50);
            }
        }
        if (this.tutorialState[0] == 103 && this.currPrice[0] <= amt) {
            this.tutorialState[0] = 102;
        }
        //
        var x = +this.limitStop;
        this.limitRender = 0;
        this.CDRef.detectChanges();
        var rez = Math.floor(x * 100) / 100;
        //console.log(rez);
        if (rez == 0) {
            this.limitRender = '';
        }
        else {
            this.limitRender = rez.toFixed(2);
        }
        if (this.limitRender == this.currPrice[0].toFixed(2)) {
            //this.limitRender=this.currPrice[0];
            this.limitStop = this.currPrice[0];
        }
        var minus = 0;
        if (amt >= this.currPrice[0]) {
            minus = 1;
        }
        setTimeout(function () {
            event.target.selectionStart = limitStopCursorPosition - minus;
            event.target.selectionEnd = limitStopCursorPosition - minus;
        });
    };
    HomePage.prototype.setAutoType = function (dest) {
        // warnings: any = { limit: false, fee: false, fiftyper: false, sellupgrade: false, limitTrigger: false, simpleNavAway:false, advancedNavAway:false };
        var _this = this;
        if (dest == 1 && (this.tutorialState[0] == 101 || this.tutorialState[0] == 100)) {
            this.tutorialState[0] = 102;
            this.buyvssell = true;
        }
        if (dest == 2 && (this.tutorialState[0] == 201 || this.tutorialState[0] == 200)) {
            this.tutorialState[0] = 202;
            this.buyvssell = true;
        }
        this.playSFX('alt');
        if (this.manual == 1 && this.limitStops.length > 0 && !this.warnings.limitNavAway) {
            var alert_2 = this.alertCtrl.create({
                title: "Order Warning",
                message: "All Open Limit/Stop Orders Will Be Cancelled when Navigating to Another Mode",
                inputs: [
                    {
                        type: "checkbox",
                        label: "Don't Show Again",
                        value: "dontshow",
                    },
                ],
                buttons: [
                    {
                        text: "Cancel",
                        handler: function () { },
                    },
                    {
                        text: "Ok",
                        handler: function (data) {
                            _this.warnings.limitNavAway = data.length > 0;
                            _this.setAutoType(dest);
                            _this.clearLimitOrders();
                            _this.saveState();
                        },
                    },
                ],
            });
            alert_2.present();
            return;
        }
        if (this.manual == 2 && this.activeBot !== DefaultBotName && !this.warnings.simpleNavAway) {
            var alert_3 = this.alertCtrl.create({
                title: "Bot Warning",
                message: "Your Simple Bot will deactivate when moving to another mode",
                inputs: [
                    {
                        type: "checkbox",
                        label: "Don't Show Again",
                        value: "dontshow",
                    },
                ],
                buttons: [
                    {
                        text: "Cancel",
                        handler: function () { },
                    },
                    {
                        text: "Ok",
                        handler: function (data) {
                            _this.warnings.simpleNavAway = data.length > 0;
                            _this.simpleBotActive = false;
                            _this.activeBot = DefaultBotName;
                            _this.setAutoType(dest);
                            _this.saveState();
                        },
                    },
                ],
            });
            alert_3.present();
            return;
        }
        this.activeBot = DefaultBotName;
        this.manual = dest;
        this.clearLimitOrders();
        this.saveState();
    };
    HomePage.prototype.openPip = function (id) {
        this.pipVid = false;
        this.radio = false;
        var radio = id == 'radio';
        if (!radio) {
            this.pipVid = id;
        }
        else {
            this.radio = true;
        }
        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById(elmnt.id + "header")) {
                // if present, the header is where you move the DIV from:
                document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            }
            else {
                // otherwise, move the DIV from anywhere inside the DIV: 
                elmnt.onmousedown = dragMouseDown;
            }
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
        dragElement(document.getElementById(radio ? "radioFrame" : "pipFrame"));
    };
    HomePage.prototype.syncUpgradeModes = function () {
        if (this.unlockModeState) {
            if (this.unlockModeState.etf) {
                this.purchasedUpgrades.push("etf");
            }
            if (this.unlockModeState.crypto) {
                this.purchasedUpgrades.push("crypto");
            }
            if (this.unlockModeState.sandbox) {
                this.purchasedUpgrades.push("sandbox");
            }
        }
    };
    HomePage.prototype.progressUpgradeTo = function (upgrade, supress) {
        var _this = this;
        if (supress === void 0) { supress = false; }
        var kys = Object.keys((this.demo ? demoUpgrades : rawUpgrades));
        kys.sort(function (a, b) {
            return (_this.demo ? demoUpgrades : rawUpgrades)[a].reward - (_this.demo ? demoUpgrades : rawUpgrades)[b].reward;
        });
        for (var i = 0; i < kys.length; i++) {
            if (kys[i] == upgrade) {
                this.processUpgrade(kys[i], supress);
                break;
            }
            else {
                this.processUpgrade(kys[i], true);
            }
        }
        this.setTradeVol();
    };
    HomePage.prototype.mainMenuButton = function (type) {
        var _this = this;
        // debug ()()()()
        if (this.debugParam) {
            var lowerParam = this.debugParam.toLowerCase();
            if (this.debugParam == 'intro') {
                this.startTutorial('intro');
            }
            else {
                Object.keys((this.demo ? demoUpgrades : rawUpgrades)).forEach(function (key) {
                    if (key.toLowerCase() == lowerParam) {
                        _this.debugParam = key;
                    }
                });
                setTimeout(function () {
                    if ((_this.demo ? demoUpgrades : rawUpgrades)[_this.debugParam]) {
                        _this.progressUpgradeTo(_this.debugParam);
                    }
                    else if (_this.debugParam.toLowerCase() == 'margincall') {
                        _this.progressUpgradeTo(marginUpgrade);
                    }
                    else if (_this.debugParam.toLowerCase() == 'demo') {
                        _this.startTutorial('intro');
                    }
                    else if (_this.debugParam.toLowerCase() == 'test') {
                        _this.progressUpgradeTo('sandbox', true);
                    }
                    else if (_this.debugParam.toLowerCase() !== 'debugsimple' && _this.debugParam.toLowerCase() !== 'debugnodes') {
                        alert('upgrade "' + _this.debugParam + '" does not exist');
                    }
                    else {
                        // ----------- DEBUG INSTRUCTIONS ---------
                        _this.debugUpgrade();
                        _this.addCash(500);
                        _this.advancedBots[DefaultSimpleBotName] = basicSimpleBot;
                        _this.activeBot = DefaultSimpleBotName;
                        if (_this.debugParam.toLowerCase() == 'debugnodes') {
                            _this.manual = 3;
                            _this.openBot();
                        }
                        //-----------------------------------------
                    }
                }, 400);
            }
        }
        //------------
        if (!this.unlockModeState[type] && type !== 'stock') {
            return;
        }
        //console.log(this.unlockModeState)
        this.calcExtraAvail();
        this.syncUpgradeModes();
        if (type == 'sandbox') {
            // console.log(this.sandbox)
            this.sandbox.new = false;
        }
        this.playSFX('generic');
        this.mainMenu = false;
        setTimeout(function () {
            _this.mainMenuEnd = true;
        }, 1000);
        this.showAd[0] = false;
        if (this.showAd[1]) {
            clearTimeout(this.showAd[1]);
        }
        /*
            clearInterval(this.animationInterval);
           
            this.configAnim.candlestick.ichimoku = false;
            this.configAnim.candlestick.atrTrailingStop = [];
            this.configAnim.candlestick.bollinger = [];
         */
        //delete this.configAnim;
        this.mode = type;
        if (type == 'stock') {
            //console.log(this.dateKeyIndex==-1,this.purchasedUpgrades.length==0,this.tutHold==-1);
            if (this.demoProgress) {
                this.generalPopup("Demo Progress", "Thank you for purchasing Trade Bots after playing the demo. Your 'Learn & Earn' revenue will be credited upon unlocking and any extras earned have been transferred, including the tutorial.");
                this.demoProgress = false;
            }
            else {
                if ((this.dateKeyIndex == -1 && this.purchasedUpgrades.length == 0) || this.tutHold == -1) {
                    this.tutHold = 0;
                    this.firstTimePop();
                }
            }
            if (!this.currentTicker) {
                this.initStock();
            }
            else {
                if (!this.lastSaveCampaign) {
                    persistVars.forEach(function (data) {
                        _this[data] = _this.campaignStore[data];
                    });
                }
                this.proceedData();
                //this.initStock(this.currentTicker[this.currentTicker.length - 1]) 
            }
        }
        else {
            this.storage.get(storageID + (this.demo ? '_demo' : '') + "_" + this.mode).then(function (val) { return __awaiter(_this, void 0, void 0, function () {
                var sharedMilestones, defaultConfig;
                var _this = this;
                return __generator(this, function (_a) {
                    if (!val) {
                        sharedMilestones = [];
                        Object.keys(milestones).forEach(function (milestone) {
                            if (_this.purchasedUpgrades.includes(milestone) && !milestones[milestone].unique) {
                                sharedMilestones.push(milestone);
                            }
                        });
                        // load from defaults
                        uniquePersist.forEach(function (field) {
                            if (typeof _this.defaults[field] !== 'undefined') {
                                //console.log('set',field);
                                _this[field] = JSON.parse(JSON.stringify(_this.defaults[field]));
                            }
                        });
                        if (this.mode == 'sandbox') {
                            this.increaseMaxSim(999999);
                        }
                        else {
                            this.obfuscateYear = !this.purchasedUpgrades.includes("yearreveal");
                            this.config.hideYears = this.obfuscateYear;
                            this.purchasedUpgrades = this.purchasedUpgrades.concat(sharedMilestones);
                            defaultConfig = JSON.parse(JSON.stringify(configDefault));
                            this.config = defaultConfig;
                        }
                        //setTimeout(()=>{},50)
                        //console.error("init mode")
                        this.initStock();
                        this.processUpgrade('step', true);
                        this.processUpgrade('margin', true);
                        this.modePop();
                        //console.error("no storage for "+this.mode+" this breaks things?")
                    }
                    else {
                        // console.error('this fires?');
                        uniquePersist.forEach(function (field) {
                            _this[field] = val[field];
                        });
                        this.simSpeed[0] = 0;
                        this.proceedData();
                    }
                    return [2 /*return*/];
                });
            }); });
        }
    };
    HomePage.prototype.modePop = function () {
        var message = "";
        if (this.mode == 'sandbox') {
            message = "Control All Aspects of the Simulation";
        }
        else if (this.mode == 'etf') {
            message = "Re-Play the Main Game with a pool of ETFs";
        }
        else if (this.mode == 'crypto') {
            message = "Re-Play the Main Game with Cryptocurrencies";
        }
        this.notification(['info', "Welcome to " + this.mode.toUpperCase() + " MODE", message]);
    };
    HomePage.prototype.calcInterestRate = function () {
        var port = this.cashVsInvested[0] + this.cashVsInvested[1] + this.limDeduction[0] - this.loanData.amt;
        if (port < 1) {
            port = 1;
        }
        var rate = -.424 * Math.log(port) + 13.172 + .9;
        if (rate > startingInterestRate) {
            rate = startingInterestRate;
        }
        //if (rate > this.loanData.rate) { rate = this.loanData.rate }
        this.loanData.rate = Math.floor(rate * 100) / 100;
        //console.log(rate);
        this.loanData.rate -= this.loanData.upgradeMinus;
        // console.log(this.loanData.rate);
        this.loanData.mo = Math.floor((this.loanData.rate * this.loanData.amt) / 12) / 100;
    };
    HomePage.prototype.openLog = function (name) {
        this.tutClick(211);
        console.error(name);
        this.globalModal = this.modalCtrl.create(logsModal, { log: this.advancedBots[name].logs, name: name, tutState: this.tutorialState[0], read: this.advancedBots[name].read }, { cssClass: '' });
        this.globalModal.present();
    };
    HomePage.prototype.changeDataType = function (e) {
        // do we reimport every time?
        if (e == "custom") {
            this.globalModal = this.modalCtrl.create(customDataModal, {}, { cssClass: '' });
            this.globalModal.present();
        }
        console.error("handle transition to different data type " + e);
    };
    HomePage.prototype.calcExtraAvail = function () {
        var _this = this;
        var rewards = 0;
        Object.keys(this.opportunities).forEach(function (key) {
            if (!_this.opportunities[key].completed) {
                rewards += _this.opportunities[key].reward;
            }
        });
        this.extraAvail = rewards;
    };
    HomePage.prototype.extraMenu = function (id) {
        if (id === void 0) { id = false; }
        this.calcExtraAvail();
        this.globalModal = this.modalCtrl.create(extrasModal, {
            data: this.opportunities,
            reward: this.extraAvail,
            id: id
        }, { cssClass: 'extrasModal' });
        this.globalModal.present();
        // this.opportunities[key].completed
        //calcExtraAvail()
    };
    HomePage.prototype.proceedData = function () {
        //console.log(this.unlockModeState);
        //console.log(this.idleData);
        if (this.mode == 'sandbox') {
            this.increaseMaxSim(999999);
        }
        this.setDimensions();
        this.chartsProvider.render("#d3el", this.config);
        this.setTradeVol();
        this.upcomingUpgrades();
        this.calcAvailUpgrades();
        this.calcLearnEarn();
        this.YrsElapsed = Math.ceil((this.currentDate - this.currentData[0].date) / 31536000000);
        this.obfuscateYear = !this.purchasedUpgrades.includes("yearreveal");
        this.config.hideYears = this.obfuscateYear;
        //--------idleMode
        var currentTime = new Date().getTime();
        console.log(this.dateKeyIndex, this.currentData.length);
        if (this.dateKeyIndex == this.currentData.length - 1) {
            this.stockDone();
        }
        else if (this.purchasedUpgrades.includes('idle') && (currentTime - this.idleData.stamp > 3700000) && this.simSpeed[2] < 80) {
            this.globalModal = this.modalCtrl.create(idleModal, {
                data: this.idleData,
                maxSim: this.simSpeed[2],
                realSim: this.showRealSim(this.simSpeed[2] / 10)
            }, { cssClass: 'modalIdle' });
            this.globalModal.present();
        }
    };
    HomePage.prototype.openFileWith = function (file, filename) {
        var _this = this;
        if (this.navCtrl.getActive().name == "BaklavaPage") {
            var alert_4 = this.alertCtrl.create({
                title: "Overwrite Bot",
                message: "Overwrite current bot with file?",
                buttons: [
                    {
                        text: "Cancel",
                        handler: function (data) {
                        },
                    },
                    {
                        text: "Overwrite",
                        handler: function (data) {
                            var reader = new FileReader();
                            file = file.target.files[0];
                            reader.onload = function () {
                                //reader.result
                                var U8 = new Uint8Array(reader.result);
                                var decompressed = fflate.decompressSync(U8);
                                var bot = fflate.strFromU8(decompressed);
                                _this.events.publish("loadBotFile", JSON.parse(bot));
                            };
                            reader.onerror = function () {
                                console.error(reader.error);
                            };
                            reader.readAsArrayBuffer(file);
                        },
                    },
                ],
            });
            alert_4.present();
        }
        else {
            if (this.purchasedUpgrades.includes("botPort2")) {
                var alert_5 = this.alertCtrl.create({
                    title: "New Bot From File",
                    message: "Create a new bot from this file?",
                    buttons: [
                        {
                            text: "Cancel",
                            handler: function (data) {
                            },
                        },
                        {
                            text: "Create",
                            handler: function (data) {
                                if (!_this.advancedBots[filename]) {
                                    _this.updateUnlockBaklavaState();
                                    var reader_1 = new FileReader();
                                    file = file.target.files[0];
                                    reader_1.onload = function () {
                                        //reader.result
                                        var U8 = new Uint8Array(reader_1.result);
                                        var decompressed = fflate.decompressSync(U8);
                                        var bot = fflate.strFromU8(decompressed);
                                        _this.activeBot = filename;
                                        _this.navCtrl.push(BaklavaPage, _this.baklavaParams({ name: filename, mode: 1, logs: [], sim: 0, gains: null, data: JSON.parse(bot) }));
                                    };
                                    reader_1.onerror = function () {
                                        console.error(reader_1.error);
                                    };
                                    reader_1.readAsArrayBuffer(file);
                                }
                                else {
                                    _this.generalPopup("Name Taken", "Please rename file to be unique");
                                    _this.playSFX('error');
                                    return false;
                                }
                            },
                        },
                    ],
                });
                alert_5.present();
            }
            else {
                this.generalPopup("Unlock Bot Import", "Visual Bot Importing has not yet been unlocked. Finish the main campaign.");
                this.playSFX('error');
            }
        }
    };
    HomePage.prototype.debugBtn = function () {
        this.calcResistance();
    };
    HomePage.prototype.calcResistance = function () {
        var adjusted = -1;
        var index = this.dateKeyIndex;
        if (this.chartsProvider.brushed) {
            var end = this.chartsProvider.getCurrentBrush().endDate;
            for (var i = this.dateKeyIndex; i > 0; i--) {
                if ((new Date(this.currentData[i].date).getTime() - new Date(end).getTime()) / 1000 <= 0) {
                    index = i;
                    break;
                }
            }
        }
        index = index + adjusted;
        var obj = { 'c': null, 'h': null, 'l': null };
        //console.log(dayData);
        obj.c = this.currentData[index].close;
        obj.h = this.currentData[index].high;
        obj.l = this.currentData[index].open;
        // floorPivots, Demarks, Woddies, fibRetracements
        return tw.floorPivots([obj])[0].floor;
    };
    HomePage.prototype.calcPivots = function (startIndex, endIndex) {
        var points = [];
        var obj = { 'c': null, 'h': null, 'l': null };
        for (var i = startIndex; i < endIndex; i++) {
            var dayData = this.currentData[i];
            //console.log(dayData);
            obj.c = dayData.close;
            obj.h = dayData.high;
            obj.l = dayData.open;
            points.push(obj);
        }
        return tw.floorPivots(points);
    };
    HomePage.prototype.resetStorage = function () {
        var _this = this;
        if (!this.debug) {
            var alert_6 = this.alertCtrl.create({
                title: "Are You Sure?",
                message: "Delete All Save Data and Restore Defaults? This cannot be undone.",
                buttons: [
                    {
                        text: "Cancel",
                        handler: function (data) {
                        },
                    },
                    {
                        text: "Delete",
                        handler: function (data) {
                            _this.storageKillSwitch = true;
                            _this.storage.clear().then(function () {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 0);
                            });
                        },
                    },
                ],
            });
            alert_6.present();
        }
        else {
            this.storageKillSwitch = true;
            this.storage.clear().then(function () {
                setTimeout(function () {
                    window.location.reload();
                }, 0);
            });
        }
    };
    HomePage.prototype.firstTimePop = function () {
        if (!this.debug) {
            this.startTutorial('intro');
        }
        ;
    };
    HomePage.prototype.startTutorial = function (id) {
        // return iff not stock
        if (this.getActive('type') !== 'Stock') {
            console.warn('tutorial not initing because not stock mode');
            return;
        }
        this.tutorialDB[id].unlocked = true;
        this.tutorialState = [this.tutorialDB[id].start, id];
        if (id == 'intro') {
            this.globalModal = this.modalCtrl.create(tutorialModal, { id: id, demo: this.demo
            }, { enableBackdropDismiss: false, cssClass: 'tutorialModal' });
            this.globalModal.present();
        }
        else if (id == 'longshort') {
            this.toggleBuyVSell(true);
            if (this.totalPortfolio < 0.1) {
                this.quickCash(50);
            }
            else if (this.cashVsInvested[1] !== 0) {
                this.portfolio[1] = 0;
                this.cashVsInvested = [this.portfolio[0], 0];
                this.notification(['success', 'All Stock Sold', 'Holdings Liquidated']);
            }
        }
    };
    HomePage.prototype.showAds = function () {
        var _this = this;
        var avail = [];
        Object.keys(this.opportunities).forEach(function (ky) {
            if (_this.opportunities[ky].adNum && !_this.opportunities[ky].completed) {
                avail.push(ky);
            }
        });
        if (avail.length > 0) {
            this.currAd = avail[Math.floor(Math.random() * avail.length)];
            this.showAd[1] = setTimeout(function () {
                //this.playSFX('mode');
                _this.showAd[0] = true;
            }, Math.floor((Math.random() * 3 + 2) * 1000));
        }
    };
    HomePage.prototype.tickerIndex = function (lower, upper) {
        var _this = this;
        var stockUpperClamp = 4500; // tweak if you have missing info
        if (this.mode == 'stock' && stockUpperClamp < upper) {
            upper = stockUpperClamp;
        }
        var totalEarned = this.portfolio[0];
        //console.log(this.purchasedUpgrades)
        this.purchasedUpgrades.forEach(function (id) {
            if ((_this.demo ? demoUpgrades : rawUpgrades)[id] && typeof (_this.demo ? demoUpgrades : rawUpgrades)[id].cost !== "undefined") {
                totalEarned += (_this.demo ? demoUpgrades : rawUpgrades)[id].cost / 1.5;
            }
            else {
                console.warn(id + " not defined in (this.demo?demoUpgrades:rawUpgrades) or cost is not");
            }
        });
        //console.log(totalEarned,this.statsData.portfolioHistory.length)
        //var rez = Math.floor(Math.pow(totalEarned,.4))
        if (totalEarned < 1) {
            totalEarned = 1;
        }
        var rez = 342 * Math.log(totalEarned) - 2314 - Math.sqrt(this.statsData.portfolioHistory.length);
        rez = Math.floor(rez);
        if (rez > upper) {
            rez = upper - Math.floor(Math.random() * 100);
        }
        else if (rez < 0 || isNaN(rez)) {
            rez = Math.floor(Math.random() * 10);
        }
        console.warn('index generated of ' + this.getActive("tickers").length, rez);
        return rez;
    };
    HomePage.prototype.getActive = function (param) {
        var type = (this.mode == 'sandbox' ? this.sandbox.type : this.mode);
        if (param == "type") {
            if (this.mode == "stock" || (this.mode == 'sandbox' && this.sandbox.type == "stock")) {
                type = "Stock";
            }
            else if (this.mode == "etf" || (this.mode == 'sandbox' && this.sandbox.type == "etf")) {
                type = "ETF";
            }
            else if (this.mode == "crypto" || (this.mode == 'sandbox' && this.sandbox.type == "crypto")) {
                type = "Crypto";
            }
            else {
                type = "Custom";
            }
            return type;
        }
        if (type == "stock") {
            if (param == "tickers") {
                return MTactiveTickers;
            }
            else if (param == "scores") {
                return mtScores;
            }
            else if (param == "db") {
                return mtDB;
            }
            else if (param == "start") {
                return mtStartIndex;
            }
            else if (param == "path") {
                return "MTstocks";
            }
        }
        else if (type == "etf") {
            if (param == "tickers") {
                return etfActiveTickers;
            }
            else if (param == "scores") {
                return etfScores;
            }
            else if (param == "db") {
                return etfDB;
            }
            else if (param == "start") {
                return {};
            }
            else if (param == "path") {
                return "etfs";
            }
        }
        else if (type == "crypto") {
            if (param == "tickers") {
                return cryptoActiveTickers;
            }
            else if (param == "scores") {
                return cryptoScores;
            }
            else if (param == "db") {
                return cryptoDB;
            }
            else if (param == "start") {
                return {};
            }
            else if (param == "path") {
                return "crypto";
            }
        }
        else if (type == "custom") {
            alert('DO custom logic');
        }
    };
    HomePage.prototype.tickerSelect = function () {
        var _this = this;
        var type = this.mode == 'sandbox' ? this.sandbox.type : this.mode;
        var currentActive;
        var activeTickers = this.getActive("tickers");
        // Rando
        var removeSet = new Set(this.finishedStocks);
        var availableTickers = this.getActive("tickers").filter(function (name) {
            // return those elements not in the namesToDeleteSet
            return !removeSet.has(name);
        });
        availableTickers.sort(function (a, b) {
            return _this.calculatedScores[type][b] - _this.calculatedScores[type][a];
        });
        console.log(availableTickers.length);
        //return "LNG"; //MSFT ()()()()
        //console.log(activeTickers.length);
        //console.log(this.finishedStocks.length)
        //console.log(this.finishedStocks.length/activeTickers.length)
        if (this.finishedStocks.length / activeTickers.length > .99) {
            var rand = Math.floor(Math.random() * activeTickers.length);
            console.warn('random index generated of ' + this.getActive("tickers").length, rand);
            return activeTickers[rand];
        }
        else {
            return availableTickers[this.tickerIndex(0, activeTickers.length)];
        }
        //this.portfolio[0]
        //-------------------------------------------
        // Choose based on Amount of cash: 
        //bias for this.portfolio[0]
        // not as simple as just what stock makes the most money, why shorting is important.... what criteria is useful here. i wonder if you could make criteria for how well ones adhere to technical analysis????? hm...
        //Object.keys(scores)
    };
    HomePage.prototype.getRelativeDate = function (DaysAgo) {
        return this.currentData[this.dateKeyIndex - DaysAgo].date;
    };
    HomePage.prototype.quickCash = function (amt) {
        this.notification(['success', '$' + amt, 'Added to Account']);
        this.addCash(amt);
        this.setTradeVol();
    };
    HomePage.prototype.randomTimeInterval = function (data) {
        var percentBound = .05; // max amount that could be cropped
        var max = data.length - Math.floor(Math.random() * percentBound * data.length);
        var min = Math.floor(Math.random() * percentBound * data.length);
        //console.log(data.slice(min,max));
        //console.log(data)
        return data.slice(min, max);
    };
    HomePage.prototype.graphicalOnus = function () {
        // console.log(this.chartsProvider.charts.candlestick.data.)
        //@ts-ignore
        var days = this.chartsProvider.brushed ? this.chartsProvider.getBrushSize().tradingDays : this.chartsProvider.charts.candlestick.data.length;
        var paths = document.querySelectorAll("path").length;
        var els = document.querySelectorAll('g:not(.tick):not(.axis)').length;
        //console.warn('graphical proxys',days,paths,els); 206
        var complexity = ((paths + els - 19) * .4895);
        if (complexity <= 1) {
            complexity = 1;
        }
        return [days, complexity];
    };
    HomePage.prototype.initStock = function (tick, fullStock, info) {
        var _this = this;
        if (tick === void 0) { tick = null; }
        if (fullStock === void 0) { fullStock = false; }
        if (info === void 0) { info = false; }
        //console.log('this fireess');
        //this.loadGraphs();
        //this.setTradeVol();
        this.upcomingUpgrades();
        this.calcAvailUpgrades();
        this.calcLearnEarn();
        this.dateKeyIndex = -1;
        this.statsData.riseFall = [];
        this.cumulativeGain = 1;
        // this.chartsProvider.render(null, null);
        var ticker;
        if (tick) {
            ticker = tick;
        }
        else {
            ticker = this.tickerSelect();
        }
        /*
        this.getActive("tickers")
    this.getActive("db")
    this.getActive("scores")
    
    
    */
        //this.chartsProvider.clearBrush()
        if (info && !this.warnings.autoContinue) {
            var message = "";
            var type = this.getActive("type");
            if (!this.purchasedUpgrades.includes('name')) {
                this.notification(['success', 'New ' + type, 'Unknown ' + type + ' Loaded']);
            }
            else {
                this.notification(['success', this.getActive("db")[ticker][0], 'New ' + type + ' Loaded']);
            }
        }
        if (this.debugParam && (this.debugParam.toLowerCase() == 'debugsimple' || this.debugParam.toLowerCase() == 'debugnodes')) {
            ticker = "BNTX";
        }
        if (this.debugParam && this.debugParam.toLowerCase() == 'test') {
            ticker = "XOMA";
        }
        console.log("load Ticker: " + ticker, this.getActive("scores")[ticker], this.getActive("start")[ticker]); //,
        this.currentTicker = this.getActive("db")[ticker];
        this.currentTicker[5] = ticker;
        d3.csv("assets/" + this.getActive("path") + "/" + ticker + ".csv", function (error, data) { return __awaiter(_this, void 0, void 0, function () {
            function dateAdj(date) {
                if (parseInt(date.slice(0, 2)) > 30) {
                    return '19' + String(date);
                }
                else {
                    return '20' + String(date);
                }
            }
            var parseDate, defaultConfig, refData, refData2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parseDate = d3.timeParse("%Y%m%d");
                        if (this.sandbox && !this.sandbox.crop || this.debugParam && (this.debugParam.toLowerCase() == 'debugsimple' || this.debugParam.toLowerCase() == 'debugnodes')) {
                            // no data cropping
                        }
                        else {
                            data = this.randomTimeInterval(data);
                        }
                        this.isStockDoneAlert = false;
                        //console.log(dateAdj(data[0].sdate))
                        //console.log(data.slice(mtStartIndex[ticker])[0].sdate)
                        this.currentData = data.slice(this.getActive("start")[ticker] || 0).map(function (d) { return ({
                            rawDate: d.sdate,
                            date: parseDate(dateAdj(d.sdate)),
                            open: +d.open / 1000,
                            high: +d.high / 1000,
                            low: +d.low / 1000,
                            close: +d.close / 1000,
                            adj: +d.adj / 1000,
                            volume: +d.vol00 * 100,
                        }); });
                        defaultConfig = JSON.parse(JSON.stringify(configDefault));
                        //persist config one stock to the next
                        if (this.config) {
                            this.config.data = defaultConfig.data;
                            this.config.candlestick.trades = [];
                        }
                        else {
                            this.config = defaultConfig;
                        }
                        this.config.data = {
                            portfolio: [],
                            close: this.currentData.map(function (d) { return ({
                                date: d.date,
                                value: d.close,
                            }); }),
                            adjClose: this.currentData.map(function (d) { return ({
                                date: d.date,
                                adj: marketMovement[d.rawDate],
                            }); }),
                        };
                        this.setDimensions();
                        //console.error(startingRecords + this.dateKeyIndex)
                        return [4 /*yield*/, this.pushData(startingRecords + this.dateKeyIndex + 2, true, false, false, true)];
                    case 1:
                        //console.error(startingRecords + this.dateKeyIndex)
                        _a.sent();
                        refData = this.config.data;
                        refData2 = this.config.portfolio.data;
                        // window["x"] = (n) => {
                        //   this.config.data = refData.slice(0,n);
                        //   this.config.portfolio.data = refData2.slice(0,n);
                        //   this.config.candlestick.trades = [];
                        //   this.chartsProvider.render("#d3el", this.config);
                        // };
                        //console.log(this.mode);
                        if (this.mode == 'sandbox') {
                            Object.keys((this.demo ? demoUpgrades : rawUpgrades)).forEach(function (upgrade) {
                                _this.processUpgrade(upgrade, true);
                            });
                            Object.keys(milestones).forEach(function (milestone) {
                                _this.processUpgrade(milestone, true);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        this.toggleBuyVSell(true);
        this.saveState();
    };
    HomePage.prototype.toggleLeadingIndicator = function (id) {
        this.config.candlestick[id] = !(this.config.candlestick[id]);
        this.chartsProvider.render("#d3el", this.config);
        if (this.config.candlestick[id]) {
            this.playSFX('generic');
        }
    };
    HomePage.prototype.toggleLongSort = function () {
        this.longVsShort = !this.longVsShort;
    };
    HomePage.prototype.addCash = function (amt) {
        var invested = this.portfolio[1] * this.portfolio[0];
        var cash = (1 - this.portfolio[1]) * this.portfolio[0];
        this.infusedCash += amt;
        if (amt > 0) {
            this.portfolio[2] = true;
        }
        cash += amt;
        //console.log(invested,cash);
        this.portfolio[0] = this.portfolio[0] + amt;
        if (invested == 0) {
            this.portfolio[1] = 0;
        }
        else {
            this.portfolio[1] = invested / (cash + invested);
        }
        if (this.portfolio[1] > 1) {
            this.portfolio[1] = 1;
        }
        else if (this.portfolio[1] < 0) {
            //this.marginCall();
            this.portfolio[1] = 0;
        }
        if (this.portfolio[0] < 0) {
            //this.negativeCapital();
        }
        this.investedSkin = Math.floor(this.portfolio[1] * 100);
        if (this.loanData.amt == 0) {
            this.calcInterestRate();
        }
    };
    HomePage.prototype.hideShowElement = function (classs, hidevsshow) {
        var ele = document.querySelector(classs);
        if (ele) {
            ele.style.visibility = hidevsshow ? "hidden" : "visible";
        }
        else {
            console.log("element not found");
        }
    };
    HomePage.prototype.defineSimpleBot = function (entry) {
        this.tutClick(202);
        this.tutClick(208);
        this.tutClick(250);
        this.tutClick(300);
        this.globalModal = this.modalCtrl.create(simpleBotModal, {
            rules: this.simpleBot,
            fee: this.fee,
            tutState: this.tutorialState[0],
            unlock: this.purchasedUpgrades.includes('simpleBots3') ? 2 : this.purchasedUpgrades.includes('simpleBots2') ? 1 : 0,
            entry: entry,
        }, { enableBackdropDismiss: false, cssClass: 'simpleBot' });
        /*
            this.globalModal.onDidDismiss((data) => {
        console.log('pass simple bot stuff?',data)
            });
        */
        this.globalModal.present();
    };
    HomePage.prototype.setDimensions = function () {
        var _this = this;
        if (!this.config) {
            return;
        }
        this.config.dims.width =
            window.innerWidth -
                this.config.dims.margin.right -
                this.config.dims.margin.left;
        this.config.candlestick.dims.width = this.config.dims.width;
        this.config.dims.height = Math.floor(window.innerHeight * verticalProportion - 145);
        var leftover = verticalProportion;
        if (!this.config.portfolio.hide) {
            var ht = 0.12 * verticalProportion;
            leftover = leftover - ht;
            this.config.portfolio.dims.height = Math.floor(this.config.dims.height * ht);
            //console.log(this.config.portfolio.dims.height)
        }
        this.visibleExtraGraphs.forEach(function (graph) {
            var ht = 0.2 * verticalProportion;
            leftover = leftover - ht;
            _this.config[graph].dims.height = Math.floor(_this.config.dims.height * ht);
        });
        this.config.candlestick.dims.height =
            Math.floor(leftover * this.config.dims.height) - 20;
        //console.log(this.config)
    };
    HomePage.prototype.processUpgrade = function (id, supress) {
        if (supress === void 0) { supress = false; }
        console.log(id);
        //console.log(id);
        /*
            if (!this.warnings.marginCallWarn && (this.demo?demoUpgrades:rawUpgrades)[id].cost>800 && !supress){
        this.marginCallPop(true);
        this.stopSim();
            }
        */
        if (!(this.demo ? demoUpgrades : rawUpgrades)[id]) {
            console.warn('no upgrade with id:' + id + 'adding to purchasedUpgrades anyway');
            this.purchasedUpgrades.push(id);
            if (id == "pip") {
                this.warnings.new.pip = true;
            }
            if (id == "techanRadio") {
                this.warnings.new.techanRadio = true;
            }
            return;
        }
        if (!this.debug && this.purchasedUpgrades.includes(id)) {
            console.error('upgrade already unlocked: ' + id);
            return;
        }
        if (id == "step") {
            if (this.tutorialState[0] == 2) {
                this.tutorialState[0] = 3;
            }
        }
        else if (id == "margin") {
            if (this.tutorialState[0] == 7) {
                this.tutorialState[0] = 8;
            }
        }
        else if (id == marginUpgrade) {
            if (this.totalPortfolio < 0 && this.loanData.amt > 0) {
                this.addCash(Math.abs(this.totalPortfolio));
                this.notification(['success', 'Loan Losses Forgiven', '$' + Math.floor(Math.abs(this.totalPortfolio) * 100) / 100 + ' added to account']);
            }
        }
        else if (id == "volume") {
            //console.log("fires");
            //console.log(document.querySelector(".volume"));
            this.config.candlestick.showVolume = true;
            this.chartsProvider.render("#d3el", this.config);
            this.warnings.new.ovr = true;
        }
        else if (id.slice(0, 13) == "marginpercent") {
            this.marginCallPercent += parseInt(id.split("_")[1]) / 100;
        }
        else if (id.slice(0, 7) == "speedup") {
            this.increaseMaxSim(parseFloat(id.split("_")[1]));
            //parseInt(id.split("_")[1])
            //this.maxSim = this.maxSim + parseInt(id.split("_")[1]);
            //this.simRec = this.maxSim; //Math.floor(this.maxSim/2)
        }
        else if (id.slice(0, 4) == "fees") {
            this.fee = this.fee - parseFloat(id.split("_")[1]) / 100;
            if (this.fee < 0) {
                this.fee = 0;
            }
            this.setTradeVol();
        }
        else if (id.slice(0, 7) == "loanMax") {
            this.loanData.max = this.loanData.max * parseInt(id.split("_")[1]);
            //console.error((this.demo?demoUpgrades:rawUpgrades)[id].name)
            if ((this.demo ? demoUpgrades : rawUpgrades)[id].name.toLowerCase().includes("margin call") && !this.warnings.marginCallWarn) {
                this.warnings.marginCallWarn = true;
                /*
                if (!supress){
                this.marginCallPop()
                }
                */
            }
            this.calcInterestRate();
            this.setTradeVol();
        }
        else if (id.slice(0, 8) == "interest") {
            this.loanData.upgradeMinus += parseInt(id.split("_")[1]);
            this.calcInterestRate();
            this.setTradeVol();
        }
        else if (id.slice(0, 11) == "restartLoan") {
            this.statsData.addedMaxLoan += parseInt(id.split("_")[1]);
        }
        else if (id.slice(0, 7) == "restart") {
            this.statsData.startingCash += parseInt(id.split("_")[1]);
        }
        else if (id == "limitstop") {
            this.warnings.new.auto = true;
            //this.purchasedUpgrades.push("stop");
            //this.manual = 1;
        }
        else if (id == "longshort") {
            this.longShortShow = true;
        }
        else if (id == "adjclose") {
            // process adjusted close
        }
        else if (id == "stats") {
            this.showStats = true;
        }
        else if (id == "yearreveal") {
            this.obfuscateYear = false;
            this.config.hideYears = false; // need to unhide everything all at once)
        }
        else if (id == "price") {
            this.obfuscatePrice = false;
            this.config.candlestick.supstance.annotationVisibility[0] = true;
            this.config.candlestick.showPriceInLeftAxis = true;
        }
        else if (id == "marketIndex" && !this.balanceOptions.suppress) {
            this.warnings.new.brush = true;
            this.config.portfolio.showAdjClose = true;
            this.reDraw();
        }
        else if (id == "gains" && !this.balanceOptions.suppress) {
            this.warnings.new.brush = true;
            this.config.portfolio.showPortfolio = true;
            this.reDraw();
        }
        else if (id == "vizBots") {
            if (!this.advancedBots[DefaultSimpleBotName]) {
                this.notification(['warning', 'Simple Bot Undefined', 'Setting Default Bot']);
                this.advancedBots[DefaultSimpleBotName] = basicSimpleBot;
            }
            for (var i = this.limitStops.length - 1; i > -1; i--) {
                this.rmLimitStop(i);
            }
            this.limitStops = [];
            this.simpleBotActive = false;
            this.manual = 2;
            this.warnings.new.auto = true;
        }
        else if (id == "customMA") {
            this.warnings.new.ovr = true;
            //this.indiUnlock.movingavg = 1;
        }
        else if (id == "multipleMA") {
            this.warnings.new.ovr = true;
            //this.indiUnlock.movingavg = 2;
            // how
        }
        else if (id == "simpleBots") {
            this.warnings.new.auto = true;
            this.clearLimitOrders();
        }
        else if (id == "simpleBots2" || id == "simpleBots3") {
            if (!this.advancedBots[DefaultSimpleBotName]) {
                this.notification(['warning', 'Simple Bot Undefined', 'Setting Default Bot']);
                this.advancedBots[DefaultSimpleBotName] = basicSimpleBot;
            }
            if (!supress) {
                this.manual = 2;
            }
            this.clearLimitOrders();
        }
        else if (id == "exchange") {
            this.displayInfo = 1;
        }
        else if (id == "sector") {
            this.displayInfo = 2;
        }
        else if (id == "name") {
            this.displayInfo = 3;
        }
        else if (id == "brushing") {
            this.warnings.new.brush = true;
            this.config.portfolio.hide = false;
            this.reDraw();
        }
        else if (id == "sma") {
            this.warnings.new.ovr = true;
            this.config.candlestick.sma = [7];
            var ema = [];
            if (this.purchasedUpgrades.includes('ema')) {
                ema = [7];
            }
            this.movingAverages = {
                sma: [7],
                ema: ema,
                smaColors: [this.docStyle.getPropertyValue('--sma1')],
                emaColors: [this.docStyle.getPropertyValue('--ema1')],
            };
            this.chartsProvider.render("#d3el", this.config);
        }
        else if (id == "ema") {
            this.warnings.new.ovr = true;
            this.config.candlestick.ema = [7];
            var sma = [];
            if (this.purchasedUpgrades.includes('sma')) {
                sma = [7];
            }
            this.movingAverages = {
                sma: sma,
                ema: [7],
                smaColors: [this.docStyle.getPropertyValue('--sma1')],
                emaColors: [this.docStyle.getPropertyValue('--ema1')],
            };
            this.chartsProvider.render("#d3el", this.config);
        }
        else if (id == "sandbox") {
            this.sandbox = { repeat: false, sector: "all", fees: false, bailouts: true, crop: false, new: true, type: "stock" };
            this.unlockModeState["sandbox"] = { worth: 0 };
            this.setSandboxDates();
        }
        else if (id == "etf") {
            this.unlockModeState["etf"] = { worth: 0, progress: 0 };
        }
        else if (id == "crypto") {
            this.unlockModeState["crypto"] = { worth: 0, progress: 0 };
        }
        var extInd = ["atr", "adx", "aroon", "macd", "rsi", "stochastic", "williams"];
        var ovrInd = ["ichimoku", "pivots", "bollinger", "atrtrailingstop"];
        var leadingInd = ["marketIndex", "unemployment", "dxy", "housing", "yield", "industry", "vix", "recessions"];
        if (extInd.includes(id)) {
            this.warnings.new.ext = true;
        }
        else if (ovrInd.includes(id)) {
            this.warnings.new.ovr = true;
        }
        else if (leadingInd.includes(id)) {
            this.warnings.new.leading = true;
        }
        if (this.realVsDebugState() && extInd.includes(id) && this.visibleExtraGraphs.length < 2 && !supress && !this.balanceOptions.suppress) {
            this.toggleExtIndicator(id);
        }
        if (this.realVsDebugState() && ovrInd.includes(id) && !this.balanceOptions.suppress) {
            this.toggleOvrIndicator(id);
        }
        if (this.realVsDebugState() && leadingInd.includes(id) && !this.balanceOptions.suppress) {
            this.toggleLeadingIndicator(id);
        }
        if (!supress) {
            console.log((this.demo ? demoUpgrades : rawUpgrades)[id]);
            if ((this.demo ? demoUpgrades : rawUpgrades)[id].description && (this.demo ? demoUpgrades : rawUpgrades)[id].name) {
                console.log((this.demo ? demoUpgrades : rawUpgrades)[id].name, (this.demo ? demoUpgrades : rawUpgrades)[id].description);
                this.notification(['success', 'Unlocked: ' + (this.demo ? demoUpgrades : rawUpgrades)[id].name, (this.demo ? demoUpgrades : rawUpgrades)[id].description]);
            }
            else {
                console.warn('missing data for ' + id);
            }
        }
        this.purchasedUpgrades.push(id);
        this.calcLearnEarn();
        this.upcomingUpgrades();
        if (this.mode == 'stock' && (this.demo ? demoUpgrades : rawUpgrades)[id].popupTitle && (this.demo ? demoUpgrades : rawUpgrades)[id].popupTitle.length > 0 && !supress && (this.realVsDebugState() || this.debugParam)) {
            this.upgradePopup((this.demo ? demoUpgrades : rawUpgrades)[id].popupTitle, (this.demo ? demoUpgrades : rawUpgrades)[id].popupBody, this.tutorialState[0], id, this.tutorialDB[id]);
        }
        else if (!supress) {
            if (this.tutorialDB[id]) {
                this.startTutorial(id);
                if (id == marginUpgrade) {
                    this.warnings.marginCallWarn = false;
                }
            }
        }
        this.saveState();
    };
    HomePage.prototype.realVsDebugState = function () {
        return persist && !this.debugParam;
    };
    HomePage.prototype.ngAfterViewInit = function () {
        // this.initRawData("dowjones");
    };
    HomePage.prototype.toggleMA = function () {
        if (this.config.candlestick.sma.length > 0 ||
            this.config.candlestick.ema.length > 0) {
            this.config.candlestick.sma = [];
            this.config.candlestick.ema = [];
        }
        else {
            this.config.candlestick.sma = this.movingAverages.sma;
            this.config.candlestick.ema = this.movingAverages.ema;
        }
        this.reDraw();
    };
    HomePage.prototype.toggleVol = function () {
        this.config.candlestick.showVolume = !this.config.candlestick.showVolume;
        this.reDraw();
    };
    HomePage.prototype.toggleOvrIndicator = function (indi) {
        if (indi == "ichimoku") {
            this.config.candlestick.ichimoku = !this.config.candlestick.ichimoku;
            if (this.config.candlestick.ichimoku) {
                this.playSFX('generic');
            }
        }
        else if (indi == "pivots") {
            this.config.candlestick.supstance.show = !this.config.candlestick.supstance.show;
            if (this.config.candlestick.supstance.show) {
                this.playSFX('generic');
            }
        }
        else if (indi == "bollinger") {
            if (this.config.candlestick.bollinger.length > 0) {
                this.config.candlestick.bollinger = [];
            }
            else {
                this.config.candlestick.bollinger = [20];
                this.playSFX('generic');
            }
        }
        else if (indi == "atrtrailingstop") {
            if (this.config.candlestick.atrTrailingStop.length > 0) {
                this.config.candlestick.atrTrailingStop = [];
            }
            else {
                this.config.candlestick.atrTrailingStop = [14];
                this.playSFX('generic');
            }
        }
        else {
            console.error("no indicator exists by that name");
        }
        this.reDraw();
    };
    HomePage.prototype.toggleExtIndicator = function (indi) {
        var _this = this;
        //console.log(thing);
        this.config[indi].hide = !this.config[indi].hide;
        if (!this.config[indi].hide) {
            this.playSFX('generic');
        }
        var viz = [];
        var indicators = ["atr", "adx", "aroon", "macd", "rsi", "stochastic", "williams"];
        indicators.forEach(function (e) {
            if (!_this.config[e].hide) {
                viz.push(e);
            }
        });
        this.visibleExtraGraphs = viz;
        this.reDraw();
    };
    HomePage.prototype.reDraw = function () {
        this.setDimensions();
        this.updateChart();
        // if (this.chartsProvider.brushed) {
        //   const { startDate, endDate } = this.chartsProvider.getCurrentBrush();
        //   this.chartsProvider.renderThrottled("#d3el", this.config);
        //   this.chartsProvider.onRenderOnce(() => this.chartsProvider.setBrush(startDate, endDate));
        //   return;
        // }
        // this.chartsProvider.renderThrottled("#d3el", this.config);
    };
    HomePage.prototype.setColor = function (thing, color) {
        console.log(thing);
        document.body.style.setProperty(thing, color);
    };
    HomePage.prototype.initDefaults = function () {
        var _this = this;
        persistVars.forEach(function (field) {
            if (typeof _this[field] !== 'undefined') {
                _this.defaults[field] = JSON.parse(JSON.stringify(_this[field]));
            }
        });
    };
    HomePage.prototype.skipTutorial = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Skip Tutorial?",
            message: "If you skip you will not earn an extra $" + parseInt(this.tutorialDB[this.tutorialState[1]].reward).toLocaleString('en-US') + " for your account.",
            buttons: [
                {
                    text: "Cancel",
                    handler: function (data) {
                    },
                },
                {
                    text: "Skip",
                    handler: function (data) {
                        _this.tutorialState = [-1, null];
                    },
                },
            ],
        });
        alert.present();
    };
    HomePage.prototype.endTutorial = function () {
        if (!this.tutorialDB[this.tutorialState[1]]) {
            console.error('undefined tutorial?', this.tutorialState, this.tutorialDB);
        }
        else if (this.tutorialDB[this.tutorialState[1]].reward > 0) {
            this.notification(['success', this.tutorialDB[this.tutorialState[1]].prompt, '$' + this.tutorialDB[this.tutorialState[1]].reward + ' Added to Account']);
            this.addCash(this.tutorialDB[this.tutorialState[1]].reward);
            this.tutorialDB[this.tutorialState[1]].completed = true;
            this.tutorialState = [-1, null];
        }
    };
    HomePage.prototype.menuHov = function (enterexit) {
        var _this = this;
        if (this.tutorialState[0] == 15 && enterexit) {
            this.tutorialState[0] = 16;
        }
        else if (this.tutorialState[0] == 16 && !enterexit) {
            setTimeout(function () {
                _this.endTutorial();
                _this.setTradeVol();
                _this.saveState();
            }, 700);
        }
    };
    HomePage.prototype.autoHov = function (enterexit) {
        if (this.tutorialState[0] == 100 && enterexit) {
            this.tutorialState[0] = 101;
        }
        else if (this.tutorialState[0] == 101 && !enterexit) {
            this.tutorialState[0] = 100;
        }
        if (this.tutorialState[0] == 200 && enterexit) {
            this.tutorialState[0] = 201;
        }
        else if (this.tutorialState[0] == 201 && !enterexit) {
            this.tutorialState[0] = 200;
        }
    };
    HomePage.prototype.initState = function (store) {
        return __awaiter(this, void 0, void 0, function () {
            var toLoad;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (store.tutorialState && store.tutorialState[1] == 'intro') {
                            console.warn('not loading local storage because initial tutorial was not completed');
                            return [2 /*return*/];
                        }
                        if (!this.realVsDebugState()) {
                            console.warn('not loading local storage because persistance is removed');
                            return [2 /*return*/];
                        }
                        persistVars.forEach(function (field) {
                            _this[field] = store[field];
                            _this.campaignStore[field] = store[field];
                        });
                        sharedPersist.forEach(function (field) {
                            _this[field] = store[field];
                        });
                        Object.keys(this.opportunities).forEach(function (opp) {
                            Object.keys(_this.opportunities[opp]).forEach(function (sub) {
                                if (opp !== 'completed') {
                                    _this.opportunities[opp][sub] = opportunities[opp][sub];
                                }
                            });
                        });
                        this.simSpeed[0] = 0;
                        this.advancedBotNames = Object.keys(this.advancedBots);
                        if (!(this.paperState.mode !== -1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.unwrapPaper()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // regen currentData
                        //this.pushData(51);
                        if (this.fullscreenState && window["electron"]) {
                            window["electron"].fullscreen();
                        }
                        this.calcLearnEarn();
                        //console.log(storage)
                        //console.error(this.muteSFX);   
                        if (jumpToBaklava) {
                            this.updateUnlockBaklavaState();
                            this.activeBot = "debugBot";
                            if (this.advancedBots[this.activeBot]) {
                                this.navCtrl.push(BaklavaPage, this.baklavaParams(this.advancedBots[this.activeBot]));
                            }
                            else {
                                this.navCtrl.push(BaklavaPage, this.baklavaParams(debugBot));
                            }
                        }
                        if (this.mainMenu && (!this.music || !this.music.playing()) && !this.muteSFX) {
                            this.playMusic();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.copyBot = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Copy Existing Bot",
            message: "Make copy of an existing advanced bot",
            inputs: [
                {
                    type: "input",
                    label: "Bot Name",
                    value: this.activeBot + " copy",
                },
            ],
            buttons: [
                {
                    text: "Cancel",
                    handler: function (data) {
                    },
                },
                {
                    text: "Create",
                    handler: function (data) {
                        if (!_this.advancedBots[data[0]]) {
                            _this.advancedBots[data[0]] = JSON.parse(JSON.stringify(_this.advancedBots[_this.activeBot]));
                            _this.advancedBotNames = Object.keys(_this.advancedBots);
                        }
                        else {
                            _this.generalPopup("Name Taken", "Please choose a unique name");
                            _this.playSFX('error');
                            return false;
                        }
                    },
                },
            ],
        });
        alert.present();
    };
    HomePage.prototype.restartRemind = function () {
        var _this = this;
        if (this.remindCounter > 1) {
            return;
        }
        else {
            this.remindCounter = 60;
        }
        this.stopSim();
        var alert = this.alertCtrl.create({
            title: "Restarting",
            message: "You currently have a negative account balance. You can restart your progress at any time and hold on to any banked funds and rewards from 'learn and earn' quizzes. All upgrades will need to be re-purchased.",
            inputs: [
                {
                    type: "checkbox",
                    label: "Don't Show Again",
                    value: "dontshow",
                },
            ],
            buttons: [
                {
                    text: "Dismiss",
                    handler: function (data) {
                        _this.warnings.restartRemind = data.length > 0;
                    },
                },
                {
                    text: "Restart",
                    handler: function (data) {
                        _this.warnings.restartRemind = data.length > 0;
                        _this.restart();
                    },
                },
            ],
        });
        alert.present();
    };
    HomePage.prototype.deleteBot = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Are You Sure?",
            message: "Do You Wish to Delete This Bot Permenently?",
            buttons: [
                {
                    text: "Cancel",
                    handler: function (data) {
                    },
                },
                {
                    text: "Delete",
                    handler: function (data) {
                        delete _this.advancedBots[_this.activeBot];
                        _this.advancedBotNames = Object.keys(_this.advancedBots);
                        _this.baklava.deleteBot(_this.activeBot);
                    },
                },
            ],
        });
        alert.present();
    };
    HomePage.prototype.showTrace = function (trace, traceInfo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.navCtrl.getActive().instance instanceof BaklavaPage) {
                            //await this.navCtrl.pop();
                        }
                        return [4 /*yield*/, this.navCtrl.push(BaklavaPage, this.baklavaParams({ "name": DefaultTraceBotName, "mode": 1, "logs": [], "sim": 0, "gains": null, "data": trace }, traceInfo))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.upgradeSimpleBot = function () {
        var converted = JSON.parse(JSON.stringify(this.advancedBots[DefaultSimpleBotName]));
        this.openBot(true, converted);
    };
    HomePage.prototype.openBot = function (newbot, convert) {
        // let engineData: EngineData = {
        //   currentData: this.currentData,
        //   dateKeyIndex: this.dateKeyIndex,
        //   cash: this.cashVsInvested[0],
        //   invested: this.cashVsInvested[1],
        //   chartsProvider: this.chartsProvider,
        //   metadata: {
        //     name: this.currentTicker[0],
        //     sector: this.currentTicker[1],
        //     exchange: this.currentTicker[this.currentTicker.length - 2],
        //     ticker: this.currentTicker[this.currentTicker.length - 1]
        //   },
        //   trade: this.trade,
        //   halt: () => {
        //     this.stateMachine.reset();
        //   }
        // }
        // this.navCtrl.viewDidLoad.pipe(first()).subscribe(() => {
        //   this.events.publish("engine-calculate", engineData)
        // })
        var _this = this;
        if (newbot === void 0) { newbot = false; }
        if (convert === void 0) { convert = {}; }
        if (!newbot && this.activeBot !== DefaultBotName && this.advancedBots[this.activeBot]) {
            // edit
            this.updateUnlockBaklavaState();
            this.navCtrl.push(BaklavaPage, this.baklavaParams(this.advancedBots[this.activeBot]));
        }
        else {
            this.tutClick(350);
            if (this.activeBot !== DefaultBotName && !newbot) {
                console.error('bot "' + this.activeBot + '" does not exist');
            }
            var alert_7 = this.alertCtrl.create({
                title: Object.keys(convert).length == 0 ? "Create New Bot" : "Upgrade Simple Bot",
                message: "Use a visual node editor to create a sophisticated algorithm to trade automatically. Name your new bot below.",
                inputs: [
                    {
                        type: "input",
                        label: "Bot Name",
                        value: "Bot #" + (this.advancedBotNames.length + 1),
                    },
                ],
                buttons: [
                    {
                        text: "Cancel",
                        handler: function (data) {
                            if (_this.tutorialState[0] == 351) {
                                return false;
                            }
                        },
                    },
                    {
                        text: "Create",
                        handler: function (data) {
                            if (_this.tutorialState[0] == 351) {
                                _this.tutorialState[0] = -1;
                            }
                            //console.log(data);
                            if (!_this.advancedBots[data[0]]) {
                                _this.updateUnlockBaklavaState();
                                var definition = { tutState: _this.tutorialState[0], name: data[0], mode: 1, logs: [], sim: 0, gains: null, data: convert.data };
                                _this.events.publish("saveBot", [data[0], definition]);
                                _this.navCtrl.push(BaklavaPage, _this.baklavaParams(definition));
                                _this.activeBot = DefaultBotName;
                                _this.manual = 3;
                                //console.log({tutState:this.tutorialState[0],name:data[0],mode:1,logs:[],sim:0,gains:null,...convert});
                            }
                            else {
                                _this.generalPopup("Name Taken", "Please choose a unique name");
                                _this.playSFX('error');
                                return false;
                            }
                        },
                    },
                ],
            });
            alert_7.present();
        }
    };
    HomePage.prototype.baklavaParams = function (botDef, traceInfo) {
        if (traceInfo === void 0) { traceInfo = undefined; }
        return {
            bot: botDef,
            date: this.currentData[this.dateKeyIndex].date,
            tick: this.currentTicker,
            traceInfo: traceInfo,
            cashVsInvested: this.cashVsInvested,
            currPrice: this.currPrice,
            limDeduction: this.limDeduction,
            longVsShort: this.longVsShort,
            portfolio: this.portfolio
        };
    };
    HomePage.prototype.brushToggle = function (series) {
        //console.error("brushing is weird, don't get it, seems wrong, for now just toggling hide/show")
        if (series == "close") {
            this.config.portfolio.showClose = !this.config.portfolio.showClose;
        }
        else if (series == "adj") {
            this.config.portfolio.showAdjClose = !this.config.portfolio.showAdjClose;
        }
        else if (series = "gains") {
            this.config.portfolio.showPortfolio = !this.config.portfolio.showPortfolio;
        }
        this.config.portfolio.hide = !this.config.portfolio.showClose && !this.config.portfolio.showPortfolio && !this.config.portfolio.showAdjClose;
        //console.log(this.config.portfolio.hide)
        this.reDraw();
    };
    HomePage.prototype.indicatorSettings = function (indi) {
        // compile indicator data
        /*
            var indiData = JSON.parse(JSON.stringify(indicatorData[indi]));
            indiData.params = []
        
            Object.keys(indiData.vals).forEach((key) => {
              if (this.config[indi] && this.config[indi][key]) {
                indiData.vals[key] = this.config[indi][key];
              } else {
                indiData.vals[key] = indicatorData[indi].vals[key]
              }
        
              indiData.params.push(key)
            })
        */
        var _this = this;
        this.globalModal = this.modalCtrl.create(indicatorModal, {
            indiData: this.indiData[indi],
            indicator: indi
        }, { cssClass: 'modalIndicator' });
        this.globalModal.onDidDismiss(function (data) {
            _this.reDraw();
        });
        this.globalModal.present();
    };
    HomePage.prototype.openMA = function (type) {
        var _this = this;
        if (type === void 0) { type = 'avg'; }
        var state = this.purchasedUpgrades.includes('customMA') && this.purchasedUpgrades.includes('multipleMA');
        this.globalModal = this.modalCtrl.create(maModal, {
            ma: this.movingAverages,
            state: state ? 2 : 1,
            dateIndex: this.dateKeyIndex
        }, { cssClass: 'modalIndicator' });
        this.globalModal.onDidDismiss(function (data) {
            _this.config.candlestick.sma = _this.movingAverages.sma;
            _this.config.candlestick.ema = _this.movingAverages.ema;
            _this.movingAverages.smaColors.forEach(function (color, i) {
                document.body.style.setProperty("--sma" + String(i + 1), color);
            });
            _this.movingAverages.emaColors.forEach(function (color, i) {
                document.body.style.setProperty("--ema" + String(i + 1), String(color));
            });
            //document.body.style.setProperty("--sma1", "#a20");
            _this.reDraw();
        });
        this.globalModal.present();
    };
    HomePage.prototype.updateUnlockBaklavaState = function () {
        this.setBaklavaState("unlock", this.purchasedUpgrades.includes('vizBots5') ? 4 : (this.purchasedUpgrades.includes('vizBots4') ? 3 : (this.purchasedUpgrades.includes('vizBots3') ? 2 : (this.purchasedUpgrades.includes('vizBots2') ? 1 : 0))));
        this.setBaklavaState("portState", this.purchasedUpgrades.includes('botPort3') ? 3 : this.purchasedUpgrades.includes('botPort2') ? 2 : this.purchasedUpgrades.includes('botPort1') ? 1 : 0);
        this.setBaklavaState("testState", this.purchasedUpgrades.includes('backtesting') ? 2 : this.purchasedUpgrades.includes('paper') ? 1 : 0);
    };
    HomePage.prototype.setBaklavaState = function (key, value) {
        this.bakState[key] = value;
        BaklavaState.setState(key, value);
    };
    HomePage.prototype.limitPrompt = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Process Limit/Stop",
            message: "This trade will automatically process once the threshold has been met, and it will incur a transaction fee of $" +
                (this.tradeVolume * this.fee).toFixed(2) +
                " if it does. It can be cancelled beforehand.",
            inputs: [
                {
                    type: "checkbox",
                    label: "Don't Show Again",
                    value: "dontshow",
                },
            ],
            buttons: [
                {
                    text: "Cancel",
                    handler: function () { },
                },
                {
                    text: "Ok",
                    handler: function (data) {
                        if (_this.tutorialState[0] == 103) {
                            _this.tutorialState[0] = 104;
                        }
                        _this.warnings.limit = data.length > 0;
                        _this.trade(undefined, true);
                    },
                },
            ],
        });
        alert.present();
    };
    HomePage.prototype.restart = function (forced) {
        var _this = this;
        if (forced === void 0) { forced = false; }
        var learned = 0;
        var restartCash = this.statsData.startingCash + learned;
        if (forced) {
            this.notification(['error', 'Margin Called', "You Will Start with $" + restartCash]);
            this.playSFX('error');
        }
        else {
            this.notification(['warning', 'Restart', "You Will Start with $" + restartCash]);
            this.playSFX('error');
        }
        if (this.balanceOptions.marginCallSupress) {
            return;
        }
        this.earnedLearnings.forEach(function (key) {
            learned += _this.getLearnReward(key);
        });
        var btns = [{
                text: "Restart",
                handler: function (data) {
                    _this.statsData.restarts++;
                    _this.tutorialState[0] = -1;
                    console.error("restart campaign with $" + restartCash);
                    //console.log(this.defaults);
                    campaignReset.forEach(function (field) {
                        if (_this.defaults[field]) {
                            _this[field] = JSON.parse(JSON.stringify(_this.defaults[field]));
                        }
                        else {
                            _this[field] = _this.defaults[field];
                            //console.error(field+" not defined as this.default");
                        }
                    });
                    // auto purchase all free upgrades
                    Object.keys((_this.demo ? demoUpgrades : rawUpgrades)).forEach(function (upgrade) {
                        if ((_this.demo ? demoUpgrades : rawUpgrades)[upgrade].cost == 0) {
                            _this.processUpgrade(upgrade, true);
                        }
                    });
                    _this.portfolio[0] = restartCash;
                    _this.statsData.stockGain = 0;
                    _this.statsData.stockHistory = [];
                    _this.finishedStocks.push(_this.currentTicker);
                    _this.statsData.restartedStocks.push(_this.currentTicker);
                    _this.syncUpgradeModes();
                    _this.initStock();
                }
            }];
        if (!forced) {
            btns.unshift({
                text: "Cancel",
                handler: function () { },
            });
        }
        else if (this.mode == 'sandbox') {
            btns.unshift({
                text: "Bailout",
                handler: function () {
                    _this.notification(['warning', '$5000 Bailout', 'Added to Account']);
                    _this.addCash(5000);
                    _this.setTradeVol();
                },
            });
        }
        function ordinal(n) {
            var s = ["th", "st", "nd", "rd"];
            var v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        }
        var alert = this.alertCtrl.create({
            enableBackdropDismiss: false,
            title: forced ? "Margin Called" : "Restart Run?",
            message: this.mode == 'sandbox' ? ("You have unlocked sandbox mode - are you sure you wish to start a new run? You will start with <b>$" + this.nFormat(restartCash) + "</b> in capital <i>(banked funds along with Learn & Earn revenue)</i>. You will need to re-purchase all upgrades including sandbox mode. This would be your <b>" + ordinal(parseInt(this.statsData.restarts + 2)) + "</b> run.") : ("In real life, restarting after massive losses isn't an option. Investing is extremely risky. By clicking 'restart' you will start a new run with <b>$" + this.nFormat(restartCash) + "</b> in capital (banked funds along with Learn & Earn revenue). You will need to re-purchase all upgrades. This " + (forced ? "will" : "would") + " be your <b>" + ordinal(parseInt(this.statsData.restarts + 2)) + "</b> run."),
            buttons: btns,
        });
        alert.present();
    };
    HomePage.prototype.marginCallPop = function (normal) {
        var _this = this;
        if (normal === void 0) { normal = false; }
        if (!this.realVsDebugState()) {
            return;
        }
        if ((normal && !this.warnings.marginCallPop) || (!normal && !this.warnings.marginCallPop2)) {
            this.stopSim();
            var alert_8 = this.alertCtrl.create({
                title: "Margin Calls",
                message: normal ? "If you have a negative portfolio that falls below a percent of your current loan, a margin call is now activated. This means you will need to restart unless this changes before the alloted time. " : "Margin Calls will now activate. You will need to restart if you have a negative portfolio that falls below a percent of your current loan from this point forward. ",
                inputs: [
                    {
                        type: "checkbox",
                        label: "Don't Show Again",
                        value: "dontshow",
                    },
                ],
                buttons: [
                    {
                        text: "Ok",
                        handler: function (data) {
                            if (normal) {
                                _this.warnings.marginCallPop = data.length > 0;
                            }
                            else {
                                _this.warnings.marginCallPop2 = data.length > 0;
                            }
                        },
                    },
                ],
            });
            alert_8.present();
        }
    };
    HomePage.prototype.transactionFee = function () {
        var _this = this;
        if (this.warnings.fee || this.fee == 0) {
            this.trade(true);
        }
        else {
            var alert_9 = this.alertCtrl.create({
                title: "Process Trade?",
                message: "This trade will incur a transaction fee of $" +
                    (this.tradeVolume * this.fee).toFixed(2) +
                    ". Purchase upgrades to lower transaction fees.",
                inputs: [
                    {
                        type: "checkbox",
                        label: "Don't Show Again",
                        value: "dontshow",
                    },
                ],
                buttons: [
                    {
                        text: "Cancel",
                        handler: function () { },
                    },
                    {
                        text: "Ok",
                        handler: function (data) {
                            _this.tutClick(11);
                            _this.tutClick(151);
                            _this.warnings.fee = data.length > 0;
                            _this.trade(true);
                        },
                    },
                ],
            });
            alert_9.present();
        }
    };
    HomePage.prototype.tutClick = function (num) {
        if (this.tutorialState[0] == 157) {
            this.endTutorial();
            return;
        }
        if (this.tutorialState[0] == 214) {
            this.endTutorial();
            return;
        }
        if (this.tutorialState[0] == num) {
            this.tutorialState[0] = num + 1;
        }
    };
    HomePage.prototype.debugUnlock = function () {
        var _this = this;
        if (!jumpToBaklava) {
            this.notification(['success', 'Debug Unlock', '$500 and All Upgrades']);
        }
        this.addCash(500);
        Object.keys((this.demo ? demoUpgrades : rawUpgrades)).forEach(function (upgrade) {
            //console.log('processit',upgrade);
            _this.processUpgrade(upgrade);
        });
        /*
        setTimeout(()=>{
          this.upgrades();
          //this.learnEarn();
        },50)
        */
        this.setTradeVol();
    };
    HomePage.prototype.debugJump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var perSec, recordsToSkip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.notification(['success', 'Jump', '3 Min Sim on Current Max']);
                        perSec = this.showRealSim(this.simSpeed[2] / 10);
                        recordsToSkip = 3 * 60 * perSec;
                        return [4 /*yield*/, this.pushData(recordsToSkip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.debugUpgrade = function () {
        var _this = this;
        this.notification(['success', 'Debug Upgrade', 'All Upgrades & Learn & Earn Unlocked']);
        Object.keys((this.demo ? demoUpgrades : rawUpgrades)).forEach(function (upgrade) {
            console.log('processit', upgrade);
            _this.processUpgrade(upgrade, true);
        });
        Object.keys(milestones).forEach(function (milestone) {
            _this.processUpgrade(milestone, true);
        });
        this.learnAll();
        /*
        setTimeout(()=>{
          this.upgrades();
          //this.learnEarn();
        },50)
        */
        this.setTradeVol();
    };
    HomePage.prototype.quickDebug = function () {
        /*
         this.playSFX('error');
         //this.addCash(9999999);
         this.addCash(-500);
         this.setTradeVol();
         */
        this.pushData(200);
    };
    HomePage.prototype.rmLimitStop = function (index) {
        if (this.tutorialState[0] == 104) {
            this.endTutorial();
        }
        //console.log(this.limitStops[index])
        //console.error("requires logic, especially for multiple!!");
        this.limitStops.splice(index, 1);
        this.saveState();
        this.setTradeVol();
        // refund as cash
    };
    HomePage.prototype.calcLimDeductions = function () {
        var _this = this;
        this.limDeduction = [0, 0];
        this.limitStops.forEach(function (limitstop) {
            _this.limDeduction[limitstop.buyvssell ? 0 : 1] += limitstop.amt + limitstop.amt * _this.fee;
        });
    };
    HomePage.prototype.stopSim = function () {
        this.simSpeed[1] = this.simSpeed[0];
        this.simSpeed[0] = 0;
        this.realtimeSim();
    };
    HomePage.prototype.limitTrade = function (buyvssell, volume, order_price, close, amt, short) {
        //portfolio[0]=currCash
        //portfolio[1]=percent of that cash invested
        var _this = this;
        if (!short) {
            if (buyvssell) {
                this.portfolio[0] -= volume;
                var dayGain = close / order_price;
                // cash to go in 'invested'
                var result = amt * dayGain;
                var newCapital = this.portfolio[0] + result;
                var newInvestedAmt = this.portfolio[0] * this.portfolio[1] + result;
                var newRatio = newInvestedAmt / newCapital;
                this.portfolio[0] = newCapital;
                this.portfolio[1] = newRatio;
            }
            else {
                console.log(this.portfolio[0]);
                /*
                var before=this.portfolio[0]
                console.log(before)
                console.log(amt-this.tradeVolume);
                this.portfolio[0]+=amt;
                console.log(this.portfolio[0])
                var ratio=before/this.portfolio[0];
                */
                /*
                if (ratio<0){ratio=0}
                
                
                this.portfolio[1]=ratio
                console.log(this.portfolio[1])
                */
            }
        }
        else {
            console.error("process limit trade for short!!");
            return;
        }
        console.error("limitstop filled");
        console.error(this.portfolio[0], this.portfolio[1]);
        setTimeout(function () { return _this.stopSim(); }, 0);
        this.setTradeVol(true);
        //stop sim for the first time when a limit order is given? this.warnings.limProcessed?
        if (!this.warnings.limitTrigger) {
            var alert_10 = this.alertCtrl.create({
                title: "Limit/Stop Order Triggered",
                message: "One or more of your pending Limit/Stop orders have been triggered",
                inputs: [
                    {
                        type: "checkbox",
                        label: "Don't Pause or Show Again",
                        value: "dontshow",
                    },
                ],
                buttons: [
                    {
                        text: "Ok",
                        handler: function (data) {
                            _this.playSFX('generic');
                            _this.warnings.limitTrigger = data.length > 0;
                        },
                    },
                ],
            });
            alert_10.present();
        }
        this.saveState();
    };
    HomePage.prototype.upgradePopup = function (title, txt, tutState, id, prospectiveTutState) {
        var _this = this;
        if (prospectiveTutState) {
            prospectiveTutState = prospectiveTutState.start;
        }
        else {
            prospectiveTutState = -1;
        }
        if (!this.warnings.upgradePop) {
            var alert_11 = this.alertCtrl.create({
                title: title,
                enableBackdropDismiss: !(tutState == 8 || prospectiveTutState == 100),
                message: txt,
                inputs: [
                    {
                        type: "checkbox",
                        label: "Don't Show Tips",
                        value: "dontshow",
                    },
                ],
                buttons: [
                    {
                        text: "Ok",
                        handler: function (data) {
                            _this.warnings.upgradePop = data.length > 0;
                            _this.playSFX('generic');
                            if (tutState == 8) {
                                _this.tutorialState[0] = 9;
                            }
                            if (_this.tutorialDB[id]) {
                                _this.startTutorial(id);
                                if (id == marginUpgrade) {
                                    _this.warnings.marginCallWarn = false;
                                }
                            }
                        },
                    },
                ],
            });
            alert_11.present();
        }
        else {
            console.error(this.tutorialDB[id]);
            if (this.tutorialDB[id]) {
                this.startTutorial(id);
                if (id == marginUpgrade) {
                    this.warnings.marginCallWarn = false;
                }
            }
        }
    };
    HomePage.prototype.generalPopup = function (title, txt) {
        var alert = this.alertCtrl.create({
            title: title,
            message: txt,
            buttons: [
                {
                    text: "Ok",
                    handler: function (data) { },
                },
            ],
        });
        alert.present();
    };
    HomePage.prototype.trade = function (fee, lim, data) {
        //console.log(fee,lim,data)
        //console.log(data.price,this.limitStop)
        var _this = this;
        if (fee === void 0) { fee = this.warnings.fee; }
        if (lim === void 0) { lim = this.warnings.limit; }
        if (data === void 0) { data = { 'buyvssell': this.buyvssell, 'price': this.currPrice[0], 'longvsshort': this.longVsShort, 'amt': this.tradeVolume, 'bot': false }; }
        if (!data.bot) {
            this.stopSim();
        }
        if (!data.buyvssell && data.amt > this.cashVsInvested[1] - this.limDeduction[1] && !this.longVsShort) { // ()()() shorts
            if (this.activeBot !== DefaultBotName) {
                this.stopSim();
            }
            this.generalPopup("Insufficient Funds", "Delete an open sell order to make trade");
            this.playSFX('error');
            return;
        }
        if (data.price !== this.limitStop) {
            if (this.limitStops.length > 3) {
                this.generalPopup("Error", "Cannot have more than 4 max limit/stop orders");
                this.playSFX('error');
                return;
            }
            if (!lim || this.tutorialState[0] == 103) {
                this.limitPrompt();
                return;
            }
            //[buyvssell,price,short,amt]
            var limit = data.price > this.limitStop;
            var adjustedVol = data.amt * (data.buyvssell ? 1 : (this.limitStop / data.price));
            this.limitStops.push({
                buyvssell: data.buyvssell,
                volume: adjustedVol + adjustedVol * this.fee,
                //origVol:data.amt,
                amt: adjustedVol,
                price: this.limitStop,
                limit: !limit,
                short: !data.longvsshort
            });
            this.saveState();
            this.setTradeVol(true);
            return;
        }
        else {
            if (!fee) {
                this.transactionFee();
                return;
            }
            else {
                if (this.tutorialState[0] == 151) {
                    this.tutorialState[0] = 152;
                }
                if (this.tutorialState[0] == 157) {
                    this.endTutorial();
                }
            }
        }
        var invested = this.portfolio[1] * this.portfolio[0];
        this.portfolio[0] = this.portfolio[0] - data.amt * this.fee;
        var cash = this.portfolio[0] - invested;
        var shortAvail = (this.longShortShow &&
            this.cashVsInvested[1] < 0.01) ||
            !data.longvsshort;
        if (data.buyvssell) {
            if (!data.longvsshort) {
                this.portfolio[1] =
                    (invested - data.amt * (this.fee + 1)) / (cash + invested);
                if (this.portfolio[1] == 0) {
                    this.longVsShort = true;
                    data.longvsshort = true;
                }
            }
            else {
                this.portfolio[1] = (invested + data.amt) / (cash + invested);
            }
            //this.portfolio[1] =this.portfolio[1] + data.amt / this.portfolio[0]; // - data.amt*this.fee;
        }
        else {
            if (shortAvail) {
                this.longVsShort = false;
                data.longvsshort = false;
                this.portfolio[1] = (invested + data.amt) / (cash + invested);
            }
            else {
                this.portfolio[1] =
                    (invested - data.amt * (this.fee + 1)) / (cash + invested);
            }
            //console.log(invested,data.amt,cash,invested)
            //this.portfolio[1] = this.portfolio[1] - data.amt / this.portfolio[0]; // - data.amt*this.fee;
        }
        if (this.activeBot == DefaultBotName && this.navCtrl.getActive().name == "HomePage") {
            if (data.buyvssell && this.longVsShort || !data.buyvssell && !this.longVsShort) {
                this.notification(['success', '$' + this.nFormat(Math.floor(data.amt)), (data.longvsshort ? 'Buy' : 'Short') + ' Successful']);
            }
            else {
                this.notification(['success', '$' + this.nFormat(Math.floor(data.amt)), (data.longvsshort ? 'Sell' : 'Cover') + ' Successful', 'red']);
            }
        }
        this.statsData.stockTrades++;
        this.statsData.totalTrades++;
        this.config.candlestick.trades.push({
            date: this.currentDate,
            type: data.buyvssell ? "buy" : "sell",
            price: data.price,
            quantity: data.amt,
        });
        this.reDraw();
        this.statsData.totalFeeAmt += data.amt * this.fee;
        this.infusedCash -= (data.amt * this.fee);
        this.statsData.totalFeeAmt += Math.floor(data.amt * this.fee * 100) / 100;
        this.statsData.stockFeeAmt += Math.floor(data.amt * this.fee * 100) / 100;
        //this.chartsProvider.render("#d3el", this.config);
        //console.log(data.amt,this.fee);
        var rez = [100 * (1 - this.portfolio[1]), this.portfolio[1] * 100];
        var oldSkin = this.investedSkin;
        this.investedSkin = Math.floor(this.portfolio[1] * 100);
        this.portfolio[2] = oldSkin > this.investedSkin;
        this.portfolio[3] = oldSkin < this.investedSkin;
        if ((this.portfolio[1] <= 0.01 || this.portfolio[1] >= .99) && data.longvsshort) {
            //()()() short
            setTimeout(function () {
                _this.chkbox = !_this.chkbox;
                _this.toggleBuyVSell();
            }, 30);
        }
        //this.chartPieOptions.series = rez;
        this.saveState();
        this.setTradeVol(true);
    };
    HomePage.prototype.nFormat = function (num, digits) {
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
    HomePage.prototype.setTradeVol = function (trade) {
        var _this = this;
        if (trade === void 0) { trade = false; }
        //console.log(this.portfolio);
        this.calcLimDeductions();
        if (this.portfolio[1] < 0) {
            this.portfolio[1] = 0;
        }
        var invested = this.portfolio[1] * this.portfolio[0];
        //this.portfolio[0] = this.portfolio[0] - this.tradeVolume * this.fee;
        //var cash = this.portfolio[0] - invested-this.limDeduction;
        var prevPortfolio = this.cashVsInvested[0] + this.cashVsInvested[1] + this.limDeduction[0] - this.loanData.amt;
        this.cashVsInvested = [
            this.portfolio[0] * (1 - this.portfolio[1]) - this.limDeduction[0],
            invested - this.limDeduction[1]
        ];
        if (this.cashVsInvested[0] < 0) {
            //console.error(this.cashVsInvested[0],'negative cash, showing 0');
            this.cashVsInvested[0] = 0;
        }
        else if (this.cashVsInvested[1] < 0) {
            //console.error(this.cashVsInvested[1],'negative investment, showing 0');
            this.cashVsInvested[1] = 0;
        }
        //var newPortfolio=this.cashVsInvested[0] + this.cashVsInvested[1];
        this.totalPortfolio = this.cashVsInvested[0] + this.cashVsInvested[1] + this.limDeduction[0] - this.loanData.amt;
        Object.keys(milestones).forEach(function (milestone) {
            if (!_this.purchasedUpgrades.includes(milestone) && _this.totalPortfolio >= milestones[milestone].amt && !_this.unlockedMilestones.includes(milestone)) {
                _this.processUpgrade(milestone, true);
                _this.unlockedMilestones.push(milestone);
                _this.notification(['success', 'Net Worth Milestone Unlocked', milestone]);
                _this.stopSim();
                _this.generalPopup(milestones[milestone].title, "Congratulations! Your Net Worth is now over $" + parseInt(milestones[milestone].amt).toLocaleString('en-US') + ". " + milestones[milestone].txt);
                _this.saveState();
            }
        });
        //console.log(this.totalPortfolio,this.loanData.amt)
        // ---- margin logic -----------------
        if (this.loanData.amt == 0 || this.totalPortfolio > 0) {
            this.marginWarning = false;
        }
        if (this.loanData.amt > 0 && this.purchasedUpgrades.includes(marginUpgrade) && this.totalPortfolio < 0) {
            if (Math.abs(this.totalPortfolio) > this.loanData.amt * this.marginCallPercent) {
                this.stopSim();
                console.error("margin called");
                this.restart(true);
            }
            else if (Math.abs(this.totalPortfolio) > this.loanData.amt * this.marginWarningThreshold) {
                this.notification(['warning', 'Margin Warn', 'You have lost ' + this.marginCallPercent * 100 + '% or more of your margin loan, you will be margin called']);
                if (this.warnings.marginCallWarn) {
                    this.playSFX('error');
                    var alert_12 = this.alertCtrl.create({
                        title: "Margin Call Warning",
                        message: "Your portfolio is negative and falls below " + Math.floor((this.marginCallPercent * 100)) + "% of your loan. you will be margin called and need to restart if this is still the case.",
                        inputs: [
                            {
                                type: "checkbox",
                                label: "Don't Pause or Show Again",
                                value: "dontshow",
                            },
                        ],
                        buttons: [
                            {
                                text: "Ok",
                                handler: function (data) {
                                    _this.warnings.marginCallWarn = !(data.length > 0);
                                },
                            },
                        ],
                    });
                    this.stopSim();
                    alert_12.present();
                }
                this.marginWarning = true;
            }
        }
        else {
            if (!this.warnings.restartRemind && this.totalPortfolio < -8) {
                this.restartRemind();
            }
        }
        //-----------------------------
        this.statsData.netWorth = this.totalPortfolio;
        if (this.totalPortfolio <= 0) {
            this.portfolioMomentum = false;
        }
        else {
            this.portfolioMomentum = this.totalPortfolio >= prevPortfolio;
        }
        this.historicalCashInvested.push(this.cashVsInvested);
        var shortAvail = (this.longShortShow &&
            this.cashVsInvested[1] < 0.01) ||
            !this.longVsShort;
        if (this.cashVsInvested[1] < 0.01) {
            this.longVsShort = true;
        }
        //console.warn(this.buyvssell,shortAvail,this.longShortShow,this.cashVsInvested[1],this.cashVsInvested[0],this.longVsShort)
        // || shortAvail   !== !!shortAvail
        //(!this.buyvssell && shortAvail) || (this.buyvssell && !this.longVsShort)
        if (this.buyvssell) {
            if (!this.longVsShort) {
                this.tradeVolume = this.cashVsInvested[1];
            }
            else {
                this.tradeVolume = this.cashVsInvested[0];
            }
        }
        else {
            if (shortAvail) {
                this.tradeVolume = this.cashVsInvested[0];
            }
            else {
                this.tradeVolume = this.cashVsInvested[1];
            }
        }
        //this.tradeVolume -= this.limDeduction[0]
        this.tradeVolume = this.tradeVolume * this.tradeDefault;
        this.tradeVolume = this.tradeVolume / (1 + this.fee);
        //console.error(this.tradeVolume,this.limDeduction)
        if (this.tradeVolume < 0) {
            this.tradeVolume = 0;
        }
        this.maxTradeRange = this.tradeVolume;
        this.limitStop = this.currPrice[0];
        this.limitRender = this.limitStop.toFixed(2);
        if (trade && shortAvail) {
            // switch to buy?
        }
        this.calcAvailUpgrades();
    };
    HomePage.prototype.toggleBuyVSell = function (forceBuy) {
        if (forceBuy === void 0) { forceBuy = false; }
        if (!forceBuy && this.tutorialState[0] == 150) {
            this.tutorialState[0] = 151;
        }
        if (!forceBuy && this.tutorialState[0] == 155) {
            this.tutorialState[0] = 156;
        }
        if (forceBuy) {
            this.buyvssell = true;
            this.chkbox = false;
        }
        else {
            this.buyvssell = !this.buyvssell;
        }
        this.setTradeVol();
    };
    HomePage.prototype.amtSlider = function (e) {
        if (e == Math.round(100 * this.maxTradeRange) && this.tutorialState[0] == 156) {
            this.tutorialState[0] = 157;
        }
        this.tradeVolume = e / (100 * this.tradeDefault);
    };
    HomePage.prototype.loan = function () {
        if (!this.purchasedUpgrades.includes('margin')) {
            return;
        }
        if (this.tutorialState[0] == 9) {
            this.tutorialState[0] = 10;
        }
        // calc this.loanData.min
        this.calcInterestRate();
        var accrued = Math.floor(this.loanData.cycle * this.loanData.amt / 360 * this.loanData.rate) / 100;
        var rez = this.portfolio[0] - this.loanData.amt - accrued;
        this.loanData.max = this.loanData.max + this.statsData.addedMaxLoan;
        //console.log(this.loanData)
        if (rez < 0) {
            this.loanData.min = Math.floor(Math.abs(rez) + 1);
        }
        else {
            this.loanData.min = 0;
        }
        this.globalModal = this.modalCtrl.create(loanModal, { data: this.loanData, mystery: !this.purchasedUpgrades.includes('name'), type: this.getActive("type"), tutState: this.tutorialState[0], margin: [this.purchasedUpgrades.includes(marginUpgrade), this.marginWarning, this.totalPortfolio, this.loanData] }, { enableBackdropDismiss: this.tutorialState[0] !== 10, cssClass: 'loanModal' });
        this.globalModal.present();
    };
    HomePage.prototype.news = function (e) {
        //e.preventDefault();
        var tickerName = this.currentTicker[0];
        var type = this.getActive("type"); //"stock"; // crypto:price?
        console.log(tickerName);
        if (tickerName == "Alphabet") {
            tickerName = "Google";
        }
        if (tickerName == "Meta Platforms") {
            tickerName = "Facebook";
        }
        var searchQuery = "%22" + tickerName + "%20" + type + "%22";
        var url = "https://www.google.com/search?ls=en&q=" + searchQuery +
            "%20before%3A" + this.currentDate.toISOString().split('T')[0] + "&tbs=cdr:1,cd_min:1/1/0";
        /*
              var url ="https://news.google.com/search?ls=en&q=" + searchQuery +
              "%20before%3A"+this.currentDate.toISOString().split('T')[0];
        */
        console.log(url);
        // open browser component
        this.browserControl.initBrowser(url);
        this.browserControl.show();
    };
    HomePage.prototype.getLearnReward = function (name) {
        if (Object.keys(startingLearn).indexOf(learning[name].upgrade) !== -1) {
            return startingLearn[learning[name].upgrade];
        }
        else if (!((this.demo ? demoUpgrades : rawUpgrades)[learning[name].upgrade]) || !((this.demo ? demoUpgrades : rawUpgrades)[learning[name].upgrade]).reward) {
            console.error('reward undefined for ' + name);
            return 0;
        }
        else {
            console.log(learning[name].upgrade, rawUpgrades[learning[name].upgrade]);
            console.log((this.demo ? demoUpgrades : rawUpgrades)[learning[name].upgrade].reward);
            return ((this.demo ? demoUpgrades : rawUpgrades)[learning[name].upgrade].reward);
        }
    };
    HomePage.prototype.genAvailEarned = function () {
        var _this = this;
        var availLearn = [];
        Object.keys(learning).forEach(function (key) {
            // console.log(learning[key].upgrade);
            if (!_this.earnedLearnings.includes(key) &&
                (_this.purchasedUpgrades.includes(learning[key].upgrade) ||
                    typeof learning[key].upgrade == "undefined" || Object.keys(startingLearn).indexOf(learning[key].upgrade) !== -1)) {
                var ele = learning[key];
                ele.name = key;
                ele.reward = _this.getLearnReward(key);
                /*
                        var failed=0;
                        if (this.failedLearn[key]){
                           failed=this.failedLearn[key]
                        }
                        ele.failed=failed;
                */
                availLearn.push(ele);
            }
        });
        return availLearn;
    };
    HomePage.prototype.genEarned = function () {
        var _this = this;
        var rewatch = [];
        this.earnedLearnings.forEach(function (id) {
            if (learning[id]) {
                var obj = learning[id];
                obj.name = id;
                obj.reward = _this.getLearnReward(id);
                rewatch.push(obj);
            }
        });
        return rewatch;
    };
    HomePage.prototype.genEarnedNames = function () {
        var rewatch = [];
        this.earnedLearnings.forEach(function (id) {
            if (learning[id]) {
                var obj = learning[id];
                obj.name = id;
                rewatch.push(obj.upgrade);
            }
        });
        return rewatch;
    };
    HomePage.prototype.learnEarn = function () {
        if (this.tutorialState[0] == 4) {
            this.tutorialState[0] = 5;
        }
        //this.earnedLearnings; // by id
        //this.purchasedUpgrades;
        if (this.tutorialState[0] == 3) {
            this.tutorialState[0] = 4;
        }
        var availLearn = this.genAvailEarned();
        var rewatch = this.genEarned();
        console.error(availLearn);
        this.globalModal = this.modalCtrl.create(learnModal, {
            learn: availLearn,
            rewatch: rewatch,
            pipNew: this.warnings.new.pip,
            availEarn: this.availEarn,
            numLearn: this.EarnLearnCount,
            tutState: this.tutorialState[0],
            pipUnlocked: this.purchasedUpgrades.includes('pip')
        }, { cssClass: 'learnModal' });
        this.globalModal.present();
    };
    HomePage.prototype.learnAll = function () {
        var _this = this;
        this.genAvailEarned().forEach(function (obj) {
            var name = obj.name;
            if (learning[name]) {
                _this.earnedLearnings.push(name);
                _this.addCash(_this.getLearnReward(name));
            }
            else {
                console.error('learning name undefined: ' + name);
            }
        });
        console.log(this.earnedLearnings);
        this.calcLearnEarn();
        this.setTradeVol();
    };
    HomePage.prototype.stats = function () {
        if (this.tutorialState[0] == 13) {
            this.tutorialState[0] = 14;
        }
        if (this.tutorialState[0] == 50) {
            this.tutorialState[0] = 51;
        }
        // if (!this.purchasedUpgrades.includes('breakdown')){return}
        this.statsData.leaderUnlock = this.purchasedUpgrades.includes('leaderboard');
        this.globalModal = this.modalCtrl.create(statsModal, {
            data: this.statsData,
            margin: [this.purchasedUpgrades.includes(marginUpgrade), this.marginWarning, this.totalPortfolio, this.loanData, this.marginWarningThreshold, this.warnings.marginCallWarn, this.marginCallPercent],
            perks: [this.availEarn, this.extraAvail],
            tutState: this.tutorialState[0],
            yearReveal: this.purchasedUpgrades.includes("yearreveal"),
            asset: this.getActive('type')
        }, { enableBackdropDismiss: this.tutorialState[0] !== 51, cssClass: 'modalPortfolio' });
        this.globalModal.present();
    };
    /*
      initRawData(filename) {
        var result = d3.csv("assets/js/" + filename + ".csv", (error, data) => {
          this.currentData = data;
          this.pushData(startingRecords);
        });
      }
    */
    HomePage.prototype.toggleMode = function () {
        this.manual++;
        if (this.manual == 3) {
            this.manual = 0;
        }
        this.limitStop = this.currPrice[0];
    };
    HomePage.prototype.initGraph = function (records) { };
    HomePage.prototype.upcomingUpgrades = function () {
        var _this = this;
        if (this.demoState && this.demoState.learned) {
            this.demoState.learned.forEach(function (earned) {
                console.log(learning[earned], earned);
                if ((!learning[earned].upgrade || _this.purchasedUpgrades.includes(learning[earned].upgrade)) && !_this.earnedLearnings.includes(earned)) {
                    _this.earnedLearnings.push(earned);
                    _this.addCash(_this.getLearnReward(earned));
                    _this.notification(['success', 'Earned $' + _this.getLearnReward(earned), " Demo " + earned]);
                    _this.calcLearnEarn();
                    _this.setTradeVol();
                }
            });
        }
        // fire after purchase
        var horizon = [];
        Object.keys((this.demo ? demoUpgrades : rawUpgrades)).forEach(function (key) {
            if (!_this.purchasedUpgrades.includes(key)) {
                if (typeof (_this.demo ? demoUpgrades : rawUpgrades)[key].cost !== 'undefined') {
                    if (!_this.unlockModeState[key]) {
                        horizon.push((_this.demo ? demoUpgrades : rawUpgrades)[key].cost);
                    }
                }
            }
        });
        this.horizonUpgrades = horizon;
        // console.log(this.horizonUpgrades)
    };
    HomePage.prototype.calcAvailUpgrades = function () {
        var _this = this;
        var notnew = 0;
        this.horizonUpgrades.find(function (x, i) {
            if (x < _this.maxAmtUpgrades) {
                notnew++;
            }
            if (x > _this.portfolio[0]) {
                _this.availUpgrades = i;
                return true;
            }
            else if (i == _this.horizonUpgrades.length - 1) {
                _this.availUpgrades = _this.horizonUpgrades.length;
                return true;
            }
        });
        if (this.horizonUpgrades.length == 0) {
            this.availUpgrades = 0;
        }
        this.newUpgrades = this.availUpgrades - notnew;
    };
    HomePage.prototype.calcLearnEarn = function () {
        var _this = this;
        var amt = 0;
        Object.keys(learning).forEach(function (key) {
            if (!_this.earnedLearnings.includes(key) &&
                (_this.purchasedUpgrades.includes(learning[key].upgrade) ||
                    typeof learning[key].upgrade == "undefined" || Object.keys(startingLearn).indexOf(learning[key].upgrade) !== -1)) {
                amt += _this.getLearnReward(key);
            }
            _this.availEarn = amt;
        });
    };
    HomePage.prototype.upgrades = function () {
        var _this = this;
        if (this.tutorialState[0] == 1) {
            this.tutorialState[0] = 2;
        }
        if (this.tutorialState[0] == 6) {
            this.tutorialState[0] = 7;
        }
        var genUpgrades = [];
        Object.keys((this.demo ? demoUpgrades : rawUpgrades)).forEach(function (key) {
            if (!_this.purchasedUpgrades.includes(key)) {
                var upgrade = (_this.demo ? demoUpgrades : rawUpgrades)[key];
                upgrade.id = key;
                Object.keys(learning).forEach(function (ky) {
                    if (learning[ky].upgrade == upgrade.id) {
                        upgrade.reward = _this.getLearnReward(ky);
                    }
                });
                /*
                        if (upgrade.learn) {
                          Object.keys(learning).forEach((ky) => {
                            if (learning[ky].upgrade == upgrade.id) {
                              upgrade.reward = learning[ky].reward;
                            }
                          })
                        }
                */
                genUpgrades.push(upgrade);
            }
        });
        var max = this.maxAmtUpgrades;
        this.maxAmtUpgrades = this.portfolio[0];
        genUpgrades.sort(function (a, b) {
            return a.cost - b.cost;
        });
        this.globalModal = this.modalCtrl.create(upgradesModal, {
            //purchased: this.purchasedUpgrades,
            portfolio: this.portfolio,
            avail: this.availUpgrades,
            tutState: this.tutorialState[0],
            //demo:[demoMode,demoThreshold],
            earned: this.genEarnedNames(),
            //newUpgrades:this.newUpgrades,
            purchasedUpgrades: this.purchasedUpgrades,
            len: Object.keys((this.demo ? demoUpgrades : rawUpgrades)).length,
            upgrades: genUpgrades,
            max: max,
            warnings: this.warnings,
        }, { enableBackdropDismiss: this.tutorialState[0] !== 2 && this.tutorialState[0] !== 7 });
        this.calcAvailUpgrades();
        //this.newUpgrades=[];
        this.globalModal.present();
    };
    //Math.pow(y*secPerSimSpeed[0],1/3)*10=simSpeed[0]
    //math.pow(simSpeed[0]/10,3)/secPerSimSpeed
    HomePage.prototype.increaseMaxSim = function (factor) {
        //simSpeed:any=[0,10,10]
        if (factor === void 0) { factor = 2; }
        //1.0201x1.3257
        factor = 1.02 * Math.pow(factor, 1.3257);
        //factor=Math.pow(factor,(1/0.7448))/1.3741
        var adjMax = Math.pow(this.simSpeed[2] / 10, 3) / this.secPerSimSpeed;
        var newMax = Math.pow(adjMax * factor * this.secPerSimSpeed, 1 / 3) * 10;
        if (newMax > 420) {
            //console.warn("maximum sim factor reached");
            newMax = 420;
        }
        this.simSpeed[2] = newMax;
        //console.error(this.simSpeed[2]);
        //save
        //console.log(newMax);
    };
    HomePage.prototype.brushThreshLog = function (newThresh) {
        this.customBrush = -1;
        var real = Math.floor(Math.pow(newThresh, 3) / 10000);
        this.brushThreshold[1] = real;
        //console.log(this.brushThreshold[1])
    };
    HomePage.prototype.performanceInfo = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Performance Warning",
            message: "The more indicators are turned on and the more data being displayed at any one time, the greater the graphical impact and slower your simulations will be. Consider turning some off when simulating, particularly at a high speed.",
            inputs: [
                {
                    type: "checkbox",
                    label: "Don't Show Again",
                    value: "dontshow",
                },
            ],
            buttons: [
                {
                    text: "Performance Mode",
                    handler: function (data) {
                        _this.warnings.performance = data.length > 0;
                        // save indicators, set them to null, then when it's over return it.
                        console.error('performance mode');
                    },
                },
                {
                    text: "Ok",
                    handler: function (data) {
                        _this.warnings.performance = data.length > 0;
                    },
                }
            ],
        });
        alert.present();
        this.stopSim();
    };
    HomePage.prototype.deconstructSimSpeed = function () {
        if (isNaN(this.adjustedSimSpeed)) {
            return parseFloat(this.adjustedSimSpeed.replace('k', '')) * 1000;
        }
        else {
            return this.adjustedSimSpeed;
        }
    };
    HomePage.prototype.showRealSim = function (newSpeed) {
        var realSim;
        if (typeof this.secPerSimSpeed == 'undefined') {
            realSim = Math.pow(newSpeed, 3) / 5;
        }
        else {
            realSim = Math.pow(newSpeed, 3) / this.secPerSimSpeed;
        }
        realSim = 1.3741 * Math.pow(realSim, 0.7448);
        var adjViz = realSim;
        /**/
        if (adjViz > 10000) {
            adjViz = String(Math.round(adjViz / 1000)) + "k";
        }
        else if (adjViz > 1000) {
            adjViz = String(Math.round(adjViz / 100) / 10) + "k";
        }
        else if (adjViz > 10) {
            adjViz = Math.round(adjViz);
        }
        else {
            adjViz = Math.floor(adjViz * 10) / 10;
        }
        //return Math.round(num*2)/2;
        return adjViz;
    };
    HomePage.prototype.realtimeSim = function (newSpeed, delta) {
        if (newSpeed === void 0) { newSpeed = this.simSpeed[0]; }
        if (delta === void 0) { delta = 0; }
        this.detachCD();
        this._realtimeSim(newSpeed, delta);
        this.attachCD();
    };
    HomePage.prototype._realtimeSim = function (newSpeed, delta) {
        var _this = this;
        if (newSpeed === void 0) { newSpeed = this.simSpeed[0]; }
        if (delta === void 0) { delta = 0; }
        //console.log(this.simSpeed[2]);
        newSpeed = newSpeed / 10;
        var change = newSpeed !== this.simSpeed[1];
        this.simSpeed[1] = newSpeed;
        var duration = (this.secPerSimSpeed * 1000) / Math.pow(newSpeed, 3);
        var realSim = Math.pow(newSpeed, 3) / this.secPerSimSpeed;
        this.adjustedSimSpeed = this.showRealSim(newSpeed);
        if (this.simInterval) {
            clearTimeout(this.simInterval);
        }
        //console.log(newSpeed);
        if (newSpeed > 0) {
            var interval_1 = 1;
            var speedAdj = newSpeed;
            //realSim
            /**/
            if (change) {
                console.log(change);
                this.simSpeedDelay = false;
                if (this.simSpeedDelayTimeout) {
                    clearTimeout(this.simSpeedDelayTimeout);
                }
                this.simSpeedDelayTimeout = setTimeout(function () {
                    if (_this.simSpeed[0] > 0) {
                        _this.simSpeedDelay = true;
                    }
                }, 2000);
            }
            var onus = this.graphicalOnus();
            var complexity = onus[1];
            var days = onus[0];
            //y = 1972.4x-1.442
            var compDenom = 1972.4 * Math.pow(complexity, -1.442); //((onus[0]+30)*(onus[1]/100))
            //35.608x-0.739
            var dayFactor = 35.608 * Math.pow(days, -0.739);
            var denom = compDenom * dayFactor;
            if (denom < 4) {
                denom = 4;
                if (!this.warnings.performance && realSim > 20) {
                    var alert_13 = this.alertCtrl.create({
                        title: "Performance Warning",
                        message: "The more indicators are turned on and the more data being displayed at any one time, the greater the graphical impact and slower your simulations will be. Consider turning some off when simulating, particularly at a high speed.",
                        inputs: [
                            {
                                type: "checkbox",
                                label: "Don't Pause or Show Again",
                                value: "dontshow",
                            },
                        ],
                        buttons: [
                            {
                                text: "Performance Mode",
                                handler: function (data) {
                                    _this.warnings.performance = data.length > 0;
                                    // save indicators, set them to null, then when it's over return it.
                                    console.error('performance mode');
                                },
                            },
                            {
                                text: "Ok",
                                handler: function (data) {
                                    _this.warnings.performance = data.length > 0;
                                },
                            }
                        ],
                    });
                    alert_13.present();
                    this.stopSim();
                }
            }
            interval_1 = 1;
            if (interval_1 < 1) {
                interval_1 = 1;
            }
            if (interval_1 > 2000) {
                interval_1 == 2000;
            }
            //interval=1 // ()()()()() turning off all skips
            //30-300
            //console.log(denom,interval);
            //console.log(interval,realSim,onus[0],onus[1]);
            //console.log(interval,duration);
            //speedAdj=speedAdj/interval;
            //newSpeed=100,000
            //newSpeed=10;
            //Math.ceil();
            //interval=1; // ()()()()()()
            //console.log(interval);
            this.simInterval = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var deltaTime, start, delta;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            deltaTime = performance.now() - this.lastSimCountTime;
                            this.simsThisSecond++;
                            if (deltaTime > 1000) {
                                this.simsPerSecond = this.simsThisSecond;
                                this.simsThisSecond = 0;
                                this.lastSimCountTime = performance.now();
                                console.log("speed: ", this.simsPerSecond);
                            }
                            start = performance.now();
                            return [4 /*yield*/, this.pushData(interval_1)];
                        case 1:
                            _a.sent();
                            this.detectChanges();
                            delta = performance.now() - start;
                            this.realtimeSim(undefined, delta);
                            //console.log(Math.ceil(1000/Math.ceil(duration)));
                            // custom debounce
                            /*
                             if (this.dateKeyIndex % (Math.ceil(1000 / Math.ceil(duration))) == 0) {
                               this.saveState();
                             }
                             */
                            this.saveState();
                            return [2 /*return*/];
                    }
                });
            }); }, Math.max((1000 / this.adjustedSimSpeed) - delta, 0));
        }
    };
    HomePage.prototype.playButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // step
                    return [4 /*yield*/, this.initBotIfRequired()];
                    case 1:
                        // step
                        _a.sent();
                        if (!!this.purchasedUpgrades.includes('sim')) return [3 /*break*/, 3];
                        if (this.tutorialState[0] == 3) {
                            this.tutHold++;
                            if (this.tutHold == 3) {
                                this.tutorialState[0] = 4;
                                this.tutHold = 0;
                            }
                        }
                        else if (this.tutorialState[0] == 12) {
                            this.tutHold++;
                            if (this.tutHold == 7) {
                                this.tutorialState[0] = 13;
                                this.tutHold = 0;
                            }
                        }
                        return [4 /*yield*/, this.pushData(1, true)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        this.realSpeed = [0, performance.now()];
                        _a.label = 4;
                    case 4:
                        if (!(this.simSpeed[0] == 0)) return [3 /*break*/, 6];
                        this.tutClick(153);
                        return [4 /*yield*/, this.pushData(1, true)];
                    case 5:
                        _a.sent();
                        if (this.simSpeed[1] == 0) {
                            this.simSpeed[1] = Math.ceil(this.simSpeed[2] / 2);
                        }
                        if (this.simSpeed[1] < this.simSpeed[2] / 5) {
                            this.simSpeed[1] = Math.floor(this.simSpeed[2] / 10);
                        }
                        this.adjustedSimSpeed = 1;
                        this.simSpeed[1] = 15;
                        this.simSpeed[0] = this.simSpeed[1];
                        this.simSpeed[1] = 0;
                        this.realtimeSim();
                        return [3 /*break*/, 7];
                    case 6:
                        this.tutClick(154);
                        this.simSpeed[1] = this.simSpeed[0];
                        this.simSpeed[0] = 0;
                        this.realtimeSim();
                        this.attachCD();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.stockDone = function () {
        var _this = this;
        if (this.paperState.mode !== -1) {
            this.unwrapPaper();
        }
        // cancel limit orders
        //liquidate without transaction fee
        this.portfolio[1] = 0;
        this.cashVsInvested = [this.portfolio[0], 0];
        this.statsData.stockFeeAmt = 0;
        this.statsData.stockInterestAmt = 0;
        this.statsData.stockTrades = 0;
        this.statsData.netWorthBefore = this.statsData.netWorth;
        this.finishedStocks.push(this.currentTicker);
        this.statsData.finished = this.finishedStocks.length;
        this.statsData.stockHistory = [];
        this.statsData.lastCompletedGain = this.statsData.stockGain;
        this.statsData.stockGain = 0;
        this.statsData.stockRecords = 0;
        var sec = (performance.now() - this.realSpeed[1]) / 1000;
        console.log('Real Sim Speed', this.realSpeed[0] / sec);
        if (this.warnings.autoContinue) {
            // if balance sim?
            this.initStock(null, false, true);
            return;
        }
        this.clearLimitOrders();
        var tempPrompt = "New ";
        var type = this.getActive("type");
        var nameUnlocked = this.purchasedUpgrades.includes('name');
        tempPrompt += type;
        var message = "You made gains of <b>" + parseFloat(((this.statsData.riseFall[this.statsData.riseFall.length - 1].value - 1) * 100).toFixed(2)).toLocaleString('en-US') + "%</b> on a" + (nameUnlocked ? "" : "n unknown") + " " + type.toLowerCase() + (nameUnlocked ? "" : " <i>(upgrade to find out!)</i>") + ". Your investments will be liquidated without transaction fees. You now have <b>$" + parseFloat(this.cashVsInvested[0].toFixed(2)).toLocaleString("en-US") + "</b> in cash";
        var alert = this.alertCtrl.create({
            title: type + " Sim Finished",
            enableBackdropDismiss: false,
            message: message,
            inputs: [
                {
                    type: "checkbox",
                    name: "continue",
                    label: "Auto Continue" + (!this.purchasedUpgrades.includes('autoContinue') ? ' (Upgrade)' : ''),
                    value: this.warnings.autoContinue,
                    disabled: !this.purchasedUpgrades.includes('autoContinue')
                },
            ],
            buttons: [
                {
                    text: "Share",
                    handler: function (data) {
                        console.error('submit leaderboard?');
                        console.error('twitter/facebook/social media?');
                        return false;
                    },
                },
                {
                    text: tempPrompt,
                    handler: function (data) {
                        if (data.length == 1) {
                            _this.warnings.autoContinue = true;
                            _this.generalPopup("Auto Continue", "When one " + _this.getActive("type") + " ends, another seamlessly begins. To undo this, change the setting in the menu. Your assets will still be liquidated whenever a " + _this.getActive("type") + " ends.");
                        }
                        else {
                            _this.warnings.autoContinue = false;
                        }
                        //console.log(data);
                        _this.initStock(null, false, true);
                    },
                },
            ],
        });
        this.isStockDoneAlert = true;
        alert.present();
    };
    HomePage.prototype.calcMovingGain = function () {
        if (!this.statsData.riseFall[this.statsData.riseFall.length - this.movingGainPeriod]) {
            this.movingGain[0] = 0;
            this.movingGain[1] = 0;
        }
        else {
            this.movingGain[0] = (1 - this.statsData.riseFall[this.statsData.riseFall.length - 1].value * -100) - (1 - this.statsData.riseFall[this.statsData.riseFall.length - this.movingGainPeriod].value * -100);
            this.movingGain[1] = Math.abs(this.statsData.riseFall[this.statsData.riseFall.length - 1].value - this.statsData.riseFall[this.statsData.riseFall.length - this.movingGainPeriod].value);
        }
    };
    HomePage.prototype.processLoan = function () {
        if (this.loanData.amt !== 0) {
            if (this.loanData.cycle == 30) {
                var amt = Math.floor(this.loanData.amt * this.loanData.rate / 12) / 100;
                this.addCash(-1 * amt);
                this.statsData.totalInterestAmt += amt;
                this.statsData.stockInterestAmt += amt;
                this.calcInterestRate();
                this.loanData.cycle = 0;
            }
            else {
                this.loanData.cycle++;
            }
        }
    };
    HomePage.prototype.setSandboxDates = function () {
        if (this.sandbox && this.dateKeyIndex >= 0) {
            var today = this.currentData[this.dateKeyIndex].date.toLocaleDateString('en-US').split("/");
            var min = this.currentData[0].date.toLocaleDateString('en-US').split("/");
            var max = this.currentData[this.currentData.length - 1].date.toLocaleDateString('en-US').split("/");
            this.sandbox.date = today[2] + "-" + today[0].padStart(2, '0') + "-" + today[1].padStart(2, '0');
            this.sandbox.max = max[2] + "-" + max[0].padStart(2, '0') + "-" + max[1].padStart(2, '0');
            this.sandbox.min = min[2] + "-" + min[0].padStart(2, '0') + "-" + min[1].padStart(2, '0');
        }
    };
    HomePage.prototype.animateInterval = function (i, width) {
        var bottom = i - width;
        if (bottom < 0) {
            bottom = 0;
        }
        this.configAnim.data = this.animData.slice(bottom, i);
        //console.log(this.config.data)
        //console.log(this.currentTicker);
        //console.log(DB[this.currentTicker]);
        this.configAnim.portfolio.data = {
            portfolio: this.statsData.riseFall,
            close: this.animData.slice(0, this.dateKeyIndex + 1),
            adjClose: this.animData.slice(0, this.dateKeyIndex + 1).map(function (d) { return ({
                date: d.date,
                value: d.close,
            }); }),
        };
        this.chartsProvider.render("#anim", this.configAnim);
    };
    HomePage.prototype.animDimension = function () {
        this.configAnim.candlestick.dims.height = Math.floor(window.innerHeight * 1.1);
        this.configAnim.candlestick.dims.width = Math.floor(window.innerWidth * 1.1);
        this.configAnim.dims.width = Math.floor(window.innerWidth * 1.5);
        this.configAnim.dims.height = Math.floor(window.innerHeight * 1.5);
    };
    HomePage.prototype.cmm = function () {
        this.openLink('https://www.cinqmarsmedia.com');
    };
    HomePage.prototype.fullVersion = function () {
        alert("goto steam");
    };
    HomePage.prototype.gitHub = function () {
        this.openLink('https://github.com/cinqmarsmedia');
    };
    HomePage.prototype.quitGame = function () {
        if (window["electron"]) {
            window["electron"].quit();
        }
        else {
            console.error('Electron Unavailable, ignoring quit');
        }
    };
    HomePage.prototype.toggleFullScreen = function () {
        this.fullscreenState = !this.fullscreenState;
        if (window["electron"]) {
            window["electron"].fullscreen();
        }
        else {
            console.error('Electron Unavailable, ignoring fullscreen');
        }
    };
    HomePage.prototype.checkBrushData = function (begin, end) {
        var val;
        for (var w = begin; w < end + 1; w++) {
            if (!this.currentData[w]) {
                break;
            }
            //console.log(this.currentData[w].close,this.currentData[w].high,this.currentData[w].low,this.currentData[w].open);
            if (this.currentData[w].open == this.currentData[w].close && this.currentData[w].close == this.currentData[w].high && this.currentData[w].close == this.currentData[w].low) {
                if (w > begin) {
                    if (val !== this.currentData[w].close) {
                        this.noDataWarning = false;
                        break;
                    }
                    if (w == end) {
                        this.noDataWarning = true;
                    }
                }
                else {
                    val = this.currentData[w].close;
                }
            }
            else {
                this.noDataWarning = false;
                break;
            }
        }
    };
    HomePage.prototype.animateOpening = function () {
        var _this = this;
        var anim = ['FCF']; // ()()()()() change ()()()()
        var ticker = anim[Math.floor(Math.random() * anim.length)];
        d3.csv("assets/MTstocks/" + ticker + ".csv", function (error, data) {
            var parseDate = d3.timeParse("%Y%m%d");
            function dateAdj(date) {
                if (parseInt(date.slice(0, 2)) > 30) {
                    return '19' + String(date);
                }
                else {
                    return '20' + String(date);
                }
            }
            _this.animData = data.map(function (d) { return ({
                date: parseDate(dateAdj(d.sdate)),
                open: +d.open / 1000,
                high: +d.high / 1000,
                low: +d.low / 1000,
                close: +d.close / 1000,
                adj: +d.adj / 1000,
                volume: +d.vol00 * 100,
            }); });
            _this.configAnim = JSON.parse(JSON.stringify(configDefault));
            _this.animDimension();
            _this.configAnim.data = {
                portfolio: [],
                close: _this.animData.map(function (d) { return ({
                    date: d.date,
                    value: d.close,
                }); }),
                adjClose: _this.animData.map(function (d) { return ({
                    date: d.date,
                    adj: d.adj,
                }); }),
            };
            _this.configAnim.candlestick.ichimoku = true;
            _this.configAnim.candlestick.atrTrailingStop = [14];
            _this.configAnim.candlestick.bollinger = [20];
            var i = 40;
            var w = 200;
            _this.animateInterval(i, w);
            _this.animationInterval = setInterval(function () {
                i++;
                if (!_this.animData[i]) {
                    i = 40;
                }
                _this.animateInterval(i, w);
            }, 100);
            _this.chartsProvider.render("#anim", _this.configAnim);
        });
        //this.config.data = this.currentData.slice(0, this.dateKeyIndex+1);
        /*
        this.config.portfolio.data = {
          portfolio: this.statsData.riseFall,
          close: this.currentData.slice(0, this.dateKeyIndex+1),
          adjClose: this.currentData.slice(0, this.dateKeyIndex+1).map((d) => ({
            date: d.date,
            value: d.close,
          })),
        };
    */
    };
    HomePage.prototype.pushData = function (interval, save, counter, idle, init) {
        if (save === void 0) { save = false; }
        if (counter === void 0) { counter = false; }
        if (idle === void 0) { idle = false; }
        if (init === void 0) { init = false; }
        return __awaiter(this, void 0, void 0, function () {
            var engineData, before, now, prevIndex, stockDone, logObj;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //console.error('push',interval,counter);
                        // check if done modal is open and stop if it is. 
                        if (this.isStockDoneAlert) {
                            console.error('suppressing because stock done alert is up');
                            return [2 /*return*/];
                        }
                        if (!init) {
                            this.statsData.daysSimmed++;
                        }
                        if (this.statsData.daysSimmed > 0 && this.statsData.daysSimmed % 1250 == 0 && this.demo) {
                            this.stopSim();
                            this.demoPopup();
                            return [2 /*return*/];
                        }
                        if (counter === false) {
                            counter = interval - 1;
                        }
                        interval = 1;
                        if (this.paperState.dateKeyIndex && this.paperState.dateKeyIndex >= this.dateKeyIndex) {
                            this.unwrapPaper();
                            this.events.publish("endBacktest");
                            return [2 /*return*/];
                        }
                        this.playSFX('tick');
                        if (this.mode !== 'sandbox') {
                            this.idleData.stamp = new Date().getTime();
                        }
                        if (!(this.activeBot !== DefaultBotName && this.advancedBots[this.activeBot] && this.dateKeyIndex > 0)) return [3 /*break*/, 3];
                        engineData = {
                            currentData: this.currentData,
                            dateKeyIndex: this.dateKeyIndex + interval - 1,
                            cash: this.cashVsInvested[0],
                            invested: this.cashVsInvested[1],
                            chartsProvider: this.chartsProvider,
                            netWorth: this.totalPortfolio,
                            metadata: {
                                name: this.currentTicker[0],
                                sector: this.currentTicker[1],
                                exchange: this.currentTicker[this.currentTicker.length - 2],
                                ticker: this.currentTicker[this.currentTicker.length - 1]
                            },
                            price: this.currentData[this.dateKeyIndex + interval - 1].close,
                            trade: this.trade,
                            halt: function () {
                                _this.stateMachine.reset();
                            },
                            loanData: this.loanData
                        };
                        if (!(this.dateKeyIndex >= startingRecords)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.baklava.engineCalculate(engineData)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        if (this.activeBot !== DefaultBotName && !this.advancedBots[this.activeBot]) {
                            console.error("active Bot is undefined, ignoring");
                        }
                        _a.label = 4;
                    case 4:
                        prevIndex = this.dateKeyIndex;
                        if (this.dateKeyIndex == -1) {
                            before = this.currentData[0].close;
                        }
                        else {
                            before = this.currentData[this.dateKeyIndex].close;
                        }
                        this.dateKeyIndex = this.dateKeyIndex + interval;
                        //console.error(this.dateKeyIndex,counter);
                        if (!this.currentData[this.dateKeyIndex]) {
                            this.dateKeyIndex = this.currentData.length - 1;
                        }
                        now = this.currentData[this.dateKeyIndex].close;
                        this.processLoan();
                        if (prevIndex == -1) {
                            prevIndex = 0;
                        }
                        this.currentData.slice(prevIndex, this.dateKeyIndex).forEach(function (yesterday, i) {
                            var percentMult;
                            var today = _this.currentData[prevIndex + i + 1];
                            for (var i_1 = 0; i_1 < _this.limitStops.length; i_1++) {
                                var order = _this.limitStops[i_1];
                                if (!order.short) {
                                    // long trades
                                    if (order.buyvssell && order.price >= today.low) {
                                        // put in long buy @ order.price
                                        //console.log(today.low);
                                        //console.error('long buy @ '+order.price)
                                        _this.limitTrade(order.buyvssell, order.volume, order.price, today.close, order.amt, order.short);
                                        _this.rmLimitStop(i_1);
                                        break;
                                    }
                                    else if (!order.buysell && order.limit && order.price <= today.high) {
                                        // put in long limit sell @ order.price
                                        console.error('long limit sell @ ' + order.price, today.high);
                                        _this.limitTrade(order.buyvssell, order.volume, order.price, today.close, order.amt, order.short);
                                        _this.rmLimitStop(i_1);
                                        break;
                                    }
                                    else if (!order.buysell && !order.limit && order.price >= today.low) {
                                        // put in long stop sell @ order.price
                                        console.error('long stop sell @ ' + order.price);
                                        _this.limitTrade(order.buyvssell, order.volume, order.price, today.close, order.amt, order.short);
                                        _this.rmLimitStop(i_1);
                                        break;
                                    }
                                }
                                else {
                                    // short trades
                                    //console.error('short limit logic!!!!!!!!!');
                                    if (!order.buyvssell && order.price <= today.high) {
                                        console.error('short limit buy @ order.price');
                                        _this.limitTrade(order.buyvssell, order.volume, order.price, today.close, order.amt, order.short);
                                        _this.rmLimitStop(i_1);
                                        break;
                                    }
                                    else if (order.buyvssell && order.limit && order.price >= today.low) {
                                        console.error('short limit liq @ order.price');
                                        _this.limitTrade(order.buyvssell, order.volume, order.price, today.close, order.amt, order.short);
                                        _this.rmLimitStop(i_1);
                                        break;
                                    }
                                    else if (order.buyvssell && !order.limit && order.price <= today.high) {
                                        console.error('short limit stop @ order.price');
                                        _this.limitTrade(order.buyvssell, order.volume, order.price, today.close, order.amt, order.short);
                                        _this.rmLimitStop(i_1);
                                        break;
                                    }
                                }
                            }
                            if (_this.longVsShort) {
                                percentMult = today.close / yesterday.close;
                            }
                            else {
                                percentMult = yesterday.close / today.close;
                            }
                            //console.log(percentMult)
                            var cash = _this.portfolio[0] * (1 - _this.portfolio[1]);
                            var inv = percentMult * (_this.portfolio[0] * _this.portfolio[1]);
                            _this.portfolio[0] = cash + inv;
                            if (_this.portfolio[0] > 0) {
                                _this.portfolio[1] = inv / _this.portfolio[0];
                            }
                            //var dailyGain=((1-percentMult)*-1)*this.portfolio[1];
                            _this.calcMovingGain();
                            //console.log(amt)
                            //this.movingGain=(1-amt*-100);
                            _this.cumulativeGain *= (percentMult - 1) * _this.portfolio[1] + 1;
                            if (_this.navCtrl.getActive().name == "BaklavaPage") {
                                _this.events.publish("baklavaGains", _this.cumulativeGain, _this.currentData[_this.dateKeyIndex].date, _this.currentTicker, _this.cashVsInvested, _this.currPrice, _this.limDeduction, _this.longVsShort, _this.portfolio);
                            }
                            //-----bot change??? is it necessary??------------------
                            var botState = _this.activeBot;
                            var type = 0; // continuation
                            if (botState !== _this.botTracker) {
                                // 1 manual to bot (start)
                                if (_this.botTracker == DefaultBotName) {
                                    type = 1;
                                    console.log(botState + "bot starts");
                                }
                                else if (botState == DefaultBotName) {
                                    // 2 bot to manual (end)
                                    type = 2;
                                    console.log(_this.botTracker + "bot ends");
                                }
                                else {
                                    type = 3;
                                    console.log(_this.botTracker + "bot ends");
                                    console.log(botState + "bot starts");
                                }
                            }
                            _this.botTracker = botState;
                            //-------------------------------------------------------
                            _this.statsData.portfolioHistory.push({ value: _this.portfolio[0] - _this.loanData.amt });
                            _this.statsData.stockHistory.push({ date: _this.currentData[prevIndex + i + 1].date, value: _this.portfolio[0] - _this.loanData.amt });
                            _this.statsData.riseFall.push({ date: _this.currentData[prevIndex + i + 1].date, value: _this.cumulativeGain });
                            if (_this.statsData.riseFall[_this.statsData.stockHistory.length - 1]) {
                                _this.statsData.stockGain = (_this.statsData.riseFall[_this.statsData.riseFall.length - 1].value - 1) * 100;
                                if (_this.statsData.lastCompletedGain) {
                                    _this.statsData.globalGain = _this.statsData.lastCompletedGain + _this.statsData.stockGain;
                                }
                                else {
                                    _this.statsData.globalGain = _this.statsData.stockGain;
                                }
                                //console.warn(this.statsData.globalGain,this.statsData.stockGain)
                            }
                            _this.statsData.globalRecords++;
                            _this.statsData.stockRecords++;
                        });
                        // render view
                        //console.error(this.dateKeyIndex + 1,this.currentData.slice(0, this.dateKeyIndex + 1))
                        this.config.data = this.currentData.slice(0, this.dateKeyIndex + 1);
                        //console.log(this.config.data)
                        //console.log(this.currentTicker);
                        //console.log(DB[this.currentTicker]);
                        this.config.portfolio.data = {
                            portfolio: this.statsData.riseFall,
                            close: this.currentData.slice(0, this.dateKeyIndex + 1),
                            adjClose: this.currentData.slice(0, this.dateKeyIndex + 1).map(function (d) { return ({
                                date: d.date,
                                value: marketMovement[d.rawDate],
                            }); }),
                        };
                        if (counter == 0) {
                            this.updateChart(true);
                        }
                        this.currentDate = this.currentData[this.dateKeyIndex].date;
                        this.currPrice = [
                            now,
                            Math.floor((now / before - 1) * 10000) / 100,
                            before,
                        ];
                        this.setTradeVol();
                        stockDone = false;
                        if (this.dateKeyIndex == this.currentData.length - 1) {
                            //alert("finished!");
                            if (this.activeBot !== DefaultBotName) {
                                logObj = [{ type: 1, message: this.getActive("type") + " is finished", timestamp: new Date().getTime(), date: this.currentDate }];
                                /*
                                  this.advancedBots[this.activeBot].logs.push(logObj)
                                */
                            }
                            this.remindCounter--;
                            // log stock is finished. 
                            //console.log("stock finished")
                            if (!this.warnings.autoContinue || idle) {
                                console.log(counter);
                                counter = 0;
                                this.stopSim();
                                // stop recusion?? ()()()
                            }
                            else {
                                this.notification(['success', this.currentTicker[0], 'Gains of ' + Math.floor((this.statsData.riseFall[this.statsData.riseFall.length - 1].value - 1) * 100) / 100 + "%"]);
                            }
                            stockDone = true;
                            // window.location.reload();
                            this.stockDone();
                        }
                        this.YrsElapsed = Math.ceil((this.currentDate - this.currentData[0].date) / 31536000000);
                        this.setSandboxDates();
                        if (save) {
                            this.saveState();
                        }
                        if (!(counter > 0 && !stockDone)) return [3 /*break*/, 6];
                        //  console.error(counter);
                        return [4 /*yield*/, this.pushData(interval, false, counter - 1)];
                    case 5:
                        //  console.error(counter);
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        this.dataProcessed[1] = performance.now();
                        _a.label = 7;
                    case 7:
                        this.realSpeed[0]++;
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype._updateChart = function (simForward) {
        var _this = this;
        if (simForward === void 0) { simForward = false; }
        var isBrushed = this.chartsProvider.brushed;
        //console.error(isBrushed,this.currentData[this.dateKeyIndex - this.brushThreshold[1]])
        /**/
        var brushStart;
        var brushEnd;
        var offset;
        var isRight;
        function isNear(a, b, thresh) {
            return Math.abs(a - b) <= thresh / 2;
        }
        if (isBrushed) {
            var temp = this.chartsProvider.getCurrentBrush();
            offset = Math.round(this.chartsProvider.getBrushSize().tradingDays);
            brushStart = temp.startDate;
            brushEnd = temp.endDate;
            isRight = this.chartsProvider.getCurrentBrushDims().endW / this.chartsProvider.charts[this.chartsProvider.config.brush].config.dims.width > .975;
        }
        this.chartsProvider.renderThrottled("#d3el", this.config);
        //console.log(this.config.portfolio.data);
        // BRUSH stuff
        if (isBrushed && !simForward) {
            this.chartsProvider.setBrush(brushStart, brushEnd);
            this.chartsProvider.onRenderOnce(function () {
                _this.chartsProvider.setBrush(brushStart, brushEnd);
            });
        }
        else if (isBrushed && !isNear(this.brushThreshold[1], offset, 5)) {
            var startDate;
            if (this.customBrush < 0 || !isNear(this.customBrush, offset, 5)) {
                this.customBrush = offset;
            }
            if (this.customBrush < 5) {
                this.customBrush = 5;
            }
            if (!isRight) {
                startDate = brushStart;
            }
            else {
                if (this.currentData[this.dateKeyIndex - this.customBrush]) {
                    startDate = this.currentData[this.dateKeyIndex - this.customBrush].date;
                }
                else {
                    startDate = brushStart;
                }
                //this.chartsProvider.moveBrushToEnd();
                //console.log(this.chartsProvider.getCurrentBrush().endDate);
            }
            /**/
            //brushStart=temp.startDate
            /* */
            this.chartsProvider.setBrush(startDate, this.currentData[this.dateKeyIndex].date);
            this.chartsProvider.onRenderOnce(function () {
                _this.chartsProvider.setBrush(startDate, _this.currentData[_this.dateKeyIndex].date);
            });
            //debugger;
        }
        else {
            if (this.brushThreshold[1] < this.dateKeyIndex) {
                this.chartsProvider.setBrush(this.currentData[this.dateKeyIndex - this.brushThreshold[1]].date, this.currentData[this.dateKeyIndex].date);
                this.chartsProvider.onRenderOnce(function () {
                    if (!_this.currentData[_this.dateKeyIndex - _this.brushThreshold[1]]) {
                        //this.chartsProvider.setBrush(this.currentData[0].date, this.currentData[this.dateKeyIndex].date)
                        //console.error('fatal error? brush');
                        _this.chartsProvider.clearBrush();
                    }
                    else {
                        _this.chartsProvider.setBrush(_this.currentData[_this.dateKeyIndex - _this.brushThreshold[1]].date, _this.currentData[_this.dateKeyIndex].date);
                    }
                });
            }
        }
        // is data empty - brush callback-----------
        var begin;
        if (isBrushed) {
            begin = this.dateKeyIndex - this.customBrush;
        }
        else {
            begin = 0;
        }
        this.checkBrushData(begin, this.dateKeyIndex);
        //console.error(begin,this.dateKeyIndex);
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], HomePage.prototype, "slides", void 0);
    HomePage = __decorate([
        Component({
            selector: "page-home",
            templateUrl: "home.html",
        }),
        __metadata("design:paramtypes", [NavController,
            ModalController,
            Events,
            Storage,
            ChartsProvider,
            AlertController,
            BrowserControlProvider,
            StateMachine,
            BaklavaProvider,
            ChangeDetectorRef])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map