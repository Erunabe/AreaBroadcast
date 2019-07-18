var fs = require('fs');
var path = require('path');
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
    collection = db.collection("Images");
    collection.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
      for(var item of items){
      console.log(item.ImagePath);
    }
    
      readImage = fs.readFile( ImagePathS, 'utf8' , function (err, data) {
      });;
      fs.writeFile('readImage.png',readImage,'binary')
  });

});
