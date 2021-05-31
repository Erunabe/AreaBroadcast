
var express = require('express');
var app = express();
var cron = require('node-cron');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment')
var rp = require('request-promise')
var fs = require('fs')
require('date-utils');
url = 'mongodb://localhost:27017';

module.exports = router;

router.get("/", function (req, res) {

  var io = req.app.get('io');
  res.sendFile('/home/a2011529/AreaBroadcast/tempcomp/view/index.html');

  //初回接続時

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);

        //データベース名
        dbName = 'AreaBroadcast';
        const db = client.db(dbName);
        // コレクションの取得
        collection1 = db.collection("MeteorObserv");

       //最新の一件を取得
       function  col1_Promise(){
         return new Promise(function(resolve,reject){
           setTimeout(function() {
             collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
                for(var item of items){
                  resolve(item);
                }
             }, (error, result) => {
                  client.close();
           　});
         },500);
        })
   　  };

       col1_Promise()
       .then(function(item){
         return new Promise(function(resolve,reject){
             getDay = item.getDay;
             getTime = item.getTime;
             temp = item.temp;


             var poteka_data = {
               "getDay":getDay,
               "getTime":getTime,
               "temp":temp
            }

            resolve(poteka_data);
         })
        })
        .then(function(poteka_data){
           //クライアント側へ送信
           io.emit('poteka_data',poteka_data);
           console.log("POTEKA データ送信");
        })
        .catch(function(item){
          console.log("MeteorObservコレクション 読込エラー")
        })

    });




    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);

        //データベース名
        dbName = 'AreaBroadcast';
        const db = client.db(dbName);
        // コレクションの取得
        collection2 = db.collection("rasp_temp");

       //最新の一件を取得
       function  col2_Promise(){
         return new Promise(function(resolve,reject){
           setTimeout(function() {
             collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
                for(var item of items){
                  resolve(item);
                }
             }, (error, result) => {
                  client.close();
           　});
         },500);
        })
   　  };

       col2_Promise()
       .then(function(item){
         return new Promise(function(resolve,reject){
             getDay = item.getDay;
             getTime = item.getTime;
             temp_ins = item.temp_ins;
             temp_avg = item.temp_avg;



             var rasp_data = {
               "getDay":getDay,
               "getTime":getTime,
               "temp_ins":temp_ins,
               "temp_avg":temp_avg
            }

            resolve(rasp_data);
         })
        })
        .then(function(rasp_data){
           //クライアント側へ送信
           io.emit('rasp_data',rasp_data);
           console.log("RaspberryPi観測値 送信");
        })
        .catch(function(item){
          console.log("rasp_tempコレクション 読込エラー")
        })

    });



    //Davis
    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);

        //データベース名
        dbName = 'AreaBroadcast';
        const db = client.db(dbName);
        // コレクションの取得
        collection3 = db.collection("davis_temp");

       //最新の一件を取得
       function  col3_Promise(){
         return new Promise(function(resolve,reject){
           setTimeout(function() {
             collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
                for(var item of items){
                  resolve(item);
                }
             }, (error, result) => {
                  client.close();
           　});
         },500);
        })
   　  };

       col3_Promise()
       .then(function(item){
         return new Promise(function(resolve,reject){
             getDay = item.getDay;
             getTime = item.getTime;
             davis_temp = item.temp;


             var davis_data = {
               "getDay":getDay,
               "getTime":getTime,
               "davis_temp":davis_temp
            }

            resolve(davis_data);
         })
        })
        .then(function(davis_data){
           //クライアント側へ送信
           io.emit('davis_data',davis_data);
           console.log("davis データ送信");
        })
        .catch(function(item){
          console.log("davis_tempコレクション 読込エラー")
        })

    });














 cron.schedule(' 5 0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {

    MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);

        url = 'mongodb://localhost:27017';
        //データベース名
        dbName = 'AreaBroadcast';
        const db = client.db(dbName);
        // コレクションの取得
        collection1 = db.collection("MeteorObserv");

           //最新の一件を取得
            function  col1_Promise(){
              return new Promise(function(resolve,reject){
                setTimeout(function() {
                  collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
                     for(var item of items){
                       resolve(item);
                     }
                  }, (error, result) => {
                       client.close();
                　});
              },500);
             })
        　  };

           col1_Promise()
           .then(function(item){
             return new Promise(function(resolve,reject){
                 getDay = item.getDay;
                 getTime = item.getTime;
                 temp = item.temp;


                 var poteka_data = {
                   "getDay":getDay,
                   "getTime":getTime,
                   "temp":temp
                }

                resolve(poteka_data);
             })
            })
            .then(function(poteka_data){
               //クライアント側へ送信
               io.emit('poteka_data',poteka_data);
               console.log("POTEKA データ送信");
            })
            .catch(function(item){
              console.log("MeteorObservコレクション 読込エラー")
            })


      });


      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
          assert.equal(null, err);

          //データベース名
          dbName = 'AreaBroadcast';
          const db = client.db(dbName);
          // コレクションの取得
          collection2 = db.collection("rasp_temp");

         //最新の一件を取得
         function  col2_Promise(){
           return new Promise(function(resolve,reject){
             setTimeout(function() {
               collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
                  for(var item of items){
                    resolve(item);
                  }
               }, (error, result) => {
                    client.close();
             　});
           },500);
          })
     　  };

         col2_Promise()
         .then(function(item){
           return new Promise(function(resolve,reject){
               getDay = item.getDay;
               getTime = item.getTime;
               temp_ins = item.temp_ins;
               temp_avg = item.temp_avg;



               var rasp_data = {
                 "getDay":getDay,
                 "getTime":getTime,
                 "temp_ins":temp_ins,
                 "temp_avg":temp_avg
              }

              resolve(rasp_data);
           })
          })
          .then(function(rasp_data){
             //クライアント側へ送信
             io.emit('rasp_data',rasp_data);
             console.log("RaspberryPi観測値 送信");
          })
          .catch(function(item){
            console.log("rasp_tempコレクション 読込エラー")
          })

      });

      //Davis
      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
          assert.equal(null, err);

          //データベース名
          dbName = 'AreaBroadcast';
          const db = client.db(dbName);
          // コレクションの取得
          collection3 = db.collection("davis_temp");

         //最新の一件を取得
         function  col3_Promise(){
           return new Promise(function(resolve,reject){
             setTimeout(function() {
               collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
                  for(var item of items){
                    resolve(item);
                  }
               }, (error, result) => {
                    client.close();
             　});
           },500);
          })
     　  };

         col3_Promise()
         .then(function(item){
           return new Promise(function(resolve,reject){
               getDay = item.getDay;
               getTime = item.getTime;
               davis_temp = item.temp;


               var davis_data = {
                 "getDay":getDay,
                 "getTime":getTime,
                 "davis_temp":davis_temp
              }

              resolve(davis_data);
           })
          })
          .then(function(davis_data){
             //クライアント側へ送信
             io.emit('davis_data',davis_data);
             console.log("davis データ送信");
          })
          .catch(function(item){
            console.log("davis_tempコレクション 読込エラー")
          })

      });





 });




});
