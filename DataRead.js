var rp = require('request-promise')
var fs = require('fs')
require('date-utils');
const cron = require('node-cron');
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 接続先URL
url = 'mongodb://localhost:27017';

//データベース名
dbName = 'AreaBroadcast';

MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
  assert.equal(null, err);
  console.log("DataRead : Connected successfully to server");

  const db = client.db(dbName);

    // コレクションの取得
    collection1 = db.collection("MeteorObserv");
    collection2 = db.collection("MaxElement");
    collection3 = db.collection("MinElement");

   //最新の一件を取得

    collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
     for(var item of items){
      console.log(item);

      exports.getDay = item.getDay;
      exports.getTime = item.getTime;
      exports.temp = item.temp;
      exports.humi = item.humi;
      exports.wind_s = item.wind_s;
      exports.wind_d = item.wind_d;
      exports.wind_max_s = item.wind_max_s;
      exports.press_l = item.press_l;
      exports.rain_i = item.rain_i;
      exports.rain_m = item.rain_m;
      exports.wbgt = item.wbgt;

      /*exports.getDay = getDay;
      exports.getTime = getTime;
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
