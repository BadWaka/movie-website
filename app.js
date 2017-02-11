// 引入模块
var path = require('path');     // 原生path模块
var express = require('express');   // 引入express
var bodyParser = require('body-parser');    // bodyParser 已经不再与Express捆绑，需要独立安装
var _ = require('underscore');  // 引入underscore，是为了用到 _.extend()方法，用一个对象里的新的字段,替换掉老的对象里的老的字段
var mongoose = require('mongoose'); // 引入mongoose来连接数据库
var Movie = require('./models/movie');  // 引入Movie模型

// 初始化app
var app = express();
// 定义express的路由
var apiRoutes = express.Router();

// 设置视图根目录
app.set('views', './views/pages');
// 设置模板引擎node
app.set('view engine', 'jade');

// 引入静态资源，这样jade里才能找到要引入文件的路径
app.use(express.static(path.join(__dirname, 'public')));
// 使用body-parser格式化表单
app.use(bodyParser.urlencoded());
// 使用该路由；所有的路由都要加上/blogWaka，举个栗子：localhost:8080/blogWaka/articles
app.use('/movieWebsite', apiRoutes);

// 引入moment；app.locals定义的键值对能在模板中直接访问
app.locals.moment = require('moment');

// 连接mongodb，数据库的名字是movie_website
mongoose.connect('mongodb://localhost/movieWebsite');

// 监听端口
var port = process.env.PORT || 3000;
app.listen(port);

// 服务成功启动日志
console.log('movie-website start on port ' + port);

// 路由
// index page
apiRoutes.get('/', function (req, res) {
    // 调用Movie.fetch，从数据库中取出所有数据
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
            return;
        }
        res.render('index', {
            title: '首页',
            movies: movies
        });
    });
});

// detail page

apiRoutes.get('/movie/:id', function (req, res) {
    var id = req.params.id; // :id的好处是在req.params就能拿到id这个参数值

    // 调用Movie.findById，从数据库中根据id取出单个电影数据
    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err);
            return;
        }
        res.render('detail', {
            title: movie.title,
            movie: movie
        });
    });

    // mock data
    // res.render('detail', {
    //     title: '详情',
    //     movie: {
    //         title: '机械战警',
    //         director: '导演',
    //         country: '美国',
    //         year: 2014,
    //         poster: 'http://img.hb.aicdn.com/a0b950474752e3f574793a7b4c3f422088de17fc175b9-um7Dko_fw658',
    //         language: '英语',
    //         flash: '',
    //         summary: '简介'
    //     }
    // });
});

// admin page 后台录入页
apiRoutes.get('/admin/movie', function (req, res) {
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

// admin post movie 后台添加电影接口
apiRoutes.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var moviePost = req.body.movie;
    var _movie; // 定义临时变量，用来保存修改过但是还未存入数据库的movie

    // 如果id不是undefined，则代表该电影是定义过的,需要进行更新
    if (id !== 'undefined') {

        // 方法1: 使用underscore的_.extend()方法，并手动保存
        // Movie.findById(id, function (err, movie) {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     _movie = _.extend(movie, moviePost); // 用Post过来的新的字段，替换掉数据库里查询到的老的字段
        //     _movie.save(function (err, movie) {
        //         if (err) {
        //             console.log(err);
        //             return;
        //         }
        //         // 重新跳转到电影详情页
        //         res.redirect('/movie/' + movie._id);
        //     });
        // });

        // 方法2(推荐): 使用mongoose的findOneAndUpdate()方法
        Movie.findOneAndUpdate({_id: id}, moviePost, function (err, movie) {
            if (err) {
                console.log(err);
                return;
            }
            res.redirect('/movieWebsite/movie/' + movie._id);
        });
    }
    // id是undefined，则代表
    else {
        // 调用构造函数新建一个movie对象
        _movie = new Movie({
            title: moviePost.title,
            director: moviePost.director,
            country: moviePost.country,
            year: moviePost.year,
            poster: moviePost.poster,
            language: moviePost.language,
            flash: moviePost.flash,
            summary: moviePost.summary
        });
        // 保存
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
                return;
            }
            res.redirect('/movieWebsite/movie/' + movie._id);
        });
    }
});

// admin update movie 更新电影，主要是在列表页点击更新按钮后要跳转到
apiRoutes.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
                return;
            }
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            });
        });
    }
});

// admin list page
apiRoutes.get('/admin/list', function (req, res) {

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
            return;
        }
        res.render('list', {
            title: '列表',
            movies: movies
        });
    });

    // mock data
    // res.render('list', {
    //     title: '列表',
    //     movies: [{
    //         title: '机械战警',
    //         director: '导演',
    //         country: '美国',
    //         year: 2014,
    //         poster: 'http://img.hb.aicdn.com/a0b950474752e3f574793a7b4c3f422088de17fc175b9-um7Dko_fw658',
    //         language: '英语',
    //         flash: '',
    //         summary: '简介'
    //     }]
    // });
});

// admin list delete movie
apiRoutes.delete('/admin/list', function (req, res) {
    // 这里取id的方法是因为通过?id传过来的，所以需要用query来取
    var id = req.query.id;
    console.log(req.query);

    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
                return;
            }
            res.json({
                success: 1
            });
        });
    }
});