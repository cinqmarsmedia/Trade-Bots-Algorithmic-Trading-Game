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
var LogicNode = /** @class */ (function (_super) {
    __extends(LogicNode, _super);
    function LogicNode() {
        var _this = _super.call(this) || this;
        _this.type = "LogicNode";
        _this.name = "Logic Gate";
        _this.addInputInterface("Input A");
        _this.addInputInterface("Input B");
        _this.addOption("Operation", "SelectOption", "A OR B", undefined, {
            items: ["A AND B", "A OR B", "A XOR B"],
        });
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Then");
        _this.addOutputInterface("Else");
        return _this;
    }
    LogicNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var a = this.getInterface("Input A").value;
        var b = this.getInterface("Input B").value;
        if (typeof a !== "boolean") {
            if (typeof a === "undefined") {
                this.log(LogType.error, "Input A is not defined. Please connect a valid node's endpoint to Input A");
                return;
            }
            this.log(LogType.error, "Input A is invalid. Input A can only accept values of kind true or false. Please connect an appropriate endpoint to Input A");
            return;
        }
        if (typeof b !== "boolean") {
            if (typeof b === "undefined") {
                this.log(LogType.error, "Input B is not defined. Please connect a valid node's endpoint to Input B");
                return;
            }
            this.log(LogType.error, "Input B is invalid. Input B can only accept values of kind true or false. Please connect an appropriate endpoint to Input B");
            return;
        }
        var op = this.getOptionValue("Operation");
        var out;
        switch (op) {
            case "A AND B": {
                out = a && b;
                break;
            }
            case "A OR B": {
                out = a || b;
                break;
            }
            case "A XOR B": {
                out = a !== b;
                break;
            }
        }
        this.getInterface("Then").value = out;
        this.getInterface("Else").value = !out;
        this.log(LogType.message, "Input A is ".concat(a, ", Input B is ").concat(b, ", output \"then\" is ").concat(out, " and output \"else\" is ").concat(!out));
    };
    LogicNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    LogicNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    LogicNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    LogicNode.prototype.addInputInterface = function (name) {
        return _super.prototype.addInputInterface.call(this, name);
    };
    LogicNode.prototype.addOutputInterface = function (name, additionalProperties) {
        return _super.prototype.addOutputInterface.call(this, name, additionalProperties);
    };
    return LogicNode;
}(BaseNode));
export { LogicNode };
//# sourceMappingURL=logicNode.js.map