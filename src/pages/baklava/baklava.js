var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from "@angular/core";
import { NavController, AlertController, NavParams } from "ionic-angular";
import { Events } from "ionic-angular";
import { BaklavaState } from "../../providers/baklava-state/baklavaState";
import { ViewController } from "ionic-angular";
import { ModalController } from "ionic-angular";
import { Chart } from "chart.js";
import * as fflate from 'fflate';
import { BaklavaProvider } from "../../providers/baklava/baklava";
import * as Nodes from '../../providers/nodes';
import { StateMachine } from "../../providers/state-machine/state-machine";
import { createSimpleBot } from "../../providers/baklava/simple-bots";
import { DefaultSimpleBotName } from "../../constants";
import { logsModal } from "../../pages/home/modals";
var neuralModal = /** @class */ (function () {
    function neuralModal(params, viewCtrl, stateMachine) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.stateMachine = stateMachine;
        this.network = 1;
        this.options = { iterations: 2000, errorThresh: 0.005, logPeriod: 10, learningRate: 0.3, momentum: 0.1, timeout: 5000000, numLayers: 2, activation: "sigmoid", leakyReluAlpha: 0.01 };
        this.layers = [2, 2];
        this.numInputs = 0;
        this.trainingResults = null;
        var trainingData = this.stateMachine.getVariable("TrainingData." + this.network);
        if (!Array.isArray(trainingData) || trainingData.length === 0 || !Array.isArray(trainingData[0].input)) {
            this.numInputs = 0;
        }
        else {
            this.numInputs = trainingData[0].input.length;
        }
        this.minMax = [];
        var _loop_1 = function (i) {
            var inputData = trainingData.map(function (x) { return x.input; }).map(function (x) { return x[i]; });
            var min_1 = (Math.min.apply(Math, inputData) * 0.8);
            var max_1 = (Math.max.apply(Math, inputData) * 1.2);
            this_1.minMax.push([min_1, max_1]);
            trainingData = trainingData.map(function (row) { row.input[i] = (row.input[i] - min_1) / (max_1 - min_1); return row; });
        };
        var this_1 = this;
        for (var i = 0; i < this.numInputs; i++) {
            _loop_1(i);
        }
        if (this.numInputs > 0) {
            var outMin = (Math.min.apply(Math, trainingData.map(function (row) { return row.output; }).map(function (x) { return x[0]; })) * 0.8);
            var outMax = (Math.max.apply(Math, trainingData.map(function (row) { return row.output; }).map(function (x) { return x[0]; })) * 1.2);
            this.minMax.push([outMin, outMax]);
        }
    }
    Object.defineProperty(neuralModal.prototype, "dataPoints", {
        get: function () {
            var trainingData = this.stateMachine.getVariable("TrainingData." + this.network);
            if (!trainingData) {
                return 0;
            }
            return trainingData.length;
        },
        enumerable: false,
        configurable: true
    });
    neuralModal.prototype.changeNumLayers = function (num) {
        this.options.numLayers = num;
        if (num < this.layers.length) {
            this.layers = this.layers.slice(0, num);
        }
        if (num > this.layers.length) {
            for (var i = 0; i < num - this.layers.length; i++) {
                this.layers.push(2);
            }
        }
    };
    neuralModal.prototype.changeLayerNeurons = function (index, neurons) {
        this.layers[index] = neurons;
    };
    neuralModal.prototype.track = function (index, item) {
        if (this.layers && this.layers.length) {
            return this.layers[index];
        }
    };
    neuralModal.prototype.counter = function (i) {
        return new Array(i);
    };
    neuralModal.prototype.clearData = function () {
        this.clearTrainingData();
        this.clearNetwork();
    };
    neuralModal.prototype.clearTrainingData = function () {
        this.stateMachine.setVariable("TrainingData." + this.network, []);
    };
    neuralModal.prototype.clearNetwork = function () {
        this.stateMachine.setVariable("NeuralNetwork." + this.network, null);
    };
    neuralModal.prototype.trainNeuralNetwork = function (trainingData, config) {
        return new Promise(function (res) {
            var worker = new Worker("assets/js/train-network.js");
            worker.onmessage = function (e) {
                res(e.data);
            };
            worker.postMessage([trainingData, config]);
        });
    };
    neuralModal.prototype.trainNetwork = function () {
        var _this = this;
        var trainingData = this.stateMachine.getVariable("TrainingData." + this.network);
        var _loop_2 = function (i) {
            var _b = this_2.minMax[i], min_2 = _b[0], max_2 = _b[1];
            trainingData = trainingData.map(function (row) { row.input[i] = (row.input[i] - min_2) / (max_2 - min_2); return row; });
        };
        var this_2 = this;
        //prep training data
        for (var i = 0; i < this.numInputs; i++) {
            _loop_2(i);
        }
        var _a = this.minMax[this.minMax.length - 1], outMin = _a[0], outMax = _a[1];
        trainingData = trainingData.map(function (row) { row.output = row.output.map(function (x) { return (x - outMin) / (outMax - outMin); }); return row; });
        var config = {
            activation: this.options.activation,
            hiddenLayers: this.layers,
            leakyReluAlpha: this.options.leakyReluAlpha,
            learningRate: this.options.learningRate,
            iterations: this.options.iterations,
            errorThresh: this.options.errorThresh,
            momentum: this.options.momentum,
            logPeriod: this.options.logPeriod,
            timeout: this.options.timeout
        };
        this.trainNeuralNetwork(trainingData, config).then(function (_a) {
            var trainingResults = _a.trainingResults, json = _a.json;
            console.log("training done. Results:");
            console.log(trainingResults);
            _this.trainingResults = trainingResults;
            console.log(json);
            var netJSON = json;
            var networkData = {
                minMax: _this.minMax,
                netJSON: netJSON
            };
            _this.stateMachine.setVariable("NeuralNetwork." + _this.network, networkData);
        });
    };
    neuralModal = __decorate([
        Component({
            selector: "neuralModal",
            templateUrl: "neural.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            ViewController,
            StateMachine])
    ], neuralModal);
    return neuralModal;
}());
export { neuralModal };
var portModal = /** @class */ (function () {
    function portModal(params, viewCtrl, events) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.events = events;
        this.bot = params.get("bot");
        this.name = params.get("name");
        this.state = params.get("state");
        this.mode = this.state == 1 ? 0 : 1;
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
    portModal.prototype.importFile = function (file) {
        var _this = this;
        var reader = new FileReader();
        file = file.target.files[0];
        reader.onload = function () {
            //reader.result
            var U8 = new Uint8Array(reader.result);
            var decompressed = fflate.decompressSync(U8);
            var bot = fflate.strFromU8(decompressed);
            _this.events.publish("loadBotFile", JSON.parse(bot));
            _this.viewCtrl.dismiss();
        };
        reader.onerror = function () {
            console.error(reader.error);
        };
        reader.readAsArrayBuffer(file);
    };
    portModal.prototype.downloadBot = function () {
        var downloadBlob, downloadURL;
        downloadBlob = function (data, fileName, mimeType) {
            if (mimeType === void 0) { mimeType = "application/octet-stream"; }
            var blob, url;
            blob = new Blob([data], {
                type: mimeType
            });
            url = window.URL.createObjectURL(blob);
            downloadURL(url, fileName);
            setTimeout(function () {
                return window.URL.revokeObjectURL(url);
            }, 1000);
        };
        downloadURL = function (data, fileName) {
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
        console.log(str.length);
        var buf = fflate.strToU8(str);
        var compressed = fflate.compressSync(buf, { level: 4, mem: 4 });
        downloadBlob(compressed, this.name + ".tradebot");
    };
    portModal = __decorate([
        Component({
            selector: "portModal",
            templateUrl: "port.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            ViewController,
            Events])
    ], portModal);
    return portModal;
}());
export { portModal };
var BaklavaPage = /** @class */ (function () {
    function BaklavaPage(navCtrl, params, events, alertCtrl, modalCtrl, baklava, stateMachine) {
        //document.getElementsByClassName('background')[0].style.backgroundColor='purple !important'
        var _this = this;
        this.navCtrl = navCtrl;
        this.params = params;
        this.events = events;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.baklava = baklava;
        this.stateMachine = stateMachine;
        this.running = false;
        this.nextDay = false;
        this.sameness = false;
        this.offset = false;
        this.preSimState = {};
        this.gains = 0;
        this.currentTime = new Date().getTime();
        this.gainsInit = [];
        this.errors = 0;
        this.traceInfo = null;
        this.tutState = -1;
        this.testState = BaklavaState.getState("testState");
        this.unlockState = BaklavaState.getState("unlock");
        this.portState = BaklavaState.getState("portState");
        if (typeof this.unlockState == 'undefined') {
            console.error('Baklava Unlock State Undefined');
        }
        var traceInfo = params.get("traceInfo");
        console.log("traceinfo:", traceInfo);
        if (traceInfo) {
            var bck = document.getElementsByClassName('background');
            this.traceInfo = traceInfo;
            setTimeout(function () { if (bck[0]) {
                bck[0].style.backgroundColor = '#292b36';
            } }, 10);
            setTimeout(function () { if (bck[0]) {
                bck[0].style.backgroundColor = '#292b36';
            } }, 100);
            setTimeout(function () { if (bck[0]) {
                bck[0].style.backgroundColor = '#292b36';
            } }, 500);
        }
        this.botDefinition = params.get("bot");
        this.date = params.get("date");
        this.cashVsInvested = params.get("cashVsInvested");
        this.currPrice = params.get("currPrice");
        this.limDeduction = params.get("limDeduction");
        this.longVsShort = params.get("longVsShort");
        this.portfolio = params.get("portfolio");
        //console.error(this.date);
        this.ticker = params.get("tick");
        var tutParam = params.get("tutState");
        if (tutParam) {
            this.tutState = tutParam;
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
        console.log(this.botDefinition.data);
        if (this.botDefinition.data) {
            console.log("load", this.botDefinition.data);
            setTimeout(function () { _this.editor.load(_this.botDefinition.data); }, 0);
        }
    }
    BaklavaPage.prototype.setLiveView = function (bool) {
        if (bool) {
            Array.from(document.querySelectorAll(".liveValue")).forEach(function (el) { return el.style.visibility = "inherit"; });
        }
        else {
            Array.from(document.querySelectorAll(".liveValue")).forEach(function (el) { return el.style.visibility = "hidden"; });
            ["trueConnection", "falseConnection"].forEach(function (connClass) { return Array.from(document.querySelectorAll("." + connClass)).forEach(function (conn) { return conn.classList.remove(connClass); }); });
        }
    };
    BaklavaPage.prototype.openLink = function (link, self) {
        if (self === void 0) { self = false; }
        window.open(link, self ? "_self" : "_blank", "frame=true,nodeIntegration=no");
    };
    BaklavaPage.prototype.docs = function () {
        alert('link to documentation');
    };
    BaklavaPage.prototype.loadExample = function (id) {
        alert('load example id: ' + id);
    };
    BaklavaPage.prototype.modeChng = function (e) {
        this.botDefinition.sim = 0;
        if (this.botDefinition.gains === null || e == 0 || e == 2) {
            this.botDefinition.gains = true;
        }
        this.events.publish("paperState", e);
    };
    BaklavaPage.prototype.countErrors = function () {
        var _this = this;
        var errs = 0;
        this.botDefinition.logs.forEach(function (log) {
            if (!(_this.botDefinition.logSeen && _this.botDefinition.logSeen > log.timestamp)) {
                if (log.type == 2) {
                    errs++;
                }
            }
        });
        this.errors = errs;
    };
    BaklavaPage.prototype.onBaklavaClick = function () {
        console.error('booooom');
    };
    BaklavaPage.prototype.initLine = function () {
        var timeFormat = 'YYYY-MM-DD';
        var chart = {
            type: 'line',
            data: {
                datasets: [{ data: this.gainsInit }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                    point: {
                        radius: 0
                    }
                },
                title: {
                    display: false,
                    text: "Chart.js Time Scale"
                },
                scales: {
                    xAxes: [{
                            type: "time",
                            time: {
                                format: timeFormat,
                                tooltipFormat: 'll'
                            },
                            scaleLabel: {
                                display: false,
                                labelString: 'Date'
                            }
                        }],
                    yAxes: [{
                            scaleLabel: {
                                display: false,
                                labelString: 'value'
                            }
                        }]
                }
            }
        };
        // @ts-ignore
        //chart.data.datasets[0].backgroundColor="rgba(0,0,0,0)"
        // @ts-ignore
        chart.data.datasets[0].borderColor = "rgba(255,0,0,.8)";
        this.testCanvasChart = new Chart(this.testCanvas.nativeElement, chart);
    };
    BaklavaPage.prototype.gainsButton = function () {
        this.botDefinition.gains = !this.botDefinition.gains;
        if (this.botDefinition.gains && this.gainsInit.length > 1) {
            this.initLine();
        }
        else if (!this.botDefinition.gains) {
            // DESTROY CHART
            if (this.testCanvasChart) {
                this.testCanvasChart.destroy();
            }
        }
    };
    BaklavaPage.prototype.pushGainsChart = function (x, y) {
        if (this.botDefinition.gains) {
            if (this.testCanvasChart) {
                this.testCanvasChart.data.datasets[0].data.push({ x: x, y: y });
                this.testCanvasChart.update();
            }
            else {
                if (this.gainsInit.length == 0) {
                    this.gainsInit.push({ x: x, y: y });
                }
                else {
                    this.gainsInit.push({ x: x, y: y });
                    this.initLine();
                }
            }
        }
        else {
            this.gainsInit.push({ x: x, y: y });
        }
    };
    BaklavaPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        if (this.traceInfo) {
            if (document.querySelectorAll('.node-editor').length > 1) {
                this.editorCut = document.querySelector(".node-editor");
                this.editorCut.parentElement.removeChild(this.editorCut);
            }
        }
        this.testState = BaklavaState.getState("testState");
        this.unlockState = BaklavaState.getState("unlock");
        this.portState = BaklavaState.getState("portState");
        this.events.subscribe("baklavaGains", function (cumGain, date, tick, cashv, currpri, limdeduct, longshort, portfolio) {
            //console.error('fires')
            date = new Date(date).toISOString().split('T')[0];
            _this.date = date;
            _this.cashVsInvested = cashv;
            _this.currPrice = currpri;
            _this.limDeduction = limdeduct;
            _this.longVsShort = longshort;
            _this.portfolio = portfolio;
            //console.error(this.cashVsInvested,this.currPrice,this.limDeduction,this.longVsShort)
            _this.nextDay = true;
            if (_this.nextDayTimeout) {
                clearTimeout(_this.nextDayTimeout);
            }
            _this.nextDayTimeout = setTimeout(function () {
                _this.nextDay = false;
            }, 300);
            _this.ticker = tick;
            if (!_this.offset) {
                _this.offset = cumGain;
            }
            _this.gains = cumGain - _this.offset;
            //console.log("cumulative gains from home.ts",this.gains)
            _this.pushGainsChart(date, _this.gains);
        });
        this.events.subscribe("endBacktest", function () {
            _this.running = false;
            _this.botDefinition.logs.push({ type: 2, message: "Backtest has completed", timestamp: new Date().getTime() });
            _this.botDefinition.mode = 1;
        });
        this.events.subscribe("loadBotFile", function (bot) {
            _this.editor.load(bot);
        });
        this.events.subscribe("newLogBaklava", function (log) {
            var view = _this.navCtrl.getActive().component.name;
            var logObj = log; //process Log from Jitin
            // why is this fired twice??
            if (view == "BaklavaPage") {
                console.log(logObj);
                _this.botDefinition.logs.push(logObj);
                console.log(_this.botDefinition.logs);
                //this.advancedBots[this.activeBot].logs.push(logObj)
                _this.countErrors();
            }
        });
        this.events.subscribe("colorBooleanNodes", function () {
            _this.setLiveView(true);
            _this.colorBooleanNodes();
        });
    };
    BaklavaPage.prototype.ionViewWillLeave = function () {
        var _this = this;
        document.querySelector(".node-editor").removeEventListener("mousedown", this.onBaklavaClick);
        ["newLogBaklava", "loadBotFile", "endBacktest", "baklavaGains", "colorBooleanNodes"].forEach(function (event) {
            _this.events.unsubscribe(event);
        });
    };
    BaklavaPage.prototype.ionViewDidLeave = function () {
        if (this.editorCut) {
            document.querySelector("page-baklava").appendChild(this.editorCut);
            this.editorCut = null;
        }
    };
    BaklavaPage.prototype.ngOnInit = function () {
        var _this = this;
        this.editor = this.baklava.initEditor(this.botDefinition.name, this.baklavaEl);
        window["editor"] = this.editor;
        this.stateMachine.baklavaInited = true;
        this.events.subscribe("requestTrace", function () {
            var trace = _this.editor.save();
            _this.events.publish("trace", trace);
        });
        this.events.subscribe("compileSimpleBot", function (definition, name) {
            _this.compileSimpleBot(definition, name);
        });
    };
    BaklavaPage.prototype.ngOnDestroy = function () {
        this.baklava.unmount(this.botDefinition.name);
    };
    BaklavaPage.prototype.addNodeWithCoordinates = function (nodeType, x, y) {
        var n = new nodeType();
        this.editor.addNode(n);
        n.position.x = x;
        n.position.y = y;
        return n;
    };
    BaklavaPage.prototype.node = function (type) {
        return Nodes[type];
    };
    BaklavaPage.prototype.strippedState = function () {
        var state = this.editor.save();
        delete state.panning;
        delete state.scaling;
        state.nodes.forEach(function (node) {
            delete node.position;
            node.interfaces.forEach(function (intr) {
                delete intr[1].value;
            });
        });
        return JSON.stringify(state);
    };
    BaklavaPage.prototype.sim = function () {
        var _this = this;
        if (this.editor.nodes.length == 0) {
            return;
        }
        if (this.botDefinition.sim !== 0) {
            this.running = !this.running;
            if (this.running) {
                // start checking
                this.preSimState = this.strippedState();
                this.stateInterval = setInterval(function () {
                    if (_this.strippedState() !== _this.preSimState) {
                        console.error("pause sim, bot changed");
                        _this.sim();
                    }
                    // compare this.strippedState() to this.reSimState;
                }, 500); // interval duration
            }
            else {
                if (this.stateInterval) {
                    clearInterval(this.stateInterval);
                }
            }
        }
        //this.setLiveView(true);
        this.events.publish("simFromBaklava", this.running, this.botDefinition.sim, this.botDefinition.mode == 0);
    };
    BaklavaPage.prototype.train = function () {
        this.trainModal = this.modalCtrl.create(neuralModal, {}, { cssClass: 'learnModal' });
        this.trainModal.present();
    };
    BaklavaPage.prototype.port = function () {
        this.portModal = this.modalCtrl.create(portModal, {
            bot: this.editor.save(),
            name: this.botDefinition.name,
            state: this.portState
        }, { cssClass: 'learnModal' });
        this.portModal.present();
    };
    BaklavaPage.prototype.isSame = function () {
        if (this.traceInfo) {
            return true;
        }
        console.log(this.botDefinition.data);
        var state = this.editor.save();
        if (typeof this.botDefinition.data == 'undefined') {
            return false;
        }
        else {
            var tempState = JSON.parse(JSON.stringify(state.nodes));
            var tempDef = JSON.parse(JSON.stringify(this.botDefinition.data.nodes));
            tempState.forEach(function (object) {
                //delete object['state'];
                delete object['position'];
                object['interfaces'].forEach(function (inter) {
                    delete inter[1]['value'];
                });
            });
            tempDef.forEach(function (object) {
                //delete object['state'];
                delete object['position'];
                object['interfaces'].forEach(function (inter) {
                    delete inter[1]['value'];
                });
            });
            return JSON.stringify(tempState) == JSON.stringify(tempDef);
        }
    };
    BaklavaPage.prototype.checkSameness = function () {
        this.sameness = this.isSame();
    };
    BaklavaPage.prototype.backBtn = function () {
        // console.log(this.isSame(),JSON.stringify(this.editor.save()))
        if (this.traceInfo) {
            this.traceInfo = null;
            this.navCtrl.pop();
            return;
            // re-load bot back from stack trace
        }
        if (this.editor.nodes.length == 0) {
            this.back(true);
        }
        else if (this.isSame()) {
            this.back(true);
        }
    };
    BaklavaPage.prototype.openLog = function () {
        /*
        this.botDefinition.logSeen=new Date().getTime();
        this.errors=0;
        
            this.logModal = this.modalCtrl.create(logsModal, {
              log: this.botDefinition.logs,
              name: this.botDefinition.name
            });
            this.logModal.present();
        */
        var log = this.modalCtrl.create(logsModal, { log: this.botDefinition.logs, name: this.botDefinition.name }, { cssClass: '' });
        log.present();
    };
    BaklavaPage.prototype.customNode = function () {
        alert('prompt user to select at least 2 nodes :: a nested fabrication and an expand icon');
    };
    BaklavaPage.prototype.addNode = function (type) {
        var newNode = this.addNodeWithCoordinates(this.node(type), this.randVal(true), this.randVal(false));
        return newNode;
    };
    BaklavaPage.prototype.randVal = function (x) {
        console.log(window.innerWidth);
        var padding = 500;
        var val;
        if (x) {
            val = Math.floor(Math.random() * (window.innerWidth - padding) + padding / 10);
        }
        else {
            val = Math.floor(Math.random() * (window.innerHeight - padding / 2) + padding / 10);
        }
        return val;
    };
    BaklavaPage.prototype.logObj = function () {
        console.log(this.editor.save());
    };
    BaklavaPage.prototype.revert = function () {
        this.editor.load(this.botDefinition.data);
    };
    BaklavaPage.prototype.back = function (discard) {
        if (discard === void 0) { discard = false; }
        if (this.botDefinition.mode !== 1) {
            this.events.publish("paperState", 0);
            this.botDefinition.mode = 1;
        }
        if (!discard) {
            this.botDefinition.data = this.editor.save();
            this.events.publish("saveBot", [this.botDefinition.name, this.botDefinition]);
        }
        console.log(this.botDefinition.data);
        if (this.running) {
            this.events.publish("startStop", false, null, null);
            if (this.stateInterval) {
                clearInterval(this.stateInterval);
            }
        }
        if (this.traceInfo) {
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
    };
    BaklavaPage.prototype.debug = function () {
        this.back(false);
        //console.log(this.editor)
    };
    BaklavaPage.prototype.addNodeToGrid = function (nodeType, x, y) {
        return this.addNodeWithCoordinates(this.node(nodeType), x, y);
    };
    BaklavaPage.prototype.compileSimpleBot = function (definition, name) {
        var botDefinition = createSimpleBot(definition, this.editor, this.addNodeToGrid.bind(this), name);
        this.events.publish("saveBot", [DefaultSimpleBotName, { data: botDefinition, gains: null, logs: [], mode: 1, name: DefaultSimpleBotName, sim: 0, tutState: -1 }]);
    };
    BaklavaPage.prototype.ionViewDidEnter = function () {
        if (this.traceInfo) {
            this.highlightTraceNodes();
        }
        else {
            this.onBaklavaClick = this.onBaklavaClick.bind(this);
            document.querySelector(".node-editor").addEventListener("mousedown", this.onBaklavaClick, false);
        }
    };
    BaklavaPage.prototype.colorBooleanNodes = function () {
        var _this = this;
        function colorConnection(i, bool) {
            var conns = Array.from(document.querySelectorAll('.connection'));
            if (conns.length > 0) {
                conns[i].classList.add(bool + "Connection");
                conns[i].classList.remove(!bool + "Connection");
            }
        }
        this.editor.connections.map(function (conn) { return (_this.editor.findNodeInterface(conn.from.id).value); }).forEach(function (val, i) { if (val === true)
            colorConnection(i, true); if (val === false)
            colorConnection(i, false); });
    };
    BaklavaPage.prototype.highlightTraceNodes = function () {
        var _this = this;
        var nodeID = this.traceInfo.nodeID;
        var nodeEls = Array.from(document.querySelectorAll(".node-container>.node"));
        var connectionEls = Array.from(document.querySelectorAll(".connections-container path"));
        nodeEls.forEach(function (x) { return x.style.opacity = "0.3"; });
        connectionEls.forEach(function (x) { return x.style.opacity = "0.3"; });
        var highlightPath = function (id) {
            var el = document.querySelector("#".concat(id));
            el.style.opacity = "0.7";
            var connections = _this.editor.connections.map(function (conn, i) { return (__assign(__assign({}, conn), { i: i })); });
            var connectionsToNode = connections.filter(function (conn) { return conn.to.parent.id == id; });
            connectionsToNode.forEach(function (conn) {
                var i = conn.i;
                connectionEls[i].style.opacity = "0.7";
                connectionEls[i].style.filter = "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)";
            });
            var nodesToNode = connectionsToNode.map(function (conn) { return conn.from.parent.id; });
            nodesToNode.forEach(function (nodeID) { return highlightPath(nodeID); });
        };
        var stopNodeInteractivity = function (id) {
            var titleEls = Array.from(document.querySelectorAll("#".concat(id, ">.__title *")));
            var contentEls = Array.from(document.querySelectorAll("#".concat(id, ">.__content *")));
            var els = titleEls.concat(contentEls);
            els.forEach(function (el) {
                el.style.cursor = "not-allowed";
                el.style.pointerEvents = "none";
            });
        };
        highlightPath(nodeID);
        nodeEls.forEach(function (el) {
            var id = el.id;
            stopNodeInteractivity(id);
        });
        var nodeEL = document.querySelector("#".concat(nodeID));
        nodeEL.style.opacity = "1";
    };
    __decorate([
        ViewChild("baklava"),
        __metadata("design:type", ElementRef)
    ], BaklavaPage.prototype, "baklavaEl", void 0);
    __decorate([
        ViewChild("testCanvas"),
        __metadata("design:type", Object)
    ], BaklavaPage.prototype, "testCanvas", void 0);
    BaklavaPage = __decorate([
        Component({
            selector: "page-baklava",
            templateUrl: "baklava.html",
        }),
        __metadata("design:paramtypes", [NavController, NavParams, Events, AlertController, ModalController, BaklavaProvider, StateMachine])
    ], BaklavaPage);
    return BaklavaPage;
}());
export { BaklavaPage };
//# sourceMappingURL=baklava.js.map