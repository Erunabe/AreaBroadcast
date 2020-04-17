var rp = require('request-promise')
require('date-utils');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cron = require('node-cron');


var nowTime = new Date();
var Year_2 = String(nowTime.getFullYear());
var minutes = String(nowTime.getMinutes());
if(minutes.length==1){
  minutes = "0"+minutes;
}

var NowTemp =  nowTime.toFormat("HH24"+minutes) ;
var nowTemp = parseInt(NowTemp,10);

var ArrayYear = Year_2.split('');
var constHour = [3,6,9,12,15,18,21];

//日時の比較を行う
//実況天気図は3,6,9,12,15,18,21時に観測されたものが約2時間10分後に発表

if(510 <= nowTemp && nowTemp < 810){
  HourFormat = "0"+constHour[0];
}else if(810 <= nowTemp && nowTemp < 1110){
  HourFormat = "0"+constHour[1];
}else if(1110 <= nowTemp && nowTemp < 1410){
  HourFormat = "0"+constHour[2];
}else if(1410 <= nowTemp && nowTemp < 1710){
  HourFormat = constHour[3];
}else if(1710 <= nowTemp && nowTemp < 2010){
  HourFormat = constHour[4];
}else if(2010 <= nowTemp && nowTemp < 2310){
  HourFormat = constHour[5];
}else if(2310 <= nowTemp && nowTemp < 0510){
  HourFormat = constHour[6];
}

console.log(HourFormat);




//ファイルの日時指定のフォーマット定義
var format = nowTime.toFormat(ArrayYear[2]+ArrayYear[3]+"MMDD"+HourFormat);

var DBformat1_Day =  nowTime.toFormat(Year_2+"-"+"MM"+"-"+"DD")
var DBformat1_Time =  nowTime.toFormat(HourFormat+":"+"00");

var options =  {
  method: 'GET',
  url: "https://www.jma.go.jp/jp/g3/images/jp_c/"+format+".png",
  proxy:'http://10.64.199.79:8080',
  encoding:null,
}


  console.log('Image : Per minute execution');
  rp(options).then(function(body){
        fs.writeFile('/home/a2011529/AreaBroadcast/public/WeatherMapImage/'+format+'.png', body, 'binary', (err) => {
          // 書き出しに失敗した場合
          if(err){
            console.log("エラーが発生しました。" + err)
            throw err
          }
          // 書き出しに成功した場合
          else{
            console.log("ファイルが正常に書き出しされました1")
          }
        });
    })
    .then(function(body){

      // Connection URL
      url = 'mongodb://localhost:27017';

      // Database Name
      dbName = 'AreaBroadcast';

      // Use connect method to connect to the server
      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);
        console.log("ImageInsert : Connected successfully to server");

        const db = client.db(dbName);

          // コレクションの取得
          collection = db.collection("WeatherMapImage");


          WeatherMapImage = "/WeatherMapImage/"+format + ".png";
          // コレクションにドキュメントを挿入
          collection.insertOne(
          {
            "GetDay":DBformat1_Day,
            "GetTime":DBformat1_Time,
            "ImagePath":WeatherMapImage,
          }
      , (error, result) => {
              client.close();
          });
      });
    })
      .then(function(body){
          MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
            assert.equal(null, err);
            console.log("ImageRead : Connected successfully to server");

            const db = client.db(dbName);
            // コレクションの取得
            collection = db.collection("WeatherMapImage");

            //最新の一件を取得
              collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
               for(var item of items){
                console.log(item);

                exports.GetImageDay = item.GetImageDay;
                exports.GetImageTime = item.GetImageTime;
                exports.ImagePath = item.ImagePath;

             }, (error, result) => {
               client.close();
           });
         })
      })
     .catch(function(err){
        console.error(err);
        switch(err.statusCode){
        case 404:
            // NOT FOUND Process
            break;
        default:
            // Other Error Process
            break;
   });

  /*
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
  */
