var express = require('express');
var path = require('path')
var fs = require('fs')
var app = express();
var routes = require('./routes/index');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
require('date-utils');
const cron = require('node-cron');
const moment = require('moment')
const assert = require('assert');
readData = require("/home/a2011529/AreaBroadcast/DataRead.js");
readImage = require("/home/a2011529/AreaBroadcast/NowcastImageRead.js");


app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);

app.get("/", function (req, res) {
  res.sendFile(__dirname+'/index.html');
});


   //最新の一件を取得


    cron.schedule(' */30 * * * * *', () => {

           //送信するデータをJSON形式で格納
           var data = {
             "getDay":readData.getDay,
             "getTime":readData.getTime,
             "temp":readData.temp,
             "humi":readData.humi,
             "wind_s":readData.wind_s,

             "wind_d":readData.wind_d,
             "wind_max_s":readData.wind_max_s,
             "press_l":readData.press_l,
             "rain_i":readData.rain_i,
             "rain_m":readData.rain_m,
             "wbgt":readData.wbgt
          }

          setTimeout(function(){
               //クライアント側へ送信
                io.emit('element_data',data);
          },3000);

    });


      cron.schedule(' */30 * * * * *', () => {
        var Image = {
            "getImageDay":readImage.getImageDay,
            "getImageTime":readImage.getImageTime,
            "imagePath":readImage.imagePath
          }

        setTimeout(function(){
             //クライアント側へ送信
              io.emit('element_image',Image);
        },3000);


    });

//接続
io.on('connection',function(socket){
  console.log('a user connected');
});

//サーバリッスン開始
 http.listen(PORT, function(){
     console.log('server listening. Port:' + PORT);
 });
