var express = require('express');
var path = require('path')
var fs = require('fs')
var app = express();
var routes = require('./routes/index');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
require('date-utils');
const cron = require('node-cron');
const moment = require('moment')
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

// 接続先URL
url = 'mongodb://localhost:27017';
//データベース名
dbName = 'AreaBroadcast';

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);

app.get("/", function (req, res) {
  res.sendFile(__dirname+'/index.html');
});


   //最新の一件を取得

cron.schedule('*/20 * * * * *', () => {

   MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
     assert.equal(null, err);
     console.log("DataRead : Connected successfully to server");

     const db = client.db(dbName);

       // コレクションの取得
       collection1 = db.collection("MeteorObserv");
      //最新の一件を取得

       collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
        for(var item of items){
         console.log(item);

         getDay = item.getDay;
         getTime = item.getTime;
         temp = item.temp;
         humi = item.humi;
         wind_s = item.wind_s;
         wind_d = item.wind_d;
         wind_max_s = item.wind_max_s;
         press_l = item.press_l;
         rain_i = item.rain_i;
         rain_m = item.rain_m;
         wbgt = item.wbgt;

        }
      }, (error, result) => {
        client.close();
    });

   });

     setTimeout(function(){
       var data = {
         "getDay":getDay,
         "getTime":getTime,
         "temp":temp,
         "humi":humi,
         "wind_s":wind_s,

         "wind_d":wind_d,
         "wind_max_s":wind_max_s,
         "press_l":press_l,
         "rain_i":rain_i,
         "rain_m":rain_m,
         "wbgt":wbgt
      }
           //クライアント側へ送信
            io.emit('element_data',data);
            console.log("送信")
      },3000);

   });



cron.schedule('* * * * *', () => {

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

          getImageDay = item.getDay;
          getImageTime = item.getTime;
          imagePath = item.imagePath;

         }
       }, (error, result) => {
         client.close();
     });
    })

    setTimeout(function(){
      var Image = {
          "getImageDay":getImageDay,
          "getImageTime":getImageTime,
          "imagePath":imagePath
        }

           //クライアント側へ送信
            io.emit('element_image',Image);
    },3000);

});

//接続
io.on('connection',function(socket){
  console.log('a user connected');
});

//サーバリッスン開始
 http.listen(PORT, function(){
     console.log('server listening. Port:' + PORT);
 });
