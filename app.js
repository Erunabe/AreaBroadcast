var express = require('express');
var path = require('path')
var fs = require('fs')
var app = express();
var observRoutes = require('./routes/WeatherObserv');
var graphRoutes = require('./routes/WeatherGraph');
var roadRoutes = require('./routes/TrafficRoadinfo');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
require('date-utils');
const cron = require('node-cron');
const log4js = require('log4js')
//log4js.configure('logconfig.json');
const mongodb = require('./dbConnect');
const assert = require('assert');



app.use(express.static(path.join(__dirname, 'public')));
app.set('io',io)


mongodb.connectToserver(function(err){
    assert.equal(null, err);

    console.log('mongoサーバ接続');
    app.use('/weather/observ', observRoutes);
    app.use('/weather/graph', graphRoutes);
    app.use('/traffic/roadinfo', roadRoutes);

});


//接続
io.on('connection',function(socket){
  console.log('a user connected from : '+socket.id);
});
//サーバリッスン開始
http.listen(PORT, function(){
   console.log('server listening. Port:' + PORT);
});





 // ログ出力
 var systemLogger = log4js.getLogger('system');
 var accessLogger = log4js.getLogger('access');
 var errorLogger = log4js.getLogger('error');
