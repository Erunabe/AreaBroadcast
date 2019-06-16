const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var WeatherEle = require('./request_njs.js')

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
    collection.insertOne({
        "temp": WeatherEle.temp,
        "humi": WeatherEle.humi,
        "wind_s":WeatherEle.wind_s,
        "wind_d":WeatherEle.wind_d,
        "wind_max_s":WeatherEle.wind_max_s,
        "press_l":WeatherEle.press_l,
        "rain_i":WeatherEle.rain_i,
        "rain_m":WeatherEle.rain_m
    }, (error, result) => {
        client.close();
    });
});
