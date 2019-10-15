const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'AreaBroadcast';

// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

    // コレクションの取得
    collection = db.collection("WeatherData");

   //最新の一件を取得

    collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
     for(var item of items){
      console.log(item);
      datatime = item.データ取得時間;
      console.log(datatime)
     }
   }, (error, result) => {
     client.close();
 });

});
