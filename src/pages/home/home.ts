import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import * as cloneDeep from "lodash.clonedeep";

//import { rawData } from "./../../constants";
//import { first } from 'rxjs/operators'
import { BrowserControlProvider } from "../../providers/browser-control/browser-control";
import {
  ModalController,
  AlertController,
 // Platform,
 // NavParams,
  NavController,
} from "ionic-angular";
import { Storage } from "@ionic/storage";
//import { seriesData, seriesDataLinear } from "../../sampleData";

import { Events } from "ionic-angular";
import { Slides } from "ionic-angular";

//import _ from "lodash";
import { HostListener } from '@angular/core';

import * as howler from "howler";
import * as fflate from 'fflate';
import * as throttle from 'lodash.throttle';
//import { LitegraphPage } from "../../pages/litegraph/litegraph";
import { BaklavaPage } from "../../pages/baklava/baklava";
//import ApexCharts from 'apexcharts'
import {
  //kgDB,
  stockDB,
  rawUpgrades,
  demoUpgrades,
  learning,
  mtScores,
  //kgScores,
  activeTickers,
  //kgStartIndex,
  marketMovement,
  marketValues,
  startIndex,
  etfDB,
  cryptoDB,
  etfScores,
  etfActiveTickers,
  cryptoScores,
  cryptoActiveTickers,
  //cryptoActive,
  //etfActive,
  //KGactiveTickers,
  configDefault,
  emailDomainBlacklist,
  indicatorData,
  DefaultBotName,
  debugBot,
  logClamp,
  //debugBot2,
  //leadingIndicators,
  DefaultSimpleBotName,
  DefaultTraceBotName
} from "./../../constants";
//import { ViewController } from "ionic-angular";
import { ChartsConfig, ChartsProvider, DataOhlc } from "../../providers/charts/charts";

import { extrasModal, histModal,logsModal, upgradesModal, learnModal, loanModal, statsModal, maModal, indicatorModal, simpleBotModal, customDataModal, idleModal, disclaimerModal, tutorialModal, podcastsModal, missionsModal } from "../../pages/home/modals"

import * as tw from "trendyways";

import { processBot } from "./processBot";
import { scoreTabulation, quantifyScores, sliceBrokenData, testBrokenDates, genActive, genAverages, furtherNarrowSlice } from "./scoreTabulation";
import { EngineData } from "../../providers/nodes/types";
import { StateMachine, TraceInfo } from "../../providers/state-machine/state-machine";
import { BaklavaState } from "../../providers/baklava-state/baklavaState";
import { BaklavaProvider } from "../../providers/baklava/baklava";
import { createSimpleBot, SimpleBotDefinition } from "../../providers/baklava/simple-bots";
import { Simulator } from "../../providers/simulator/simulator";


const iziToast = window["iziToast"];
const techan = window["techan"];
//const regression=window["regression"];
const d3 = window["d3"];

//const slideshowLibrary = { "tutorial": [1, 5] }
const debugMode = true;
const debugTools = true;
const demoMode = false;
const limitedAds=true;


const version = '1.3.4';
const updateText = "<li>Trades do not reset brush</li><li>Significant reduction in save size / write performance</li><li>Auto Continue Reliability Increased</li><li>Quirks with Brushing addressed</li><li>Code Now Public On GitHub</li>";

const upgradesPersistThroughRuns:any =["limitstop","simpleBots","simpleBots2","simpleBots3","vizBots","vizBots2","vizBots3","vizBots4","vizBots5"];

const marginUpgrade = "loanMax3_10";
const jumpToBaklava = false;
const features = ['crypto', 'etf', 'sandbox']; // 'crypto','full','intraday'
const startingLearn: any = { "basics": 10, "candlesticks": 10 };

const stopSaving = false; // ()()() should be false
const persist = true; 
const debugSimpleBot = false;



const startingRecords = 30;
const startingInterestRate = 14;
//const RecordsVisible = 300;
const fee = 0.03;
const marginCallPercent = .1;
const startMaxLoan = 100;
//const minXRecords = 14;
const startingCash = 0;
const verticalProportion = 1;

const dailyReward=5;


const podcasts=[

{name:"Planet Money",url:"https://www.iheart.com/podcast/7-planet-money-28457189/?embed=true", host:"Alex Goldmark"},
{name:"Animal Spirits",url:"https://www.iheart.com/podcast/256-animal-spirits-podcast-30944557/?embed=true", host:"Michael Batnick & Ben Carlson"},
{name:"We Study Billionaires",url:"https://www.iheart.com/podcast/263-we-study-billionaires-the-27588563/?embed=true", host:"Stig Brodersen, Trey Lockerbie, & Clay Finck"},
{name:"The Art of Trading",url:"https://www.iheart.com/podcast/269-the-art-of-trading-81967308/?embed=true", host:"Matthew J. Slabosz"},

{name:"Millennial Investing",url:"https://www.iheart.com/podcast/268-millennial-investing-the-i-48403487/?embed=true", host:"Robert Leonard & Rebecca Hotsko",lvl:1},
{name:"MNI Technical Analysis",url:"https://www.iheart.com/podcast/269-mni-markets-technical-anal-92121295/?embed=true",host:"MNI Markets",lvl:1},
{name:"CNBC's Fast Money",url:"https://www.iheart.com/podcast/1082-cnbcs-fast-money-28977606/?embed=true", host:"Melissa Lee",lvl:1},
{name:"Thoughts on the Market",url:"https://www.iheart.com/podcast/867-thoughts-on-the-market-83441142/?embed=true",host:"Morgan Stanley",lvl:1},

{name:"Wealthion",url:"https://www.iheart.com/podcast/269-wealthion-104288766/?embed=true", host:"Adam Taggart",lvl:2},
{name:"Fresh Invest",url:"https://www.iheart.com/podcast/867-fresh-invest-73174531/?embed=true", host:"Alex Lieberman", lvl:2},
{name:"Chat With Traders",url:"https://www.iheart.com/podcast/263-chat-with-traders-weekly-27627306/?embed=true", host:" Aaron Fifield",lvl:2},
{name:"Motley Fool Money",url:"https://www.iheart.com/podcast/motley-fool-money-19569123/?embed=true",host:"Chris Hill",lvl:2},

{name:"InvestED",url:"https://www.iheart.com/podcast/8-invested-the-rule-1-investin-29676936/?embed=true", host:"Phil Town & Danielle Town",lvl:3},
{name:"Top Traders Unplugged",url:"https://www.iheart.com/podcast/256-top-traders-unplugged-31027498/?embed=true",host:"Niels Kaastrup-Larsen",lvl:3},
{name:"Breakout Trading Answered",url:"https://www.iheart.com/podcast/256-better-trader-academy-trad-30934638/?embed=true",host:"BTA Team",lvl:3},
{name:"Mad Money",url:"https://www.iheart.com/podcast/1082-mad-money-w-jim-cra-28977600/?embed=true", host:"Jim Cramer", lvl:3},

]

const achievements={}

const warnings = { marginCallPop: false, extraOpp: false, marginCallPop2: false, marginCallWarn: false, tooltips: !debugMode, upgradePop: false, limit: false, fee: false, fiftyper: false, sellupgrade: false, limitTrigger: false, limitNavAway: false, simpleNavAway: false, advancedNavAway: false, upgradeConfirmRew: false, upgradeConfirmNoRew: false, restartRemind: false, autoContinue: false, notifications: true, performance: false, new: { neural: false, value: false, operation: false, action: false, deploy: false, brush: false, ovr: false, leading: false, ext: false, auto: false, pip: false, podcasts: false } }

const opportunities = {
  'email': { completed: false, reward: 15, name: 'Newsletter', intro: 'Sign-Up for Our Newsletter' },
  'copy': { adNum: 3, completed: false, reward: 10, steam: 'steam://install/1489760', name: 'Copy Editor', intro: 'A Regular Expression Puzzle Game', embed: 'PzdjtkP3NWY', info: 'https://www.cinqmarsmedia.com/copyeditor/' },
  'devil': { adNum: 1, completed: false, reward: 10, steam: 'steam://install/1023820', name: "The Devil's Calculator", intro: 'A Math Puzzle Game Featured In The PAX10', embed: 'scJW6ufWTCg', info: 'https://www.cinqmarsmedia.com/devilscalculator/' },
  'chess': { adNum: 2, completed: false, reward: 10, steam: 'https://store.steampowered.com/app/1558020/Lazy_Chess/', name: 'Lazy Chess', intro: 'Innovative and Addictive New Chess Game', embed: 'oE38hXKWuzQ', info: 'https://www.cinqmarsmedia.com/lazychess/' },
  'synonymy': { adNum: 5, completed: false, reward: 10, steam: 'https://store.steampowered.com/app/342890/Synonymy/', name: 'Synonymy', intro: 'A Word Game Narrated By Richard Dawkins', embed: 'Y1cu0i-4gb8', info: 'https://www.cinqmarsmedia.com/synonymy/' },
  'chameleon': { adNum: 6, completed: false, reward: 10, steam: 'steam://install/834170', name: 'Chameleon Video Player', intro: 'A Free Utility That Displays Video Transparently', embed: 'vhTlnjp7fdU', info: 'https://www.cinqmarsmedia.com/chameleonvideoplayer/' },
  'anagraphs': { adNum: 4, completed: false, reward: 10, steam: 'steam://install/1654280', name: 'Anagraphs', intro: 'A Free New Word Game With A Twist', embed: 'MRJ4UACqBpo', info: 'https://www.cinqmarsmedia.com/anagraphs/' }
}
// storageIDs for copy, devil, cham and anagraphs: 


//anagraphs

const milestones = {
  "dailyRewards":{amt:500, title: "Daily Rewards", txt: "You have now unlocked the ability to receive extra cash each day you return to the game. These rewards persist across runs and are automatically applied with a notification when starting the game."},


/*
  "missions":{amt:1000, title: "Daily Missions", txt: "You have now unlocked the ability to watch Learn & Earn videos while continuing the simulation. Beside the desired video, click the new icon to the right of the topic which will load the video in a movable pip box on the main screen."},
*/
  "pip": { amt: 1000, title: "YouTube PIP", txt: "You have now unlocked the ability to watch Learn & Earn videos while continuing the simulation. Beside the desired video, click the new icon to the right of the topic which will load the video in a movable pip box on the main screen."},

  "bulkbuy":{amt: 3000, title: "Bulk Upgrade", txt: "You have now unlocked the ability to buy multiple upgrades at once provided their total is less than half of your current cash!"},


  "discord": { amt: 5000, title: "Discord Channel", txt: "You have now unlocked access to the Trade Bots discord channel in-game. Check out the new interactive widget in the menu: ask questions and commune with other players!"},


 "podcasts": { amt: 10000, title: "Podcasts", txt: "You have now unlocked the ability to listen to various podcasts in-game! Access through the new option in the menu."},

"pod1": { amt: 100000, title: "More Podcasts!", txt: "More podcasts are now available in the menu!"},
"pod2": { amt: 1000000, title: "Even More Podcasts!", txt: "More podcasts are now available in the menu!"},
"pod3": { amt: 100000000, title: "Yes, EVEN MORE Podcasts!", txt: "More podcasts are now available in the menu!"},
/*
"extra_1": { amt: 5000, extra:["Short Selling", "NPR's Planet Money Welcomes ", "n4o40Zv2rzc", 10, 6]},
*/

"botPort1": { amt: 10000000, title: "Bot Export", txt: "You have now unlocked the ability to export bots. Consult the new menu in the node bots interface." },

/*
"e12": { amt: 1000000000000, title: "A Trillion", txt: "You have reached a net worth of over a trillion dollars. Congratulations! Let us know if you can think of a cool little unlock players might like here! Maybe an exclusive discord channel?" },
*/
"bbDiscord": { amt: 10000000000000, title: "OpenBB Server", txt: "You have reached a net worth of over a trillion dollars. Congrats! Get super nerdy and come try out the OpenBB bot with a bunch of other players in the trillion club!" },

"e18":{amt: 1000000000000000000, title: "Are you Cheating?", txt: "Your net worth is staggering. Kudos. I can't fathom how you were able to make this much money!"}
/*
,"pod2": { amt: 500000, title: "Even More Podcasts!", txt: "Even more podcasts are now available in the menu!"},
 "botPort1": { amt: 7000000, title: "Bot Export", txt: "You have now unlocked the ability to export bots. Consult the new menu in the node bots interface." }, "leaderboard": { amt: 50000000, title: "Leaderboards", txt: "You have now unlocked leadboards.", unique: true },"pod3": { amt: 70000000, title: "Custom Podcasts", txt: "Load any iHeart Radio url in-game"} 
*/






}//"techanRadio":1000,"backtest":10000//, "performanceHide": { amt: 500000, title: "Optimize Performance", txt: "You have now unlocked the ability to to set a speed threshold at which to automatically optimize GUI elements",  } 


const storageID = "tradebots";
const campaignReset = ['marginCallPercent', 'marginDays', 'marginWarning', 'simSpeed', 'manual', 'currentDate', 'obfuscatePrice', 'currentData', 'dateKeyIndex', 'portfolio', 'config', 'currPrice', 'currentTicker', 'loanData', 'indiData', 'indicatorColors', 'prePaperState', 'purchasedUpgrades', 'movingGain', 'obfuscateYear'];

const sharedPersist: any = ['lastReimburse','unlockedMilestones','fullscreenState', 'unlockModeState', 'advancedBots', 'simpleBot', 'finishedStocks', 'earnedLearnings', 'sandbox', 'opportunities', 'tutorialState', 'tutorialDB', 'lastSaveCampaign', 'muteSFX', 'demoState', 'preSimVisible', 'laterExtras', 'version','cashHoldingsPrecision','userHideInfo'];

const modePersist: any = ['longVsShort', 'lastDailyReward', 'visibleExtraGraphs', 'movingAverages', 'longShortShow', 'fee', 'idleData', 'marginCallPercent', 'displayInfo', 'statsData', 'marginWarning', 'movingGain', 'simSpeed', 'manual', 'currentDate', 'currentData', 'warnings', 'dateKeyIndex', 'portfolio', 'limitStops', 'currPrice', 'currentTicker', 'statsData', 'loanData', 'indiData', 'indicatorColors', 'prePaperState', 'purchasedUpgrades', 'bakState', 'activeBot', 'config']

const allPersist:any=sharedPersist.concat(modePersist)

//const uniquePersist = persistVars.filter(n => !sharedPersist.includes(n))

const paperPersist = ['marginCallPercent', 'dateKeyIndex', 'portfolio', 'currPrice', 'currentTicker', 'statsData', 'loanData'];



