
require('date-utils');
var req = require('request');
var fs = require('fs');

var nowTime = new Date();

var Year_2 = String(nowTime.getFullYear());
var minutes = String(nowTime.getMinutes());
if(minutes.length==1){
  minutes = "0"+minutes;
}

var ArrayYear = Year_2.split('');
var ArrayMinutes = minutes.split('');


if(ArrayMinutes[1] % 5 == 0){
  ;
}else if(0<ArrayMinutes[1] && ArrayMinutes[1]<5){
  ArrayMinutes[1] = 0;
  console.log("0にする")
}else{
  ArrayMinutes[1] = 5;
  console.log("5にする")
}


var format1 = nowTime.toFormat("YYYYMMDDHH24"+ArrayMinutes[0]+ArrayMinutes[1]);
var format2 = nowTime.toFormat(ArrayYear[2]+ArrayYear[3]+"MMDD"+"18");
console.log(format2)


req(//ナウキャスト
  {method: 'GET', url: "http://www.jma.go.jp/jp/radnowc/imgs/radar/205/"+format1+"-00.png", encoding: null},
  function (error, response, body){
    if(!error && response.statusCode === 200){
      fs.writeFileSync(format1+'.png', body, 'binary');
    }
  }
);

req(//天気図
  {method: 'GET', url: "https://www.jma.go.jp/jp/g3/images/jp_c/"+format2+".png", encoding: null},
  function (error, response, body){
    if(!error && response.statusCode === 200){
      fs.writeFileSync('tenkizu.png', body, 'binary');
    }
  }
);
