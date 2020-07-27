$(function() {

var socket = new io.Socket(null, {port: 8080});
var proxy = process.env.http_proxy || 'http://10.64.199.79:8080';
var agent = new HttpProxyAgent(proxy);
socket.connect('',{agent:agent});
//データ受信ハンドラ
socket.on('message', function(message){
    $("#show").append(message + '<br>');
});
//サーバ切断
socket.on('disconnect', function(message){
    $("#show").append('切断されました');
});
});
