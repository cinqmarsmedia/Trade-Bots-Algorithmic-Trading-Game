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
import { Injectable } from '@angular/core';
import { Engine } from "@baklavajs/plugin-engine";
import { Editor } from "@baklavajs/core";
import { ViewPlugin, BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import Vue from 'vue';
import { OptionPlugin } from "@baklavajs/plugin-options-vue";
import CustomNodeView from '../../pages/baklava/customNode';
import * as Nodes from '../../providers/nodes';
import { Events } from 'ionic-angular';
import { StateMachine } from '../state-machine/state-machine';
/*
  Generated class for the BaklavaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var BaklavaProvider = /** @class */ (function () {
    function BaklavaProvider(events, stateMachine) {
        this.events = events;
        this.stateMachine = stateMachine;
        this.editors = {};
        this.engines = {};
        this.vueInstances = {};
        this.viewPlugins = {};
        Vue.use(BaklavaVuePlugin);
    }
    BaklavaProvider.prototype.engineCalculate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var engine, currentDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        engine = this.engines[this.stateMachine.activeBotName];
                        if (!engine) {
                            console.warn("no engine!");
                            return [2 /*return*/];
                        }
                        if (this.stateMachine.getVariable("Stopped")) {
                            if (this.stateMachine.getVariable("restartIndex") && data.dateKeyIndex >= this.stateMachine.getVariable("restartIndex")) {
                                this.stateMachine.setVariable("Stopped", false);
                                this.stateMachine.setVariable("restartIndex", null);
                            }
                            if (this.stateMachine.getVariable("restartDate")) {
                                currentDate = data.currentData[data.dateKeyIndex].date;
                                if (currentDate >= this.stateMachine.getVariable("restartDate")) {
                                    this.stateMachine.setVariable("Stopped", false);
                                    this.stateMachine.setVariable("restartDate", null);
                                    return [2 /*return*/];
                                }
                            }
                        }
                        if (this.stateMachine.getVariable("Stopped")) {
                            console.log("not calculating as stopped!!");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, engine.calculate(data)];
                    case 1:
                        _a.sent();
                        this.events.publish("colorBooleanNodes");
                        //trace logs
                        return [4 /*yield*/, this.stateMachine.saveTrace(data)];
                    case 2:
                        //trace logs
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaklavaProvider.prototype.editor = function (name) {
        return this.editors[name];
    };
    BaklavaProvider.prototype.engine = function (name) {
        return this.engines[name];
    };
    BaklavaProvider.prototype.initEditor = function (name, el) {
        if (this.editors[name]) {
            this.mount(el, name);
            return this.editors[name];
        }
        var editor = new Editor();
        this.editors[name] = editor;
        var engine = this.engines[name] || new Engine(false);
        this.engines[name] = engine;
        editor.use(engine);
        var viewPlugin = this.viewPlugins[name] || new ViewPlugin();
        this.viewPlugins[name] = viewPlugin;
        viewPlugin.components.node = CustomNodeView;
        viewPlugin.enableMinimap = true;
        editor.use(viewPlugin);
        // The option plugin provides some default option UI elements
        editor.use(new OptionPlugin());
        // Show a minimap in the top right corner
        // register the nodes we have defined, so they can be
        // added by the user as well as saved & loaded.
        editor.registerNodeType("MathNode", Nodes.MathNode, "Value");
        editor.registerNodeType("ConstantNode", Nodes.ConstantNode, "Value");
        editor.registerNodeType("ValNode", Nodes.ValNode, "Value");
        editor.registerNodeType("AdvValNode", Nodes.AdvValNode, "Value");
        editor.registerNodeType("LeadValNode", Nodes.LeadValNode, "Value");
        editor.registerNodeType("ConditionalNode", Nodes.ConditionalNode, "Operation");
        editor.registerNodeType("LogicNode", Nodes.LogicNode, "Operation");
        editor.registerNodeType("TradeNode", Nodes.TradeNode, "Action");
        editor.registerNodeType("TrainNode", Nodes.TrainNode, "Action");
        editor.registerNodeType("LimitNode", Nodes.TradeNode, "Action");
        editor.registerNodeType("RangeNode", Nodes.RangeNode, "Operation");
        editor.registerNodeType("MetaNode", Nodes.MetaNode, "Value");
        editor.registerNodeType("SetVarNode", Nodes.SetVarNode, "Action");
        editor.registerNodeType("GetVarNode", Nodes.GetVarNode, "Value");
        editor.registerNodeType("NetworkNode", Nodes.NetworkNode, "Operation");
        editor.registerNodeType("StopNode", Nodes.StopNode, "Action");
        editor.registerNodeType("SwitchNode", Nodes.SwitchNode, "Action");
        this.mount(el, name);
        this.checkConnections(editor);
        return editor;
    };
    BaklavaProvider.prototype.checkConnections = function (editor) {
        editor.events.beforeAddConnection.addListener(this, function (_a) {
            var from = _a.from, to = _a.to;
            var toName = to.parent.constructor.name;
            var fromName = from.parent.constructor.name;
            if (toName == "RangeNode") {
                if (fromName != "ValNode" && fromName != "AdvValNode") {
                    return false;
                }
            }
        });
    };
    BaklavaProvider.prototype.unmount = function (name) {
        if (this.vueInstances[name]) {
            this.vueInstances[name].$destroy();
            this.vueInstances[name] = null;
        }
    };
    BaklavaProvider.prototype.mount = function (el, name) {
        var editor = this.editors[name];
        var engine = this.engines[name];
        var viewPlugin = this.viewPlugins[name];
        var vue = new Vue({
            data: function () {
                return {
                    viewPlugin: viewPlugin,
                    editor: editor,
                    engine: engine,
                };
            },
            render: function (createElement) {
                return createElement("baklava-editor", {
                    props: {
                        plugin: this.viewPlugin,
                    },
                });
            },
            created: function () {
            }
        }).$mount(el.nativeElement);
        this.vueInstances[name] = vue;
    };
    BaklavaProvider.prototype.deleteBot = function (name) {
        this.unmount(name);
        this.editors[name] = null;
        this.viewPlugins[name] = null;
        this.engines[name] = null;
        this.vueInstances[name] = null;
    };
    BaklavaProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Events, StateMachine])
    ], BaklavaProvider);
    return BaklavaProvider;
}());
export { BaklavaProvider };
//# sourceMappingURL=baklava.js.map