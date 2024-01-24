import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../../state-machine/state-machine";
import { BaseNode } from "../base-node";
import { EngineData } from "../types";



export class StopNode extends BaseNode {
    type: string = "StopNode";
    name: string = "Stop Bot";

    constructor() {
        super();
        this.addInputInterface("Input")
        this.addOption("Description", "TextOption", "Restart after N days", undefined, { isSetting: true });
        this.addOption("Where N is", "IntegerOption", 0, undefined, { isSetting: true })
        this.addOption("Days are", "SelectOption", "Traded Days", undefined, { isSetting: true, items: ["Actual Days", "Traded Days"] })
    }

    nodeCalculate(data: EngineData) {
        super.nodeCalculate(data);
        const input = this.getInterface("Input").value;
        if (typeof input === "undefined") {
            this.log(LogType.warning, "Input is undefined", "Input to this node is undefined. Bot will not be stopped.");
            return;
        }
        if (input === true || input === 1) {
            this.stopped = true;
            this.log(LogType.message, "Stopping bot " + this.name)

            let N = (this.getOptionValue("Where N is"))
            if (N === 0) {
                return;
            }
            let withinStrategy = this.getOptionValue("Days are");
            if (withinStrategy == "Traded Days") {
                const targetIndex = data.dateKeyIndex + N;
                this.stateMachine.setVariable("restartIndex", targetIndex);
            }
            if (withinStrategy == "Actual Days") {
                const currentDate: Date = data.currentData[data.dateKeyIndex].date;
                const targetDate: Date = new Date(currentDate.getTime() + 24 * 3600 * 1000 * N)
                this.stateMachine.setVariable("restartDate", targetDate);
            }
        }
    }
}