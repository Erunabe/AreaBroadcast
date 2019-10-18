var http = require("http");
var fs = require("fs");
var ejs = require("ejs");
var readData = require("./readData.js")


var srv = http.createServer();
var temp = fs.readFileSync(__dirname + "/flamepattern1.ejs", "utf-8");
srv.on("request", function(req, res) {
var page = ejs.render(temp, {
title:"TITLE",
content:"hogehoge"
});
res.writeHead(200, {"Content-Type": "text/html"});
res.write(page);
res.end();
});
srv.listen(3000, "0.0.0.0");
console.log("server listening...");
