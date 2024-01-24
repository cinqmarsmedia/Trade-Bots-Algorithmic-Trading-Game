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
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
var ConditionalNode = /** @class */ (function (_super) {
    __extends(ConditionalNode, _super);
    function ConditionalNode() {
        var _this = _super.call(this) || this;
        _this.type = "ConditionalNode";
        _this.name = "If (Conditional)";
        _this.addInputInterface("Input A");
        _this.addInputInterface("Input B");
        _this.addOption("Conditional", "SelectOption", "A>B", undefined, {
            items: ["A>B", "A<B", "A>=B", "A<=B", "A==B", "A!=B"],
        });
        _this.addOption("B Multiplier", "NumberOption", 1, undefined, { min: -10000, max: 10000, isSetting: true });
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Then");
        _this.addOutputInterface("Else");
        return _this;
    }
    ConditionalNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var multiplier = this.getOptionValue("B Multiplier");
        var a = this.getInterface("Input A").value;
        var b = this.getInterface("Input B").value * multiplier;
        if (typeof a === "undefined") {
            this.log(LogType.error, "Node is suspended as input A is not defined. Please connect a valid node endpoint to input A.");
            return;
        }
        if (typeof b === "undefined") {
            this.log(LogType.error, "Node is suspended as input B is not defined. Please connect a valid node endpoint to input B.");
            return;
        }
        var condition = this.getOptionValue("Conditional");
        var out;
        switch (condition) {
            case "A!=B": {
                out = a != b;
                break;
            }
            case "A==B": {
                out = a == b;
                break;
            }
            case "A>=B": {
                out = a >= b;
                break;
            }
            case "A>B": {
                out = a > b;
                break;
            }
            case "A<=B": {
                out = a <= b;
                break;
            }
            case "A<B": {
                out = a < b;
                break;
            }
        }
        this.getInterface("Then").value = out;
        this.getInterface("Else").value = !out;
        this.log(LogType.message, "Input A = ".concat(a, ", Input B = ").concat(b, " Then is ").concat(out, ", Else is ").concat(!out));
    };
    ConditionalNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    ConditionalNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    ConditionalNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    ConditionalNode.prototype.addInputInterface = function (name) {
        return _super.prototype.addInputInterface.call(this, name);
    };
    ConditionalNode.prototype.addOutputInterface = function (name, additionalProperties) {
        return _super.prototype.addOutputInterface.call(this, name, additionalProperties);
    };
    return ConditionalNode;
}(BaseNode));
export { ConditionalNode };
//# sourceMappingURL=conditionalNode.js.map