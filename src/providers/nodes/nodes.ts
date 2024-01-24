import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


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
/*
  Generated class for the NodesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NodesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello NodesProvider Provider');
  }

  

}



function IfThen(inputA: Function, inputB: Function, condition: IfCondition): boolean {
  const A = inputA();
  const B = inputB();
  switch (condition){
    case IfCondition.GT: {
      if(A>B){
        return true;
      }
      break;
    }
    case IfCondition.LT: {
      if(A<B){
        return true;
      }
      break;
    }
    case IfCondition.EQ: {
      if(A==B){
        return true;
      }
      break;
    }
    case IfCondition.GE: {
      if(A>=B){
        return true;
      }
      break;
    }
    case IfCondition.LE: {
      if(A<=B){
        return true;
      }
      break;
    }
    case IfCondition.NE: {
      if(A!=B){
        return true;
      }
      break;
    }
    default: return false;
  }
}



function IfElse(inputA: ()=>number, inputB: ()=>number, condition: IfCondition): boolean {
  const A = inputA();
  const B = inputB();
  switch (condition){
    case IfCondition.GT: {
      if(!(A>B)){
        return true;
      }
      break;
    }
    case IfCondition.LT: {
      if(!(A<B)){
        return true;
      }
      break;
    }
    case IfCondition.EQ: {
      if(!(A==B)){
        return true;
      }
      break;
    }
    case IfCondition.GE: {
      if(!(A>=B)){
        return true;
      }
      break;
    }
    case IfCondition.LE: {
      if(!(A<=B)){
        return true;
      }
      break;
    }
    case IfCondition.NE: {
      if(!(A!=B)){
        return true;
      }
      break;
    }
    default: return false;
  }
}


function LogicGateThen(inputA: ()=>boolean, inputB: ()=>boolean, condition:LogicCondition){
  const A = inputA();
  const B = inputB();

  switch (condition){
    case LogicCondition.AND: {
      return A&&B;
    }

    case LogicCondition.OR: {
      return A||B;
    }

    case LogicCondition.XOR: {
      return A!==B;
    }

    default: return false;
  }
}


function LogicGateElse(inputA: ()=>boolean, inputB: ()=>boolean, condition:LogicCondition){
  const A = inputA();
  const B = inputB();

  switch (condition){
    case LogicCondition.AND: {
      return !(A&&B);
    }

    case LogicCondition.OR: {
      return !(A||B);
    }

    case LogicCondition.XOR: {
      return !(A!==B);
    }

    default: return false;
  }
}


