# Swig模版引擎

## 一、在Node.js中的配置
>注意：首先需要npm安装swig，并且在项目的入口文件中引入该模块

**1. 引入该模块**
```
var swig = require('swig');
```
**2. 配置指令**
```
app.engine('html',swig.renderFile);  //定义当前应用所使用的模板引擎
      @ 第1个参数 ： 模板引擎的名称，同时也是模板文件的后缀名
      @ 第2个参数 ： 用于解析处理模板内容的方法，会调用swig对象下面的renderFile方法来对
app.set('views','./views');  //设置模板文件存放的目录
      @ 第1个参数 ： 必须是views
      @ 第2个参数 ： views文件夹的路径，相对当前app.js的路径    
app.set('view engine','html');  //注册所使用的模板引擎,作用：是把前面两步配置的模板引擎，注册到这个app应用中
      @ 第1个参数 ：必须是view engine
      @ 第2个参数 ：和定义模板引擎的第一个参数必须一致
```

## 二、基本语法
**1. 变量**
```
{{ name }}
```
**2. 属性**
```
{{ student.name }}
```
**2. if 指令**
```
{% if paragraph %}
  <p>如果if后面的条件满足了，则我这个p标签就会被渲染出来</p>
{% else %}
  <a>糟糕，if后面的条件没有满足，那就把本标签渲染出来，哈哈哈哈</a>
{% endif %}
```
**3. for 循环**
```
{% for food in foods %}
  <li>{{food.name}}</li>
{% endfor %}
```
说明：这个for循环会遍历foods数组，最后会渲染出所有的food

**4. 解析html**
```
{% autoescape %}
    {{mark}}
{% endautoescape %}
```
>注意：如果后台传的变量是html语句，比如：
mark = <span>hello</span>,
@如果直接{{mark}},则页面会把整体的mark当一个字符串解析到页面，显示<span>hello</span>；
@实际上我们是想把html语法解析出来，把变量放到{% autoescape %}标签中即可实现，显示 **hello**

**5. 模版继承**
模版文件layout.index:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
    <h1>你好，</h1>
    {% block main %} {% endblock %}
    <h1>很高兴见到你！</h1>
</body>
```
index.html继承模版
```
{% extends 'layout.html' %}
   {% block main %}
        小明
   {% endblock %}
```
>解释说明：
swig使用**extends**来继承一个模版
swig使用**block**重写模版中的某些模块
首先，定义模版文件;
然后，别的文件继承这个模版

>解释说明：
block就类似模版中的占位符，我们继承模版后，可以选择重写一些自己需要的block内容，上面例子，运行index.html,页面实际输出：
**你好，**
小明
**很高兴见到你**


**6. 引入模版**
index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>文章分页展示</title>
</head>
{% include 'page.html' %}
```
>引入的模版可以使用当前文件的上下文信息

**7. 过滤器**
假如，想要格式化时间，像下面这样写
```
{{addTime|date('Y/m/d H:i:s',-8*60)}}
```
>**有这么多内置过滤器**：
add(value)：使变量与value相加，可以转换为数值字符串会自动转换为数值。
addslashes：用 \ 转义字符串
capitalize：大写首字母
date(format[, tzOffset])：转换日期为指定格式
format：格式
tzOffset：时区
default(value)：默认值（如果变量为undefined，null，false）
escape([type])：转义字符
默认： &, <, >, ", '
js: &, <, >, ", ', =, -, ;
first：返回数组第一个值
join(glue)：同[].join
json_encode([indent])：类似JSON.stringify, indent为缩进空格数
last：返回数组最后一个值
length：返回变量的length，如果是object，返回key的数量
lower：同''.toLowerCase()
raw：指定输入不会被转义
replace(search, replace[, flags])：同''.replace
reverse：翻转数组
striptags：去除html/xml标签
title：大写首字母
uniq：数组去重
upper：同''.toUpperCase
url_encode：同encodeURIComponent
url_decode：同decodeURIComponemt




