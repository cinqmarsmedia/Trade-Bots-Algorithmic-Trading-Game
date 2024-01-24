import { DefaultSimpleBotName } from "../../constants";
var IfUndefined;
(function (IfUndefined) {
    IfUndefined[IfUndefined["Pause"] = -1] = "Pause";
    IfUndefined[IfUndefined["Closest"] = 0] = "Closest";
    IfUndefined[IfUndefined["Fixed"] = 1] = "Fixed";
})(IfUndefined || (IfUndefined = {}));
function ifUndefinedString(ifUndefined) {
    switch (ifUndefined) {
        case IfUndefined.Closest: {
            return "Closest Value";
        }
        case IfUndefined.Fixed: {
            return "Custom Value";
        }
        case IfUndefined.Pause: {
            return "Pause Execution";
        }
    }
}
export function createSimpleBot(definition, editor, addNodeToGrid, name) {
    if (name === void 0) { name = DefaultSimpleBotName; }
    if (!definition || !definition.entry || !definition.exit || (!definition.exit.length && !definition.entry.length)) {
        console.warn("tried to convert simple bot to advanced/node bot without a proper definition. Not doing anything.");
        console.warn(definition);
        return;
    }
    var parsedDefinition = parseSimpleBotDefinition(definition);
    //first column is for the basic/adv indicators. 
    //The second column is for the if operations.
    //Third to N-1 columns are for the consecutive logic gates where N is the number of conditions.
    //If there are multiple groups, each will occupy N-1 columns, N being the number of conditions in that group.
    //Then the inter-group Logic operators would occupy M-1 columns where M is the number of groups. 
    //After that finally would be the action (buy/sell).
    //Total num of columns = 2 + max(N)-1 + M -1 + 1 
    // = 1 + max(N) + M
    //column logic:
    //for indicators = 0
    //for if operators = 1
    //for AND/OR conditions = 2+conditionIndex
    //for group AND/OR conditions = maxColumn+1+groupConditionIndex
    //for the action = maxColumn + 1
    //row logic: increment grid[column]. Use that as the index. For conditions, add 0.5. For group conditions, use grid[0]+0.5 at the time of end of first group in the condition. So, lastgroupindex + 0.5
    var gridIndices = [0, 0, 0, 0, 0];
    var lastGroupIndex = 0;
    //clear the editor:
    editor.load({ "nodes": [], "connections": [], "panning": { "x": 0, "y": 0 }, "scaling": 1 });
    var nodeType;
    (function (nodeType) {
        nodeType[nodeType["Indicator"] = 0] = "Indicator";
        nodeType[nodeType["If"] = 1] = "If";
        nodeType[nodeType["Condition"] = 2] = "Condition";
        nodeType[nodeType["GroupCondition"] = 3] = "GroupCondition";
        nodeType[nodeType["Action"] = 4] = "Action";
    })(nodeType || (nodeType = {}));
    var X, Y, conditionIndex = 0, groupConditionIndex = 0;
    function getDimensions(type) {
        switch (type) {
            case nodeType.Indicator: {
                X = 0;
                Y = gridIndices[0]++;
                conditionIndex = 0;
                break;
            }
            case nodeType.If: {
                X = 1;
                Y = gridIndices[1]++ * 2 + 0.5;
                break;
            }
            case nodeType.Condition: {
                X = 2;
                Y = 0.5 + gridIndices[2]++;
                break;
            }
            case nodeType.GroupCondition: {
                X = 3; //2 + +(gridIndices[2] != 0);
                Y = gridIndices[2] + 0.5;
                gridIndices[3]++;
                break;
            }
            case nodeType.Action: {
                if (gridIndices[2] == 0 && gridIndices[3] == 0) {
                    X = 2;
                }
                else {
                    X = 4;
                }
                // if (gridIndices[2] !== 0 && gridIndices[3] == 0) {
                //     X = 3;
                // }
                //X = 2 + +(gridIndices[2] != 0) + +(gridIndices[3] != 0);
                Y = gridIndices[4]++;
                break;
            }
        }
        var padding = 500;
        var x = Math.floor((X + 0.1) * 0.4 * (window.innerWidth - padding) + padding / 10);
        var y = Math.floor(((Y + 0.3) * 0.25) * (window.innerHeight - padding / 2) + padding / 10);
        x = x * 1.5;
        return { x: x, y: y };
    }
    function setNodeOption(node, key, value) {
        node.options.get(key).value = value;
    }
    function addIndicatorNode(op, ifUndefined) {
        var _a = getDimensions(nodeType.Indicator), x = _a.x, y = _a.y;
        var n = addNodeToGrid(op.nodeType, x, y);
        setNodeOption(n, "If Undefined", ifUndefinedString(ifUndefined));
        switch (op.indicator) {
            case "Open":
            case "Close":
            case "High":
            case "Low":
            case "Volume":
            case "RSI":
            case "ATR":
            case "ADX":
            case "Williams%":
            case "Stochastic":
            case "DXY":
            case "Housing":
            case "Industrials":
            case "S&P":
            case "Unemployment":
            case "VIX":
            case "yield":
                {
                    setNodeOption(n, "Indicator", op.indicator);
                    break;
                }
            case "10SMA":
            case "30SMA":
            case "10EMA":
            case "30EMA":
                {
                    setNodeOption(n, "Indicator", op.indicator.substring(2));
                    setNodeOption(n, "period (days)", op.indicator.substring(0, 2));
                    break;
                }
            case "20BOLLup":
                {
                    setNodeOption(n, "Indicator", "Bollinger");
                    setNodeOption(n, "Bollinger Bound", "Upper");
                    break;
                }
            case "20BOLLmid":
                {
                    setNodeOption(n, "Indicator", "Bollinger");
                    setNodeOption(n, "Bollinger Bound", "Middle");
                    break;
                }
            case "20BOLLdn":
                {
                    setNodeOption(n, "Indicator", "Bollinger");
                    setNodeOption(n, "Bollinger Bound", "Lower");
                    break;
                }
            case "AROONup":
                {
                    setNodeOption(n, "Indicator", "AROON");
                    setNodeOption(n, "Aroon Type", "Up");
                    break;
                }
            case "AROONdown":
                {
                    setNodeOption(n, "Indicator", "AROON");
                    setNodeOption(n, "Aroon Type", "Down");
                    break;
                }
            case "kijun": {
                setNodeOption(n, "Indicator", "Ichimoku");
                setNodeOption(n, "Ichimoku Type", "kijunSen");
                break;
            }
            case "tenkan": {
                setNodeOption(n, "Indicator", "Ichimoku");
                setNodeOption(n, "Ichimoku Type", "tenkanSen");
                break;
            }
            case "R1": {
                setNodeOption(n, "Indicator", "Pivot Point");
                setNodeOption(n, "Pivot Line", "R1");
                break;
            }
            case "R2": {
                setNodeOption(n, "Indicator", "Pivot Point");
                setNodeOption(n, "Pivot Line", "R2");
                break;
            }
            case "R3": {
                setNodeOption(n, "Indicator", "Pivot Point");
                setNodeOption(n, "Pivot Line", "R3");
                break;
            }
            case "S1": {
                setNodeOption(n, "Indicator", "Pivot Point");
                setNodeOption(n, "Pivot Line", "S1");
                break;
            }
            case "S2": {
                setNodeOption(n, "Indicator", "Pivot Point");
                setNodeOption(n, "Pivot Line", "S2");
                break;
            }
            case "S3": {
                setNodeOption(n, "Indicator", "Pivot Point");
                setNodeOption(n, "Pivot Line", "S3");
                break;
            }
            case "PivotPoint": {
                setNodeOption(n, "Indicator", "Pivot Point");
                setNodeOption(n, "Pivot Line", "PV");
                break;
            }
            case "MACDLine": {
                setNodeOption(n, "Indicator", "MACD");
                setNodeOption(n, "MACD Type", "Line");
                break;
            }
            case "MACDSignal": {
                setNodeOption(n, "Indicator", "MACD");
                setNodeOption(n, "MACD Type", "Signal");
                break;
            }
            case "Stochastic": {
                setNodeOption(n, "Indicator", "Stochastic");
                setNodeOption(n, "Stochastic Type", "Fast Stochastic");
                break;
            }
            case "StochSlow": {
                setNodeOption(n, "Indicator", "Stochastic");
                setNodeOption(n, "Stochastic Type", "Slow Stochastic");
                break;
            }
        }
        if (op.when.type == "DAYS") {
            switch (op.when.n) {
                case 0:
                    {
                        setNodeOption(n, "When", "Today");
                        break;
                    }
                case 1:
                    {
                        setNodeOption(n, "When", "Yesterday");
                        break;
                    }
                default: {
                    setNodeOption(n, "When", "N Day(s) Ago");
                    setNodeOption(n, "Where N is", op.when.n);
                }
            }
        }
        else {
            var whenOption = void 0;
            switch (op.when.type) {
                case "MONTHS": {
                    whenOption = "N Month(s) Ago";
                    break;
                }
                case "WEEKS": {
                    whenOption = "N Week(s) Ago";
                    break;
                }
                case "YEARS": {
                    whenOption = "N Year(s) Ago";
                    break;
                }
                case "BOTSTART": {
                    whenOption = "Bot Start";
                    break;
                }
            }
            setNodeOption(n, "When", whenOption);
            if (op.when.type !== "BOTSTART") {
                setNodeOption(n, "Where N is", op.when.n);
            }
        }
        if (ifUndefined == IfUndefined.Fixed) {
            setNodeOption(n, "Return", -1);
        }
        return n;
    }
    function addIfNode(node1, node2, percentage, operator, type) {
        var _a = getDimensions(nodeType.If), x = _a.x, y = _a.y;
        var n = addNodeToGrid("ConditionalNode", x, y);
        var conditional;
        switch (operator) {
            case ">": {
                conditional = "A>B";
                break;
            }
            case "<": {
                conditional = "A<B";
                break;
            }
            case "==": {
                conditional = "A==B";
                break;
            }
            case "!==": {
                conditional = "A!=B";
                break;
            }
        }
        setNodeOption(n, "Conditional", conditional);
        setNodeOption(n, "B Multiplier", 1 + percentage / 100);
        //join if node to node1 and node2
        editor.addConnection(node1.interfaces.get("Output"), n.interfaces.get("Input A"));
        editor.addConnection(node2.interfaces.get("Output"), n.interfaces.get("Input B"));
        return n;
    }
    function addConditionNode(type, if1, if2) {
        var _a = getDimensions(nodeType.Condition), x = _a.x, y = _a.y;
        var operation = (type == "AND") ? ("A AND B") : ("A OR B");
        y = (if1["position"].y + if2["position"].y) / 2;
        var n = addNodeToGrid("LogicNode", x, y);
        n.setOptionValue("Operation", operation);
        editor.addConnection(n.interfaces.get("Input B"), if1.interfaces.get("Then"));
        editor.addConnection(n.interfaces.get("Input A"), if2.interfaces.get("Then"));
        return n;
    }
    function addGroupConditionNode(type, node1) {
        var _a = getDimensions(nodeType.GroupCondition), x = _a.x, y = _a.y;
        var operation = (type == "AND") ? ("A AND B") : ("A OR B");
        var n = addNodeToGrid("LogicNode", x, y);
        n.setOptionValue("Operation", operation);
        editor.addConnection(n.interfaces.get("Input A"), node1.interfaces.get("Then"));
        return n;
    }
    function joinGroupCondition(groupNode, node2) {
        editor.addConnection(groupNode.interfaces.get("Input B"), node2.interfaces.get("Then"));
        var x = groupNode["position"].x;
        var y = node2["position"].y;
        groupNode["position"] = { x: x, y: y };
        groupNode["position"] = { x: x, y: y }; //do not remove this duplicate line!
    }
    function addActionNode(type, amount, frequency, exitGroupNode) {
        var _a = getDimensions(nodeType.Action), x = _a.x, y = _a.y;
        var n = addNodeToGrid("TradeNode", x, exitGroupNode["position"].y || y);
        var tradeTypes = ["Buy", "Sell", "Short", "Cover"];
        var index = +parsedDefinition.short * 2 + +(type == "exit");
        var tradeType = tradeTypes[index];
        n.setOptionValue("Type", tradeType);
        if (type == "entry") {
            n.setOptionValue("% Cash", amount);
        }
        else {
            n.setOptionValue("% Invested", amount);
        }
        if (frequency == 0) {
            n.setOptionValue("Times", "Once");
        }
        else {
            if (frequency == 1) {
                n.setOptionValue("Times", "Unlimited");
            }
            else {
                n.setOptionValue("Times", "Once Per N Days");
                // n.setOptionValue("Within", "X Days");
                n.setOptionValue("Where N is", frequency);
            }
        }
        editor.addConnection(exitGroupNode.interfaces.get("Then"), n.interfaces.get("Trigger"));
    }
    var sets = [{ groups: parsedDefinition.entry.groups, action: "entry", ifUndefined: parsedDefinition.entry.ifUndefined }, { groups: parsedDefinition.exit.groups, action: "exit", ifUndefined: parsedDefinition.exit.ifUndefined }];
    sets.forEach(function (_a) {
        var groups = _a.groups, action = _a.action, ifUndefined = _a.ifUndefined;
        var lastGroupNode;
        var lastIfNode;
        var prevIfNode;
        var lastConditionNode;
        groups.forEach(function (group, i) {
            if (i > 0) {
                //add the group condition first
                lastGroupNode = addGroupConditionNode(group.type, lastGroupNode || lastConditionNode || lastIfNode); //create a group node and join it with the previous exit node.
            }
            group.conditions.forEach(function (condition, j) {
                if (j == 0) {
                    lastConditionNode = null;
                    lastIfNode = null;
                }
                var n1 = addIndicatorNode(condition.op1, ifUndefined);
                var n2 = addIndicatorNode(condition.op2, ifUndefined);
                prevIfNode = lastIfNode;
                lastIfNode = addIfNode(n1, n2, condition.op1.percentage, condition.operator, condition.type);
                if (lastConditionNode || prevIfNode) {
                    lastConditionNode = addConditionNode(condition.type, lastIfNode, lastConditionNode || prevIfNode);
                }
            });
            if (i > 0) {
                joinGroupCondition(lastGroupNode, lastConditionNode || lastIfNode);
            }
            //sometimes there's just an if loop, and sometimes there are multiple if loops with AND/OR conditions in which case we need the final AND/OR condition's output
            lastGroupIndex = gridIndices[0];
        });
        if (lastGroupNode || lastConditionNode || lastIfNode) {
            addActionNode(action, parsedDefinition[action].amount, parsedDefinition[action].frequency, lastGroupNode || lastConditionNode || lastIfNode);
        }
    });
    //TODO implement halt sim /lossThreshold
    var saved = editor.save();
    //editor.load({ "nodes": [], "connections": [], "panning": { "x": 0, "y": 0 }, "scaling": 1 });
    return saved;
}
function parseSimpleBotDefinition(definition) {
    var entryGroups = parseConditions(definition.entry);
    var exitGroups = parseConditions(definition.exit);
    var entry = {
        groups: entryGroups,
        amount: +definition.entryAmt,
        frequency: +definition.entryFreq,
        ifUndefined: +definition.entryUndef,
    };
    var exit = {
        groups: exitGroups,
        amount: +definition.exitAmt,
        frequency: +definition.exitFreq,
        ifUndefined: +definition.exitUndef,
    };
    var short = definition.short;
    var lossThreshold = +definition.stopThresh;
    var parsedDefinition = {
        entry: entry,
        exit: exit,
        short: short,
        lossThreshold: lossThreshold
    };
    return parsedDefinition;
}
function parseConditions(entry) {
    //first, identify groups.
    var groups = [{ type: "AND", conditions: [] }];
    for (var i = 0; i < entry.length; i++) {
        var condition = entry[i];
        if (condition[0] == '_') {
            var type = condition[1].toUpperCase();
            groups.push({ type: type.toUpperCase(), conditions: [] });
        }
        else {
            groups[groups.length - 1].conditions.push(parseCondition(condition));
        }
    }
    return groups;
}
function parseCondition(condition) {
    if (condition.length < 7) {
        console.warn("invalid condition, don't know what to do: ", condition);
        return null;
    }
    var operator = condition[3];
    var type = condition[6].toUpperCase();
    var op1 = {
        nodeType: getNodeType(condition[0]),
        indicator: condition[0],
        when: parseWhenString(condition[1]),
        percentage: +(condition[2] + "".match(/\d+/)),
    };
    var op2 = {
        nodeType: getNodeType(condition[4]),
        indicator: condition[4],
        when: parseWhenString(condition[5])
    };
    var c = {
        operator: operator,
        op1: op1,
        op2: op2,
        type: type
    };
    return c;
}
function parseWhenString(str) {
    str = str.toUpperCase();
    switch (str) {
        case "TODAY": {
            return {
                n: 0,
                type: "DAYS"
            };
        }
        case "YESTERDAY": {
            return {
                n: 1,
                type: "DAYS"
            };
        }
        case "BOTSTART": {
            return {
                n: 0,
                type: "BOTSTART"
            };
        }
        default: {
            var n = parseInt(str.match(/\d+/));
            var type = void 0;
            if (str.includes('M')) {
                type = "MONTHS";
            }
            if (str.includes('Y')) {
                type = "YEARS";
            }
            if (str.includes('D')) {
                type = "DAYS";
            }
            if (str.includes('W')) {
                type = "WEEKS";
            }
            return { n: n, type: type };
        }
    }
}
function getNodeType(indicator) {
    var nodeType;
    switch (indicator.toUpperCase()) {
        case "OPEN":
        case "CLOSE":
        case "HIGH":
        case "LOW":
        case "VOLUME":
        case "ADJ CLOSE":
        case "CASH":
        case "INVESTED":
            nodeType = "ValNode";
            break;
        case "DXY":
        case "HOUSING":
        case "INDUSTRIALS":
        case "S&P":
        case "UNEMPLOYMENT":
        case "VIX":
        case "YIELD":
            nodeType = "LeadValNode";
            break;
        default:
            nodeType = "AdvValNode";
    }
    return nodeType;
}
//# sourceMappingURL=simple-bots.js.map