const basicSimpleBot = { "data": { "nodes": [{ "type": "AdvValNode", "id": "node_166660955673617", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "Today"], ["Where N is", 1], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673618", "value": null }]], "position": { "x": 73, "y": 83 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "AdvValNode", "id": "node_166660955673619", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "N Day(s) Ago"], ["Where N is", 5], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673620", "value": null }]], "position": { "x": 73, "y": 193 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "ConditionalNode", "id": "node_166660955673621", "name": "If (Conditional)", "options": [["Conditional", "A>B"], ["B Multiplier", 1.02], ["Log Message + Data", null]], "state": {}, "interfaces": [["Input A", { "id": "ni_166660955673622", "value": null }], ["Input B", { "id": "ni_166660955673623", "value": null }], ["Then", { "id": "ni_166660955673624", "value": null }], ["Else", { "id": "ni_166660955673625", "value": null }]], "position": { "x": 310, "y": 138 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "TradeNode", "id": "node_166660955673630", "name": "Market Trade", "options": [["Type", "Buy"], ["Times", "Unlimited"], ["Where N is", 10], ["Within", "No time limit"], ["Where X is", 90], ["warning", "Long investments will auto-sell"], ["% Invested", 100], ["% Cash", 25], ["Days are", "Traded Days"], ["Min $ Amt", 1], ["Log Message + Data", null]], "state": {}, "interfaces": [["Trigger", { "id": "ni_166660955673631", "value": null }]], "position": { "x": 547, "y": 138 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "AdvValNode", "id": "node_166660955673634", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "N Day(s) Ago"], ["Where N is", 5], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673635", "value": null }]], "position": { "x": 73, "y": 303 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "AdvValNode", "id": "node_166660955673736", "name": "Adv. Indicator", "options": [["Indicator", "SMA"], ["Pivot Alg", "Floor"], ["Pivot Line", "S1"], ["Stochastic Type", "Fast (1 day)"], ["Aroon Type", "Up-Down"], ["Bollinger Bound", "Upper"], ["MACD Type", "Line"], ["Ichimoku Type", "tenkanSen"], ["period (days)", "10"], ["multiplier", 2], ["tenkanSen", 9], ["kijunSen", 26], ["senkouSpanB", 52], ["fast", 12], ["slow", 26], ["signal", 9], ["When", "Today"], ["Where N is", 1], ["If Undefined", "Closest Value"], ["Return", 0], ["Log Message + Data", null]], "state": {}, "interfaces": [["Output", { "id": "ni_166660955673737", "value": null }]], "position": { "x": 73, "y": 413 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "ConditionalNode", "id": "node_166660955673738", "name": "If (Conditional)", "options": [["Conditional", "A>B"], ["B Multiplier", 1.02], ["Log Message + Data", null]], "state": {}, "interfaces": [["Input A", { "id": "ni_166660955673739", "value": null }], ["Input B", { "id": "ni_166660955673740", "value": null }], ["Then", { "id": "ni_166660955673741", "value": null }], ["Else", { "id": "ni_166660955673742", "value": null }]], "position": { "x": 310, "y": 358 }, "width": 200, "twoColumn": false, "customClasses": "" }, { "type": "TradeNode", "id": "node_166660955673747", "name": "Market Trade", "options": [["Type", "Sell"], ["Times", "Unlimited"], ["Where N is", 10], ["Within", "No time limit"], ["Where X is", 90], ["warning", "Long investments will auto-sell"], ["% Invested", 25], ["% Cash", 100], ["Days are", "Traded Days"], ["Min $ Amt", 1], ["Log Message + Data", null]], "state": {}, "interfaces": [["Trigger", { "id": "ni_166660955673748", "value": null }]], "position": { "x": 547, "y": 358 }, "width": 200, "twoColumn": false, "customClasses": "" }], "connections": [{ "id": "166660955673627", "from": "ni_166660955673618", "to": "ni_166660955673622" }, { "id": "166660955673629", "from": "ni_166660955673620", "to": "ni_166660955673623" }, { "id": "166660955673633", "from": "ni_166660955673624", "to": "ni_166660955673631" }, { "id": "166660955673744", "from": "ni_166660955673635", "to": "ni_166660955673739" }, { "id": "166660955673746", "from": "ni_166660955673737", "to": "ni_166660955673740" }, { "id": "166660955673750", "from": "ni_166660955673741", "to": "ni_166660955673748" }], "panning": { "x": 0, "y": 0 }, "scaling": 1 }, "gains": null, "logs": [], "mode": 1, "name": DefaultSimpleBotName, "sim": 0, "tutState": -1 }

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage implements AfterViewInit {
  /*  */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

if ((event.ctrlKey || event.metaKey) && (event.key=='z' || event.key=='Z')){
  event.preventDefault()
  return;
}

    if (typeof this.alertPop !== 'undefined' && typeof this.alertPop._state !== 'undefined' && this.alertPop._state == 3) { return }

    if (
      typeof this.globalModal !== "undefined" &&
      this.globalModal.overlay._state == 3
    ) {
      this.events.publish("key", event)
    } else {
      if (this.mainMenu) {
        if (event.key == 'Enter' && !this.unlockModeState.etf) {
          // stocks 
          this.mainMenuButton('stock');
        } else if (event.key == 'Escape') {
          this.quitPrompt()
        }
      } else if (this.tutorialState[0] == -1) {
        if ((event.key == 'Escape') && this.navCtrl.getActive().name !== "BaklavaPage") {
if (this.simSpeed[0]>0){
  this.stopSim();
}else{
  this.mainMenuGo();
}
        

        } else if (event.key == ' ' || event.key == 'Enter') {
    if (this.navCtrl.getActive().name !== "BaklavaPage") {
          this.spacebarPlayBtn()
        }else{
          this.events.publish("entrky");
        }
        event.preventDefault();
        }else if (event.code=="KeyA" || event.key == 'ArrowLeft' && (!document.activeElement || document.activeElement.tagName!=="INPUT")){
            if (this.chartsProvider.brushed){

var days=3

if (event.shiftKey){days=7}
if (event.altKey){days=1}

//console.error(this.currentData[this.dateKeyIndex])
var isRight=new Date(this.chartsProvider.getCurrentBrush().startDate)<=new Date(this.currentData[0].date)





//console.error(this.chartsProvider.getBrushSize().actualDays,isRight)
if (!(this.chartsProvider.getBrushSize().actualDays<=70 && isRight)){
              this.chartsProvider.slideBrushLeft(days)
            }
            }
        }else if (event.code=="KeyD" || event.key == 'ArrowRight' && (!document.activeElement || document.activeElement.tagName!=="INPUT")){
            if (this.chartsProvider.brushed){


var isLeft=new Date(this.chartsProvider.getCurrentBrush().endDate)>=new Date(this.currentData[this.dateKeyIndex].date)
var days=3

if (event.shiftKey){days=7}
if (event.altKey){days=1}
//console.error(this.chartsProvider.getBrushSize().actualDays,isLeft)
if (!(this.chartsProvider.getBrushSize().actualDays<=14 && isLeft)){
              this.chartsProvider.slideBrushRight(days)
              }
            }
        }else if (event.code=="KeyW" || event.key == 'ArrowUp' && (!document.activeElement || document.activeElement.tagName!=="INPUT")){
          //console.log(event)
      this.wheel({deltaY:-20,deltaX:0,shiftKey:event.shiftKey, ctrlKey:event.ctrlKey,altKey:event.altKey,arrow:true})
        }else if (event.code=="KeyS" || event.key == 'ArrowDown' && (!document.activeElement || document.activeElement.tagName!=="INPUT")){
          this.wheel({deltaY:20,deltaX:0,shiftKey:event.shiftKey, altKey:event.altKey, ctrlKey:event.ctrlKey,arrow:true})
        }
      }
    }

  }

  @ViewChild(Slides) slides: Slides;
  debug: any = debugMode;
  debugTools: any = debugMode || debugTools
  tutorialState: any = [-1, null];
  tutorialDB: any = { 'intro': { prompt: 'Intro Tutorial Complete', start: 0, completed: false, unlocked: true, reward: 10 },'restart': { prompt: 'Restart Tutorial Complete', start: 30, completed: false, unlocked: false, reward: 15 }, [marginUpgrade]: { prompt: 'Margin Tutorial', start: 50, completed: false, unlocked: false, reward: 50 }, 'limitstop': { prompt: 'Limit/Stop Order Tutorial Complete', start: 100, completed: false, unlocked: false, reward: 100 }, 'longshort': { prompt: 'Shorting Tutorial Complete', start: 150, completed: false, unlocked: false, reward: 200 }, 'simpleBots': { prompt: 'Simple Bots Tutorial Complete', start: 200, completed: false, unlocked: false, reward: 1000 }, 'simpleBots2': { prompt: 'Simple Bots Tutorial Complete', start: 250, completed: false, unlocked: false, reward: 2000 }, 'simpleBots3': { prompt: 'Simple Bots Tutorial Complete', start: 300, completed: false, unlocked: false, reward: 3000 }, 'vizBots': { prompt: 'Advanced Bots Tutorial Complete', start: 350, completed: false, unlocked: false, reward: 10000 } };
  initedBots: string[] = [];
  demo: any = demoMode || window.location.href.split('?')[1] == 'demo';
  demoPrompt: any = false;
  radio: any = false;
  marginWarningThreshold: any = .05;
  alertPop: any
  mode: any = "stock"//crypto, sandbox
  version: any = version;
  chartBar: any;
  missionAvail:any=0;
  limitedAds:any=limitedAds
  opportunities: any = opportunities
  extraAvail: any = 0;
  learning: any = learning
  rawUpgrades: any = rawUpgrades
  lastDailyReward:any=null;
  unlockModeState: any = { "stock": { worth: 0, progress: 0, tickerProgress: 0 } }// {"intraday":{worth:,progress:},"crypto":{worth:,progress:}}
  performanceThresh: any = 20;
  chkbox: any;
  cheating: any = [null,false]
  noDataWarning: any = false;
  laterExtras: any = [];
  realSpeed: any = [0, 0]
  idleData: any = { stamp: null, factor: 3 }
  bakState: any = {}
  paperState: any = { mode: -1 };
  indiData: any = cloneDeep(indicatorData)
  movingGain: any = [0, 0];
  tutRestart:any=false;
  movingGainPeriod: any = 7;
  brushThreshold: any = [122, 180];
  demoState: any=false;
  demoProgress: any = false;
  unlockedMilestones: any = [];
  storageKillSwitch: any = false;
  milestones:any=milestones;
  //showTips: any = tips;
  currAd: any
  upgradeLength: any = Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).length;
  EarnLearnCount: any = Object.keys(learning).length;
  botTracker: any = DefaultBotName;
  simRealDataTracker = {}
  sandbox: any = false;
  campaignStore: any = {};
  lastSaveCampaign: any = true;
  muteSFX: any = false;
  cashHoldingsPrecision:any=[false,false]
  userHideInfo:any=false;
  lastSpeed:any=15;
  marginCalled:any=false;
  lastReimburse:any=null;
  discordOpen:any=false;
  bbDiscordOpen:any=false;
  // ApexChart:any;
  marginWarning: any = false;
  chartCandleOptions: any;
  chartBarOptions: any;
  chartPieOptions: any;
  dateKeyIndex = -1; // -1?
  portfolio: any = [startingCash, 0, false, false];
  currPrice: any = [0, false, 0];
  buyvssell: any = true;
  tradeVolume: number = Math.floor(startingCash / 2);
  currentDate: any;
  showStats: any = false;
  customBrush: any = -1;
  defaults: any = {};
  pipVid: any = false;
  tutHold: any = 0;
  newExtra: any = false;
  //overheadInterest:any=5;
  //recordsToDate: any = { candle: [[], [], []], bar: [] };
  displayInfo: any = 0;
  longShortShow: any = false;
  longVsShort: any = true;
  maxTradeRange: any;
  _fee: number = fee;
  get fee(): number {
    return this._fee;
  }
  set fee(fee: number) {
    this._fee = fee;
    this.stateMachine.setFee(fee);
  }
  features: any = features
  currentData: any;
  marginCallPercent: any = marginCallPercent;
  loanData: any = { rate: startingInterestRate, amt: 0, cycle: 0, min: 0, max: startMaxLoan, mo: 0, upgradeMinus: 0 }
  //gainloss: any = 0;
  investedSkin: any = 0;
  manual: any = 0;
  cumulativeGain: any = 1;
  limitStop: any;
  limitRender: any;
  loaded:any=false;
  chart: any = {};
  limitStops: any = [];
  limDeduction: any = [0, 0];
  purchasedUpgrades: any = []; // array of ids
  earnedLearnings: any = []; // array of ids
  globalModal: any;
  horizonUpgrades: any = [];
  availUpgrades: any = 0;
  newUpgrades: any = 0;
  numActiveTickers: any = 0;
  maxAmtUpgrades: any = 0;
  availEarn: any;
  dimension: any = "Day";
  simRec: any = 1;
  maxSim: any = 1;
  //marginDays:any=3;
  obfuscateYear: any = true;
  obfuscatePrice: any = true;
  _config: ChartsConfig
  get config(): ChartsConfig {
    return this._config;
  }
  set config(cfg: ChartsConfig) {
    if (this.stateMachine.simulating) {
      console.error("Tried to reinitialise config during simulation. This is not alloweed!");
      return;
    }
    this._config = cfg;

    // //--------Refresh After Finishing Stock Bug----------------
    // console.error(this.dateKeyIndex);
    // console.error(this.currentData.length);
    // if (this.dateKeyIndex>=this.currentData.length-1){
    //   this.dateKeyIndex=this.currentData.length-2
    // }
    // console.error(this.dateKeyIndex);
    // //--------------------------
    this.simInit();
  }
  processedData: any;
  simInterval: any;
  finishedStocks: any = [];
  totalPortfolio: any = 0;
  simSpeed: any = [0, 15, 15]; // Start with [2] being 10 -- current, last, max 1-10,000X 100kX *10 for spread
  calculatedScores: any = {}
  secPerSimSpeed = 5;
  remindCounter: any = 15;
  animationInterval: any;
  adjustedSimSpeed: any;
  simSpeedDelay: boolean;
  music: any;
  portfolioMomentum: any = null;
  math: any = Math;
  warnings: any = warnings;
  YrsElapsed: any;
  currentTicker: any;
  //movingAverageState: any = 0;
  cashVsInvested: any = [startingCash, 0];
  historicalCashInvested: any = [[startingCash, 0]];
  debugNum: any = 0;
  tradeDefault: any = .7
  translateOpen:any=false;
  animData: any
  renderInterval: any = this.brushThreshold[1];
  preSimVisible: any = null;
  balanceOptions: any = { persist: false, marginCallSupress: false, supress: false }
  shownType:any="stock"
  //feeWarning:any=false;
  advancedBotNames: any = [];
  advancedBots: any = {};
  debugSimpleBot: boolean = debugSimpleBot;
  simpleBot: SimpleBotDefinition = { logs: [], stopThresh: 50, entry: [], exit: [], entryAmt: 25, exitAmt: 25, entryFreq: 5, exitFreq: 5, short: false, entryUndef: 0, exitUndef: 0 }
  get activeBot(): string {
    if (!this._activeBot) {
      this._activeBot = DefaultBotName;
    }
    return this._activeBot
  }
  set activeBot(botName: string) {
    this._activeBot = botName;
    this.stateMachine.setActiveBotName(botName);
    this.initBotIfRequired();
  }
  _activeBot: any = DefaultBotName;
  docStyle: any = getComputedStyle(document.documentElement);
  // bind external ts
  processBot: any = processBot.bind(this)
  scoreTabulation: any = scoreTabulation.bind(this)
  testBrokenDates: any = testBrokenDates.bind(this)
  genActive: any = genActive.bind(this)
  genAverages: any = genAverages.bind(this);
  //testBrokenData:any=testBrokenData.bind(this);
  sliceBrokenData: any = sliceBrokenData.bind(this);
  furtherNarrowSlice: any = furtherNarrowSlice.bind(this);
  quantifyScores: any = quantifyScores.bind(this);
  mainMenu: any = true;
  //mainMenuEnd: any = false;
  capslockOn: any = false;
  //---
  movingAverages: any = {
    sma: [],
    ema: [],
    smaColors: [this.docStyle.getPropertyValue('--sma1')],
    emaColors: [this.docStyle.getPropertyValue('--ema1')],
  };
  //indiUnlock:any={volume:0,ichimoku:0,atrTrailingStop:0,bollinger:0,movingavg:0,rsi:0,aroon:0,atr:0,macd:0,stochastic:0,williams:0};
  //this.statsData.totalFeeAmt+=
  visibleExtraGraphs: any = [];
  showAd: any = [false, null];
  statsData: any = {
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
  }
  fullscreenState: any = false;
  debugParam: any = false;
  throttleFactor: any = 0;
  //firstTime: any = true;
  indicatorColors: any = { 'close': this.docStyle.getPropertyValue('--close'), 'adj': this.docStyle.getPropertyValue('--adj'), 'gains': this.docStyle.getPropertyValue('--gains'), 'vol': this.docStyle.getPropertyValue('--vol'), 'atr': this.docStyle.getPropertyValue('--atr'), 'dxy': this.docStyle.getPropertyValue('--dxy'), 'unemployment': this.docStyle.getPropertyValue('--unemployment'), 'housing': this.docStyle.getPropertyValue('--housing'), 'yields': this.docStyle.getPropertyValue('--yields'), 'sp': this.docStyle.getPropertyValue('--sp'), 'recess': this.docStyle.getPropertyValue('--recess'), 'industry': this.docStyle.getPropertyValue('--industry'), 'vix': this.docStyle.getPropertyValue('--vix') }
  simpleBotActive: boolean = false;
  failedLearn: any = {};
  dataProcessed: any = [0, 0]
  infusedCash: any = 0;
  isStockDoneAlert: any = false;
  private simsPerSecond: number = 0;
  private simsThisSecond: number = 0;
  private lastSimCountTime: number = 0;
  private toggleConfigState: boolean = true;


  switchBot(botName: string) {
    this.activeBot = botName;
    this.navCtrl.pop();
    this.navCtrl.push(BaklavaPage, this.baklavaParams(this.advancedBots[botName]));
  }

  onColorFocus(i) {
    document.getElementById("color-dropdown-parent" + i).style.display = "block";
  }
  onColorFocusOut(i) {
    document.getElementById("color-dropdown-parent" + i).style.display = null;
  }

  detectChanges = throttle(this._detectChanges.bind(this), 500);

  _detectChanges() {
    this.CDRef.detectChanges();
  }

  // detached: boolean = false;

  // detachCD() {
  //   if (this.detached) {
  //     return;
  //   }
  //   this.CDRef.detach();
  //   this.detached = true;
  // }

  // attachCD() {
  //   if (!this.detached) {
  //     return;
  //   }
  //   this.CDRef.reattach();
  //   this.CDRef.detectChanges();
  //   this.detached = false;
  // }

  CDDetectChangesCycle() {
    this.CDRef.reattach();
    this.CDRef.detectChanges();
    this.CDRef.detach();
  }

  // attachCDThrottled = throttle(this.attachCD.bind(this), 500);

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public events: Events,
    public storage: Storage,
    public chartsProvider: ChartsProvider,
    public alertCtrl: AlertController,
    private browserControl: BrowserControlProvider,
    public stateMachine: StateMachine,
    public baklava: BaklavaProvider,
    private CDRef: ChangeDetectorRef,
    private simulator: Simulator
  ) {
    //7.includes('fjdkls);
    /**/

    window["home"] = this;
    window["cdref"] = this.CDRef;

    window["navctrl"] = this.navCtrl
    window["baklava"] = BaklavaPage

    //do something with the new params }

/*
this.getActive("tickers").forEach((ticker)=>{
if (typeof this.getActive("db")[ticker] == 'undefined'){console.error(ticker+" undef!%!")}else{
}
})
*/

    // setInterval(() => {
    //   this.simsPerSecond = this.simsThisSecond;
    //   this.simsThisSecond = 0;
    // }, 1000);

    //this.defineSimpleBot(true); // ()() debug


    //LOGGING
    //console['logs']//console['errors']

    /**/
/**/
    if (!this.debug) {

/*

      console['defaultLog'] = console.log.bind(console);
      window["consoleLogs"] = [];
      console.log = function () {
        console['defaultLog'].apply(console, arguments);
        window["consoleLogs"].push(Array.from(arguments));
      }
*/
      console['defaultError'] = console.error.bind(console);
      window['consoleErrors'] = [];
      console.error = function () {
        console['defaultError'].apply(console, arguments);
        window['consoleErrors'].push(Array.from(arguments));
      }

    }





    
    //this.stats();
    //this.loan();
    //if (this.debug){this.warnings.tooltips=false}
    stateMachine.registerHomePage(this);
    this.calculatedScores.stock = this.quantifyScores(mtScores);
    this.calculatedScores.etf = this.quantifyScores(etfScores);
    this.calculatedScores.crypto = this.quantifyScores(cryptoScores);
    this.numActiveTickers = this.getActive("tickers").length;


    var bad: any = []

    for (var tick in mtScores) {
      if (mtScores[tick][4] / mtScores[tick][2] > 2000 && activeTickers.includes(tick)) {
        bad.push(tick)
      }
    }




    if (window["electron"]) {
      window["electron"].onBeforeQuit().then(() => {
        this.saveState(true);

      }); //electron.forceQuit()});
    } else {
      window.onbeforeunload = (e) => {
        this.saveState();
      };
    }

    events.subscribe("extraCompleted", (id) => {
      this.completeExtra(id)
    })

    events.subscribe("idle", async (days) => {
      var recur = Math.ceil(days / 13);
      /**/
      for (let i = 0; i < recur; i++) {
        await this.pushData(recur, false, false, true);
      }
    })
    /**/


    events.subscribe("openPip", (id) => {
      this.openPip(id)
      this.warnings.new.pip = false;
    })

    events.subscribe("learned", (name) => {

      if (!this.learning[name]) { console.error('fatal, no learning by the name ' + name); return }

      if (this.earnedLearnings.includes(name)) { return }

      this.earnedLearnings.push(name);
      this.addCash(this.getLearnReward(name));
      this.notification(['success', 'Earned $' + this.getLearnReward(name), " Quiz Completed"])
      this.calcLearnEarn();
      this.setTradeVol();
      this.globalModal.dismiss();
      this.saveState();
    });

    events.subscribe("paperState", (state) => {
      if (state == 1) {
        // turn off
        this.unwrapPaper()
      } else {
        this.paperState = { mode: state == 0 ? 0 : 1 }
        paperPersist.forEach((field) => {
          this.paperState[field] = this[field]
        })
        this.saveState();
      }

    });

    events.subscribe("newLog", (log) => {
      var view = this.navCtrl.getActive().component.name;

      var logObj = log; //process Log from Jitin

      if (view == "HomePage") {

        if (this.activeBot !== DefaultBotName) {
          // logObj.date=this.currentDate
          this.advancedBots[this.activeBot].logs.push(logObj)

          if (this.advancedBots[this.activeBot].logs.length>logClamp){

            var excess=this.advancedBots[this.activeBot].logs.length-logClamp
            this.advancedBots[this.activeBot].logs=this.advancedBots[this.activeBot].logs.splice(this.advancedBots[this.activeBot].logs.length-excess)}
        }

      }

    });


    events.subscribe("simFromBaklava", async (start, speedMode, testMode,name) => {
      //console.error("simBakTrace",start,speedMode,testMode)
      // speedMode==0 is step, 1:1 day/s, 2:10 days/s, 3:100 days/s, 4:1000 days/s



//this.activeBot !== DefaultBotName




      if (speedMode == 0) {
        await this.simulator.stepOnce(this.activeBot && this.activeBot != DefaultBotName);
      } else {
        if (start) {
          if (speedMode == 1) {
            this.simSpeed[0] = 18
          } else if (speedMode == 2) {
            this.simSpeed[0] = 37
          } else if (speedMode == 3) {
            this.simSpeed[0] = 80
          } else if (speedMode == 4) {
            this.simSpeed[0] = 174
          } else if (speedMode == 5) {
            this.simSpeed[0] = this.simSpeed[2]
          }
          this.realtimeSim()
        } else {
          await this.playButton();
        }
      }



    });





    /*
            events.subscribe("failed", (name) => {
              var stamp=Date.now();
              this.failedLearn[name]=stamp;
        });
    
    */


    window.addEventListener("resize", () => {

      if (this.mainMenu) {

      } else {
        if (this.config) {
          this.setDimensions();
          if (this.chartsProvider.brushed) {
            let brush = this.chartsProvider.getCurrentBrushAccurate();
            this.chartsProvider.render("#d3el", this.config);
            this.chartsProvider.setBrush(brush.startDate, brush.endDate);
          } else {
            this.chartsProvider.render("#d3el", this.config);
          }
        }


 if (
      typeof this.globalModal !== "undefined" &&
      this.globalModal.overlay._state == 3 && this.globalModal.data.component.name=="statsModal"
    ) {

this.events.publish("resize")


 }








      }
    });


    events.subscribe("saveBot", (bot) => {
      this.initedBots.push(bot);
      this.advancedBots[bot[0]] = bot[1];
      //console.error(this.advancedBots)
      this.saveState();
      //save
    });


    const initBaklavaIfRequired = () => {
      this.updateUnlockBaklavaState()
      if (this.stateMachine.baklavaInited && !this.debugSimpleBot) {
        return Promise.resolve();
      }

      if (!this.debugSimpleBot) {
        document.querySelector("page-home").classList.add("force-visible")
      }
      return navCtrl.push(BaklavaPage, this.baklavaParams({ "name": "Bot #1", "mode": 1, "logs": [], "sim": 0, "gains": null, "data": { "nodes": [], "connections": [], "panning": { "x": 0, "y": 0 }, "scaling": 1 } }))
        .then(() => {
          if (!this.debugSimpleBot) {
            return navCtrl.pop();
          }
        })
        .then(() => {
          if (!this.debugSimpleBot) {
            document.querySelector("page-home").classList.remove("force-visible");
          }
        })
    }

    events.subscribe("saveSimpleBot", (rules) => {
      this.simpleBot = rules;

      initBaklavaIfRequired().then(() => {
        events.publish("compileSimpleBot", this.simpleBot);
      })

      this.advancedBotNames = Object.keys(this.advancedBots);
      // console.error('save simple bot, compile it down');
      this.saveState();
      // this.activeBot="_simple_";
    });


    events.subscribe("updateIndicators", (indicator, param, val) => {
      //console.log(indicator, param, val)
      if (indicator == 'bollinger') {

        if (param == "period") {
          this.config.candlestick.bollinger = [val]
        } else {
          this.config.candlestick.bollingerSdMultiplication = val
        }
      } else if (indicator.includes('atr')) {

        if (param == "period") {
          this.config.candlestick.atrTrailingStop = [val]
        } else {
          this.config.candlestick.atrTrailingStopMultiplier = val;
        }
      } else if (indicator == 'ichimoku') {
        this.config.candlestick[param] = val

      } else if (indicator == 'pivot') {
        this.config.candlestick.supstance.algorithmConfig.name = val;
      } else {
        this.config[indicator][param] = val;
      }

      this.indiData[indicator].vals[param] = val;
    });

    events.subscribe("setMA", (ma) => {
      this.movingAverages = ma;
    });

    events.subscribe("loan", (amt) => {
      //console.log('hello world');
      if (this.tutorialState[0] == 10) { this.tutorialState[0] = 11 }
      var diff = amt - this.loanData.amt
      var accrued = Math.floor(this.loanData.cycle * this.loanData.amt / 360 * this.loanData.rate) / 100;

      this.loanData.amt = amt;
      this.loanData.cycle = 0;

      var message = 'Current Loan is $' + this.loanData.amt;

      if (accrued > 0) { message += ", $" + accrued + " paid in accrued interest" }
      this.notification(['success', 'Margin Loan Updated', message])

      //console.error('warning about accrued interest loan etc? PUT INFO IN PORTFOLIO');
      this.addCash(diff - accrued);
      this.setTradeVol();
      this.calcInterestRate();
    });

    events.subscribe("upgrade", (id, cost, warnings) => {
      //console.log('hello world');

      if (typeof id !== "string"){
        id.forEach((d)=>{
          this.processUpgrade(d,true);
        })

this.notification(['success', "Bulk Upgrade", "Bought "+id.length+" upgrades for $"+this.nFormat(cost)]);

      this.addCash(cost * -1);
      this.calcLearnEarn();
      this.setTradeVol();

        return;
      }

      this.warnings = warnings;

       if (this.portfolio[0] * (1 - this.portfolio[1]) < cost){

     var sold=cost-this.portfolio[0] * (1 - this.portfolio[1])
      this.config.candlestick.trades.push({
      date: this.currentDate,
      short:false,
      type: "sell",
      price: this.currPrice[0],
      quantity: sold,
    });

    }


      this.processUpgrade(id);
      this.addCash(cost * -1);
      this.calcLearnEarn();
      this.setTradeVol();
    });


    events.subscribe("sfx", (name) => {
      this.playSFX(name);
    });

    events.subscribe("openModal", (id) => {
      if (id == 'learn') {
        this.learnEarn();
      } else if (id == 'extras') {
        this.extraMenu();
      }
    });

    events.subscribe("updateMarginWarnings", (stuff) => {
      this.marginWarningThreshold = stuff[0]
      this.warnings.marginCallWarn = stuff[1]
      this.marginWarning=false;
    });
/*
    events.subscribe("guide", (name) => {
      alert('open guide');
    });
*/
     events.subscribe("popup", (title,message) => {
     this.generalPopup(title,message);
    });

    events.subscribe("backStackTrace", (obj) => {
      this.openLog(obj.botName)
    });

    events.subscribe("readLog", (obj) => {
      if (obj.clear) {
        this.advancedBots[obj.name].logs = [];
        this.advancedBots[obj.name].read = 0;
      } else {
        this.advancedBots[obj.name].read = this.advancedBots[obj.name].logs.length;
      }
      this.saveState();

    });


    events.subscribe("tutState", (state, overrride: any = false) => {
      //state = parseInt(state);

      if (this.demoState && state == 1) {

        this.tutorialState = [-1, null]
        this.processUpgrade('step', true)
        this.processUpgrade('margin', true)

        this.notification(['success', this.tutorialDB['intro'].prompt, '$' + this.nFormat(this.tutorialDB['intro'].reward) + ' Added to Bank']);
        this.addCash(this.tutorialDB['intro'].reward);
        this.setTradeVol();
        return;
      }

      if (state == 260 || state == 308 || state == 55) {

        if (state == 55) {
          this.notification(['warning', 'Margin Calls Active', 'You Will Be Forced to Restart if 10% Or More of Your Loan Is Lost']);
          setTimeout(() => {
            this.tutorialState[0] = -1;
            this.endTutorial();
          }, 2500)
        } else {
          this.tutorialState[0] = state + 1;
          this.endTutorial();
        }



      } else {
        this.tutorialState[0] = state;
      }


    });


    events.subscribe("trade", (tradeObj) => {
      this.trade(true, true, tradeObj)
    });

    this.chartsProvider.onBrush(() => {

      var start = this.chartsProvider.getCurrentBrush().startDate
      var end = this.chartsProvider.getCurrentBrush().endDate

      var first = this.currentData.findIndex((e) => {
        return e.date.toDateString() == start.toDateString()
      })

      var last = this.currentData.findIndex((e) => {
        return e.date.toDateString() == end.toDateString()
      })
      //console.log(first,last);

var brushSize=this.chartsProvider.getBrushSize()
if (brushSize.percentage==100){
  this.chartsProvider.clearBrush();
  return;
}


      if (brushSize.tradingDays < this.chartsProvider.config.minimumBrushSize) {
        this.checkBrushData(first, last)
      } else {

        this.renderInterval = Math.round(brushSize.tradingDays);

        this.checkBrushData(0, this.dateKeyIndex)
      }


    })

  }



  onRightClick(event) {
    if (!this.debug) {
      event.preventDefault(); //this will disable default action of the context menu
    }
  }

  openPodcasts(){

var pods=[];

var state=this.unlockedMilestones.includes('pod5')?5:(this.unlockedMilestones.includes('pod4')?4:(this.unlockedMilestones.includes('pod3')?3:(this.unlockedMilestones.includes('pod2')?2:(this.unlockedMilestones.includes('pod1')?1:0))))


//this.purchasedUpgrades.includes('pod3')?3:(this.purchasedUpgrades.includes('pod2')?2:(this.purchasedUpgrades.includes('pod1')?1:0))

podcasts.forEach((itm:any)=>{
if (typeof itm.lvl == 'undefined' || parseInt(itm.lvl)<=state){
pods.push(itm);
}

})

   this.globalModal = this.modalCtrl.create(podcastsModal, {
      podcasts: pods,
      custom:state==3
    }, { enableBackdropDismiss: true, cssClass: 'podcastsModal' });
    this.globalModal.present();
  }

translate(){
  this.openPip('translate');
  this.playSFX('generic')
  this.translateOpen=true;
  setTimeout(()=>{this.googleTranslateElementInit()},100)
}

closeTranslate(){
  this.playSFX('close')
  this.translateOpen=false;
//@ts-ignore
if (document.getElementById(":1.container")){
(document.getElementById(":1.container") as any).contentWindow.document.getElementById(":1.restore").click()
}
/*
 var showOrig=document.getElementById(":1.restore")
 if (showOrig){document.getElementById(":1.restore").click()}
   */
}

googleTranslateElementInit() {
  new window["google"].translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}


  demoPopup() {

    var message = "We hope you are enjoying this demo of Trade Bots. Our intention with this demo was to give you a small taste of all that's available in the full version, which includes 20+ indicators and 100+ upgrades, including advanced features like neural networks, backtesting and bot export to name just a few. Please consider supporting our 501(c)3 non-profit by wishlisting the game. Much of your progress from this demo will carry over to the full version including Learn and Earn Quizzes."


    this.alertPop = this.alertCtrl.create({
      cssClass: 'earlyAccessAlert',
      enableBackdropDismiss: false,
      title: "Demo Version",
      message: message,
      buttons: [
        {
          text: "Later",
          handler: () => {

          },
        },
        {
          text: "Wishlist",
          handler: (data) => {
            this.openLink('https://store.steampowered.com/app/1899350/Trade_Bots_A_Technical_Analysis_Simulation/');
            return false;
          },
        }
      ],
    });
    this.alertPop.present();
  }


  cheat() {

      
      this.alertPop = this.alertCtrl.create({
      title: "Debug Tools / Free Cash",
      message:"This is a hidden feature designed to provide restitution to players whose data may have become corrupted or lost, or for the purposes of debugging. Debug Mode Enabled.",
        inputs: [
          {
            type: "text",
            name: "cash",
            placeholder: "Dollar Amount",
          }
        ],
        buttons: [

          {
            text: !this.debugTools?"Enable Debug":"Disable Debug",
            handler: (data) => {
              this.debugTools = !this.debugTools;
            },
          },
          {
            text: "Add Cash",
            handler: (data) => {
              var amt = parseInt(data.cash);
//console.error(data.cash,amt);
              if (isNaN(amt)) { return false }
              this.addCash(amt)
            },
          },
        ],
      });
      this.alertPop.present();
    

  }

    feedbackBtn(down){



  }

  performanceSet(e) {
    if (e > 99) {
      this.performanceThresh = 9999;
    } else {
      this.performanceThresh = e;
    }
  }

  feedback() {


      window.open(
        "mailto:info@cinqmarsmedia.org?subject=TradeBots " + (this.demo ? "d" : "v") + this.version + " Bug Report&body=Please describe how to reproduce your issue in detail and attach any relevant screenshots. %0D%0A%0D%0A Ideally, if you could zip and attach your save file, that would allow us to reproduce your issue. %0D%0A%0D%0AWindows Path: Users > {username} > AppData > Roaming > trade-bots. %0D%0AMac Path: {{user home}} > Library > Application Support > trade-bots. %0D%0A%0D%0AThank you for your time and feedback!" + (window['consoleErrors'].length > 0 ? ("%0D%0A" + "%0D%0A"+"%0D%0A" + "%0D%0A"+" Error logs are included below from your session:" + "%0D%0A" + "%0D%0A" + JSON.stringify(window['consoleErrors'])) : "")+"%0D%0A" + "%0D%0A"+"%0D%0A" + "%0D%0A",
        "_self", "frame=true,nodeIntegration=no"
      );

  }


  restitution(){


 this.alertPop = this.alertCtrl.create({
      title: "Loss Restitution",
      message:"In rare cases, errors may occur that will force you to restart your progress. This is a way for the devleopers to issue a code that can compensate for lost in-game funds.",
      inputs: [
        /*  */
        {
          type: "text",
          name: "code",
          placeholder: "Paste Code",
          value: "",
        }
      ],
      buttons: [

        {
          text: "Request",
          handler: (data) => {
/**/
      window.open(
        "mailto:info@cinqmarsmedia.org?subject=TradeBots Restitution Request&body=Please describe how your funds were lost, whether you accidently deleted your save file or it became corrupted. Please also specify about how much in-game funds you would like reimbursed. Thanks!",
        "_self", "frame=true,nodeIntegration=no"
      );

//alert(this.generateCode(100));

          },
        },
        {
          text: "Apply Code",
          handler: (data) => {
var amt=this.processCode(data.code)

if (data.code!==this.lastReimburse){
if (amt){
  this.addCash(amt)
this.notification(['success', "Code Successful", '$' + this.nFormat(amt) + ' Added to Account'],true);
this.lastReimburse=data.code;
}else{
this.notification(['error',"Code Invalid", "Please Request Another Code Or Try Again"],true);
}
}else{
  this.notification(['error',"Code Already Redeemed", "Please Request Another Code"],true);
}

          },
        },
      ],
    });
    this.alertPop.present();

  }


  tradeHist(){


    this.globalModal = this.modalCtrl.create(histModal, { trades:this.config.candlestick.trades,obfuscateYear:this.obfuscateYear}, { cssClass: '' });
    this.globalModal.present();

  }

  processCode(code){
var now=Math.floor((new Date).getTime()/1000/60/60)-467100

var decrypt=window["CryptoJS"].AES.decrypt(code, "bots");
decrypt=decrypt.toString(window["CryptoJS"].enc.Utf8);
var rez=decrypt.split(",");

if (!rez[1] || isNaN(parseInt(rez[0])) || isNaN(parseInt(rez[1]))){
  return false;
}

var time=parseInt(rez[0]);
var amt=parseInt(rez[1]);

if (now-time>25){
  return false
}

return amt


  }

spacebarPlayBtn = throttle(this.playButton.bind(this),700)
onMouseWheel=throttle(this.wheel.bind(this),30)




  wheel($event: WheelEvent | any) {
//if (!this.purchasedUpgrades.includes('brushing')){return}

if(this.config.portfolio.hide){return}


//console.error($event.deltaY)
var factor=1;
var adj=.00007*this.dateKeyIndex + 0.0116
if (this.chartsProvider.brushed){
//511,.05 | 30, .007 | 2022,.15 | 4401,.3
if ($event.shiftKey){factor=3}
if ($event.altKey){factor=.333333333}




if (Math.abs($event.deltaY)>Math.abs($event.deltaX)){
// zoom

var days=$event.deltaY*factor*adj;
if (Math.abs(days)<1){days=1;if($event.deltaY<0){days=-1}}
if ($event.deltaY<0 && this.chartsProvider.getBrushSize().actualDays-Math.abs(days*2)<=10){
  return;
}
//console.error($event.deltaY,this.chartsProvider.getBrushSize().tradingDays,this.chartsProvider.getBrushSize().actualDays,days)
  if (!$event.ctrlKey && days < 0) {
    this.chartsProvider.slideBrushRight(-1 * days);
  } else {
    this.chartsProvider.expandBrush(days, $event);
  }

if (this.chartsProvider.getBrushSize().percentage>98.5 && $event.deltaY>0){

this.chartsProvider.clearBrush();
}

}else{
// scrub

var mag=Math.abs($event.deltaX);

if (isNaN(mag)){mag=20}
mag=mag*factor*adj;

if ($event.deltaX>0){
  this.chartsProvider.slideBrushRight(mag)
}else{
  this.chartsProvider.slideBrushLeft(mag)
}


/*
var isLeft=new Date(this.chartsProvider.getCurrentBrush().endDate)>=new Date(this.currentData[this.dateKeyIndex].date)
var isRight=new Date(this.chartsProvider.getCurrentBrush().startDate)<=new Date(this.currentData[0].date)

var dys=$event.deltaX

if ($event.shiftKey){dys=dys*2.5}
if ($event.altKey){dys=dys/2.5}



//console.error(this.chartsProvider.getBrushSize().actualDays,isLeft)
//if (!(this.chartsProvider.getBrushSize().actualDays<=14 && isLeft)){
              this.chartsProvider.slideBrushRight(dys)
//}
            


console.error(this.currentData[this.dateKeyIndex])
*/
}


}else if (!this.chartsProvider.brushed && $event.deltaY<0 && Math.abs($event.deltaY)>Math.abs($event.deltaX)){

  if (!$event.ctrlKey && this.currentData.length > 0) {
    this.chartsProvider.setBrush(this.currentData[1].date)
  } else {
    this.chartsProvider.setBrush(this.currentData[0].date, this.currentData[this.currentData.length - 1].date)
  }


}






}



  generateCode(fom){

var now=Math.floor((new Date).getTime()/1000/60/60)-467100
var amt=Math.floor(Math.pow(10,fom/10));
var unencrypt=String(now)+","+String(amt)
var encrypt=window["CryptoJS"].AES.encrypt(unencrypt, "bots").toString();
return encrypt;
  }


  openLink(link, self: any = false) {
    this.playSFX('generic')
    window.open(link, self ? "_self" : "_blank", "frame=true,nodeIntegration=no");
  }



  earlyAccessPrompt(start: any = true, back: any = false) {

    var message

    if (start) {
      message = "Thank you for participating our non-profit's early access release. As the first version of the game, it is sparse and missing a great deal of content and we hope that with your feedback and balancing etc... Have fun and keep in touch by signing up for our newsletter if you haven't already!"
    } else {
      message = "Thank you for participating our non-profit's early access release. This is currently as far as this version goes but look forward tthe project goes blah blah look forward for new releases";
    }

    this.alertPop = this.alertCtrl.create({
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
          handler: () => {

          },
        },
        {
          text: "Sign-Up",
          handler: (data) => {
            if (!window.navigator.onLine) {
              this.generalPopup(
                "No Internet",
                "Signing Up requires an internet connection"
              );
              this.playSFX('error');
              return false;
            }
            var postAt = data.email.match(/@(.+)/i);

            if (
              /(.+)@(.+){2,}\.(.+){2,}/.test(data.email) &&
              data.email.length > 7 &&
              postAt &&
              !emailDomainBlacklist.includes(postAt[1])
            ) {
   // sign up to email newsletter
            } else {
              // alert('please enter a valid email');
              this.alertPop.setMessage(
                '<span class="red">Please Enter a Valid Email</span>'
              );
              return false;
            }
          },
        }
      ],
    });
    this.alertPop.present();

  }

