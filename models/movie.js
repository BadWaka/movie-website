var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');

// 编译生成Movie这个模型，传入模型的名字和对应的模式
var Movie = mongoose.model('Movie', MovieSchema);

// 导出这个模型的构造函数
module.exports = Movie;