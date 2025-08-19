import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { NavController, AlertController, NavParams } from "ionic-angular";
import { Editor } from "@baklavajs/core";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { Engine } from "@baklavajs/plugin-engine";
import { Node } from "@baklavajs/core";
import { Events } from "ionic-angular";
import { TrainingData } from "../../providers/nodes/types";
import { BaklavaState } from "../../providers/baklava-state/baklavaState";
import { ViewController } from "ionic-angular";
import { ModalController} from "ionic-angular";
import { Chart } from "chart.js";
import * as fflate from 'fflate';
import * as cloneDeep from "lodash.clonedeep";
import { BaklavaProvider } from "../../providers/baklava/baklava";
import * as Nodes from '../../providers/nodes';
import { StateMachine, TraceInfo } from "../../providers/state-machine/state-machine";
// import * as brain from "brain.js"
import { INeuralNetworkOptions } from "brain.js/dist/src/neural-network-types";
import { INeuralNetworkTrainOptions } from "brain.js/dist/src/neural-network";
import { createSimpleBot, SimpleBotDefinition } from "../../providers/baklava/simple-bots";
import { DefaultSimpleBotName,logClamp, badwords } from "../../constants";
import { logsModal } from "../../pages/home/modals"
import { Storage } from "@ionic/storage";

type TrainingResults = {
  error: number,
  iterations: number
}

@Component({
  selector: "neuralModal",
  templateUrl: "neural.html",
})
export class neuralModal {
  network: number = 1;
  options = { iterations: 2000, errorThresh: 0.005, logPeriod: 10, learningRate: 0.3, momentum: 0.1, timeout: 5000000, numLayers: 2, activation: "sigmoid", leakyReluAlpha: 0.01 }
  layers: number[] = [2, 2];
  numInputs: number = 0;
  minMax: number[][];
  trainingResults: TrainingResults;


  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public stateMachine: StateMachine
  ) {

    this.trainingResults = null;
    let trainingData: TrainingData = this.stateMachine.getVariable("TrainingData." + this.network)
    if (!Array.isArray(trainingData) || trainingData.length === 0 || !Array.isArray(trainingData[0].input)) {
      this.numInputs = 0;
    } else {
      this.numInputs = trainingData[0].input.length;
    }
    this.minMax = [];
    for (let i = 0; i < this.numInputs; i++) {
      let inputData = trainingData.map(x => x.input).map(x => x[i]);
      let min = (Math.min(...inputData) * 0.8);
      let max = (Math.max(...inputData) * 1.2);
      this.minMax.push([min, max]);
      trainingData = trainingData.map(row => { row.input[i] = (row.input[i] - min) / (max - min); return row; });
    }
    if (this.numInputs > 0) {
      let outMin = (Math.min(...trainingData.map(row => row.output).map(x => x[0])) * 0.8);
      let outMax = (Math.max(...trainingData.map(row => row.output).map(x => x[0])) * 1.2);
      this.minMax.push([outMin, outMax]);
    }
  }

  get dataPoints(): number {
    const trainingData = this.stateMachine.getVariable("TrainingData." + this.network)
    if (!trainingData) {
      return 0;
    }
    return trainingData.length;
  }

  changeNumLayers(num: number) {
    this.options.numLayers = num;
    if (num < this.layers.length) {
      this.layers = this.layers.slice(0, num);
    }
    if (num > this.layers.length) {
      for (let i = 0; i < num - this.layers.length; i++) {
        this.layers.push(2)
      }
    }
  }

  changeLayerNeurons(index: number, neurons: number) {
    this.layers[index] = neurons;
  }

  track(index: number, item: number) {
    if (this.layers && this.layers.length) {
      return this.layers[index];
    }
  }

  counter(i) {
    return new Array(i);
  }

  clearData() {
    this.clearTrainingData();
    this.clearNetwork();
  }

  clearTrainingData() {
    this.stateMachine.setVariable("TrainingData." + this.network, []);
  }
  clearNetwork() {
    this.stateMachine.setVariable("NeuralNetwork." + this.network, null);
  }

  trainNeuralNetwork(trainingData: TrainingData, config: Partial<INeuralNetworkOptions & INeuralNetworkTrainOptions>): Promise<{ trainingResults: TrainingResults, json: any }> {
    return new Promise((res) => {
      let worker = new Worker("assets/js/train-network.js");
      worker.onmessage = e => {
        res(e.data);
      }
      worker.postMessage([trainingData, config]);
    });
  }

  trainNetwork() {
    let trainingData: TrainingData = this.stateMachine.getVariable("TrainingData." + this.network)

    //prep training data
    for (let i = 0; i < this.numInputs; i++) {
      let [min, max] = this.minMax[i];
      trainingData = trainingData.map(row => { row.input[i] = (row.input[i] - min) / (max - min); return row; })
    }

    let [outMin, outMax] = this.minMax[this.minMax.length - 1];
    trainingData = trainingData.map(row => { row.output = row.output.map((x) => (x - outMin) / (outMax - outMin)); return row; });

    const config: Partial<INeuralNetworkOptions & INeuralNetworkTrainOptions> = {
      activation: this.options.activation,
      hiddenLayers: this.layers,
      leakyReluAlpha: this.options.leakyReluAlpha,
      learningRate: this.options.learningRate,
      iterations: this.options.iterations,
      errorThresh: this.options.errorThresh,
      momentum: this.options.momentum,
      logPeriod: this.options.logPeriod,
      timeout: this.options.timeout
    }
    this.trainNeuralNetwork(trainingData, config).then(({ trainingResults, json }) => {
      this.trainingResults = trainingResults;
      let netJSON = json;
      let networkData = {
        minMax: this.minMax, netJSON
      }
      this.stateMachine.setVariable("NeuralNetwork." + this.network, networkData)
    });
  }
}