//: Promise<any> 
  ionViewCanEnter() {

    Object.keys(this.advancedBots).forEach((bot) => {
      if (!this.advancedBots[bot].data) { delete this.advancedBots[bot] }
    })

    this.advancedBotNames = Object.keys(this.advancedBots);

    if (this.advancedBotNames.length == 0) {
      this.activeBot = DefaultBotName;
    }

    if (!this.advancedBots[this.activeBot]){this.activeBot = DefaultBotName}
/*
return new Promise((resolve, reject) => {
//console.error(this.mainMenu)
if (this.loaded){
  resolve(true)
}else{
  setTimeout(()=>{resolve(true)},50)
}

})

*/
  }


checkDailyReward(){
if (!this.lastDailyReward){return}

var now =new Date();
var last = new Date(this.lastDailyReward);

if (now.getDay()!==last.getDay() || (now.getTime()-last.getTime())>86400000){
this.lastDailyReward=now;

this.notification(['success', this.getActive('type')+" Daily Reward", '$' + this.nFormat(dailyReward) + ' Added to Bank']);
this.addCash(dailyReward);
this.statsData.startingCash+=dailyReward;

}

}

missionMenu(){
   this.globalModal = this.modalCtrl.create(missionsModal, {
      data:"stuff"
    }, { enableBackdropDismiss: true, cssClass: 'podcastsModal' });
    this.globalModal.present();
}

  ngOnInit(): Promise<any> {

    if (window["electron"]) {
      window["electron"].zoom(1.1)
    }
    this.events.subscribe("showTrace", (trace: any, traceInfo: TraceInfo) => {
      this.showTrace(trace, traceInfo);
    });


    return new Promise((resolve, reject) => {
      this.syncRemoteJSON();

      this.storage.get(storageID + (this.demo ? '_demo' : '')).then(async (val) => {
   //console.error(val);
        var localHost = window.location.href.includes('localhost');

        var param = window.location.href.split('?')[1]

        if (!localHost && !param) { this.debug = false }

        if (param) { this.debugParam = param; this.debug = true; this.muteSFX = true }
        if (!this.realVsDebugState()) { this.stateMachine.resetTrades(); }
        this.mainMenuGo(true);
        this.initDefaults();
        if (val) {
          await this.initState(val)
        } else {

          if (!this.debug && !this.debugParam) {
            this.disclaimer(true)
            this.playMusic();
          }

          if (!this.demo) {
            // check demo stuff

            this.storage.get(storageID + '_demo').then((val) => {
//console.error(val)
              if (val) {
                // ()()()()() load perks from demo
                var runningTotal = 0;

                Object.keys(val.opportunities).forEach((ky) => {

                  if (this.opportunities[ky]) {
                    if (val.opportunities[ky].completed && [ky][0] !== '_') {
                      this.opportunities[ky].completed = true;
                      runningTotal += this.opportunities[ky].reward
                    } else if (val.opportunities[ky].completed && [ky][0] == '_') {
                      this.laterExtras.push(ky)
                    }
                  }
                })



                runningTotal += this.tutorialDB['intro'].reward;
                this.tutorialDB['intro'].completed = true;

                this.demoState = { learned: val.earnedLearnings, tutorial: val.tutorialDB, runTotal:runningTotal,copy:val, port:val.portfolio[0] }
                //  tutorialDB:any={'intro':{prompt:'Intro Tutorial Complete',start:0,completed:false,unlocked:true, reward:10
                       
                 this.demoProgress = true;

              }


            })

          } else if (val) {

            Object.keys(val.opportunities).forEach((ky) => {

              if (this.opportunities[ky]) {
                if (val.opportunities[ky].completed && [ky][0] !== '_') {
                  this.opportunities[ky].completed = true;
                }
              }
            })

          }

          // console.log('NEW GAME');
        }

        resolve(true);
        setTimeout(()=>{ this.loaded=true;},50)
       

      });
    });
  }

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

  disclaimer(agree: any = true) {
    this.globalModal = this.modalCtrl.create(disclaimerModal, {
      agree: agree
    }, { enableBackdropDismiss: !agree, cssClass: 'disclaimerModal' });
    this.globalModal.present();
  }

  toggleMute(e) {
    this.muteSFX = !e

    if (this.music && this.music.playing()) { this.music.stop() }

    if (this.mainMenu && !this.muteSFX && !this.debug) {
      this.playMusic();
    } else if (e) { this.playSFX('toggle') }
    //console.error(this.muteSFX);
    this.saveState();

  }
  mainMenuGo(init: any = false) {
    this.stopSim();
    this.supressLabels();
    //console.log("main menu go",init)
    if (!init && (!this.music || !this.music.playing()) && !this.muteSFX && !this.debug) {
      this.playMusic();
    }

    this.showAds() // ()()()()()()()()()
    this.mainMenu = true;
    //this.mainMenuEnd = false;
    //this.animateOpening()
  }


  async unwrapPaper(botname: any = false) {

    if (this.paperState.mode == 0) {
      //paper

      var diff = this.dateKeyIndex - this.paperState.dateKeyIndex;

      paperPersist.forEach((field) => {
        this[field] = this.paperState[field]
      })

      await this.pushData(diff)

    } else {
      //backtest
      paperPersist.forEach((field) => {
        this[field] = this.paperState[field]
      })

    }

    this.paperState = { mode: -1 }
    this.saveState();
  }

