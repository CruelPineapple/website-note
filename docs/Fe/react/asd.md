# A-SOUL Digits

我的react练习项目，前端react，后端node，展示asoul成员哔哩哔哩粉丝信息。

这里记录该项目的学习内容，复习的时候，希望可以参阅[开发日志](https://github.com/CruelPineapple/A-SOUL-Digits/blob/master/README.md)

## img

jsx的img标签src属性不能直接用字符串，需要import

## css transition

display none是没法transition的，因为元素直接被删了。缓慢出现可以设置最开始高度0然后增加。

transition不光能用在hover这样的选择器上，在普通的class中切换也能产生作用

## hover

最初的hover用的是css的hover，会抖动。改成了在盒子上监听鼠标进入和离开事件，然后动态指定盒子内一个div的高度，让这个div把图片挤到下面去。

## 跨域

react跨域使用http-proxy-middleware模块，设置上和vue是类似的

## 403

b站接口在浏览器环境会403，curl和postman都能正常拉取。研究了一晚上，查到可以把network里面的请求信息复制为curl格式，然后我一个一个试了里面的请求头，发现是referer的问题，但是这个请求头没法改也去不掉，目前计划从node端拉取然后写自己的接口了。

## bfc

块级作用域上下文，虽然我不知道我是不是用上它了，也可能只用到了相对父元素定位吧。。。

我激活bfc只是想着让图片和上面的文字变成一个统一的块块，一起被hover时展开的div挤开。反正最后的效果就是，文字相对bfc固定了，悬浮在图片左上部，和图片相对静止。

## nth-child

这个选择器我开始误会了，以为是用在父元素上来选择子元素。其实是，它跟在什么元素后面，统计的就是什么元素，比如我这里，跟在了这五个盒子的class后面，然后我就能通过odd选中拉姐和然然让她们偏移一点点

## Promise all

不是返回第一个resolve的内部promise，而是返回所有resolve值的数组，之前笔记写错了！

看了笔记，没写错！是我看错了，reject状态才是返回第一个reject的参数！

## 模板字符串

比字符串拼接更适合用来写SQL语句，主要就是数据库的字符串类型要引号，SQL语句里头得转译引号，字符串拼接搞的实在是太乱了又是+又是\的

## Nginx代理路径

location /xxx 的意思是只代理对 /xxx 路径的请求，/xxx/xx 这种后头带着子路径的是代理不到的。

location /xxx/ 的意思才是代理 /xxx 和它的所有子路径

我就说怎么一个子路径上的接口postman告诉我can not get。。。

## 组件设计

这块儿建议参阅开发日志，这里还是不提了，组件设计是需要仔细琢磨的，包括数据流动啥的，一不小心就会搞的代码又臭又长。

## 昨天时间

因为需要查昨天的数据嘛，查了一下怎么知道昨天的日期：

```js
let d = new Date();
d.setTime(d.getTime() - 24*60*60*1000);
// 这时候d就是昨天这个时候的时间了，把年月日扒拉出来就行
```

