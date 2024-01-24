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
var GetVarNode = /** @class */ (function (_super) {
    __extends(GetVarNode, _super);
    function GetVarNode() {
        var _this = _super.call(this) || this;
        _this.type = "GetVarNode";
        _this.name = "Get Variable";
        _this.addOption("Variable", "SelectOption", "A", undefined, { items: ["A", "B", "C", "D", "Custom"], hideWhen: { "A": ["Variable Name"], "B": ["Variable Name"], "C": ["Variable Name"], "D": ["Variable Name"] } });
        _this.addOption("Variable Name", "InputOption");
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Output");
        return _this;
    }
    GetVarNode.prototype.getStoredVariable = function (name) {
        return this.stateMachine.getVariable("BotVariable." + name);
    };
    GetVarNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var varOption = this.getOptionValue("Variable");
        switch (varOption) {
            case "A":
            case "B":
            case "C":
            case "D":
                this.getInterface("Output").value = this.getStoredVariable(varOption);
                this.log(LogType.message, "Variable name: ".concat(varOption, ", variable value written to node's output: ").concat(this.getInterface("Output").value, " "));
                break;
            case "Custom":
                var vo = this.getOptionValue("Variable Name");
                this.getInterface("Output").value = this.getStoredVariable(vo);
                this.log(LogType.message, "Custom variable, name: ".concat(vo, ", variable value written to node's output: ").concat(this.getInterface("Output").value, " "));
                break;
        }
    };
    GetVarNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    GetVarNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    GetVarNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    return GetVarNode;
}(BaseNode));
export { GetVarNode };
//# sourceMappingURL=getVarNode.js.map