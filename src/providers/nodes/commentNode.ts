import { NodeInterface, NodeOption } from "@baklavajs/core";
import { LogType } from "../state-machine/state-machine";
import { BaseNode } from "./base-node";
import { EngineData } from "./types";



export class CommentNode extends BaseNode {
    type: string = "CommentNode";
    name: string = "Comment";

    constructor() {
        super();
        this.addOption("Type Comment Here", "InputOption")
    }

    nodeCalculate(data: EngineData) {}
}