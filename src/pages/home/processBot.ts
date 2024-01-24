export function processBot(interval){
console.log(this.botDefinitions[this.activeBot].nodes)

var resolved={};
var boolOps=[];
var mathOps=[]

  //--------------first resolve all nodes that have no inputs, only outputs--------------------
Object.keys(this.botDefinitions[this.activeBot].nodes).forEach((key)=>{

  var node=this.botDefinitions[this.activeBot].nodes[key];

if (Object.keys(node.inputs).length==0){
  //console.log(node.data);
  if (node.type=="Constant"){
  resolved[key]=node.data.num
  }else if (node.type.includes("Range")){
// calc range
  }else if (node.type.includes("Value") || node.type.includes("Indicator")){
var indicator=node.data.Indicator.toLowerCase();

    if (node.data.Indicator=="Cash" || node.data.Indicator=="Invested"){
// Get Cash or Invested Amt
  resolved[key]=this.historicalCashInvested[this.dateKeyIndex-node.data.DaysAgo][indicator=="cash"?0:1]

    }else if (indicator=="close" || indicator=="open" || indicator=="adj" || indicator=="high" || indicator=="low" || indicator=="volume"){
// Get Current Data
if (this.currentData[this.dateKeyIndex-node.data.DaysAgo]){
resolved[key]=this.currentData[this.dateKeyIndex-node.data.DaysAgo][indicator]
}else{  
  resolved[key]=null;
}
    }else{
// LookUp Indicator from Techan
      var options={} 
      options=node.data
console.log(indicator);

     resolved[key]=this.chartsProvider.calculateData(indicator,this.getRelativeDate(node.data.DaysAgo),options)

    }
    
    
    
  }
      //console.log(this.botDefinitions[this.activeBot].nodes[key])
}else if (node.type.includes("If") || node.type.includes("Logic")){
boolOps.push(key)
}else if (node.type.includes("Math")){
  mathOps.push(key)
}
})

//----------- resolve all math -----------

for (let m=0;m<99;m++){
var rezKeys:any=Object.keys(resolved);
var done=true;

mathOps.forEach((id)=>{
done=done && rezKeys.includes(id);
})

if (done){break}

  var node=this.botDefinitions[this.activeBot].nodes[mathOps[m%mathOps.length]];

console.log(node);

}


//--------------resolve all boolean operations
for (let i=0;i<99;i++){
var rezKeys:any=Object.keys(resolved);
var done=true;

boolOps.forEach((id)=>{
done=done && rezKeys.includes(id);
})

if (done){break}


var node=this.botDefinitions[this.activeBot].nodes[boolOps[i%boolOps.length]];

var allInputs=true;
//console.log(node);
Object.keys(node.inputs).forEach((prm)=>{
allInputs=allInputs && rezKeys.includes(node.inputs[prm]);
})

if (allInputs){

if (node.type.includes("If")){
  var a=resolved[node.inputs["InputA"]]
  var b=resolved[node.inputs["InputB"]]
  var cond=node.data.Conditional
var rez
//console.log(a,b);
if (cond.includes('>=')){
rez=(a>=b)
}else if (cond.includes('>')){
rez=(a>b)
}else if (cond.includes('=')){
rez=(a==b)
}

  resolved[boolOps[i%boolOps.length]]=rez

}else if (node.type.includes("Logic")){

  var a=resolved[node.inputs["InputA"]]
  var b=resolved[node.inputs["InputB"]]

  // check if connected to an else and flip
if (!this.botDefinitions[this.activeBot].nodes[node.inputs["InputA"]].outputs.Then.includes(boolOps[i%boolOps.length])){
a=!a
}

if (!this.botDefinitions[this.activeBot].nodes[node.inputs["InputB"]].outputs.Then.includes(boolOps[i%boolOps.length])){
b=!b
}

  var op=node.data.Operation
  var rez

if (op.includes('OR')){
rez=(a || b)
}else if (op.includes('AND')){
rez=(a && b)
}else if (op.includes('XOR')){
rez=( a && !b ) || ( !a && b ) 
}

  resolved[boolOps[i%boolOps.length]]=rez


}


}

}

//------------then resolve actions (inputs only)? includes xyz? ------------//


console.log(resolved);




// WHEN DONE, possibly async?
this.pushData(interval,true);
}