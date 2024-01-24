import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";


type OptionName = "Log Message + Data" | "Meta" | "Includes" | "Match Text Here";
type InterfaceName = OptionName | "Output";

type MetaInput = "Stock Name" | "Sector" | "Ticker" | "Exchange"
type IncludesInput = "Is" | "Doesn't Include" | "Is Not" | "Includes"


export class MetaNode extends BaseNode {
    type: string = "MetaNode"
    name: string = "Metadata Bool"
    constructor() {
        super();

        this.addOption("Meta", "SelectOption", "Sector", undefined, { items: ["Stock Name", "Sector", "Ticker", "Exchange"] })
        this.addOption("Includes", "SelectOption", "Includes", undefined, { items: ["Is", "Doesn't Include", "Is Not", "Includes"] })
        this.addOption("Match Text Here", "InputOption")
        this.addOption("Log Message + Data", "InputOption")
        this.addOutputInterface("Output")
    }
    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        let metadata = data.metadata;
        let text = this.getOptionValue("Match Text Here");
        let meta: MetaInput = this.getOptionValue("Meta");
        let includes: IncludesInput = this.getOptionValue("Includes");
        let choice: string;
        let logStr = "Metadata (";
        switch (meta) {
            case "Exchange": {
                choice = metadata.exchange;
                logStr += "Exchange) = " + metadata.exchange
                break;
            }
            case "Sector": {
                choice = metadata.sector;
                logStr += "Sector) = " + metadata.sector
                break;
            }
            case "Stock Name": {
                choice = metadata.name;
                logStr += "Stock Name) = " + metadata.name
                break;
            }
            case "Ticker": {
                choice = metadata.ticker;
                logStr += "Ticker) = " + metadata.ticker
                break;
            }
        }
        logStr += ". ";


        switch (includes) {
            case "Is": {
                this.getInterface("Output").value = (choice.toLowerCase() == text.toLowerCase());
                if (this.getInterface("Output").value) {
                    logStr += `Metadata (${choice}) matches with text (${text}). Output = true`
                } else {
                    logStr += `Metadata (${choice}) does not match with text (${text}). Output = false`
                }
                break;
            }
            case "Doesn't Include": {
                this.getInterface("Output").value = !(choice.toLowerCase().includes(text.toLowerCase()));
                if (this.getInterface("Output").value) {
                    logStr += `Metadata (${choice}) doesn't include text (${text}). Output = true`
                } else {
                    logStr += `Metadata (${choice}) includes text (${text}). Output = false`
                }
                break;
            }
            case "Includes": {
                this.getInterface("Output").value = (choice.toLowerCase().includes(text.toLowerCase()));
                if (this.getInterface("Output").value) {
                    logStr += `Metadata (${choice}) includes text (${text}). Output = true`
                } else {
                    logStr += `Metadata (${choice}) doesn't include text (${text}). Output = false`
                }

                break;
            }
            case "Is Not": {
                this.getInterface("Output").value = (choice.toLowerCase() != text.toLowerCase());
                if (this.getInterface("Output").value) {
                    logStr += `Metadata (${choice}) does not match with text (${text}). Output = true`
                } else {
                    logStr += `Metadata (${choice}) matches with text (${text}). Output = false`
                }
                break;
            }
        }
        this.log(LogType.message, logStr)
    }
    addOption(name: OptionName, component: string, defaultVal?: any, sideBarComponent?: string, additionalOptions?: Record<string, any>): NodeOption {
        return super.addOption(name, component, defaultVal, sideBarComponent, additionalOptions);
    }

    getOptionValue(name: OptionName) {
        return super.getOptionValue(name);
    }

    getInterface(name: InterfaceName): NodeInterface {
        return super.getInterface(name);
    }
}