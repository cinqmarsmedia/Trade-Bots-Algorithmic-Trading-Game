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
var TrainNode = /** @class */ (function (_super) {
    __extends(TrainNode, _super);
    function TrainNode() {
        var _this = _super.call(this) || this;
        _this.type = "TrainNode";
        _this.name = "Add Network Data";
        _this.netID = 1;
        _this.netKey = "TrainingData." + _this.netID;
        _this.interfaceToggles = { "If": false, "Input C": false, "Input D": false, "Input E": false };
        _this.setNumDataPts = _this.setNumDataPts.bind(_this);
        _this.addOption("Network ID", "SelectOption", "Net I", undefined, { items: ["Net I", "Net II", "Net III", "Net IV", "Net V"], hideWhen: {} });
        _this.addOption("# of Inputs", "SelectOption", "2 Inputs", undefined, { items: ["1 Input", "2 Inputs", "3 Inputs", "4 Inputs", "5 Inputs"], hideWhen: {} });
        _this.addOption("Trigger Conditionally", "SelectOption", "Always", undefined, { items: ["Always", "Dependent"], hideWhen: {} });
        //this.addOption("Auto Train", "InputOption")
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOption("# of Data Points", "TextOption", "Data Points: 0");
        _this.addInputInterface("If");
        _this.addInputInterface("Input A");
        _this.addInputInterface("Input B");
        _this.addInputInterface("Input C");
        _this.addInputInterface("Input D");
        _this.addInputInterface("Input E");
        _this.addInputInterface("Output");
        _this.updateNetwork();
        return _this;
    }
    TrainNode.prototype.load = function (arg) {
        var res = _super.prototype.load.call(this, arg);
        this.updateNetwork();
        return res;
    };
    TrainNode.prototype.updateNetwork = function () {
        var netOption = this.getOptionValue("Network ID");
        this.stateMachine.unsubscribe(this.netKey, this.setNumDataPts);
        switch (netOption.substring(4)) {
            case "I": {
                this.netID = 1;
                break;
            }
            case "II": {
                this.netID = 2;
                break;
            }
            case "III": {
                this.netID = 3;
                break;
            }
            case "IV": {
                this.netID = 4;
                break;
            }
            case "V": {
                this.netID = 5;
                break;
            }
        }
        var values = this.stateMachine.getVariable(this.netKey) || [];
        this.setNumDataPts(values);
        this.stateMachine.subscribe(this.netKey, this.setNumDataPts);
    };
    TrainNode.prototype.setNumDataPts = function (values) {
        if (values === void 0) { values = []; }
        this.setOptionValue("# of Data Points", "Data Points: " + values.length);
    };
    TrainNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        //get the condition
        var condition;
        var conditionInterface = this.getInterface("If").value;
        if (typeof (conditionInterface) === "undefined") {
            //if there's no attached input to the condition node, then the condition is assumed to be true.
            conditionInterface = true;
            if (this.getOptionValue("Trigger Conditionally") == "Dependent") {
                this.log(LogType.warning, "No trigger defined", "Trigger conditionally is set to 'Dependent', however the 'If' input is unconnected. The node will be active and function as if Trigger conditionally was set to 'Always'. ");
            }
        }
        condition = conditionInterface == true;
        //get all inputs
        var numInputsStr = this.getOptionValue("# of Inputs");
        var numInputs = +numInputsStr[0];
        var inputs = [];
        for (var i = 0; i < numInputs; i++) {
            var input = this.getInterface("Input " + String.fromCharCode('A'.charCodeAt(0) + i)).value;
            if (typeof input !== "undefined") {
                inputs.push(input);
            }
            else {
                inputs.push(null);
            }
        }
        //get the output
        var output = this.getInterface("Output").value;
        //get the current net ID
        this.updateNetwork();
        inputs = inputs.map(function (x) { return x * 1.0; });
        output *= 1.0;
        var trainingData = [{
                input: inputs,
                output: [output]
            }];
        var values = this.stateMachine.getVariable(this.netKey) || [];
        values.push.apply(values, trainingData);
        this.stateMachine.setVariable(this.netKey, values);
        //this.log(LogType.message, "Stored value " + JSON.stringify(store) + " in variable " + netKey, `Variable name: ${netKey}, Value: ${JSON.stringify(values)}`)
    };
    TrainNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    TrainNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    TrainNode.prototype.setOptionValue = function (name, value) {
        return _super.prototype.setOptionValue.call(this, name, value);
    };
    TrainNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    return TrainNode;
}(BaseNode));
export { TrainNode };
//# sourceMappingURL=trainNode.js.map