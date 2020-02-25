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

      GetImageDay:readImage.GetImageDay,
      GetImageTime:readImage.GetImageTime,
      ImagePath:readImage.ImagePath

    };
    // レンダリングを行う
    res.render('index', data);
  });

  router.get("/graph", function (req, res) {
    var gdata = {
      items: [
        ['Hour', '温度'],
        [TempRead.GetTime8,  TempRead.Temp8],
        [TempRead.GetTime7,  TempRead.Temp7],
        [TempRead.GetTime7,  TempRead.Temp7],
        [TempRead.GetTime6,  TempRead.Temp6],
        [TempRead.GetTime5,  TempRead.Temp5],
        [TempRead.GetTime4,  TempRead.Temp4],
        [TempRead.GetTime3,  TempRead.Temp3],
        [TempRead.GetTime2,  TempRead.Temp2],
        [TempRead.GetTime1,  TempRead.Temp1]

      ],

      max_temp:TempRead.max_temp,
      max_GetDay:TempRead.max_GetDay,
      max_temp_Time:TempRead.max_temp_Time,
      min_temp:TempRead.min_temp,
      min_GetDay:TempRead.min_GetDay,
      min_temp_Time:TempRead.min_temp_Time,
      latest_temp:readData.temp,
      latest_temp_Time:readData.GetTime

    };
    // レンダリングを行う
    res.render('graph.ejs', gdata);
  });
module.exports = router;
