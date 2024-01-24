import { ElementRef, Injectable } from '@angular/core';
import { Engine } from "@baklavajs/plugin-engine";
import { Editor } from "@baklavajs/core";
import { ViewPlugin, BaklavaVuePlugin } from "@baklavajs/plugin-renderer-vue";
import Vue from 'vue';
import { OptionPlugin } from "@baklavajs/plugin-options-vue";

import CustomNodeView from '../../pages/baklava/customNode';
import * as Nodes from '../../providers/nodes';
import { Events } from 'ionic-angular';
import { EngineData } from "../../providers/nodes/types";
import { StateMachine } from '../state-machine/state-machine';
import { Definition } from '@angular/core/src/view';





/*
  Generated class for the BaklavaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BaklavaProvider {
  editors: { [name: string]: Editor } = {};
  engines: { [name: string]: Engine } = {};
  vueInstances: { [name: string]: Vue } = {};
  viewPlugins: { [name: string]: ViewPlugin } = {};

  constructor(private events: Events, private stateMachine: StateMachine) {
    Vue.use(BaklavaVuePlugin);
  }

  public async engineCalculate(data: EngineData): Promise<void> {
    const engine = this.engines[this.stateMachine.activeBotName];
    if (!engine) {
      console.warn("no engine!")
      return;
    }
    if (this.stateMachine.getVariable("Stopped")) {
      if (this.stateMachine.getVariable("restartIndex") && data.dateKeyIndex >= this.stateMachine.getVariable("restartIndex")) {
        this.stateMachine.setVariable("Stopped", false);
        this.stateMachine.setVariable("restartIndex", null)
      }
      if (this.stateMachine.getVariable("restartDate")) {
        const currentDate: Date = data.currentData[data.dateKeyIndex].date;
        if (currentDate >= this.stateMachine.getVariable("restartDate")) {
          this.stateMachine.setVariable("Stopped", false);
          this.stateMachine.setVariable("restartDate", null);
          return;
        }
      }
    }
    if (this.stateMachine.getVariable("Stopped")) {
      console.log("not calculating as stopped!!")
      return;
    }

    // let t0 = performance.now();
    this.stateMachine.pauseFlag = false;
    await engine.calculate(data);
    this.stateMachine.paused = this.stateMachine.pauseFlag;
    // let t1 = performance.now();
    // console.log(`inner loop of bot took ${(t1 - t0)} milliseconds.`)
    this.events.publish("colorBooleanNodes");

    //trace logs
    await this.stateMachine.saveTrace(data);

    return;
    //engine.hooks.gatherCalculationData.untap(this);
    // engine.hooks.gatherCalculationData.tap(this, () => {
    //   // return the data you want to pass to all nodes
    //   // you can return whatever you want and all nodes will receive this value as a parameter in their calculate function
    //   console.log("running bot " + stateMachine.activeBotName + "'s engine with object: ", data)
    //   return data;
    // });
  }

  public editor(name: string): Editor {
    return this.editors[name];
  }

  public engine(name: string): Engine {
    return this.engines[name];
  }

  public initEditor(name: string, el: ElementRef): Editor {
    if (this.editors[name]) {
      this.mount(el, name);
      return this.editors[name];
    }
    const editor = new Editor();
    this.editors[name] = editor;

    const engine = this.engines[name] || new Engine(false);
    this.engines[name] = engine;
    editor.use(engine);

    const viewPlugin = this.viewPlugins[name] || new ViewPlugin();
    this.viewPlugins[name] = viewPlugin;
    viewPlugin.components.node = CustomNodeView as any;
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
  }

  private checkConnections(editor: Editor) {
    editor.events.beforeAddConnection.addListener(this, ({ from, to }) => {
      let toName = to.parent.constructor.name;
      let fromName = from.parent.constructor.name;

      if (toName == "RangeNode") {
        if (fromName != "ValNode" && fromName != "AdvValNode") {
          return false;
        }
      }
    });
  }

  public unmount(name: string) {
    if (this.vueInstances[name]) {
      this.vueInstances[name].$destroy();
      this.vueInstances[name] = null;
    }
  }

  private mount(el: ElementRef, name: string) {
    const editor = this.editors[name];
    const engine = this.engines[name];
    const viewPlugin = this.viewPlugins[name];
    const vue = new Vue({
      data() {
        return {
          viewPlugin: viewPlugin,
          editor: editor,
          engine: engine,
        };
      },
      render(createElement) {
        return createElement("baklava-editor", {
          props: {
            plugin: this.viewPlugin,
          },
        });
      },
      created() {
      }
    }).$mount(el.nativeElement);
    this.vueInstances[name] = vue;
  }


  public deleteBot(name) {
    this.unmount(name);
    this.editors[name] = null;
    this.viewPlugins[name] = null;
    this.engines[name] = null;
    this.vueInstances[name] = null;
  }

}

