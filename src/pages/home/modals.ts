

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
//import { rawData } from "./../../constants";
import {
  AlertController,
  NavParams,Content,
   ModalController
} from "ionic-angular";

import { Events } from "ionic-angular";

import { ViewController } from "ionic-angular";

import { Chart } from "chart.js";

import {indicatorData,emailDomainBlacklist
} from "./../../constants";

import { DragulaService } from "ng2-dragula";
import { LogObj, StateMachine } from "../../providers/state-machine/state-machine";
import * as cloneDeep from "lodash.clonedeep";


//declare const Huebee: any;

@Component({
  selector: "upgradesModal",
  templateUrl: "upgrades.html",
})
export class upgradesModal {
  @ViewChild('content') content: Content;
  upgrades: any;
  portfolio: any;
  avail: any;
  warnings: any;
  purchased:any;
  max:any;
  progress:any
  tutState:any=-1;
  testing:any=false;
  earned:any;
  cashVsInvested:any
  bulk:any=[0,0,[]];
  bulkbuy:any=false;
  upgradePersist:any

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.upgrades = params.get("upgrades");
    this.earned = params.get("earned");
    this.portfolio = params.get("portfolio");
    this.avail = params.get("avail");
    this.tutState=params.get("tutState");
    this.warnings = params.get("warnings");
    this.purchased=params.get("purchasedUpgrades");
    this.max=params.get("max");
    this.progress=(this.purchased.length-2)/(params.get("len")-2)*100
    this.cashVsInvested=params.get("cashVsInvested")
    this.bulkbuy=params.get("bulkbuy")
    this.upgradePersist=params.get("upgradePersist")
//console.log(this.bulkbuy);
var numNew=0;

//console.error(this.cashVsInvested);

this.upgrades.forEach((upgrade)=>{
  //console.log(this.bulk[1],upgrade.cost);
    if ((this.bulk[1]+upgrade.cost)/this.cashVsInvested[0]<=.5){
      this.bulk[1]+=upgrade.cost;
      this.bulk[0]++
      this.bulk[2].push(upgrade.id)
    }
})

//console.error(this.bulk);

//console.log(this.upgrades);
/**/
this.upgrades.forEach((upgrade)=>{
  //console.log(upgrade);
    if ((this.cashVsInvested[0]+this.cashVsInvested[1])>upgrade.cost && upgrade.cost>this.max){
      numNew++
    }
})
//console.error(numNew);
if (numNew<5 && numNew>0){
    this.scrollBottom();
    }

  }

/*
ngAfterContentInit(){
  console.log('fires');
    this.testing=true;
}
*/

buyBulk(){









this.events.publish("upgrade", this.bulk[2], this.bulk[1], null);
    // dismissModal
this.viewCtrl.dismiss();

}

upgradeConfirm(upgrade){

  var message = "<b>$"+this.nFormat(upgrade.cost)+"</b> will be removed from your account.";

if (!this.earned.includes(upgrade.id)){
  if (upgrade.reward){
    message+=" This will also unlock an opportunity to earn <b>$"+this.nFormat(upgrade.reward)+"</b> by taking a quiz on the subject.";
  }else{
    message+=" Some upgrades will unlock an opportunity to earn money by taking a quiz, but this is <b><u>not</u></b> one of them.";
  }
  }else{
    message+=" You have already earned the <b>$"+this.nFormat(upgrade.reward)+"</b> reward for this quiz and it has been added to your balance.";
  }

    let alert = this.alertCtrl.create({
      title: "Are You Sure?",
      message: message,
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
            if (upgrade.reward){
              this.warnings.upgradeConfirmRew = data.length > 0;
              this.buy(upgrade, false, true);
            }else{
              this.warnings.upgradeConfirmNoRew = data.length > 0;
              this.buy(upgrade, false, false, true);
            }
          },
        },
      ],
    });
    alert.present();
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
    scrollBottom(time: number = 2000) {
      
      setTimeout(() => {
        if(this.content&&this.content.scrollToBottom){
    this.content.scrollToBottom(time);//300ms animation speed
        }
      }, 100);
  }




