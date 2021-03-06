# HTTP方法

## GET方法

语义是从url请求资源，一般使用url参数，所以参数也只能进行url编码，必须是ASCII字符，同时长度也有限制。另外，Get请求的内容是可以被历史记录和浏览器书签保存的，且会被浏览器缓存（HTTP缓存）

## POST方法

语义是将数据发送到服务器来创建资源。post参数在请求体中，它不会被缓存，也不会被留在历史记录中，也没有参数长度和编码限制

### 和get区别

get和post的一些比较基础的区别是在用法上：

get使用url参数而post请求内容在请求体内

get只能进行url编码（application/x-www-form-urlencoded），post能进行多种编码（application/x-www-form-urlencoded 或 multipart/form-data）

get参数只支持ASCII字符，限制长度（最大2048），post参数没有限制

get与post相比安全性更差，因为数据是url的一部分

但是说是get没有请求体，那也只是规定，实际上可以给get增加请求体，也能让post使用url参数，这都不是绝对的，只是一般大家不会这么干。

看到一篇文章说post会发送两个tcp数据包而get只发送一个，感觉很奇怪，查了一下发现有人也对这篇文章感到疑惑，貌似是关于语言框架的问题，故意分成两个包发的，而且是请求头和请求体分开发，没有超过tcp的包大小限制。

所以没有post一定要分成两个tcp包的说法，大多数http框架都会尽量用一个tcp包发完。

## PUT

语义是将数据发送到服务器更新已有资源，与POST相比，PUT是幂等方法，多次相同的PUT会产生相同的结果，但是POST会创建多个一样的资源

## HEAD

与GET相同，但是没有返回的响应主体，例如GET会请求到一个用户列表，那么HEAD就会发出同样的请求但是不会返回用户列表。用于实际发送GET请求之前检查GET请求将要返回的内容（例如下载大文件或者较大的响应正文的场景）

## DELETE

语义是删除url所指示的资源

## OPTION

另一个类似的情况是跨域处理中的OPTION请求，会先进行预请求