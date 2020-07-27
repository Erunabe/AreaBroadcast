
/*
var express = require('express');
var app = express();
var cron = require('node-cron');
var router = express.Router();
const http = require('http');
var socketio = require('socket.io')
readData = require("/home/a2011529/AreaBroadcast/socketiotest/DataRead.js");
readImage = require("/home/a2011529/AreaBroadcast/socketiotest/NowcastImageRead.js");




setTimeout(route, 1000);


function route(){

  console.log(readData.temp)


    app.get("/", function (req, res) {
      var data = {
        getDay:readData.getDay,
        getTime:readData.getTime,
        temp:readData.temp,
        humi:readData.humi,
        wind_s:readData.wind_s,
        wind_d:readData.wind_d,
        wind_max_s:readData.wind_max_s,
        press_l:readData.press_l,
        rain_i:readData.rain_i,
        rain_m:readData.rain_m,
        wbgt:readData.wbgt,

        getDay:readImage.getDay,
        getTime:readImage.getTime,
        ImagePath:readImage.ImagePath
      }

      io.on('connection', function(socket) {
        socket.on('socket1',function(data){
          io.emit('socket1', data);
        });
      });
      res.render('index.ejs', data);
    });



    router.get("/graph", function (req, res) {
      var gdata = {
        items: [
          ['Hour', '温度'],
          [TempRead.getTime8,  TempRead.Temp8],
          [TempRead.getTime7,  TempRead.Temp7],
          [TempRead.getTime7,  TempRead.Temp7],
          [TempRead.getTime6,  TempRead.Temp6],
          [TempRead.getTime5,  TempRead.Temp5],
          [TempRead.getTime4,  TempRead.Temp4],
          [TempRead.getTime3,  TempRead.Temp3],
          [TempRead.getTime2,  TempRead.Temp2],
          [TempRead.getTime1,  TempRead.Temp1]

        ],

        max_temp:TempRead.max_temp,
        max_getDay:TempRead.max_getDay,
        max_temp_Time:TempRead.max_temp_Time,
        min_temp:TempRead.min_temp,
        min_getDay:TempRead.min_getDay,
        min_temp_Time:TempRead.min_temp_Time,
        latest_temp:readData.temp,
        latest_temp_Time:readData.getTime

      };
      // レンダリングを行う
      res.render('graph.ejs', gdata);
    });


};
  module.exports = app;

  */
