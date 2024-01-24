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
var StopNode = /** @class */ (function (_super) {
    __extends(StopNode, _super);
    function StopNode() {
        var _this = _super.call(this) || this;
        _this.type = "StopNode";
        _this.name = "Stop Bot";
        _this.addInputInterface("Input");
        _this.addOption("Description", "TextOption", "Restart after N days", undefined, { isSetting: true });
        _this.addOption("Where N is", "IntegerOption", 0, undefined, { isSetting: true });
        _this.addOption("Days are", "SelectOption", "Traded Days", undefined, { isSetting: true, items: ["Actual Days", "Traded Days"] });
        return _this;
    }
    StopNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var input = this.getInterface("Input").value;
        if (typeof input === "undefined") {
            this.log(LogType.warning, "Input is undefined", "Input to this node is undefined. Bot will not be stopped.");
            return;
        }
        if (input === true || input === 1) {
            this.stopped = true;
            this.log(LogType.message, "Stopping bot " + this.name);
            var N = (this.getOptionValue("Where N is"));
            if (N === 0) {
                return;
            }
            var withinStrategy = this.getOptionValue("Days are");
            if (withinStrategy == "Traded Days") {
                var targetIndex = data.dateKeyIndex + N;
                this.stateMachine.setVariable("restartIndex", targetIndex);
            }
            if (withinStrategy == "Actual Days") {
                var currentDate = data.currentData[data.dateKeyIndex].date;
                var targetDate = new Date(currentDate.getTime() + 24 * 3600 * 1000 * N);
                this.stateMachine.setVariable("restartDate", targetDate);
            }
        }
    };
    return StopNode;
}(BaseNode));
export { StopNode };
//# sourceMappingURL=stopNode.js.map