buy(upgrade, override50: any = false, overrideRew:any=false, ovverrideNoRew:any=false) {
    //this.buyReal(upgrade)

var requisites={'limitstop':'price','multipleMA':'customMA','customMA':'ema','ema':'sma','simpleBots2':'simpleBots','simpleBots3':'simpleBots2','gains':'brushing','vizBots4':'vizBots3','vizBots3':'vizBots2','vizBots2':'vizBots','vizBots':'simpleBots','speedup*':'sim'}

if (requisites[upgrade.id.replace(/\d_.*/g,'*')] && !this.purchased.includes(requisites[upgrade.id.replace(/\d_.*/g,'*')])){

var reqUpgrade=this.upgrades.find(e=>e.id==requisites[upgrade.id.replace(/\d_.*/g,'*')])


  let alert = this.alertCtrl.create({
        title: "Previous Upgrade Required",
        message:
          'This upgrade requires you to have purchased "'+reqUpgrade.name+'".',
        buttons: [
        
          {
            text: "Ok",
            handler: (data) => {

            },
          },
        ],
      });
alert.present();
  return;
}



if (!this.warnings.upgradeConfirmRew && upgrade.reward && !overrideRew && upgrade.cost>0){
this.upgradeConfirm(upgrade);
}else if (!this.warnings.upgradeConfirmNoRew && !upgrade.reward && !ovverrideNoRew && upgrade.cost>0){
this.upgradeConfirm(upgrade);
}else if (
      (this.cashVsInvested[0]+this.cashVsInvested[1]) / 2 <= upgrade.cost &&
      !this.warnings.fiftyper &&
      !override50 && upgrade.cost>0
    ) {
      let alert = this.alertCtrl.create({
        title:
          "This will cost " +
          Math.floor((upgrade.cost / this.portfolio[0]) * 100) +
          "% of your wealth",
        message:
          "Capital is essential to momentum in your earnings. We recommend waiting to upgrade, but you are welcome to proceed.",
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
            handler: () => {},
          },
          {
            text: "Ok",
            handler: (data) => {
              this.warnings.fiftyper = data.length > 0;
              this.buy(upgrade, true, overrideRew, ovverrideNoRew);
              //overrideRew:any=false, ovverrideNoRew:any=false
            },
          },
        ],
      });
      alert.present();
    } else if (
      this.cashVsInvested[0] < upgrade.cost &&
      !this.warnings.sellupgrade
    ) {
      let alert = this.alertCtrl.create({
        title: "Not Enough Cash",
        message:
          "You can only afford this upgrade if you sell some of the stake in your investment. Do you wish to proceed? This will not incur a transaction fee.",
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
            handler: () => {},
          },
          {
            text: "Ok",
            handler: (data) => {
              this.warnings.sellupgrade = data.length > 0;
              this.buyReal(upgrade);
            },
          },
        ],
      });
      alert.present();
    } else {
      this.buyReal(upgrade);
    }
  }

  buyReal(upgrade) {
    // if you have the money?
    this.events.publish("upgrade", upgrade.id, upgrade.cost, this.warnings);
    // dismissModal
    this.viewCtrl.dismiss();
  }
}

@Component({
  selector: "disclaimerModal",
  templateUrl: "disclaimer.html",
})
export class disclaimerModal {
agree:any=false
mandate:any=false;
  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.mandate=params.get("agree");
  }

  confirm() {
    if (this.agree || !this.mandate){
this.viewCtrl.dismiss();
}
  }

}

@Component({
  selector: "loanModal",
  templateUrl: "loan.html",
})
export class loanModal {
  loanData:any;
  loanProposed:any=0;
  mystery:any;
  type:any;
  tutState:any=-1;
  marginInfo:any;
  leverage:any;
  netWorth:any;


  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.loanData=params.get("data");
    this.mystery=params.get("mystery");
    this.type=params.get("type");
    this.tutState=params.get("tutState");
    this.marginInfo=params.get("margin");
    this.netWorth=params.get("networth");

    if (this.loanData.amt==0){
      this.loanProposed=Math.floor(this.loanData.max/2);
    }else{
      this.loanProposed=this.loanData.amt
    }
    this.calcLeverage(this.loanProposed);
  }

  calcLeverage(loan){
this.leverage=loan/this.netWorth
  }

  confirm() {
this.events.publish("loan", this.loanProposed);
this.viewCtrl.dismiss();
  }

}

@Component({
  selector: "idleModal",
  templateUrl: "idle.html",
})
export class idleModal {
  data:any;
  currentTime:any;
  elapsed:any;
  maxSim:any
  maxReal:any
  totalInterval:any
  skipDays:any
  hrs:any

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.data=params.get("data");
    this.maxSim=params.get("maxSim");
    this.maxReal=parseFloat(String(params.get("realSim")).replace('k','000'));
    this.elapsed=new Date().getTime() - this.data.stamp


this.hrs=Math.floor(this.elapsed/3600000);

this.totalInterval=Math.floor(Math.pow(this.elapsed/1000*this.maxReal,1/2));
//console.log(this.totalInterval)
    this.skipDays=this.totalInterval;


  }

  confirm() {
this.events.publish("idle", this.skipDays);
this.viewCtrl.dismiss();
  }

  close(){
    this.viewCtrl.dismiss();
  }

}

