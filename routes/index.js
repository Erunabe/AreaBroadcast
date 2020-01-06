var express = require('express');
var cron = require('node-cron');
var router = express.Router();
readData = require("/home/s1500740/WeatherDataBroadcast/DataReqInsRead.js");
readImage = require("/home/s1500740/WeatherDataBroadcast/ImageReqInsRead.js");


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

module.exports = router;
