var express = require('express');
var router = express.Router();
var Category = require('../models/Category');

router.get('/',function (req,res,next){
    //读取所以分类信息
    Category.find().sort({_id:1}).then(function(categories){
        //render的第二个参数是传入到main/index.html里面,可以根据这个来渲染index.html页面
        res.render('main/index',{
            userInfo : req.userInfo,
            categories:categories
        });
    })
    
    
    
    
});

module.exports = router;