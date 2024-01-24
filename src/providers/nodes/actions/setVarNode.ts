import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";


type OptionName = "Log Message + Data" | "Variable" | "Variable Name";
type InterfaceName = OptionName | "Input" | "Trigger"

type VarOption = "A" | "B" | "C" | "D" | "Custom"

export class SetVarNode extends BaseNode {
    type: string = "SetVarNode";
    name: string = "Set Variable";

    setStoredVariable(name: string, value: number | boolean): void {
        if (this.getInterface("Trigger").value) {
            this.stateMachine.setVariable("BotVariable." + name, value);
        }
    }

    constructor() {
        super();
        this.addOption("Variable", "SelectOption", "A", undefined, { items: ["A", "B", "C", "D", "Custom"], hideWhen: { "A": ["Variable Name"], "B": ["Variable Name"], "C": ["Variable Name"], "D": ["Variable Name"] } })
        this.addOption("Variable Name", "InputOption")
        this.addOption("Log Message + Data", "InputOption")
        this.addInputInterface("Trigger")
        this.addInputInterface("Input")
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        const input = this.getInterface("Input").value;
        if(typeof input==="undefined"){
            this.log(LogType.warning, "Input is undefined", "Input to this node is undefined. Input must have a value to store in a variable.");
            return;
        }
        let varOption: VarOption = this.getOptionValue("Variable");
        switch (varOption) {
            case "A":
            case "B":
            case "C":
            case "D":
                this.setStoredVariable(varOption, input);
                break;
            case "Custom":
                let vo = this.getOptionValue("Variable Name");
                this.setStoredVariable(vo, input);
                break;
        }
        this.log(LogType.message, "Stored value " + input + " in variable " + varOption, `Variable name: ${varOption}, Value: ${input}`)
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