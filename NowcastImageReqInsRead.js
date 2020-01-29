var rp = require('request-promise')
require('date-utils');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cron = require('node-cron');


cron.schedule('*/5 * * * *', () => {

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

//ファイルの日時指定のフォーマット定義
var format1 = nowTime.toFormat("YYYYMMDDHH24"+ArrayMinutes[0]+ArrayMinutes[1]);
var format2 = nowTime.toFormat(ArrayYear[2]+ArrayYear[3]+"MMDD"+"09");

//DB格納時の日時フォーマット
var DBformat1_Day = nowTime.toFormat("YYYY"+"-"+"MM"+"-"+"DD");
var DBformat1_Time = nowTime.toFormat("HH24"+":"+ArrayMinutes[0]+ArrayMinutes[1]);
console.log(format1);

var options =  {
  method: 'GET',
  url: "http://www.jma.go.jp/jp/radnowc/imgs/radar/205/"+format1+"-00.png",
  proxy:'http://10.64.199.79:8080',
  encoding:null,
}


  console.log('Image : Per minute execution');
  rp(options).then(function(body){
        fs.writeFile('/home/s1500740/WeatherDataBroadcast/public/NowcastImage/'+format1+'.png', body, 'binary', (err) => {
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
          collection = db.collection("NowcastImage");


          NowcastImage = "/NowcastImage/"+format1 + ".png";
          // コレクションにドキュメントを挿入
          collection.insertOne(
          {
            "GetDay":DBformat1_Day,
            "GetTime":DBformat1_Time,
            "ImagePath":NowcastImage,
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
            collection = db.collection("NowcastImage");

            //最新の一件を取得
              collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
               for(var item of items){
                console.log(item);

                exports.GetDay = item.GetDay;
                exports.GetTime = item.GetTime;
                exports.ImagePath = item.ImagePath;

               }
             }, (error, result) => {
               client.close();
           });
         })
      })
      .catch(function(err){
         console.error(err);
    });
 });
