var express = require('express');
var path = require('path')
var fs = require('fs')
var app = express();
var routes = require('./routes/index');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const cron = require('node-cron');


//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
//app.use('/', routes);


  app.get("/", function (req, res) {
    res.sendFile(__dirname+'/index.html');
  });

//  readData = require("/home/a2011529/AreaBroadcast/DataRead.js");
//  readImage = require("/home/a2011529/AreaBroadcast/NowcastImageRead.js");

cron.schedule('*/5 * * * * *', () => {

  readData = require("/home/a2011529/AreaBroadcast/DataRead.js");
  readImage = require("/home/a2011529/AreaBroadcast/NowcastImageRead.js");

  getDay=readData.getDay;
  getTime=readData.getTime;
  temp=readData.temp;
  humi=readData.humi;
  wind_s=readData.wind_s;
  wind_d=readData.wind_d;
  wind_max_s=readData.wind_max_s;
  press_l=readData.press_l;
  rain_i=readData.rain_i;
  rain_m=readData.rain_m;
  wbgt=readData.wbgt;

  getImageDay=readImage.getDay;
  getImageTime=readImage.getTime;
  imagePath=readImage.imagePath;


  var data = {
    "getDay":getDay,
    "getTime":getTime,
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

var Image = {
    "getImageDay":getImageDay,
    "getImageTime":getImageTime,
    "imagePath":imagePath
  }

  io.emit('element_data',data);
  io.emit('element_image',Image);


  });


//接続
io.on('connection',function(socket){
  console.log('a user connected');
});


 http.listen(PORT, function(){
     console.log('server listening. Port:' + PORT);
 });
