
import { Component, Prop, Inject } from "vue-property-decorator";
import Vue from 'vue';
import * as cloneDeep from "lodash.clonedeep";
// @ts-ignore
import ClickOutside from "v-click-outside";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import { compileToFunctions } from 'vue-template-compiler';
import { e } from "@angular/core/src/render3";
import CustomNodeInterfaceView from "./customNodeInterface";
import { BaklavaState } from "../../providers/baklava-state/baklavaState";
import { AppInjector } from "../../app/app.module";
import { StateMachine } from "../../providers/state-machine/state-machine";


const notesShowIcon = "&#9999;"
const notesHideIcon = "&#9866;"


type IViewNode = any;
// import { IViewNode } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/types";

@Component({
  directives: {
    ClickOutside: ClickOutside.directive,
  },
  ...compileToFunctions(`
  <div :id="data.id" :class="classes" :style="styles">
    <div
      :class= "headerClass"
      @mousedown.self.stop="startDrag"
      @contextmenu.self.prevent="openContextMenu"
    >
      <span v-if="!renaming">{{ data.name }} 
        <span class="node-header-buttons">

          <img v-if="data.name!=='Comment' && unlockState>0" class="notes-toggle settings" v-bind:class="{'logs-on-icon pulse animated infinite':this.isLogging}" v-on:click="toggleNotes" src="assets/icon/bug.png">

          <img v-if="data.name!=='Comment'" class="dup settings" v-on:click="duplicate" src="assets/icon/dup.png">

        <img v-if="unlockState>1 && !noSettingsGear.includes(data.name)" class="notes-toggle settings" v-on:click="toggleSettings" src="assets/icon/settings.png">
          
          <img src="assets/icon/delete.png" class="node-delete" v-on:click="deleteNode">


        </span>
      </span>
      <input
        v-else
        type="text"
        class="dark-input"
        v-model="tempName"
        placeholder="Node Name"
        v-click-outside="doneRenaming"
        @keydown.enter="doneRenaming"
      />

      <component
        :is="plugin.components.contextMenu"
        v-model="contextMenu.show"
        :x="contextMenu.x"
        :y="contextMenu.y"
        :items="contextMenu.items"
        @click="onContextMenu"
      ></component>
    </div>

    <div class="__content" v-on:click="select()">
      
      <!-- Inputs -->
      <div class="__inputs" style="float:left">
        <component
          :is="plugin.components.nodeInterface"
          v-show="showInterfaceConditionally(name)"
          v-for="(input, name) in data.inputInterfaces"
          :key="input.id"
          :name="name"
          :data="input"
        ></component>
      </div>


      <!-- Outputs -->
      <div class="__outputs" style="float:right">
        <component
          :is="plugin.components.nodeInterface"
          v-show="showInterfaceConditionally(name)"
          v-for="(output, name) in data.outputInterfaces"
          :key="output.id"
          :name="name"
          :data="output"
        ></component>
      </div>
      <!-- Options -->
      <div class="__options">
        <template v-for="[name, option] in data.options">
          <component
            :is="plugin.components.nodeOption"
            :key="name" 
            :name="name"
            :option="option"
            :componentName="option.optionComponent"
            :node="data"
            v-show="showConditionally(name)"
            @openSidebar="openSidebar(name)"
          ></component>

          <portal
            :key="'sb_' + name"
            to="sidebar"
            v-if="
              plugin.sidebar.nodeId === data.id &&
              plugin.sidebar.optionName === name &&
              option.sidebarComponent
            "
          >
            <component
              :is="plugin.components.nodeOption"
              :key="data.id + name"
              :name="name"
              :option="option"
              :componentName="option.sidebarComponent"
              :node="data"
            ></component>
          </portal>
        </template>
      </div>


      


    </div>
  </div>
`)
})
class CustomNodeView extends Vue {
  stateMachine: StateMachine;
  constructor(...args: any[]) {
    super(...args);
    this.plugin.components.nodeInterface = CustomNodeInterfaceView;
  }
  @Prop({ type: Object })
  data: IViewNode;
  isLogging: boolean = false;
  showSettings: boolean = false;
  noSettingsGear: any = ['Logic Gate', 'Math', 'Network Output', 'Switch Bot', 'Constant',"Comment","Set Variable","Constant","Metadata Bool","Get Variable","Add Data Pts"]
  get unlockState() {

    return BaklavaState.getState("unlock");
  }
  BaklavaState = BaklavaState;

