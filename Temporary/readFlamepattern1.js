var http = require("http");
var fs = require("fs");
var ejs = require("ejs");

var readData = require("./DataReqInsRead.js")
console.log(readData)

var srv = http.createServer();
var temp = fs.readFileSync("./flamepattern1.ejs", "utf-8");
srv.on("request", function(req, res) {
var page = ejs.render(temp, {
  datatime:readData.datatime,
  temp:readData.temp,
  humi:readData.humi,
  wind_s:readData.wind_s,
  wind_d:readData.wind_d,
  wind_max_s:readData.wind_max_s,
  press_l:readData.press_l,
  rain_i:readData.rain_i,
  rain_m:readData.rain_m,
  wbgt:readData.wbgt,
});

res.writeHead(200, {"Content-Type": "text/html"});
res.write(page);
res.end();
});
srv.listen(3000, "0.0.0.0");
console.log("server listening...");
