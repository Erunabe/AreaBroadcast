var rp = require('request-promise')
require('date-utils');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const cron = require('node-cron');

// 接続先URL
url = 'mongodb://localhost:27017';

//データベース名
dbName = 'AreaBroadcast';

MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
  assert.equal(null, err);
  console.log("ImageRead : Connected successfully to server");

  const db = client.db(dbName);
  // コレクションの取得
  collection = db.collection("NowcastImage");

  //最新の一件を取得
    collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
     for(var item of items){
      console.log(item);

      exports.getDay = item.getDay;
      exports.getTime = item.getTime;
      exports.imagePath = item.imagePath;

     }
   }, (error, result) => {
     client.close();
 });
})
