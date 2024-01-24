var IfCondition;
(function (IfCondition) {
    IfCondition[IfCondition["GT"] = 0] = "GT";
    IfCondition[IfCondition["LT"] = 1] = "LT";
    IfCondition[IfCondition["EQ"] = 2] = "EQ";
    IfCondition[IfCondition["GE"] = 3] = "GE";
    IfCondition[IfCondition["LE"] = 4] = "LE";
    IfCondition[IfCondition["NE"] = 5] = "NE";
})(IfCondition || (IfCondition = {}));
var LogicCondition;
(function (LogicCondition) {
    LogicCondition[LogicCondition["AND"] = 0] = "AND";
    LogicCondition[LogicCondition["OR"] = 1] = "OR";
    LogicCondition[LogicCondition["XOR"] = 2] = "XOR";
})(LogicCondition || (LogicCondition = {}));
var MathBasicOp;
(function (MathBasicOp) {
    MathBasicOp[MathBasicOp["ADD"] = 0] = "ADD";
    MathBasicOp[MathBasicOp["SUB"] = 1] = "SUB";
    MathBasicOp[MathBasicOp["MUL"] = 2] = "MUL";
    MathBasicOp[MathBasicOp["DIV"] = 3] = "DIV";
    MathBasicOp[MathBasicOp["MOD"] = 4] = "MOD";
    MathBasicOp[MathBasicOp["XOR"] = 5] = "XOR";
    MathBasicOp[MathBasicOp["LOG"] = 6] = "LOG";
})(MathBasicOp || (MathBasicOp = {}));
var RangeType;
(function (RangeType) {
    RangeType[RangeType["LARGEST"] = 0] = "LARGEST";
    RangeType[RangeType["SMALLEST"] = 1] = "SMALLEST";
    RangeType[RangeType["MEAN"] = 2] = "MEAN";
    RangeType[RangeType["STDV"] = 3] = "STDV";
    RangeType[RangeType["MEDIAN"] = 4] = "MEDIAN";
    RangeType[RangeType["MODE"] = 5] = "MODE";
})(RangeType || (RangeType = {}));
function IfThen(inputA, inputB, condition) {
    var A = inputA();
    var B = inputB();
    switch (condition) {
        case IfCondition.GT: {
            if (A > B) {
                return true;
            }
            break;
        }
        case IfCondition.LT: {
            if (A < B) {
                return true;
            }
            break;
        }
        case IfCondition.EQ: {
            if (A == B) {
                return true;
            }
            break;
        }
        case IfCondition.GE: {
            if (A >= B) {
                return true;
            }
            break;
        }
        case IfCondition.LE: {
            if (A <= B) {
                return true;
            }
            break;
        }
        case IfCondition.NE: {
            if (A != B) {
                return true;
            }
            break;
        }
        default: return false;
    }
}
function IfElse(inputA, inputB, condition) {
    var A = inputA();
    var B = inputB();
    switch (condition) {
        case IfCondition.GT: {
            if (!(A > B)) {
                return true;
            }
            break;
        }
        case IfCondition.LT: {
            if (!(A < B)) {
                return true;
            }
            break;
        }
        case IfCondition.EQ: {
            if (!(A == B)) {
                return true;
            }
            break;
        }
        case IfCondition.GE: {
            if (!(A >= B)) {
                return true;
            }
            break;
        }
        case IfCondition.LE: {
            if (!(A <= B)) {
                return true;
            }
            break;
        }
        case IfCondition.NE: {
            if (!(A != B)) {
                return true;
            }
            break;
        }
        default: return false;
    }
}
function LogicGateThen(inputA, inputB, condition) {
    var A = inputA();
    var B = inputB();
    switch (condition) {
        case LogicCondition.AND: {
            return A && B;
        }
        case LogicCondition.OR: {
            return A || B;
        }
        case LogicCondition.XOR: {
            return A !== B;
        }
        default: return false;
    }
}
function LogicGateElse(inputA, inputB, condition) {
    var A = inputA();
    var B = inputB();
    switch (condition) {
        case LogicCondition.AND: {
            return !(A && B);
        }
        case LogicCondition.OR: {
            return !(A || B);
        }
        case LogicCondition.XOR: {
            return !(A !== B);
        }
        default: return false;
    }
}
function MathBasic(inputA, inputB, op) {
    var A = inputA();
    var B = inputB();
    switch (op) {
        case MathBasicOp.ADD: {
            return A + B;
        }
        case MathBasicOp.SUB: {
            return A - B;
        }
        case MathBasicOp.MUL: {
            return A * B;
        }
        case MathBasicOp.DIV: {
            return A / B;
        }
        case MathBasicOp.MOD: {
            return A | B;
        }
        case MathBasicOp.XOR: {
            return A ^ B;
        }
        case MathBasicOp.LOG: {
            return Math.log(B) / Math.log(A);
        }
    }
}
function RangeValue(indicator, rangeType, days) {
    var input = [].concat(indicator());
    switch (rangeType) {
        case (RangeType.LARGEST): {
            return max(input);
        }
        case (RangeType.SMALLEST): {
            return min(input);
        }
        case (RangeType.MEAN): {
            return mean(input);
        }
        case (RangeType.STDV): {
            return stdv(input);
        }
        case (RangeType.MEDIAN): {
            return median(input);
        }
        case (RangeType.MODE): {
            return mode(input);
        }
    }
}
function max(n) {
    return Math.max.apply(Math, n);
}
function min(n) {
    return Math.min.apply(Math, n);
}
function mean(n) {
    return n.reduce(function (prev, curr) { return prev + curr; }, 0) / n.length;
}
function stdv(n) {
    return Math.sqrt(n.map(function (x) { return Math.pow(x - mean(n), 2); }).reduce(function (a, b) { return a + b; }) / n.length);
}
function median(n) {
    var sorted = n.slice().sort(function (a, b) { return a - b; });
    var middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}
function mode(n) {
    var modes = [], count = [], i, number, maxIndex = 0;
    for (i = 0; i < n.length; i += 1) {
        number = n[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }
    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }
    return modes[0];
}
//# sourceMappingURL=operations.js.map