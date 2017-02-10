var mongoose = require('mongoose');

// Movie模式
var MovieSchema = new mongoose.Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: String,
    meta: {
        createAt: {
            type: Date, // 日期类型
            default: Date.now() // 默认值:当前时间
        },
        updateAt: {
            type: Date, // 日期类型
            default: Date.now() // 默认值:当前时间
        }
    }
});


// pre()的意思是，每次进行save操作之前，都会调用这个方法
MovieSchema.pre('save', function (next) {
    // 判断数据是否是新添加的
    if (this.isNew) {
        // 如果是，则将创建时间和更新时间都设置为当前时间
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        // 否则，只更新更新时间
        this.meta.updateAt = Date.now();
    }
    // 走接下来的流程
    next();
});

// 编写静态方法；静态方法在Model编译后才会具有这些方法
MovieSchema.statics = {

    // fetch方法，用来取出数据库里面所有的数据
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt') // 排序;根据更新时间排序
            .exec(cb);
    },

    // 根据id，查询单条数据
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

// 导出模式
module.exports = MovieSchema;