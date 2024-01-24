import { Node, NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";

type OptionName = "Log Message + Data" | "Operation"
type InputName = "Input A" | "Input B";
type OutputName = "Then" | "Else";

type InterfaceName = OptionName | InputName | OutputName;

type OperationOption = "A AND B" | "A OR B" | "A XOR B";

export class LogicNode extends BaseNode {
    type: string = "LogicNode";
    name: string = "Logic Gate";

    constructor() {
        super();
        this.addInputInterface("Input A")
        this.addInputInterface("Input B")

        this.addOption("Operation", "SelectOption", "A OR B", undefined, {
            items: ["A AND B", "A OR B", "A XOR B"],
        });
        this.addOption("Log Message + Data", "InputOption")
        this.addOutputInterface("Then");
        this.addOutputInterface("Else");
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        let a: boolean = this.getInterface("Input A").value;
        let b: boolean = this.getInterface("Input B").value;
        if (typeof a !== "boolean") {
            if (typeof a === "undefined") {
                //this.log(LogType.error, "Input A is not defined. Please connect a valid node's endpoint to Input A")
                return;
            }
            this.log(LogType.error, "Input A is invalid. Input A can only accept values of kind true or false. Please connect an appropriate endpoint to Input A");
            return;
        }
        if (typeof b !== "boolean") {
            if (typeof b === "undefined") {
                //this.log(LogType.error, "Input B is not defined. Please connect a valid node's endpoint to Input B")
                return;
            }
            this.log(LogType.error, "Input B is invalid. Input B can only accept values of kind true or false. Please connect an appropriate endpoint to Input B");
            return;
        }
        let op: OperationOption = this.getOptionValue("Operation");
        let out: boolean;
        switch (op) {
            case "A AND B": {
                out = a && b;
                break;
            }
            case "A OR B": {
                out = a || b;
                break;
            }
            case "A XOR B": {
                out = a !== b;
                break;
            }
        }
        this.getInterface("Then").value = out;
        this.getInterface("Else").value = !out;
        this.log(LogType.message, `Input A is ${a}, Input B is ${b}, output "then" is ${out} and output "else" is ${!out}`)
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