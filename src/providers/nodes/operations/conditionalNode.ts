import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";

type OptionName = "Log Message + Data" | "Conditional" | "B Multiplier"
type InputName = "Input A" | "Input B";
type OutputName = "Then" | "Else";

type InterfaceName = OptionName | InputName | OutputName;

type ConditionOption = "A>B" | "A==B" | "A>=B" | "A!=B" | "A<B" | "A<=B";



export class ConditionalNode extends BaseNode {
    type: string = "ConditionalNode";
    name: string = "If (Conditional)";

    constructor() {
        super();
        this.addInputInterface("Input A")
        this.addInputInterface("Input B")

        this.addOption("Conditional", "SelectOption", "A>B", undefined, {
            items: ["A>B", "A<B","A>=B","A<=B","A==B", "A!=B"],
        });
        this.addOption("B Multiplier", "NumberOption", 1, undefined, { min: -10000, max: 10000, isSetting: true })
        this.addOption("Log Message + Data", "InputOption")
        this.addOutputInterface("Then");
        this.addOutputInterface("Else");
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        // if (typeof this.getInterface("Input A").value === "undefined") {
        //     this.log(LogType.error, "Node is suspended as input A is not defined. Please connect a valid node endpoint to input A.")
        //     return;
        // }
        // if (typeof this.getInterface("Input B").value === "undefined") {
        //     this.log(LogType.error, "Node is suspended as input B is not defined. Please connect a valid node endpoint to input B.")
        //     return;
        // }

        let multiplier = this.getOptionValue("B Multiplier");
        let a = this.getInterface("Input A").value;
        let b = this.getInterface("Input B").value * multiplier;
        let condition: ConditionOption = this.getOptionValue("Conditional");

        let out: boolean;
        switch (condition) {
            case "A!=B": {
                out = a != b;
                break;
            }
            case "A==B": {
                out = a == b;
                break;
            }
            case "A>=B": {
                out = a >= b;
                break;
            }
            case "A>B": {
                out = a > b;
                break;
            }
            case "A<=B": {
                out = a <= b;
                break;
            }
            case "A<B": {
                out = a < b;
                break;
            }
        }
        
        this.getInterface("Then").value = out;
        this.getInterface("Else").value = !out;
        this.log(LogType.message, `Input A = ${a}, Input B = ${b} Then is ${out}, Else is ${!out}`)
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

    addInputInterface(name: InputName): NodeInterface {
        return super.addInputInterface(name);
    }

    addOutputInterface(name: OutputName, additionalProperties?: Record<string, any>): NodeInterface {
        return super.addOutputInterface(name, additionalProperties);
    }
}