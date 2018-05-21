## 一、技术框架

**1，项目运行环境**<br>
WebstormProject<br>
Node.js<br>
Mongodb<br>
Express

**2， 第三方模块 & 中间件**<br>
express:Node.js :Web应用框架<br>
swig：模版渲染引擎<br>
mongoose: 操作mongodb数据<br>
bodyParser ：解析post请求数据<br>
cookies：读、写cookies

**3，项目初始化**<br>
在合适的位置创建项目E:\WebstormProject\Blog<br>
在项目的Terminal输入语句 "npm init" 进行初始化<br>
在Terminal，安装依赖模块：
```
npm install express
npm install swig
npm install mongoose
npm install bodyParser
npm install cookies
```
**4，目录结构**
![image.png](https://upload-images.jianshu.io/upload_images/11152416-4e96fe4fb124aec6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


## 二、入口文件app.js

**1，通过require方式引入依赖模块**
```
var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Cookies = require('cookies');
```
**2，开启Node.js服务**
```
var app = express();
app.listen(8081);
```
在浏览器可输入：localhost://8081<br>
即可通过8081端口进行访问

**3，设置静态文件托管**
```
app.use('/public',express.static(__dirname+'/public'));
```
当用户访问的url以 /public开头，直接返回__dirname+'/public'下面的文件<br>
这样就可以在punlic目录下面建立css，js，image,等文件夹存放静态的资源

**4，配置模板渲染引擎**<br>
作用：实现前后端分离<br>
*   加载模板处理模块 `var swig = require('swig');`
*   定义当前应用所使用的模板引擎 `app.engine('html',swig.renderFile);`<br>
@ 第1个参数 ： 模板引擎的名称，同时也是模板文件的后缀名<br>
@ 第2个参数 ： 用于解析处理模板内容的方法，会调用swig对象下面的renderFile方法来对 内容读取过来的文件进行解析。

*   设置模板文件存放的目录 `app.set('views','./views');`<br>
@ 第1个参数 ： 必须是views<br>
@ 第2个参数 ： views文件夹的路径，相对当前app.js的路径

*   注册所使用的模板引擎 `app.set('view engine','html');`<br>
作用：是把前面两步配置的模板引擎，注册到这个app应用中<br>
@ 第1个参数 ：必须是view engine<br>
@ 第2个参数 ：和定义模板引擎的第一个参数必须一致

**5，bodyparser设置**
作用，获取以post方式提交的数据：req.body.data
```
app.use(bodyParser.urlencoded({extended:true}))
```
**6, 分模块开发**
```
app.use('/',require('./routers/main'));
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
```
根据不同的功能划分模块<br>
@前台模块 ：主要用来处理前台展示页面的逻辑<br>
@后台管理模块 ：主要用来处理管理后台功能<br>
@API模块 ： 主要用来处理ajax请求<br>

 * * * 

## 三、路由以及整体规划

**1，前台路由+模版**
![](https://upload-images.jianshu.io/upload_images/11152416-1dbe262551f2ffb5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**2，后台路由+模版**
![image.png](https://upload-images.jianshu.io/upload_images/11152416-6286fc16a83186ef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**3，功能开发顺序**

功能模块：
*   用户
*   栏目
*   内容
*   评论

编码顺序：
*   通过Schema定义设计数据存储结构
*  功能逻辑
*   页面展示

***

## 四、Mongodb数据库

**1，想要正常使用数据库有以下三个步骤**

**<1>，安装mongodb数据库，在官网下载，假设安装到 D：\MongoDB,如下所示是，安装好的所有文件**

![image](http://upload-images.jianshu.io/upload_images/11152416-84e1463877cbbe12?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

**<2>，在命令行开启mongodb服务**

首先，进入mongodb的安装目录bin文件夹下：D:\MongoDB\bin>

然后，在那个路径下执行：mongod --dbpath E:\WebstormProject\Blog\db --port=27018

@第1个参数 --dbpath 的值是node项目的db文件夹的路径(E:\WebstormProject\Blog\db)

@第2个参数 --port 指定端口，默认是27017，由于别的程序可能占用这个端口，因此自己重写一个27018

出现 waiting for connections on port 27018即可

**<3>，应用程序连接数据库**
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
```
第1个参数：mongodb://localhost:27018/blog<br>
@ 协议：mongodb：<br>
@ 地址：//localhost<br>
@ 端口：27018<br>
@ 连接的数据库名 blog<br>

第2个参数 回调函数，有错误参数，可以进行判断是否连接成功

**<4>基本语法**
写在简书，链接地址：https://www.jianshu.com/p/b234d13ce9ce

 * * * 

## 五、cookies的使用

作用：使用cookies记住某些值，可以在整个网站刷新的时候保持仍然使用这些值，直到cookies时间到期，常用于登录后保存用户名等

**1，引入cookies模块**
```
var Cookies = require('cookies');
```
**2，设置cookies**
```
app.use(function (req,res,next) {
req.cookies = new Cookies(req,res);

//解析登录用户的cookies信息,保存在req.userInfo这个全局对象中
req.userInfo = {};
if(req.cookies.get('userInfo')){
    try{
        req.userInfo = JSON.parse(req.cookies.get('userInfo'));
       }catch(e){}
    }else{
        next();
    }
});
```
设置值
```
req.cookies.set('userInfo',JSON.stringify({
_id:userInfo._id,
username:userInfo.username
}));
```

获取值
```
JSON.parse(req.cookies.get('userInfo'));
```
@设置值：req.cookies.set（name,value）<br>
@获取值：req.cookies.get（name）

 * * * 

## 六、AJAX的使用

作用：局部刷新网站<br>
首先要在前台的js文件中写ajax请求的配置参数
```
//登录
$loginBox.find('button').on('click',function(){

//通过ajax提交请求
$.ajax({
    type : 'post',
    url : '/api/user/login',
    data :{
        username:$loginBox.find('[name="username"]').val(),
        password:$loginBox.find('[name="password"]').val()
    },
    dataType:'json',
    success : function (result) {
        $loginBox.find('.warning').html(result.message);
        if(!result.code){
        //登陆成功
        //重新刷新页面
        window.location.reload()
        }
    })
});
```
参数说明<br>
@type：有post，get两种方式，说明传递数据的方式<br>
@url: 传递给后台的哪个接口处理<br>
@data: 要传递的数据<br>
@dataType：传递的数据类型<br>
@success：当后台处理完数据后返回一个信息，我们就执行这个函数

对应的后台处理
```
router.post('/user/login',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' ||password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
})
```
解释：

router.post('/user/login',function (req,res) {｝) ：和前台ajax的url一致的接口<br>
req.body.username：用post方式接收前台ajax传来的数据<br>
res.json(responseData); 返回responseData给前台<br>

 * * * 

## 七、GET,POST给后台传递数据

**1，get传递数据**

get通过href传递数据，会将数据显示在url中带去后台
```
<a  class="btn btn-info"  href="/view?contentid={{content._id.toString()}}">阅读全文</a>
```
解释说明：
/view ：是后台接收的接口<br>
?contentid ：是传递的数据<br>

后台获取数据通过：req.query.name
```
req.query.contentid
```
**2,post传递数据**
需要指定表单元素的 name属性，在后台直接通过req.body.name来获取

例如 ：
```
<input type="text" name="username"  class="form-control" id="inputname" >
```
则：req.body.username

 * * * 

## 八、附件

**图1，npm init 初始化结果**
![image](http://upload-images.jianshu.io/upload_images/11152416-fd6e1bb737afa7fb?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

**图2，项目的目录结构**

![image](http://upload-images.jianshu.io/upload_images/11152416-61cda5d666ff4007?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

**图3，mongodb的可视化连接界面**

![image](http://upload-images.jianshu.io/upload_images/11152416-aa9be3a91e7693f1?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
