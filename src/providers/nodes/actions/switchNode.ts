import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";



export class SwitchNode extends BaseNode {
    type: string = "SwitchNode";
    name: string = "Switch Bot";

    constructor() {
        super();
        this.addInputInterface("Trigger")
        let botNames = this.stateMachine.advancedBots;
        botNames = botNames.filter(name => name != this.stateMachine.activeBotName);
        console.log(botNames, botNames[0]);
        this.addOption("Switch to", "SelectOption", botNames[0], undefined, { items: botNames });
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        const input = this.getInterface("Trigger").value;
        if (typeof input === "undefined") {
            this.log(LogType.warning, "Trigger is undefined", "Trigger to this node is undefined. Bot will not be switched.");
            return;
        }
        if (input === true || input === 1) {
            let botName = this.getOptionValue("Switch to")
            if (botName == this.stateMachine.activeBotName) {
                this.log(LogType.warning, "Cannot switch to a bot that is already active");
                return
            }
            this.stateMachine.switchBot(botName);
            this.log(LogType.message, "Switching to bot " + botName);
        }
    }
}