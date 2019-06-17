const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var req = require('./request_njs.js')

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
      req.res;
      /*{
        "datatime":req.datatime,
        "temp":req.temp,
        "humi":req.humi,
        "wind_s":req.wind_s,
        "wind_d":req.wind_d,
        "wind_max_s":req.wind_max_s,
        "press_l":req.press_l,
        "rain_i":req.rain_i,
        "rain_m":req.rain_m
    }*/
    , (error, result) => {
        client.close();
    });
});
