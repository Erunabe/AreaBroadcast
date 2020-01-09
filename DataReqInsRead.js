var rp = require('request-promise')
var fs = require('fs')
require('date-utils');
const cron = require('node-cron');
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


var headers = {
    'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ==',
}

var options = {
    url: 'http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m,wbgt',
    method: 'GET',
    headers: headers,
    proxy:'http://10.64.199.79:8080',
    json: false,
}

//毎分実行する
cron.schedule('* * * * *', () => {
  console.log('Data : Per minute execution');
  rp(options).then(function(body) {
    //  console.log(body);
      res = JSON.parse(body);


      dt = new Date(res.poteka[0].element[0].dataList[0].datatime);
      datatime = dt.toLocaleString();
      ArrayDatatime = datatime.split(' ');
      temp = res.poteka[0].element[0].dataList[0].value;
      humi = res.poteka[0].element[1].dataList[0].value;
      wind_s = res.poteka[0].element[2].dataList[0].value;
      wind_d = res.poteka[0].element[3].dataList[0].value;

      //風向変換
      if(0<=wind_d && wind_d<=22.5 && 337.5 < wind_d && wind_d<=360){
        wind_d = "北";
      }else if (22.5<wind_d && wind_d<=67.5) {
        wind_d = "北東";
      }else if (67.5<wind_d && wind_d<=112.5) {
        wind_d = "東";
      }else if (112.5<wind_d && wind_d<=157.5) {
        wind_d = "南東";
      }else if (157.5<wind_d && wind_d<=202.5) {
        wind_d = "南";
      }else if (202.5<wind_d && wind_d<=247.5) {
        wind_d = "南西";
      }else if (247.5<wind_d && wind_d<=292.5) {
        wind_d = "西";
      }else if (292.5<wind_d && wind_d<=337.5) {
        wind_d = "北西";
      }

      wind_max_s = res.poteka[0].element[4].dataList[0].value;
      press_l = res.poteka[0].element[5].dataList[0].value;
      rain_i = res.poteka[0].element[6].dataList[0].value;
      rain_m = res.poteka[0].element[7].dataList[0].value;
      wbgt = res.poteka[0].element[8].dataList[0].value;

    })

    .then(function(body){

      // 接続先URL
      url = 'mongodb://localhost:27017';

      //データベース名
      dbName = 'AreaBroadcast';


      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);
        console.log("DataInsert : Connected successfully to server");

        const db = client.db(dbName);

          // コレクションの取得
          collection = db.collection("MeteorogicalObserv");

          // コレクションにドキュメントを挿入
          collection.insertOne(
          {
            "TTLfield": new Date(),
            "GetDay":ArrayDatatime[0],
            "GetTime":ArrayDatatime[1],
            "temp":temp,
            "humi":humi,
            "wind_s":wind_s,
            "wind_d":wind_d,
            "wind_max_s":wind_max_s,
            "press_l":press_l,
            "rain_i":rain_i,
            "rain_m":rain_m,
            "wbgt":wbgt
          }
      , (error, result) => {
              client.close();
          });

          /*collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
            for(var item of items){
            console.log(item);
          }
        }); */
      });
    })
    .then(function(body){
      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);
        console.log("DataRead : Connected successfully to server");

        const db = client.db(dbName);

          // コレクションの取得
          collection = db.collection("MeteorObserv");

         //最新の一件を取得

          collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
           for(var item of items){
            console.log(item);

            exports.GetDay = item.GetDay;
            exports.GetTime = item.GetTime;
            exports.temp = item.temp;
            exports.humi = item.humi;
            exports.wind_s = item.wind_s;
            exports.wind_d = item.wind_d;
            exports.wind_max_s = item.wind_max_s;
            exports.press_l = item.press_l;
            exports.rain_i = item.rain_i;
            exports.rain_m = item.rain_m;
            exports.wbgt = item.wbgt;

            /*exports.GetDay = GetDay;
            exports.GetTime = GetTime;
            exports.temp = temp;
            exports.humi = humi;
            exports.wind_s = wind_s;
            exports.wind_d = wind_d;
            exports.wind_max_s = wind_max_s;
            exports.press_l = press_l;
            exports.rain_i = rain_i;
            exports.rain_m = rain_m;
            exports.wbgt = wbgt;*/
           }
         }, (error, result) => {
           client.close();
       });

      });
    })

    .catch(function(err){
      console.error(err);
    });
});
