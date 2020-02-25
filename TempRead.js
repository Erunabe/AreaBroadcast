require('date-utils');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cron = require('node-cron');

      // 接続先URL
      url = 'mongodb://localhost:27017';

      //データベース名
      dbName = 'AreaBroadcast';


  cron.schedule('* * * * *', () => {

      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);
        console.log("DataRead : Connected successfully to server");

        const db = client.db(dbName);

          // コレクションの取得
          collection1 = db.collection("MeteorObserv");
          collection2 = db.collection("MaxElement");
          collection3 = db.collection("MinElement");
         //最新の一件を取得


          collection1.find({GetTime:/00:00/},{temp:1}).sort({_id:-1}).toArray(function(err, items) {
           for(var item of items){

          }

            var tempArray = new Array();
            for(i=0;i<items.length;i++){
              tempArray[i] = items[i].temp;
            }


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



         }, (error, result) => {
           client.close();
       });

  collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
    for(var item of items){
       exports.max_GetDay = item.max_GetDay;
       exports.max_temp_Time = item.max_temp_Time;
       exports.max_temp = item.max_temp;
     }
   }, (error, result) => {
      client.close();
  });

  collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
    for(var item of items){
  exports.min_GetDay = item.min_GetDay;
  exports.min_temp_Time = item.min_temp_Time;
  exports.min_temp = item.min_temp;
    }
  }, (error, result) => {
      client.close();
  });

});

});
