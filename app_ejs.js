var express = require('express');
var path = require('path')
var fs = require('fs')
var app = express();
var routes = require('./routes/index.js');
const cron = require('node-cron');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
require('date-utils');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);



cron.schedule(' */30 * * * * *', () => {
  readData = require("/home/a2011529/AreaBroadcast/DataRead.js");
  readImage = require("/home/a2011529/AreaBroadcast/NowcastImageRead.js");
  app.get("/", function (req, res) {
       //送信するデータをJSON形式で格納
         data = {
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
           "wbgt":readData.wbgt,
           "getImageDay":readImage.getImageDay,
           "getImageTime":readImage.getImageTime,
           "imagePath":readImage.imagePath
        }

      res.render('../views/index.ejs', data);
  });

});


//接続
io.on('connection',function(socket){
  console.log('a user connected');
});

//サーバリッスン開始
 http.listen(PORT, function(){
     console.log('server listening. Port:' + PORT);
 });
