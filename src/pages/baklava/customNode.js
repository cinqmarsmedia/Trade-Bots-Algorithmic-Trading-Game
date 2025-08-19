var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Component, Prop, Inject } from "vue-property-decorator";
import Vue from 'vue';
// @ts-ignore
import ClickOutside from "v-click-outside";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";
import { compileToFunctions } from 'vue-template-compiler';
import CustomNodeInterfaceView from "./customNodeInterface";
import { BaklavaState } from "../../providers/baklava-state/baklavaState";
import { AppInjector } from "../../app/app.module";
import { StateMachine } from "../../providers/state-machine/state-machine";
var notesShowIcon = "&#9999;";
var notesHideIcon = "&#9866;";
// import { IViewNode } from "@baklavajs/plugin-renderer-vue/dist/baklavajs-plugin-renderer-vue/types";
var CustomNodeView = /** @class */ (function (_super) {
    __extends(CustomNodeView, _super);
    function CustomNodeView() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.apply(this, args) || this;
        _this.isLogging = false;
        _this.showSettings = false;
        _this.noSettingsGear = ['Logic Gate', 'Math', 'Network Output', 'Switch Bot'];
        _this.BaklavaState = BaklavaState;
        _this.draggingStartPosition = null;
        _this.draggingStartPoint = null;
        _this.renaming = false;
        _this.tempName = "";
        _this.contextMenu = {
            show: false,
            x: 0,
            y: 0,
            items: [
                // { value: "rename", label: "Rename" },
                { value: "delete", label: "Delete" },
            ],
        };
        _this.plugin.components.nodeInterface = CustomNodeInterfaceView;
        return _this;
    }
    Object.defineProperty(CustomNodeView.prototype, "unlockState", {
        get: function () {
            return BaklavaState.getState("unlock");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomNodeView.prototype, "classes", {
        get: function () {
            var _a;
            function sanitizeName(name) {
                return name.replace(" ", "-");
            }
            return _a = {
                    node: true,
                    "--selected": this.selected,
                    "--dragging": !!this.draggingStartPoint,
                    "--two-column": !!this.data.twoColumn
                },
                _a["--type-".concat(sanitizeName(this.data.type))] = true,
                _a[this.data.customClasses] = true,
                _a;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomNodeView.prototype, "headerClass", {
        get: function () {
            return "__title node-top-header " + this.data.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomNodeView.prototype, "styles", {
        get: function () {
            return {
                top: "".concat(this.data.position.y, "px"),
                left: "".concat(this.data.position.x, "px"),
                width: "".concat(this.data.width, "px"),
            };
        },
        enumerable: false,
        configurable: true
    });
    CustomNodeView.prototype.mounted = function () {
        var _this = this;
        this.stateMachine = AppInjector.get(StateMachine);
        this.data.events.addInterface.addListener(this, function () { return _this.update(); });
        this.data.events.removeInterface.addListener(this, function () { return _this.update(); });
        this.data.events.addOption.addListener(this, function () { return _this.update(); });
        this.data.events.removeOption.addListener(this, function () { return _this.update(); });
        this.plugin.hooks.renderNode.execute(this);
        this.data.events.update.addListener(this, function () {
            _this["$forceUpdate"]();
        });
        this.isLogging = this.stateMachine.shouldLog(this.data.id);
        // let opts = Array.from(this.data.options)
        // opts.forEach(([_,opt])=>{
        //   if(opt.hideWhen){
        //     opt.
        //   }
        // })
    };
    CustomNodeView.prototype.updated = function () {
        this.plugin.hooks.renderNode.execute(this);
    };
    CustomNodeView.prototype.beforeDestroy = function () {
        this.data.events.addInterface.removeListener(this);
        this.data.events.removeInterface.removeListener(this);
        this.data.events.addOption.removeListener(this);
        this.data.events.removeOption.removeListener(this);
    };
    CustomNodeView.prototype.update = function () {
        this["$forceUpdate"]();
    };
    CustomNodeView.prototype.startDrag = function (ev) {
        this.select();
        if (this.selectedNodeViews.length === 0 ||
            this.selectedNodeViews[0] === undefined) {
            this.selectedNodeViews.splice(0, this.selectedNodeViews.length);
            this.selectedNodeViews.push(this);
        }
        this.selectedNodeViews.forEach(function (elem) {
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
    };
    CustomNodeView.prototype.select = function () {
        this["$emit"]("select", this);
    };
    CustomNodeView.prototype.stopDrag = function () {
        this.selectedNodeViews.forEach(function (elem) {
            elem.draggingStartPoint = null;
            elem.draggingStartPosition = null;
            document.removeEventListener("mousemove", elem.handleMove);
            document.removeEventListener("mouseup", elem.stopDrag);
        });
    };
    CustomNodeView.prototype.handleMove = function (ev) {
        this.selectedNodeViews.forEach(function (elem) {
            if (elem.draggingStartPoint) {
                var dx = ev.screenX - elem.draggingStartPoint.x;
                var dy = ev.screenY - elem.draggingStartPoint.y;
                elem.data.position.x =
                    elem.draggingStartPosition.x + dx / elem.plugin.scaling;
                elem.data.position.y =
                    elem.draggingStartPosition.y + dy / elem.plugin.scaling;
            }
        });
    };
    CustomNodeView.prototype.openContextMenu = function (ev) {
        //disable right click menu by commenting out the following code:
        // this.contextMenu.show = true;
        // this.contextMenu.x = ev.offsetX;
        // this.contextMenu.y = ev.offsetY;
    };
    CustomNodeView.prototype.onContextMenu = function (action) {
        switch (action) {
            case "delete":
                this.plugin.editor.removeNode(this.data);
                break;
            case "rename":
                this.tempName = this.data.name;
                this.renaming = true;
        }
    };
    CustomNodeView.prototype.doneRenaming = function () {
        this.data.name = this.tempName;
        this.renaming = false;
    };
    CustomNodeView.prototype.openSidebar = function (optionName) {
        this.plugin.sidebar.nodeId = this.data.id;
        this.plugin.sidebar.optionName = optionName;
        this.plugin.sidebar.visible = true;
    };
    CustomNodeView.prototype.toggleNotes = function () {
        this.stateMachine.toggleLogging(this.data.id);
        this.isLogging = this.stateMachine.shouldLog(this.data.id);
    };
    CustomNodeView.prototype.toggleSettings = function () {
        this.showSettings = !this.showSettings;
    };
    CustomNodeView.prototype.deleteNode = function () {
        this.plugin.editor.removeNode(this.data);
    };
    CustomNodeView.prototype.filterNotes = function (name) {
        //these lines commented out so that log notes would always be hidden
        // if (this.stateMachine.isLogging(this.data.id)) {
        //   return true;
        // }
        if (name.toLowerCase().includes('log')) {
            return false;
        }
        return true;
    };
    CustomNodeView.prototype.showInterfaceConditionally = function (name) {
        //console.log(this.data);
        changeDynamicInterfaces(this.data);
        var interfaceToggles = this.data.interfaceToggles;
        if (interfaceToggles) {
            //console.log(name, interfaceToggles[name])
            if (typeof interfaceToggles[name] !== 'undefined' && typeof (interfaceToggles[name] === "boolean")) {
                return interfaceToggles[name];
            }
        }
        return true;
    };
    CustomNodeView.prototype.showConditionally = function (currentKey) {
        var _this = this;
        console.log("conditionally checking node option");
        if (!this.filterNotes(currentKey)) {
            return false;
        }
        var show = true;
        var options = Array.from(this.data.options);
        options.forEach(function (_a) {
            // console.log(key,option);
            var key = _a[0], option = _a[1];
            if (key == "B Multiplier" && option._value !== 1) {
                show = true;
            }
            else if (key == currentKey && option.isSetting) {
                show = _this.showSettings;
            }
        });
        options.forEach(function (_a) {
            var key = _a[0], option = _a[1];
            if (option.hideWhen) {
                var currentSelection = option._value;
                if (option.hideWhen[currentSelection]) {
                    var keysToHide = option.hideWhen[currentSelection];
                    if (keysToHide.some(function (key) { return key == currentKey; })) {
                        show = false;
                    }
                }
            }
        });
        return show;
    };
    __decorate([
        Prop({ type: Object }),
        __metadata("design:type", Object)
    ], CustomNodeView.prototype, "data", void 0);
    __decorate([
        Prop({ type: Boolean, default: false }),
        __metadata("design:type", Boolean)
    ], CustomNodeView.prototype, "selected", void 0);
    __decorate([
        Inject("plugin"),
        __metadata("design:type", ViewPlugin)
    ], CustomNodeView.prototype, "plugin", void 0);
    __decorate([
        Inject("selectedNodeViews"),
        __metadata("design:type", Array)
    ], CustomNodeView.prototype, "selectedNodeViews", void 0);
    CustomNodeView = __decorate([
        Component(__assign({ directives: {
                ClickOutside: ClickOutside.directive,
            } }, compileToFunctions("\n  <div :id=\"data.id\" :class=\"classes\" :style=\"styles\">\n    <div\n      :class= \"headerClass\"\n      @mousedown.self.stop=\"startDrag\"\n      @contextmenu.self.prevent=\"openContextMenu\"\n    >\n      <span v-if=\"!renaming\">{{ data.name }} \n        <span class=\"node-header-buttons\">\n\n          <img v-if=\"unlockState>0\" class=\"notes-toggle\" v-bind:class=\"{'logs-off-icon':!this.isLogging}\" v-on:click=\"toggleNotes\" src=\"assets/icon/bug.png\">\n\n        <img v-if=\"unlockState>1 && !noSettingsGear.includes(data.name)\" class=\"notes-toggle settings\" v-on:click=\"toggleSettings\" src=\"assets/icon/settings.png\">\n          \n          <img src=\"assets/icon/delete.png\" class=\"node-delete\" v-on:click=\"deleteNode\">\n\n\n        </span>\n      </span>\n      <input\n        v-else\n        type=\"text\"\n        class=\"dark-input\"\n        v-model=\"tempName\"\n        placeholder=\"Node Name\"\n        v-click-outside=\"doneRenaming\"\n        @keydown.enter=\"doneRenaming\"\n      />\n\n      <component\n        :is=\"plugin.components.contextMenu\"\n        v-model=\"contextMenu.show\"\n        :x=\"contextMenu.x\"\n        :y=\"contextMenu.y\"\n        :items=\"contextMenu.items\"\n        @click=\"onContextMenu\"\n      ></component>\n    </div>\n\n    <div class=\"__content\">\n      \n      <!-- Inputs -->\n      <div class=\"__inputs\" style=\"float:left\">\n        <component\n          :is=\"plugin.components.nodeInterface\"\n          v-show=\"showInterfaceConditionally(name)\"\n          v-for=\"(input, name) in data.inputInterfaces\"\n          :key=\"input.id\"\n          :name=\"name\"\n          :data=\"input\"\n        ></component>\n      </div>\n\n\n      <!-- Outputs -->\n      <div class=\"__outputs\" style=\"float:right\">\n        <component\n          :is=\"plugin.components.nodeInterface\"\n          v-show=\"showInterfaceConditionally(name)\"\n          v-for=\"(output, name) in data.outputInterfaces\"\n          :key=\"output.id\"\n          :name=\"name\"\n          :data=\"output\"\n        ></component>\n      </div>\n      <!-- Options -->\n      <div class=\"__options\">\n        <template v-for=\"[name, option] in data.options\">\n          <component\n            :is=\"plugin.components.nodeOption\"\n            :key=\"name\" \n            :name=\"name\"\n            :option=\"option\"\n            :componentName=\"option.optionComponent\"\n            :node=\"data\"\n            v-show=\"showConditionally(name)\"\n            @openSidebar=\"openSidebar(name)\"\n          ></component>\n\n          <portal\n            :key=\"'sb_' + name\"\n            to=\"sidebar\"\n            v-if=\"\n              plugin.sidebar.nodeId === data.id &&\n              plugin.sidebar.optionName === name &&\n              option.sidebarComponent\n            \"\n          >\n            <component\n              :is=\"plugin.components.nodeOption\"\n              :key=\"data.id + name\"\n              :name=\"name\"\n              :option=\"option\"\n              :componentName=\"option.sidebarComponent\"\n              :node=\"data\"\n            ></component>\n          </portal>\n        </template>\n      </div>\n\n\n      \n\n\n    </div>\n  </div>\n"))),
        __metadata("design:paramtypes", [Object])
    ], CustomNodeView);
    return CustomNodeView;
}(Vue));
export default CustomNodeView;
function changeDynamicInterfaces(node) {
    var maxInputs = 26;
    var opts = Array.from(node.options);
    if (!opts) {
        return;
    }
    var numInputsOpt = opts.find(function (_a) {
        var key = _a[0], data = _a[1];
        if (key == ("# of Inputs")) {
            return true;
        }
    });
    var triggerCond = opts.find(function (_a) {
        var key = _a[0], data = _a[1];
        if (key == ("Trigger Conditionally")) {
            return true;
        }
    });
    if (numInputsOpt) {
        var numInputs = (numInputsOpt[1].value).match(/\d+/)[0];
        for (var i = 0; i < +numInputs; i++) {
            node.interfaceToggles["Input " + String.fromCharCode('A'.charCodeAt(0) + i)] = true;
        }
        for (var i = +numInputs; i < maxInputs; i++) {
            node.interfaceToggles["Input " + String.fromCharCode('A'.charCodeAt(0) + i)] = false;
        }
    }
    if (triggerCond) {
        node.interfaceToggles["If"] = triggerCond[1].value == "Dependent";
    }
}
//# sourceMappingURL=customNode.js.map