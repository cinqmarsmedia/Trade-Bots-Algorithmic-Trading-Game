
enum IfCondition {
    GT,  //A>B
    LT,
    EQ,
    GE,
    LE,
    NE
}

enum LogicCondition {
    AND,
    OR,
    XOR
}

enum MathBasicOp {
    ADD,
    SUB,
    MUL,
    DIV,
    MOD,
    XOR,
    LOG
}

enum RangeType {
    LARGEST,
    SMALLEST,
    MEAN,
    STDV,
    MEDIAN,
    MODE
}

function IfThen(inputA: Function, inputB: Function, condition: IfCondition): boolean {
    const A = inputA();
    const B = inputB();
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



function IfElse(inputA: () => number, inputB: () => number, condition: IfCondition): boolean {
    const A = inputA();
    const B = inputB();
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


function LogicGateThen(inputA: () => boolean, inputB: () => boolean, condition: LogicCondition): boolean {
    const A = inputA();
    const B = inputB();

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


function LogicGateElse(inputA: () => boolean, inputB: () => boolean, condition: LogicCondition): boolean {
    const A = inputA();
    const B = inputB();

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


function MathBasic(inputA: () => number, inputB: () => number, op: MathBasicOp): number {
    const A = inputA();
    const B = inputB();
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


function RangeValue(indicator: () => number | number[], rangeType: RangeType, days: number): number {
    const input: number[] = [].concat(indicator());


    switch (rangeType) {
        case (RangeType.LARGEST): {
            return max(input);
        }
        case (RangeType.SMALLEST): {
            return min(input);
        }
        case (RangeType.MEAN): {
            return mean(input)
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


function max(n: number[]): number {
    return Math.max(...n);
}
function min(n: number[]): number {
    return Math.min(...n);
}
function mean(n: number[]): number {
    return n.reduce((prev, curr) => prev + curr, 0) / n.length;
}
function stdv(n: number[]): number {
    return Math.sqrt(n.map(x => Math.pow(x - mean(n), 2)).reduce((a, b) => a + b) / n.length)
}
function median(n: number[]): number {
    const sorted = n.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
}
function mode(n: number[]): number {
    let modes = [], count = [], i, number, maxIndex = 0;

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