@Component({
  selector: "portModal",
  templateUrl: "port.html",
})
export class portModal {
    bot:any
    state:any
    mode:any
    name:any
    communityBots:any=[]
    upload:any={liked:false,voteUp:false,voteDown:false,name:'',author:'',top:false,up:0,down:0,notes:'',data:{}}
    pData:any={}
    ref:any

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public events: Events,
    public storage: Storage,
    public alertCtrl: AlertController
  ) {

    this.upload.top=params.get("oneper")

this.storage.get('tradebotsBotShare').then((val)=>{


  if (val && val!==null){
   this.pData=JSON.parse(val)
   //console.log(this.pData);
  }

this.loadFB()

})




this.bot=params.get("bot")
this.name=params.get("name");
this.state=params.get("state")
this.upload.name=this.name

if (this.state[0]){this.mode=0}else{this.mode=1}



/*
// The default compression method is gzip
// Increasing mem may increase performance at the cost of memory
// The mem ranges from 0 to 12, where 4 is the default
const compressed = fflate.compressSync(buf, { level: 6, mem: 8 });
var cmp=fflate.strFromU8(compressed)
console.log(cmp);
console.log(cmp.length);
// When you need to decompress:
const decompressed = fflate.decompressSync(compressed);
const origText = fflate.strFromU8(decompressed);
//console.log(origText); // Hello world!
*/

  }

save(){
this.pData={}

this.communityBots.forEach((bot)=>{

if (bot.liked || bot.voteUp || bot.voteDown){
this.pData[bot.ky]={liked:bot.liked?true:false,voteUp:bot.voteUp?true:false,voteDown:bot.voteDown?true:false}

}

})
console.log(this.pData)

this.storage.set('tradebotsBotShare', JSON.stringify(this.pData)).then(() => {
      
});



}

