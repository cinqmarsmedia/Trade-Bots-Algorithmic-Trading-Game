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
var MathNode = /** @class */ (function (_super) {
    __extends(MathNode, _super);
    function MathNode() {
        var _this = _super.call(this) || this;
        _this.type = "MathNode";
        _this.name = "Math";
        _this.addInputInterface("Input A");
        _this.addInputInterface("Input B");
        _this.addOption("Operation", "SelectOption", "A+B", undefined, {
            items: ["A+B", "A-B", "A*B", "A/B", "A mod B", "A^B", "LogA(B)"],
        });
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Result");
        return _this;
    }
    MathNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var a = this.getInterface("Input A").value;
        var b = this.getInterface("Input B").value;
        if (typeof a !== "number") {
            if (typeof a === "undefined") {
                this.log(LogType.error, "Input A is missing", "No node is connected to input A. Please connect a valid node to input A.");
                return;
            }
            this.log(LogType.error, "Input A has an invalid type", "Input A should is not a number. Please connect a node with a numeric endpoint to input A.");
            return;
        }
        if (typeof b !== "number") {
            if (typeof b === "undefined") {
                this.log(LogType.error, "Input B is missing", "No node is connected to input B. Please connect a valid node to input B.");
                return;
            }
            this.log(LogType.error, "Input B has an invalid type", "Input B should is not a number. Please connect a node with a numeric endpoint to input B.");
            return;
        }
        var condition = this.getOptionValue("Operation");
        var out;
        switch (condition) {
            case "A+B": {
                out = a + b;
                break;
            }
            case "A-B": {
                out = a - b;
                break;
            }
            case "A*B": {
                out = a * b;
                break;
            }
            case "A/B": {
                out = a / b;
                break;
            }
            case "A^B": {
                out = Math.pow(a, b);
                break;
            }
            case "LogA(B)": {
                out = Math.log(b) / Math.log(a);
                break;
            }
            case "A mod B": {
                out = a % b;
                break;
            }
        }
        this.getInterface("Result").value = out;
        this.log(LogType.message, "Output = ".concat(out), "Input A = ".concat(a, ", Input B = ").concat(b, ", output = ").concat(out));
    };
    MathNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    MathNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    MathNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    MathNode.prototype.addInputInterface = function (name) {
        return _super.prototype.addInputInterface.call(this, name);
    };
    MathNode.prototype.addOutputInterface = function (name, additionalProperties) {
        return _super.prototype.addOutputInterface.call(this, name, additionalProperties);
    };
    return MathNode;
}(BaseNode));
export { MathNode };
//# sourceMappingURL=mathNode.js.map