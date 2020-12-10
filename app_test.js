var express = require('express');
var path = require('path')
var fs = require('fs')
var app = express();
var indexRoutes = require('./routes/index');
var graphRoutes = require('./routes/graph');
var roadRoutes = require('./routes/road_info');
var http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
require('date-utils');
const cron = require('node-cron');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRoutes);
app.set('io',io)
app.use('/graph', graphRoutes);
app.use('/roadinfo', roadRoutes);



//接続
io.on('connection',function(socket){
  console.log('a user connected');
});

//サーバリッスン開始
 http.listen(PORT, function(){
     console.log('server listening. Port:' + PORT);
 });
