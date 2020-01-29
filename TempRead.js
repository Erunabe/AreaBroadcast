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
          collection = db.collection("MeteorObserv");

         //最新の一件を取得

          collection.find({GetTime:/00:00/},{temp:1}).sort({_id: -1}).toArray(function(err, items) {
           for(var item of items){

          }

            var tempArray = new Array();
            for(i=0;i<items.length;i++){
              tempArray[i] = items[i].temp;
            }

            console.log(tempArray);
            maxTemp = Math.max.apply(null,tempArray);
            maxNumber = tempArray.indexOf(maxTemp);
            minTemp = Math.min.apply(null,tempArray);
            minNumber = tempArray.indexOf(minTemp);
            maxGetDay = items[maxNumber].GetDay;
            maxGetTime = items[maxNumber].GetTime;
            minGetDay = items[minNumber].GetDay;
            minGetTime = items[minNumber].GetTime;

            exports.GetTime1 = items[0].GetTime;
            exports.Temp1 = items[0].temp;
            exports.GetTime2 = items[3].GetTime;
            exports.Temp2 = items[3].temp;
            exports.GetTime3 = items[6].GetTime;
            exports.Temp3 = items[6].temp;
            exports.GetTime4 = items[9].GetTime;
            exports.Temp4 = items[9].temp;
            exports.GetTime5 = items[12].GetTime;
            exports.Temp5 = items[12].temp;
            exports.GetTime6 = items[15].GetTime;
            exports.Temp6 = items[15].temp;
            exports.GetTime7 = items[18].GetTime;
            exports.Temp7 = items[18].temp;
            exports.GetTime8 = items[21].GetTime;
            exports.Temp8 = items[21].temp;

            exports.maxTemp = maxTemp;
            exports.maxGetDay = maxGetDay;
            exports.maxGetTime = maxGetTime;
            exports.minTemp = minTemp;
            exports.minGetDay = minGetDay;
            exports.minGetTime = minGetTime;

         }, (error, result) => {
           client.close();
       });

     });
