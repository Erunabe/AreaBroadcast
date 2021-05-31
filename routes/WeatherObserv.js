
var express = require('express');
var app = express();
var cron = require('node-cron');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger();
log4js.configure('./logconfig.json');
const systemLogger = log4js.getLogger('system');
const httpLogger = log4js.getLogger('http');
const accessLogger = log4js.getLogger('access');
app.use(log4js.connectLogger(accessLogger));




module.exports = router;

router.get("/", function (req, res) {

  var mongodb = require('../dbConnect');
  var db = mongodb.getDb();

  var io = req.app.get('io');
  res.sendFile('/home/a2011529/AreaBroadcast/views/WeatherObserv.html');

  //フレームパターン切り替え
  setTimeout(function(){
    io.emit('switch_flame',{value:true});
    logger.info("フレームパターン切り替え依頼(FP1→FP3)");
  },360000);


  //初回接続時
    logger.info("初回接続時情報送信")



    // コレクションの取得
    weather_collection1 = db.collection('davisObserv');
    //collection2 = db.collection("NowcastImage");
    weather_collection3 = db.collection("WeathermapImage");
   //最新の一件を取得


    function  col1_Promise(){
      return new Promise(function(resolve,reject){
        setTimeout(function() {
          weather_collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
             for(var item of items){
               resolve(item);
             }
          })
      },300)
     })
　  };

   col1_Promise()
   .then(function(item){
     return new Promise(function(resolve,reject){
         getDay = item.getDay;
         getTime = item.getTime;
         temp = item.temp;
         humi = item.humi;
         press = item.press;
         rainrate = item.rainrate;
         wind_s = item.wind_s;
         wind_d = item.wind_d;
         rain_i = item.rain_i;
         rain_m = item.rain_m;
         windchill = item.windchill;
         heatindex = item.heatindex;

         var col1_data = {
           "getDay":getDay,
           "getTime":getTime,
           "temp":temp,
           "humi":humi,
           "press":press,
           "rainrate":rainrate,
           "wind_s":wind_s,
           "wind_d":wind_d,
           "windchill":windchill,
           "heatindex":heatindex
        }

        resolve(col1_data);
     })
    })
    .then(function(col1_data){
       //クライアント側へ送信
       io.emit('element_data',col1_data);
       logger.info("FP1 データ送信");
       logger.info(col1_data);
    })
    .catch(function(item){
      logger.warn("DavisObservコレクション 読込エラー")
    })


/*
     function  col2_Promise(){
       return new Promise(function(resolve,reject){
         setTimeout(function() {
           weather_collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
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
          getImageDay = item.getDay;
          getImageTime = item.getTime;
          imagePath = item.imagePath;

         var Image = {
           "getImageDay":getImageDay,
           "getImageTime":getImageTime,
           "imagePath":imagePath
         }

         resolve(Image);
      })
     })
     .then(function(Image){
       //クライアント側へ送信
       io.emit('element_nowcastimage',Image);
       logger.info("FP1 降水分布図送信")
     })
     .catch(function(item){
       logger.info("NowcastImageコレクション 読込エラー")
     })



*/


      function  col3_Promise(){
        return new Promise(function(resolve,reject){
          setTimeout(function() {
            weather_collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
               for(var item of items){
                 resolve(item);
               }
            })
        },300)
       })
      　  };

        col3_Promise()
        .then(function(item){
         return new Promise(function(resolve,reject){
             getImageDay = item.getDay;
             getImageTime = item.getTime;
             imagePath = item.imagePath;

             var col3_data = {
               "getImageDay":getImageDay,
               "getImageTime":getImageTime,
               "imagePath":imagePath
            }

            resolve(col3_data);
         })
        })
        .then(function(col3_data){
           //クライアント側へ送信
           io.emit('element_weathermapimage',col3_data);
           logger.info("FP1 天気図送信");
           logger.info(col3_data);
        })
        .catch(function(item){
          logger.warn("WeathermapImageコレクション 読込エラー")
        })






    cron.schedule(' * * * * *', () => {

      function  col1_Promise(){
        return new Promise(function(resolve,reject){
          setTimeout(function() {
            weather_collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
               for(var item of items){
                 resolve(item);
               }
            })
        },500)
       })
  　  };

     col1_Promise()
     .then(function(item){
       return new Promise(function(resolve,reject){
           getDay = item.getDay;
           getTime = item.getTime;
           temp = item.temp;
           humi = item.humi;
           press = item.press;
           rainrate = item.rainrate;
           wind_s = item.wind_s;
           wind_d = item.wind_d;
           rain_i = item.rain_i;
           rain_m = item.rain_m;
           windchill = item.windchill;
           heatindex = item.heatindex;

           var col1_data = {
             "getDay":getDay,
             "getTime":getTime,
             "temp":temp,
             "humi":humi,
             "press":press,
             "rainrate":rainrate,
             "wind_s":wind_s,
             "wind_d":wind_d,
             "windchill":windchill,
             "heatindex":heatindex
          }

          resolve(col1_data);
       })
      })
      .then(function(col1_data){
         //クライアント側へ送信
         io.emit('element_data',col1_data);
         logger.info("FP1 データ送信");
         logger.info(col1_data);
      })
      .catch(function(item){
        logger.warn("DavisObservコレクション 読込エラー")
      })


/*
       function  col2_Promise(){
         return new Promise(function(resolve,reject){
           setTimeout(function() {
             weather_collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
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
            getImageDay = item.getDay;
            getImageTime = item.getTime;
            imagePath = item.imagePath;

           var Image = {
             "getImageDay":getImageDay,
             "getImageTime":getImageTime,
             "imagePath":imagePath
           }

           resolve(Image);
        })
       })
       .then(function(Image){
         //クライアント側へ送信
         io.emit('element_nowcastimage',Image);
         logger.info("FP1 降水分布図送信")
       })
       .catch(function(item){
         logger.info("NowcastImageコレクション 読込エラー")
       })



*/


        function  col3_Promise(){
          return new Promise(function(resolve,reject){
            setTimeout(function() {
              weather_collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
                 for(var item of items){
                   resolve(item);
                 }
              })
          },500)
         })
        　  };

          col3_Promise()
          .then(function(item){
           return new Promise(function(resolve,reject){
               getImageDay = item.getDay;
               getImageTime = item.getTime;
               imagePath = item.imagePath;

               var col3_data = {
                 "getImageDay":getImageDay,
                 "getImageTime":getImageTime,
                 "imagePath":imagePath
              }

              resolve(col3_data);
           })
          })
          .then(function(col3_data){
             //クライアント側へ送信
             io.emit('element_weathermapimage',col3_data);
             logger.info("FP1 天気図送信 ");
             logger.info(col3_data);
          })
          .catch(function(item){
            logger.warn("WeathermapImageコレクション 読込エラー")
          })



   });





});
