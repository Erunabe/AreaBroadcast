
var express = require('express');
var app = express();
var cron = require('node-cron');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');



module.exports = router;

router.get("/", function (req, res) {

  var io = req.app.get('io');
  res.sendFile('/home/a2011529/AreaBroadcast/views/WeatherObserv.html');
  //初回接続時
  setTimeout(function(){

    console.log("初回接続時情報送信")

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);

        //データベース名
        dbName = 'AreaBroadcast';
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
           console.log("FP1 データ送信");
         },2000);


         collection2 = db.collection("NowcastImage");
         collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
          for(var item of items){
             console.log(item);
             getImageDay = item.getDay;
             getImageTime = item.getTime;
             imagePath = item.imagePath;
          }
            }, (error, result) => {
              client.close();
          });


        setTimeout(function(){
         var Image = {
             "getImageDay":getImageDay,
             "getImageTime":getImageTime,
             "imagePath":imagePath
           }

      //クライアント側へ送信
       io.emit('element_image',Image);
         console.log("FP1 画像送信")
       },2000);
    });
  },1000);





//ここからは繰り返し

    cron.schedule(' * * * * *', () => {

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
      assert.equal(null, err);

      // 接続先URL
      url = 'mongodb://localhost:27017';
      //データベース名
      dbName = 'AreaBroadcast';

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
             console.log("FP1 データ送信");
       },3000);

    });



    cron.schedule('*/5 * * * *', () => {

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
     assert.equal(null, err);

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
           console.log("FP1 画像送信")
    },3000);

    });




  //フレームパターン切り替え
  setTimeout(function(){
    io.emit('switch_flame',{value:true});
    console.log("フレームパターン切り替え依頼(FP1→FP3)");
  },300000);


});
