const regression=window["regression"];


export function genActive(d3,indx,startAt,scores,active,bad){

var tickers = Object.keys(scores);

     d3.csv("assets/MTstocks/"+tickers[indx]+".csv", (error, data) => {
var corrupted=0
var numdays=0;

      const parseDate = d3.timeParse("%Y%m%d");

      function dateAdj(date){
        if (parseInt(date.slice(0,2))>30){
          return '19'+String(date);
        }else{
          return '20'+String(date);
        }
      }

data.slice(startAt[tickers[indx]] || 0).forEach((day,i)=>{
if (data[i+1]){
var days=(parseDate(dateAdj(data[i+1].sdate))-parseDate(dateAdj(day.sdate)))/86400000;
numdays+=days
//console.log(data[i+1].sdate-day.sdate)
if (corrupted>=0){
if (days>10 || days<0){
  if (days>corrupted || days<0){
corrupted=days
}
}
}
}
})
//2189821480/2357
var relMissingScore=scores[tickers[indx]][4]/data.length;

if (numdays/data.length>2 || corrupted>40 || data.length<400 || relMissingScore>800000){

bad[tickers[indx]]=[data.length,corrupted,numdays/data.length,relMissingScore]
 // bad.push(tickers[indx])//=[tickers[indx]]=[corrupted,numdays/data.length];//.push([tickers[indx],dups,consec,dups/data.length])
}else{
  active.push(tickers[indx])
}

if (indx<tickers.length-1){
  //console.count('d3');
  console.error(indx);
  //console.log(bad);
genActive(d3,indx+1,startAt,scores,active,bad)
}else{
console.log(bad);
console.log(active);
}



    })
}


export function furtherNarrowSlice(d3,tickers,indx,currentStart,newStartAt,alarm){
//looking at the first 30 days

  d3.csv("assets/MTstocks/"+tickers[indx]+".csv", (error, data) => {
var consec=1;
var bestConsec=9999999999999999999999;
var bestStart=0;


for (let i=0;i<500;i++){


data.slice(i,i+30).forEach((d,i)=>{

if (d.open==d.close && d.close==d.low && d.low==d.high){
  consec=consec*1.5;
}else{
  if (d.open==d.close){
    consec=consec*1.2;
  }
}

})

consec=consec*(i/2+1)
//console.log(consec);
if (consec<bestConsec){
  bestConsec=consec;
  bestStart=i;
}else{
  consec=1;
}

}


if (currentStart[tickers[indx]]<bestStart){
 newStartAt[tickers[indx]]=bestStart//.push([tickers[indx],dups,consec,dups/data.length]) 

if (bestStart/data.length>.41){
  alarm.push(tickers[indx])
}

}else{
   newStartAt[tickers[indx]]=currentStart[tickers[indx]];
}

indx=indx+1;


//if (endIndex){startAt[tickers[indx]].push(endIndex)}
if (indx<tickers.length-1){
  //console.count('d3');
  console.error(indx);
  //console.log(startAt);
  //console.log(bad);
furtherNarrowSlice(d3,tickers,indx,currentStart,newStartAt,alarm);
}else{
    console.log(newStartAt);
    console.log(tickers.filter((id)=>{
      return !alarm.includes(id)
    }))
    

}


  })


}

export function sliceBrokenData(d3,tickers,indx,startAt,scores){

//tickers[indx]='ZION';
    d3.csv("assets/MTstocks/"+tickers[indx]+".csv", (error, data) => {
var startIndex=0;
//var endIndex=undefined;
var consec=0;
var runningMissingScore=0;
var relMissingScore=scores[tickers[indx]][4]/data.length;
var missingDB=[];
data.forEach((d,i)=>{
if (d.open==d.close && d.close==d.low && d.low==d.high){
  consec=consec+2;
}else{
  if (d.open==d.close){
    consec=consec+1;
  }else{
    consec=0;
  }  
}


var period = 100;
runningMissingScore=runningMissingScore+consec*consec
missingDB.push(runningMissingScore);consec

var relRunning = runningMissingScore/(i+1);

if (i>period){
relRunning=(runningMissingScore-missingDB[i-period])/period
}


//console.log(relRunning)

var progress=i/data.length;

//var threshold=progress

var factor=40*progress + 5;
//y = 12.968x + 3.0173  y = 36.239x + 0.915 

//if (threshold<.03){threshold=.03}else if (threshold>.5){threshold=.5}
if (factor<2){factor=2}
//console.log(relRunning,d.sdate.slice(0,2));
if (relRunning>relMissingScore*factor && progress<.5 && consec>1){
//console.log(relRunning,relMissingScore*factor,d.sdate.slice(0,2))
startIndex=i+1;
}
//console.log(startIndex);

})


startAt[tickers[indx]]=startIndex//.push([tickers[indx],dups,consec,dups/data.length])

//if (endIndex){startAt[tickers[indx]].push(endIndex)}
if (indx<tickers.length-1){
  //console.count('d3');
  console.error(indx);
  //console.log(startAt);
  //console.log(bad);
sliceBrokenData(d3,tickers,indx+1,startAt,scores)
}else{
    console.log(startAt);
}

    })





}

