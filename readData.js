const cron = require('node-cron');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'AreaBroadcast';

cron.schedule('1 * * * *', () => {
// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

    // コレクションの取得
    collection = db.collection("WeatherData");

   //最新の一件を取得

    collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
     for(var item of items){
      console.log(item);

      datatime = item.データ取得時間;
      temp = item.温度;
      humi = item.湿度;
      wind_s = item.風速;
      wind_d = item.風向;
      wind_max_s = item.最大瞬間風速;
      press_l = item.気圧;
      rain_i = item.降水強度;
      rain_m = item.降水量;
      wbgt = item.暑さ指数;

      exports.datatime = 'datatime';
      exports.temp = 'temp';
      exports.humi = 'humi';
      exports.wind_s = 'wind_s';
      exports.wind_d = 'wind_d';
      exports.wind_max_s = 'wind_max_s';
      exports.press_l = 'press_l';
      exports.rain_i = 'rain_i';
      exports.rain_m = 'rain_m';
      exports.wbgt = 'wbgt';
     }
   }, (error, result) => {
     client.close();
 });

});

});
