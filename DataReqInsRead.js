var rp = require('request-promise')
var fs = require('fs')
require('date-utils');
const cron = require('node-cron');
const moment = require('moment')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


var headers = {
    'X-POTEKA-Authorization':'c2VuZGFpLW5jdDpmZzd6dm1wWQ==',
}

var options = {
    url: 'http://api.potekanet.com/v1/point/real/ja/poteka?potekaId=555&element=temp,humi,wind_s,wind_d,wind_max_s,press_l,rain_i,rain_m,wbgt',
    method: 'GET',
    headers: headers,
    proxy:'http://10.64.199.79:8080',
    json: false,
}

var nowTime = new Date();
var NToday = nowTime.toFormat("YYYY"+"-"+"M"+"-"+"D");
var Today = NToday.toLocaleString();
console.log(Today);
//毎分実行する
cron.schedule('* * * * *', () => {
  console.log('Data : Per minute execution');
  rp(options).then(function(body) {
    //  console.log(body);
      res = JSON.parse(body);


      dt = new Date(res.poteka[0].element[0].dataList[0].datatime);
      datatime = dt.toLocaleString();
      ArrayDatatime = datatime.split(' ');
      temp = res.poteka[0].element[0].dataList[0].value;
      humi = res.poteka[0].element[1].dataList[0].value;
      wind_s = res.poteka[0].element[2].dataList[0].value;
      wind_d = res.poteka[0].element[3].dataList[0].value;

      //風向変換
      if(0<=wind_d && wind_d<=22.5 && 337.5 < wind_d && wind_d<=360){
        wind_d = "北";
      }else if (22.5<wind_d && wind_d<=67.5) {
        wind_d = "北東";
      }else if (67.5<wind_d && wind_d<=112.5) {
        wind_d = "東";
      }else if (112.5<wind_d && wind_d<=157.5) {
        wind_d = "南東";
      }else if (157.5<wind_d && wind_d<=202.5) {
        wind_d = "南";
      }else if (202.5<wind_d && wind_d<=247.5) {
        wind_d = "南西";
      }else if (247.5<wind_d && wind_d<=292.5) {
        wind_d = "西";
      }else if (292.5<wind_d && wind_d<=337.5) {
        wind_d = "北西";
      }

      wind_max_s = res.poteka[0].element[4].dataList[0].value;
      press_l = res.poteka[0].element[5].dataList[0].value;
      rain_i = res.poteka[0].element[6].dataList[0].value;
      rain_m = res.poteka[0].element[7].dataList[0].value;
      wbgt = res.poteka[0].element[8].dataList[0].value;

    })

    .then(function(body){

      // 接続先URL
      url = 'mongodb://localhost:27017';

      //データベース名
      dbName = 'AreaBroadcast';


      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);
        console.log("DataInsert : Connected successfully to server");

        const db = client.db(dbName);

          // コレクションの取得
          collection1 = db.collection("MeteorObserv");
          collection2 = db.collection("MaxElement");
          collection3 = db.collection("MinElement");


          // coll1=最新観測値
          collection1.insertOne(
          {
            "TTLfield": new Date(),
            "GetDay":ArrayDatatime[0],
            "GetTime":ArrayDatatime[1],
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
      , (error, result) => {
              client.close();
          });
          console.log("最新要素格納完了")

//coll2=1日の最大観測値
      collection2.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
        for(var item of items){
            max_GetDay = item.max_GetDay;
            console.log(max_GetDay == Today);
            if(max_GetDay != Today){
              console.log("日付変更：最大要素格納更新");
                collection2.insertOne(
                {
                  "TTLfield": new Date(),
                  "max_GetDay":ArrayDatatime[0],
                  "max_temp_Time":ArrayDatatime[1],
                  "max_temp":temp,
                  "max_humi_Time":ArrayDatatime[1],
                  "max_humi":humi,
                  "max_wind_s_Time":ArrayDatatime[1],
                  "max_wind_s":wind_s,
                  "max_wind_max_s_Time":ArrayDatatime[1],
                  "max_wind_max_s":wind_max_s,
                  "max_pless_l_Time":ArrayDatatime[1],
                  "max_press_l":press_l,
                  "max_rain_i_Time":ArrayDatatime[1],
                  "max_rain_i":rain_i,
                  "max_rain_m_Time":ArrayDatatime[1],
                  "max_rain_m":rain_m,
                  "max_wbgt_Time":ArrayDatatime[1],
                  "max_wbgt":wbgt

                }
            , (error, result) => {
                client.close();
              })
            }
          }
        }, (error, result) => {
            client.close();
       });

  collection3.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
    for(var item of items){
        min_GetDay = item.min_GetDay;
        console.log(min_GetDay == Today);
        if(min_GetDay != Today){
          console.log("日付変更：最小要素格納更新");
            collection3.insertOne(
            {
              "TTLfield": new Date(),
              "min_GetDay":ArrayDatatime[0],
              "min_temp_Time":ArrayDatatime[1],
              "min_temp":temp,
              "min_humi_Time":ArrayDatatime[1],
              "min_humi":humi,
              "min_wind_s_Time":ArrayDatatime[1],
              "min_wind_s":wind_s,
              "min_wind_max_s_Time":ArrayDatatime[1],
              "min_wind_max_s":wind_max_s,
              "min_pless_l_Time":ArrayDatatime[1],
              "min_press_l":press_l,
              "min_rain_i_Time":ArrayDatatime[1],
              "min_rain_i":rain_i,
              "min_rain_m_Time":ArrayDatatime[1],
              "min_rain_m":rain_m,
              "min_wbgt_Time":ArrayDatatime[1],
              "min_wbgt":wbgt

            }
        , (error, result) => {
            client.close();
          })
        }
      }
    }, (error, result) => {
        client.close();
   });
 });
})
    .then(function(body){
      MongoClient.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true},function(err, client) {
        assert.equal(null, err);
        console.log("DataRead : Connected successfully to server");

        const db = client.db(dbName);

          // コレクションの取得
          collection1 = db.collection("MeteorObserv");
          collection2 = db.collection("MaxElement");
          collection3 = db.collection("MinElement");

         //最新の一件を取得

          collection1.find().sort({_id: -1}).limit(1).toArray(function(err, items) {
           for(var item of items){
            console.log(item);

            exports.GetDay = item.GetDay;
            exports.GetTime = item.GetTime;
            exports.temp = item.temp;
            exports.humi = item.humi;
            exports.wind_s = item.wind_s;
            exports.wind_d = item.wind_d;
            exports.wind_max_s = item.wind_max_s;
            exports.press_l = item.press_l;
            exports.rain_i = item.rain_i;
            exports.rain_m = item.rain_m;
            exports.wbgt = item.wbgt;

            /*exports.GetDay = GetDay;
            exports.GetTime = GetTime;
            exports.temp = temp;
            exports.humi = humi;
            exports.wind_s = wind_s;
            exports.wind_d = wind_d;
            exports.wind_max_s = wind_max_s;
            exports.press_l = press_l;
            exports.rain_i = rain_i;
            exports.rain_m = rain_m;
            exports.wbgt = wbgt;*/
           }
         }, (error, result) => {
           client.close();
       });

       collection2.find({max_GetDay:Today}).limit(1).toArray(function(err, items) {
        for(var item of items){
        console.log(item);

         if(item.max_temp < temp ){
           console.log("update_MAXtemp");
           collection2.updateOne({max_GetDay:Today},{$set:{
             "max_temp_Time":ArrayDatatime[1],
             "max_temp":temp
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(item.max_humi < humi){
           console.log("update_MAXhumi");
           collection2.updateOne({max_GetDay:Today},{$set:{
             "max_humi_Time":ArrayDatatime[1],
             "max_humi":humi
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(item.max_wind_s < wind_s){
           console.log("update_MAXwind_s");
           collection2.updateOne({max_GetDay:Today},{$set:{
             "max_wind_s_Time":ArrayDatatime[1],
             "max_wind_s":wind_s
           }}
           , (error, result) => {
                   client.close();
           });
         }

         if(item.max_wind_max_s < wind_max_s){
           console.log("update_MAXwind_max_s");
           collection2.updateOne({max_GetDay:Today},{$set:{
             "max_wind_max_s_Time":ArrayDatatime[1],
             "max_wind_max_s":wind_max_s
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(item.max_press_l < press_l){
           console.log("update_MAXpress_l");
           collection2.updateOne({max_GetDay:Today},{$set:{
             "max_pless_l_Time":ArrayDatatime[1],
             "max_press_l":press_l
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(item.max_rain_i < rain_i){
           console.log("update_MAXrain_i");
           collection2.updateOne({max_GetDay:Today},{$set:{
             "max_rain_i_Time":ArrayDatatime[1],
             "max_rain_i":rain_i
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(item.max_rain_m < rain_m){
           console.log("update_MAXrain_m");
           collection2.updateOne({max_GetDay:Today},{$set:{
             "max_rain_m_Time":ArrayDatatime[1],
             "max_rain_m":rain_m
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(item.max_wbgt < wbgt){
           console.log("update_MAXwbgt");
          collection2.updateOne({max_GetDay:Today},{$set:{
             "max_wbgt_Time":ArrayDatatime[1],
             "max_wbgt":wbgt
           }}
           , (error, result) => {
                   client.close();
           });
         }

         exports.max_GetDay = item.max_GetDay;
         exports.max_temp_Time = item.max_temp_Time;
         exports.max_temp = item.max_temp;
         exports.max_humi_Time = item.max_humi_Time;
         exports.max_humi = item.max_humi;
         exports.max_wind_s_Time = item.max_wind_s_Time;
         exports.max_wind_s = item.max_wind_s;
         exports.max_wind_d_Time = item.max_wind_d_Time;
         exports.max_wind_d = item.max_wind_d;
         exports.max_wind_max_s_Time = item.max_wind_max_s_Time;
         exports.max_wind_max_s = item.max_wind_max_s;
         exports.max_press_l_Time = item.max_press_l_Time;
         exports.max_press_l = item.max_press_l;
         exports.max_rain_i_Time = item.max_rain_i_Time;
         exports.max_rain_i = item.max_rain_i;
         exports.max_rain_m_Time = item.max_rain_m_Time;
         exports.max_rain_m = item.max_rain_m;
         exports.max_wbgt_Time = item.max_wbgt_Time;
         exports.max_wbgt = item.max_wbgt;

       }
    },(error, result) => {
         client.close();
       });



       //最小要素検索
       collection3.find({min_GetDay:Today}).limit(1).toArray(function(err, items) {
        for(var item of items){
        console.log(item);

         if(temp < item.min_temp ){
           console.log("update_MINtemp");
           collection3.updateOne({min_GetDay:Today},{$set:{
             "min_temp_Time":ArrayDatatime[1],
             "min_temp":temp
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if( humi < item.max_humi ){
           console.log("update_MINhumi");
           collection3.updateOne({min_GetDay:Today},{$set:{
             "min_humi_Time":ArrayDatatime[1],
             "min_humi":humi
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(wind_s < item.max_wind_s){
           console.log("update_MINwind_s");
           collection3.updateOne({min_GetDay:Today},{$set:{
             "min_wind_s_Time":ArrayDatatime[1],
             "min_wind_s":wind_s
           }}
           , (error, result) => {
                   client.close();
           });
         }

         if(wind_max_s < item.max_wind_max_s ){
           console.log("update_MINwind_max_s");
           collection3.updateOne({min_GetDay:Today},{$set:{
             "min_wind_max_s_Time":ArrayDatatime[1],
             "min_wind_max_s":wind_max_s
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(press_l < item.max_press_l){
           console.log("update_MINpress_l");
           collection3.updateOne({min_GetDay:Today},{$set:{
             "min_pless_l_Time":ArrayDatatime[1],
             "min_press_l":press_l
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(rain_i < item.max_rain_i ){
           console.log("update_MINrain_i");
           collection3.updateOne({min_GetDay:Today},{$set:{
             "min_rain_i_Time":ArrayDatatime[1],
             "min_rain_i":rain_i
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(rain_m  < item.max_rain_m){
           console.log("update_MINrain_m");
           collection3.updateOne({min_GetDay:Today},{$set:{
             "min_rain_m_Time":ArrayDatatime[1],
             "min_rain_m":rain_m
           }}
           , (error, result) => {
                   client.close();
           });
         }
         if(wbgt < item.max_wbgt){
           console.log("update_MINwbgt");
          collection3.updateOne({min_GetDay:Today},{$set:{
             "min_wbgt_Time":ArrayDatatime[1],
             "min_wbgt":wbgt
           }}
           , (error, result) => {
                   client.close();
           });
         }

         exports.min_GetDay = item.min_GetDay;
         exports.min_temp_Time = item.min_temp_Time;
         exports.min_temp = item.min_temp;
         exports.min_humi_Time = item.min_humi_Time;
         exports.min_humi = item.min_humi;
         exports.min_wind_s_Time = item.min_wind_s_Time;
         exports.min_wind_s = item.min_wind_s;
         exports.min_wind_d_Time = item.min_wind_d_Time;
         exports.min_wind_d = item.min_wind_d;
         exports.min_wind_max_s_Time = item.min_wind_max_s_Time;
         exports.min_wind_max_s = item.min_wind_max_s;
         exports.min_press_l_Time = item.max_press_l_Time;
         exports.min_press_l = item.min_press_l;
         exports.min_rain_i_Time = item.max_rain_i_Time;
         exports.min_rain_i = item.min_rain_i;
         exports.min_rain_m_Time = item.min_rain_m_Time;
         exports.min_rain_m = item.min_rain_m;
         exports.min_wbgt_Time = item.min_wbgt_Time;
         exports.min_wbgt = item.min_wbgt;

       }
    },(error, result) => {
         client.close();
       });

    })
})
    .catch(function(err){
      console.error(err);
    });
});