  @Prop({ type: Boolean, default: false })
  selected: boolean;

  @Inject("plugin")
  plugin: ViewPlugin;

  @Inject("selectedNodeViews")
  selectedNodeViews: CustomNodeView[];

  draggingStartPosition: {
    x: number;
    y: number;
  } | null = null;
  draggingStartPoint: {
    x: number;
    y: number;
  } | null = null;
  renaming = false;
  tempName = "";


  contextMenu = {
    show: false,
    x: 0,
    y: 0,
    items: [
      // { value: "rename", label: "Rename" },
      { value: "delete", label: "Delete" },
    ],
  };

  get classes() {

    function sanitizeName(name: string) {
      return name.replace(" ", "-");
    }

    return {
      node: true,
      "--selected": this.selected,
      "--dragging": !!this.draggingStartPoint,
      "--two-column": !!this.data.twoColumn,
      [`--type-${sanitizeName(this.data.type)}`]: true,
      [this.data.customClasses]: true,
    };
  }

  get headerClass() {
    return "__title node-top-header " + this.data.name
  }

  get styles() {
    return {
      top: `${this.data.position.y}px`,
      left: `${this.data.position.x}px`,
      width: `${this.data.width}px`,
    };
  }

  mounted() {
    this.stateMachine = AppInjector.get(StateMachine);
    this.data.events.addInterface.addListener(this, () => this.update());
    this.data.events.removeInterface.addListener(this, () => this.update());
    this.data.events.addOption.addListener(this, () => this.update());
    this.data.events.removeOption.addListener(this, () => this.update());
    this.plugin.hooks.renderNode.execute(this);
    this.data.events.update.addListener(this, () => {
      this["$forceUpdate"]();
    })
    this.isLogging = this.stateMachine.shouldLog(this.data.id);
    // let opts = Array.from(this.data.options)
    // opts.forEach(([_,opt])=>{
    //   if(opt.hideWhen){
    //     opt.
    //   }
    // })
  }

  updated() {
    this.plugin.hooks.renderNode.execute(this);
  }

  beforeDestroy() {
    this.data.events.addInterface.removeListener(this);
    this.data.events.removeInterface.removeListener(this);
    this.data.events.addOption.removeListener(this);
    this.data.events.removeOption.removeListener(this);
  }

  update() {
    this["$forceUpdate"]();
  }

  startDrag(ev: MouseEvent) {
    this.select();

    if (
      this.selectedNodeViews.length === 0 ||
      this.selectedNodeViews[0] === undefined
    ) {
      this.selectedNodeViews.splice(0, this.selectedNodeViews.length);
      this.selectedNodeViews.push(this);
    }

    this.selectedNodeViews.forEach((elem: any) => {
      elem.draggingStartPoint = {
        x: ev.screenX,
        y: ev.screenY,
      };
      elem.draggingStartPosition = {
        x: elem.data.position.x,
        y: elem.data.position.y,
      };
      document.addEventListener("mousemove", elem.handleMove);
      document.addEventListener("mouseup", elem.stopDrag);
    });
  }

  select() {
    this["$emit"]("select", this);
  }

  stopDrag() {
    this.selectedNodeViews.forEach((elem: any) => {
      elem.draggingStartPoint = null;
      elem.draggingStartPosition = null;
      document.removeEventListener("mousemove", elem.handleMove);
      document.removeEventListener("mouseup", elem.stopDrag);
    });
  }

  handleMove(ev: MouseEvent) {
    this.selectedNodeViews.forEach((elem: any) => {
      if (elem.draggingStartPoint) {
        const dx = ev.screenX - elem.draggingStartPoint.x;
        const dy = ev.screenY - elem.draggingStartPoint.y;
        elem.data.position.x =
          elem.draggingStartPosition.x + dx / elem.plugin.scaling;
        elem.data.position.y =
          elem.draggingStartPosition.y + dy / elem.plugin.scaling;
      }
    });
  }

  openContextMenu(ev: MouseEvent) {
    //disable right click menu by commenting out the following code:
    // this.contextMenu.show = true;
    // this.contextMenu.x = ev.offsetX;
    // this.contextMenu.y = ev.offsetY;
  }

