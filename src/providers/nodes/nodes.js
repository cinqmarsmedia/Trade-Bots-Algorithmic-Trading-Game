var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
/*
  Generated class for the NodesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var NodesProvider = /** @class */ (function () {
    function NodesProvider(http) {
        this.http = http;
        console.log('Hello NodesProvider Provider');
    }
    NodesProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], NodesProvider);
    return NodesProvider;
}());
export { NodesProvider };
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
//# sourceMappingURL=nodes.js.map