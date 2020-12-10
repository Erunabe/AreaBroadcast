
var express = require('express');
var app = express();
var cron = require('node-cron');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// 接続先URL
url = 'mongodb://localhost:27017';



module.exports = router;

router.get("/", function (req, res) {

  var io = req.app.get('io');
  res.sendFile('/home/a2011529/AreaBroadcast/views/TrafficRoadinfo.html');

  //初回接続時
  setTimeout(function(){

    console.log("初回接続時情報送信")

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
      assert.equal(null, err);

      //データベース名
      dbName = 'AreaBroadcast';
      const db = client.db(dbName);

        // コレクションの取得
        collection1 = db.collection("DPSObserv");
        collection2 = db.collection("RoadInfoImage");
        collection3 = db.collection("RoadImage");


       //Col1.愛子防災ステーション観測値
       collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
        for(var item of items){
         console.log(item);

         getDay = item.getDay;
         getTime = item.getTime;
         rainfall = item.rainfall;
         temp = item.temp;
         windspeed = item.windspeed;
         roadtemp = item.roadtemp;
         roadsit = item.roadsit;

        }
        }, (error, result) => {
          client.close();
        });

        setTimeout(function(){
          var dpsobserv = {
            "DPS_getDay":getDay,
            "DPS_getTime":getTime,
            "rainfall":rainfall,
            "temp":temp,
            "windspeed":windspeed,
            "roadtemp":roadtemp,
            "roadsit":roadsit
         }
          //クライアント側へ送信
          io.emit('dpsobserv',dpsobserv);
          console.log("FP3 愛子防災ステーション観測値")
        },2000);

        //col2.道路情報板
        collection2.find({location:"折立"}).sort({_id: -1}).limit(1).toArray(function(err, items2_1) {
        for(var item2_1 of items2_1){
        }
            oritate_getDay = item2_1.getDay;
            oritate_getTime = item2_1.getTime;
            oritate_imagePath1 = item2_1.imagePath1;
            oritate_imagePath2 = item2_1.imagePath2;
        }, (error, result) => {
        client.close();
        });

        collection2.find({location:"作並"}).sort({_id: -1}).limit(1).toArray(function(err, items2_2) {
        for(var item2_2 of items2_2){
        }
          sakunami_getDay = item2_2.getDay;
          sakunami_getTime = item2_2.getTime;
          sakunami_imagePath1 = item2_2.imagePath1;
          sakunami_imagePath2 = item2_2.imagePath2;
        }, (error, result) => {
        client.close();
        });

        collection2.find({location:"広瀬通"}).sort({_id: -1}).limit(1).toArray(function(err, items2_3) {
        for(var item2_3 of items2_3){
        }
          hirose_getDay = item2_3.getDay;
          hirose_getTime = item2_3.getTime;
          hirose_imagePath1 = item2_3.imagePath1;
          hirose_imagePath2 = item2_3.imagePath2;
        }, (error, result) => {
        client.close();
        });


        setTimeout(function(){
            roadInfoImage = {
              "oritate_getDay":oritate_getDay,
              "oritate_getTime":oritate_getTime,
              "oritate_imagePath1":oritate_imagePath1,
              "oritate_imagePath2":oritate_imagePath2,
              "sakunami_getDay":sakunami_getDay,
              "sakunami_getTime":sakunami_getTime,
              "sakunami_imagePath1":sakunami_imagePath1,
              "sakunami_imagePath2":sakunami_imagePath2,
              "hirose_getDay":hirose_getDay,
              "hirose_getTime":hirose_getTime,
              "hirose_imagePath1":hirose_imagePath1,
              "hirose_imagePath2":hirose_imagePath2

           }
            //クライアント側へ送信
            io.emit('roadInfoImage',roadInfoImage);
            console.log("FP3　道路情報板");
        },2000);




        //col3.愛子防災ステーション　路面状況写真
        collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items3) {
        for(var item3 of items3){
          console.log(item3)
        }
          roadImage_getDay = item3.getDay;
          roadImage_getTime = item3.getTime;
          roadImage_imagePath = item3.imagePath;
        }, (error, result) => {
        client.close();
        });

        setTimeout(function(){
         roadImage = {
            "roadImage_getDay":roadImage_getDay,
            "roadImage_getTime": roadImage_getTime,
            "roadImage_imagePath": roadImage_imagePath
         }
          //クライアント側へ送信
          io.emit('roadImage',roadImage);
           console.log("FP3　路面状況写真")
        },2000);

    });

  },1000);