@Component({
  selector: "customDataModal",
  templateUrl: "customData.html",
})
export class customDataModal {

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {

  }

  handlePath(e){
    console.log(e);
  }

}

@Component({
  selector: "histModal",
  templateUrl: "hist.html",
})
export class histModal {
    trades:any
    obfuscateYear:any

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public stateMachine: StateMachine
  ) {
this.trades=params.get("trades")
console.error(this.trades);
this.obfuscateYear=params.get("obfuscateYear")

    viewCtrl.onDidDismiss(()=>{})


  }


}

@Component({
  selector: "logsModal",
  templateUrl: "logs.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class logsModal implements OnInit {
  log: any
  tutState: any
  filter: any = "all";
  clear: any = false;
  filteredLog: any = [];
  read: any = 0;
  supressRead: any = false;
  name: any
  year: any = -1

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public stateMachine: StateMachine,
    public CDRef: ChangeDetectorRef
  ) {

    this.log = params.get("log")
    this.year = params.get("year");
    var name = params.get("name")
    if (name == "$SIMPLEBOT") { name = "Simple Bot" }
    this.name = "Simple Bot";
    if (params.get("read")) {
      this.read = params.get("read");
    }


    //console.error(this.log)
    //console.error(this.log)
    this.tutState = params.get("tutState")

    window["cd1"] = this.CDRef;



    viewCtrl.onDidDismiss(() => {
      if (this.supressRead) { return }
      if (this.tutState == 212) {
        this.tutState = -1
        this.events.publish("tutState", 213);
      }

      this.events.publish("readLog", { name: params.get("name"), clear: this.clear });

    })


  }

  ngOnInit(): void {
    this.filterLog(this.log.slice(-16));
  }

  private checked: boolean = false;
  ngAfterViewChecked() {
    if (this.checked) {
      return;
    }
    this.checked = true;
    window["setT"](() => {
      this.showAllLogs();
    }, 400);
  }

  async showAllLogs() {
    this.filterLog(this.log)
    this.CDRef.detectChanges();
  }

  openStackTrace(log: LogObj) {
    this.stateMachine.showTrace(log);
    this.supressRead = true;
    this.viewCtrl.dismiss();
  }




  clearLog() {
    this.clear = true;
    this.log = [];
    this.filterLog(this.log)
  }

  filterLog(logData: any) {
    if (this.filter == "all") { this.filteredLog = cloneDeep(logData).reverse() } else {
      this.filteredLog = cloneDeep(logData).reverse().filter((log) => {
        return log.type == parseInt(this.filter)
      })
    }

    var dedup = [];
    var counter = 0;

    this.filteredLog.forEach((obj) => {
      if (dedup.length == 0 || dedup[dedup.length - 1].message !== obj.message) {
        dedup.push(obj)
      } else {
        if (dedup[dedup.length - 1].counter) {
          dedup[dedup.length - 1].counter++
        } else {
          dedup[dedup.length - 1].counter = 1
        }
      }
    })

    this.filteredLog = dedup

  }

  deleteLogIndex(i) {
    console.error(i)
  }

}

@Component({
  selector: "quizModal",
  templateUrl: "quiz.html",
})
export class quizModal {
  data:any
  index:any=0;
  shuffledQuiz:any=[];
  state:any=[0,0,0,0,0,0];
  correct:any=true;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.data=params.get("data");

this.shuffleQuiz();
  }

shuffleQuiz(){
this.shuffledQuiz=[];
  this.data.data.quiz.sort((a, b)=> { return 0.5-Math.random() }).forEach((question)=>{
var quests=[];
question.forEach((q,i)=>{
  if (i>0){
  quests.push({question:q,correct:i==1})
}
})
//this.shuffledQuiz.push(quests);
this.shuffledQuiz.push(quests.sort((a, b)=> { return 0.5-Math.random() }))


})
}  

answerQuestion(qIndx,correct){

for (let i=0;i<this.shuffledQuiz[this.index].length;i++){

if (i!==qIndx){
  this.state[i]=1
}else if (correct){
this.state[i]=2
}else{
this.state[i]=3
}

}

this.correct=correct;

}

