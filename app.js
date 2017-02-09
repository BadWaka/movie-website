var express = require('express');
// 端口
var port = process.env.PORT || 3000;
var app = express();

// 设置视图根目录
app.set('views', './views');
// 设置模板引擎node
app.set('view engine', 'jade');

app.listen(port);

console.log('movie-website start on port ' + port);