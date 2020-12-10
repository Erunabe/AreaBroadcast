var socket =io();

//トリガを返す
socket.on("send_trigger",function(data){
  socket.emit("return_trigger",{value:1})
})
