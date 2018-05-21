## 一、连接数据库
>注意：要想正常使用mongodb数据库，有以下三个步骤
**1. 安装mongodb数据库**
**2. 在命令行开启mongodb服务**
**3. 应用程序连接数据库**

**1. 安装mongodb数据库**
**安装mongodb数据库，在官网下载，假设安装到 D：\MongoDB,如下所示是，安装好的所有文件**
![image.png](https://upload-images.jianshu.io/upload_images/11152416-c0074eb9bbdd09c8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**2. 在命令行开启mongodb服务**
**[在命令行里进入mongodb的安装目录bin文件夹下（D:\MongoDB\bin>）然后执行语句]**：
```
mongod --dbpath E:\WebstormProject\Blog\db  --port=27018
```
>**@第1个参数  --dbpath  的值是自己node项目的db文件夹的路径(E:\WebstormProject\Blog\db)
@第2个参数  --port  指定端口，默认是27017，由于别的程序可能占用这个端口，因此自己重写一个27018**

出现  waiting for connections on port 27018即可

**3. 应用程序连接数据库**
```
mongoose.connect('mongodb://localhost:27018/blog',function(err){
    if(err){
        console.log('数据库连接失败');
    }
    else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});

//解释说明
@第1个参数：mongodb://localhost:27018/blog
协议：mongodb：
地址：//localhost
端口：27018
连接的数据库名 blog
@第2个参数    回调函数，有错误参数，可以进行判断是否连接成功
```

## 二、Mongdb基本语法
**1. 概念解析**
>**database =	数据库
collection	= 表
document = 数据记录行
field	= 数据字段/域
index = 索引**

**2. 定义表结构**
 schemas 目录下（定义所有的表结构）
比如用户表：**users.js**
```
//引入mongoose数据库处理模块
var mongoose = require('mongoose');
//用户的表结构
module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin : {
        type:Boolean,
        default :false
    }
})
```
**3. 定义模型**
models目录下（定义所有表结构对应的模型）
比如用户表的模型：**User.js**
```
//引入mongoose数据库处理模块
var mongoose = require('mongoose');

//引入用户表
var usersSchema = require('../schemas/users');

// 通过mongoose.model把users表定义为User模型
module.exports = mongoose.model('User',usersSchema)
```
>**在项目中使用数据库的某个表，就需要做完前面2，3步骤，建立这个表的结构和模型。
然后在需要的文件引入模型文件，即可使用**

 **4. 查找所有记录**
把表中所有的记录以数组的形式返回
```
Content.find()
```

**5. 查找符合条件的一条记录**
返回数据库中_id的值和传的contentId值相等的1条记录
```
Content.findOne({
        _id:contentId
    })

//解释
@ _id 是数据库的一个字段
@ contentId 是进行比较的数据
```
**5. 限制查找记录**
一般用于分页显示记录
```
limit = 3;
skip = (page-1)*limit
User.find().limit(limit).skip(skip)    //每次跳过skip条记录然后查找limit条记录
```
**7. 数据库记录总条数**
返回总条数count
```
User.count()
```
**7. 修改记录**
修改指定记录的某些字段
```
Category.update({
                _id:id
            },{
                name:name
            });

@有两个参数｛ _id:id｝，｛name:name｝
@第一个是用来找到要修改的记录
@第二个是要修改的字段
```
**8. 删除记录**
```
Category.remove({
        _id :id
    })
```
**9. 添加记录并且保存**
```
new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save()

@左边是数据库的Content表的所有字段，右边是赋值添加
```
**10. 排序**
-1: 按逆序
1：按正序
```
Category.find().sort({_id:-1})
```
**11. 获取关联字段的其他字段**
```
Content.find().populate('category')

@.populate('category')会把category关联的数据也获取
```