  onContextMenu(action: string) {
    switch (action) {
      case "delete":
        this.plugin.editor.removeNode(this.data);
        break;
      case "rename":
        this.tempName = this.data.name;
        this.renaming = true;
    }
  }

  doneRenaming() {
    this.data.name = this.tempName;
    this.renaming = false;
  }

  openSidebar(optionName: string) {
    this.plugin.sidebar.nodeId = this.data.id;
    this.plugin.sidebar.optionName = optionName;
    this.plugin.sidebar.visible = true;
  }

  toggleNotes() {
    this.stateMachine.toggleLogging(this.data.id);
    this.isLogging = this.stateMachine.shouldLog(this.data.id);
  }

  duplicate() {
    const cloneNode = (i: number) => {
      let x = window["editor"].save();
      let deep = cloneDeep(x.nodes[i])

      deep.interfaces.forEach((inter: any) => {
        inter[1].id = window["editor"].generateId();
      })

      x.nodes.push({
        ...deep, position: {
          ...deep.position,
          x: deep.position.x + 50
        }, id: window["editor"].generateId()
      });
      window["editor"].load(x);
    }

    let index = window["editor"].nodes.findIndex(n => {
      return n.id == this.data.id
    });
    cloneNode(index);
  }

  randVal(x) {
    var padding = 500;
    var val
    if (x) {
      val = Math.floor(Math.random() * (window.innerWidth - padding) + padding / 10);
    } else {
      val = Math.floor(Math.random() * (window.innerHeight - padding / 2) + padding / 10);
    }

    return val;

  }

  toggleSettings() {
    this.showSettings = !this.showSettings
  }

  deleteNode() {
    this.plugin.editor.removeNode(this.data);
  }


  filterNotes(name: string) {
    //these lines commented out so that log notes would always be hidden
    // if (this.stateMachine.isLogging(this.data.id)) {
    //   return true;
    // }
    if (name.toLowerCase().includes('log')) {
      return false;
    }
    return true;
  }

  showInterfaceConditionally(name: string) {
    //console.log(this.data);
    changeDynamicInterfaces(this.data);

    let interfaceToggles = this.data.interfaceToggles;
    if (interfaceToggles) {
      //console.log(name, interfaceToggles[name])
      if (typeof interfaceToggles[name] !== 'undefined' && typeof (interfaceToggles[name] === "boolean")) {
        return interfaceToggles[name];
      }
    }
    return true;
  }


  showConditionally(currentKey: string) {
    // console.log("conditionally checking node option");



    if (!this.filterNotes(currentKey)) {
      return false;
    }


    let show = true;
    const options = Array.from(this.data.options);
    options.forEach(([key, option]) => {
      // console.log(key,option);
      if (key == "B Multiplier" && option._value !== 1) { show = true } else if (key == currentKey && option.isSetting) {
        show = this.showSettings;
      }

    })
    options.forEach(([key, option]) => {
      if (option.hideWhen) {
        let currentSelection = option._value;
        if (option.hideWhen[currentSelection]) {
          let keysToHide = option.hideWhen[currentSelection];
          if (keysToHide.some(key => key == currentKey)) {
            show = false;
          }
        }
      }
    })
    return show;
  }
}

export default CustomNodeView



function changeDynamicInterfaces(node) {
  const maxInputs = 26;

  const opts = Array.from(node.options);
  if (!opts) {
    return;
  }

  const numInputsOpt: any = opts.find(([key, data]) => {
    if (key == ("# of Inputs")) {
      return true;
    }
  })

  const triggerCond: any = opts.find(([key, data]) => {
    if (key == ("Trigger Conditionally")) {
      return true;
    }
  })



  if (numInputsOpt) {

    const numInputs = (numInputsOpt[1].value).match(/\d+/)[0];

    for (let i = 0; i < +numInputs; i++) {
      node.interfaceToggles["Input " + String.fromCharCode('A'.charCodeAt(0) + i)] = true;
    }
    for (let i = +numInputs; i < maxInputs; i++) {
      node.interfaceToggles["Input " + String.fromCharCode('A'.charCodeAt(0) + i)] = false;
    }

  }

  if (triggerCond) {
    node.interfaceToggles["If"] = triggerCond[1].value == "Dependent"
  }

}