next(){
this.state=[0,0,0,0,0,0];

if (this.correct){
  if (this.index==this.data.data.quiz.length-1){
    this.events.publish("learned", this.data.name);
    this.viewCtrl.dismiss();
  }else{
   this.index++ 
  }
  
}else{
this.shuffleQuiz();
  this.correct=true;
  this.index=0;

}

}


}


@Component({
  selector: "podcastsModal",
  templateUrl: "podcasts.html",
})
export class podcastsModal {
podcasts:any;
iheart:any=""
cust:any=false;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
this.podcasts=params.get("podcasts")
this.cust=params.get("custom")
  }

ionViewWillLeave(){

}

custom(){
// sanitize iheart URL 
var url=this.iheart;

url=url.replace(/^.*?\.com\//g,'')+"/";
  if (url[0] !== "/") { url = "/" + url }
  var mat = url.match(/^\/.*?\/.*?\//g)
if (mat){
  url=mat[0]
}else{
url="podcast/"+url.replace("//","/")
}


this.events.publish("openPip", "https://www.iheart.com"+url+"?embed=true");
this.viewCtrl.dismiss();
}

open(podcast){
this.events.publish("openPip", podcast.url);
this.viewCtrl.dismiss();
}


}

@Component({
  selector: "missionsModal",
  templateUrl: "missions.html",
})
export class missionsModal {

data:any

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
this.data=params.get("data")
  }

ionViewWillLeave(){

}


}

@Component({
  selector: "tutorialModal",
  templateUrl: "tutorial.html",
})
export class tutorialModal {
demo:any=false;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.demo=params.get("demo");
    events.subscribe('key',(e)=>{
      if (e.key=='Enter' || e.key==' ' || e.key=='Backspace' || e.key=='Delete'){
        this.open('upgrades');
      }
    })
  }

ionViewWillLeave(){
this.events.unsubscribe('key');
}


open(event){
this.events.publish('tutState',1);
this.viewCtrl.dismiss();
}

dismiss(tut){
  if (tut){
    this.events.publish("slideshow", "tutorial");
  }
  this.viewCtrl.dismiss();
}

guide(){
   //this.events.publish("guide");
   this.events.publish("slideshow", "tutorial");
}

slideshow(){
   //this.events.publish("guide");
   this.events.publish("slideshow", "tutorial");
   this.viewCtrl.dismiss();
}



}

@Component({
  selector: "statsModal",
  templateUrl: "stats.html",
})
export class statsModal {
  @ViewChild("testCanvas") testCanvas;

  stats:any
  AllTime:any=0;
  chartHeight:any=0;
  testCanvasChart:any;
  marginInfo:any;
  tutState:any=-1
  warnThresh:any;
  marginWarn:any
  marginData:any
  perks:any
  asset:any
  yearReveal:any
  precision:any=false
  bank:any

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
this.stats=params.get("data");
this.marginInfo=params.get("margin");
this.tutState=params.get("tutState");
this.perks=params.get("perks");
this.asset=params.get("asset");
this.yearReveal=params.get("yearReveal")
this.bank=params.get("bank")
this.chartHeight=Math.floor((window.innerWidth/window.innerHeight)*100);
this.warnThresh=String(this.marginInfo[4]);
this.marginWarn=this.marginInfo[5];
//console.error(this.marginInfo);


events.subscribe('resize',()=>{
if (this.AllTime=='1'){
  this.AllTime='0'
}
})


if (this.stats.finished>0 && this.stats.stockTrades==0){this.AllTime=1}
//console.log(this.tutState)
//Math.abs(this.totalPortfolio)>this.loanData.amt*this.marginCallPercent
//*(1-this.marginWarningThreshold)

//this.loanData.amt*this.marginCallPercent
if (this.marginInfo[0] && this.marginInfo[2]<0 || this.tutState==51){

this.marginData=[Math.abs(this.marginInfo[2])/this.marginInfo[3].amt*100,this.marginInfo[6]*100,this.marginInfo[3].amt*this.marginInfo[6]-Math.abs(this.marginInfo[2])]
this.AllTime=-1;
}
//console.error(this.AllTime);
this.drawChart(this.AllTime)

    viewCtrl.onDidDismiss(()=>{

      this.events.publish("updateMarginWarnings",[parseFloat(this.warnThresh),this.marginWarn]);

      if (this.tutState==14){
        this.tutState=-1
        this.events.publish("tutState",15);
      }

       if (this.tutState==54){
        this.tutState=-1
        this.events.publish("tutState",55);
      }
        if (this.tutState==31){
        this.tutState=-1
        this.events.publish("tutState",32);
      }

    })

  }