export function genAverages(d3,tickers,indx,closes,genValues:boolean=false){

   d3.csv("assets/MTstocks/"+tickers[indx]+".csv", (error, data) => {

     const parseDate = d3.timeParse("%Y%m%d");

      function dateAdj(date){
        if (parseInt(date.slice(0,2))>30){
          return '19'+String(date);
        }else{
          return '20'+String(date);
        }
      }
var cumulative=1;
data.forEach((d,i)=>{
var date=d.sdate;
if (!genValues){
if (i>0){
var percentMult=parseFloat(d.close)/parseFloat(data[i-1].close);
cumulative*=percentMult;
if (closes[date]){
closes[date].push(cumulative);
}else{
  closes[date]=[cumulative];
}
}
}else{
 if (closes[date]){
closes[date].push(parseFloat(d.close));
}else{
  closes[date]=[parseFloat(d.close)];
}
}

})

function ArrayAvg(myArray,decPts:any=2) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
}

var fact = Math.pow(10,decPts);
//console.log(summ,ArrayLen);
//console.log(summ / ArrayLen)
    return Math.floor((summ / ArrayLen)*fact)/fact;
}

if (indx<tickers.length-1){
  //console.count('d3');
  console.error(indx);
genAverages(d3,tickers,indx+1,closes,genValues)
}else{

var marketGains={}
Object.keys(closes).forEach((ky)=>{
marketGains[ky]=ArrayAvg(closes[ky])
})

console.log(marketGains)

}

    })


}

export function testBrokenDates(d3,tickers,indx,bad){

   d3.csv("assets/MTstocks/"+tickers[indx]+".csv", (error, data) => {
var corrupted=0
const parseDate = d3.timeParse("%y%m%d");
var numdays=0;

//if (parseDate(data[0].sdate)
/*
data.forEach((day,i)=>{
if (data[i+1]){
var days=(parseDate(data[i+1].sdate)-parseDate(day.sdate))/86400000;
numdays+=days
//console.log(data[i+1].sdate-day.sdate)
if (corrupted>=0){
if (days>10 || days<0){
  if (days>corrupted || days<0){
corrupted=days
}
}
}
}
})

if (numdays/data.length>1.46 || corrupted>20 || data.length<720){
  bad.push(tickers[indx])//=[tickers[indx]]=[corrupted,numdays/data.length];//.push([tickers[indx],dups,consec,dups/data.length])
}

if (indx<tickers.length-1){
  //console.count('d3');
  console.error(indx);
  //console.log(bad);
testBrokenDates(d3,tickers,indx+1,bad)
}else{
console.log(bad)
}

*/

    })

}

/*
export function testBrokenData(d3,tickers,indx,bad){


    d3.csv("assets/KGstocks/"+tickers[indx]+".csv", (error, data) => {
var dups=0;
var yest=false;
var two=false;
var consec=0;
data.forEach((day)=>{
      if (day.open==day.close && day.close==day.low && day.low==day.high){

if (yest){
  if (two){
    consec++
  }else{
    two=true;
  }
}else{
  yest=true;
}
}else{
  yest=false;two=false;
}
})


  bad[tickers[indx]]=consec//.push([tickers[indx],dups,consec,dups/data.length])


if (indx<tickers.length-1){
  //console.count('d3');
  console.error(indx);
  //console.log(bad);
testBrokenData(d3,tickers,indx+1,bad)
}else{

  bad.sort((a,b)=>{
    return b[3]-a[3]
  })

console.log(bad)
}
    })
}
*/


export function quantifyScores(scores){
  var scoreBreakdown={}
Object.keys(scores).forEach((ticker)=>{

var slope=scores[ticker][0]
var stdv=scores[ticker][1]
var length = scores[ticker][2]
var marketVal = scores[ticker][3]
var missingScore=scores[ticker][4]
//-------------
var linearR2=scores[ticker][5]
var earlySlope=scores[ticker][6]
var logB=scores[ticker][7]
var logR2=scores[ticker][8]


var momentum=1;

var factor
if (slope<0){
  momentum=500;
factor=3
}else{
  if (earlySlope){
 momentum=earlySlope;   
  }

factor=5;
}


// score calculation
//scoreBreakdown[ticker]=Math.pow(Math.abs(slope),factor)/(stdv/length)*Math.pow(marketVal,.4)-Math.pow(length,2)

scoreBreakdown[ticker]=Math.pow(slope+momentum/4,factor)*Math.pow((1/length),2)*Math.pow((1/stdv),1)*Math.pow(1/(missingScore/length+1),5)//+marketVal/3000;






//Math.pow(Math.abs(slope),factor)/length

//(stdv/length)*Math.pow(marketVal,.4)-Math.pow(length,2)
//------------------------

//+stdv+length+marketVal
})


var sortable = [];
for (var tick in scoreBreakdown) {
    sortable.push([tick, scoreBreakdown[tick],scores[tick][0]>0,scores[tick]]);
}

sortable.sort(function(a, b) {
    return b[1] - a[1]; //return b[3][4] - a[3][4];
});

//console.log(scoreBreakdown)
//console.log(sortable)
return scoreBreakdown;



//return output;
}






