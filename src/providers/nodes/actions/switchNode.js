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
var SwitchNode = /** @class */ (function (_super) {
    __extends(SwitchNode, _super);
    function SwitchNode() {
        var _this = _super.call(this) || this;
        _this.type = "SwitchNode";
        _this.name = "Switch Bot";
        _this.addInputInterface("Trigger");
        var botNames = _this.stateMachine.advancedBots;
        botNames = botNames.filter(function (name) { return name != _this.stateMachine.activeBotName; });
        console.log(botNames, botNames[0]);
        _this.addOption("Switch to", "SelectOption", botNames[0], undefined, { items: botNames });
        return _this;
    }
    SwitchNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var input = this.getInterface("Trigger").value;
        if (typeof input === "undefined") {
            this.log(LogType.warning, "Trigger is undefined", "Trigger to this node is undefined. Bot will not be switched.");
            return;
        }
        if (input === true || input === 1) {
            var botName = this.getOptionValue("Switch to");
            if (botName == this.stateMachine.activeBotName) {
                this.log(LogType.warning, "Cannot switch to a bot that is already active");
                return;
            }
            this.stateMachine.switchBot(botName);
            this.log(LogType.message, "Switching to bot " + botName);
        }
    };
    return SwitchNode;
}(BaseNode));
export { SwitchNode };
//# sourceMappingURL=switchNode.js.map