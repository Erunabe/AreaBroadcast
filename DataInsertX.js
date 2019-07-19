
var request = require('request');
require('date-utils');

var headers = {
    'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ==',
}

var options = {
    url: 'http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m,wbgt',
    method: 'GET',
    headers: headers,
    //proxy:'http://s1500740:Rose-lisa910@wproxy.net.sendai-nct.ac.jp:8080',
    json: false,
}


const cron = require('node-cron');
cron.schedule('* * * * *', () => {console.log('毎分実行');
request(options, function (error, response, body) {
    console.log(body);
    res = JSON.parse(body);


    datatime = res.poteka[0].element[0].dataList[0].datatime;
    temp = res.poteka[0].element[0].dataList[0].value;
    humi = res.poteka[0].element[1].dataList[0].value;
    wind_s = res.poteka[0].element[2].dataList[0].value;
    wind_d = res.poteka[0].element[3].dataList[0].value;
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
    wbgt = res.poteka[0].element[7].dataList[0].value;


    console.log("気温:"+temp,"湿度:"+humi,"風速:"+wind_s,"風向:"+wind_d,"最大瞬間風速:"+wind_max_s,"気圧:"+press_l,"降水強度:"+rain_i,"1時間降水量:"+rain_m);


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
    collection.insertOne(
    {
      "データ取得時間":datatime,
      "温度":temp,
      "湿度":humi,
      "風速":wind_s,
      "風向":wind_d,
      "最大瞬間風速":wind_max_s,
      "気圧":press_l,
      "降水強度":rain_i,
      "1時間降水量":rain_m,
      "暑さ指数":wbgt
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

});