//ここからは繰り返し


  //フレームパターン3のデータ送信
  cron.schedule('*/5 * * * *', () => {

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
    assert.equal(null, err);

    //データベース名
    dbName = 'AreaBroadcast';
    const db = client.db(dbName);

      // コレクションの取得
      collection1 = db.collection("DPSObserv");
      collection2 = db.collection("RoadInfoImage");
      collection3 = db.collection("RoadImage");


     //Col1.愛子防災ステーション観測値
     collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
      for(var item of items){
       console.log(item);

       getDay = item.getDay;
       getTime = item.getTime;
       rainfall = item.rainfall;
       temp = item.temp;
       windspeed = item.windspeed;
       roadtemp = item.roadtemp;
       roadsit = item.roadsit;

      }
      }, (error, result) => {
        client.close();
      });

      setTimeout(function(){
        var dpsobserv = {
          "DPS_getDay":getDay,
          "DPS_getTime":getTime,
          "rainfall":rainfall,
          "temp":temp,
          "windspeed":windspeed,
          "roadtemp":roadtemp,
          "roadsit":roadsit
       }
        //クライアント側へ送信
        io.emit('dpsobserv',dpsobserv);
        console.log("FP3 愛子防災ステーション観測値")
      },2000);

      //col2.道路情報板
      collection2.find({location:"折立"}).sort({_id: -1}).limit(1).toArray(function(err, items2_1) {
      for(var item2_1 of items2_1){
      }
          oritate_getDay = item2_1.getDay;
          oritate_getTime = item2_1.getTime;
          oritate_imagePath1 = item2_1.imagePath1;
          oritate_imagePath2 = item2_1.imagePath2;
      }, (error, result) => {
      client.close();
      });

      collection2.find({location:"作並"}).sort({_id: -1}).limit(1).toArray(function(err, items2_2) {
      for(var item2_2 of items2_2){
      }
        sakunami_getDay = item2_2.getDay;
        sakunami_getTime = item2_2.getTime;
        sakunami_imagePath1 = item2_2.imagePath1;
        sakunami_imagePath2 = item2_2.imagePath2;
      }, (error, result) => {
      client.close();
      });

      collection2.find({location:"広瀬通"}).sort({_id: -1}).limit(1).toArray(function(err, items2_3) {
      for(var item2_3 of items2_3){
      }
        hirose_getDay = item2_3.getDay;
        hirose_getTime = item2_3.getTime;
        hirose_imagePath1 = item2_3.imagePath1;
        hirose_imagePath2 = item2_3.imagePath2;
      }, (error, result) => {
      client.close();
      });


      setTimeout(function(){
        roadInfoImage = {
          "oritate_getDay":oritate_getDay,
          "oritate_getTime":oritate_getTime,
          "oritate_imagePath1":oritate_imagePath1,
          "oritate_imagePath2":oritate_imagePath2,
          "sakunami_getDay":sakunami_getDay,
          "sakunami_getTime":sakunami_getTime,
          "sakunami_imagePath1":sakunami_imagePath1,
          "sakunami_imagePath2":sakunami_imagePath2,
          "hirose_getDay":hirose_getDay,
          "hirose_getTime":hirose_getTime,
          "hirose_imagePath1":hirose_imagePath1,
          "hirose_imagePath2":hirose_imagePath2

       }
        //クライアント側へ送信
        io.emit('roadInfoImage',roadInfoImage);
        console.log("FP3　道路情報板")
      },2000);




      //col3.愛子防災ステーション　路面状況写真
      collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items3) {
      for(var item3 of items3){
        console.log(item3)
      }
        roadImage_getDay = item3.getDay;
        roadImage_getTime = item3.getTime;
        roadImage_imagePath = item3.imagePath;
      }, (error, result) => {
      client.close();
      });

      setTimeout(function(){
         roadImage = {
            "roadImage_getDay":roadImage_getDay,
            "roadImage_getTime": roadImage_getTime,
            "roadImage_imagePath": roadImage_imagePath
         }
          //クライアント側へ送信
          io.emit('roadImage',roadImage);
          console.log("FP3　路面状況写真")
      },2000);

    });
  });



  //フレームパターン切り替え
  setTimeout(function(){
    io.emit('switch_flame',{value:true});
    console.log("フレームパターン切り替え依頼(FP3→FP1)");
  },300000);

});
