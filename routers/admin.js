var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req,res,next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
})

/**
 * 首页
 */
router.get('/',function (req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});


/**
 * 用户首页管理
 */
router.get('/user',function (req,res) {
    /**
     * 读取数据库所有用户信息
     * limit(number):限制条数
     * skip(number):忽略数据条数
     * 每页显示三条
     * 1：1-3 skip:0 (当前页-1）*page
     * 2: 4-6 skip:3
     */
    var page = Number(req.query.page || 1);
    var limit = 5;
    var skip = (page-1)*limit
    //数据库总条数
    User.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                count:count,
                pages:pages,
                page:page,
                limit:limit
            });
        });
    });
    
    
});


/**
 * 分类首页管理
 */
router.get('/category',function (req,res) {
    /**
     * 读取数据库所有用户信息
     *
     * limit(number):限制条数
     *
     * skip(number):忽略数据条数
     *
     * 每页显示三条
     * 1：1-3 skip:0 (当前页-1）*page
     * 2: 4-6 skip:3
     */
    var page = Number(req.query.page || 1);
    var limit = 5;
    var skip = (page-1)*limit
    //数据库总条数
    Category.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
    
        /**
         * 1:按时间升序
         * -1：按时间降序
         */
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                // users:users,
                categories :categories,
                count:count,
                pages:pages,
                page:page,
                limit:limit
            });
        });
    });
});

/**
 * 分类首页
 */

router.get('/category',function (req,res) {
    res.render('admin/category_index',{
        userInfo : req.userInfo
        
    })
})

/**
 * 分类的添加
 */
router.get('/category/add',function (req,res) {
    res.render('admin/category_add',{
        userInfo : req.userInfo
    })
});

/**
 * 分类的保存
 */
router.post('/category/add',function (req,res) {
    console.log(req.body);
    var name = req.body.name || '';
    if(name == ''){
        res.render('admin/error',{
            userInfo : req.userInfo,
            message : '名称不能为空'
        });
        return;
    }
    
    //数据库是否已经存在相同类别
    Category.findOne({
        name:name
    }).then(function (rs) {
        if(rs){
            //数据库已经有该分类名
            res.render('admin/error',{
                userInfo : req.userInfo,
                message : '分类已经存在'
            });
            return Promise.reject();
        }else{
            return new Category({
                name:name
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo : req.userInfo,
            message : '分类保存成功',
            url : '/admin/category'
        })
    })
    
});

/**
 * 分类的修改
 */
router.get('/category/edit',function (req,res) {
    //获取要修改的分类信息，并且用表单的形式展现出来
    //req.query.id,这是通过get方式接收的数据
    var id = req.query.id || '';
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo :req.userInfo,
                message : '分类信息不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo :req.userInfo,
                category:category
            })
        }
    })
});


/**
 * 分类的修改保存
 */
router.post('/category/edit',function(req,res){
    //get方式获取要修改的分类信息
    var id = req.query.id || '';
    //获取post提交的数据
    var name = req.body.name;
    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userInfo :req.userInfo,
                message : '分类信息不存在'
            });
            return Promise.reject();
        }else{
            //当用户没做任何修改提交的时候
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message : '修改成功',
                    url : '/admin/category'
                });
                return Promise.reject();
            }else{
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    //查询数据库中有没id和我传的id不一样，但是分类名字却一样的数据
                    _id:{$ne:id},
                    name:name
                });
            }
        }
    }).then(function (sameCategory) {
        if(sameCategory)
        {
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库中已经存在同名分类'
            });
            return Promise.reject();
        }else{
            return Category.update({
                _id:id
            },{
                name:name
            });
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo :req.userInfo,
            message : '分类修改成功',
            url :'/admin/category'
        });
    });
});

/**
 * 分类的删除
 */
router.get('/category/delete',function (req,res) {
    //获取要删除分类的id
    var id = req.query.id || '';
    Category.remove({
        _id :id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message: '删除成功',
            url :'/admin/category'
        });
    });
})

/**
 * 内容首页
 */
router.get('/content',function (req,res) {
    var page = Number(req.query.page || 1);
    var limit = 5;
    var skip = (page-1)*limit
    //数据库总条数
    Content.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count/limit);
        //取值不能超过pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);
        
        /**
         * 1:按时间升序
         * -1：按时间降序
         */
        Content.find().sort({_id:-1}).limit(limit).skip(skip).populate('category').then(function (contents) {
            console.log(contents)
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents :contents,
                count:count,
                pages:pages,
                page:page,
                limit:limit
            });
        });
    });
})

/**
 * 内容添加
 */
router.get('/content/add',function (req,res) {
    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        })
    })
    
})

/**
 * 内容保存
 */
router.post('/content/add',function (req,res) {
    console.log(req.body);
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo :req.userInfo,
            message:'文章分类不能为空'
        })
        return;
    }
    if(req.body.title==''){
        res.render('admin/error',{
            userInfo :req.userInfo,
            message:'文章标题不能为空'
        })
        return;
    }
    //保存到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).save().then(function (rs) {
        res.render('admin/success',{
            userInfo :req.userInfo,
            message:'内容保存成功'
        })
    })
})

/**
 * 修改内容
 */
router.get('/content/edit',function (req,res) {
    var id = req.query.id || '';
    Content.find({
        _id:id
    }).then(function (content) {
        if(!content){
            res.render('admin/error' ,{
                userInfo : req.userInfo,
                message:'指定内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo : req.userInfo,
                content :content
            })
        }
    })
});


module.exports = router;