updateCash(amt){
// conflicts with stock mode ()()()
  this.addCash(amt-this.cashVsInvested[0]);
  this.setTradeVol()
}

  syncRemoteJSON() {
    // sync remote JSON
    console.log("sync to remote server")

  }

  initBotIfRequired: () => Promise<void> = () => {
    if (!this.activeBot || this.activeBot == DefaultBotName || this.initedBots.indexOf(this.activeBot) != -1) {
      return Promise.resolve();
    }
    console.log("initing bot...", this.activeBot);
    if (!this.advancedBots[this.activeBot]) {
      console.log("Bot not found. Returning.");
      this.activeBot = DefaultBotName;
      return Promise.resolve();
    }
    document.querySelector("page-home").classList.add("force-visible");
    return this.navCtrl.push(BaklavaPage, this.baklavaParams(this.advancedBots[this.activeBot]))
      .then(() => {
        return this.navCtrl.pop();
      })
      .then(() => {
        document.querySelector("page-home").classList.remove("force-visible");
        this.initedBots.push(this.activeBot);
        console.log("bot inited");
      })
  }

  notification(data,force:any=false) {

    if (!this.warnings.notifications && !force) { return }
    this.playAudio('notification')
    var dat = {
      title: data[1],
      message: data[2],
      position: "topLeft"
    }

    if (data[3]) {
      dat['color'] = data[3]

    }
    iziToast[data[0]](dat);
  }


  balSimOptions(smart: any = false) {

    this.alertPop = this.alertCtrl.create({
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
        }/*,
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
          handler: (data) => {

            var ticker = data.ticker;
            if (ticker !== "continue" && ticker !== "random") {
              ticker = data.ticker.toUpperCase();
              if (!this.getActive("tickers").includes(ticker)) {
                this.alertPop.setMessage('<span class="red">Please Enter a Valid Ticker</span>');
                return false;
              }
            }
            this.simAI(data, true, ticker)

          },
        },
        {
          text: "Dumb",
          handler: (data) => {

            var ticker = data.ticker;
            if (ticker !== "continue" && ticker !== "random") {
              ticker = data.ticker.toUpperCase();
              if (!this.getActive("tickers").includes(ticker)) {
                this.alertPop.setMessage('<span class="red">Please Enter a Valid Ticker</span>');
                return false;
              }
            }
            this.simAI(data, false, ticker)

          },
        },
      ],
    });
    this.alertPop.present();

  }

  playSFX = this.playAudio.bind(this);

  playSFXlocal = throttle(this.playSFXInner.bind(this),this.simSpeed[0]<100?30:20)


  playSFXInner(name, vol: any = 1, loop: any = false) {

    if (name == 'generic') { vol = .95 }
    if (name == 'mode') { vol = .2 }
    if (name == 'toggle') { vol = .37 }
    if (name == 'alt') { vol = .2 }
    if (name == 'error') { vol = .7 }
    if (name == 'notification') { vol = 1 }
    if (name == 'tick') {
      vol = -0.095 * Math.log(this.simSpeed[0]) + .51
      if (vol > .28) { vol = .28 }
      if (vol < .04) { vol = .04 }
    }

    if (!this.muteSFX && !this.debug) {
      var sfx = new howler.Howl({
        src: "assets/audio/" + name + ".mp3",
        loop: loop,
        volume: vol
      })
      sfx.play()
    }
  }

  playMusic() {

    if (this.music && this.music.playing()) {
      console.warn('music playing twice?')
      return;
    }

    this.music = new howler.Howl({
      src: "assets/audio/music.mp3",
      loop: true,
      volume: .35,
      onend: () => { if (!this.mainMenu) { this.music.stop() } }
    })

    this.music.play()


  }


  simAI(data, smart, ticker) {

    if (ticker !== "continue") {

      if (ticker == "random") {
        this.initStock()
      } else {
        this.initStock(ticker)
      }
    }

    document.getElementById("d3el").style.opacity = ".1";

    var temp = data.smart.split(',');





    setTimeout(() => {
      this.fee = parseFloat(data.fee);
      this.loanData.rate = parseFloat(data.interest) * 100;
      this.balanceSim(smart, parseFloat(data.reward), parseFloat(data.maxLoan), parseInt(data.iterations), parseFloat(data.passive), [parseFloat(temp[0]), parseFloat(temp[1]), parseInt(temp[2]), parseInt(temp[3])])
    }, 400)

  }

  balanceSim(smart: any = false, rewardFactor: any = 1, loanFactor: any = 1, iterations: any = 100, passiveThresh: any = .1, smartData) {
    // output time milestones with each upgrade...

    //console.log(smartData);
    var output = [];
    var elapsedRecords = 0;
    var timeSpent = 0;
    var maxGrowth = 1;
    var minGrowth = 1;
    var fees = 0;
    var trades = 0;
    var rewards = 0

    smartData[0] += 1
    smartData[1] += 1
    this.balanceOptions.persist = true;
    this.brushThreshold[1] = 7;
    this.balanceOptions.suppress = true
    this.balanceOptions.marginCallSupress = true;

    Object.keys(this.warnings).forEach((ky) => {
      this.warnings[ky] = true;
    })
    this.warnings.notifications = false;
    //console.log(this.warnings);

    let balanceInt = setInterval(async () => {

      // take out max loan

      if (this.loanData.max !== this.loanData.amt) {
        this.events.publish("loan", this.loanData.max)
      }

      // buy all upgrades that give learn and earn, max loans, and speed.

      var genUpgrades = [];

      Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((key) => {
        if (!this.purchasedUpgrades.includes(key)) {
          var upgrade = (this.demo ? demoUpgrades : this.rawUpgrades)[key];
          upgrade.id = key;

          Object.keys(this.learning).forEach((ky) => {
            if (this.learning[ky].upgrade == upgrade.id) {
              upgrade.reward = this.learning[ky].reward;
            }
          })

          genUpgrades.push(upgrade);
        }
      });

      // always buy learn and earn and get rewards
      if (rewardFactor > 0) {
        genUpgrades.forEach((upgrade) => {

          if (upgrade.reward >= upgrade.cost && this.portfolio[0] >= upgrade.cost) {
            this.events.publish("upgrade", upgrade.id, upgrade.cost, this.warnings);
            rewards += upgrade.reward;
            this.addCash((upgrade.reward - upgrade.cost) * rewardFactor + upgrade.cost);

            output.push({ [upgrade.id]: [Math.floor(timeSpent / 60 * 100) / 100 + " min"] });
          }

        })
      }

      /**/
      genUpgrades.forEach((upgrade) => {

        if (!upgrade.reward && this.portfolio[0] >= upgrade.cost) {

          var maxLoan = this.loanData.max;
          if (
            // if upgrade is less than 10% of wealth, just buy it
            upgrade.cost / this.portfolio[0] < passiveThresh ||
            // if loan will increase funds buy it
            (upgrade.id.slice(0, 7) == "loanMax" && this.portfolio[0] > upgrade.cost &&
              this.loanData.max * parseInt(upgrade.id.split("_")[1]) - maxLoan > upgrade.cost)

          ) {

            this.events.publish("upgrade", upgrade.id, upgrade.cost, this.warnings);

            output.push({ [upgrade.id]: Math.floor(timeSpent / 60 * 100) / 100 + " min" });
          }

        }

      })


      //this.setTradeVol();
      // invest all money in stock always
      if (!smart) {
        this.tradeVolume = this.cashVsInvested[0] - this.cashVsInvested[0] * this.fee;
        if (this.tradeVolume > 1) {
          this.buyvssell = true;
          this.trade(true);

        }
      } else {


        var signal: any = false;

        var tenSMA = this.chartsProvider.calculateData("sma", new Date(this.currentDate), { period: smartData[2] }).value;
        var tenSMA_DaysAgo = this.chartsProvider.calculateData("sma", new Date(this.currentData[this.dateKeyIndex - smartData[3]].date), { period: smartData[2] }).value;


        var growth = tenSMA / tenSMA_DaysAgo


        if (growth > maxGrowth) {
          maxGrowth = growth
          //console.log(maxGrowth);
        }

        if (growth < minGrowth) {
          minGrowth = growth;
          //console.log(minGrowth);
        }




        //console.log(growth,smartData[0],1/smartData[1]);
        if (growth > 1 && growth > smartData[0]) {
          signal = 'buy';
        } else if (growth < 1 && growth < (1 / smartData[1])) {
          signal = 'sell';
        }


        // Buy Signal
        if (signal == 'buy') {
          this.tradeVolume = this.cashVsInvested[0] - this.cashVsInvested[0] * this.fee;
          if (this.tradeVolume > 1) {
            trades++
            fees += this.cashVsInvested[0] * this.fee
            this.buyvssell = true;
            this.trade(true);

          } else {
            console.error('already fully invested', elapsedRecords);
          }
        }

        // Sell Signal
        if (signal == 'sell') {
          this.tradeVolume = this.cashVsInvested[1] - this.cashVsInvested[1] * this.fee;
          if (this.tradeVolume > 1) {
            trades++
            fees += this.cashVsInvested[1] * this.fee
            this.buyvssell = false;
            this.trade(true);

          } else {
            console.error('already fully divested', elapsedRecords);
          }
        }

      }
      if (this.dateKeyIndex < this.currentData.length - 2) {
        await this.pushData(1, true);
      }

      elapsedRecords++
      timeSpent += 1 * this.showRealSim(this.simSpeed[2] / 10)
      if (this.cashVsInvested[0] < 0) {
        //console.log(elapsedRecords,this.cashVsInvested[0],this.portfolio[1])
      }
      //console.log(this.dateKeyIndex,this.currentData.length);
      if (elapsedRecords >= iterations || (this.dateKeyIndex >= this.currentData.length - 2)) {


        clearInterval(balanceInt);
        //console.error(this.currentTicker[0])
        //console.error(output)
        document.getElementById("d3el").style.opacity = "1";
        if (this.dateKeyIndex >= this.currentData.length - 2) {
          this.stockDone();
        }

        this.alertPop = this.alertCtrl.create({
          title: "Results for " + this.currentTicker[5] + " : " + this.currentTicker[0] + " (" + elapsedRecords + " days)",
          message: JSON.stringify(output) + "...." + JSON.stringify({ fees: Math.round(fees), trades: trades, maxSignalLoss: Math.round(((1 / minGrowth) - 1) * 100) / 100, maxSignalGain: Math.round((maxGrowth - 1) * 100) / 100, assets: Math.round(this.portfolio[0]), profitperdayminusrewards: Math.round((this.portfolio[0] - rewards) / elapsedRecords) }),
          buttons: [
            {
              text: "Dismiss",
              handler: (data) => { },
            },
          ],
        });
        this.alertPop.present();


      }

    }, 0)



  }

  clearLimitOrders() {
    for (var i = this.limitStops.length - 1; i > -1; i--) {
      this.rmLimitStop(i)
    }
    this.limitStops = [];
  }

  limitStopBlur() {
    if (!this.limitStop) { this.limitStop = this.currPrice[0] }

    if (this.buyvssell && this.limitStop > this.currPrice[0]) { this.limitStop = this.currPrice[0] } else if (this.limitStop < 0) { this.limitStop = 0 }
    //253
    this.limitRender = this.limitStop.toFixed(2);

    //console.error(this.limitRender);
  }



  limitStopChange(event) {
    const limitStopCursorPosition = (event.target.selectionStart);
    let amt = event.target.value;

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


    let re = new RegExp(/^[\d\.]*$/)
    if (!re.test(amt)) {
      this.limitRender = 0;
      this.CDRef.detectChanges();
      this.limitRender = amt.replace(/[^\d\.]/, '');
      setTimeout(() => {
        event.target.selectionStart = limitStopCursorPosition - 1
        event.target.selectionEnd = limitStopCursorPosition - 1
      });
      return;
    }

    this.limitStop = +amt;

    var decimals = (String(amt).split('.')[1] || []).length
    if (decimals > 2) { this.limitRender = this.limitStop.toFixed(2) }

    if (this.buyvssell && amt > this.currPrice[0]) {
      this.limitStop = this.currPrice[0];
      this.limitRender = +this.limitStop.toFixed(2);
    }

    if (this.limitStop < 0) { this.limitStop = 0; this.limitRender = +this.limitStop.toFixed(2); }

    if (this.tutorialState[0] == 102 && amt < this.currPrice[0]) {
      this.tutorialState[0] = 103;

      if (this.tradeVolume < 0.1) {
        this.quickCash(50)
      }
    }

    if (this.tutorialState[0] == 103 && this.currPrice[0] <= amt) {
      this.tutorialState[0] = 102
    }
    //
    let x = +this.limitStop;
    this.limitRender = 0;
    this.CDRef.detectChanges();
    var rez = Math.floor(x * 100) / 100;
    //console.log(rez);
    if (rez == 0) {
      this.limitRender = '';
    } else {
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
    setTimeout(() => {
      event.target.selectionStart = limitStopCursorPosition - minus
      event.target.selectionEnd = limitStopCursorPosition - minus
    });


  }



  setAutoType(dest) {
    // warnings: any = { limit: false, fee: false, fiftyper: false, sellupgrade: false, limitTrigger: false, simpleNavAway:false, advancedNavAway:false };

    if (dest == 1 && (this.tutorialState[0] == 101 || this.tutorialState[0] == 100)) {
      this.tutorialState[0] = 102;
      this.buyvssell = true;
    }

    if (dest == 2 && (this.tutorialState[0] == 201 || this.tutorialState[0] == 200)) {
      this.tutorialState[0] = 202;
      this.buyvssell = true;
    }

    this.playSFX('alt')


    if (this.manual == 1 && this.limitStops.length > 0 && !this.warnings.limitNavAway) {

      this.alertPop = this.alertCtrl.create({
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
            handler: () => { },
          },
          {
            text: "Ok",
            handler: (data) => {

              this.warnings.limitNavAway = data.length > 0;
              this.setAutoType(dest);
              this.clearLimitOrders();
              this.saveState();
            },
          },
        ],
      });
      this.alertPop.present();

      return
    }


    if (this.manual == 2 && this.activeBot !== DefaultBotName && !this.warnings.simpleNavAway) {

      this.alertPop = this.alertCtrl.create({
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
            handler: () => { },
          },
          {
            text: "Ok",
            handler: (data) => {

              this.warnings.simpleNavAway = data.length > 0;
              this.simpleBotActive = false;
              this.activeBot = DefaultBotName;
              this.setAutoType(dest);
              this.saveState()
            },
          },
        ],
      });
      this.alertPop.present();

      return
    }

    this.activeBot = DefaultBotName;
    this.manual = dest;
    this.clearLimitOrders();
    this.saveState();
  }

  openPip(id) {

if (id!=="translate"){
if (id!=="discord" && id!=="bbDiscord"){
    this.pipVid = false;
    this.radio = false;

    var radio = id.includes('iheart.com'); // crude differentiation

    if (!radio) {
      this.pipVid = id;
    } else {
      this.radio = id;
    }
    }else{
      if (id=='discord'){
 this.discordOpen=true;
      }else{
this.bbDiscordOpen=true;
      }
      
    }
}
    function dragElement(elmnt) {

      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
       //console.error(document.getElementById(elmnt.id + "header"));
      if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        //console.error('fires',elmnt.id + "header");
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

    dragElement(document.getElementById(id=="bbDiscord"?"bbFrame":(id=="translate" ? "translateFrame" : (id=="discord" ? "discordFrame" : (radio ? "radioFrame" : "pipFrame")))));

  }

  syncUpgradeModes() {

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

  }

  progressUpgradeTo(upgrade, supress: any = false) {

    var kys = Object.keys((this.demo ? demoUpgrades : this.rawUpgrades))

    kys.sort((a, b) => {
      return (this.demo ? demoUpgrades : this.rawUpgrades)[a].reward - (this.demo ? demoUpgrades : this.rawUpgrades)[b].reward
    })

    for (let i = 0; i < kys.length; i++) {

      if (kys[i] == upgrade) {
        this.processUpgrade(kys[i], supress);
        break
      } else {
        this.processUpgrade(kys[i], true);
      }
    }

    this.setTradeVol();


  }

stopIT(){
  alert('hi');
}
  mainMenuButton(type) {

    // debug ()()()()
    if (this.debugParam) {
      var lowerParam = this.debugParam.toLowerCase();

      if (this.debugParam == 'intro') {
        this.startTutorial('intro');
      } else {

        Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((key) => {
          if (key.toLowerCase() == lowerParam) {
            this.debugParam = key;
          }
        })

        setTimeout(() => {
          if ((this.demo ? demoUpgrades : this.rawUpgrades)[this.debugParam]) {
            this.progressUpgradeTo(this.debugParam);
          } else if (this.debugParam.toLowerCase() == 'margincall') {
            this.progressUpgradeTo(marginUpgrade);
          } else if (this.debugParam.toLowerCase() == 'demo') {
            this.startTutorial('intro')
          } else if (this.debugParam.toLowerCase() == 'test') {

            this.progressUpgradeTo('sandbox', true);
          } else if (this.debugParam.toLowerCase() !== 'debugsimple' && this.debugParam.toLowerCase() !== 'debugnodes') {
            alert('upgrade "' + this.debugParam + '" does not exist');
          } else {
            // ----------- DEBUG INSTRUCTIONS ---------

            this.debugUpgrade();
            this.addCash(500);


            this.advancedBots[DefaultSimpleBotName] = basicSimpleBot;

            this.activeBot = DefaultSimpleBotName;

            if (this.debugParam.toLowerCase() == 'debugnodes') {
              // include new stuff
              this.processUpgrade('vizBots2')
              this.processUpgrade('vizBots3')
              this.processUpgrade('vizBots4')
              this.manual = 3;
              this.openBot();

            }

            //-----------------------------------------
          }

        }, 400)
      }
    }

    //------------
    if (!this.unlockModeState[type] && type !== 'stock') { return }
    //console.log(this.unlockModeState)
    this.calcExtraAvail();
    this.syncUpgradeModes()
    if (type == 'sandbox') {
      // console.log(this.sandbox)
      this.sandbox.new = false;
    }

    this.playSFX('generic');
    this.mainMenu = false;



    this.showAd[0] = false;
    if (this.showAd[1]) {
      clearTimeout(this.showAd[1]);
    }

    this.mode = type;

    if (type == 'stock') {
      //console.log(this.dateKeyIndex==-1,this.purchasedUpgrades.length==0,this.tutHold==-1);
      if (this.demoProgress) {

        this.alertPop = this.alertCtrl.create({
        title: "Demo Progress",
        message:
          "Thank you for purchasing Trade Bots after playing the demo. By hitting 'apply' your 'Learn & Earn' revenue will be carried over upon unlocking and any extras earned have been transferred, including the tutorial.",
        buttons: [
          {
            text: "No Thanks",
            handler: (data) => {
              this.demoState=false;
            },
          },
          {
            text: "Apply",
            handler: (data) => {

               this.addCash(this.demoState.port);
               this.notification(['success', 'Demo Opportunities', '$' + this.nFormat(this.demoState.port) + ' Added to Account']);              
                this.calcLearnEarn();
                this.setTradeVol();
                this.calcExtraAvail();


            },
          },
        ],
      });
      this.alertPop.present();

      this.demoProgress = false;




      } else {

        if ((this.dateKeyIndex == -1 && this.purchasedUpgrades.length == 0) || this.tutHold == -1) {

          this.tutHold = 0;
          this.firstTimePop();

        }
      }


      if (!this.currentTicker) {
        this.initStock()
      } else {
        if (!this.lastSaveCampaign) {

          allPersist.forEach((data) => {
            if (typeof this[data] !== 'undefined'){
            this[data] = this.campaignStore[data];
            }
          })
        }

        //this.initStock(this.currentTicker[this.currentTicker.length - 1]) 
           this.proceedData();
      }

    
     
    } else {


      this.storage.get(storageID + (this.demo ? '_demo' : '') + "_" + this.mode).then(async (val) => {
//console.log(val);
        if (!val || isNaN(val.portfolio[0])) {
          var sharedMilestones = [];

          Object.keys(this.milestones).forEach((milestone) => {

            if (this.unlockedMilestones.includes(milestone)) {
              sharedMilestones.push(milestone)
            }

          })
          // load from defaults
          modePersist.forEach((field) => {

            if (typeof this.defaults[field] !== 'undefined') {
              //console.log('set',field);
              this[field] = cloneDeep(this.defaults[field])
            }
          })

          if (this.mode == 'sandbox') {
            this.increaseMaxSim(999999)
          }
            this.obfuscateYear = !this.purchasedUpgrades.includes("yearreveal");
            this.obfuscatePrice = !this.purchasedUpgrades.includes("price");
            this.config.hideYears = this.obfuscateYear;

            this.purchasedUpgrades = this.purchasedUpgrades

            var defaultConfig = cloneDeep(configDefault)
            this.config = defaultConfig;
          
          this.visibleExtraGraphs=[]
          //setTimeout(()=>{},50)
          //console.error("init mode")
          this.initStock();
          this.processUpgrade('step', true)
          this.processUpgrade('margin', true)
          this.modePop();

//console.log('blah');
          //console.error("no storage for "+this.mode+" this breaks things?")
        } else {
 // console.log(val.currentTicker,val.currentData)        
if ((!val.currentTicker || !val.currentData) && val.config){val.config=undefined;}
          modePersist.forEach((field) => {
            if (typeof val[field] !== 'undefined'){
            this[field] = val[field]
            }
          })
          this.simSpeed[0] = 0;
//console.log('ddddd');
//this.checkUndefConfig();
          this.proceedData();
        }



      })
    }

  }

  modePop() {
    var message = ""

    if (this.mode == 'sandbox') {
      message = "Control All Aspects of the Simulation"
    } else if (this.mode == 'etf') {
      message = "Re-Play the Main Game with a pool of ETFs"
    } else if (this.mode == 'crypto') {
      message = "Re-Play the Main Game with Cryptocurrencies"
    }


    this.notification(['info', "Welcome to " + this.mode.toUpperCase() + " MODE", message])


  }
  //HOT
  calcInterestRate() {
    var port = this.cashVsInvested[0] + this.cashVsInvested[1] + this.limDeduction[0] - this.loanData.amt;
    if (port < 1) { port = 1 }
    var rate = -.424 * Math.log(port) + 13.172 + .9;
    if (rate > startingInterestRate) { rate = startingInterestRate }

    //if (rate > this.loanData.rate) { rate = this.loanData.rate }
    this.loanData.rate = Math.floor(rate * 100) / 100;
    //console.log(rate);
    this.loanData.rate -= this.loanData.upgradeMinus;
    if (this.loanData.rate<5){this.loanData.rate=5}
    // console.log(this.loanData.rate);
    this.loanData.mo = Math.floor((this.loanData.rate * this.loanData.amt) / 12) / 100
  }



  openLog(name) {
    this.tutClick(211);

    //console.error(name);

    this.globalModal = this.modalCtrl.create(logsModal, { log: this.advancedBots[name].logs, name: name, tutState: this.tutorialState[0], read: this.advancedBots[name].read, year: this.purchasedUpgrades.includes("yearreveal") ? -1 : this.YrsElapsed }, { cssClass: '' });
    this.globalModal.present();
  }


importCSV(){

const fileInput:any = document.getElementById('myFile');
if (fileInput===null){return}
fileInput.onchange = (e) => {
  if (e.target.files[0]){


d3.csv(URL.createObjectURL(e.target.files[0]), async (error, data) => {

var issue:any=-1
var type=0;
if (error){issue=0}
if (!data[0]){issue=0}else{
if (!(data[0].close && data[0].high && data[0].low && data[0].volume && data[0].open)){
issue=0
}
}

function notInt(num:any){
num=parseFloat(num)

return isNaN(num) || Math.floor(num)!==num

}


if (issue==-1){
for (let i=0;i<data.length;i++){
  var row=data[i]

if (notInt(row.close) || notInt(row.high) || notInt(row.low) || notInt(row.volume) || notInt(row.open)){
issue=i+1

break;
}

var today=new Date(row.date)

if (!today){issue=i+1;type=1;break}else{
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yy = today.getFullYear().toString().substr(-2);
var dt=mm+'/'+dd+'/'+yy
if (row.date!==dt){
  console.log(row.date,dt)

  issue=i+1;type=1;break;
}

}

}
}





if (issue==-1){
  this.initCustom([e.target.files[0].name,URL.createObjectURL(e.target.files[0])])
}else{

var message

if (issue==0){

  message="The Uploaded CSV is missing required headers or they are spelled incorrectly. Please download the example CSV for more information."

}else if (type==0){

 message="Some data in row "+issue+" is not an integer. Please download the example CSV for more information."

}else{

 message="The date in row "+issue+" is not properly formatted. Please download the example CSV for more information."
}


      this.alertPop = this.alertCtrl.create({
        title: "Invalid Format",
        message:
          message,
        buttons: [
          {
            text: "Dismiss",
            handler: (data) => {
            },
          },
          {
            text: "Example",
            handler: (data) => {
this.openLink("https://www.cinqmarsmedia.com/tradebots/docs/example.csv");
            }
          }

            ]})
  this.alertPop.present();
}


})



  }
}
fileInput.click();
}

  changeDataType(e) {
    // do we reimport every time?

    this.sandbox.random=e=="rand"

    if (this.sandbox.random){
      this.shownType="rand"
    }


    if (e == "upload") {

      this.shownType="custom"

//this.generalPopup("Custom Data", "We're hard at work adding this to the game and it will be available soon in a free update along with many other features and bugfixes. Please subscribe to our newsletter for updates on the developer roadmap for this game and others. Thank you for your patience and understanding!");
//this.sandbox.type="stock";
this.importCSV();
//this.sandbox.type=e


      /*
      this.globalModal = this.modalCtrl.create(customDataModal, {}, { cssClass: '' });
      this.globalModal.present();
      */
    }else{
      this.sandbox.type=e
//if (this.sandbox.type==e){return}




this.initStock();
//console.error('test to make sure this is graceful');
 //alert("handle transition to different data type " + e);

    }



  }

  calcExtraAvail() {

    var rewards = 0

    Object.keys(this.opportunities).forEach((key) => {
      if (!this.opportunities[key].completed) {
        if (!this.limitedAds || (this.limitedAds && this.opportunities[key].notAd)){
        rewards += this.opportunities[key].reward
}
      }
    })

    this.extraAvail = rewards;

  }

  extraMenu(id: any = false) {


    this.calcExtraAvail()

    this.globalModal = this.modalCtrl.create(extrasModal, {
      data: this.opportunities,
      reward: this.extraAvail,
      limAds:this.limitedAds,
      id: id
    }, { cssClass: 'extrasModal' });
    this.globalModal.present();

    // this.opportunities[key].completed
    //calcExtraAvail()
  }

  proceedData() {

    this.checkUndefConfig();
    //console.log(this.unlockModeState);
    //console.log(this.idleData);
    if (this.mode == 'sandbox') {
      this.increaseMaxSim(999999)
    }
    this.checkDailyReward();
    this.setDimensions();
    this.chartsProvider.render("#d3el", this.config);
    this.setTradeVol();
    this.upcomingUpgrades();
    this.calcAvailUpgrades();
    this.calcLearnEarn();

    this.YrsElapsed = this.calcYearsElapsed()
    this.obfuscateYear = !this.purchasedUpgrades.includes("yearreveal")
    this.obfuscatePrice = !this.purchasedUpgrades.includes("price");
    this.config.hideYears = this.obfuscateYear;

    //--------idleMode

    var currentTime = new Date().getTime();
    //console.log(this.dateKeyIndex,this.currentData.length)
    if (this.dateKeyIndex == this.currentData.length - 1) {
      this.stockDone();
    } else if (this.purchasedUpgrades.includes('idle') && (currentTime - this.idleData.stamp > 3700000) && this.simSpeed[2] < 80) {
      this.globalModal = this.modalCtrl.create(idleModal, {
        data: this.idleData,
        maxSim: this.simSpeed[2],
        realSim: this.showRealSim(this.simSpeed[2] / 10)

      }, { cssClass: 'modalIdle' });
      this.globalModal.present();
    }
this.toggleExtIndicator();


if (this.mode=='stock' && this.tutRestart){
  this.startTutorial(this.tutRestart)
}
  }


  openFileWith(file, filename) {


    if (this.navCtrl.getActive().name == "BaklavaPage") {

      this.alertPop = this.alertCtrl.create({
        title: "Overwrite Bot",
        message:
          "Overwrite current bot with file?",
        buttons: [
          {
            text: "Cancel",
            handler: (data) => {
            },
          },
          {
            text: "Overwrite",
            handler: (data) => {

              let reader = new FileReader();
              file = file.target.files[0]

              reader.onload = () => {
                //reader.result

                var U8 = new Uint8Array(reader.result as ArrayBuffer)
                const decompressed = fflate.decompressSync(U8);
                const bot = fflate.strFromU8(decompressed);

                this.events.publish("loadBotFile", JSON.parse(bot));
              };

              reader.onerror = () => {
                console.error(reader.error);
              };

              reader.readAsArrayBuffer(file);

            },
          },
        ],
      });
      this.alertPop.present();

    } else {

      if (this.purchasedUpgrades.includes("botPort2")) {

        this.alertPop = this.alertCtrl.create({
          title: "New Bot From File",
          message:
            "Create a new bot from this file?",
          buttons: [
            {
              text: "Cancel",
              handler: (data) => {
              },
            },
            {
              text: "Create",
              handler: (data) => {

                if (!this.advancedBots[filename]) {
                  this.updateUnlockBaklavaState()


                  let reader = new FileReader();
                  file = file.target.files[0]

                  reader.onload = () => {
                    //reader.result

                    var U8 = new Uint8Array(reader.result as ArrayBuffer)
                    const decompressed = fflate.decompressSync(U8);
                    const bot = fflate.strFromU8(decompressed);
                    this.activeBot = filename;
                    this.navCtrl.push(BaklavaPage, this.baklavaParams({ name: filename, mode: 1, logs: [], sim: 0, gains: null, data: JSON.parse(bot) }))

                  };

                  reader.onerror = () => {
                    console.error(reader.error);
                  };

                  reader.readAsArrayBuffer(file);


                } else {
                  this.generalPopup("Name Taken", "Please rename file to be unique");
                  this.playSFX('error');
                  return false
                }

              },
            },
          ],
        });
        this.alertPop.present();


      } else {
        this.generalPopup("Unlock Bot Import", "Visual Bot Importing has not yet been unlocked. Finish the main campaign.");
        this.playSFX('error');


      }
    }

  }


  debugBtn() {
    this.calcResistance();
  }

  calcResistance() {
    const adjusted = -1;
    var index = this.dateKeyIndex

    if (this.chartsProvider.brushed) {
      var end = this.chartsProvider.getCurrentBrush().endDate;

      for (let i = this.dateKeyIndex; i > 0; i--) {
        if ((new Date(this.currentData[i].date).getTime() - new Date(end).getTime()) / 1000 <= 0) {
          index = i;
          break;
        }
      }

    }

    index = index + adjusted;

    var obj = { 'c': null, 'h': null, 'l': null }
    //console.log(dayData);
    obj.c = this.currentData[index].close;
    obj.h = this.currentData[index].high;
    obj.l = this.currentData[index].open;
    // floorPivots, Demarks, Woddies, fibRetracements
    return tw.floorPivots([obj])[0].floor;
  }

  calcPivots(startIndex, endIndex) {
    var points = [];
    var obj = { 'c': null, 'h': null, 'l': null }
    for (var i = startIndex; i < endIndex; i++) {
      var dayData = this.currentData[i];
      //console.log(dayData);
      obj.c = dayData.close;
      obj.h = dayData.high;
      obj.l = dayData.open;
      points.push(obj)
    }


    return tw.floorPivots(points);
  }


  resetStorage() {
    if (!this.debug) {

      this.alertPop = this.alertCtrl.create({
        title: "Are You Sure?",
        message:
          "Delete All Save Data and Restore Defaults? This cannot be undone.",
        buttons: [
          {
            text: "Cancel",
            handler: (data) => {
            },
          },
          {
            text: "Delete",
            handler: (data) => {
              this.storageKillSwitch = true;

if (this.demo){

     this.storage.get(storageID).then(async (mainStore) => {

if (!mainStore){
    this.storage.clear().then(() => {setTimeout(() => {window.location.reload()}, 0)})
}else{
    this.generalPopup("Main Game Save Detected", "Resetting Storage would wipe main game data. Aborting.");
}

     })

}else{

  this.storage.clear().then(() => {

                if (!this.demo && this.demoState){
this.storage.set(storageID + '_demo', this.demoState.copy).then(() => {
  setTimeout(() => {window.location.reload()}, 10)


})
  }else{
     setTimeout(() => {window.location.reload()}, 10)
  }
              });

}         
            },
          },
        ],
      });
      this.alertPop.present();


    } else {
      this.storageKillSwitch = true;


      this.storage.clear().then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 0)
      });



    }

  }



  firstTimePop() {
    if (!this.debug) {
      this.startTutorial('intro');
    };
  }

  startTutorial(id) {
    // return iff not stock

    if (this.tutorialDB[id].completed){
      return;
    }
console.log(id);
    this.tutorialDB[id].unlocked = true;
    this.tutorialState = [this.tutorialDB[id].start, id]
    if (id == 'intro') {
      this.globalModal = this.modalCtrl.create(tutorialModal, {
        id: id, demo: this.demo
      }, { enableBackdropDismiss: false, cssClass: 'tutorialModal' });
      this.globalModal.present();
    } else if (id == 'longshort') {
      this.toggleBuyVSell(true);
      if (this.totalPortfolio < 0.1) {
        this.quickCash(50)
      } else if (this.cashVsInvested[1] !== 0) {
        this.portfolio[1] = 0;
        this.cashVsInvested = [this.portfolio[0], 0];
        this.notification(['success', 'All Stock Sold', 'Holdings Liquidated'])
      }
    }
  }
  showAds() {
    var avail = []
    Object.keys(this.opportunities).forEach((ky) => {
      if (this.opportunities[ky].adNum && !this.opportunities[ky].completed) {
        avail.push(ky);
      }
    })

    if (avail.length > 0) {

      this.currAd = avail[Math.floor(Math.random() * avail.length)]

      this.showAd[1] = setTimeout(() => {
        //this.playSFX('mode');
        this.showAd[0] = true;
      }, Math.floor((Math.random() * 3 + 2) * 1000))

    }
  }

  tickerIndex(lower, upper) {
    let activeTix=this.getActive("tickers");
    var totalEarned = this.portfolio[0];
    //console.log(this.purchasedUpgrades)
    this.purchasedUpgrades.forEach((id) => {
      if ((this.demo ? demoUpgrades : this.rawUpgrades)[id] && typeof (this.demo ? demoUpgrades : this.rawUpgrades)[id].cost !== "undefined") {
        totalEarned += (this.demo ? demoUpgrades : this.rawUpgrades)[id].cost / 1.5
      } else {
        console.warn(id + " not defined in (this.demo?demoUpgrades:rawUpgrades) or cost is not")
      }
    })
    //console.log(totalEarned,this.statsData.portfolioHistory.length)
    //var rez = Math.floor(Math.pow(totalEarned,.4))
    if (totalEarned < 1) {
      totalEarned = 1;
    }
    var rez = 342 * Math.log(totalEarned) - 2314 - Math.sqrt(this.statsData.portfolioHistory.length);


    rez = Math.floor(rez);

    if (rez > upper) {
      rez = upper - Math.floor(Math.random() * 100);
    } else if (rez < 0 || isNaN(rez)) {
      rez = Math.floor(Math.random() * 10);
    }

    if (rez>=upper){rez=upper-Math.floor(Math.random()*15)}

      if (this.statsData.portfolioHistory.length/this.getActive("tickers").length>.95){
        rez=Math.floor(Math.random() * upper)
      }

      if (rez<0){rez=0}

    console.warn('index generated of ' + upper, rez);
    return rez;
  }

  getActive(param) {

    var type = (this.mode == 'sandbox' ? this.sandbox.type : this.mode);

    if (param == "type") {
      if (this.mode == "stock" || (this.mode == 'sandbox' && this.sandbox.type == "stock")) {
        type = "Stock"
      } else if (this.mode == "etf" || (this.mode == 'sandbox' && this.sandbox.type == "etf")) {
        type = "ETF"
      } else if (this.mode == "crypto" || (this.mode == 'sandbox' && this.sandbox.type == "crypto")) {
        type = "Crypto"
      } else {
        type = "Custom"
      }

      return type

    }


      if (type == "stock") {
      if (param == "tickers") {
        return activeTickers
      } else if (param == "scores") {
        return mtScores
      } else if (param == "db") {
        return stockDB
      } else if (param == "start") {
        return startIndex
      } else if (param == "path") {
        return "stocks"
      }
    } else if (type == "etf") {

      if (param == "tickers") {
        return etfActiveTickers
      } else if (param == "scores") {
        return etfScores
      } else if (param == "db") {
        return etfDB
      } else if (param == "start") {
        return {}
      } else if (param == "path") {
        return "etfs"
      }


    } else if (type == "crypto") {

      if (param == "tickers") {
        return cryptoActiveTickers
      } else if (param == "scores") {
        return cryptoScores
      } else if (param == "db") {
        return cryptoDB
      } else if (param == "start") {
        return {}
      } else if (param == "path") {
        return "crypto"
      }

    } else if (type == "custom") {
      //alert('DO custom logic');
    return {}
    }

  }

  tickerSelect() {
    var type = this.mode == 'sandbox' ? this.sandbox.type : this.mode;
    var currentActive
    var activeTickers = this.getActive("tickers")

    //console.log(type);

    // Random
    var removeSet = new Set(this.finishedStocks.concat(this.statsData.restartedStocks));

    var availableTickers = this.getActive("tickers").filter((name) => {
      // return those elements not in the namesToDeleteSet
      return !removeSet.has(name);
    });

    availableTickers.sort((a, b) => {
      return this.calculatedScores[type][b] - this.calculatedScores[type][a]
    })
console.log(availableTickers)
   //return "MSFT"; // Returns Microsoft no matter what - add csv data to src/assets/stocks with the ticker in the name and add the ticker to  and comment out

    if (availableTickers.length==0) {
      this.statsData.restartedStocks=[];
      var rand = Math.floor(Math.random() * activeTickers.length)
      console.warn('random index generated of ' + activeTickers.length, rand);
      return activeTickers[rand]
    } else {
      let tickerInd=this.tickerIndex(0, availableTickers.length-1)
      console.log(tickerInd);
      return availableTickers[tickerInd]

    }



    //this.portfolio[0]
    //-------------------------------------------

    // Choose based on Amount of cash: 
    //bias for this.portfolio[0]


    // not as simple as just what stock makes the most money, why shorting is important.... what criteria is useful here. i wonder if you could make criteria for how well ones adhere to technical analysis????? hm...

    //Object.keys(scores)



  }


  getRelativeDate(DaysAgo) {

    return this.currentData[this.dateKeyIndex - DaysAgo].date;
  }

  quickCash(amt) {
    this.notification(['success', '$' + this.nFormat(amt), 'Added to Account'])

    this.addCash(amt);
    this.setTradeVol();
  }

  randomTimeInterval(data) {

    var percentBound; // max amount that could be cropped

// between .005 and .15

//unlockModeState.stock.progress*50 + unlockModeState.stock.tickerProgress*20
var num=this.portfolio[0]*this.purchasedUpgrades.length/Object.keys(this.rawUpgrades).length;
if (num>100000000){num=100000000}
num=num/100000000

percentBound=Math.pow(num,.4)*.25


    var max = data.length - Math.floor(Math.random() * (percentBound*2) * data.length)
    var min = Math.floor(Math.random() * percentBound * data.length)
    //console.log(data.slice(min,max));
    //console.log(data)
    return data.slice(min, max);
  }

  graphicalOnusThrottled = throttle(this.graphicalOnus.bind(this), 2000);

  graphicalOnus() {
    // console.log(this.chartsProvider.charts.candlestick.data.)
    //@ts-ignore
    let days = this.chartsProvider.brushed ? this.chartsProvider.getBrushSize().tradingDays : this.chartsProvider.charts.candlestick.data.length
    let paths = document.querySelectorAll("path").length;
    let els = document.querySelectorAll('g:not(.tick):not(.axis)').length;

    //console.warn('graphical proxys',days,paths,els); 206
    var complexity = ((paths + els - 19) * .4895)
    if (complexity <= 1) { complexity = 1 }

    return [days, complexity]
  }



 initCustom(dat) {
    //console.error('this fireess');
    //this.loadGraphs();
    //this.setTradeVol();
    this.upcomingUpgrades();
    this.calcAvailUpgrades();
    this.calcLearnEarn();
    this.dateKeyIndex = -1;
    this.statsData.riseFall = [];
    this.cumulativeGain = 1;
    // this.chartsProvider.render(null, null);




    //this.chartsProvider.clearBrush()
    if (!this.warnings.autoContinue) {

   this.notification(['success', dat[0], 'CSV Loaded']);
      
    }

    this.currentTicker = [dat[0]]
    this.currentTicker[5] = dat[0]
  console.error(dat);

    d3.csv((dat[1]), async (error, data) => {
      const parseDate = d3.timeParse("%Y%m%d");
      const formatDate = d3.timeFormat("%Y%m%d")

      /*
      function dateAdj(date) {
        if (parseInt(date.slice(0, 2)) > 30) {
          return '19' + String(date);
        } else {
          return '20' + String(date);
        }
      }
*/

      if ((this.mode == 'sandbox' && !this.sandbox.crop) || this.debugParam && (this.debugParam.toLowerCase() == 'debugsimple' || this.debugParam.toLowerCase() == 'debugnodes')) {
        // no data cropping
      } else {
        data = this.randomTimeInterval(data);
      }

      this.isStockDoneAlert = false;
      //console.log(dateAdj(data[0].sdate))

      //console.log(data.slice(mtStartIndex[ticker])[0].sdate)
      this.currentData = data.slice(0).map((d) => ({
        rawDate: formatDate(new Date(d.date)).substring(2),
        date: new Date(d.date),
        open: +d.open,
        high: +d.high,
        low: +d.low,
        close: +d.close,
        adj: +d.adj,
        volume: +d.volume,
      }));


      //console.error(data,this.currentData)
      //console.log(this.currentData)
      /*
for (let i=0;i<startingRecords;i++){
investmentPercentDataBrush.push({date:this.currentData[i].date,value:(this.currentData[i].close/this.currentData[0].close-1)})
}
*/
      /*
            investmentPercentDataBrush = this.currentData.map((d) => ({
              date: d.date,
              value: d.close,
            }));
            */
      //const persist=[];
      var defaultConfig = cloneDeep(configDefault)

      //persist config one stock to the next

      if (this.config) {
        this.config.data = defaultConfig.data;
        this.config.candlestick.trades = [];
      } else {
        this.config = defaultConfig;
      }


      this.config.data = {
        portfolio: [],
        close: this.currentData.map((d) => ({
          date: d.date,
          value: d.close,
        })), //marketMovement
        adjClose: this.currentData.map((d) => ({
          date: d.date,
          adj: marketMovement[d.rawDate],
        })),
      }
      this.setDimensions();
      //console.error(startingRecords + this.dateKeyIndex)


      //startingRecords not this.currentData.length-3

      
      await this.pushData(startingRecords + this.dateKeyIndex + 2, true, false, false, true);

         this.chartsProvider.render("#d3el", this.config);
      
      /*
}else{
//alert('fires');
  // loading from local Storage

  this.setDimensions();
  this.chartsProvider.render("#d3el", this.config);

  this.setTradeVol();
}*/

      // window["x"] = (n) => {
      //   this.config.data = refData.slice(0,n);
      //   this.config.portfolio.data = refData2.slice(0,n);
      //   this.config.candlestick.trades = [];
      //   this.chartsProvider.render("#d3el", this.config);
      // };


      //console.log(this.mode);
      if (this.mode == 'sandbox') {

        Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((upgrade) => {
          this.processUpgrade(upgrade, true);
        });

        Object.keys(this.milestones).forEach((milestone) => {
          this.processUpgrade(milestone, true);
        })

      }

    });


//console.log(this.currentDate,this.currentTicker,this.currentData,this.config,this.config.data);

    this.toggleBuyVSell(true);
    this.saveState();

  }

  initStock(tick: any = null, fullStock: any = false, info: any = false,emer:any=false) {
    //console.error('this fireess');
    //this.loadGraphs();
    //this.setTradeVol();
    this.upcomingUpgrades();
    this.calcAvailUpgrades();
    this.calcLearnEarn();
    this.dateKeyIndex = -1;
    this.statsData.riseFall = [];
    this.cumulativeGain = 1;
    // this.chartsProvider.render(null, null);
    var ticker

if (this.sandbox.type=="rand" || this.sandbox.random){
      var random=Math.random()
      if (random<.33){
this.sandbox.type="stock"
      }else if (random<.66){
this.sandbox.type="etf"
      }else{
this.sandbox.type="crypto"
      }
}


    if (tick) {
      ticker = tick;

    } else {
      ticker = this.tickerSelect();
    }

    /*
    this.getActive("tickers")
this.getActive("db")
this.getActive("scores")


*/
/**/


if (!this.getActive("db")[ticker]){

  console.error(ticker+" undefined!! Catastrophe.");
  /*
if (emer){
  this.finishedStocks.push(ticker);
}
setTimeout(()=>{
this.initStock(null,false,false,true)
},1000)
*/
  return;
}


    //this.chartsProvider.clearBrush()
    if (info && !this.warnings.autoContinue) {
      var message = ""
      var type = this.getActive("type")

      if (!this.purchasedUpgrades.includes('name')) {
        this.notification(['success', 'New ' + type, 'Unknown ' + type + ' Loaded']);
      } else {
        this.notification(['success', this.getActive("db")[ticker][0], 'New ' + type + ' Loaded']);
      }


    }


    if (this.debugParam && (this.debugParam.toLowerCase() == 'debugsimple' || this.debugParam.toLowerCase() == 'debugnodes')) { ticker = "BNTX" }

    if (this.debugParam && this.debugParam.toLowerCase() == 'test') { ticker = "XOMA" }

    // console.log("load Ticker: " + ticker, this.getActive("scores")[ticker], this.getActive("start")[ticker]);//,


    this.currentTicker = this.getActive("db")[ticker];
    this.currentTicker[5] = ticker;


    d3.csv(("assets/" + this.getActive("path") + "/" + ticker + ".csv"), async (error, data) => {
      const parseDate = d3.timeParse("%Y%m%d");

      function dateAdj(date) {
        if (parseInt(date.slice(0, 2)) > 30) {
          return '19' + String(date);
        } else {
          return '20' + String(date);
        }
      }


      if ((this.mode == 'sandbox' && !this.sandbox.crop) || this.debugParam && (this.debugParam.toLowerCase() == 'debugsimple' || this.debugParam.toLowerCase() == 'debugnodes')) {
        // no data cropping
      } else {
        data = this.randomTimeInterval(data);
      }

      this.isStockDoneAlert = false;
      //console.log(dateAdj(data[0].sdate))

      //console.log(data.slice(mtStartIndex[ticker])[0].sdate)
      this.currentData = data.slice(this.getActive("start")[ticker] || 0).map((d) => ({
        rawDate: d.sdate,
        date: parseDate(dateAdj(d.sdate)),
        open: +d.open / 1000,
        high: +d.high / 1000,
        low: +d.low / 1000,
        close: +d.close / 1000,
        adj: +d.adj / 1000,
        volume: +d.vol00 * 100,
      }));


      //console.error(data,this.currentData)
      //console.log(this.currentData)
      /*
for (let i=0;i<startingRecords;i++){
investmentPercentDataBrush.push({date:this.currentData[i].date,value:(this.currentData[i].close/this.currentData[0].close-1)})
}
*/
      /*
            investmentPercentDataBrush = this.currentData.map((d) => ({
              date: d.date,
              value: d.close,
            }));
            */
      //const persist=[];
      var defaultConfig = cloneDeep(configDefault)

      //persist config one stock to the next

      if (this.config) {
        this.config.data = defaultConfig.data;
        this.config.candlestick.trades = [];
      } else {
        this.config = defaultConfig;
      }


      this.config.data = {
        portfolio: [],
        close: this.currentData.map((d) => ({
          date: d.date,
          value: d.close,
        })), //marketMovement
        adjClose: this.currentData.map((d) => ({
          date: d.date,
          adj: marketMovement[d.rawDate],
        })),
      }
      this.setDimensions();
      //console.error(startingRecords + this.dateKeyIndex)


      //startingRecords not this.currentData.length-3

      
      await this.pushData(startingRecords + this.dateKeyIndex + 2, true, false, false, true);

         this.chartsProvider.render("#d3el", this.config);
      
      /*
}else{
//alert('fires');
  // loading from local Storage

  this.setDimensions();
  this.chartsProvider.render("#d3el", this.config);

  this.setTradeVol();
}*/

      // window["x"] = (n) => {
      //   this.config.data = refData.slice(0,n);
      //   this.config.portfolio.data = refData2.slice(0,n);
      //   this.config.candlestick.trades = [];
      //   this.chartsProvider.render("#d3el", this.config);
      // };


      //console.log(this.mode);
      if (this.mode == 'sandbox') {

        Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((upgrade) => {
          this.processUpgrade(upgrade, true);
        });

        Object.keys(this.milestones).forEach((milestone) => {
          this.processUpgrade(milestone, true);
        })

      }

    });


//console.log(this.currentDate,this.currentTicker,this.currentData,this.config,this.config.data);

    this.toggleBuyVSell(true);
    this.saveState();

  }

  toggleLeadingIndicator(id) {

    this.config.candlestick[id] = !(this.config.candlestick[id]);
    this.chartsProvider.render("#d3el", this.config);

    if (this.config.candlestick[id]) {
      this.playSFX('generic')
    }

    this.saveState();
  }


  //HOT
  addCash(amt) {
    var invested = this.portfolio[1] * this.portfolio[0];
    var cash = (1 - this.portfolio[1]) * this.portfolio[0];
    
this.infusedCash=parseInt(this.infusedCash);

    this.infusedCash += amt;

    if (amt > 0) {
      this.portfolio[2] = true;
    }
    cash += amt;
    //console.log(invested,cash);
    this.portfolio[0] = this.portfolio[0] + amt;

    if (invested == 0) {
      this.portfolio[1] = 0;
    } else {
      this.portfolio[1] = invested / (cash + invested);
    }

    if (this.portfolio[1] > 1) {
      this.portfolio[1] = 1;
    } else if (this.portfolio[1] < 0) {
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


    this.setTradeVol()
  }



  hideShowElement(classs, hidevsshow) {
    var ele: any = document.querySelector(classs);

    if (ele) {
      ele.style.visibility = hidevsshow ? "hidden" : "visible";
    } else {
      // console.log("element not found");
    }
  }

  defineSimpleBot(entry) {

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
  }

  setDimensions() {

   // if (!this.config) { return }

    this.config.dims.width =
      window.innerWidth -
      this.config.dims.margin.right -
      this.config.dims.margin.left;
    this.config.candlestick.dims.width = this.config.dims.width
    this.config.dims.height = Math.floor(
      window.innerHeight * verticalProportion - 145
    );

    var leftover = verticalProportion;

    if (!this.config.portfolio.hide) {
      var ht = 0.12 * verticalProportion;
      leftover = leftover - ht;
      this.config.portfolio.dims.height = Math.floor(
        this.config.dims.height * ht
      );
      //console.log(this.config.portfolio.dims.height)
    }

    this.visibleExtraGraphs.forEach((graph) => {

      var height=0.2

if (this.visibleExtraGraphs.length==3){height=.183}
if (this.visibleExtraGraphs.length==4){height=.1375}
if (this.visibleExtraGraphs.length==5){height=.11}
if (this.visibleExtraGraphs.length==6){height=.0916}
if (this.visibleExtraGraphs.length==7){height=.0785}
      var ht = height * verticalProportion;
      leftover = leftover - ht;
      this.config[graph].dims.height = Math.floor(this.config.dims.height * ht);
    })

    this.config.candlestick.dims.height =
      Math.floor(leftover * this.config.dims.height) - 20;


    //console.log(this.config)
  }

  processUpgrade(id, supress: any = false) {

    //console.log(id);

    /*
        if (!this.warnings.marginCallWarn && (this.demo?demoUpgrades:rawUpgrades)[id].cost>800 && !supress){
    this.marginCallPop(true);
    this.stopSim();
        }
    */

    if (!(this.demo ? demoUpgrades : this.rawUpgrades)[id]) {
  console.warn('no upgrade with id:' + id + " ignoring...");
      //this.purchasedUpgrades.push(id);
      if (id == "pip") { this.warnings.new.pip = true; }
      if (id == "podcasts") { this.warnings.new.podcasts = true; }
      if (id=="dailyRewards"){this.lastDailyReward=new Date();
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
    } else if (id == "margin") {
      if (this.tutorialState[0] == 7) {
        this.tutorialState[0] = 8;
      }
    } else if (id == marginUpgrade) {
      if (this.totalPortfolio < 0 && this.loanData.amt > 0) {
        this.addCash(Math.abs(this.totalPortfolio));
        this.notification(['success', 'Loan Losses Forgiven', '$' + Math.floor(Math.abs(this.totalPortfolio) * 100) / 100 + ' added to account'])
      }

    this.loanData.max = this.loanData.max * parseFloat(id.split("_")[1]);
      //console.error((this.demo?demoUpgrades:rawUpgrades)[id].name)

      this.calcInterestRate();
      this.setTradeVol();

    } else if (id == "volume") {
      //console.log("fires");
      //console.log(document.querySelector(".volume"));
      this.config.candlestick.showVolume = true;
      this.chartsProvider.render("#d3el", this.config);
      this.warnings.new.ovr = true;
    } else if (id.slice(0, 13) == "marginpercent") {
      this.marginCallPercent += parseInt(id.split("_")[1]) / 100
    } else if (id.slice(0, 7) == "speedup") {

      this.increaseMaxSim(parseFloat(id.split("_")[1]));
      //parseInt(id.split("_")[1])
      //this.maxSim = this.maxSim + parseInt(id.split("_")[1]);
      //this.simRec = this.maxSim; //Math.floor(this.maxSim/2)
    } else if (id.slice(0, 4) == "fees") {
      this.fee = this.fee - parseFloat(id.split("_")[1]) / 100;
      if (this.fee < 0) { this.fee = 0 }
      this.setTradeVol();
    } else if (id.slice(0, 7) == "loanMax") {
      this.loanData.max = this.loanData.max * parseFloat(id.split("_")[1]);
      //console.error((this.demo?demoUpgrades:rawUpgrades)[id].name)
      if ((this.demo ? demoUpgrades : this.rawUpgrades)[id].name.toLowerCase().includes("margin call") && !this.warnings.marginCallWarn) {

        this.warnings.marginCallWarn = true;
        /*
        if (!supress){
        this.marginCallPop()
        } 
        */
      }

      this.calcInterestRate();
      this.setTradeVol();
    } else if (id.slice(0, 8) == "interest") {
      this.loanData.upgradeMinus += parseInt(id.split("_")[1]);
      this.calcInterestRate();
      this.setTradeVol();
    } else if (id.slice(0, 11) == "restartLoan") {
      this.statsData.addedMaxLoan += parseInt(id.split("_")[1]);
    } else if (id.slice(0, 7) == "restart") {
      this.statsData.startingCash += parseInt(id.split("_")[1]);
    } else if (id == "limitstop") {
       if (!supress){this.warnings.new.auto = true;}
      //this.purchasedUpgrades.push("stop");
      //this.manual = 1;
    } else if (id == "longshort") {
      this.longShortShow = true;
    } else if (id == "adjclose") {
      // process adjusted close
    } else if (id == "stats") {
      this.showStats = true;
    } else if (id == "yearreveal") {
      this.obfuscateYear = false;
      this.config.hideYears = false; // need to unhide everything all at once)
    } else if (id == "price") {
      this.obfuscatePrice = false;
      this.config.candlestick.supstance.annotationVisibility[0] = true;
      this.config.candlestick.showPriceInLeftAxis = true;
    } else if (id == "marketIndex" && !this.balanceOptions.suppress) {
      this.warnings.new.brush = true;
      this.config.portfolio.showAdjClose = true;
      this.reDraw();
    } else if (id == "gains" && !this.balanceOptions.suppress) {
      this.warnings.new.brush = true;
      this.config.portfolio.showPortfolio = true;
      this.reDraw()
    } else if (id == "vizBots") {
      if (!this.advancedBots[DefaultSimpleBotName]) {
        this.notification(['warning', 'Simple Bot Undefined', 'Setting Default Bot'])
        this.advancedBots[DefaultSimpleBotName] = basicSimpleBot;
      }

      for (var i = this.limitStops.length - 1; i > -1; i--) {
        this.rmLimitStop(i)
      }
      this.limitStops = [];
      this.simpleBotActive = false;
      this.manual = 2;
      if (!supress){this.warnings.new.auto = true;}
      




    } else if (id == "customMA") {
      this.warnings.new.ovr = true;
      //this.indiUnlock.movingavg = 1;
    } else if (id == "multipleMA") {
      this.warnings.new.ovr = true;
      //this.indiUnlock.movingavg = 2;
      // how
    } else if (id == "simpleBots") {
       if (!supress){this.warnings.new.auto = true;}
      this.clearLimitOrders();
    } else if (id == "simpleBots2" || id == "simpleBots3") {
      if (!this.advancedBots[DefaultSimpleBotName]) {
        this.notification(['warning', 'Simple Bot Undefined', 'Setting Default Bot'])
        this.advancedBots[DefaultSimpleBotName] = basicSimpleBot;
      }
      if (!supress) { this.manual = 2 }
      this.clearLimitOrders();
    } else if (id == "exchange") {
      this.displayInfo = 1;
    } else if (id == "sector") {
      this.displayInfo = 2;
    } else if (id == "name") {
      this.displayInfo = 3;
    } else if (id == "brushing") {
      this.warnings.new.brush = true;
      this.config.portfolio.hide = false;
      this.reDraw()

    } else if (id == "sma") {

      this.warnings.new.ovr = true;
      this.config.candlestick.sma = [7];
      var ema = [];
      if (this.purchasedUpgrades.includes('ema')) {
        ema = [7]
      }
      this.movingAverages = {
        sma: [7],
        ema: ema,
        smaColors: [this.docStyle.getPropertyValue('--sma1')],
        emaColors: [this.docStyle.getPropertyValue('--ema1')],
      };
      this.chartsProvider.render("#d3el", this.config);
    } else if (id == "ema") {
      this.warnings.new.ovr = true;
      this.config.candlestick.ema = [7];

      var sma = [];
      if (this.purchasedUpgrades.includes('sma')) {
        sma = [7]
      }
      this.movingAverages = {
        sma: sma,
        ema: [7],
        smaColors: [this.docStyle.getPropertyValue('--sma1')],
        emaColors: [this.docStyle.getPropertyValue('--ema1')],
      };
      this.chartsProvider.render("#d3el", this.config);
    } else if (id == "sandbox" && this.mode=="stock") {
      this.sandbox = { repeat: false, sector: "all", fees: false, bailouts: true, crop: false, new: true, type: "stock" };
      this.unlockModeState["sandbox"] = { worth: 0 }
      this.setSandboxDates();
    } else if (id == "etf") {
      this.unlockModeState["etf"] = { worth: 0, progress: 0 }
    } else if (id == "crypto") {
      this.unlockModeState["crypto"] = { worth: 0, progress: 0 }
    }
    var extInd: any = ["atr", "adx", "aroon", "macd", "rsi", "stochastic", "williams"]
    var ovrInd: any = ["ichimoku", "pivots", "bollinger", "atrtrailingstop"]
    var leadingInd: any = ["marketIndex", "unemployment", "dxy", "housing", "yield", "industry", "vix", "recessions"];

    if (extInd.includes(id)) { this.warnings.new.ext = true; } else if (ovrInd.includes(id)) { this.warnings.new.ovr = true; } else if (leadingInd.includes(id)) { this.warnings.new.leading = true; }

    if (this.realVsDebugState() && extInd.includes(id) && this.visibleExtraGraphs.length < 2 && !supress && !this.balanceOptions.suppress) {
      this.toggleExtIndicator(id)
    }

    if (this.realVsDebugState() && ovrInd.includes(id) && !this.balanceOptions.suppress) {
      this.toggleOvrIndicator(id)
    }

    if (this.realVsDebugState() && leadingInd.includes(id) && !this.balanceOptions.suppress) {
      this.toggleLeadingIndicator(id)
    }



    if (!supress) {
      // console.log((this.demo ? demoUpgrades : this.rawUpgrades)[id])
      if ((this.demo ? demoUpgrades : this.rawUpgrades)[id].description && (this.demo ? demoUpgrades : this.rawUpgrades)[id].name) {
        // console.log((this.demo ? demoUpgrades : this.rawUpgrades)[id].name, (this.demo ? demoUpgrades : this.rawUpgrades)[id].description)
        this.notification(['success', 'Unlocked: ' + (this.demo ? demoUpgrades : this.rawUpgrades)[id].name, (this.demo ? demoUpgrades : this.rawUpgrades)[id].description])
      } else { console.warn('missing data for ' + id) }
    }

    this.purchasedUpgrades.push(id);
    this.calcLearnEarn()
    this.upcomingUpgrades();


    if (this.mode == 'stock' && (this.demo ? demoUpgrades : this.rawUpgrades)[id].popupTitle && (this.demo ? demoUpgrades : this.rawUpgrades)[id].popupTitle.length > 0 && !supress && (this.realVsDebugState() || this.debugParam)) {
      this.upgradePopup((this.demo ? demoUpgrades : this.rawUpgrades)[id].popupTitle, (this.demo ? demoUpgrades : this.rawUpgrades)[id].popupBody, this.tutorialState[0], id, this.tutorialDB[id]);
    } else if (!supress) {
      if (this.tutorialDB[id]) {
        this.startTutorial(id)
        if (id == marginUpgrade) {
          this.warnings.marginCallWarn = false
        }
      }
    }

    this.saveState();
  }

  realVsDebugState() {
    return persist && !this.debugParam;
  }

  ngAfterViewInit() {
    // this.initRawData("dowjones");
  }


  toggleMA() {
    if (
      this.config.candlestick.sma.length > 0 ||
      this.config.candlestick.ema.length > 0
    ) {
      this.config.candlestick.sma = [];
      this.config.candlestick.ema = [];
    } else {
      this.config.candlestick.sma = this.movingAverages.sma;
      this.config.candlestick.ema = this.movingAverages.ema;
    }

    this.reDraw();
  }

  toggleVol() {
    this.config.candlestick.showVolume = !this.config.candlestick.showVolume;
    this.reDraw();
  }


  toggleOvrIndicator(indi) {

    if (indi == "ichimoku") {
      this.config.candlestick.ichimoku = !this.config.candlestick.ichimoku;
      if (this.config.candlestick.ichimoku) {
        this.playSFX('generic')
      }
    } else if (indi == "pivots") {
      this.config.candlestick.supstance.show = !this.config.candlestick.supstance.show;
      if (this.config.candlestick.supstance.show) {
        this.playSFX('generic')
      }
    } else if (indi == "bollinger") {

      if (this.config.candlestick.bollinger.length > 0) {
        this.config.candlestick.bollinger = []
      } else {
        this.config.candlestick.bollinger = [20]
        this.playSFX('generic')

      }

    } else if (indi == "atrtrailingstop") {
      if (this.config.candlestick.atrTrailingStop.length > 0) {
        this.config.candlestick.atrTrailingStop = []
      } else {
        this.config.candlestick.atrTrailingStop = [14]
        this.playSFX('generic')
      }
    } else {
      console.error("no indicator exists by that name "+indi);
    }
this.saveState();
    this.reDraw();
  }

 toggleExtIndicator(indi: any = false) {
    //console.log(thing);

if (indi){
    this.config[indi].hide = !this.config[indi].hide;

    if (!this.config[indi].hide) {
      this.playSFX('generic')
    }
}


/*
      for (const mode of ["stock", "etf", "sandbox", "crypto"]) {
        this.mode = mode;
        await this._saveState();
      }
*/
      //window["navigation"].reload();
    

    var viz = [];
    var indicators = ["atr", "adx", "aroon", "macd", "rsi", "stochastic", "williams"];
    indicators.forEach((e) => {
      if (this.config && !this.config[e].hide) {
        this.config[e].hideRightAxis=true,
        viz.push(e);
      }
    })
    this.visibleExtraGraphs = viz;
  this.saveState();
    this.reDraw();
  }


  reDraw() {
    this.setDimensions();

     if (this.chartsProvider.brushed) {
       const { startDate, endDate } = this.chartsProvider.getCurrentBrush();
       console.log(startDate, endDate)
       this.chartsProvider.renderThrottled("#d3el", this.config);
      this.chartsProvider.setBrush(startDate, endDate)
      this.chartsProvider.moveBrushToEnd()
       return;
    }

    this.chartsProvider.renderThrottled("#d3el", this.config);
  }




  setColor(thing, color) {
    // console.log(thing);
    document.body.style.setProperty(thing, color);
  }


  initDefaults() {

    allPersist.forEach((field) => {
      if (typeof this[field] !== 'undefined') {
        this.defaults[field] = cloneDeep(this[field])
      }
    })

  }

  skipTutorial() {
    this.alertPop = this.alertCtrl.create({
      title: "Skip Tutorial?",
      message:
        "If you skip now you will not earn an extra <b>$" + parseInt(this.tutorialDB[this.tutorialState[1]].reward).toLocaleString('en-US') + "</b> for your account.",
      buttons: [
        {
          text: "Cancel",
          handler: (data) => {
            this.playSFX('close');
          },
        },
        {
          text: "Skip",
          handler: (data) => {
            this.playSFX('generic');
            setTimeout(() => {
              this.checkExtra(this.tutorialState[1])
              this.tutorialState = [-1, null];
            }, 1000)
          },
        },
      ],
    });
    this.alertPop.present();
  }

  endTutorial() {
    if (!this.tutorialDB[this.tutorialState[1]]) {
      if (this.tutorialState!==-1){
        console.error('undefined tutorial?', this.tutorialState, this.tutorialDB)
      }
      
    } else if (this.tutorialDB[this.tutorialState[1]].reward > 0) {
      this.notification(['success', this.tutorialDB[this.tutorialState[1]].prompt, '$' + this.nFormat(this.tutorialDB[this.tutorialState[1]].reward) + ' Added to Account']);

      this.addCash(this.tutorialDB[this.tutorialState[1]].reward);

      this.tutorialDB[this.tutorialState[1]].completed = true;
      this.checkExtra(this.tutorialState[1])

      this.tutorialState = [-1, null];
    }
  }

  completeExtra(id) {
 if (this.opportunities[id].completed){console.error("already redeemed");return}
    this.opportunities[id].completed = true;
    this.addCash(this.opportunities[id].reward);
    this.notification(['success', 'Earned $' + this.nFormat(this.opportunities[id].reward), " Extra Opportunity Completed"])
    this.calcLearnEarn();
    this.setTradeVol();
    this.calcExtraAvail();
    this.saveState();
  }

  checkExtra(id) {
    //console.error(id);
    if (id == 'intro' || ((this.demo ? demoUpgrades : this.rawUpgrades)[id] && (this.demo ? demoUpgrades : this.rawUpgrades)[id]["extra"]) || Array.isArray(id)) {

      var extra = ["Developer Intro", "Watch Developer Summarize Basic Functionality", "Nnw0sP2vGo0", 20, 4.1]

if (Array.isArray(id)){
  extra=id;
}

      if (id !== 'intro' && !Array.isArray(id)) {
        extra = (this.demo ? demoUpgrades : this.rawUpgrades)[id]["extra"]
      };

      if (this.opportunities["_" + extra[0]]) { return }


      // if done in demo
      if (this.laterExtras && !Array.isArray(id) && this.laterExtras.includes(id)) {
        this.completeExtra(id)
        return;
      }


      this.newExtra = true;
      this.opportunities["_" + extra[0]] = { notAd:true, completed: false, time: extra[4], reward: extra[3], name: extra[0], intro: extra[1], embed: extra[2], info: 'https://www.youtube.com/watch?v=' + extra[2] }

      this.calcExtraAvail();
//console.error("should this be happening?",id);

var messg="You have unlocked a new 'Earn Extra' opportunity in the main menu for <b>$" + this.nFormat(extra[3]) + "</b>";
var messgtwo="You have unlocked a video in the 'More' section of the main menu. You can earn <b>$" + this.nFormat(extra[3]) + "</b> for watching.";


      if (!this.warnings.extraOpp) {
        this.alertPop = this.alertCtrl.create({
          title: "Video Unlocked",
          message: this.limitedAds?messgtwo:messg,
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
              handler: (data) => {
this.playSFX('close');
                this.warnings.extraOpp = data.length > 0;

              },
            },
          ],
        });
        this.alertPop.present();
      }
    }
  }


  menuHov(enterexit) {
    this.newExtra = false;
    if (this.tutorialState[0] == 15 && enterexit) {
      this.tutorialState[0] = 16;
    } else if (this.tutorialState[0] == 16 && !enterexit) {
      setTimeout(() => {
        this.endTutorial();

        this.setTradeVol();
        this.saveState();
      }, 700)
    }

  }

  autoHov(enterexit) {

    if (this.tutorialState[0] == 100 && enterexit) {
      this.tutorialState[0] = 101;
    } else if (this.tutorialState[0] == 101 && !enterexit) {
      this.tutorialState[0] = 100;
    }


    if (this.tutorialState[0] == 200 && enterexit) {
      this.tutorialState[0] = 201;
    } else if (this.tutorialState[0] == 201 && !enterexit) {
      this.tutorialState[0] = 200;
    }




  }

  async initState(store) {

    if (store.tutorialState && store.tutorialState[1] == 'intro') {
      console.warn('not loading local storage because initial tutorial was not completed')
      return;
    }

    if (!this.realVsDebugState()) {
      console.warn('not loading local storage because persistance is removed')
      return;
    }

if (store.tutorialState && store.tutorialState[1]){
  this.tutRestart=store.tutorialState[1];
  store.tutorialState=[-1, null]
}
//console.error(store.version,this.version)
//console.error(store.version)
    if (store.version && this.version !== store.version) {
      // GAME UPDATE

      // check for upgrade updates

      // upgrades, extras will change? other things?
      // or we just reset everything and preserve a few things? idk. 

      this.alertPop = this.alertCtrl.create({
        cssClass: 'earlyAccessAlert',
        enableBackdropDismiss: false,
        title: "Version " + this.version,
        message: updateText,
        buttons: [
          {
            text: "Dismiss",
            handler: () => {

            }
          }
        ],
      });
      this.alertPop.present();


      store.version = this.version


    }

if ((!store.currentTicker || !store.currentData) && store.config){store.config=undefined}

    allPersist.forEach((field) => {
      if (typeof store[field] !== "undefined") {
        this[field] = store[field]
        this.campaignStore[field] = store[field]
      }
    })

        if (!this.sandbox && this.purchasedUpgrades.includes("sandbox")){
this.sandbox = { repeat: false, sector: "all", fees: false, bailouts: true, crop: false, new: true, type: "stock" };
    }

//if (store.tutorialState[0]!==-1){store.tutorialState=undefined}

//this.checkUndefConfig();

/*
    sharedPersist.forEach((field) => {
      if (typeof store[field] !== "undefined") {
        this[field] = store[field]
      }
    })
*/
    // if opportunity const is updated at a later date
    //'email':{completed:false, reward:15,name:'Newsletter',intro:'Sign-Up for Our Newsletter'},

    var storedOpps: any = Object.keys(this.opportunities)
    storedOpps.forEach((id) => {
      // update text and rewards for changed opportunities
      if (!this.opportunities[id].completed && opportunities[id]) {
        this.opportunities[id] = opportunities[id]
      }
      // delete opportunities that have been removed form the game
      if (!opportunities[id] && id[0] !== '_') {
        delete this.opportunities[id]
      }

    })
    // add new extras here
    Object.keys(opportunities).forEach((d) => {
      if (!storedOpps.includes(d)) {
        this.opportunities[d] = opportunities[d]
      }
    })
/*
    if (!this.opportunities.intro && this.purchasedUpgrades.includes('margin')) {
      setTimeout(() => { this.checkExtra('intro') }, 4000)
    }
*/
    /*
        if (this.preSimVisible !== null) {
          //console.log(this.preSimVisible);
          this.toggleConfig(true)
        }
    */
if (this.indiData){
Object.keys(indicatorData).forEach((ind)=>{

if (!this.indiData[ind]){this.indiData[ind]=indicatorData[ind]}

Object.keys(indicatorData[ind].vals).forEach((prm)=>{

if (!this.indiData[ind].vals[prm]){this.indiData[ind].vals[prm]=indicatorData[ind].vals[prm]}

})

})



}


    this.simSpeed[0] = 0;

    this.advancedBotNames = Object.keys(this.advancedBots)
    if (this.paperState.mode !== -1) { await this.unwrapPaper() }

    // regen currentData
    //this.pushData(51);


    if (this.fullscreenState && window["electron"]) {
      window["electron"].fullscreen();
    }

    this.calcLearnEarn();
    //console.log(storage)

    //console.error(this.muteSFX);   

    if (jumpToBaklava) {

      this.updateUnlockBaklavaState()

      this.activeBot = "debugBot";

      var toLoad

      if (this.advancedBots[this.activeBot]) {
        this.navCtrl.push(BaklavaPage, this.baklavaParams(this.advancedBots[this.activeBot]));
      } else {
        this.navCtrl.push(BaklavaPage, this.baklavaParams(debugBot));
      }


    }


    if (this.mainMenu && (!this.music || !this.music.playing()) && !this.muteSFX && !this.debug) {
      this.playMusic();
    }
  }

  checkUndefConfig(){
/**/


//let dataProblem=!this.currentDate || !this.currentTicker || !this.currentData
//console.error('dataProblem',dataProblem)
//console.error(this.dateKeyIndex);
    if (!this.config || !this.config.data) {
      console.error("config undefined, checkUndefConfig")
      var deflt=cloneDeep(configDefault)
      this.config = deflt;

      this.initStock();
      this.toggleExtIndicator();
      //console.error('booom',this.dateKeyIndex);
     // this.brushToggle();      
            }


//if (dataProblem){console.error("problem");this.initStock();this.simInit();return false}else{return true}
//if (dataProblem){this.initStock()}

  }

  _saveState = (fq: any = false, demoDone: any = false) => {
    if (stopSaving){console.warn("saving is disabled in consts");return}
    if (!this.config){console.error("config is undefined, not saving");return}
    if (!this.realVsDebugState() || this.balanceOptions.persist) { return }
    if (this.storageKillSwitch) { console.error("storageKILL"); return }

var sub=Object.keys(this.milestones).length+2

    var progress = (this.purchasedUpgrades.length - sub) / (this.upgradeLength - sub);
    if (progress < 0) { progress = 0 }
    this.unlockModeState[this.mode] = { worth: this.portfolio[0], progress: progress, tickerProgress: this.finishedStocks.length / (this.getActive("tickers") ? this.getActive("tickers").length : 10000) }

    if (this.mode == "stock") {
      this.lastSaveCampaign = true;

      let store = {}

      modePersist.forEach((data) => {
        store[data] = this[data];
      })

      sharedPersist.forEach((data) => {
        store[data] = this[data];
      })

this.campaignStore=cloneDeep(store);

      if (demoDone) { store['demoDone'] = true }
      return this.storage.set(storageID + (this.demo ? '_demo' : ''), store).then(() => {
        if (fq) {
          console.error('force quit?');
          if (window["electron"]) {
            window["electron"].forceQuit()
          }
        }
      });

    } else {
      this.lastSaveCampaign = false;

    
      sharedPersist.forEach((data) => {

        this.campaignStore[data] = this[data];
      })

      return this.storage.set(storageID + (this.demo ? '_demo' : ''), this.campaignStore).then(() => {


        let substore = {}

        modePersist.forEach((data) => {
          substore[data] = this[data];
        })


        this.storage.set(storageID + (this.demo ? '_demo' : '') + "_" + this.mode, substore).then(() => {
          if (fq) { window["electron"].forceQuit() }
        });

      });


    }

    //console.log(JSON.stringify(this));


  }

  saveState = throttle(this._saveState.bind(this), 1500);





  copyBot() {
    this.alertPop = this.alertCtrl.create({
      title: "Copy Existing Bot",
      message:
        "Make copy of an existing advanced bot",
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
          handler: (data) => {
            this.playSFX('close');
          },
        },
        {
          text: "Create",
          handler: (data) => {
this.playSFX('generic');
            if (!this.advancedBots[data[0]]) {
              this.advancedBots[data[0]] = cloneDeep(this.advancedBots[this.activeBot])
              this.advancedBotNames = Object.keys(this.advancedBots)
            } else {
              this.generalPopup("Name Taken", "Please choose a unique name");
              this.playSFX('error');
              return false
            }

          },
        },
      ],
    });
    this.alertPop.present();
  }

  restartRemind() {

    if (this.remindCounter > 1) { return } else { this.remindCounter = 60 }
    this.stopSim()
    this.alertPop = this.alertCtrl.create({
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
          handler: (data) => {
            this.playSFX('close');
            this.warnings.restartRemind = data.length > 0;
          },
        },
        {
          text: "Restart",
          handler: (data) => {
            this.playSFX('generic');
            this.warnings.restartRemind = data.length > 0;
            this.restart();
          },
        },
      ],
    });
    this.alertPop.present();

  }


  supressLabels(){
    var viz:any=document.getElementsByClassName("dynamic-label-supstance");

for (let i=0;i<viz.length;i++){
  if (viz[i] && viz[i].style && viz[i].style.opacity>0){
    viz[i].style.opacity=0;
  }
}


  }

  duplicateBot() {
    let copy=cloneDeep(this.advancedBots[this.activeBot])


this.alertPop = this.alertCtrl.create({
        title: "Copy Existing",
        message:
          "Use a visual node editor to create a sophisticated algorithm to trade automatically. Name your new bot below.",
        inputs: [
          {
            type: "input",
            label: "Bot Name",
            value: this.activeBot+' copy',
          },
        ],
        buttons: [
          {
            text: "Cancel",
            handler: (data) => {
              this.playSFX('close');
            },
          },
          {
            text: "Copy",
            handler: (data) => {
              this.playSFX('generic');

if (!this.advancedBots[data[0]]){

  this.advancedBots[data[0]]=copy;
  this.activeBot=data[0];
}else {
                this.generalPopup("Name Taken", "Please choose a unique name");
                this.playSFX('error');
                return false
              }



              this.saveState();
       
            },
          },
        ],
      });
      this.alertPop.present();






  }

  deleteBot() {
    this.alertPop = this.alertCtrl.create({
      title: "Are You Sure?",
      message:
        "Do You Wish to Delete This Bot Permenently?",
      buttons: [
        {
          text: "Cancel",
          handler: (data) => {
            this.playSFX('close');
          },
        },
        {
          text: "Delete",
          handler: (data) => {

            this.playSFX('generic');
            delete this.advancedBots[this.activeBot]
            this.advancedBotNames = Object.keys(this.advancedBots)

            this.baklava.deleteBot(this.activeBot)
          },
        },
      ],
    });
    this.alertPop.present();
  }

  async showTrace(trace: any, traceInfo: TraceInfo) {
    if (this.navCtrl.getActive().instance instanceof BaklavaPage) {
      //await this.navCtrl.pop();
    }
    await this.navCtrl.push(BaklavaPage, this.baklavaParams({ "name": DefaultTraceBotName, "mode": 1, "logs": [], "sim": 0, "gains": null, "data": trace }, traceInfo));
  }

  upgradeSimpleBot() {

    var converted = cloneDeep(this.advancedBots[DefaultSimpleBotName])

    this.openBot(true, converted)

  }

  openBot(newbot: any = false, convert: any = {}) {

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


    if (!newbot && this.activeBot !== DefaultBotName && this.advancedBots[this.activeBot]) {
      // edit

      this.updateUnlockBaklavaState()
      this.navCtrl.push(BaklavaPage, this.baklavaParams(this.advancedBots[this.activeBot]));
      
    } else {
      this.tutClick(350);
      if (this.activeBot !== DefaultBotName && !newbot) { console.error('bot "' + this.activeBot + '" does not exist') }

      this.alertPop = this.alertCtrl.create({
        title: Object.keys(convert).length == 0 ? "Create New Bot" : "Upgrade Simple Bot",
        message:
          "Use a visual node editor to create a sophisticated algorithm to trade automatically. Name your new bot below.",
          enableBackdropDismiss:this.tutorialState[0] !== 351,
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
            handler: (data) => {
              this.playSFX('close');
              if (this.tutorialState[0] == 351) { return false }
            },
          },
          {
            text: "Create",
            handler: (data) => {
              this.playSFX('generic');
              if (this.tutorialState[0] == 351) { this.tutorialState[0] = -1 }
              //console.log(data);
              if (!this.advancedBots[data[0]]) {
                this.updateUnlockBaklavaState();
                var definition = { tutState: this.tutorialState[0], name: data[0], mode: 1, logs: [], sim: 0, gains: null, data: convert.data };

                this.events.publish("saveBot", [data[0], definition]);
                this.navCtrl.push(BaklavaPage, this.baklavaParams(definition));
                this.activeBot = data[0];
                this.manual = 3;
                //console.log({tutState:this.tutorialState[0],name:data[0],mode:1,logs:[],sim:0,gains:null,...convert});
              } else {
                this.generalPopup("Name Taken", "Please choose a unique name");
                this.playSFX('error');
                return false
              }
            },
          },
        ],
      });
      this.alertPop.present();
    }


  }



  baklavaParams(botDef, traceInfo: any = undefined) {
    return {
      bot: botDef,
      date: this.currentData[this.dateKeyIndex]?this.currentData[this.dateKeyIndex].date:null,
      tick: this.currentTicker,
      traceInfo: traceInfo,
      cashVsInvested: this.cashVsInvested,
      currPrice: this.currPrice,
      limDeduction: this.limDeduction,
      longVsShort: this.longVsShort,
      portfolio: this.portfolio,
     // maxSim:this.showRealSim(this.simSpeed:[2]/10);
    }
  }

  brushToggle(series:any=null) {

    //console.error("brushing is weird, don't get it, seems wrong, for now just toggling hide/show")

    if (series == "close") {
      this.config.portfolio.showClose = !this.config.portfolio.showClose
    } else if (series == "adj") {
      this.config.portfolio.showAdjClose = !this.config.portfolio.showAdjClose
    } else if (series = "gains") {
      this.config.portfolio.showPortfolio = !this.config.portfolio.showPortfolio
    }

    this.config.portfolio.hide = !this.config.portfolio.showClose && !this.config.portfolio.showPortfolio && !this.config.portfolio.showAdjClose;
    //console.log(this.config.portfolio.hide)
    this.reDraw();
  }



  indicatorSettings(indi) {

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

    this.globalModal = this.modalCtrl.create(indicatorModal, {
      indiData: this.indiData[indi],
      indicator: indi
    }, { cssClass: 'modalIndicator' });
    this.globalModal.onDidDismiss((data) => {
      this.reDraw();
    });
    this.globalModal.present();
  }

  openMA(type: any = 'avg') {

    var state = this.purchasedUpgrades.includes('customMA') && this.purchasedUpgrades.includes('multipleMA');


    this.globalModal = this.modalCtrl.create(maModal, {
      ma: this.movingAverages,
      state: state ? 2 : 1,
      dateIndex: this.dateKeyIndex
    }, { cssClass: 'modalIndicator' });

    this.globalModal.onDidDismiss((data) => {
      this.config.candlestick.sma = this.movingAverages.sma;
      this.config.candlestick.ema = this.movingAverages.ema;

      this.movingAverages.smaColors.forEach((color, i) => {

        document.body.style.setProperty("--sma" + String(i + 1), color);
      })
      this.movingAverages.emaColors.forEach((color, i) => {
        document.body.style.setProperty("--ema" + String(i + 1), String(color));
      })
      //document.body.style.setProperty("--sma1", "#a20");

      this.reDraw();
    });
    this.globalModal.present();
  }

  updateUnlockBaklavaState() {
    this.setBaklavaState("stockInfo", this.displayInfo >= 3);
    this.setBaklavaState("maxSim", this.realSimNum(this.simSpeed[2] / 10));
    this.setBaklavaState("year", this.purchasedUpgrades.includes("yearreveal") ? -1 : this.YrsElapsed);
    this.setBaklavaState("gains", this.purchasedUpgrades.includes("gains"));
    this.setBaklavaState("unlock", this.purchasedUpgrades.includes('vizBots5') ? 4 : (this.purchasedUpgrades.includes('vizBots4') ? 3 : (this.purchasedUpgrades.includes('vizBots3') ? 2 : (this.purchasedUpgrades.includes('vizBots2') ? 1 : 0))));
    this.setBaklavaState("portState", [this.unlockedMilestones.includes('botPort1'),this.purchasedUpgrades.includes('botPort2')]);
    this.setBaklavaState("testState", this.purchasedUpgrades.includes('backtesting') ? 2 : this.purchasedUpgrades.includes('paper') ? 1 : 0);

  }


  setBaklavaState(key, value) {
    this.bakState[key] = value;
    BaklavaState.setState(key, value)
  }

  limitPrompt() {

    this.alertPop = this.alertCtrl.create({
      title: "Process Limit/Stop",
      message:
        "This trade will automatically process once the threshold has been met, and it will incur a transaction fee of $" +
        parseFloat((this.tradeVolume * this.fee).toFixed(2)).toLocaleString("en-US") +
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
          handler: () => {
            this.playSFX('close');
          },
        },
        {
          text: "Ok",
          handler: (data) => {
            this.playSFX('generic');
            if (this.tutorialState[0] == 103) { this.tutorialState[0] = 104 }
            this.warnings.limit = data.length > 0;
            this.trade(undefined, true);
          },
        },
      ],
    });
    this.alertPop.present();

  }

  restartCash(){
      var learned = 0;
        this.earnedLearnings.forEach((key) => {
      learned += this.getLearnReward(key);
    })

Object.keys(this.opportunities).forEach((key) => {
  if (this.opportunities[key].completed){
      learned += this.opportunities[key].reward
      }
    })


    return this.statsData.startingCash + learned;
  }

  restart(forced: any = false) { // margin call trigger
  
this.stopSim()


var restartCash =this.restartCash();

//console.error(this.unlockedMilestones)


    if (forced) {
      this.notification(['error', 'Margin Called', "You Will Restart with $" + this.nFormat(restartCash)])
      this.playSFX('error');
    } else {
      this.notification(['warning', 'Restart', "You Will Restart with $" + this.nFormat(restartCash)])
      this.playSFX('close');
    }


    if (this.balanceOptions.marginCallSupress) { return }



    var btns = [{
      text: "Restart",
      handler: (data) => {
        this.playSFX('generic');
        this.statsData.restarts++
        this.tutorialState[0] = -1

        if (this.currentTicker && this.currentTicker[5]){
        this.statsData.restartedStocks.push(this.currentTicker[5]);

if (this.statsData.restartedStocks.length==1){
this.startTutorial('restart')
}


}else{
  console.error(this.currentTicker,"ticker undefined?")
}


var persistUpgrades:any=this.purchasedUpgrades.filter(value => upgradesPersistThroughRuns.includes(value));
        
        //console.error("restart campaign with $" + restartCash);
        //console.log(this.defaults);
        campaignReset.forEach((field) => {
          if (this.defaults[field]) {
            this[field] = cloneDeep(this.defaults[field])
          } else {
            this[field] = this.defaults[field];
            //console.error(field+" not defined as this.default");
          }
        })


        // auto purchase all free upgrades
        Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((upgrade) => {
          if ((this.demo ? demoUpgrades : this.rawUpgrades)[upgrade].cost == 0 || persistUpgrades.includes(upgrade)) {
            this.processUpgrade(upgrade, true)
          }
        });

        this.portfolio[0] = restartCash;
        this.statsData.stockGain = 0
        this.statsData.stockHistory = [];
        //this.finishedStocks.push(this.currentTicker);

this.loanData = { rate: startingInterestRate, amt: 0, cycle: 0, min: 0, max: startMaxLoan, mo: 0, upgradeMinus: 0 }
this.fee=fee
this.obfuscatePrice=true;
this.marginCallPercent = marginCallPercent;
this.obfuscateYear=true
this.longShortShow=false;
this.marginCalled=false;
this.marginWarning = false;
this.manual=0;
this.displayInfo = 0;

        this.syncUpgradeModes()

        this.initStock();

      }
    }]

    if (!forced) {
      btns.unshift({
        text: "Cancel",
        handler: () => {
          this.playSFX('close');
        },
      });
    } else if (this.mode == 'sandbox') {
      btns.unshift({
        text: "Bailout",
        handler: () => {
          this.playSFX('generic');
          this.notification(['warning', '$5000 Bailout', 'Added to Account'])

          this.addCash(5000);
          this.setTradeVol();
        },
      });
    }


    function ordinal(n) {
      var s = ["th", "st", "nd", "rd"];
      var v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }




    this.alertPop = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: forced ? "Margin Called" : "Restart Run?",
      message: this.mode == 'sandbox' ? ("You have unlocked sandbox mode - are you sure you wish to start a new run? You will start with <b>$" + this.nFormat(restartCash) + "</b> in capital <i>(banked funds along with Learn & Earn revenue)</i>. You will need to re-purchase all upgrades including sandbox mode. This would be your <b>" + ordinal(parseInt(this.statsData.restarts + 2)) + "</b> run.") : ("In real life, restarting after massive losses isn't an option. Investing is extremely risky. By clicking 'restart' you will start a new run with <b>$" + this.nFormat(restartCash) + "</b> in capital (banked funds along with Learn & Earn revenue). You will need to re-purchase all upgrades. This " + (forced ? "will" : "would") + " be your <b>" + ordinal(parseInt(this.statsData.restarts + 2)) + "</b> run."),
      buttons: btns,
    });
    this.alertPop.present();

  }



  marginCallPop(normal: any = false) {

    if (!this.realVsDebugState()) { return }

    if ((normal && !this.warnings.marginCallPop) || (!normal && !this.warnings.marginCallPop2)) {
      this.stopSim()
      this.alertPop = this.alertCtrl.create({
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
            handler: (data) => {
              this.playSFX('close');
              if (normal) {
                this.warnings.marginCallPop = data.length > 0;
              } else {
                this.warnings.marginCallPop2 = data.length > 0;
              }

            },
          },
        ],
      });
      this.alertPop.present();
    }
  }





  //HOT
  transactionFee() {
    if (this.warnings.fee || this.fee == 0) {

if (this.activeBot && this.activeBot !== DefaultBotName) {
  this.tradeWhenBotIsInactive(true);
}else{
  this.trade(true);
}
      
    } else {
      this.stopSim();
      this.alertPop = this.alertCtrl.create({
        title: "Process Trade?",
        message: "This trade will incur a transaction fee of $" +
          parseFloat((this.tradeVolume * this.fee).toFixed(2)).toLocaleString("en-US") +
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
            handler: () => {
              this.playSFX('close');
            },
          },
          {
            text: "Ok",
            handler: (data) => {
              //this.playSFX('generic');
              this.tutClick(11);
              this.tutClick(151);

              this.warnings.fee = data.length > 0;

if (this.activeBot && this.activeBot !== DefaultBotName) {
  this.tradeWhenBotIsInactive(true);
}else{
  this.trade(true);
}

            },
          },
        ],
      });
      this.alertPop.present();
    }
  }

  tutClick(num) {

    if (this.tutorialState[0] == 157) { this.endTutorial(); return }
    if (this.tutorialState[0] == 214) { this.endTutorial(); return }

    if (this.tutorialState[0] == num) { this.tutorialState[0] = num + 1 }
  }


  debugUnlock() {
    if (!jumpToBaklava) {

      this.notification(['success', 'Debug Unlock', '$500 and All Upgrades'])
    }
    this.addCash(500);
    Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((upgrade) => {
      //console.log('processit',upgrade);
      this.processUpgrade(upgrade);
    });
    /*
    setTimeout(()=>{
      this.upgrades();
      //this.learnEarn();
    },50)
    */
    this.setTradeVol();

  }

  async debugJump() {
    this.notification(['success', 'Jump', '3 Min Sim on Current Max'])

    var perSec = this.showRealSim(this.simSpeed[2] / 10);
    var recordsToSkip = 3 * 60 * perSec

    await this.pushData(recordsToSkip);

  }

  debugUpgrade() {

    this.notification(['success', 'Debug Upgrade', 'All Upgrades & Learn & Earn Unlocked'])

    Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((upgrade) => {
      // console.log('processit', upgrade);
      this.processUpgrade(upgrade, true);
    });

    Object.keys(this.milestones).forEach((milestone) => {
      this.processUpgrade(milestone, true);
      this.unlockedMilestones.push(milestone);
    })


    this.learnAll()
    /*
    setTimeout(()=>{
      this.upgrades();
      //this.learnEarn();
    },50)
    */
    this.setTradeVol();

  }



  quickDebug(bool) {
this.addCash(999999)

  }


  rmLimitStop(index) {
    if (this.tutorialState[0] == 104) {
      this.endTutorial();
    }
    //console.log(this.limitStops[index])
    //console.error("requires logic, especially for multiple!!");

    this.limitStops.splice(index, 1);
    this.saveState();
    this.setTradeVol();


    // refund as cash
  }

  calcLimDeductions() {
    this.limDeduction = [0, 0];
    this.limitStops.forEach((limitstop) => {
      if ((limitstop.buyvssell && !limitstop.short) || (!limitstop.buyvssell && limitstop.short)) {
        this.limDeduction[0] += limitstop.amt + limitstop.amt * limitstop.fee;
      } else {
        var amt = limitstop.amt / limitstop.price * limitstop.market
        this.limDeduction[1] += amt + amt * limitstop.fee;
      }

    })


  }

  stopSim() {
    this.lastSpeed=this.simSpeed[0]
    this.simSpeed[0] = 0;
    this.simulator.stop();

    // this.simSpeed[1] = this.simSpeed[0];
    // this.simSpeed[0] = 0;
    // this.realtimeSim();

    // if (this.navCtrl.getActive().name == "BaklavaPage"){
    //   this.events.publish("baklavaBotPause");
    // }

    // this.toggleConfig(true);
    // this.updateChart(true,true)
  }


  //HOT
  limitTrade(order, close) {
    //portfolio[0]=currCash
    //portfolio[1]=percent of that cash invested

    //buyvssell, volume, order_price, close, amt, short
    /*
            buyvssell: data.buyvssell,
            volume: adjustedVol + (adjustedVol * this.fee),
            //origVol:data.amt,
            market:data.price,
            amt: adjustedVol,
            price: this.limitStop,
            limit: !limit,
            short: !data.longvsshort
    */


    //if (!order.short) {
      //(limitstop.buyvssell && !limitstop.short) || (!limitstop.buyvssell && limitstop.short)

//console.error("check these values for limit orders",this.cashVsInvested)

      if ((order.buyvssell && !order.short) || (!order.buyvssell && order.short)) {
        this.portfolio[0] -= order.volume;
        var dayGain = close / order.price

        // cash to go in 'invested'
        var result = order.amt * dayGain
        var newCapital = this.portfolio[0] + result;
        var newInvestedAmt = this.portfolio[0] * this.portfolio[1] + result;
        var newRatio = newInvestedAmt / newCapital;

        this.portfolio[0] = newCapital;
        this.portfolio[1] = newRatio;

      } else {

var cash=this.portfolio[0] * (1 - this.portfolio[1])
var inv=this.portfolio[1] * this.portfolio[0]


inv=inv-order.amt-order.amt*order.fee;
cash=cash+order.amt-order.amt*order.fee;
var ratio=inv/(cash+inv)
this.portfolio[1]=ratio;
//if (inv<0){cash=0-inv;inv=0}

if (inv<.01 && !order.short){
  setTimeout(() => {
        this.chkbox = !this.chkbox;
        this.toggleBuyVSell();
      }, 30)
}


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

if (order.buyvssell && !order.short){
 this.longVsShort=true
}else if (!order.buyvssell && order.short){
this.longVsShort=false
}
//console.error(order.short)
      this.config.candlestick.trades.push({
        date: this.currentDate,
        short:order.short,
        type: order.buyvssell ? "buy" : "sell",
        price: order.price,
        quantity: order.amt,
      });

/*
    } else {
      console.error("process limit trade for short!!")
    }
*/
    // console.error("limitstop filled");
    // console.error(this.portfolio[0], this.portfolio[1]);

    // this.setTradeVol(true);

    //stop sim for the first time when a limit order is given? this.warnings.limProcessed?
    if (this.warnings.limitTrigger) {
      this.simulator.stop();
      this.stopSim();

var lim=order.buyvssell || order.price>this.currPrice[0];

      this.alertPop = this.alertCtrl.create({
        title: (lim?"Limit":"Stop")+" Order Triggered",
        message:
          "One or more of your pending Limit/Stop orders have been triggered",
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
            handler: (data) => {
              this.playSFX('generic');
              this.warnings.limitTrigger = data.length > 0;
                this.setTradeVol();
            },
          },
        ],
      });
      this.alertPop.present();
    }
    // this.saveState();
  }

  upgradePopup(title, txt, tutState, id, prospectiveTutState) {
    if (prospectiveTutState) {
      prospectiveTutState = prospectiveTutState.start
    } else {
      prospectiveTutState = -1
    }


    if (!this.warnings.upgradePop) {
      this.alertPop = this.alertCtrl.create({
        title: title,
        enableBackdropDismiss: !(tutState == 8 || prospectiveTutState == 100), // 
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
            handler: (data) => {
              this.warnings.upgradePop = data.length > 0;
              this.playSFX('generic');
              if (tutState == 8) {
                this.tutorialState[0] = 9
              }
              if (this.tutorialDB[id]) {
                this.startTutorial(id)
                if (id == marginUpgrade) {
                  this.warnings.marginCallWarn = false
                }
              }
            },
          },
        ],
      });
      this.alertPop.present();
    } else {
     // console.error(this.tutorialDB[id])
      if (this.tutorialDB[id]) {
        this.startTutorial(id)
        if (id == marginUpgrade) {
          this.warnings.marginCallWarn = false
        }
      }
    }
  }

  generalPopup(title, txt) {
    this.alertPop = this.alertCtrl.create({
      title: title,
      message: txt,
      buttons: [

        {
          text: "Ok",
          handler: (data) => {
this.playSFX('close');
          },
        },
      ],
    });
    this.alertPop.present();
  }

  trade(fee: any = this.warnings.fee, lim: any = this.warnings.limit, data: any = { 'buyvssell': this.buyvssell, 'price': this.currPrice[0], 'longvsshort': this.longVsShort, 'amt': this.tradeVolume, 'bot': false, 'longShortShow': this.longShortShow }) {
    //console.log(fee,lim,data)
    //console.log(data.price,this.limitStop)

    if (!data.bot) {
      this.stopSim()
    }

    //QUESTION is the sim stopped if we run out of funds at the time of placing a trade? what if there are sums for a future trade?
    if (!data.buyvssell && data.amt > this.cashVsInvested[1]*1.001 && !data.longShortShow) {// ()()() shorts
      if (this.activeBot !== DefaultBotName) { this.stopSim() }
      this.generalPopup("Insufficient Funds", "Delete an open sell order to make trade");
      this.playSFX('error');
       this.stopSim()
      return;
    }


    if (this.limitStops.length > 0 && this.limitStops[0].short && data.buyvssell && data.longvsshort) {
      this.generalPopup("Error", "Must Cancel Short Orders before buying long");
      this.playSFX('error');
       this.stopSim()
      return;
    }

    //QUESTION this part will only get run if bot is off?
    if (data.price !== this.limitStop) {

      if (this.limitStops.length > 3) {
        this.generalPopup("Error", "Cannot have more than 4 max limit/stop orders");
        this.playSFX('error');
         this.stopSim()
        return;
      }


      //QUESTION do we pause sim for this prompt???
      if (!lim || this.tutorialState[0] == 103) {
        this.limitPrompt();
        return;
      }
      //[buyvssell,price,short,amt]
      //tradeVolume * (buyvssell?1:(limitStop/currPrice[0])
      var limit: any = data.price > this.limitStop;
      var adjustedVol = data.amt * (data.buyvssell ? 1 : (this.limitStop / data.price));

      var isShort = (this.longShortShow && this.cashVsInvested[1] < 0.01 && !data.buyvssell) || !data.longvsshort


      if (this.limitStops.length > 0 && this.limitStops[0].short !== isShort) {
        this.generalPopup("Error", "Cannot have long and short orders simultaneously");
        this.playSFX('error');
         this.stopSim()
        return;
      }

      //console.error(data.amt,adjustedVol - (adjustedVol * this.fee));
      this.limitStops.push({
        buyvssell: data.buyvssell,
        fee: this.fee,
        volume: adjustedVol + adjustedVol * this.fee,
        market: data.price,
        amt: adjustedVol,
        price: this.limitStop,
        limit: !limit,
        short: isShort,
      });

      //this.saveState();
      this.setTradeVol(true);

      return;
    } else {
      if (!fee) {
        this.transactionFee();
        return;
      } else {
        if (this.tutorialState[0] == 151) { this.tutorialState[0] = 152 }
        if (this.tutorialState[0] == 157) { this.endTutorial() }
      }
    }

    var invested = this.portfolio[1] * this.portfolio[0];
    this.portfolio[0] = this.portfolio[0] - data.amt * this.fee;

    var cash = this.portfolio[0] - invested;

    var shortAvail =
      (this.longShortShow &&
        this.cashVsInvested[1] < 0.01) ||
      !data.longvsshort;

    if (data.buyvssell) {
      if (!data.longvsshort) {

        this.portfolio[1] =
          (invested - data.amt * (this.fee + 1)) / (cash + invested);
        if (this.portfolio[1] == 0) {
           if (!(this.limitStops[0] && this.limitStops[0].short)){
          this.longVsShort = true;
          }
        }
      } else {
        this.portfolio[1] = (invested + data.amt) / (cash + invested);
      }

      //this.portfolio[1] =this.portfolio[1] + data.amt / this.portfolio[0]; // - data.amt*this.fee;
    } else {
      if (shortAvail) {
        this.longVsShort = false;
        //data.longvsshort = false;
        this.portfolio[1] = (invested + data.amt) / (cash + invested);
      } else {
        this.portfolio[1] =
          (invested - data.amt * (this.fee + 1)) / (cash + invested);
      }
      //console.log(invested,data.amt,cash,invested)

      //this.portfolio[1] = this.portfolio[1] - data.amt / this.portfolio[0]; // - data.amt*this.fee;
    }


    //QUESTION notifications... do we have to show them?
    if (this.activeBot == DefaultBotName && this.navCtrl.getActive().name == "HomePage") {
      if (data.buyvssell && this.longVsShort || !data.buyvssell && !this.longVsShort) {
        this.notification(['success', '$' + this.nFormat(Math.floor(data.amt)), (data.longvsshort ? 'Buy' : 'Short') + ' Successful'])
      } else {
        this.notification(['success', '$' + this.nFormat(Math.floor(data.amt)), (data.longvsshort ? 'Sell' : 'Cover') + ' Successful', 'red'])
      }
    }


    this.statsData.stockTrades++
    this.statsData.totalTrades++


let isShrt=(this.longShortShow && this.cashVsInvested[1] < 0.01 && !data.buyvssell) || !data.longvsshort

    this.config.candlestick.trades.push({
      date: this.currentDate,
      short:isShrt,
      type: data.buyvssell ? "buy" : "sell",
      price: data.price,
      quantity: data.amt,
    });

    //QUESTION do we want to redraw immediately?
    if (this.toggleConfigState) {
      this.reDraw();
    }

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

    //QUESTION what is this ?
    if ((this.portfolio[1] <= 0.01 || this.portfolio[1] >= .99) && data.longvsshort) {
      //()()() short
      setTimeout(() => {
        this.chkbox = !this.chkbox;
        this.toggleBuyVSell();
      }, 30)
    }
    //this.chartPieOptions.series = rez;
    this.saveState();
    //QUESTION do we need this also check if its beigng called above
    this.setTradeVol(true);

  }

  nFormat(num, digits: any = 2) {
    let neg=false;
    if (num<0){neg=true;num=Math.abs(num)}
    if (num<1000){return ((neg?-1:1)*num).toFixed(2)}
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
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

    let item: typeof lookup[number];
    for (let i = 0; i < lookup.length; i++) {
      if (num >= lookup[i].value) {
        item = lookup[i];
        break;
      }
    }

if (num>=1000000000000000000){
return String(num).replace('+','')
}

    return item ? ((neg?-1:1)*num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    
  }

  setTradeVol(trade: boolean = false) {
    //console.log(this.portfolio);
    this.calcLimDeductions()

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
    } else if (this.cashVsInvested[1] < 0) {
      //console.error(this.cashVsInvested[1],'negative investment, showing 0');
      this.cashVsInvested[1] = 0
    }
    //var newPortfolio=this.cashVsInvested[0] + this.cashVsInvested[1];

    this.totalPortfolio = this.cashVsInvested[0] + this.cashVsInvested[1] + this.limDeduction[0] - this.loanData.amt + this.limDeduction[1];

//-------------------------------------
/*
if (typeof this.cashVsInvested[0]!=="number" || typeof this.cashVsInvested[1]!=="number" || this.totalPortfolio>998999999999999999999){

this.fatalIssue(false);

}
*/
//-------------------------------------

    Object.keys(this.milestones).forEach((milestone) => {

      if (!this.unlockedMilestones.includes(milestone) && this.totalPortfolio >= this.milestones[milestone].amt) {
        this.processUpgrade(milestone, true);
        this.unlockedMilestones.push(milestone);
        
        this.stopSim();
        if (this.milestones[milestone].title){
          this.notification(['success', 'Net Worth Milestone Unlocked', this.milestones[milestone].title]);
        this.generalPopup(this.milestones[milestone].title, "Congratulations! Your Net Worth is now over $" + parseInt(this.milestones[milestone].amt).toLocaleString('en-US') + ". " + this.milestones[milestone].txt)
      }
      if (this.milestones[milestone].extra){
        this.checkExtra(this.milestones[milestone].extra)
      }

        this.saveState();
      }

    })

//console.log("setTradeVol")
    // ---- margin logic -----------------
    if (this.loanData.amt == 0 || this.totalPortfolio > 0) { this.marginWarning = false }
    if (this.loanData.amt > 0 && this.purchasedUpgrades.includes(marginUpgrade) && this.totalPortfolio < 0) {

this.marginLogic()


    } else {
//console.error(this.totalPortfolio,this.warnings.restartRemind)
      if (!this.warnings.restartRemind && this.totalPortfolio < -9) {
//console.error("bam!")
        this.restartRemind();
      }

if (this.loanData.max==this.loanData.amt && this.cashVsInvested[0]<1 && this.cashVsInvested[1]<1 && this.availEarn==0 && this.extraAvail==0){
this.restart(true)
}

    }
    //-----------------------------

    this.statsData.netWorth = this.totalPortfolio;

    if (this.totalPortfolio <= 0) {
      this.portfolioMomentum = false;
    } else {
      this.portfolioMomentum = this.totalPortfolio >= prevPortfolio;

    }


    this.historicalCashInvested.push(this.cashVsInvested)

    var shortAvail =
      (this.longShortShow &&
        this.cashVsInvested[1] < 0.01) ||
      !this.longVsShort;


var covLimOrders=this.limitStops.find((e)=>{return e.short==true})

    if (this.cashVsInvested[1] < 0.01 && !covLimOrders) {
      this.longVsShort = true;
    }

    //console.warn(this.buyvssell,shortAvail,this.longShortShow,this.cashVsInvested[1],this.cashVsInvested[0],this.longVsShort)

    // || shortAvail   !== !!shortAvail
    //(!this.buyvssell && shortAvail) || (this.buyvssell && !this.longVsShort)

    if (this.buyvssell) {
      if (!this.longVsShort || (this.limitStops[0] && this.limitStops[0].short)) {
        this.tradeVolume = this.cashVsInvested[1]
      } else {
        this.tradeVolume = this.cashVsInvested[0]
      }
    } else {
      if (shortAvail && !(this.limitStops[0] && !this.limitStops[0].short)) {
        this.tradeVolume = this.cashVsInvested[0];
      } else {
        this.tradeVolume = this.cashVsInvested[1];
      }
    }


    //this.tradeVolume -= this.limDeduction[0]
    this.tradeVolume = this.tradeVolume * this.tradeDefault
    this.tradeVolume = this.tradeVolume / (1 + this.fee);

    //console.error(this.tradeVolume,this.limDeduction)

    if (this.tradeVolume < 0) { this.tradeVolume = 0 }

    this.maxTradeRange = this.tradeVolume;
    this.limitStop = this.currPrice[0];
    this.limitRender = this.limitStop.toFixed(2);

    if (trade && shortAvail) {
      // switch to buy?
    }


    this.calcAvailUpgrades();
// check buyvssell congruity
 
  /**/
if(this.buyvssell==this.chkbox){
 console.error('buyvssell correction')
  this.buyvssell=!this.buyvssell
}

  }


  fatalIssue(force){

this.alertPop = this.alertCtrl.create({
      title: "Corrupted Data Detected",
      message: "We have detected something seriously wrong with your saved game. To correct this, you will need to reset your storage to defaults. We're so sorry and please reach out at <b>info@cinqmarsmedia.org</b> so we can address this bug and provide you the in-game funds to get you back to your previous game state, and of course, apologize. Thank you for your understanding.",

      buttons: [

        {
          text: "Reset Storage",
          handler: (data) => {
    this.storage.clear().then(() => {setTimeout(() => {window.location.reload()}, 0)})
          },
        },
      ],
    });
    this.alertPop.present();

  }

  marginLogic(){

if (this.marginCalled){return}

if (Math.abs(this.totalPortfolio) > this.loanData.amt * this.marginCallPercent && this.marginWarning) {
        this.stopSim();
        console.error("margin called");
        this.restart(true)
this.marginCalled=true;
      } else if (Math.abs(this.totalPortfolio) > this.loanData.amt * this.marginWarningThreshold && !this.marginWarning) {
      this.marginWarning = true;
        this.notification(['warning', 'Margin Warn', 'You have lost ' + Math.round(Math.abs(this.totalPortfolio)/this.loanData.amt*1000)/10 + '% of your margin loan. At '+this.marginCallPercent * 100+'%, you will be margin called'])

        if (this.warnings.marginCallWarn) {
           this.stopSim();
          this.playSFX('error');
          this.alertPop = this.alertCtrl.create({
            title: "Margin Call Warning",
            message: "Your portfolio is negative and falls below " + this.marginWarningThreshold * 100 + "% of your loan. you will be margin called and need to restart if this falls below "+this.marginCallPercent * 100+"%. Take quizzes in the Learn & Earn section to earn funds.",
/*
            inputs: [
              {
                type: "checkbox",
                label: "Don't Pause or Show Again",
                value: "dontshow",
              },
            ],
*/
            buttons: [

              {
                text: "Ok",
                handler: (data) => {
                  this.playSFX('close');
                  //this.warnings.marginCallWarn = !(data.length > 0);
                },
              },
            ],
          });
         
          this.alertPop.present();

        }


  
      }

    
  }

  toggleBuyVSell(forceBuy: any = false) {


    if (!forceBuy && this.tutorialState[0] == 150) {
      this.tutorialState[0] = 151
    }

    if (!forceBuy && this.tutorialState[0] == 155) {
      this.tutorialState[0] = 156
    }


    if (forceBuy) {
      this.buyvssell = true;
      this.chkbox = false;
    } else {
      this.buyvssell = !this.buyvssell;
    }

    this.setTradeVol();
  }


  amtSlider(e) {

    if (e == Math.round(100 * this.maxTradeRange) && this.tutorialState[0] == 156) {
      this.tutorialState[0] = 157;
    }

    this.tradeVolume = e / (100 * this.tradeDefault)
  }
  loan() {

    if (!this.purchasedUpgrades.includes('margin')) {
      return
    }

    if (this.tutorialState[0] == 9) { this.tutorialState[0] = 10 }
    // calc this.loanData.min
    this.calcInterestRate()

    var accrued = Math.floor(this.loanData.cycle * this.loanData.amt / 360 * this.loanData.rate) / 100
    var rez = this.portfolio[0] - this.loanData.amt - accrued;

    this.loanData.max = this.loanData.max + this.statsData.addedMaxLoan;
    //console.log(this.loanData)
    if (rez < 0) { this.loanData.min = Math.floor(Math.abs(rez) + 1) } else { this.loanData.min = 0 }

    this.globalModal = this.modalCtrl.create(loanModal, { data: this.loanData, networth: this.totalPortfolio,mystery: !this.purchasedUpgrades.includes('name'), type: this.getActive("type"), tutState: this.tutorialState[0], margin: [this.purchasedUpgrades.includes(marginUpgrade), this.marginWarning, this.totalPortfolio, this.loanData] }, { enableBackdropDismiss: this.tutorialState[0] !== 10, cssClass: 'loanModal' });
    this.globalModal.present();
  }

  news(e) {

    //e.preventDefault();

    var tickerName = this.currentTicker[0];
    var type = this.getActive("type")//"stock"; // crypto:price?

    // console.log(tickerName);
    if (tickerName == "Alphabet") { tickerName = "Google" }
    if (tickerName == "Meta Platforms") { tickerName = "Facebook" }


    var searchQuery = "%22" + tickerName + "%20" + type + "%22";

    var url = "https://www.google.com/search?ls=en&q=" + searchQuery +
      "%20before%3A" + this.currentDate.toISOString().split('T')[0] + "&tbs=cdr:1,cd_min:1/1/0";
    /*
          var url ="https://news.google.com/search?ls=en&q=" + searchQuery +
          "%20before%3A"+this.currentDate.toISOString().split('T')[0];
    */
    // console.log(url);
    // open browser component
    this.browserControl.initBrowser(url);
    this.browserControl.show();



  }

  getLearnReward(name) {
    if (Object.keys(startingLearn).indexOf(this.learning[name].upgrade) !== -1) {
      return startingLearn[this.learning[name].upgrade];
    } else if (!((this.demo ? demoUpgrades : this.rawUpgrades)[this.learning[name].upgrade]) || !((this.demo ? demoUpgrades : this.rawUpgrades)[this.learning[name].upgrade]).reward) {
      //console.error(this.learning[name].upgrade);
     // console.error((this.demo ? demoUpgrades : this.rawUpgrades));
      //console.error(((this.demo ? demoUpgrades : this.rawUpgrades)[this.learning[name].upgrade].reward))
      if (!this.demo) {
        console.error('reward undefined for ' + name);
      }
      return 0;
    } else {
      //console.log(this.learning[name].upgrade,rawUpgrades[this.learning[name].upgrade]);
      //console.log((this.demo?demoUpgrades:rawUpgrades)[this.learning[name].upgrade].reward);
      return ((this.demo ? demoUpgrades : this.rawUpgrades)[this.learning[name].upgrade].reward)
    }
  }

  genAvailEarned() {
    var availLearn = [];
    Object.keys(this.learning).forEach((key) => {
      // console.log(this.learning[key].upgrade);

      if (
        !this.earnedLearnings.includes(key) &&
        (this.purchasedUpgrades.includes(this.learning[key].upgrade) ||
          typeof this.learning[key].upgrade == "undefined" || Object.keys(startingLearn).indexOf(this.learning[key].upgrade) !== -1)
      ) {
        var ele = this.learning[key];
        ele.name = key;
        ele.reward = this.getLearnReward(key)
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
    return availLearn
  }
  genEarned() {
    var rewatch = [];

    this.earnedLearnings.forEach((id) => {
      if (this.learning[id]) {
        var obj = this.learning[id]
        obj.name = id
        obj.reward = this.getLearnReward(id)
        rewatch.push(obj);
      }
    });

    return rewatch
  }

  genEarnedNames() {
    var rewatch = [];

    this.earnedLearnings.forEach((id) => {
      if (this.learning[id]) {
        var obj = this.learning[id]
        obj.name = id
        rewatch.push(obj.upgrade);
      }
    });
    return rewatch
  }

  learnEarn() {
    if (this.tutorialState[0] == 4) { this.tutorialState[0] = 5 }
    //this.earnedLearnings; // by id
    //this.purchasedUpgrades;
    if (this.tutorialState[0] == 3) {
      this.tutorialState[0] = 4;
    }
    var availLearn = this.genAvailEarned();
    var rewatch = this.genEarned();
    //console.error(availLearn);
    this.globalModal = this.modalCtrl.create(learnModal, {
      learn: availLearn,
      rewatch: rewatch,
      pipNew: this.warnings.new.pip,
      availEarn: this.availEarn,
      numLearn: this.EarnLearnCount,
      tutState: this.tutorialState[0],
      pipUnlocked: this.unlockedMilestones.includes('pip')
    }, { enableBackdropDismiss: this.tutorialState[0] !== 5, cssClass: 'learnModal' });
    this.globalModal.present();
    //{ enableBackdropDismiss:this.tutorialState[0]!==51, cssClass: 'modalPortfolio' }
  }

  learnAll() {
    this.genAvailEarned().forEach((obj) => {
      var name = obj.name
      if (this.learning[name]) {
        this.earnedLearnings.push(name);
        this.addCash(this.getLearnReward(name));
      } else { console.error('learning name undefined: ' + name) }
    })
    // console.log(this.earnedLearnings);
    this.calcLearnEarn();
    this.setTradeVol();
  }

  stats() {
    if (this.tutorialState[0] == 13) {
      this.tutorialState[0] = 14;
    }
    if (this.tutorialState[0] == 50) {
      this.tutorialState[0] = 51;
    }

if (this.tutorialState[0] == 30) {
      this.tutorialState[0] = 31;
    }


    // if (!this.purchasedUpgrades.includes('breakdown')){return}

    this.statsData.leaderUnlock = this.purchasedUpgrades.includes('leaderboard');

    this.globalModal = this.modalCtrl.create(statsModal, {
      data: this.statsData,
      margin: [this.purchasedUpgrades.includes(marginUpgrade), this.marginWarning, this.totalPortfolio, this.loanData, this.marginWarningThreshold, this.warnings.marginCallWarn, this.marginCallPercent],
      perks: [this.availEarn, this.extraAvail],
      tutState: this.tutorialState[0],
      bank:this.restartCash(),
      yearReveal: this.purchasedUpgrades.includes("yearreveal"),
      asset: this.getActive('type')
    }, { enableBackdropDismiss: this.tutorialState[0] !== 51, cssClass: 'modalPortfolio' });

this.globalModal.present();

  }

  /*
    initRawData(filename) {
      var result = d3.csv("assets/js/" + filename + ".csv", (error, data) => {
        this.currentData = data;
        this.pushData(startingRecords);
      });
    }
  */
  toggleMode() {
    this.manual++;

    if (this.manual == 3) {
      this.manual = 0;
    }

    this.limitStop = this.currPrice[0];
  }

  initGraph(records) { }

  upcomingUpgrades() {

    if (this.demoState && this.demoState.learned) {

      this.demoState.learned.forEach((earned) => {
        // console.log(this.learning[earned], earned)
        if ((!this.learning[earned].upgrade || this.purchasedUpgrades.includes(this.learning[earned].upgrade)) && !this.earnedLearnings.includes(earned)) {
          this.earnedLearnings.push(earned);
          this.addCash(this.getLearnReward(earned));
          this.notification(['success', 'Earned $' + this.getLearnReward(earned), " Demo " + earned])
          this.calcLearnEarn();
          this.setTradeVol();
        }

      })


    }

    // fire after purchase
    var horizon = [];
    var strippedUpgrades: any = []

    this.purchasedUpgrades.forEach((ele) => { strippedUpgrades.push(this.stripEnd(ele)) })

    Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((key) => {
      if (!this.purchasedUpgrades.includes(key) && !strippedUpgrades.includes(this.stripEnd(key))) {
        if (typeof (this.demo ? demoUpgrades : this.rawUpgrades)[key].cost !== 'undefined') {
          if (!this.unlockModeState[key]) {
            horizon.push((this.demo ? demoUpgrades : this.rawUpgrades)[key].cost);
          }
        }
      }
    });
    this.horizonUpgrades = horizon;
    // console.log(this.horizonUpgrades)
  }

  stripEnd(e) {
    return e.replace(/_.*/i, '');
  }

  calcAvailUpgrades() {
    let notnew = 0;

    this.horizonUpgrades.find((x, i) => {

      if (x < this.maxAmtUpgrades) { notnew++ }

      if (x > this.portfolio[0]) {
        this.availUpgrades = i;

        return true;
      } else if (i == this.horizonUpgrades.length - 1) {
        this.availUpgrades = this.horizonUpgrades.length
        return true
      }
    });
    if (this.horizonUpgrades.length == 0) { this.availUpgrades = 0 }

    this.newUpgrades = this.availUpgrades - notnew
  }

  calcLearnEarn() {
    var amt = 0;
    Object.keys(this.learning).forEach((key) => {

      if (
        !this.earnedLearnings.includes(key) &&
        (this.purchasedUpgrades.includes(this.learning[key].upgrade) ||
          typeof this.learning[key].upgrade == "undefined" || Object.keys(startingLearn).indexOf(this.learning[key].upgrade) !== -1)
      ) {

        amt += this.getLearnReward(key);
      }

      this.availEarn = amt;
    });
  }

  upgrades() {
    if (this.tutorialState[0] == 1) { this.tutorialState[0] = 2 }
    if (this.tutorialState[0] == 6) { this.tutorialState[0] = 7 }
    if (this.tutorialState[0] == 32) { this.endTutorial()}

    var genUpgrades = [];
    var strippedUpgrades: any = []

    this.purchasedUpgrades.forEach((ele) => { strippedUpgrades.push(this.stripEnd(ele)) })

    Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).forEach((key) => {
      if (!this.purchasedUpgrades.includes(key) && !strippedUpgrades.includes(this.stripEnd(key))) {
        var upgrade = (this.demo ? demoUpgrades : this.rawUpgrades)[key];
        upgrade.id = key;

        Object.keys(this.learning).forEach((ky) => {
          if (this.learning[ky].upgrade == upgrade.id) {
            upgrade.reward = this.getLearnReward(ky);
          }
        })

        /*
                if (upgrade.learn) {
                  Object.keys(learning).forEach((ky) => {
                    if (this.learning[ky].upgrade == upgrade.id) {
                      upgrade.reward = this.learning[ky].reward;
                    }
                  })
                }
        */


        genUpgrades.push(upgrade);
      }
    });
    var max = this.maxAmtUpgrades;
    this.maxAmtUpgrades = this.portfolio[0];

    genUpgrades.sort((a, b) => {
      return a.cost - b.cost;
    });



    this.globalModal = this.modalCtrl.create(upgradesModal, {
      //purchased: this.purchasedUpgrades,
      portfolio: this.portfolio,
      cashVsInvested:this.cashVsInvested,
      avail: this.availUpgrades,
      tutState: this.tutorialState[0],
      bulkbuy: this.unlockedMilestones.includes('bulkbuy'),
      upgradePersist:upgradesPersistThroughRuns,
      //demo:[demoMode,demoThreshold],
      earned: this.genEarnedNames(),
      //newUpgrades:this.newUpgrades,
      purchasedUpgrades: this.purchasedUpgrades,
      len: Object.keys((this.demo ? demoUpgrades : this.rawUpgrades)).length,
      upgrades: genUpgrades,
      max: max,
      warnings: this.warnings,
    }, { enableBackdropDismiss: this.tutorialState[0] !== 2 && this.tutorialState[0] !== 7 });
    this.calcAvailUpgrades()
    //this.newUpgrades=[];
    this.globalModal.present();

  }

  //Math.pow(y*secPerSimSpeed[0],1/3)*10=simSpeed[0]
  //math.pow(simSpeed[0]/10,3)/secPerSimSpeed

  increaseMaxSim(factor: any = 2) {
    //simSpeed:any=[0,10,10]

    //1.0201x1.3257

    factor = 1.02 * Math.pow(factor, 1.3257)
    //factor=Math.pow(factor,(1/0.7448))/1.3741

    var adjMax = Math.pow(this.simSpeed[2] / 10, 3) / this.secPerSimSpeed;
    var newMax = Math.pow(adjMax * factor * this.secPerSimSpeed, 1 / 3) * 10;

    if (newMax > 420) {
      //console.warn("maximum sim factor reached");
      newMax = 420
    }

    this.simSpeed[2] = newMax;




    //console.error(this.simSpeed[2]);
    //save
    //console.log(newMax);
  }

  brushThreshLog(newThresh) {
    if (this.stateMachine.simulating) {
      this.stopSim();
    }
    this.customBrush = -1;
    var real = Math.floor(Math.pow(newThresh, 3) / 10000);
    this.brushThreshold[1] = real;
    this.renderInterval = this.brushThreshold[1];
  }

  performanceInfo() {

    this.alertPop = this.alertCtrl.create({
      title: "Performance Warning",
      message: "The more indicators/brush options that are turned on and the more data being displayed at any one time, the greater the graphical impact and slower your simulations will be. Consider turning some off when simulating, particularly at a high speed.",
      inputs: [
        {
          type: "checkbox",
          label: "Don't Show Again",
          value: "dontshow",
        },
      ],
      buttons: [
        /*
                {
                  text: "Performance Mode",
                  handler: (data) => {
                    this.warnings.performance= data.length > 0;
                   // console.error('performance mode');
                  },
        
                },
                */
        {
          text: "Ok",
          handler: (data) => {
            this.warnings.performance = data.length > 0;
          },
        }
      ],
    });
    this.alertPop.present();
    this.stopSim();

  }

  deconstructSimSpeed() {
    if (isNaN(this.adjustedSimSpeed)) {
      return parseFloat(this.adjustedSimSpeed.replace('k', '')) * 1000
    } else {
      return this.adjustedSimSpeed
    }

  }


  realSimNum(newSpeed){
     var realSim
    if (typeof this.secPerSimSpeed == 'undefined') {
      realSim = Math.pow(newSpeed, 3) / 5;
    } else {
      realSim = Math.pow(newSpeed, 3) / this.secPerSimSpeed;
    }

    return 1.3741 * Math.pow(realSim, 0.7448)
  }

  showRealSim(newSpeed) {

    var realSim
    if (typeof this.secPerSimSpeed == 'undefined') {
      realSim = Math.pow(newSpeed, 3) / 5;
    } else {
      realSim = Math.pow(newSpeed, 3) / this.secPerSimSpeed;
    }
    realSim = 1.3741 * Math.pow(realSim, 0.7448)

    var adjViz: any = realSim;
    /**/

    if (adjViz > 10000) {
      adjViz = String(Math.round(adjViz / 1000)) + "k";
    } else if (adjViz > 1000) {
      adjViz = String(Math.round(adjViz / 100) / 10) + "k";
    } else if (adjViz > 10) {
      adjViz = Math.round(adjViz);
    } else {
      adjViz = Math.floor(adjViz * 10) / 10;
    }
    //return Math.round(num*2)/2;
    return adjViz
  }

  //HOT
  realtimeSim(newSpeed: number = this.simSpeed[0]) {
    newSpeed = newSpeed / 10;
    this.simSpeed[1] = newSpeed;
    this.adjustedSimSpeed = this.showRealSim(newSpeed);
    if (newSpeed == 0) { return }
    this.simulator.targetSpeed = this.adjustedSimSpeed;
    const useBot: boolean = this.activeBot && this.activeBot !== DefaultBotName;
    if (!this.stateMachine.simulating) {
      this.simulator.start(this.config, useBot);
    }
  }


  async playButton() {

if (!this.purchasedUpgrades.includes('step') && !this.purchasedUpgrades.includes('sim')){return}

    // step
    await this.initBotIfRequired();


this.supressLabels();


if (this.dateKeyIndex<0 || this.dateKeyIndex>=this.currentData.length-1){
    this.portfolio[1] = 0;
    this.cashVsInvested = [this.portfolio[0], 0];
  this.initStock()
return;
}

    if (!this.purchasedUpgrades.includes('sim')) {

      if (this.tutorialState[0] == 3) {
        this.tutHold++
        if (this.tutHold == 3) {
          this.tutorialState[0] = 4;
          this.tutHold = 0;
        }
      } else if (this.tutorialState[0] == 12) {
        this.tutHold++
        if (this.tutHold == 7) {
          this.tutorialState[0] = 13;
          this.tutHold = 0;
        }
      }

      this.tutClick(153)
      this.tutClick(154)

      await this.simulator.stepOnce(this.activeBot && this.activeBot != DefaultBotName);
      return;
    } else {
      this.realSpeed = [0, performance.now()]
    }


    if (this.simSpeed[0] == 0) {

      this.tutClick(153)
      // await this.simulator.stepOnce(this.activeBot && this.activeBot != DefaultBotName);
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

    } else {

      this.tutClick(154)
      this.stopSim()
    }

    //this.saveState();
  }

  newsletterPopup(){
     let alert = this.alertCtrl.create({
      cssClass: 'earlyAccessAlert',
      title: "Non-Profit Newsletter",
      message: "If you're enjoying the game, consider signing up for our newsletter! We email about once every 3 months with news on upcoming projects and updates to current ones. Cancel Anytime.",
      enableBackdropDismiss: false,
      inputs: [
        {
          name: "email",
          placeholder: "Your Email",
        }
      ],
      buttons: [
      {
          text: "No Thanks",
          handler: (data) => {
                 this.opportunities.email.suppress=true;
          },
        },
        {
          text: "Sign-Up",
          handler: (data) => {
            if (!window.navigator.onLine) {
              this.generalPopup(
                "No Internet",
                "Signing Up requires an internet connection"
              );
              return false;
            }
            var postAt = data.email.match(/@(.+)/i);

            if (
              /(.+)@(.+){2,}\.(.+){2,}/.test(data.email) &&
              data.email.length > 7 &&
              postAt &&
              !emailDomainBlacklist.includes(postAt[1])
            ) {
           /**/
// email newsletter

this.opportunities.email.completed=true;
            } else {
              // alert('please enter a valid email');
              alert.setMessage(
                '<span class="red">Please Enter a Valid Email</span>'
              );
              return false;
            }
          },
        }
      ],
    });
    alert.present();
  }


  stockDone() {

    var finishedTxt="Sim Finished"

    if (this.paperState.mode !== -1) {
      this.unwrapPaper()
    }



this.stopSim();


//------Cull portfolio history------

const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

if (this.statsData.portfolioHistory.length>10000){
//console.log(this.statsData.portfolioHistory.length);
var n=Math.floor(this.statsData.portfolioHistory.length/5000)
this.statsData.portfolioHistory=every_nth(this.statsData.portfolioHistory,n)
//console.log(this.statsData.portfolioHistory.length,n);
};
//-------------


if (typeof this.alertPop !== 'undefined' && typeof this.alertPop._state !== 'undefined' && this.alertPop._state == 3) {
  if (this.alertPop.data.title.includes(finishedTxt)){
  console.warn("stockDone() called multiple times, alertPop still up");
  return;
}else{
  console.error("closing other alertPop");
this.alertPop.dismiss()
}
}


if (this.navCtrl.getActive().name == "BaklavaPage") {
        this.events.publish("baklavaGains", this.cumulativeGain, this.currentData[this.dateKeyIndex].date, this.currentTicker, this.cashVsInvested, this.currPrice, this.limDeduction, this.longVsShort, this.portfolio, this.YrsElapsed,this.warnings.autoContinue?0:1);
}


      if (this.activeBot !== DefaultBotName) {
        var logObj = { type: 3, message: this.getActive("type") + " <b>"+this.currentTicker[0]+"</b> Was Completed", timestamp: new Date().getTime(), date: this.currentDate,hideTrace:true,detail:"Gains of <b>" + parseFloat(((this.statsData.riseFall[this.statsData.riseFall.length - 1].value-1)*100).toFixed(2)).toLocaleString('en-US') + "%</b> were made over "+this.statsData.stockTrades+" trades. This yielded a profit of <b>$"+this.nFormat(this.statsData.netWorth-this.statsData.netWorthBefore)+"</b>."  }

        this.advancedBots[this.activeBot].logs.push(logObj)
      }


// make sure logs don't get out of control
if (this.advancedBots[this.activeBot] && this.advancedBots[this.activeBot].logs.length>10){
var logLen=this.advancedBots[this.activeBot].logs.length;
var pastLast=false;


for (let i=logLen-3;i>=0;i--){

if (!pastLast && this.advancedBots[this.activeBot].logs[i].type==3){
  pastLast=true
}

if (pastLast && this.advancedBots[this.activeBot].logs[i].type!==3){
this.advancedBots[this.activeBot].logs.splice(i,1);
}


}


var fix=logLen-this.advancedBots[this.activeBot].logs.length

this.advancedBots[this.activeBot].read=this.advancedBots[this.activeBot].read-fix;

if (this.advancedBots[this.activeBot].read<0){this.advancedBots[this.activeBot].read=0}



}



    // cancel limit orders

    //liquidate without transaction fee
    this.portfolio[1] = 0;
    this.cashVsInvested = [this.portfolio[0], 0];

    this.statsData.stockFeeAmt = 0;
    this.statsData.stockInterestAmt = 0;
    this.statsData.stockTrades = 0;
    this.statsData.netWorthBefore = this.statsData.netWorth;

if (this.currentTicker && this.currentTicker[5]){
    this.finishedStocks.push(this.currentTicker[5]);
    }else{
      console.error(this.currentTicker,"currentTicker undef?");
    }
    this.statsData.finished = this.finishedStocks.length;
    this.statsData.stockHistory = [];
    this.statsData.lastCompletedGain = this.statsData.stockGain;
    this.statsData.stockGain = 0;
    this.statsData.stockRecords = 0;



    if (this.warnings.autoContinue) {
      // if balance sim?
      this.initStock(null, false, true);

var intvl=setInterval(()=>{
//console.error(this.dateKeyIndex)
if (this.dateKeyIndex>0){

      this.adjustedSimSpeed = 1;
      this.simSpeed[1] = this.lastSpeed;
      this.simSpeed[0] = this.simSpeed[1];
      this.simSpeed[1] = 0;
      this.realtimeSim();


  clearInterval(intvl)
}
},0)
      return;

    }



    this.clearLimitOrders();

    var tempPrompt = "New "
    var type = this.getActive("type")

    var nameUnlocked = this.purchasedUpgrades.includes('name');

    if (this.mode=='sandbox' && this.sandbox.random){
      tempPrompt += "Random"
    }else{
    tempPrompt += type;
}
    //this.CDDetectChangesCycle();

    var message="You made gains of <b>" + parseFloat(((this.statsData.riseFall[this.statsData.riseFall.length - 1].value-1)*100).toFixed(2)).toLocaleString('en-US') + "%</b> on the "+type.toLowerCase()+" '"+this.currentTicker[0]+"'. Your investments will be liquidated without transaction fees. You now have <b>$" + this.nFormat(this.cashVsInvested[0]) + "</b> in cash.";

    this.alertPop = this.alertCtrl.create({
      title: type + " "+finishedTxt,
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
          text: "Tweet",
          handler: (data) => {
            /*(
            console.error('submit leaderboard?');
            console.error('twitter/facebook/social media?');
            return false;
            */
    var link="https://twitter.com/intent/tweet?url=https://www.cinqmarsmedia.com/tradebots/&text="

    var text="I made gains of " + parseFloat(((this.statsData.riseFall[this.statsData.riseFall.length - 1].value-1)*100).toFixed(2)).toLocaleString('en-US') + "% on the "+type.toLowerCase()+" '"+this.currentTicker[0]+"' in #TradeBots! My net worth in #TradeBots is now $"+ this.nFormat(this.cashVsInvested[0])+".";

link=link+encodeURIComponent(text)
this.openLink(link)

          },
        },
        {
          text: tempPrompt,
          handler: (data) => {
            this.playSFX('generic');
            if (data.length == 1) {
              this.warnings.autoContinue = true;
              this.generalPopup("Auto Continue", "When one " + this.getActive("type") + " ends, another seamlessly begins. To undo this, change the setting in the menu. Your assets will still be liquidated whenever a " + this.getActive("type") + " ends. Stop simulation by hitting 'Escape'");
            } else {
              this.warnings.autoContinue = false;
            }
            //console.log(data);
            this.initStock(null, false, true)

            if (this.shownType=="custom"){
              this.shownType="stock"
            }
          },
        },
      ],
    });
    this.isStockDoneAlert = true;
    this.alertPop.present();
    this.stateMachine.resetTrades();
  }


  calcMovingGain() {

    if (!this.statsData.riseFall[this.statsData.riseFall.length - this.movingGainPeriod]) {
      this.movingGain[0] = 0;
      this.movingGain[1] = 0;
    } else {
      this.movingGain[0] = (1 - this.statsData.riseFall[this.statsData.riseFall.length - 1].value * -100) - (1 - this.statsData.riseFall[this.statsData.riseFall.length - this.movingGainPeriod].value * -100)

      this.movingGain[1] = Math.abs(this.statsData.riseFall[this.statsData.riseFall.length - 1].value - this.statsData.riseFall[this.statsData.riseFall.length - this.movingGainPeriod].value);
    }
   // console.error(this.movingGain[1]);
  }

  //HOT
  processLoan() {
    if (this.loanData.amt !== 0) {
      if (this.loanData.cycle == 30) {
        var amt = Math.floor(this.loanData.amt * this.loanData.rate / 12) / 100
        this.addCash(-1 * amt);
        this.notification(['warning', 'Margin Interest Paid', ('$'+this.nFormat(amt)+' Paid in Interest')]);
        this.statsData.totalInterestAmt += amt;
        this.statsData.stockInterestAmt += amt;
        this.calcInterestRate();
        this.loanData.cycle = 0;
      } else {
        this.loanData.cycle++
      }
    }
  }


  minimize(){
    window["electron"].minimise();
  }

  calcYearsElapsed() {
    var monthAdj = this.currentDate.getMonth() * 2628000000

    return Math.ceil(
      (this.currentDate - this.currentData[0].date - monthAdj) / 31536000000
    ) + 1;
  }

  setSandboxDates() {

    if (this.sandbox && this.dateKeyIndex >= 0) {
      var today = this.currentData[this.dateKeyIndex].date.toLocaleDateString('en-US').split("/");
      var min = this.currentData[0].date.toLocaleDateString('en-US').split("/");
      var max = this.currentData[this.currentData.length - 1].date.toLocaleDateString('en-US').split("/");


      this.sandbox.date = today[2] + "-" + today[0].padStart(2, '0') + "-" + today[1].padStart(2, '0')
      this.sandbox.max = max[2] + "-" + max[0].padStart(2, '0') + "-" + max[1].padStart(2, '0')
      this.sandbox.min = min[2] + "-" + min[0].padStart(2, '0') + "-" + min[1].padStart(2, '0')
    }

  }


  cmm() {
    this.openLink('https://www.cinqmarsmedia.com');
  }

  fullVersion() {
    alert("goto steam");
  }
  gitHub() {
    this.openLink('https://github.com/cinqmarsmedia');
  }

  quitPrompt() {

    this.alertPop = this.alertCtrl.create({
      title: "Quit Game",
      message:
        "Do You Wish to Quit? Progress Will be Saved",
      buttons: [
        {
          text: "Cancel",
          handler: (data) => {
          },
        },
        {
          text: "Quit",
          handler: (data) => {
            this.quitGame();
          },
        },
      ],
    });
    this.alertPop.present();

  }

  quitGame() {
    if (window["electron"]) {
      window["electron"].quit();
    } else {
      console.error('Electron Unavailable, ignoring quit');
    }
  }

  toggleFullScreen() {
    this.fullscreenState = !this.fullscreenState
    if (window["electron"]) {
      window["electron"].fullscreen();
    } else {
      console.error('Electron Unavailable, ignoring fullscreen');
    }

  }

  checkBrushData(begin, end) {
    var val

    for (var w = begin; w < end + 1; w++) {
      if (!this.currentData[w]) { break }
      //console.log(this.currentData[w].close,this.currentData[w].high,this.currentData[w].low,this.currentData[w].open);
      if (this.currentData[w].open == this.currentData[w].close && this.currentData[w].close == this.currentData[w].high && this.currentData[w].close == this.currentData[w].low) {

        if (w > begin) {

          if (val !== this.currentData[w].close) {
            this.noDataWarning = false
            break
          }

          if (w == end) {
            this.noDataWarning = true;
          }


        } else {
          val = this.currentData[w].close
        }


      } else {
        this.noDataWarning = false
        break
      }

    }

  }






  async pushData(interval, save: any = false, counter: any = false, idle: any = false, init: any = false): Promise<void> {
    //console.error('push',interval,counter);

    // check if done modal is open and stop if it is. 
    if (this.isStockDoneAlert) {
      console.warn('suppressing because stock done alert is up');
      return;
    }
   

    if (counter === false) {
      counter = interval - 1;
    }

    interval = 1;
    if (this.paperState.dateKeyIndex && this.paperState.dateKeyIndex >= this.dateKeyIndex) {
      this.unwrapPaper();
      this.events.publish("endBacktest");
      return;
    }



if (!init){
    //this.playSFX('tick');
}


    if (this.mode !== 'sandbox') {

      this.idleData.stamp = new Date().getTime();
    }

    if (this.activeBot !== DefaultBotName && this.advancedBots[this.activeBot] && this.dateKeyIndex > 0) {
      //interval = 1

      //CALL BOT


      let engineData: EngineData = {
        currentData: this.currentData,
        dateKeyIndex: this.dateKeyIndex + interval - 1,
        cash: this.cashVsInvested[0],
        invested: this.cashVsInvested[1],
        chartsProvider: this.chartsProvider,
        netWorth: this.totalPortfolio,
        longVsShort: this.longVsShort,
        metadata: {
          name: this.currentTicker[0],
          sector: this.currentTicker[1],
          exchange: this.currentTicker[this.currentTicker.length - 2],
          ticker: this.currentTicker[this.currentTicker.length - 1]
        },
        price: this.currentData[this.dateKeyIndex + interval - 1].close,
        trade: this.trade,
        halt: () => {
          this.stateMachine.reset();
        },
        loanData: this.loanData
      }
      //console.error(this.dateKeyIndex,startingRecords)
      if (this.dateKeyIndex >= startingRecords) {
        // let t1 = performance.now();
        await this.baklava.engineCalculate(engineData);
        // let t2 = performance.now();
        // console.log(`bot took ${Math.round(t2 - t1) / 1000} seconds.`);
      }
    } else if (this.activeBot !== DefaultBotName && !this.advancedBots[this.activeBot]) {
      console.error("active Bot is undefined, ignoring")
    }

    var before;
    var now;
    var prevIndex = this.dateKeyIndex;

    if (this.dateKeyIndex == -1) {
      before = this.currentData[0].close;

    } else {
      before = this.currentData[this.dateKeyIndex].close;
    }
    this.dateKeyIndex = this.dateKeyIndex + interval;
    //console.error(this.dateKeyIndex,counter);
    if (!this.currentData[this.dateKeyIndex]) {
      this.dateKeyIndex = this.currentData.length - 1;
    }

    now = this.currentData[this.dateKeyIndex].close;


    //this.processLoan();


    if (prevIndex == -1) { prevIndex = 0 }

    this.currentData.slice(prevIndex, this.dateKeyIndex).forEach((yesterday, i) => {

      var today = this.currentData[prevIndex + i + 1]


      for (let i = 0; i < this.limitStops.length; i++) {
        var order = this.limitStops[i]

        if (!order.short) {
          // long trades
          if (order.buyvssell && order.price >= today.low) {
            // put in long buy @ order.price
            //console.log(today.low);
            //console.error('long buy @ '+order.price)
            this.limitTrade(order, today.close);
            this.rmLimitStop(i)
            break;
          } else if (!order.buysell && order.limit && order.price <= today.high) {
            // put in long limit sell @ order.price
            // console.log('long limit sell @ ' + order.price, today.high)
            this.limitTrade(order, today.close);
            this.rmLimitStop(i)
            break;
          } else if (!order.buysell && !order.limit && order.price >= today.low) {
            // put in long stop sell @ order.price
            // console.log('long stop sell @ ' + order.price)
            this.limitTrade(order, today.close);
            this.rmLimitStop(i)
            break;
          }

        } else {
          // short trades

          if (!order.buyvssell && order.price <= today.high) {
            // console.log('short limit buy @ order.price');
            this.limitTrade(order, today.close);
            this.rmLimitStop(i);
            break;
          } else if (order.buyvssell && order.limit && order.price >= today.low) {
            // console.log('short limit liq @ order.price');
            this.limitTrade(order, today.close);
            this.rmLimitStop(i);
            break;
          } else if (order.buyvssell && !order.limit && order.price <= today.high) {
            // console.log('short limit stop @ order.price');
            this.limitTrade(order, today.close);
            this.rmLimitStop(i);
            break;
          }


        }
      }

      var percentMult;
      if (this.longVsShort) {
        percentMult = today.close / yesterday.close;
      } else {
        percentMult = yesterday.close / today.close;
      }

      //console.log(percentMult)

      var cash = this.portfolio[0] * (1 - this.portfolio[1])
      var inv = percentMult * (this.portfolio[0] * this.portfolio[1])

      this.portfolio[0] = cash + inv;
      if (this.portfolio[0] > 0) {
        this.portfolio[1] = inv / this.portfolio[0]
      }


      //var dailyGain=((1-percentMult)*-1)*this.portfolio[1];

      this.calcMovingGain();
      //console.log(amt)

      //this.movingGain=(1-amt*-100);
      this.cumulativeGain *= (percentMult - 1) * this.portfolio[1] + 1

      if (this.navCtrl.getActive().name == "BaklavaPage") {
        this.events.publish("baklavaGains", this.cumulativeGain, this.currentData[this.dateKeyIndex].date, this.currentTicker, this.cashVsInvested, this.currPrice, this.limDeduction, this.longVsShort, this.portfolio, this.YrsElapsed);
      }

      //-----bot change??? is it necessary??------------------
      var botState = this.activeBot

      var type = 0; // continuation

      if (botState !== this.botTracker) {
        // 1 manual to bot (start)
        if (this.botTracker == DefaultBotName) {
          type = 1
          // console.log(botState + "bot starts")
        } else if (botState == DefaultBotName) {
          // 2 bot to manual (end)
          type = 2
          // console.log(this.botTracker + "bot ends")
        } else {
          type = 3
          // console.log(this.botTracker + "bot ends")
          // console.log(botState + "bot starts")
        }


      }



      this.botTracker = botState;

      //-------------------------------------------------------

      this.statsData.portfolioHistory.push({ value: this.portfolio[0] - this.loanData.amt })

      this.statsData.stockHistory.push({ date: this.currentData[prevIndex + i + 1].date, value: this.portfolio[0] - this.loanData.amt })
      this.statsData.riseFall.push({ date: this.currentData[prevIndex + i + 1].date, value: this.cumulativeGain });

      if (this.statsData.riseFall[this.statsData.stockHistory.length - 1]) {

        this.statsData.stockGain = (this.statsData.riseFall[this.statsData.riseFall.length - 1].value - 1) * 100;

        if (this.statsData.lastCompletedGain) {

          this.statsData.globalGain = this.statsData.lastCompletedGain + this.statsData.stockGain;
        } else {
          this.statsData.globalGain = this.statsData.stockGain;
        }

        //console.warn(this.statsData.globalGain,this.statsData.stockGain)
      }
      this.statsData.globalRecords++
      this.statsData.stockRecords++
    })





    // render view
    //console.error(this.dateKeyIndex + 1,this.currentData.slice(0, this.dateKeyIndex + 1))
    this.config.data = this.currentData.slice(0, this.dateKeyIndex + 1);
    //console.log(this.config.data)
    //console.log(this.currentTicker);
    //console.log(DB[this.currentTicker]);
    this.config.portfolio.data = {
      portfolio: this.statsData.riseFall,
      close: this.currentData.slice(0, this.dateKeyIndex + 1),
      adjClose: this.currentData.slice(0, this.dateKeyIndex + 1).map((d) => ({
        date: d.date,
        value: marketMovement[d.rawDate],
      })),
    };

    if (counter == 0) {
      // this.updateChart(true)
    }


    this.currentDate = this.currentData[this.dateKeyIndex].date;


    this.currPrice = [
      now,
      Math.floor((now / before - 1) * 10000) / 100,
      before,
    ];

    this.setTradeVol();

    var stockDone = false

    if (this.dateKeyIndex == this.currentData.length - 1) {
      //alert("finished!");

      if (this.activeBot !== DefaultBotName) {
        var logObj = [{ type: 1, message: this.getActive("type") + " <b>"+this.currentTicker[0]+"</b> is finished", timestamp: new Date().getTime(), date: this.currentDate }]

        /*
          this.advancedBots[this.activeBot].logs.push(logObj)
        */


      }
      this.remindCounter--;
      // log stock is finished. 
      //console.log("stock finished")

      if (!this.warnings.autoContinue || idle) {
        // console.log(counter);
        counter = 0;
        this.stopSim();

        // stop recusion?? ()()()
      } else {
        this.notification(['success', this.currentTicker[0], 'Gains of ' + Math.floor((this.statsData.riseFall[this.statsData.riseFall.length - 1].value - 1) * 100) / 100 + "%"]);

      }

      stockDone = true;
      // window.location.reload();
      // this.stockDone();
    }

    this.YrsElapsed = this.calcYearsElapsed()

    this.setSandboxDates();
    if (save) {
      this.saveState();
    }

    if (counter > 0 && !stockDone) {
      //  console.error(counter);
      await this.pushData(interval, false, counter - 1)
    } else {
      this.dataProcessed[1] = performance.now();
      //console.error(this.dateKeyIndex)
    }

    this.realSpeed[0]++
  }


  //this.throttleFactor

  engineData: EngineData;
  simInit() {
    //if (!this.currentData){console.error("currentData UNDEFINED")}
    //if(!this.currentDate || !this.currentTicker || !this.currentData || !this.config || !this.config.data){return}

    this.simulator.clearEvents();
    if (!this.engineData) {
      this.refreshEngineData();
    }
    this.simulator.init("#d3el", this.engineData, this.config, this.refreshEngineData.bind(this), this.incrementDate.bind(this), this.decrementDate.bind(this), this.brushThreshold);
    if (demoMode) {
      this.simulator.on("break", this.breakInDemoMode.bind(this));
    }
    this.simulator.on("break", this.newsletterBreak.bind(this));
    this.simulator.on("break", this.break.bind(this));
    this.simulator.on("end", this.onSimEnd.bind(this));
    this.simulator.on("majorBreak", this.majorBreak.bind(this));
    this.simulator.on("stop", this.onSimStop.bind(this));

    this.simulator.onStep = this.step.bind(this);
  }

  //HOT
  incrementDate() {
    if (this.dateKeyIndex < this.currentData.length - 1) {
      this.dateKeyIndex = this.dateKeyIndex + 1;
    }
    this.currentDate = this.currentData[this.dateKeyIndex].date;
    this.refreshEngineData();
  }

  decrementDate() {
    this.dateKeyIndex = this.dateKeyIndex - 1;
    this.currentDate = this.currentData[this.dateKeyIndex].date;
    this.refreshEngineData();
  }


  //This function cannot have any timeouts or async stuff...
  //HOT
  step() {
  if (this.dateKeyIndex>startingRecords){
    this.playAudio('tick');
    }
    this.processLoan();
    this.statsData.globalRecords++
    this.statsData.stockRecords++
    let yesterdaysData: DataOhlc[number] = this.currentData[this.dateKeyIndex - 1];
    let todaysData: DataOhlc[number] = this.currentData[this.dateKeyIndex];


    var percentMult;
    if (this.longVsShort) {
      percentMult = todaysData.close / yesterdaysData.close;
    } else {
      percentMult = yesterdaysData.close / todaysData.close;
    }

    var cash = this.portfolio[0] * (1 - this.portfolio[1])
    var inv = percentMult * (this.portfolio[0] * this.portfolio[1])

    this.portfolio[0] = cash + inv;
    if (this.portfolio[0] > 0) {
      this.portfolio[1] = inv / this.portfolio[0]
    }
    if (this.portfolio[1] < 0) {
      this.portfolio[1] = 0;
    }
    this.cashVsInvested = [
      this.portfolio[0] * (1 - this.portfolio[1]) - this.limDeduction[0],
      this.portfolio[1] * this.portfolio[0] - this.limDeduction[1]
    ];
    if (this.cashVsInvested[0] < 0) {
      this.cashVsInvested[0] = 0;
    } else if (this.cashVsInvested[1] < 0) {
      this.cashVsInvested[1] = 0
    }

    this.cumulativeGain *= (percentMult - 1) * this.portfolio[1] + 1

    if (this.activeBot !== DefaultBotName && this.advancedBots[this.activeBot]) {
      this.stepWhenBotIsActive(yesterdaysData, todaysData);
    } else {
      this.stepWhenBotIsInactive(yesterdaysData, todaysData);
    }




if (this.statsData.stockHistory.length> 0 && this.statsData.stockHistory[this.statsData.stockHistory.length-1].date !==todaysData.date){
this.statsData.stockHistory.push({ date: todaysData.date, value: this.portfolio[0] - this.loanData.amt })

    this.statsData.portfolioHistory.push({ value: this.portfolio[0] - this.loanData.amt })
    this.statsData.riseFall.push({ date: todaysData.date, value: this.cumulativeGain });
    if (this.statsData.riseFall[this.statsData.stockHistory.length - 1]) {
      this.statsData.stockGain = (this.statsData.riseFall[this.statsData.riseFall.length - 1].value - 1) * 100;
      if (this.statsData.lastCompletedGain) {
        this.statsData.globalGain = this.statsData.lastCompletedGain + this.statsData.stockGain;
      } else {
        this.statsData.globalGain = this.statsData.stockGain;
      }
    }
    this.remindCounter--;
}




  }


  //HOT
  stepWhenBotIsActive(yesterdaysData: DataOhlc[number], todaysData: DataOhlc[number]) {
  }



  private queuedNotifications: string[][] = [];

  //HOT
  tradeWhenBotIsActive(fee: any = this.warnings.fee, lim: any = this.warnings.limit, data: any = { 'buyvssell': this.buyvssell, 'price': this.currPrice[0], 'longvsshort': this.longVsShort, 'amt': this.tradeVolume, 'bot': false }): string | void {

//this.longVsShort=data.lonvgsshort
    //console.log(this.longVsShort);
    //console.log(data);
/*
    if (!data.buyvssell && data.amt > this.cashVsInvested[1] && !this.longVsShort) {// ()()() shorts
      if (this.activeBot !== DefaultBotName) {
        this.simulator.stop()
      }
      this.generalPopup("Insufficient Funds", "Delete an open sell order to make trade");
      this.playAudio('error');
      return;
    }
*/
    var invested = this.portfolio[1] * this.portfolio[0];
    this.portfolio[0] = this.portfolio[0] - data.amt * this.fee;

    var cash = this.portfolio[0] - invested;


if (this.longVsShort !== data.longvsshort && this.cashVsInvested[1] > 1){
  this.stopSim()
if (this.longVsShort){
  return "To short, sell long position. (Holdings must be zero)";
}else{
  return "To buy long, cover short position. (Holdings are zero)";
}
}

    var shortAvail =
      (this.longShortShow &&
        this.cashVsInvested[1] < 0.01) ||
      !data.longvsshort;



    if (data.buyvssell) {
      if (!data.longvsshort) {
               // console.error('fires');
        this.portfolio[1] =
          (invested - data.amt * (this.fee + 1)) / (cash + invested);
        if (this.portfolio[1] == 0) {
          if (!(this.limitStops[0] && this.limitStops[0].short)){
          this.longVsShort = true;
          }
          //data.longvsshort = true;
        }
      } else {
        this.portfolio[1] = (invested + data.amt) / (cash + invested);
      }

      //this.portfolio[1] =this.portfolio[1] + data.amt / this.portfolio[0]; // - data.amt*this.fee;
    } else {
      if (shortAvail) {
        this.longVsShort = false;
       // data.longvsshort = false;   
        this.portfolio[1] = (invested + data.amt) / (cash + invested);
      } else {

        this.portfolio[1]  =
          (invested - data.amt * (this.fee + 1)) / (cash + invested);
      }
      //console.log(invested,data.amt,cash,invested)

      //this.portfolio[1] = this.portfolio[1] - data.amt / this.portfolio[0]; // - data.amt*this.fee;
    }



    if (this.activeBot == DefaultBotName && this.navCtrl.getActive().name == "HomePage") {
      if (data.buyvssell && this.longVsShort || !data.buyvssell && !this.longVsShort) {
        this.queuedNotifications.push(['success', '$' + this.nFormat(Math.floor(data.amt)), (data.longvsshort ? 'Buy' : 'Short') + ' Successful'])
      } else {
        this.queuedNotifications.push(['success', '$' + this.nFormat(Math.floor(data.amt)), (data.longvsshort ? 'Sell' : 'Cover') + ' Successful', 'red'])
      }
    }

    this.statsData.stockTrades++
    this.statsData.totalTrades++

    this.config.candlestick.trades.push({
      date: this.currentDate,
      short:!data.longvsshort,
      type: data.buyvssell ? "buy" : "sell",
      price: data.price,
      quantity: data.amt,
    });

    this.statsData.totalFeeAmt += data.amt * this.fee;

    this.infusedCash -= (data.amt * this.fee);
    this.statsData.totalFeeAmt += Math.floor(data.amt * this.fee * 100) / 100;
    this.statsData.stockFeeAmt += Math.floor(data.amt * this.fee * 100) / 100;


    var oldSkin = this.investedSkin;
    this.investedSkin = Math.floor(this.portfolio[1] * 100);
    this.portfolio[2] = oldSkin > this.investedSkin;
    this.portfolio[3] = oldSkin < this.investedSkin;

    //TODO do something about this:
    // if ((this.portfolio[1] <= 0.01 || this.portfolio[1] >= .99) && data.longvsshort) {
    //   //()()() short
    //   setTimeout(() => {
    //     this.chkbox = !this.chkbox;
    //     this.toggleBuyVSell();
    //   }, 30)
    // }

  }





  //HOT
  tradeWhenBotIsInactive(fee: any = this.warnings.fee, lim: any = this.warnings.limit, data: any = { 'buyvssell': this.buyvssell, 'price': this.currPrice[0], 'longvsshort': this.longVsShort, 'amt': this.tradeVolume, 'bot': false }) {
    if (data.price !== this.limitStop) {
      if (this.limitStops.length > 3) {
        this.generalPopup("Error", "Cannot have more than 4 max limit/stop orders");
        this.playSFX('error');
        return;
      }

      //QUESTION do we pause sim for this prompt???
      if (!lim || this.tutorialState[0] == 103) {
        this.limitPrompt();
        return;
      }

      //[buyvssell,price,short,amt]
      var limit: any = data.price > this.limitStop;
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
      return;
    } else {
      if (!fee) {
        this.transactionFee();
        return;
      } else {
        if (this.tutorialState[0] == 151) { this.tutorialState[0] = 152 }
        if (this.tutorialState[0] == 157) { this.endTutorial() }
      }
    }

  }


  //HOT
  stepWhenBotIsInactive(yesterdaysData: DataOhlc[number], todaysData: DataOhlc[number]) {

    this.limitStop = this.currPrice[0];

    //code block on limit stop orders from pushData
    for (let i = 0; i < this.limitStops.length; i++) {
      var order = this.limitStops[i]
      if (!order.short) {
        // long trades
        if (order.buyvssell && order.price >= todaysData.low) {
          // put in long buy @ order.price
          //console.log(today.low);
          console.error('long buy @ '+order.price)
          this.limitTrade(order, todaysData.close);
          this.limitStops.splice(i, 1);
          break;
        } else if (!order.buysell && order.limit && order.price <= todaysData.high) {
          // put in long limit sell @ order.price
          console.error('long limit sell @ ' + order.price, todaysData.high)
          this.limitTrade(order, todaysData.close);
          this.limitStops.splice(i, 1);
          break;
        } else if (!order.buysell && !order.limit && order.price >= todaysData.low) {
          // put in long stop sell @ order.price
           console.error('long stop sell @ ' + order.price)
          this.limitTrade(order, todaysData.close);
          this.limitStops.splice(i, 1);
          break;
        }
      } else {
        if (!order.buyvssell && order.limit && order.price <= todaysData.high) {
           console.error('short limit buy @ order.price');
          this.limitTrade(order, todaysData.close);
          this.limitStops.splice(i, 1);
          break;
        } else if (order.buyvssell && order.price >= todaysData.low) {
           console.error('short limit liq @ order.price');
          this.limitTrade(order, todaysData.close);
          this.limitStops.splice(i, 1);
          break;
        } else if (!order.buyvssell && !order.limit && order.price <= todaysData.high) {
           console.error('short limit stop @ order.price');
          this.limitTrade(order, todaysData.close);
          this.limitStops.splice(i, 1);
          break;
        }
      }
    }
  }

  breakInDemoMode() {
    if (this.statsData.daysSimmed > 0 && this.statsData.daysSimmed % 1350 ==0) {
      this.statsData.daysSimmed++
      this.simulator.stop();
      this.stopSim();
      this.demoPopup();
    }
  }

