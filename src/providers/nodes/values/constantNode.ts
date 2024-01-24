import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";


type OptionName =
    | "Type"
    | "TextOption"
    | "Place Value"
    | "Below"
    | "Above"
    | "Boolean"
    | "Log Message + Data"
    | "";

type TypeOption = "Number" | "Boolean" | "Random" | "Percentage";
type BooleanOption = "True" | "False";
type RandomOption = "Decimal" | "Ceil" | "Floor" | "Round";


type InterfaceName = OptionName | "Output";

export class ConstantNode extends BaseNode {

    public type: string = "ConstantNode"
    public name: string = "Constant"

    constructor() {
        super();
        this.addOption("Type", "SelectOption", "Number", undefined, { items: ["Number", "Percentage", "Boolean", "Random"], hideWhen: { "Number": ["TextOption", "Place Value", "Below", "Above", "Boolean"], "Percentage": ["TextOption", "Place Value", "Below", "Above", "Boolean"], "Boolean": ["TextOption", "Place Value", "Below", "Above", ""], "Random": ["Boolean", ""] } })
        this.addOption("TextOption", "TextOption", "Random # Generated Each Iteration")
        this.addOption("Place Value", "SelectOption", "Decimal", undefined, { items: ["Decimal", "Ceil", "Floor", "Round"] })
        this.addOption("Below", "NumberOption", 1)
        this.addOption("Above", "NumberOption", 0)
        this.addOption("Boolean", "SelectOption", "True", undefined, { items: ["True", "False"] })
        this.addOutputInterface("Output")

        this.addOption("", "NumberOption", 1);
        this.addOption("Log Message + Data", "InputOption")
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

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);

        let type: TypeOption = this.getOptionValue("Type");

        switch (type) {
            case "Number": {
                let value: number = this.getOptionValue("");
                if (typeof value === "number") {
                    this.getInterface("Output").value = value;
                } else {
                    this.log(LogType.error, "Invalid number in input to constant", "The number constant must have a numeric input")
                }
                break;
            }
            case "Percentage": {
                let value: number = this.getOptionValue("");
                if (typeof value === "number") {
                    this.getInterface("Output").value = value / 100;
                } else {
                    this.log(LogType.error, "Invalid number in input to constant", "The number constant must have a numeric input")
                }
                break;
            }
            case "Boolean": {
                let booleanOption: BooleanOption = this.getOptionValue("Boolean");
                if (booleanOption == "True") {
                    this.getInterface("Output").value = true
                }
                if (booleanOption == "False") {
                    this.getInterface("Output").value = false;
                }
                break;
            }
            case "Random": {
                let lower = this.getOptionValue("Above");
                let upper = this.getOptionValue("Below");
                let r = Math.random() * (upper - lower) + lower;
                let randomOption: RandomOption = this.getOptionValue("Place Value");
                this.log(LogType.message, "random number generated: " + r)
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

        this.log(LogType.message, "Constant value being used: " + this.getInterface("Output").value)

    }
}
