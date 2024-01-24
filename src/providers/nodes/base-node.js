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
import { Node } from "@baklavajs/core";
import { AppInjector } from "../../app/app.module";
import { LogType, StateMachine } from "../state-machine/state-machine";
var BaseNode = /** @class */ (function (_super) {
    __extends(BaseNode, _super);
    function BaseNode() {
        var _this = _super.call(this) || this;
        _this.stateMachine = AppInjector.get(StateMachine);
        window["sm"] = _this.stateMachine;
        return _this;
    }
    BaseNode.prototype.calculate = function (data) {
        this.data = data;
    };
    Object.defineProperty(BaseNode.prototype, "stopped", {
        get: function () {
            var stopped = this.stateMachine.getVariable('Stopped');
            return (stopped === true || stopped === 1);
        },
        set: function (stopped) {
            this.stateMachine.setVariable('Stopped', stopped);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseNode.prototype, "shouldLog", {
        get: function () {
            return this.stateMachine.shouldLog(this.id);
        },
        enumerable: false,
        configurable: true
    });
    BaseNode.prototype.log = function (type, message, detail) {
        if (type == LogType.message && !this.shouldLog) {
            return;
        }
        //revert type to message to interface with existing downstream codebase, but these messages would show even if logging is disabled.
        if (type == LogType.alert) {
            type = LogType.message;
        }
        this.stateMachine.writeLog(type, this.name + ": " + message, detail, this.data.dateKeyIndex, this.id, this.data.cash, this.data.invested, this.data.netWorth, this.data.currentData[this.data.dateKeyIndex + 1].date, this.data.loanData);
    };
    return BaseNode;
}(Node));
export { BaseNode };
//# sourceMappingURL=base-node.js.map