loadFB(){


if (window['firebase'].apps.length > 0) {

 var database=window['firebase'].app().database()

} else {

var app = window['firebase'].initializeApp({
  apiKey: "AIzaSyC9TIkELAsejxZNaN9vxr1qzskBE2tB0dU",
  authDomain: "trade-bots-c5bfe.firebaseapp.com",
  projectId: "trade-bots-c5bfe",
  databaseURL: "https://trade-bots-c5bfe-default-rtdb.firebaseio.com/",
  storageBucket: "trade-bots-c5bfe.appspot.com",
  messagingSenderId: "880404585690",
  appId: "1:880404585690:web:7352971a818faff185d9e3"
});


 var database = app.database(); // Get a reference to the database



}



//console.log(window['firebase'].app())



// Reference a specific location (replace 'path/to/your/data' with your actual path)
this.ref = database.ref('/');

this.communityBots=[]

this.ref.once('value', (snapshot) => {
  if (snapshot.exists()) {

let obj=snapshot.val()

console.log(obj);
Object.keys(obj).forEach((ky)=>{
  let sub=obj[ky]
  sub.ky=ky
  this.communityBots.push(sub)
})


this.communityBots.forEach((bot)=>{
//console.log(this.pData,bot.ky)
if (this.pData[bot.ky]){
  bot.liked=this.pData[bot.ky].liked
  bot.voteUp=this.pData[bot.ky].voteUp
  bot.voteDown=this.pData[bot.ky].voteDown
}


})



this.communityBots.sort(( a, b )=> {

  if ( a.up-a.down + (a.liked?999999:0) < b.up-b.down + (b.liked?999999:0)){
    return 1;
  }
  if (a.up-a.down + (a.liked?999999:0) > b.up-b.down + (b.liked?999999:0)){
    return -1;
  }
  return 0;
})

//console.log(this.communityBots)

   // console.log(snapshot.val()); // Data at the referenced location
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
/*
var newData = {
  "bitch":"sweet"
};

ref.push(JSON.stringify(newData)).then(() => {
  console.log('Data pushed successfully');
}).catch((error) => {
  console.error('Error pushing data:', error);
});
*/


}



uploadBot(){

  function containsAny(haystack, needles) {
  for (const needle of needles) {
    if (haystack.includes(needle)) {
      return true;
    }
  }
  return false;
}

// Example usage:


if (containsAny(this.upload.notes,badwords) || containsAny(this.upload.author,badwords) || containsAny(this.upload.name,badwords)){

   var alert = this.alertCtrl.create({
        title: "Vulgarity",
        message:"Please remove any vulgarities and try again",
        buttons: [
          {
            text: "Ok",
            handler: (data) => {
            },
          }

            ]})
  alert.present();


return;
}

if (this.upload.name=='' || this.upload.notes==''){

   var alert = this.alertCtrl.create({
        title: "Missing Info",
        message:"Neither name nor notes can be blank.",
        buttons: [
          {
            text: "Ok",
            handler: (data) => {
            },
          }

            ]})
  alert.present();

  return;
}

this.upload.date=new Date();

this.upload.data=JSON.stringify(this.bot)

console.log(this.upload);

this.ref.push(this.upload).then(() => {
  this.viewCtrl.dismiss();
  //console.log('Data pushed successfully');
}).catch((error) => {
  console.error('Error pushing data:', error);
});







}



moreInfo(bot){
console.log(bot);
      var alert = this.alertCtrl.create({
        title: bot.name,
        message:bot.note,
        buttons: [
          {
            text: "Back",
            handler: (data) => {
            },
          },
          {
            text: "Load Bot",
            handler: (data) => {
this.events.publish("loadBotFile",JSON.parse(bot.data))
this.viewCtrl.dismiss();


            }
          }

            ]})
  alert.present();
}

importFile(file){
let reader = new FileReader();
file=file.target.files[0]

  reader.onload = () => {
    //reader.result

var U8=new Uint8Array(reader.result as ArrayBuffer)
const decompressed = fflate.decompressSync(U8);
const bot = fflate.strFromU8(decompressed);

this.events.publish("loadBotFile",JSON.parse(bot));
  this.viewCtrl.dismiss();
  };

  reader.onerror = () => {
    console.error(reader.error);
  };

 reader.readAsArrayBuffer(file);

}
  downloadBot(){

var downloadBlob, downloadURL;

downloadBlob = function(data, fileName, mimeType="application/octet-stream") {
  var blob, url;
  blob = new Blob([data], {
    type: mimeType
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function() {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

downloadURL = function(data, fileName) {
  var a;
  a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = 'display: none';
  a.click();
  a.remove();
};

    var str = JSON.stringify(this.bot);
const buf = fflate.strToU8(str);
const compressed = fflate.compressSync(buf, { level: 4, mem: 4 });
downloadBlob(compressed, this.name+".tradebot")

this.viewCtrl.dismiss();
  }
}


@Component({
  selector: "page-baklava",
  templateUrl: "baklava.html",
})
export class BaklavaPage implements OnInit, OnDestroy {
  editor: Editor;
  viewPlugin: ViewPlugin;
  engine: Engine;
  cashHoldingsPrecision:any=[false,false]
  botDefinition:any;
  running:any=false;
  logModal:any;
  portModal:any;
  trainModal:any;
  date:any;
  portfolio:any;
  cashVsInvested:any;
  currPrice:any;
  limDeduction:any;
  longVsShort:any
  ticker:any;
  nextDay:any=false;
  nextDayTimeout:any;
  sameness:any=false;
  offset:any=false;
  preSimState:any={}
  gains:any=0;
  currentTime:any=new Date().getTime();
  stateInterval:any
  testCanvasChart:any;
  gainsInit:any=[];
  errors:any=0;
  traceInfo: TraceInfo = null;
  tutState:any=-1;
  testState:any=BaklavaState.getState("testState");
  unlockState:any=BaklavaState.getState("unlock");
  portState:any=BaklavaState.getState("portState");
  stockInfo:any=BaklavaState.getState("stockInfo");
  maxSim:any=BaklavaState.getState("maxSim");
  year:any=BaklavaState.getState("year");
  gainShow:any=BaklavaState.getState("gains");
  oneper:any
  //waiting:any=true; // connect


  @ViewChild("baklava") baklavaEl: ElementRef;
  @ViewChild("testCanvas") testCanvas;
  editorCut: HTMLElement


  constructor(public navCtrl: NavController, public params: NavParams, public events: Events, public alertCtrl: AlertController, public modalCtrl: ModalController, private baklava: BaklavaProvider, public stateMachine: StateMachine) {
//this.port()
//document.getElementsByClassName('background')[0].style.backgroundColor='purple !important'

    if (typeof this.unlockState=='undefined'){
      console.error('Baklava Unlock State Undefined')
    }

    let traceInfo: TraceInfo = params.get("traceInfo");


    if (traceInfo) {
var bck:any=document.getElementsByClassName('background')
      this.traceInfo = traceInfo;
setTimeout(()=>{if (bck[0]){bck[0].style.backgroundColor='#292b36'}},10)
setTimeout(()=>{if (bck[0]){bck[0].style.backgroundColor='#292b36'}},100)
setTimeout(()=>{if (bck[0]){bck[0].style.backgroundColor='#292b36'}},500)
    }

    this.botDefinition = params.get("bot");
    this.date=params.get("date");

this.cashVsInvested=params.get("cashVsInvested");
this.currPrice=params.get("currPrice");
this.limDeduction=params.get("limDeduction");
this.longVsShort=params.get("longVsShort");
this.portfolio=params.get("portfolio");
this.oneper=params.get("oneper");

    //console.error(this.date);
    this.ticker=params.get("tick");

  var tutParam = params.get("tutState");
  if (tutParam){
     this.tutState=tutParam;
  }


/*
if (this.botDefinition.debug && false){

var debugBot:any;

//temporary debug code, remove this code later.

setInterval(()=>{
  let state = this.editor.save();
  localStorage.setItem("debugBot",JSON.stringify(state));
} , 300);

if(localStorage.getItem("debugBot")){
  debugBot = JSON.parse(localStorage.getItem("debugBot"));
} else {
  debugBot={
      "nodes": [
          {
              "type": "ConstantNode",
              "id": "node_16489798284270",
              "name": "Constant",
              "options": [
                  [
                      "Type",
                      "Boolean"
                  ],
                  [
                      "TextOption",
                      "Random # Generated Each Iteration"
                  ],
                  [
                      "Place Value",
                      "Decimal"
                  ],
                  [
                      "Below",
                      1
                  ],
                  [
                      "Above",
                      0
                  ],
                  [
                      "Boolean",
                      "True"
                  ],
                  [
                      "",
                      1
                  ],
                  [
                      "Log Message + Data",
                      null
                  ]
              ],
              "state": {},
              "interfaces": [
                  [
                      "Output",
                      {
                          "id": "ni_16489798284271",
                          "value": null
                      }
                  ]
              ],
              "position": {
                  "x": 230,
                  "y": 218
              },
              "width": 200,
              "twoColumn": false,
              "customClasses": ""
          },
          {
              "type": "TradeNode",
              "id": "node_16489798326782",
              "name": "Market Trade",
              "options": [
                  [
                      "Type",
                      "Buy"
                  ],
                  [
                      "Times",
                      "Unlimited"
                  ],
                  [
                      "Where N is",
                      10
                  ],
                  [
                      "Within",
                      "No time limit"
                  ],
                  [
                      "Where X is",
                      90
                  ],
                  [
                      "warning",
                      "Long investments will auto-sell"
                  ],
                  [
                      "% Invested",
                      100
                  ],
                  [
                      "% Cash",
                      100
                  ],
                  [
                      "Days are",
                      "Actual Days"
                  ],
                  [
                      "Log Message + Data",
                      null
                  ]
              ],
              "state": {},
              "interfaces": [
                  [
                      "Trigger",
                      {
                          "id": "ni_16489798326793",
                          "value": null
                      }
                  ]
              ],
              "position": {
                  "x": 627,
                  "y": 189
              },
              "width": 200,
              "twoColumn": false,
              "customClasses": ""
          }
      ],
      "connections": [
          {
              "id": "16489798365196",
              "from": "ni_16489798284271",
              "to": "ni_16489798326793"
          }
      ],
      "panning": {
          "x": 0,
          "y": 0
      },
      "scaling": 1
  }
}
setTimeout(()=>{
this.editor.load(debugBot as any);
},100)
}
*/



   

//------------for debug ------------
/*

this.botDefinition.logs=[{type:1,message:"blah blah blah",timestamp:new Date().getTime(),detail:'this is more content'}]
*/


//----------------------------------

//console.log(this.botDefinition.data);

    if (this.botDefinition && this.botDefinition.data) {
setTimeout(()=>{this.editor.load(this.botDefinition.data)},0)
}



  }

setLiveView(bool){
  if (bool){
    Array.from(document.querySelectorAll(".liveValue")).forEach((el:any)=>el.style.visibility="inherit");
  }else{
Array.from(document.querySelectorAll(".liveValue")).forEach((el:any)=>el.style.visibility="hidden");
["trueConnection", "falseConnection"].forEach(connClass=>Array.from(document.querySelectorAll("."+connClass)).forEach(conn=>conn.classList.remove(connClass)));
  }
}

openLink(link,self:any=false){
window.open(link,self?"_self":"_blank", "frame=true,nodeIntegration=no");
}

docs(){
  alert('link to documentation');
}

loadExample(id){
  alert('load example id: '+id);
}

  modeChng(e){

//setTimeout(()=>{this.botDefinition.mode=1},1000)

  this.botDefinition.sim=0
  this.botDefinition.mode=e;

    if(this.botDefinition.gains===null || e==0 || e==2){
      this.botDefinition.gains=true
    }

this.events.publish("paperState",e);

  }

  backtesting(){
      this.events.publish("popup", "Paper Mode / Backtesting", "We're hard at work adding this to the game and it will be available soon in a free update along with many other features and bugfixes. Thank you for your patience and understanding!");
  }

countErrors(){
var errs=0;


this.botDefinition.logs.forEach((log)=>{

  if (!(this.botDefinition.logSeen && this.botDefinition.logSeen>log.timestamp)){

if (log.type==2){errs++}

}

})

  this.errors=errs;
}

onBaklavaClick(event){
  if(event.target==document.querySelector(".node-editor")){ return }
  setTimeout(()=>{

  if (this.strippedState()!==this.preSimState){
    this.setLiveView(false);

if (this.running){
  console.error("pause sim, bot has changed");
  this.sim();
}

}
  },400)
}

initLine(){

var timeFormat = 'YYYY-MM-DD';
var chart={
    type: 'line',
    data: {
        datasets: [{data:this.gainsInit}]
    },
    options: {
            responsive: true,
            maintainAspectRatio:false,
            legend: {
            display: false,
    animation: {
        duration: 0, // general animation time
    },
    hover: {
        animationDuration: 0, // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0, // animation duration after a resize

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
                    scaleLabel: {
                        display:     false,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display:     false,
                        labelString: 'value'
                    }
                }]
            }
        }
}
// @ts-ignore
//chart.data.datasets[0].backgroundColor="rgba(0,0,0,0)"
// @ts-ignore
chart.data.datasets[0].borderColor="rgba(255,0,0,.8)"
this.testCanvasChart = new Chart(this.testCanvas.nativeElement, chart);
}

gainsButton(){
  this.botDefinition.gains=!this.botDefinition.gains;

if (this.botDefinition.gains && this.gainsInit.length>1){
this.initLine();
}else if (!this.botDefinition.gains){
  // DESTROY CHART
  if (this.testCanvasChart){
      this.testCanvasChart.destroy();
    }
}
}

  pushGainsChart(x,y){

if (this.botDefinition.gains){

if (this.testCanvasChart){
this.testCanvasChart.data.datasets[0].data.push({x:x,y:y})
this.testCanvasChart.update();
}else{
if (this.gainsInit.length==0){
this.gainsInit.push({x:x,y:y});
}else{
  this.gainsInit.push({x:x,y:y})

this.initLine();

}
}

}else{
  this.gainsInit.push({x:x,y:y})
}
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

  ionViewWillEnter() {
    if (this.traceInfo) {
      if (document.querySelectorAll('.node-editor').length > 1) {
        this.editorCut = document.querySelector(".node-editor");
        this.editorCut.parentElement.removeChild(this.editorCut);
      }
    }



  this.testState=BaklavaState.getState("testState");
  this.unlockState=BaklavaState.getState("unlock");
  this.portState=BaklavaState.getState("portState");
  this.stockInfo=BaklavaState.getState("stockInfo");
  this.maxSim=BaklavaState.getState("maxSim");
  this.year=BaklavaState.getState("year");
  this.gainShow=BaklavaState.getState("gains");
  
this.events.subscribe("baklavaBotPause",()=>{
this.running=false;
})

     this.events.subscribe("entrky", () => {
       console.log(document.activeElement.tagName)
    if (document.activeElement.tagName=="INPUT"){
          //@ts-ignore
        document.activeElement.blur()

     }else{
        this.sim()
     }
      
    });

    this.events.subscribe("baklavaGains", (cumGain, date, tick, cashv,currpri,limdeduct,longshort,portfolio,year,done:any=-1) => {

      if (done>-1){
this.stateMachine.resetTrades();
        if (done==1){
          this.running=false;
        }
        return;
      }
            //console.error('fires')
      date = new Date(date).toISOString().split('T')[0];
      this.date=date;
if (this.year>-1){
  this.year=year
}
this.cashVsInvested=cashv;
this.currPrice=currpri;
this.limDeduction=limdeduct
this.longVsShort=longshort
this.portfolio=portfolio
//console.error(this.cashVsInvested,this.currPrice,this.limDeduction,this.longVsShort)
      this.nextDay=true;
if (this.nextDayTimeout){clearTimeout(this.nextDayTimeout)}
this.nextDayTimeout=setTimeout(()=>{
  this.nextDay=false;
},300)


      this.ticker=tick;
      if (!this.offset) { this.offset = cumGain }
      this.gains = cumGain - this.offset;
      //console.log("cumulative gains from home.ts",this.gains)
      this.pushGainsChart(date, this.gains)
    })
    this.events.subscribe("endBacktest", () => {
      this.running = false;
      this.botDefinition.logs.push({ type: 2, message: "Backtest has completed", timestamp: new Date().getTime() })
      this.botDefinition.mode = 1;
    })

    this.events.subscribe("loadBotFile", (bot) => {
      this.editor.load(bot);
    })

    this.events.subscribe("newLogBaklava", (log) => {
      var view = this.navCtrl.getActive().component.name;
      var logObj = log; //process Log from Jitin
      // why is this fired twice??
      if (view == "BaklavaPage") {
        //console.log(logObj)
        this.botDefinition.logs.push(logObj)

    if (this.botDefinition.logs.length>logClamp){

            var excess=this.botDefinition.logs.length-logClamp
            this.botDefinition.logs=this.botDefinition.logs.splice(this.botDefinition.logs.length-excess)}


        //console.log(this.botDefinition.logs)
        //this.advancedBots[this.activeBot].logs.push(logObj)
        this.countErrors();
      }
    });
    this.events.subscribe("colorBooleanNodes", () => {
  this.setLiveView(true);
      this.colorBooleanNodes();
    })
  }
  ionViewWillLeave() {

    document.querySelector(".node-editor").removeEventListener("mousedown", this.onBaklavaClick);


    ["baklavaBotPause","entrky","newLogBaklava", "loadBotFile", "endBacktest", "baklavaGains", "colorBooleanNodes"].forEach(event => {
      this.events.unsubscribe(event);
    });
  }
  ionViewDidLeave() {
    if (this.editorCut) {
      document.querySelector("page-baklava").appendChild(this.editorCut);
      this.editorCut = null;
    }
  }
  ngOnInit() {
    this.editor = this.baklava.initEditor(this.botDefinition.name, this.baklavaEl)
    window["editor"] = this.editor;
    this.stateMachine.baklavaInited = true;
    this.events.subscribe("requestTrace", () => {
      let trace = this.editor.save();
      this.botDefinition.data = trace;
      this.events.publish("trace", trace);
    });
    this.events.subscribe("compileSimpleBot", (definition: SimpleBotDefinition, name: string) => {
      this.compileSimpleBot(definition, name);
    });

  }

  ngOnDestroy() {
    this.baklava.unmount(this.botDefinition.name);
  }

  addNodeWithCoordinates(nodeType, x, y): Node {
    const n = new nodeType();
    this.editor.addNode(n);
    n.position.x = x;
    n.position.y = y;
    return n;
  }

  node(type) {
    return Nodes[type];
  }


strippedState(){
var state=this.editor.save()

delete state.panning
delete state.scaling

state.nodes.forEach((node)=>{
  delete node.position

  node.interfaces.forEach((intr)=>{
delete intr[1].value
  })
})

return JSON.stringify(state);
}


  sim(){
if (this.editor.nodes.length==0){return}

if (this.botDefinition.sim!==0){
      this.running=!this.running;
  }
  //this.setLiveView(true);
this.events.publish("simFromBaklava",this.running,this.botDefinition.sim,this.botDefinition.mode==0,this.botDefinition.name);
  }

train(){
  this.trainModal = this.modalCtrl.create(neuralModal, {}, { cssClass: 'learnModal' });
    this.trainModal.present();
}





port() {


//prompt for vote if downloaded




//this.loadFB();

this.portModal = this.modalCtrl.create(portModal, {
      bot: this.editor.save(),
      name:this.botDefinition.name,
      state:this.portState,
      oneper:this.oneper
    }, { cssClass: 'learnModal' });

  this.portModal.present();

    
  }

  isSame(){

    if (this.traceInfo){
return true;
    }
    var state=this.editor.save();

    if (typeof this.botDefinition.data == 'undefined'){
      return false
    }else{

if (this.botDefinition.data.connections.length!==state.connections.length){return false}
if (state.nodes.length!==this.botDefinition.data.nodes.length){return false}

var tempState=cloneDeep(state.nodes)
var tempDef=cloneDeep(this.botDefinition.data.nodes)


//console.log(tempDef);console.log(tempState)
/**/
tempState.forEach(object => {
  //delete object['state'];
  delete object['position'];
    object['interfaces'].forEach((inter)=>{
        delete inter[1]['value'];
      })
});
tempDef.forEach(object => {
  //delete object['state'];
  delete object['position'];
    object['interfaces'].forEach((inter)=>{
      delete inter[1]['value'];
    })
});

let nodesSame=JSON.stringify(tempState)==JSON.stringify(tempDef);
let connectionsSame=JSON.stringify(this.botDefinition.data.connections)==JSON.stringify(state.connections);

     return nodesSame && connectionsSame
     }
  }

  checkSameness(){

    this.sameness=this.isSame();
  }

  backBtn(){
   // console.log(this.isSame(),JSON.stringify(this.editor.save()))

if (this.traceInfo){
  this.traceInfo=null;
  this.navCtrl.pop();
  return;
  // re-load bot back from stack trace
}

    if (this.editor.nodes.length==0){
      this.back(true);
      }else if (this.isSame()){
        this.back(true);
      }
  }

  openLog() {
/*
this.botDefinition.logSeen=new Date().getTime();
this.errors=0;

    this.logModal = this.modalCtrl.create(logsModal, {
      log: this.botDefinition.logs,
      name: this.botDefinition.name
    });
    this.logModal.present();
*/

var log=this.modalCtrl.create(logsModal, { log: this.botDefinition.logs, name: this.botDefinition.name,year:this.year}, { cssClass: '' });

  log.present();

  }

  customNode() {
    //alert('prompt user to select at least 2 nodes :: a nested fabrication and an expand icon')

     this.events.publish("popup", "Modular Nesting", "We will soon add the ability to make your own node prefabrications to simplify and functionalize your bot. Stay tuned for updates and thank you for your patience and support!");
  }

  addNode(type) {


let editor=this.editor.save();


    var newNode = this.addNodeWithCoordinates(this.node(type), -1*Math.floor(editor.panning.x)+window.innerWidth/editor.scaling/2.5+window.innerWidth/editor.scaling/10*Math.random()*(Math.random()>.5?1:-1), -1*Math.floor(editor.panning.y)+window.innerHeight/editor.scaling/2.5+window.innerWidth/editor.scaling/10*Math.random()*(Math.random()>.5?1:-1));

    return newNode;
  }


  logObj() {
  }

  revert(){
    this.editor.load(this.botDefinition.data)
  }

  back(discard:any=false) {

if (this.botDefinition.mode!==1){
this.events.publish("paperState",0);
this.botDefinition.mode=1;
}

if (!discard){
  this.botDefinition.data=this.editor.save();
  this.events.publish("saveBot", [this.botDefinition.name, this.botDefinition]);
}
if (this.running){
  this.events.publish("startStop", false,null,null);
    if (this.stateInterval) {
    clearInterval(this.stateInterval);
    }
}

if (this.traceInfo){
  // re-open debug log
this.events.publish("backStackTrace", this.traceInfo);

}
      this.navCtrl.popToRoot();

/*
    var bot = { state: this.editor.save(), nodes: {}, warnings: this.issues.warnings }
    // @ts-ignore
    let connections = this.editor._connections;
    this.editor.nodes.forEach((node, i) => {
      //let vals = []
      var data = {};
      node.options.forEach((v, m) => {

        // @ts-ignore
        data[m] = v._value;

        //vals.push(temp)
      })

      //var ins =[]
      //var outs=[]
      var ins = {}
      var outs = {}
      node.interfaces.forEach((socket, i) => {



        if (socket.isInput) {

          connections.forEach((conn) => {
            if (conn.to.id == socket.id) {
              ins[i] = conn.from.parent.id
              // ins.push(temp)
            }
          })

        } else {
          connections.forEach((conn) => {
            if (conn.from.id == socket.id) {
              if (outs[i]) {
                outs[i].push(conn.to.parent.id)
              } else {
                outs[i] = [conn.to.parent.id]
              }

              //outs.push(temp)
            }
          })
        }

      })

      bot.nodes[node.id] = { type: node.name, data: data, inputs: ins, outputs: outs } //,pos:node.position

    })

    console.log(bot);

    // if empty
    if (JSON.stringify(bot.nodes) == '{}') {
      this.navCtrl.popToRoot();
      return;
    }
    // if validation errors show warning
    if (this.validateBot(bot)) {
      this.events.publish("saveBot", [this.botDefinition.name, bot]);
      this.navCtrl.popToRoot();
    } else {
      // either warn or stop, display this.issues
      //issues:any={warnings:[],errors:[]};
      if (this.issues.errors.length == 0) {
        let alert = this.alertCtrl.create({
          title: this.issues.warnings.length + " Warnings",
          message: "You have some warnings, unconnected nodes or incomplete logic.",
          buttons: [
            {
              text: "Cancel",
              handler: (data) => {
              },
            },
            {
              text: "Proceed",
              handler: (data) => {
                this.events.publish("saveBot", bot);
                this.navCtrl.popToRoot();
              },
            },
          ],
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: this.issues.errors.length + " Fatal Errors",
          message:
            "You have errors that must be fixed",
          buttons: [

            {
              text: "Ok",
              handler: (data) => {

              },
            },
          ],
        });
        alert.present();
      }




    }

*/



  }



  debug() {
    this.back(false);
    //console.log(this.editor)
  }


  addNodeToGrid(nodeType: string, x: number, y: number): Node {
    return this.addNodeWithCoordinates(this.node(nodeType), x, y);
  }

  compileSimpleBot(definition: SimpleBotDefinition, name?: string) {
    let botDefinition = createSimpleBot(definition, this.editor, this.addNodeToGrid.bind(this), name);
    this.events.publish("saveBot", [DefaultSimpleBotName, { data: botDefinition, gains: null, logs: [], mode: 1, name: DefaultSimpleBotName, sim: 0, tutState: -1 }]);
  }


  ionViewDidEnter() {
    if (this.traceInfo) {
      this.highlightTraceNodes();
    }else{
      this.preSimState=this.strippedState();
      this.onBaklavaClick = this.onBaklavaClick.bind(this);
      document.querySelector(".node-editor").addEventListener("mousedown",this.onBaklavaClick, false);
    }
  
  }


  colorBooleanNodes() {
    function colorConnection(i: number, bool: boolean) {
      let conns = Array.from(document.querySelectorAll<HTMLElement>('.connection'));
      if (conns.length > 0) {
        conns[i].classList.add(bool + "Connection")
        conns[i].classList.remove(!bool + "Connection")
      }
    }

    this.editor.connections.map(conn => { return (this.editor.findNodeInterface(conn.from.id).value) }).forEach((val, i) => { if (val === true) colorConnection(i, true); if (val === false) colorConnection(i, false); })
  }

  highlightTraceNodes() {
    let { nodeID } = this.traceInfo;
    let nodeEls = Array.from(document.querySelectorAll(".node-container>.node"))
    let connectionEls: HTMLElement[] = Array.from(document.querySelectorAll(".connections-container path"))
    nodeEls.forEach((x: HTMLElement) => x.style.opacity = "0.3");
    connectionEls.forEach((x: HTMLElement) => x.style.opacity = "0.3");

    const highlightPath = (id: string) => {
      let el: HTMLElement = document.querySelector(`#${id}`);
      el.style.opacity = "0.7";
      let connections = this.editor.connections.map((conn, i) => ({ ...conn, i }));
      let connectionsToNode = connections.filter(conn => conn.to.parent.id == id);
      connectionsToNode.forEach(conn => {
        let { i } = conn;
        connectionEls[i].style.opacity = "0.7";
        connectionEls[i].style.filter = "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)";
      });
      let nodesToNode: string[] = connectionsToNode.map(conn => conn.from.parent.id);
      nodesToNode.forEach(nodeID => highlightPath(nodeID));
    }

    const stopNodeInteractivity = (id: string) => {
      let titleEls: HTMLElement[] = Array.from(document.querySelectorAll(`#${id}>.__title *`));
      let contentEls: HTMLElement[] = Array.from(document.querySelectorAll(`#${id}>.__content *`));
      let els = titleEls.concat(contentEls);
      els.forEach(el => {
        el.style.cursor = "not-allowed";
        el.style.pointerEvents = "none";
      });
    }

    highlightPath(nodeID);
    nodeEls.forEach(el => {
      let id = el.id
      stopNodeInteractivity(id);
    })

    let nodeEL: HTMLElement = document.querySelector(`#${nodeID}`);
    nodeEL.style.opacity = "1"
  }

}