bankClck(){
if (this.tutState==31){
this.viewCtrl.dismiss()
}

}
  fbook(){

  }

  twit(){
    var link="https://twitter.com/intent/tweet?url=https://www.cinqmarsmedia.com/tradebots/&text="

    var text="I currently have $"+this.nFormat(this.stats.netWorth)+" on my current playthrough of #TradeBots averaging gains of "+Math.floor(this.stats.globalGain*100)/100+"%"

link=link+encodeURIComponent(text)
this.openLink(link)



  }

 openLink(link, self: any = false) {
   this.events.publish('sfx','generic')
    window.open(link, self ? "_self" : "_blank", "frame=true,nodeIntegration=no");
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

checkboxChng(){
this.tutClick(51);
}

tutClick(n){
    if (this.tutState==n){
this.tutState=n+1;
  }
}


  openExt(type){
if (type=='learn'){
this.events.publish("openModal", "learn");
}else if (type=='extras'){
this.events.publish("openModal", "extras");
}
   this.viewCtrl.dismiss();
  }

  genColor(){
 return String(Math.floor(Math.random()*130)+100)+","+String(Math.floor(Math.random()*130)+100)+","+String(Math.floor(Math.random()*130)+100);
}


  drawChart(allTime){
//console.error(allTime,'f');
this.AllTime=parseInt(allTime);

if (this.AllTime==-1){
  return;
}
//console.error(this.AllTime,allTime);

var timeFormat = 'YYYY-MM-DD';

var color1 = this.genColor()
    var color2 = this.genColor()
var chart={
    type: 'line',
    data: {
        datasets: [{
            data: this.stats[allTime==1?'portfolioHistory':'stockHistory'].map((d,i) => ({
        x: allTime==1?(i+1):new Date(d.date).toISOString().split('T')[0],
        y: d.value
      }))
        }]
    },
    options: {

            responsive: true,
            hover:false,
            maintainAspectRatio:false,
            legend: {
            display: false
         },
            elements: {
                    point:{
                        radius: 0
                    }
                },
            title:      {
                display: false,
                text:    "Chart.js Time Scale"
            },

            scales:     {
                xAxes: [{
                    type: "time",
                    time:       {
                        format: timeFormat,
                        tooltipFormat: 'll'
                    },
                     ticks: {
                      display: allTime==0 && this.yearReveal
                    },
                    scaleLabel: {
                        display:     false,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{

                  ticks: {
                     callback: (value, index, values)=> {

                        return  "$"+this.nFormat(value);
                    }
                   
                  },
                    scaleLabel: {
                        display:     false,
                        labelString: 'value'
                    }
                }]
            }
        }
}
// @ts-ignore
chart.data.datasets[0].backgroundColor="rgba("+color1+",.1)"
// @ts-ignore
chart.data.datasets[0].borderColor="rgba("+color1+",.8)"


setTimeout(()=>{
//console.error("bug where I need to re-init viewChild or something....")
this.testCanvasChart = new Chart(this.testCanvas.nativeElement, chart);
//this.testCanvasChart.update();
},0)

  }



  leaderboard(){
    if (!this.stats.leaderUnlock){return}
    this.events.publish("popup", "Global Leaderboards", "We're hard at work adding this to the game and it will be available soon in a free update along with many other features and bugfixes. Thank you for your patience and understanding!");
  }
}

@Component({
  selector: "extrasModal",
  templateUrl: "extras.html",
})

export class extrasModal {

  data:any;
  rewards:any;
  extras:any=[];
  redeemed:any=[];
  doneArr:any=[];
  detail:any=false;
  videoTimeout:any;
  limAds:any=false


  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {

this.data=params.get("data")
this.rewards=params.get("reward")
this.limAds=params.get("limAds")

var id=params.get("id")

if (id){
  var det=this.data[id]
  det.id=id;
  this.detail=det;
}

this.genExtras()

    viewCtrl.onDidDismiss(()=>{
if (this.videoTimeout){
  clearTimeout(this.videoTimeout);
}
    })


  }

bck(){


if (this.detail && this.detail.id[0]=="_" && this.videoTimeout){
  clearTimeout(this.videoTimeout);
}

  this.detail=false;
}
  oppClick(extra){

if (extra.name=='Newsletter'){
this.newsletter();
  return
}

if (extra.id[0]=='_'){
this.videoTimeout=setTimeout(()=>{
  this.events.publish("extraCompleted", extra.id);
},extra.time*60000)
  
}

    this.detail=extra
  }

newsletter(){
  let alert = this.alertCtrl.create({
      cssClass: 'earlyAccessAlert',
      title: "Sign-Up for Our Newsletter",
      message: "We email about once every 3 months. Earn $"+this.data['email'].reward+" in-game. Cancel Anytime",
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
     //upload email

if (!this.limAds){
  this.events.publish("extraCompleted", 'email');
}

this.viewCtrl.dismiss();
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

  generalPopup(title, txt) {
    let alert = this.alertCtrl.create({
      title: title,
      message:txt,
      buttons: [

        {
          text: "Ok",
          handler: (data) => { },
        },
      ],
    });
    alert.present();
  }

  genExtras(){
    Object.keys(this.data).forEach((key)=>{
      if (!this.data[key].completed){
        var obj=this.data[key]
        obj.key=key;
        obj.id=key;
        if (key[0]=='_'){
    this.extras.unshift(obj)
        }else{
      this.extras.push(obj)
        }
      }else{
        var obj=this.data[key]
        obj.key=key;
        this.redeemed.push(obj)
        this.doneArr.push(key)
      }
    })

  }

    openLink(link){
    window.open(link,link.includes('http')?"_blank":"_self", "frame=true,nodeIntegration=no");
  }

completed(extra){
if (!window.navigator.onLine) {
              this.generalPopup(
                "No Internet",
                "Requires an Internet Connection"
              );
              return false;
            }

  this.openLink(extra.steam);
  if (!extra.completed && !this.limAds){
this.events.publish("extraCompleted", extra.key);
this.viewCtrl.dismiss();
}
}

}

@Component({
  selector: "helpModal",
  templateUrl: "help.html",
})

export class helpModal {

  data:any;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {


  }

  openLink(link){
    window.open(link,"_blank", "frame=true,nodeIntegration=no");
      this.viewCtrl.dismiss();
  }
}


@Component({
  selector: "indicatorModal",
  templateUrl: "indicator.html",
})

export class indicatorModal {

  indicator:any;
  data:any;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {

this.data=params.get("indiData")
this.indicator=params.get("indicator");
this.data.params=Object.keys(this.data.vals)
  }
/**/
  onChange(val,param) {

if (this.indicator=='stochastic' && param=='period'){
  param='periodD';
}
    this.events.publish("updateIndicators", this.indicator,param,val);
  }

  openLink(link){
    window.open(link,"_blank", "frame=true,nodeIntegration=no");
  }
  
setDefaults(){
Object.keys(indicatorData[this.indicator].vals).forEach((prm)=>{
this.data.vals[prm]=indicatorData[this.indicator].vals[prm];
})

  this.viewCtrl.dismiss();
}



}

@Component({
  selector: "learnModal",
  templateUrl: "learn.html",
})
export class learnModal {
  learn: any;
  rewatch: any;
  detail:any=false;
  passed:any=true;
  now:any=Date.now();
  availEarn:any=0;
  quizModalCtrl:any
  old:any=false;
  numLearn:any;
  pipUnlocked:any=false;
  tutState:any=-1;
  pipNew:any=false;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
  ) {
    this.learn = params.get("learn");
    this.rewatch = params.get("rewatch");
    this.availEarn = params.get("availEarn");
    this.numLearn = params.get("numLearn");
    this.pipUnlocked = params.get("pipUnlocked")
    this.tutState=params.get("tutState")
    this.pipNew=params.get("pipNew")

 

this.learn.sort((a,b)=>{
if (a.reward<b.reward){
  return -1
}
if (a.reward>b.reward){
  return 1
}
return 0

})





    viewCtrl.onDidDismiss(()=>{
      if (this.tutState==5.5){
        this.tutState=-1
        this.events.publish("tutState",6);
      }
    })
  }

  pip(id){
this.events.publish("openPip", id);
this.viewCtrl.dismiss();
  }

  newQuiz(detail){
     this.quizModalCtrl= this.modalCtrl.create(quizModal, {
      data: detail,
    }, { cssClass: 'quizModal' });
    this.quizModalCtrl.present();
  }

showQuestion(subject,index){

  let alert = this.alertCtrl.create({
    enableBackdropDismiss:true,cssClass:'questionAlert'});
    alert.setTitle('Question #'+(index+1));
    alert.setMessage(subject.data.quiz[index][0]);

let quests=[];

//[{question:subject.quiz[index][1],correct:true},{question:subject.quiz[index][2],correct:false},{question:subject.quiz[index][3],correct:false},{question:subject.quiz[index][4],correct:false},{question:subject.quiz[index][5],correct:false}]

subject.data.quiz[index].forEach((q,i)=>{

if (i>0){
  quests.push({question:q,correct:i==1})
}

})

quests=quests.sort((a, b)=> { return 0.5-Math.random() })

quests.forEach((q)=>{

      alert.addInput({
      type: 'radio',
      label: q.question,
      value: String(q.correct)
    });

})

    alert.addButton({
      text: 'Answer',
      handler: data => {
        //console.log(data+'f');
        if (typeof data == 'undefined'){
          return false;
        }else{
          this.passed=this.passed && (data=='true');
console.log(this.passed);
          if (subject.data.quiz.length==index+1){
this.result(subject,this.passed);
          }else{
this.showQuestion(subject,index+1)
}
        }
        
      }
    });
    alert.present();

}

openDetail(earn,old:any=false){

  if(this.tutState==5){this.tutState=5.5}
    
  this.detail=earn;
  this.old=old;
  //this.now=Date.now()
}

result(subject,passed){

this.passed=true;

var title=passed?"Great Job!":"Try Again";
var message=passed?("All answers correct! $"+subject.reward+" earned"):"Quiz can be taken again in 3 minutes";

if (passed){
  this.events.publish("learned", subject.name);
}else{
 // this.events.publish("failed", subject.name);
  var stamp=Date.now();
  this.learn.find((ele)=>{
if (ele.name==subject.name){
  ele.failed=stamp;
}
this.detail.failed=stamp;
  })
  //this.failedLearn.push({name:name,timestamp:stamp})
}

let alert = this.alertCtrl.create({
        title: title,
        message:message,
        buttons: [     
          {
            text: "Ok",
            handler: (data) => {
              if (passed){
             this.viewCtrl.dismiss();   
              }
            },
          },
        ],
      });
      alert.present();

}

  openLink(link){
    window.open(link,"_blank", "frame=true,nodeIntegration=no");
  }

openLinks(links){

links=links.split(',');
console.log(links);
links.forEach((href,i)=>{
  console.log(href);
  setTimeout(()=>{
  window.open(href,String(i+1))
  },0)
})
}




}

@Component({
  selector: "simpleBotModal",
  templateUrl: "simpleBot.html",
})
export class simpleBotModal {
  rules:any
  entryorexit:any=true;
  fee:any;
  unlock:any
  parenthLegal:any=false;
  tutState:any=-1;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public dragulaService: DragulaService
  ) {
//console.log(dragulaService)
 
    viewCtrl.onDidDismiss(()=>{
this.dragulaService.destroy('RULES')
    })

 dragulaService.drop.subscribe((value) => {

 setTimeout(()=>{

   this.rules[this.entryorexit?'entry':'exit']=this.sanitizeGroups(this.rules[this.entryorexit?'entry':'exit'])
},0)
    });
   /*  
 dragulaService.drag.subscribe((value) => {
//if (this.game.moves<1){return}
  console.log(value);
    });
 */

    
  dragulaService.setOptions('RULES', {
    moves: (el, source, handle, sibling) => !el.classList.contains('no-drag')
  });


this.entryorexit=params.get("entry");
this.fee=params.get("fee");
this.rules=params.get("rules");
this.unlock=params.get("unlock");
this.tutState=params.get("tutState");


//this.unlock=2; // ()() debug

if (this.rules[this.entryorexit?'entry':'exit'].length==0){
  this.addRule(this.entryorexit?'entry':'exit')
}

    //this.learn = params.get("learn");
    //this.rewatch = params.get("rewatch");
  }

 openLink(link, self: any = false) {
   this.events.publish('sfx','generic')
    window.open(link, self ? "_self" : "_blank", "frame=true,nodeIntegration=no");
  }
  
onBlur(rule,i){
if (rule===null){
this.rules[this.entryorexit?'entry':'exit'][i][2]=0;
}
}

changeInd(){
  if (this.tutState==203){
    this.tutState=204;
  }
}

ionViewWillLeave(){
//this.dragulaService.drop.unsubscribe(); // leave off? yeah. 
}

addGroup(type){

    this.rules[type].push(['_','and'])
    this.rules[type].push([
      "10SMA", type=='entry'?"Today":"5 Days Ago", "3",">",
      "10SMA", type!=='entry'?"Today":"5 Days Ago", "and"
    ]);
}

test(){
  console.log('fires');
}

sanitizeGroups(arr){

if (arr[0][0]=='_'){
arr.shift()
}

if (arr[arr.length-1][0]=='_'){
  arr.pop();
}

var last=false;

arr.forEach((el,i)=>{

if (el[0]=='_'){
if (last){
arr.splice(i,1)
}
  last=true
}else{last=false}


})

return arr



}

rmSimpleRule(entry,i){

if (entry){
  this.rules.entry.splice(i,1)
}else{
this.rules.exit.splice(i,1)
}

   this.rules[this.entryorexit?'entry':'exit']=this.sanitizeGroups(this.rules[this.entryorexit?'entry':'exit'])

}

  tutClick(num){
    if (this.tutState==num){this.tutState=num+1}
  }

addCondition(type){
  if (this.unlock==0){return}
  this.tutClick(252)
    this.addRule(type);
}

addRule(type,parenth:any=false) {

  //parenth
if (this.tutState==204){
    this.tutState=205;
  }
  if (parenth){
    this.rules[type].push('_')
  }else{
    if (type=='entry'){

    this.rules[type].push([
      "10SMA", "Today", "3",
      ">",
      "10SMA", "5 Days Ago", "and"
    ]);
}else{
     this.rules[type].push([
       "10SMA", "5 Days Ago", "3",
      ">",
       "10SMA", "Today", "and"
    ]);
}
  }


  }

back(save){


  if (save){

if (this.tutState==206){
  this.tutState=207
  this.events.publish("tutState", 208);
}

if (this.tutState==258){
  this.tutState=259
  this.events.publish("tutState", 260);
}

if (this.tutState==209){
  this.tutState=210
  this.events.publish("tutState", 211);
}

if (this.tutState==306){
  this.tutState=307
  this.events.publish("tutState", 308);
}


this.rules[this.entryorexit?'entry':'exit'].forEach((rule)=>{
if (rule[2]===null){rule[2]=0}else if (typeof rule[2] == 'string'){rule[2]=parseInt(rule[2])}
})

this.events.publish("saveSimpleBot", this.rules);
  }

this.viewCtrl.dismiss();
}

}



@Component({
  selector: "maModal",
  templateUrl: "movingAvg.html",
})
export class maModal implements AfterViewInit {
  ma: any;
  state: any;
  dateIndex:any;
  math:any=Math;

  constructor(
    public params: NavParams,
    public events: Events,
    public viewCtrl: ViewController
  ) {
    this.state = params.get("state");
    this.dateIndex = params.get("dateIndex");
    var movingAvgs = params.get("ma");
    console.log(movingAvgs);
    var ma = [];

    movingAvgs.sma.forEach((dur, i) => {
      var color = movingAvgs.smaColors[i];
      if (!color) {
        color = this.genColor();
      }
      ma.push({ type: "sma", duration: dur, color: color.trim() });
    });
    movingAvgs.ema.forEach((dur, i) => {
      var color = movingAvgs.emaColors[i];

      if (!color) {
        color = this.genColor();
      }

      ma.push({ type: "ema", duration: dur, color: color.trim() });
    });

    this.ma = ma;
  }

    openLink(link){
    window.open(link,"_blank", "frame=true,nodeIntegration=no");
  }

  genColor() {
    return "#"+String(Math.floor(Math.random()*16777215).toString(16));
  }

  ngAfterViewInit() {
this.refreshColors();

  }


  refreshColors(){
    /*
        let hueb=[]
    var elems = Array.from(document.querySelectorAll(".color-input-ma"));
    for (let i = 0; i < elems.length; i++) {
      var elem = elems[i];
      hueb[i] = new Huebee(elem, {
        notation: "hex",
        saturations: 2,
      });

hueb[i].on( 'change', ( color, hue, sat, lum )=> {

this.ma[i].color=color
 // console.log(color);
this.save();
})


    }
    */
  }

  rmMA(index) {
    if (this.ma.length == 1) {
      
    } else {
      this.ma.splice(index, 1);
      this.save();
    }
  }

  addMA() {
    this.ma.push({ type: "sma", duration: 14, color:this.genColor() });
    setTimeout(()=>{
this.refreshColors();
},0)
    this.save();
  }

  onChange() {
    setTimeout(() => {
      this.save();
    }, 10);
  }

  save() {
    let data = { sma: [], ema: [], smaColors:[], emaColors:[]};

    this.ma.forEach((avg,i) => {
      if (!data[avg.type].includes(avg.duration)) {
        data[avg.type].push(avg.duration);
        if (avg.type=="sma"){
          console.log(avg.color);
          data.smaColors.push(avg.color)
        }else{
          data.emaColors.push(avg.color)
        }
      }
    });


    this.events.publish("setMA", data);
  }
}