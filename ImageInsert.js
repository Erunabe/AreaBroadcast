
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
  console.log("end 0");
}else{
  ArrayMinutes[1] = 5;
  console.log("end 5");
}

var WMhour = 0;


var format1 = nowTime.toFormat("YYYYMMDDHH24"+ArrayMinutes[0]+ArrayMinutes[1]);
var format2 = nowTime.toFormat(ArrayYear[2]+ArrayYear[3]+"MMDD"+"09");
exports.format1 = format1;
exports.format2 = format2;
console.log(format2)


req(//ナウキャスト
  {method: 'GET', url: "http://www.jma.go.jp/jp/radnowc/imgs/radar/205/"+format1+"-00.png",proxy:'http://10.54.199.79:8080', encoding: null},
  function (error, response, body){
    if(!error && response.statusCode === 200){
      fs.writeFile('/home/s1500740/WeatherDataBroadcast/NowcastImage/'+format1+'.png', body, 'binary', (err) => {
        // 書き出しに失敗した場合
        if(err){
          console.log("エラーが発生しました。" + err)
          throw err
        }
        // 書き出しに成功した場合
        else{
          console.log("ファイルが正常に書き出しされました")
        }
      });
    }
  }
);

req(//天気図
  {method: 'GET', url: "https://www.jma.go.jp/jp/g3/images/jp_c/"+format2+".png",proxy:'http://10.64.199.79:8080', encoding: null},
  function (error, response, body){
    if(!error && response.statusCode === 200){
      fs.writeFile('/home/s1500740/WeatherDataBroadcast/WeatherMapImage/'+format2+'.png', body, 'binary',(err) => {
        // 書き出しに失敗した場合
        if(err){
          console.log("エラーが発生しました。" + err)
          throw err
        }
        // 書き出しに成功した場合
        else{
          console.log("ファイルが正常に書き出しされました")
        }
      });
    }
  }
);

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'AreaBroadcast';

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

    // コレクションの取得
    collection = db.collection("WeatherImage");


    NowcastImage = "/home/s1500740/WeatherDataBroadcast/NowcastImage/"+ format1 + ".png";
    // コレクションにドキュメントを挿入
    collection.insertOne(
    {
      "GetImageTime":format1,
      "ImageName":"降水ナウキャスト",
      "ImagePath":NowcastImage,
    }
, (error, result) => {
        client.close();
    });
});
