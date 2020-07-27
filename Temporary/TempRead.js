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


          collection1.find({getTime:/00:00/},{temp:1}).sort({_id:-1}).toArray(function(err, items) {
           for(var item of items){

          }

            var tempArray = new Array();
            for(i=0;i<items.length;i++){
              tempArray[i] = items[i].temp;
              console.log(items[i]);
            }


            exports.getTime1 = items[0].getTime;
            exports.Temp1 = items[0].temp;
            exports.getTime2 = items[3].getTime;
            exports.Temp2 = items[3].temp;
            exports.getTime3 = items[6].getTime;
            exports.Temp3 = items[6].temp;
            exports.getTime4 = items[9].getTime;
            exports.Temp4 = items[9].temp;
            exports.getTime5 = items[12].getTime;
            exports.Temp5 = items[12].temp;
            exports.getTime6 = items[15].getTime;
            exports.Temp6 = items[15].temp;
            exports.getTime7 = items[18].getTime;
            exports.Temp7 = items[18].temp;
            exports.getTime8 = items[21].getTime;
            exports.Temp8 = items[21].temp;



         }, (error, result) => {
           client.close();
       });

  collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
    for(var item of items){
       exports.max_getDay = item.max_getDay;
       exports.max_temp_Time = item.max_temp_Time;
       exports.max_temp = item.max_temp;
     }
   }, (error, result) => {
      client.close();
  });

  collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
    for(var item of items){
  exports.min_getDay = item.min_getDay;
  exports.min_temp_Time = item.min_temp_Time;
  exports.min_temp = item.min_temp;
    }
  }, (error, result) => {
      client.close();
  });

});

});
