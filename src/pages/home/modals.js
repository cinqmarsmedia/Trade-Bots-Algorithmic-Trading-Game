var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
//import { rawData } from "./../../constants";
import { AlertController, NavParams, Content, ModalController } from "ionic-angular";
import { Events } from "ionic-angular";
import { ViewController } from "ionic-angular";
import { Chart } from "chart.js";
import { indicatorData, emailDomainBlacklist } from "./../../constants";
import { DragulaService } from "ng2-dragula";
import { StateMachine } from "../../providers/state-machine/state-machine";
//declare const Huebee: any;
var upgradesModal = /** @class */ (function () {
    function upgradesModal(params, events, viewCtrl, alertCtrl) {
        var _this = this;
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.tutState = -1;
        this.testing = false;
        this.upgrades = params.get("upgrades");
        this.earned = params.get("earned");
        this.portfolio = params.get("portfolio");
        this.avail = params.get("avail");
        this.tutState = params.get("tutState");
        this.warnings = params.get("warnings");
        this.purchased = params.get("purchasedUpgrades");
        this.max = params.get("max");
        this.progress = this.purchased.length / params.get("len") * 100;
        var numNew = 0;
        //console.log(this.upgrades);
        /**/
        this.upgrades.forEach(function (upgrade) {
            //console.log(upgrade);
            if (_this.portfolio[0] > upgrade.cost && upgrade.cost > _this.max) {
                numNew++;
            }
        });
        //console.error(numNew);
        if (numNew < 5 && numNew > 0) {
            this.scrollBottom();
        }
    }
    /*
    ngAfterContentInit(){
      console.log('fires');
        this.testing=true;
    }
    */
    upgradesModal.prototype.upgradeConfirm = function (upgrade) {
        var _this = this;
        var message = "<b>$" + upgrade.cost + "</b> will be removed from your account.";
        if (!this.earned.includes(upgrade.id)) {
            if (upgrade.reward) {
                message += " This will also unlock an opportunity to earn <b>$" + upgrade.reward + "</b> by taking a quiz on the subject.";
            }
            else {
                message += " Some upgrades will unlock an opportunity to earn money by taking a quiz, but this is <b><u>not</u></b> one of them.";
            }
        }
        else {
            message += " You have already earned the <b>$" + upgrade.reward + "</b> reward for this quiz and it has been added to your balance.";
        }
        var alert = this.alertCtrl.create({
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
                    handler: function () { },
                },
                {
                    text: "Ok",
                    handler: function (data) {
                        if (upgrade.reward) {
                            _this.warnings.upgradeConfirmRew = data.length > 0;
                            _this.buy(upgrade, false, true);
                        }
                        else {
                            _this.warnings.upgradeConfirmNoRew = data.length > 0;
                            _this.buy(upgrade, false, false, true);
                        }
                    },
                },
            ],
        });
        alert.present();
    };
    upgradesModal.prototype.scrollBottom = function (time) {
        var _this = this;
        if (time === void 0) { time = 2000; }
        setTimeout(function () {
            if (_this.content && _this.content.scrollToBottom) {
                _this.content.scrollToBottom(time); //300ms animation speed
            }
        }, 100);
    };
    upgradesModal.prototype.buy = function (upgrade, override50, overrideRew, ovverrideNoRew) {
        //this.buyReal(upgrade)
        var _this = this;
        if (override50 === void 0) { override50 = false; }
        if (overrideRew === void 0) { overrideRew = false; }
        if (ovverrideNoRew === void 0) { ovverrideNoRew = false; }
        var requisites = { 'limitstop': 'price', 'multipleMA': 'customMA', 'customMA': 'ema', 'ema': 'sma', 'simpleBots2': 'simpleBots', 'simpleBots3': 'simpleBots2', 'gains': 'brushing', 'vizBots4': 'vizBots3', 'vizBots3': 'vizBots2', 'vizBots2': 'vizBots', 'vizBots': 'simpleBots' };
        if (requisites[upgrade.id] && !this.purchased.includes(requisites[upgrade.id])) {
            var reqUpgrade = this.upgrades.find(function (e) { return e.id == requisites[upgrade.id]; });
            var alert_1 = this.alertCtrl.create({
                title: "Previous Upgrade Required",
                message: 'This upgrade requires you to have purchased "' + reqUpgrade.name + '".',
                buttons: [
                    {
                        text: "Ok",
                        handler: function (data) {
                        },
                    },
                ],
            });
            alert_1.present();
            return;
        }
        if (!this.warnings.upgradeConfirmRew && upgrade.reward && !overrideRew && upgrade.cost > 0) {
            this.upgradeConfirm(upgrade);
        }
        else if (!this.warnings.upgradeConfirmNoRew && !upgrade.reward && !ovverrideNoRew && upgrade.cost > 0) {
            this.upgradeConfirm(upgrade);
        }
        else if (this.portfolio[0] / 2 <= upgrade.cost &&
            !this.warnings.fiftyper &&
            !override50 && upgrade.cost > 0) {
            var alert_2 = this.alertCtrl.create({
                title: "This will cost " +
                    Math.floor((upgrade.cost / this.portfolio[0]) * 100) +
                    "% of your wealth",
                message: "Capital is essential to momentum in your earnings. We recommend waiting to upgrade, but you are welcome to proceed.",
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
                            _this.warnings.fiftyper = data.length > 0;
                            _this.buy(upgrade, true, overrideRew, ovverrideNoRew);
                            //overrideRew:any=false, ovverrideNoRew:any=false
                        },
                    },
                ],
            });
            alert_2.present();
        }
        else if (this.portfolio[0] * (1 - this.portfolio[1]) < upgrade.cost &&
            !this.warnings.sellupgrade) {
            var alert_3 = this.alertCtrl.create({
                title: "Not Enough Cash",
                message: "You can only afford this upgrade if you sell some of the stake in your investment. Do you wish to proceed? This will not incur a transaction fee.",
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
                            _this.warnings.sellupgrade = data.length > 0;
                            _this.buyReal(upgrade);
                        },
                    },
                ],
            });
            alert_3.present();
        }
        else {
            this.buyReal(upgrade);
        }
    };
    upgradesModal.prototype.buyReal = function (upgrade) {
        // if you have the money?
        this.events.publish("upgrade", upgrade.id, upgrade.cost, this.warnings);
        // dismissModal
        this.viewCtrl.dismiss();
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", Content)
    ], upgradesModal.prototype, "content", void 0);
    upgradesModal = __decorate([
        Component({
            selector: "upgradesModal",
            templateUrl: "upgrades.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController,
            AlertController])
    ], upgradesModal);
    return upgradesModal;
}());
export { upgradesModal };
var disclaimerModal = /** @class */ (function () {
    function disclaimerModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.agree = false;
        this.mandate = false;
        this.mandate = params.get("agree");
    }
    disclaimerModal.prototype.confirm = function () {
        if (this.agree || !this.mandate) {
            this.viewCtrl.dismiss();
        }
    };
    disclaimerModal = __decorate([
        Component({
            selector: "disclaimerModal",
            templateUrl: "disclaimer.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], disclaimerModal);
    return disclaimerModal;
}());
export { disclaimerModal };
var loanModal = /** @class */ (function () {
    function loanModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.loanProposed = 0;
        this.tutState = -1;
        this.loanData = params.get("data");
        this.mystery = params.get("mystery");
        this.type = params.get("type");
        this.tutState = params.get("tutState");
        this.marginInfo = params.get("margin");
        if (this.loanData.amt == 0) {
            this.loanProposed = Math.floor(this.loanData.max / 2);
        }
        else {
            this.loanProposed = this.loanData.amt;
        }
    }
    loanModal.prototype.confirm = function () {
        this.events.publish("loan", this.loanProposed);
        this.viewCtrl.dismiss();
    };
    loanModal = __decorate([
        Component({
            selector: "loanModal",
            templateUrl: "loan.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], loanModal);
    return loanModal;
}());
export { loanModal };
var idleModal = /** @class */ (function () {
    function idleModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.data = params.get("data");
        this.maxSim = params.get("maxSim");
        this.maxReal = parseFloat(String(params.get("realSim")).replace('k', '000'));
        this.elapsed = new Date().getTime() - this.data.stamp;
        this.hrs = Math.floor(this.elapsed / 3600000);
        this.totalInterval = Math.floor(Math.pow(this.elapsed / 1000 * this.maxReal, 1 / 2));
        //console.log(this.totalInterval)
        this.skipDays = this.totalInterval;
    }
    idleModal.prototype.confirm = function () {
        this.events.publish("idle", this.skipDays);
        this.viewCtrl.dismiss();
    };
    idleModal.prototype.close = function () {
        this.viewCtrl.dismiss();
    };
    idleModal = __decorate([
        Component({
            selector: "idleModal",
            templateUrl: "idle.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], idleModal);
    return idleModal;
}());
export { idleModal };
var customDataModal = /** @class */ (function () {
    function customDataModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
    }
    customDataModal.prototype.handlePath = function (e) {
        console.log(e);
    };
    customDataModal = __decorate([
        Component({
            selector: "customDataModal",
            templateUrl: "customData.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], customDataModal);
    return customDataModal;
}());
export { customDataModal };
var logsModal = /** @class */ (function () {
    function logsModal(params, events, viewCtrl, stateMachine) {
        var _this = this;
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.stateMachine = stateMachine;
        this.filter = "all";
        this.clear = false;
        this.filteredLog = [];
        this.read = 0;
        this.supressRead = false;
        this.log = params.get("log");
        var name = params.get("name");
        if (name == "$SIMPLEBOT") {
            name = "Simple Bot";
        }
        this.name = "Simple Bot";
        if (params.get("read")) {
            this.read = params.get("read");
        }
        this.tutState = params.get("tutState");
        this.filterLog();
        viewCtrl.onDidDismiss(function () {
            if (_this.supressRead) {
                return;
            }
            if (_this.tutState == 212) {
                _this.tutState = -1;
                _this.events.publish("tutState", 213);
            }
            _this.events.publish("readLog", { name: params.get("name"), clear: _this.clear });
        });
    }
    logsModal.prototype.openStackTrace = function (log) {
        this.stateMachine.showTrace(log);
        this.supressRead = true;
        this.viewCtrl.dismiss();
    };
    logsModal.prototype.clearLog = function () {
        this.clear = true;
        this.log = [];
        this.filterLog();
    };
    logsModal.prototype.filterLog = function () {
        var _this = this;
        if (this.filter == "all") {
            this.filteredLog = JSON.parse(JSON.stringify(this.log)).reverse();
        }
        else {
            this.filteredLog = JSON.parse(JSON.stringify(this.log)).reverse().filter(function (log) {
                return log.type == parseInt(_this.filter);
            });
        }
        var dedup = [];
        var counter = 0;
        this.filteredLog.forEach(function (obj) {
            if (dedup.length == 0 || dedup[dedup.length - 1].message !== obj.message) {
                dedup.push(obj);
            }
            else {
                if (dedup[dedup.length - 1].counter) {
                    dedup[dedup.length - 1].counter++;
                }
                else {
                    dedup[dedup.length - 1].counter = 1;
                }
            }
        });
        this.filteredLog = dedup;
    };
    logsModal.prototype.deleteLogIndex = function (i) {
        console.error(i);
    };
    logsModal = __decorate([
        Component({
            selector: "LogsModal",
            templateUrl: "logs.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController,
            StateMachine])
    ], logsModal);
    return logsModal;
}());
export { logsModal };
var quizModal = /** @class */ (function () {
    function quizModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.index = 0;
        this.shuffledQuiz = [];
        this.state = [0, 0, 0, 0, 0, 0];
        this.correct = true;
        this.data = params.get("data");
        this.shuffleQuiz();
    }
    quizModal.prototype.shuffleQuiz = function () {
        var _this = this;
        this.shuffledQuiz = [];
        this.data.data.quiz.sort(function (a, b) { return 0.5 - Math.random(); }).forEach(function (question) {
            var quests = [];
            question.forEach(function (q, i) {
                if (i > 0) {
                    quests.push({ question: q, correct: i == 1 });
                }
            });
            //this.shuffledQuiz.push(quests);
            _this.shuffledQuiz.push(quests.sort(function (a, b) { return 0.5 - Math.random(); }));
        });
    };
    quizModal.prototype.answerQuestion = function (qIndx, correct) {
        for (var i = 0; i < this.shuffledQuiz[this.index].length; i++) {
            if (i !== qIndx) {
                this.state[i] = 1;
            }
            else if (correct) {
                this.state[i] = 2;
            }
            else {
                this.state[i] = 3;
            }
        }
        this.correct = correct;
    };
    quizModal.prototype.next = function () {
        this.state = [0, 0, 0, 0, 0, 0];
        if (this.correct) {
            if (this.index == this.data.data.quiz.length - 1) {
                this.events.publish("learned", this.data.name);
                this.viewCtrl.dismiss();
            }
            else {
                this.index++;
            }
        }
        else {
            this.shuffleQuiz();
            this.correct = true;
            this.index = 0;
        }
    };
    quizModal = __decorate([
        Component({
            selector: "quizModal",
            templateUrl: "quiz.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], quizModal);
    return quizModal;
}());
export { quizModal };
var tutorialModal = /** @class */ (function () {
    function tutorialModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.demo = false;
        this.demo = params.get("demo");
    }
    tutorialModal.prototype.open = function (event) {
        this.events.publish('tutState', 1);
        this.viewCtrl.dismiss();
    };
    tutorialModal.prototype.dismiss = function (tut) {
        if (tut) {
            this.events.publish("slideshow", "tutorial");
        }
        this.viewCtrl.dismiss();
    };
    tutorialModal.prototype.guide = function () {
        //this.events.publish("guide");
        this.events.publish("slideshow", "tutorial");
    };
    tutorialModal.prototype.slideshow = function () {
        //this.events.publish("guide");
        this.events.publish("slideshow", "tutorial");
        this.viewCtrl.dismiss();
    };
    tutorialModal = __decorate([
        Component({
            selector: "tutorialModal",
            templateUrl: "tutorial.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], tutorialModal);
    return tutorialModal;
}());
export { tutorialModal };
var statsModal = /** @class */ (function () {
    function statsModal(params, events, viewCtrl) {
        var _this = this;
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.AllTime = 0;
        this.chartHeight = 0;
        this.tutState = -1;
        this.stats = params.get("data");
        this.marginInfo = params.get("margin");
        this.tutState = params.get("tutState");
        this.perks = params.get("perks");
        this.asset = params.get("asset");
        this.yearReveal = params.get("yearReveal");
        this.chartHeight = Math.floor((window.innerWidth / window.innerHeight) * 100);
        this.warnThresh = String(this.marginInfo[4]);
        this.marginWarn = this.marginInfo[5];
        if (this.stats.finished > 0 && this.stats.stockTrades == 0) {
            this.AllTime = 1;
        }
        //console.log(this.tutState)
        //Math.abs(this.totalPortfolio)>this.loanData.amt*this.marginCallPercent
        //*(1-this.marginWarningThreshold)
        //this.loanData.amt*this.marginCallPercent
        if (this.marginInfo[0] && this.marginInfo[1] && this.marginInfo[3].amt > 0 || this.tutState == 51) {
            this.marginData = [Math.abs(this.marginInfo[2]) / this.marginInfo[3].amt * 100, this.marginInfo[6] * 100, this.marginInfo[3].amt * this.marginInfo[6] - Math.abs(this.marginInfo[2])];
            this.AllTime = -1;
        }
        this.drawChart(this.AllTime);
        viewCtrl.onDidDismiss(function () {
            _this.events.publish("updateMarginWarnings", [parseFloat(_this.warnThresh), _this.marginWarn]);
            if (_this.tutState == 14) {
                _this.tutState = -1;
                _this.events.publish("tutState", 15);
            }
            if (_this.tutState == 54) {
                _this.tutState = -1;
                _this.events.publish("tutState", 55);
            }
        });
    }
    statsModal.prototype.checkboxChng = function () {
        this.tutClick(51);
    };
    statsModal.prototype.tutClick = function (n) {
        if (this.tutState == n) {
            this.tutState = n + 1;
        }
    };
    statsModal.prototype.openExt = function (type) {
        if (type == 'learn') {
            this.events.publish("openModal", "learn");
        }
        else if (type == 'extras') {
            this.events.publish("openModal", "extras");
        }
        this.viewCtrl.dismiss();
    };
    statsModal.prototype.genColor = function () {
        return String(Math.floor(Math.random() * 130) + 100) + "," + String(Math.floor(Math.random() * 130) + 100) + "," + String(Math.floor(Math.random() * 130) + 100);
    };
    statsModal.prototype.drawChart = function (allTime) {
        var _this = this;
        this.AllTime = parseInt(allTime);
        if (allTime === -1) {
            return;
        }
        var timeFormat = 'YYYY-MM-DD';
        var color1 = this.genColor();
        var color2 = this.genColor();
        console.log('port hist');
        console.log(this.stats[allTime == 1 ? 'portfolioHistory' : 'stockHistory']);
        var chart = {
            type: 'line',
            data: {
                datasets: [{
                        data: this.stats[allTime == 1 ? 'portfolioHistory' : 'stockHistory'].map(function (d, i) { return ({
                            x: allTime == 1 ? (i + 1) : new Date(d.date).toISOString().split('T')[0],
                            y: d.value
                        }); })
                    }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
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
                            ticks: {
                                display: allTime == 0 && this.yearReveal
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
        chart.data.datasets[0].backgroundColor = "rgba(" + color1 + ",.1)";
        // @ts-ignore
        chart.data.datasets[0].borderColor = "rgba(" + color1 + ",.8)";
        console.log(chart.data.datasets);
        setTimeout(function () {
            //console.error("bug where I need to re-init viewChild or something....")
            _this.testCanvasChart = new Chart(_this.testCanvas.nativeElement, chart);
            //this.testCanvasChart.update();
        }, 0);
    };
    statsModal.prototype.leaderboard = function () {
        if (!this.stats.leaderUnlock) {
            return;
        }
        alert('leaderboard');
    };
    __decorate([
        ViewChild("testCanvas"),
        __metadata("design:type", Object)
    ], statsModal.prototype, "testCanvas", void 0);
    statsModal = __decorate([
        Component({
            selector: "statsModal",
            templateUrl: "stats.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], statsModal);
    return statsModal;
}());
export { statsModal };
var extrasModal = /** @class */ (function () {
    function extrasModal(params, events, viewCtrl, alertCtrl) {
        var _this = this;
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.extras = [];
        this.redeemed = [];
        this.doneArr = [];
        this.detail = false;
        this.data = params.get("data");
        this.rewards = params.get("reward");
        var id = params.get("id");
        if (id) {
            this.detail = this.data[id];
        }
        this.genExtras();
        viewCtrl.onDidDismiss(function () {
            if (_this.videoTimeout) {
                clearTimeout(_this.videoTimeout);
            }
        });
    }
    extrasModal.prototype.bck = function () {
        if (this.detail && this.detail.name == "Developer Breakdown" && this.videoTimeout) {
            clearTimeout(this.videoTimeout);
        }
        this.detail = false;
    };
    extrasModal.prototype.oppClick = function (extra) {
        var _this = this;
        if (extra.name == 'Newsletter') {
            this.newsletter();
            return;
        }
        if (extra.name == 'Developer Breakdown') {
            this.videoTimeout = setTimeout(function () {
                _this.events.publish("extraCompleted", 'breakdown');
            }, 310000);
        }
        this.detail = extra;
    };
    extrasModal.prototype.newsletter = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            cssClass: 'earlyAccessAlert',
            title: "Sign-Up for Our Newsletter",
            message: "We email about once every 3 months. Earn $" + this.data['email'].reward + " in-game. Cancel Anytime",
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
                            _this.events.publish("extraCompleted", 'email');
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
    extrasModal.prototype.generalPopup = function (title, txt) {
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
    extrasModal.prototype.genExtras = function () {
        var _this = this;
        Object.keys(this.data).forEach(function (key) {
            if (!_this.data[key].completed) {
                var obj = _this.data[key];
                obj.key = key;
                _this.extras.push(obj);
            }
            else {
                var obj = _this.data[key];
                obj.key = key;
                _this.redeemed.push(obj);
                _this.doneArr.push(key);
            }
        });
    };
    extrasModal.prototype.openLink = function (link) {
        window.open(link, link.includes('http') ? "_blank" : "_self", "frame=true,nodeIntegration=no");
    };
    extrasModal.prototype.completed = function (extra) {
        if (!window.navigator.onLine) {
            this.generalPopup("No Internet", "Requires an Internet Connection");
            return false;
        }
        this.openLink(extra.steam);
        if (!extra.completed) {
            this.events.publish("extraCompleted", extra.key);
            this.viewCtrl.dismiss();
        }
    };
    extrasModal = __decorate([
        Component({
            selector: "extrasModal",
            templateUrl: "extras.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController,
            AlertController])
    ], extrasModal);
    return extrasModal;
}());
export { extrasModal };
var helpModal = /** @class */ (function () {
    function helpModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
    }
    helpModal.prototype.openLink = function (link) {
        window.open(link, "_blank", "frame=true,nodeIntegration=no");
        this.viewCtrl.dismiss();
    };
    helpModal = __decorate([
        Component({
            selector: "helpModal",
            templateUrl: "help.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], helpModal);
    return helpModal;
}());
export { helpModal };
var indicatorModal = /** @class */ (function () {
    function indicatorModal(params, events, viewCtrl) {
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.data = params.get("indiData");
        this.indicator = params.get("indicator");
        this.data.params = Object.keys(this.data.vals);
    }
    /**/
    indicatorModal.prototype.onChange = function (val, param) {
        if (this.indicator == 'stochastic' && param == 'period') {
            param = 'periodD';
        }
        this.events.publish("updateIndicators", this.indicator, param, val);
    };
    indicatorModal.prototype.openLink = function (link) {
        window.open(link, "_blank", "frame=true,nodeIntegration=no");
    };
    indicatorModal.prototype.setDefaults = function () {
        var _this = this;
        Object.keys(indicatorData[this.indicator].vals).forEach(function (prm) {
            _this.data.vals[prm] = indicatorData[_this.indicator].vals[prm];
        });
        this.viewCtrl.dismiss();
    };
    indicatorModal = __decorate([
        Component({
            selector: "indicatorModal",
            templateUrl: "indicator.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], indicatorModal);
    return indicatorModal;
}());
export { indicatorModal };
var learnModal = /** @class */ (function () {
    function learnModal(params, events, viewCtrl, alertCtrl, modalCtrl) {
        var _this = this;
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.detail = false;
        this.passed = true;
        this.now = Date.now();
        this.availEarn = 0;
        this.old = false;
        this.pipUnlocked = false;
        this.tutState = -1;
        this.pipNew = false;
        this.learn = params.get("learn");
        this.rewatch = params.get("rewatch");
        this.availEarn = params.get("availEarn");
        this.numLearn = params.get("numLearn");
        this.pipUnlocked = params.get("pipUnlocked");
        this.tutState = params.get("tutState");
        this.pipNew = params.get("pipNew");
        viewCtrl.onDidDismiss(function () {
            if (_this.tutState == 5) {
                _this.tutState = -1;
                _this.events.publish("tutState", 6);
            }
        });
    }
    learnModal.prototype.pip = function (id) {
        this.events.publish("openPip", id);
        this.viewCtrl.dismiss();
    };
    learnModal.prototype.newQuiz = function (detail) {
        this.quizModalCtrl = this.modalCtrl.create(quizModal, {
            data: detail,
        }, { cssClass: 'quizModal' });
        this.quizModalCtrl.present();
    };
    learnModal.prototype.showQuestion = function (subject, index) {
        var _this = this;
        var alert = this.alertCtrl.create({
            enableBackdropDismiss: true, cssClass: 'questionAlert'
        });
        alert.setTitle('Question #' + (index + 1));
        alert.setMessage(subject.data.quiz[index][0]);
        var quests = [];
        //[{question:subject.quiz[index][1],correct:true},{question:subject.quiz[index][2],correct:false},{question:subject.quiz[index][3],correct:false},{question:subject.quiz[index][4],correct:false},{question:subject.quiz[index][5],correct:false}]
        subject.data.quiz[index].forEach(function (q, i) {
            if (i > 0) {
                quests.push({ question: q, correct: i == 1 });
            }
        });
        quests = quests.sort(function (a, b) { return 0.5 - Math.random(); });
        quests.forEach(function (q) {
            alert.addInput({
                type: 'radio',
                label: q.question,
                value: String(q.correct)
            });
        });
        alert.addButton({
            text: 'Answer',
            handler: function (data) {
                //console.log(data+'f');
                if (typeof data == 'undefined') {
                    return false;
                }
                else {
                    _this.passed = _this.passed && (data == 'true');
                    console.log(_this.passed);
                    if (subject.data.quiz.length == index + 1) {
                        _this.result(subject, _this.passed);
                    }
                    else {
                        _this.showQuestion(subject, index + 1);
                    }
                }
            }
        });
        alert.present();
    };
    learnModal.prototype.openDetail = function (earn, old) {
        if (old === void 0) { old = false; }
        this.detail = earn;
        this.old = old;
        //this.now=Date.now()
    };
    learnModal.prototype.result = function (subject, passed) {
        var _this = this;
        this.passed = true;
        var title = passed ? "Great Job!" : "Try Again";
        var message = passed ? ("All answers correct! $" + subject.reward + " earned") : "Quiz can be taken again in 3 minutes";
        if (passed) {
            this.events.publish("learned", subject.name);
        }
        else {
            // this.events.publish("failed", subject.name);
            var stamp = Date.now();
            this.learn.find(function (ele) {
                if (ele.name == subject.name) {
                    ele.failed = stamp;
                }
                _this.detail.failed = stamp;
            });
            //this.failedLearn.push({name:name,timestamp:stamp})
        }
        var alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: "Ok",
                    handler: function (data) {
                        if (passed) {
                            _this.viewCtrl.dismiss();
                        }
                    },
                },
            ],
        });
        alert.present();
    };
    learnModal.prototype.openLink = function (link) {
        window.open(link, "_blank", "frame=true,nodeIntegration=no");
    };
    learnModal.prototype.openLinks = function (links) {
        links = links.split(',');
        console.log(links);
        links.forEach(function (href, i) {
            console.log(href);
            setTimeout(function () {
                window.open(href, String(i + 1));
            }, 0);
        });
    };
    learnModal = __decorate([
        Component({
            selector: "learnModal",
            templateUrl: "learn.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController,
            AlertController,
            ModalController])
    ], learnModal);
    return learnModal;
}());
export { learnModal };
var simpleBotModal = /** @class */ (function () {
    function simpleBotModal(params, events, viewCtrl, alertCtrl, dragulaService) {
        //console.log(dragulaService)
        var _this = this;
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.dragulaService = dragulaService;
        this.entryorexit = true;
        this.parenthLegal = false;
        this.tutState = -1;
        viewCtrl.onDidDismiss(function () {
            _this.dragulaService.destroy('RULES');
        });
        dragulaService.drop.subscribe(function (value) {
            setTimeout(function () {
                _this.rules[_this.entryorexit ? 'entry' : 'exit'] = _this.sanitizeGroups(_this.rules[_this.entryorexit ? 'entry' : 'exit']);
            }, 0);
        });
        /*
      dragulaService.drag.subscribe((value) => {
     //if (this.game.moves<1){return}
       console.log(value);
         });
      */
        dragulaService.setOptions('RULES', {
            moves: function (el, source, handle, sibling) { return !el.classList.contains('no-drag'); }
        });
        this.entryorexit = params.get("entry");
        this.fee = params.get("fee");
        this.rules = params.get("rules");
        this.unlock = params.get("unlock");
        this.tutState = params.get("tutState");
        //this.unlock=2; // ()() debug
        if (this.rules[this.entryorexit ? 'entry' : 'exit'].length == 0) {
            this.addRule(this.entryorexit ? 'entry' : 'exit');
        }
        //this.learn = params.get("learn");
        //this.rewatch = params.get("rewatch");
    }
    simpleBotModal.prototype.onBlur = function (rule, i) {
        if (rule === null) {
            this.rules[this.entryorexit ? 'entry' : 'exit'][i][2] = 0;
        }
    };
    simpleBotModal.prototype.changeInd = function () {
        if (this.tutState == 203) {
            this.tutState = 204;
        }
    };
    simpleBotModal.prototype.addGroup = function (type) {
        this.rules[type].push(['_', 'and']);
        this.rules[type].push([
            "10SMA", type == 'entry' ? "Today" : "5 Days Ago", "3", ">",
            "10SMA", type !== 'entry' ? "Today" : "5 Days Ago", "and"
        ]);
    };
    simpleBotModal.prototype.test = function () {
        console.log('fires');
    };
    simpleBotModal.prototype.sanitizeGroups = function (arr) {
        if (arr[0][0] == '_') {
            arr.shift();
        }
        if (arr[arr.length - 1][0] == '_') {
            arr.pop();
        }
        var last = false;
        arr.forEach(function (el, i) {
            if (el[0] == '_') {
                if (last) {
                    arr.splice(i, 1);
                }
                last = true;
            }
            else {
                last = false;
            }
        });
        return arr;
    };
    simpleBotModal.prototype.rmSimpleRule = function (entry, i) {
        if (entry) {
            this.rules.entry.splice(i, 1);
        }
        else {
            this.rules.exit.splice(i, 1);
        }
        this.rules[this.entryorexit ? 'entry' : 'exit'] = this.sanitizeGroups(this.rules[this.entryorexit ? 'entry' : 'exit']);
    };
    simpleBotModal.prototype.tutClick = function (num) {
        if (this.tutState == num) {
            this.tutState = num + 1;
        }
    };
    simpleBotModal.prototype.addCondition = function (type) {
        if (this.unlock == 0) {
            return;
        }
        this.tutClick(252);
        this.addRule(type);
    };
    simpleBotModal.prototype.addRule = function (type, parenth) {
        if (parenth === void 0) { parenth = false; }
        //parenth
        if (this.tutState == 204) {
            this.tutState = 205;
        }
        if (parenth) {
            this.rules[type].push('_');
        }
        else {
            if (type == 'entry') {
                this.rules[type].push([
                    "10SMA", "Today", "3",
                    ">",
                    "10SMA", "5 Days Ago", "and"
                ]);
            }
            else {
                this.rules[type].push([
                    "10SMA", "5 Days Ago", "3",
                    ">",
                    "10SMA", "Today", "and"
                ]);
            }
        }
    };
    simpleBotModal.prototype.back = function (save) {
        if (save) {
            if (this.tutState == 206) {
                this.tutState = 207;
                this.events.publish("tutState", 208);
            }
            if (this.tutState == 258) {
                this.tutState = 259;
                this.events.publish("tutState", 260);
            }
            if (this.tutState == 209) {
                this.tutState = 210;
                this.events.publish("tutState", 211);
            }
            if (this.tutState == 306) {
                this.tutState = 307;
                this.events.publish("tutState", 308);
            }
            this.rules[this.entryorexit ? 'entry' : 'exit'].forEach(function (rule) {
                if (rule[2] === null) {
                    rule[2] = 0;
                }
                else if (typeof rule[2] == 'string') {
                    rule[2] = parseInt(rule[2]);
                }
            });
            console.log(this.rules);
            this.events.publish("saveSimpleBot", this.rules);
        }
        this.viewCtrl.dismiss();
    };
    simpleBotModal = __decorate([
        Component({
            selector: "simpleBotModal",
            templateUrl: "simpleBot.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController,
            AlertController,
            DragulaService])
    ], simpleBotModal);
    return simpleBotModal;
}());
export { simpleBotModal };
var maModal = /** @class */ (function () {
    function maModal(params, events, viewCtrl) {
        var _this = this;
        this.params = params;
        this.events = events;
        this.viewCtrl = viewCtrl;
        this.math = Math;
        this.state = params.get("state");
        this.dateIndex = params.get("dateIndex");
        var movingAvgs = params.get("ma");
        console.log(movingAvgs);
        var ma = [];
        movingAvgs.sma.forEach(function (dur, i) {
            var color = movingAvgs.smaColors[i];
            if (!color) {
                color = _this.genColor();
            }
            ma.push({ type: "sma", duration: dur, color: color.trim() });
        });
        movingAvgs.ema.forEach(function (dur, i) {
            var color = movingAvgs.emaColors[i];
            if (!color) {
                color = _this.genColor();
            }
            ma.push({ type: "ema", duration: dur, color: color.trim() });
        });
        this.ma = ma;
    }
    maModal.prototype.openLink = function (link) {
        window.open(link, "_blank", "frame=true,nodeIntegration=no");
    };
    maModal.prototype.genColor = function () {
        return "#" + String(Math.floor(Math.random() * 16777215).toString(16));
    };
    maModal.prototype.ngAfterViewInit = function () {
        this.refreshColors();
    };
    maModal.prototype.refreshColors = function () {
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
    };
    maModal.prototype.rmMA = function (index) {
        if (this.ma.length == 1) {
        }
        else {
            this.ma.splice(index, 1);
            this.save();
        }
    };
    maModal.prototype.addMA = function () {
        var _this = this;
        this.ma.push({ type: "sma", duration: 14, color: this.genColor() });
        setTimeout(function () {
            _this.refreshColors();
        }, 0);
        this.save();
    };
    maModal.prototype.onChange = function () {
        var _this = this;
        setTimeout(function () {
            _this.save();
        }, 10);
    };
    maModal.prototype.save = function () {
        var data = { sma: [], ema: [], smaColors: [], emaColors: [] };
        this.ma.forEach(function (avg, i) {
            if (!data[avg.type].includes(avg.duration)) {
                data[avg.type].push(avg.duration);
                if (avg.type == "sma") {
                    console.log(avg.color);
                    data.smaColors.push(avg.color);
                }
                else {
                    data.emaColors.push(avg.color);
                }
            }
        });
        this.events.publish("setMA", data);
    };
    maModal = __decorate([
        Component({
            selector: "maModal",
            templateUrl: "movingAvg.html",
        }),
        __metadata("design:paramtypes", [NavParams,
            Events,
            ViewController])
    ], maModal);
    return maModal;
}());
export { maModal };
//# sourceMappingURL=modals.js.map