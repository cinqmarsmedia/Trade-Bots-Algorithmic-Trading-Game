import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData, InterfaceToggles, TrainingData } from "../types";

type OptionName = "Log Message + Data" | "Network ID" | "# of Inputs" | "Trigger Conditionally" | "# of Data Points"
type InterfaceName = OptionName | "Input A" | "Input B" | "Input C" | "Input D" | "Input E" | "Output" | "If"
type NumInputsOption = "1 Input" | "2 Inputs" | "3 Inputs" | "4 Inputs" | "5 Inputs"
type NetOption = "Net I" | "Net II" | "Net III" | "Net IV" | "Net V"

export class TrainNode extends BaseNode {
    type: string = "TrainNode";
    name: string = "Add Data Pts";
    netID: number = 1;
    netKey: string = "TrainingData." + this.netID;

    public interfaceToggles: InterfaceToggles = { "If": false, "Input C": false, "Input D": false, "Input E": false }

    constructor() {
        super();
        this.setNumDataPts = this.setNumDataPts.bind(this);
        this.addOption("Network ID", "SelectOption", "Net I", undefined, { items: ["Net I", "Net II", "Net III", "Net IV", "Net V"], hideWhen: {} })
        this.addOption("# of Inputs", "SelectOption", "2 Inputs", undefined, { items: ["1 Input", "2 Inputs", "3 Inputs", "4 Inputs", "5 Inputs"], hideWhen: {} })
        this.addOption("Trigger Conditionally", "SelectOption", "Always", undefined, { items: ["Always", "Dependent"], hideWhen: {} })

        //this.addOption("Auto Train", "InputOption")
        this.addOption("Log Message + Data", "InputOption")
        this.addOption("# of Data Points", "TextOption", "Data Points: 0");
        this.addInputInterface("If");
        this.addInputInterface("Input A");
        this.addInputInterface("Input B");
        this.addInputInterface("Input C");
        this.addInputInterface("Input D");
        this.addInputInterface("Input E");
        this.addInputInterface("Output");
        this.updateNetwork();
    }

    load(arg: any) {
        let res = super.load(arg);
        this.updateNetwork();
        return res;
    }

    updateNetwork() {
        let netOption: NetOption = this.getOptionValue("Network ID");
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
        let values = this.stateMachine.getVariable(this.netKey) || [];
        this.setNumDataPts(values);

        this.stateMachine.subscribe(this.netKey, this.setNumDataPts);
    }

    setNumDataPts(values = []) {
        this.setOptionValue("# of Data Points", "Data Points: " + values.length);
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        //get the condition
        let condition: boolean;
        let conditionInterface = this.getInterface("If").value;
        if (typeof (conditionInterface) === "undefined") {
            //if there's no attached input to the condition node, then the condition is assumed to be true.
            conditionInterface = true;
            if (this.getOptionValue("Trigger Conditionally") == "Dependent") {
                this.log(LogType.warning, "No trigger defined", "Trigger conditionally is set to 'Dependent', however the 'If' input is unconnected. The node will be active and function as if Trigger conditionally was set to 'Always'. ")
            }
        }

        condition = conditionInterface == true;


        //get all inputs
        const numInputsStr: NumInputsOption = this.getOptionValue("# of Inputs")
        let numInputs = +numInputsStr[0];
        let inputs = [];
        for (let i = 0; i < numInputs; i++) {
            const input = this.getInterface("Input " + String.fromCharCode('A'.charCodeAt(0) + i) as InterfaceName).value;
            if (typeof input !== "undefined") {
                inputs.push(input);
            } else {
                inputs.push(null);
            }
        }

        //get the output
        let output = this.getInterface("Output").value;


        //get the current net ID
        this.updateNetwork();
        inputs = inputs.map(x => x * 1.0);
        output *= 1.0;


        const trainingData: TrainingData = [{
            input: inputs,
            output: [output]    
        }]

        let values = this.stateMachine.getVariable(this.netKey) || [];
        values.push(...trainingData);
        this.stateMachine.setVariable(this.netKey, values);
        //this.log(LogType.message, "Stored value " + JSON.stringify(store) + " in variable " + netKey, `Variable name: ${netKey}, Value: ${JSON.stringify(values)}`)
    }

    addOption(name: OptionName, component: string, defaultVal?: any, sideBarComponent?: string, additionalOptions?: Record<string, any>): NodeOption {
        return super.addOption(name, component, defaultVal, sideBarComponent, additionalOptions);
    }

    getOptionValue(name: OptionName) {
        return super.getOptionValue(name);
    }
    setOptionValue(name: OptionName, value: any) {
        return super.setOptionValue(name, value);
    }

    getInterface(name: InterfaceName): NodeInterface {
        return super.getInterface(name);
    }
}