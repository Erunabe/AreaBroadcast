
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
// 接続先URL
url = 'mongodb://127.0.0.1:27017';


module.exports = router;

router.get("/", function (req, res) {

  var mongodb = require('../dbConnect');
  var db = mongodb.getDb();

  var io = req.app.get('io');
  res.sendFile('/home/a2011529/AreaBroadcast/views/TrafficRoadinfo.html');

  //フレームパターン切り替え
  setTimeout(function(){
    io.emit('switch_flame',{value:true});
    logger.info("フレームパターン切り替え依頼(FP3→FP1)");
  },360000);

  //初回接続時
    logger.info("初回接続時情報送信")




    // コレクションの取得
    traf_collection1 = db.collection("DPSObserv");
    traf_collection2 = db.collection("RoadInfoImage");
    traf_collection3 = db.collection("RoadImage");


   //Col1.愛子防災ステーション観測値
   traf_collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
    for(var item of items){
     logger.info(item);

     getDay = item.getDay;
     getTime = item.getTime;
     rainfall = item.rainfall;
     temp = item.temp;
     windspeed = item.windspeed;
     roadtemp = item.roadtemp;
     roadsit = item.roadsit;

    }
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
      logger.info("FP3 愛子防災ステーション観測値")
    },500);

    //col2.道路情報板
    traf_collection2.find({location:"折立"}).sort({_id: -1}).limit(1).toArray(function(err, items2_1) {
    for(var item2_1 of items2_1){
    }
        oritate_getDay = item2_1.getDay;
        oritate_getTime = item2_1.getTime;
        oritate_imagePath = item2_1.imagePath;
    });

    traf_collection2.find({location:"作並"}).sort({_id: -1}).limit(1).toArray(function(err, items2_2) {
    for(var item2_2 of items2_2){
    }
      sakunami_getDay = item2_2.getDay;
      sakunami_getTime = item2_2.getTime;
      sakunami_imagePath = item2_2.imagePath;
    });

    traf_collection2.find({location:"広瀬通"}).sort({_id: -1}).limit(1).toArray(function(err, items2_3) {
    for(var item2_3 of items2_3){
    }
      hirose_getDay = item2_3.getDay;
      hirose_getTime = item2_3.getTime;
      hirose_imagePath = item2_3.imagePath;
    });


    setTimeout(function(){
        roadInfoImage = {
          "oritate_getDay":oritate_getDay,
          "oritate_getTime":oritate_getTime,
          "oritate_imagePath":oritate_imagePath,
          "sakunami_getDay":sakunami_getDay,
          "sakunami_getTime":sakunami_getTime,
          "sakunami_imagePath":sakunami_imagePath,
          "hirose_getDay":hirose_getDay,
          "hirose_getTime":hirose_getTime,
          "hirose_imagePath":hirose_imagePath

       }
        //クライアント側へ送信
        io.emit('roadInfoImage',roadInfoImage);
        logger.info("FP3　道路情報板");
    },500);




    //col3.愛子防災ステーション　路面状況写真
    traf_collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items3) {
    for(var item3 of items3){
      logger.info(item3)
    }
      roadImage_getDay = item3.getDay;
      roadImage_getTime = item3.getTime;
      roadImage_imagePath = item3.imagePath;
    });

    setTimeout(function(){
     roadImage = {
        "roadImage_getDay":roadImage_getDay,
        "roadImage_getTime": roadImage_getTime,
        "roadImage_imagePath": roadImage_imagePath
     }
      //クライアント側へ送信
      io.emit('roadImage',roadImage);
       logger.info("FP3　路面状況写真")
    },500);



//ここからは繰り返し


  //フレームパターン3のデータ送信


    cron.schedule('* * * * *', () => {


     //Col1.愛子防災ステーション観測値
     traf_collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
      for(var item of items){
       logger.info(item);

       getDay = item.getDay;
       getTime = item.getTime;
       rainfall = item.rainfall;
       temp = item.temp;
       windspeed = item.windspeed;
       roadtemp = item.roadtemp;
       roadsit = item.roadsit;

      }
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
        logger.info("FP3 愛子防災ステーション観測値")
      },500);

      //col2.道路情報板
      traf_collection2.find({location:"折立"}).sort({_id: -1}).limit(1).toArray(function(err, items2_1) {
      for(var item2_1 of items2_1){
        logger.info(item2_1)
      }
          oritate_getDay = item2_1.getDay;
          oritate_getTime = item2_1.getTime;
          oritate_imagePath = item2_1.imagePath;
      });

      traf_collection2.find({location:"作並"}).sort({_id: -1}).limit(1).toArray(function(err, items2_2) {
      for(var item2_2 of items2_2){
      }
        sakunami_getDay = item2_2.getDay;
        sakunami_getTime = item2_2.getTime;
        sakunami_imagePath = item2_2.imagePath;
      });

      traf_collection2.find({location:"広瀬通"}).sort({_id: -1}).limit(1).toArray(function(err, items2_3) {
      for(var item2_3 of items2_3){
      }
        hirose_getDay = item2_3.getDay;
        hirose_getTime = item2_3.getTime;
        hirose_imagePath = item2_3.imagePath;
      });


      setTimeout(function(){
        roadInfoImage = {
          "oritate_getDay":oritate_getDay,
          "oritate_getTime":oritate_getTime,
          "oritate_imagePath":oritate_imagePath,
          "sakunami_getDay":sakunami_getDay,
          "sakunami_getTime":sakunami_getTime,
          "sakunami_imagePath":sakunami_imagePath,
          "hirose_getDay":hirose_getDay,
          "hirose_getTime":hirose_getTime,
          "hirose_imagePath":hirose_imagePath

       }
        //クライアント側へ送信
        io.emit('roadInfoImage',roadInfoImage);
        logger.info("FP3　道路情報板")
      },500);




      //col3.愛子防災ステーション　路面状況写真
      traf_collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items3) {
      for(var item3 of items3){
        logger.info(item3)
      }
        roadImage_getDay = item3.getDay;
        roadImage_getTime = item3.getTime;
        roadImage_imagePath = item3.imagePath;
      });

      setTimeout(function(){
         roadImage = {
            "roadImage_getDay":roadImage_getDay,
            "roadImage_getTime": roadImage_getTime,
            "roadImage_imagePath": roadImage_imagePath
         }
          //クライアント側へ送信
          io.emit('roadImage',roadImage);
          logger.info("FP3　路面状況写真")
      },500);

    });



});
