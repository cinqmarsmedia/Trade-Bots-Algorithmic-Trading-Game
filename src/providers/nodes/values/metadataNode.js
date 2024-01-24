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
var MetaNode = /** @class */ (function (_super) {
    __extends(MetaNode, _super);
    function MetaNode() {
        var _this = _super.call(this) || this;
        _this.type = "MetaNode";
        _this.name = "Metadata Boolean";
        _this.addOption("Meta", "SelectOption", "Sector", undefined, { items: ["Stock Name", "Sector", "Ticker", "Exchange"] });
        _this.addOption("Includes", "SelectOption", "Includes", undefined, { items: ["Is", "Doesn't Include", "Is Not", "Includes"] });
        _this.addOption("Match Text Here", "InputOption");
        _this.addOption("Log Message + Data", "InputOption");
        _this.addOutputInterface("Output");
        return _this;
    }
    MetaNode.prototype.calculate = function (data) {
        _super.prototype.calculate.call(this, data);
        var metadata = data.metadata;
        var text = this.getOptionValue("Match Text Here");
        var meta = this.getOptionValue("Meta");
        var includes = this.getOptionValue("Includes");
        var choice;
        var logStr = "Metadata (";
        switch (meta) {
            case "Exchange": {
                choice = metadata.exchange;
                logStr += "Exchange) = " + metadata.exchange;
                break;
            }
            case "Sector": {
                choice = metadata.sector;
                logStr += "Sector) = " + metadata.sector;
                break;
            }
            case "Stock Name": {
                choice = metadata.name;
                logStr += "Stock Name) = " + metadata.name;
                break;
            }
            case "Ticker": {
                choice = metadata.ticker;
                logStr += "Ticker) = " + metadata.ticker;
                break;
            }
        }
        logStr += ". ";
        switch (includes) {
            case "Is": {
                this.getInterface("Output").value = (choice.toLowerCase() == text.toLowerCase());
                if (this.getInterface("Output").value) {
                    logStr += "Metadata (".concat(choice, ") matches with text (").concat(text, "). Output = true");
                }
                else {
                    logStr += "Metadata (".concat(choice, ") does not match with text (").concat(text, "). Output = false");
                }
                break;
            }
            case "Doesn't Include": {
                this.getInterface("Output").value = !(choice.toLowerCase().includes(text.toLowerCase()));
                if (this.getInterface("Output").value) {
                    logStr += "Metadata (".concat(choice, ") doesn't include text (").concat(text, "). Output = true");
                }
                else {
                    logStr += "Metadata (".concat(choice, ") includes text (").concat(text, "). Output = false");
                }
                break;
            }
            case "Includes": {
                this.getInterface("Output").value = (choice.toLowerCase().includes(text.toLowerCase()));
                if (this.getInterface("Output").value) {
                    logStr += "Metadata (".concat(choice, ") includes text (").concat(text, "). Output = true");
                }
                else {
                    logStr += "Metadata (".concat(choice, ") doesn't include text (").concat(text, "). Output = false");
                }
                break;
            }
            case "Is Not": {
                this.getInterface("Output").value = (choice.toLowerCase() != text.toLowerCase());
                if (this.getInterface("Output").value) {
                    logStr += "Metadata (".concat(choice, ") does not match with text (").concat(text, "). Output = true");
                }
                else {
                    logStr += "Metadata (".concat(choice, ") matches with text (").concat(text, "). Output = false");
                }
                break;
            }
        }
        this.log(LogType.message, logStr);
    };
    MetaNode.prototype.addOption = function (name, component, defaultVal, sideBarComponent, additionalOptions) {
        return _super.prototype.addOption.call(this, name, component, defaultVal, sideBarComponent, additionalOptions);
    };
    MetaNode.prototype.getOptionValue = function (name) {
        return _super.prototype.getOptionValue.call(this, name);
    };
    MetaNode.prototype.getInterface = function (name) {
        return _super.prototype.getInterface.call(this, name);
    };
    return MetaNode;
}(BaseNode));
export { MetaNode };
//# sourceMappingURL=metadataNode.js.map