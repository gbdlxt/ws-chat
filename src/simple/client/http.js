var express = require('express');
var app = express();
var fs = require('fs');
var port = 9991;
 
//设置默认地址
app.use(express.static(__dirname, { index: "index.html"}));

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})