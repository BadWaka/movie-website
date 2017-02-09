// 引入模块
var express = require('express');
var app = express();

// 设置视图根目录
app.set('views', './views');
// 设置模板引擎node
app.set('view engine', 'jade');

// 监听端口
var port = process.env.PORT || 3000;
app.listen(port);

// 服务成功启动日志
console.log('movie-website start on port ' + port);

// 路由
// index page
app.get('/', function (req, res) {
    res.render('index', {
        title: '首页'
    });
});

// detail page
app.get('/movie/:id', function (req, res) {
    res.render('detail', {
        title: '详情'
    });
});

// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入'
    });
});

// list page
app.get('/admin/list', function (req, res) {
    res.render('list', {
        title: '列表'
    });
});