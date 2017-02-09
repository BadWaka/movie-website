// 引入模块
var path = require('path');     // 原生path模块
var express = require('express');   // 引入express
var app = express();
var bodyParser = require('body-parser');    // bodyParser 已经不再与Express捆绑，需要独立安装
var mongoose = require('mongoose'); // 引入mongoose来连接数据库
var Movie = require('./models/movie');  // 引入movie模型

// 连接mongodb，数据库的名字是movie_website
mongoose.connect('mongodb://localhost/movie_website');

// 设置视图根目录
app.set('views', './views/pages');
// 设置模板引擎node
app.set('view engine', 'jade');
// 引入静态资源
app.use(express.static(path.join(__dirname, 'bower_components')));
// 使用body-parser格式化表单
app.use(bodyParser.urlencoded());

// 监听端口
var port = process.env.PORT || 3000;
app.listen(port);

// 服务成功启动日志
console.log('movie-website start on port ' + port);

// 路由
// index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movies
        });
    });

});

// detail page
// :id的好处是在req.params就能拿到id这个参数值
app.get('/movie/:id', function (req, res) {
    res.render('detail', {
        title: '详情',
        movie: {
            title: '机械战警',
            director: '导演',
            country: '美国',
            year: 2014,
            poster: 'http://img.hb.aicdn.com/a0b950474752e3f574793a7b4c3f422088de17fc175b9-um7Dko_fw658',
            language: '英语',
            flash: '',
            summary: '简介'
        }
    });
});

// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
});

// list page
app.get('/admin/list', function (req, res) {
    res.render('list', {
        title: '列表',
        movies: [{
            title: '机械战警',
            director: '导演',
            country: '美国',
            year: 2014,
            poster: 'http://img.hb.aicdn.com/a0b950474752e3f574793a7b4c3f422088de17fc175b9-um7Dko_fw658',
            language: '英语',
            flash: '',
            summary: '简介'
        }]
    });
});