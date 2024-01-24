import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData, InterfaceToggles } from "../types";

type OptionName = "Log Message + Data" | "Network" | "# of Inputs"
type InputName = "Input A" | "Input B" | "Input C" | "Input D" | "Input E";
type OutputName = "Output";

type InterfaceName = OptionName | InputName | OutputName;
declare var brain;



export class NetworkNode extends BaseNode {
    type: string = "NetworkNode";
    name: string = "Network Output";

    public interfaceToggles: InterfaceToggles = {"Input C":false,"Input D":false, "Input E":false}

    constructor() {
        super();
        this.addInputInterface("Input A")
        this.addInputInterface("Input B")
        this.addInputInterface("Input C")
        this.addInputInterface("Input D")
        this.addInputInterface("Input E")

        this.addOption("Network", "SelectOption", "Net I", undefined, {
            items: ["Net I", "Net II", "Net III", "Net IV", "Net V"],
        });
        this.addOption("# of Inputs", "SelectOption", "2 Inputs", undefined, { items: ["1 Input", "2 Inputs", "3 Inputs", "4 Inputs", "5 Inputs"], hideWhen: {} })
        this.addOption("Log Message + Data", "InputOption")
        this.addOutputInterface("Output");
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        //turn all inputs to boolean or numeric
        let inputs = [];

        let numInputsStr: string = this.getOptionValue("# of Inputs");
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
        let networkID: number;
        switch(this.getOptionValue('Network')){
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

        const netData = this.stateMachine.getVariable(`NeuralNetwork.${networkID}`);
        if (!netData) {
            this.log(LogType.warning, "Tried to run network operation before the network was trained")
            return;
        }
        const { minMax, netJSON } = netData

        inputs = inputs.map((x,i)=>{
            if(typeof x === "undefined" || x==null){
                return 0;
            }
            if(typeof x === "boolean"){
                return +x;
            }
            let [min, max] = minMax[i];
            return (x-min)/(max-min);
        });


        const neuralNet = new brain.NeuralNetwork();
        neuralNet.fromJSON(netJSON);

        let [out] = neuralNet.run(inputs);
        let [outMin, outMax] = minMax[minMax.length-1];
        out = outMin + (outMax - outMin) * out;
        this.getInterface("Output").value = out;

        this.log(LogType.message, `Output = ${out}`, `Inputs: ${inputs}, output: ${out}`)
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