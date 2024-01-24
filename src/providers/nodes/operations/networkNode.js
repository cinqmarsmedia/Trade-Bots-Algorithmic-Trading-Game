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
var NetworkNode = /** @class */ (function (_super) {
    __extends(NetworkNode, _super);
    function NetworkNode() {
        var _this = _super.call(this) || this;
        _this.type = "NetworkNode";
        _this.name = "Network Output";
        _this.interfaceToggles = { "Input C": false, "Input D": false, "Input E": false };
        _this.addInputInterface("Input A");
        _this.addInputInterface("Input B");
        _this.addInputInterface("Input C");
        _this.addInputInterface("Input D");
        _this.addInputInterface("Input E");
        _this.addOption("Network", "SelectOption", "Net I", undefined, {
            items: ["Net I", "Net II", "Net III", "Net IV", "Net V"],
        });
        _this.addOption("# of Inputs", "SelectOption", "2 Inputs", undefined, { items: ["1 Input", "2 Inputs", "3 Inputs", "4 Inputs", "5 Inputs"], hideWhen: {} });
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Output");
        return _this;
    }
    NetworkNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        //turn all inputs to boolean or numeric
        var inputs = [];
        var numInputsStr = this.getOptionValue("# of Inputs");
        switch (numInputsStr) {
            case "5 Inputs": {
                inputs.push(this.getInterface("Input E").value);
            }
            case "4 Inputs": {
                inputs.push(this.getInterface("Input D").value);
            }
            case "3 Inputs": {
                inputs.push(this.getInterface("Input C").value);
            }
            case "2 Inputs": {
                inputs.push(this.getInterface("Input B").value);
            }
            case "1 Input": {
                inputs.push(this.getInterface("Input A").value);
            }
        }
        //load network
        var networkID;
        switch (this.getOptionValue('Network')) {
            case 'Net I': {
                networkID = 1;
                break;
            }
            case 'Net II': {
                networkID = 2;
                break;
            }
            case 'Net III': {
                networkID = 3;
                break;
            }
            case 'Net IV': {
                networkID = 4;
                break;
            }
            case 'Net V': {
                networkID = 5;
                break;
            }
            default: {
                networkID = 1;
            }
        }
        var netData = this.stateMachine.getVariable("NeuralNetwork.".concat(networkID));
        if (!netData) {
            this.log(LogType.warning, "Tried to run network operation before the network was trained");
            return;
        }
        var minMax = netData.minMax, netJSON = netData.netJSON;
        inputs = inputs.map(function (x, i) {
            if (typeof x === "undefined" || x == null) {
                return 0;
            }
            if (typeof x === "boolean") {
                return +x;
            }
            var _a = minMax[i], min = _a[0], max = _a[1];
            return (x - min) / (max - min);
        });
        var neuralNet = new brain.NeuralNetwork();
        neuralNet.fromJSON(netJSON);
        var out = neuralNet.run(inputs)[0];
        var _a = minMax[minMax.length - 1], outMin = _a[0], outMax = _a[1];
        out = outMin + (outMax - outMin) * out;
        this.getInterface("Output").value = out;
        this.log(LogType.message, "Output = ".concat(out), "Inputs: ".concat(inputs, ", output: ").concat(out));
    };
    NetworkNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    NetworkNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    NetworkNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    NetworkNode.prototype.addInputInterface = function (name) {
        return _super.prototype.addInputInterface.call(this, name);
    };
    NetworkNode.prototype.addOutputInterface = function (name, additionalProperties) {
        return _super.prototype.addOutputInterface.call(this, name, additionalProperties);
    };
    return NetworkNode;
}(BaseNode));
export { NetworkNode };
//# sourceMappingURL=networkNode.js.map