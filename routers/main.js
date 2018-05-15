var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;
var markdown = require('markdown-js');
/**
 * 处理通用数据
 */
router.use(function (req,res,next) {
    data={
        userInfo:req.userInfo,
        categories:[]
    }
    Category.find().sort({_id:1}).then(function(categories){
        data.categories = categories;
        next();
    })
})

/**
 * 首页
 */

router.get('/',function (req,res,next){
    data.category = req.query.category||'';
    data.count = 0;
    data.page =Number(req.query.page || 1);
    data.limit = 3;
    data.pages = 0;
    
    var where = {};
    if(data.category){
        where.category = data.category;
    }
    
    Content.where(where).count().then(function(count){
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count/data.limit);
        //当前页取值不能超过pages
        data.page = Math.min(data.page,data.pages);
        //当前页取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
        //通过where来控制对应类别显示对应的文章
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
    }).then(function (contents) {
       
        data.contents = contents;
        res.render('main/index',data)
    });
});


//阅读全文
router.get('/view',function (req,res) {
    var contentId = req.query.contentid||'';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        console.log(content);
        data.content = content;
        //更新阅读数
        content.views++;
        content.save();
        res.render('main/view',data);
    });
})

module.exports = router;