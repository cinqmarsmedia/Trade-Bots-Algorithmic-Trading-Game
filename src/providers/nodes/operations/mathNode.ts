import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";

type OptionName = "Log Message + Data" | "Operation"
type InputName = "Input A" | "Input B";
type OutputName = "Result";

type InterfaceName = OptionName | InputName | OutputName;

type OperationOption = "A+B" | "A-B" | "A*B" | "A/B" | "A mod B" | "A^B" | "LogA(B)";



export class MathNode extends BaseNode {
    type: string = "MathNode";
    name: string = "Math";

    constructor() {
        super();
        this.addInputInterface("Input A")
        this.addInputInterface("Input B")

        this.addOption("Operation", "SelectOption", "A+B", undefined, {
            items: ["A+B", "A-B", "A*B", "A/B", "A mod B", "A^B", "LogA(B)"],
        });
        this.addOption("Log Message + Data", "InputOption")
        this.addOutputInterface("Result");
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        let a = this.getInterface("Input A").value;
        let b = this.getInterface("Input B").value;
        if (typeof a !== "number") {
            if (typeof a === "undefined") {
                //this.log(LogType.error, "Input A is missing", "No node is connected to input A. Please connect a valid node to input A.")
                return;
            }
            this.log(LogType.error, "Input A has an invalid type", `Input A should is not a number. Please connect a node with a numeric endpoint to input A.`)
            return;
        }
        if (typeof b !== "number") {
            if (typeof b === "undefined") {
                //this.log(LogType.error, "Input B is missing", "No node is connected to input B. Please connect a valid node to input B.")
                return;
            }
            this.log(LogType.error, "Input B has an invalid type", `Input B should is not a number. Please connect a node with a numeric endpoint to input B.`)
            return;
        }


        let condition: OperationOption = this.getOptionValue("Operation");
        let out: number;
        switch (condition) {
            case "A+B": {
                out = a + b;
                break;
            }
            case "A-B": {
                out = a - b;
                break;
            }
            case "A*B": {
                out = a * b;
                break;
            }
            case "A/B": {
                out = a / b;
                break;
            }
            case "A^B": {
                out = a ** b;
                break;
            }
            case "LogA(B)": {
                out = Math.log(b) / Math.log(a);
                break;
            }
            case "A mod B": {
                out = a % b;
                break;
            }
        }
        this.getInterface("Result").value = out;
        this.log(LogType.message, `Output = ${out}`, `Input A = ${a}, Input B = ${b}, output = ${out}`)
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