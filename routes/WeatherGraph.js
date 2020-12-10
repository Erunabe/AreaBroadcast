
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
  res.sendFile('/home/a2011529/AreaBroadcast/views/WeatherGraph.html');
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
        collection2 = db.collection("MaxElement");
        collection3 = db.collection("MinElement");
       //最新の一件を取得


       collection1.find({getTime:/:00/},{temp:1}).sort({_id:-1}).toArray(function(err, items1) {
         for(var item1 of items1){
         }

          var tempArray = new Array();
          for(i=0;i<items1.length;i++){
            tempArray[i] = items1[i].temp;
          }
          gdata = {
            "getTime1" : items1[0].getTime,
            "Temp1": items1[0].temp,
            "getTime1": items1[3].getTime,
            "Temp1": items1[3].temp,
            "getTime1": items1[6].getTime,
            "Temp1": items1[6].temp,
            "getTime1": items1[9].getTime,
            "Temp1": items1[9].temp,
            "getTime1": items1[12].getTime,
            "Temp1": items1[12].temp,
            "getTime1": items1[15].getTime,
            "Temp1": items1[15].temp,
            "getTime1": items1[18].getTime,
            "Temp1": items1[18].temp,
            "getTime1": items1[21].getTime,
            "Temp1": items1[21].temp
         }

         }, (error, result) => {
           client.close();
        });

        setTimeout(function(){
          //クライアント側へ送信
          io.emit('gdata',gdata);
          console.log("FP2 グラフデータ送信")
        },2000);


        collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items2) {
        for(var item2 of items2){
        }
          max_getDay = item2.max_getDay;
          max_temp_Time = item2.max_temp_Time;
          max_temp = item2.max_temp;
        }, (error, result) => {
        client.close();
        });

        collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items3) {
        for(var item3 of items3){
        }
          min_getDay = item3.min_getDay;
          min_temp_Time = item3.min_temp_Time;
          min_temp = item3.min_temp;
        }, (error, result) => {
      client.close();
    });

    setTimeout(function(){
      MElement = {
        "max_getDay": max_getDay,
        "max_temp_Time": max_temp_Time,
        "max_temp": max_temp,
        "min_getDay" : min_getDay,
        "min_temp_Time": min_temp_Time,
        "min_temp":min_temp
     }
      //クライアント側へ送信
      io.emit('MElement',MElement);
      console.log("FP2　最高最低値送信")
    },2000);


  });


  },1000);





  //ここから繰り返し
  cron.schedule('* * * * *', () => {

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
    assert.equal(null, err);

    //データベース名
    dbName = 'AreaBroadcast';
    const db = client.db(dbName);

      // コレクションの取得
      collection1 = db.collection("MeteorObserv");
      collection2 = db.collection("MaxElement");
      collection3 = db.collection("MinElement");
     //最新の一件を取得


     collection1.find({getTime:/:00/},{temp:1}).sort({_id:-1}).toArray(function(err, items1) {
       for(var item1 of items1){
       }

        var tempArray = new Array();
        for(i=0;i<items1.length;i++){
          tempArray[i] = items1[i].temp;
        }
        gdata = {
          "getTime1" : items1[0].getTime,
          "Temp1": items1[0].temp,
          "getTime1": items1[3].getTime,
          "Temp1": items1[3].temp,
          "getTime1": items1[6].getTime,
          "Temp1": items1[6].temp,
          "getTime1": items1[9].getTime,
          "Temp1": items1[9].temp,
          "getTime1": items1[12].getTime,
          "Temp1": items1[12].temp,
          "getTime1": items1[15].getTime,
          "Temp1": items1[15].temp,
          "getTime1": items1[18].getTime,
          "Temp1": items1[18].temp,
          "getTime1": items1[21].getTime,
          "Temp1": items1[21].temp
       }

       }, (error, result) => {
         client.close();
      });

      setTimeout(function(){
        //クライアント側へ送信
        io.emit('gdata',gdata);
        console.log("FP2 グラフデータ送信")
      },3000);


      collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items2) {
      for(var item2 of items2){
      }
        max_getDay = item2.max_getDay;
        max_temp_Time = item2.max_temp_Time;
        max_temp = item2.max_temp;
      }, (error, result) => {
      client.close();
      });

      collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items3) {
      for(var item3 of items3){
      }
        min_getDay = item3.min_getDay;
        min_temp_Time = item3.min_temp_Time;
        min_temp = item3.min_temp;
      }, (error, result) => {
    client.close();
  });

  setTimeout(function(){
    MElement = {
      "max_getDay": max_getDay,
      "max_temp_Time": max_temp_Time,
      "max_temp": max_temp,
      "min_getDay" : min_getDay,
      "min_temp_Time": min_temp_Time,
      "min_temp":min_temp
   }
    //クライアント側へ送信
    io.emit('MElement',MElement);
    console.log("FP2　最高最低値送信")
  },3000);


  });

  });


//フレームパターン切り替え
setTimeout(function(){
  io.emit('switch_flame',{value:true});
  console.log("フレームパターン切り替え依頼(FP2→FP1)");
},300000);

});
