
require('date-utils');
var nowTime = new Date();
var format = nowTime.toFormat("YYYYMMDDHH2430");
console.log(format);

var req = require('request');
var fs = require('fs');

req(
  {method: 'GET', url: "http://www.jma.go.jp/jp/radnowc/imgs/radar/205/"+format+"-00.png", encoding: null},
  function (error, response, body){
    if(!error && response.statusCode === 200){
      fs.writeFileSync('a.png', body, 'binary');
      console.log(i);
    }
  }
);
