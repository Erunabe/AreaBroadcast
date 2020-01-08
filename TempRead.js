require('date-utils');
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
          collection = db.collection("WeatherData");

         //最新の一件を取得

          collection.find({GetTime:/00:00/}).sort({_id: 1}).toArray(function(err, items) {
           for(var item of items){
          }
            exports.GetTime1 = items[0].GetTime;
            exports.Temp1 = items[0].temp;
            exports.GetTime2 = items[1].GetTime;
            exports.Temp2 = items[1].temp;
            exports.GetTime3 = items[2].GetTime;
            exports.Temp3 = items[2].temp;
            exports.GetTime4 = items[3].GetTime;
            exports.Temp4 = items[3].temp;


         }, (error, result) => {
           client.close();
       });

     });
