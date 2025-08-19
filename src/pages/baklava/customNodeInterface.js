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
var CustomNodeInterfaceView = /** @class */ (function (_super) {
    __extends(CustomNodeInterfaceView, _super);
    function CustomNodeInterfaceView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = null;
        _this.isConnected = false;
        return _this;
    }
    Object.defineProperty(CustomNodeInterfaceView.prototype, "classes", {
        get: function () {
            return {
                "node-interface": true,
                "--input": this.data.isInput,
                "--output": !this.data.isInput,
                "--connected": this.isConnected
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CustomNodeInterfaceView.prototype, "displayName", {
        get: function () {
            return this.data.displayName || this.name;
        },
        enumerable: false,
        configurable: true
    });
    CustomNodeInterfaceView.prototype.beforeMount = function () {
        var _this = this;
        this.value = this.data.value;
        this.data.events.setValue.addListener(this, function (v) { _this.value = v; });
        this.data.events.setConnectionCount.addListener(this, function (c) {
            _this.$forceUpdate();
            _this.isConnected = c > 0;
        });
        this.data.events.updated.addListener(this, function (v) { _this.$forceUpdate(); });
        this.isConnected = this.data.connectionCount > 0;
    };
    CustomNodeInterfaceView.prototype.mounted = function () {
        this.plugin.hooks.renderInterface.execute(this);
    };
    CustomNodeInterfaceView.prototype.updated = function () {
        this.plugin.hooks.renderInterface.execute(this);
    };
    CustomNodeInterfaceView.prototype.beforeDestroy = function () {
        this.data.events.setValue.removeListener(this);
        this.data.events.setConnectionCount.removeListener(this);
        this.data.events.updated.removeListener(this);
    };
    CustomNodeInterfaceView.prototype.startHover = function () {
        this.editor.hoveredOver(this.data);
    };
    CustomNodeInterfaceView.prototype.endHover = function () {
        this.editor.hoveredOver(undefined);
    };
    CustomNodeInterfaceView.prototype.getOptionComponent = function (name) {
        if (!name || !this.plugin.options) {
            return;
        }
        return this.plugin.options[name];
    };
    __decorate([
        Prop({ type: Object, default: function () { return ({}); } }),
        __metadata("design:type", Object)
    ], CustomNodeInterfaceView.prototype, "data", void 0);
    __decorate([
        Prop({ type: String, default: "" }),
        __metadata("design:type", String)
    ], CustomNodeInterfaceView.prototype, "name", void 0);
    __decorate([
        Inject("plugin"),
        __metadata("design:type", ViewPlugin)
    ], CustomNodeInterfaceView.prototype, "plugin", void 0);
    __decorate([
        Inject("editor"),
        __metadata("design:type", Object)
    ], CustomNodeInterfaceView.prototype, "editor", void 0);
    CustomNodeInterfaceView = __decorate([
        Component(__assign({ directives: {
                ClickOutside: ClickOutside.directive,
            } }, compileToFunctions("\n  <template>\n    <div :id=\"data.id\" :class=\"classes\">\n        <div class=\"__port\" v-bind:class=\"{botEditorTrueValue: value===true, botEditorFalseValue: value===false}\" @mouseover=\"startHover\" @mouseout=\"endHover\"></div>\n        <span v-if=\"data.connectionCount > 0 || !data.option || !getOptionComponent(data.option)\" class=\"align-middle\">\n            {{ displayName }}\n            <!-- uncomment this to enable input node value display in realtime view <span v-bind:class=\"{botEditorTrueValue: value===true, botEditorFalseValue: value===false}\" v-if=\"(displayName=='Output' || displayName=='Result' || displayName=='Then' || displayName=='Else') && classes['--connected']\" style=\"position:absolute; margin-top:-12px; margin-left:25px;color: white; font-size:10px;\">{{typeof value===\"number\"?Math.round(value*100)/100:value}}</span> -->\n            <span v-bind:class=\"{liveValue: true, botEditorTrueValue: value===true, botEditorFalseValue: value===false}\" v-if=\"!(displayName=='Output' || displayName=='Result' || displayName=='Then' || displayName=='Else') && classes['--connected']\" style=\"position:absolute; margin-top:-12px; right:69px !important;color: white; font-size:10px;\">{{typeof value===\"number\"?Math.round(value*100)/100:value}}</span>\n        </span>\n        <component\n            v-else\n            :is=\"getOptionComponent(data.option)\"\n            :option=\"data\"\n            :value=\"value\"\n            @input=\"data.value = $event\"\n            :name=\"displayName\"\n        ></component>\n    </div>\n</template>\n")))
    ], CustomNodeInterfaceView);
    return CustomNodeInterfaceView;
}(Vue));
export { CustomNodeInterfaceView };
export default CustomNodeInterfaceView;
//# sourceMappingURL=customNodeInterface.js.map