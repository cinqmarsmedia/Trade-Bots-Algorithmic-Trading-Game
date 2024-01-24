import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";


type OptionName = "Log Message + Data" | "Variable" | "Variable Name";
type InterfaceName = OptionName | "Output"

type VarOption = "A" | "B" | "C" | "D" | "Custom"

export class GetVarNode extends BaseNode {
    type: string = "GetVarNode";
    name: string = "Get Variable";


    getStoredVariable(name: string): number | boolean {
        return this.stateMachine.getVariable("BotVariable." + name);
    }

    constructor() {
        super();

        this.addOption("Variable", "SelectOption", "A", undefined, { items: ["A", "B", "C", "D", "Custom"], hideWhen: { "A": ["Variable Name"], "B": ["Variable Name"], "C": ["Variable Name"], "D": ["Variable Name"] } })
        this.addOption("Variable Name", "InputOption")
        this.addOption("Log Message + Data", "InputOption")
        this.addOutputInterface("Output")
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        let varOption: VarOption = this.getOptionValue("Variable");
        switch (varOption) {
            case "A":
            case "B":
            case "C":
            case "D":
                this.getInterface("Output").value = this.getStoredVariable(varOption);
                this.log(LogType.message, `Variable name: ${varOption}, variable value written to node's output: ${this.getInterface("Output").value} `)
                break;
            case "Custom":
                let vo = this.getOptionValue("Variable Name");
                this.getInterface("Output").value = this.getStoredVariable(vo);
                this.log(LogType.message, `Custom variable, name: ${vo}, variable value written to node's output: ${this.getInterface("Output").value} `)
                break;
        }

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