export function scoreTabulation(d3,mtDB,kgDB,startIndex){

        var datab={}
        var scoreb={}
        var tickrs=Object.keys(mtDB)
        
        function findLineByLeastSquares(values_x, values_y) {
            var x_sum = 0;
            var y_sum = 0;
            var xy_sum = 0;
            var xx_sum = 0;
            var count = 0;
        
            var x = 0;
            var y = 0;
            var values_length = values_x.length;
        
            if (values_length != values_y.length) {
                throw new Error('The parameters values_x and values_y need to have same size!');
            }
        
            if (values_length === 0) {
                return [ [], [] ];
            }
        
        
            for (let i = 0; i< values_length; i++) {
                x = values_x[i];
                y = values_y[i];
                x_sum+= x;
                y_sum+= y;
                xx_sum += x*x;
                xy_sum += x*y;
                count++;
            }
        
        
            var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
            var b = (y_sum/count) - (m*x_sum)/count;
        
            return m;
        
        }
        
        function toTitleCase(str) {
          return str.toLowerCase().replace(
            /\w\S+/g,
            function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
          );
        }
        
        function getStandardDeviation (array) {
          const n = array.length
          const mean = array.reduce((a, b) => a + b) / n
          return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
        }
        
            
        function truncate(dec){
          return Math.floor(dec*1000)/1000
        }
        
        function writeScore(index){
          

   d3.csv("assets/MTstocks/"+tickrs[index]+".csv", (error, data) => {
        if (data && data.columns && data.columns.length!==0){
        var closings=[]
        var optimal=0;
        var shortoptimal=0;
        var runningOptimal=1;
        var shortRunningOptimal=1;
        var slopeReg=0;
        var xVals=[];
        var yVals=[];
        var pairedData=[]
        var consec=0;
        var missingScore=0; 
        var exponentialScore; // after 30 days
        var slicePoint=startIndex[tickrs[index]]

if (slicePoint && data.length>35){
  slicePoint+=30;
}

        data.slice(slicePoint).forEach((d,i)=>{//
        
if (d.open==d.close && d.close==d.low && d.low==d.high){
  if (parseFloat(d.open)==closings[closings.length-1]){
consec=consec+10
  }else{
  consec=consec+2;
  }
}else{
  if (d.open==d.close){
    consec=consec+1;
  }else{
    consec=0;
  }  
}

missingScore=missingScore+consec*consec


          var close=parseFloat(d.close)
            closings.push(close);
        
            xVals.push(i+1);
            yVals.push(close);
            pairedData.push([i+1,close])
        
          if (i>0 && close>parseFloat(data[i-1].close)){
        optimal+=((close/parseFloat(data[i-1].close)-1));
        runningOptimal*=close/parseFloat(data[i-1].close)
          }
        
          if (i>0 && close<parseFloat(data[i-1].close)){
            shortRunningOptimal*=parseFloat(data[i-1].close)/close;
            shortoptimal+=((parseFloat(data[i-1].close)/close-1));
          }
        
        
        })
        
        //scoreb[tickrs[index]]={slope:findLineByLeastSquares(xVals,yVals),stdev:truncate(getStandardDeviation(closings)/1000),len:data.length, longOptimal:truncate(optimal),shortOptimal:truncate(shortoptimal), expLongOptimal:truncate(Math.pow(runningOptimal,.1)),expShortOptimal:truncate(Math.pow(shortRunningOptimal,.1))}


//-----------------------------------
//console.log(tickrs[index]);

//-----------------------------------

var linearReg=regression.linear(pairedData)
var logReg=regression.logarithmic(pairedData)

        scoreb[tickrs[index]]=[
        truncate(findLineByLeastSquares(xVals,yVals)),
        truncate(getStandardDeviation(closings)),
        data.length,
        mtDB[tickrs[index]][4],
        missingScore,
        linearReg.r2,
        truncate(findLineByLeastSquares(xVals.slice(100),yVals.slice(100))),
        logReg.equation[1],
        logReg.r2
        ] //
        //[truncate(parseInt(data[data.length-1].close)/parseInt(data[0].close)),truncate(optimal),
        //console.log(scoreb)
        if (index==tickrs.length-1){
        console.log(scoreb)
        console.log(Object.keys(scoreb).length);
        }else{
          console.error(index,tickrs[index])
          writeScore(index+1)
        }}else{
          writeScore(index+1)
        }
        })
        
        
        
        
        }
        
        writeScore(0); // for each CSV
        
        
        
        
        //console.log(datab)
        
        
        //console.log(scoreb)
        
        /*
        var sortable=[]
        var obj={}
        Object.keys(scores).forEach((ticker)=>{
        sortable.push([ticker,scores[ticker][0],scores[ticker][1],scores[ticker][2]])
        })
        
        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        console.log(sortable);
        sortable.forEach((ele)=>{
        obj[ele[0]]=[ele[1],ele[2],ele[3]]
        })
        console.log(obj);
        console.log(Object.keys(obj))
        */
      
}