newsletterBreak(){
     if (this.statsData.daysSimmed > 0 && this.statsData.daysSimmed % 2000 == 0 && !this.opportunities.email.completed && !this.opportunities.email.suppress) {
       this.statsData.daysSimmed++
       this.simulator.stop();
       this.stopSim();
      this.newsletterPopup();
    }
}

  break() {
/*
if (this.manual == 1){
  //limitStop/currPrice[0]-1)*100
}
*/
    this.simsPerSecond = this.simulator.realtimeSpeed;
this.statsData.daysSimmed++
    if (!this.simulator.simWarmedUp) {
      this.simSpeedDelay = false;
    } else {
      if (!this.simSpeedDelay) {
        this.simSpeedDelay = true;
      }
    }
    // console.log(`target speed  = ${this.simulator.targetSpeed}, realtimeSpeed  =${this.simulator.realtimeSpeed}`);

    // this.setDimensions();
    let yesterdaysData: DataOhlc[number] = this.currentData[this.dateKeyIndex - 1];
    let todaysData: DataOhlc[number] = this.currentData[this.dateKeyIndex];

    //TODO do we need to call setTradeVol every break?
    this.setTradeVol();
    //is this needed every break?
    this.calcMovingGain();

    //TODO ask angular to update stuff...

    if (this.navCtrl.getActive().name == "BaklavaPage") {
      this.events.publish("baklavaGains", this.cumulativeGain, this.currentData[this.dateKeyIndex].date, this.currentTicker, this.cashVsInvested, this.currPrice, this.limDeduction, this.longVsShort, this.portfolio, this.YrsElapsed);
    }

//------------------Move Every Tick?-------------------


//------------------------------------

    this.currPrice = [todaysData.close, Math.floor((todaysData.close / yesterdaysData.close - 1) * 10000) / 100, yesterdaysData.close];
    this.limitStop = this.currPrice[0];

    this.showQueuedNotifications();
    this.config.data = this.engineData.currentData.slice(0, this.engineData.dateKeyIndex + 1);
    let adjClose = [];
    for (let i = 0; i < this.config.data.length; i++) {
      adjClose.push({
        date: this.config.data[i].date,
        value: marketMovement[this.config.data[i].rawDate]
      });
    }
    this.config.portfolio.data = {
      portfolio: this.statsData.riseFall,
      close: this.config.data,
      adjClose
    };

    this.CDDetectChangesCycle();
  }

  majorBreak() {
    this._saveState();
  }

  //HOT
  playAudio(name: string, volume: number = 1, loop: boolean = false) {

    if (this.debug || this.muteSFX) {
      return;
    }

    if (window["electron"]) {
      window["electron"].playAudio(name, volume, loop, this.simulator.realtimeSpeed);
    }else{
        this.playSFXlocal(name,volume,loop) 
    }
  }

  onSimStop() {
    if (this.mode !== 'sandbox') {
      this.idleData.stamp = new Date().getTime();
    }
    this.showQueuedNotifications();
    this.setSandboxDates();
    this._saveState();
    this.CDRef.reattach();
    //stock done notifications, etc.
  }

  onSimEnd() {
    if (this.warnings.autoContinue) {
      this.notification(['success', this.currentTicker[0], 'Gains of ' + Math.floor((this.statsData.riseFall[this.statsData.riseFall.length - 1].value - 1) * 100) / 100 + "%"]);
    }
    this.stockDone();
    this.YrsElapsed = this.calcYearsElapsed()
  }


  //HOT
  showQueuedNotifications() {
    while (this.queuedNotifications.length > 0) {
      let notification = this.queuedNotifications.shift();
      this.notification(notification);
    }
  }

  //HOT
  refreshEngineData() {
    if (!this.engineData) {
      this.engineData = {
        currentData: this.currentData,
        dateKeyIndex: this.dateKeyIndex,
        cash: this.portfolio[0] * (1 - this.portfolio[1]),
        invested: this.portfolio[0] * this.portfolio[1],
        chartsProvider: this.chartsProvider,
        netWorth: this.totalPortfolio,
        longVsShort: this.longVsShort,
        metadata: {
          name: this.currentTicker[0],
          sector: this.currentTicker[1],
          exchange: this.currentTicker[this.currentTicker.length - 2],
          ticker: this.currentTicker[this.currentTicker.length - 1]
        },
        price: (this.currentData[this.dateKeyIndex + 1]) ? (this.currentData[this.dateKeyIndex + 1].close) : (0),
        trade: this.simulationTrade.bind(this),
        halt: () => {
          this.stateMachine.reset();
        },
        loanData: this.loanData
      }
    } else {

      this.engineData.currentData = this.currentData;
      this.engineData.dateKeyIndex = this.dateKeyIndex;
      this.engineData.cash = this.portfolio[0] * (1 - this.portfolio[1]);
      this.engineData.invested = this.portfolio[0] * this.portfolio[1];
      this.engineData.chartsProvider = this.chartsProvider;
      this.engineData.netWorth = this.totalPortfolio;
      this.engineData.longVsShort = this.longVsShort;
      this.engineData.metadata = {
        name: this.currentTicker[0],
        sector: this.currentTicker[1],
        exchange: this.currentTicker[this.currentTicker.length - 2],
        ticker: this.currentTicker[this.currentTicker.length - 1]
      };
      this.engineData.price = this.currentData[this.dateKeyIndex].close;
      this.engineData.trade = this.simulationTrade.bind(this);
      this.engineData.halt = () => {
        this.stateMachine.reset();
      };
      this.engineData.loanData = this.loanData;
    }
  }

  //HOT
  simulationTrade(tradeObj) {
    if (!this.activeBot || this.activeBot == DefaultBotName) {
      return this.tradeWhenBotIsInactive(true, true, tradeObj);
    }
    //TODO bifurcate this
    return this.tradeWhenBotIsActive(true, true, tradeObj);
  }

}
