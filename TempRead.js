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
          collection = db.collection("MeteorogicalObserv");

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
            exports.GetTime5 = items[4].GetTime;
            exports.Temp5 = items[4].temp;
            exports.GetTime6 = items[5].GetTime;
            exports.Temp6 = items[5].temp;
            exports.GetTime7 = items[6].GetTime;
            exports.Temp7 = items[6].temp;
            exports.GetTime8 = items[7].GetTime;
            exports.Temp8 = items[7].temp;
            exports.GetTime9 = items[8].GetTime;
            exports.Temp9 = items[8].temp;
            exports.GetTime10 = items[9].GetTime;
            exports.Temp10 = items[9].temp;
            exports.GetTime11 = items[10].GetTime;
            exports.Temp11 = items[10].temp;
            exports.GetTime12 = items[11].GetTime;
            exports.Temp12 = items[11].temp;
            exports.GetTime13 = items[12].GetTime;
            exports.Temp13 = items[12].temp;
            exports.GetTime14 = items[13].GetTime;
            exports.Temp14 = items[13].temp;
            exports.GetTime15 = items[14].GetTime;
            exports.Temp15 = items[14].temp;
            exports.GetTime16 = items[15].GetTime;
            exports.Temp16 = items[15].temp;
console.log(items[15].temp)

         }, (error, result) => {
           client.close();
       });

     });
