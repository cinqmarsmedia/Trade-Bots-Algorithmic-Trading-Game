import { Node } from "@baklavajs/core";
import { AppInjector } from "../../app/app.module";
import { LogItem, LogObj, LogType, StateMachine } from "../state-machine/state-machine";
import { EngineData } from "./types";


export class BaseNode extends Node {
    public type: string 
    public name: string 
    public stateMachine: StateMachine
    public data: EngineData

    constructor(){
        super();
        this.stateMachine = AppInjector.get(StateMachine);
        window["sm"] = this.stateMachine;
    }

    calculate(data: EngineData) {
        if (window["editor"].nodeCategories.get("Action").includes(this.type)) {
            if (this.stateMachine.pauseFlag) {
                return undefined;
            }
            return this.nodeCalculate(data);
        }
        if (this.type != "GetVarNode" && window["editor"].nodeCategories.get("Value").includes(this.type)) {
            const ret = this.nodeCalculate(data)
            if (this.interfaces.get("Output") && typeof this.getInterface("Output").value === "undefined") {
                this.stateMachine.pauseFlag = true;
            }
            return ret;
        }
        return this.nodeCalculate(data);
    }

    nodeCalculate(data: EngineData) {
        this.data = data;
    }

    set stopped(stopped: boolean) {
        this.stateMachine.setVariable('Stopped', stopped)
    }

    get stopped() {
        let stopped = this.stateMachine.getVariable('Stopped');
        return (stopped === true || stopped === 1)
    }

    get shouldLog(): boolean{
        return this.stateMachine.shouldLog(this.id);
    }

    log(type: LogType, message: string, detail?: string) {
        if(type==LogType.message && !this.shouldLog){
            return;
        }

        //revert type to message to interface with existing downstream codebase, but these messages would show even if logging is disabled.
        if (type == LogType.alert) {
            type = LogType.message;
        }

        const logItem: LogItem = {
            type,
            message: this.name + ": " + message,
            detail,
            dateKeyIndex: this.data.dateKeyIndex,
            nodeID: this.id,
            cash: this.data.cash,
            invested: this.data.invested,
            netWorth: this.data.netWorth,
            date: this.data.currentData[this.data.dateKeyIndex].date,
            loanData: this.data.loanData
        };

        this.stateMachine.writeLog(logItem);
    }
}
