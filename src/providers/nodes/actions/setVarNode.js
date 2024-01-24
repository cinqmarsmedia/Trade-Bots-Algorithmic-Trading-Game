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
var SetVarNode = /** @class */ (function (_super) {
    __extends(SetVarNode, _super);
    function SetVarNode() {
        var _this = _super.call(this) || this;
        _this.type = "SetVarNode";
        _this.name = "Set Variable";
        _this.addOption("Variable", "SelectOption", "A", undefined, { items: ["A", "B", "C", "D", "Custom"], hideWhen: { "A": ["Variable Name"], "B": ["Variable Name"], "C": ["Variable Name"], "D": ["Variable Name"] } });
        _this.addOption("Variable Name", "InputOption");
        _this.addOption("Log Message + Data", "InputOption");
        _this.addInputInterface("Input");
        return _this;
    }
    SetVarNode.prototype.setStoredVariable = function (name, value) {
        this.stateMachine.setVariable("BotVariable." + name, value);
    };
    SetVarNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var input = this.getInterface("Input").value;
        if (typeof input === "undefined") {
            this.log(LogType.warning, "Input is undefined", "Input to this node is undefined. Input must have a value to store in a variable.");
            return;
        }
        var varOption = this.getOptionValue("Variable");
        switch (varOption) {
            case "A":
            case "B":
            case "C":
            case "D":
                this.setStoredVariable(varOption, input);
                break;
            case "Custom":
                var vo = this.getOptionValue("Variable Name");
                this.setStoredVariable(vo, input);
                break;
        }
        this.log(LogType.message, "Stored value " + input + " in variable " + varOption, "Variable name: ".concat(varOption, ", Value: ").concat(input));
    };
    SetVarNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    SetVarNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    SetVarNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    return SetVarNode;
}(BaseNode));
export { SetVarNode };
//# sourceMappingURL=setVarNode.js.map