var express = require('express');
var cron = require('node-cron');
var router = express.Router();
readData = require("/home/s1500740/WeatherDataBroadcast/DataReqInsRead.js");
readImage = require("/home/s1500740/WeatherDataBroadcast/NowcastImageReqInsRead.js");
TempRead = require("/home/s1500740/WeatherDataBroadcast/TempRead.js");

  router.get("/", function (req, res) {
    var data = {
      GetDay:readData.GetDay,
      GetTime:readData.GetTime,
      temp:readData.temp,
      humi:readData.humi,
      wind_s:readData.wind_s,
      wind_d:readData.wind_d,
      wind_max_s:readData.wind_max_s,
      press_l:readData.press_l,
      rain_i:readData.rain_i,
      rain_m:readData.rain_m,
      wbgt:readData.wbgt,

      GetImageTime:readImage.GetImageTime,
      ImageName:readImage.ImageName,
      ImagePath:readImage.ImagePath,

    };
    // レンダリングを行う
    res.render('index', data);
  });

  router.get("/graph", function (req, res) {
    var data = {
      items: [
        ['Hour', '温度'],
        [TempRead.GetTime1,  TempRead.Temp1],
        [TempRead.GetTime2,  TempRead.Temp2],
        [TempRead.GetTime3,  TempRead.Temp3],
        [TempRead.GetTime4,  TempRead.Temp4]
      ]
    };
    // レンダリングを行う
    res.render('graph.ejs', data);
  });
module.exports = router;
