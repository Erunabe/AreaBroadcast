const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var req = require('./DataRequest.js')

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'WeatherData';

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true },function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

    // コレクションの取得
    collection = db.collection("Data");

    // コレクションにドキュメントを挿入
    collection.insertOne(
    {
      "データ取得時間":req.datatime,
      "温度":req.temp,
      "湿度":req.humi,
      "風速":req.wind_s,
      "風向":req.wind_d,
      "最大瞬間風速":req.wind_max_s,
      "気圧":req.press_l,
      "降水強度":req.rain_i,
      "1時間降水量":req.rain_m,
      "暑さ指数":req.wbgt
    }
, (error, result) => {
        client.close();
    });

    collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
      for(var item of items){
      console.log(item);
    }
  });
});
