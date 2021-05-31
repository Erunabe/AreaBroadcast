
var cron = require('node-cron');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// 接続先URL
url = 'mongodb://localhost:27017';


MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
  assert.equal(null, err);


  //データベース名
  dbName = 'AreaBroadcast';

  const db = client.db(dbName);

    cron.schedule(' * * * * * *', () => {

        // コレクションの取得
        collection1 = db.collection("MeteorObserv");
       //最新の一件を取得

        collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
         for(var item of items){
          console.log(items);
         }
       }, (error, result) => {
         client.close();
     });

     });

});
