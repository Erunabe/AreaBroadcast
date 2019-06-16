var request = require('request');

var headers = {
    'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ==',
}

var options = {
    url: 'http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m',
    method: 'GET',
    headers: headers,
    json: false,
}

request(options, function (error, response, body) {
    res = JSON.parse(body);
    console.log(res)

    temp = res.poteka[0].element[0].dataList[0].value;
    humi = res.poteka[0].element[1].dataList[0].value;
    wind_s = res.poteka[0].element[2].dataList[0].value;
    wind_d = res.poteka[0].element[3].dataList[0].value;
    wind_max_s = res.poteka[0].element[4].dataList[0].value;
    press_l = res.poteka[0].element[5].dataList[0].value;
    rain_i = res.poteka[0].element[6].dataList[0].value;
    rain_m = res.poteka[0].element[7].dataList[0].value;



    console.log(temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m)


})

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

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
        "temp":temp,
        "humi":humi,
        "wind_s":wind_s,
        "wind_d":wind_d,
        "wind_max_s":wind_max_s,
        "press_l":press_l,
        "rain_i":rain_i,
        "rain_m":rain_m
    }, (error, result) => {
        client.close();
    });
});
