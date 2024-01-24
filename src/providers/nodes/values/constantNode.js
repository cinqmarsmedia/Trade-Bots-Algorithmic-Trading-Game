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
var ConstantNode = /** @class */ (function (_super) {
    __extends(ConstantNode, _super);
    function ConstantNode() {
        var _this = _super.call(this) || this;
        _this.type = "ConstantNode";
        _this.name = "Constant";
        _this.addOption("Type", "SelectOption", "Number", undefined, { items: ["Number", "Percentage", "Boolean", "Random"], hideWhen: { "Number": ["TextOption", "Place Value", "Below", "Above", "Boolean"], "Percentage": ["TextOption", "Place Value", "Below", "Above", "Boolean"], "Boolean": ["TextOption", "Place Value", "Below", "Above", ""], "Random": ["Boolean", ""] } });
        _this.addOption("TextOption", "TextOption", "Random # Generated Each Iteration");
        _this.addOption("Place Value", "SelectOption", "Decimal", undefined, { items: ["Decimal", "Ceil", "Floor", "Round"] });
        _this.addOption("Below", "NumberOption", 1);
        _this.addOption("Above", "NumberOption", 0);
        _this.addOption("Boolean", "SelectOption", "True", undefined, { items: ["True", "False"] });
        _this.addOutputInterface("Output");
        _this.addOption("", "NumberOption", 1);
        _this.addOption("Log Message + Data", "InputOption");
        return _this;
    }
    ConstantNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    ConstantNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    ConstantNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    ConstantNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var type = this.getOptionValue("Type");
        switch (type) {
            case "Number": {
                var value = this.getOptionValue("");
                if (typeof value === "number") {
                    this.getInterface("Output").value = value;
                }
                else {
                    this.log(LogType.error, "Invalid number in input to constant", "The number constant must have a numeric input");
                }
                break;
            }
            case "Percentage": {
                var value = this.getOptionValue("");
                if (typeof value === "number") {
                    this.getInterface("Output").value = value / 100;
                }
                else {
                    this.log(LogType.error, "Invalid number in input to constant", "The number constant must have a numeric input");
                }
                break;
            }
            case "Boolean": {
                var booleanOption = this.getOptionValue("Boolean");
                if (booleanOption == "True") {
                    this.getInterface("Output").value = true;
                }
                if (booleanOption == "False") {
                    this.getInterface("Output").value = false;
                }
                break;
            }
            case "Random": {
                var lower = this.getOptionValue("Above");
                var upper = this.getOptionValue("Below");
                var r = Math.random() * (upper - lower) + lower;
                var randomOption = this.getOptionValue("Place Value");
                this.log(LogType.message, "random number generated: " + r);
                switch (randomOption) {
                    case "Round": {
                        r = Math.round(r);
                        break;
                    }
                    case "Ceil": {
                        r = Math.ceil(r);
                        break;
                    }
                    case "Floor": {
                        r = Math.floor(r);
                        break;
                    }
                }
                this.getInterface("Output").value = r;
            }
        }
        this.log(LogType.message, "Constant value being used: " + this.getInterface("Output").value);
    };
    return ConstantNode;
}(BaseNode));
export { ConstantNode };
//# sourceMappingURL=constantNode.js.map