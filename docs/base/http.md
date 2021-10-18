# HTTP

基于TCP的协议，无状态的（请求之间没有关系）1.1及以前的HTTP报文都是可读的，HTTP2将报文内容嵌入二进制分帧，帮助头部压缩和复用等，不过客户端会重组二进制帧，因此看起来是一样的。

HTTP请求报文像这样

```
GET /asd/?vmid=672342685 HTTP/1.1
Host: sakurajimama1.ltd
Proxy-Connection: keep-alive
Accept: application/json, text/plain, */*
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36
Referer: http://sakurajimama1.ltd/asouldigits/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7
If-None-Match: W/"14-h5JqNPPusBBiwamERpUFheOmByM"
```

第一行是方法，路径和协议版本，下面就是头部，GET是没有请求体的

响应报文像这样

```
HTTP/1.1 200 OK
Content-Length: 20
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Wed, 13 Oct 2021 12:09:41 GMT
Etag: W/"14-aKoSYNdjPgyO65RMB9etOxIY/5M"
Keep-Alive: timeout=4
Proxy-Connection: keep-alive
Server: nginx/1.18.0
X-Powered-By: Express
```

第一行是协议，状态码和状态信息，下面是头部

## HTTP1.1

引入更多缓存控制策略，例如上面的If-None-Match就是HTTP1.1引入的。

优化了带宽使用，在1.0中，可能值请求了一个对象的某个部分，但是服务器把整个对象送过来了（不懂为什么会发生这种情况）。1.1引入range头部，允许只请求资源的某个部分，返回码是206

增加了24个错误响应状态码

能够处理Host头部，1.0认为每台服务器都有一个唯一的IP地址，因此没有传递主机名，但是随着虚拟主机的发展，一台物理服务器上可能存在多个虚拟主机，因此需要Host头部用于识别

支持长连接和流水线，一个HTTP连接不会立刻关闭，能够进行多次请求和相应，多个请求可以连续发送（流水线发送）

## SPDY

谷歌提出的基于TCP的应用层协议，旨在通过压缩，多路复用和优先级来缩短网页的家在时间。SPDY意思是speedy，快！

SPDY在HTTP之下，TCP和SSL之上。

HTTP的不足有：单路连接，请求低效，只允许客户端主动发起请求，头部冗余（会反复发送）

### SPDY优点

多路复用，请求优化：一个SPDY连接内可以有无限个并行的请求，即允许多个并发HTTP请求共用一个TCP会话。另外还可以设置多路复用的优先级，而不是传统HTTP那样按照先入先出一个一个处理请求，它会选择性地先传输CSS这样的重要资源，然后传送图标等不太重要的资源

服务器推送：服务器可以主动向客户端推送数据，例如在客户端请求CSS文件的时候就主动把该页面对应的js推送给客户端，就不需要客户端再请求了。

压缩HTTP头部：舍弃不必要的头部信息

强制使用SSL：更安全

## HTTP2

可以说是SPDY的升级版，区别在：

HTTP2支持HTTP，而SPDY强制使用HTTPS

HTTP2头部采用HPACK压缩，而SPDY采用的DEFLATE

HPACK是一个表，为头部名设置索引，并使用索引值指代某些非常常见的头部值

DEFLATE同时使用LZ77（一种字典编码）和哈夫曼编码，是一种无损压缩算法

HTTP2使用了二进制格式（二进制分帧），相比HTTP1.x新增多路复用（每个请求可以随机混杂在一起，通过id分类到不同的请求），头部压缩，服务端推送（和SPDY一样的）

### HTTP2的多路复用和1.x的长连接复用区别

长连接是串行处理，某个任务耗时严重会影响后续任务。多路复用是并行，互不影响

关于流水线（管道化），它要求按序发送和返回，因为HTTP报文没有序号。另外流水线可能导致队头阻塞，因此流水线一般是默认关闭的。

HTTP2不使用流水线方式，而是使用帧，每个帧分配序号，可以乱序发送后组装。不过基于TCP的HTTP2仍然可能出现TCP的队头阻塞

### TCP队头阻塞（新的性能瓶颈）

因为一个分组丢失，后续分组无法按序到达接收端的时候，后续分组将被缓存直到丢失分组被重传并接收成功，这时候TCP才会将组装好的报文递交上层协议。这个问题是TCP自身机制决定的，HTTP2的多路复用无法解决，除非HTTP2使用其他底层协议。

## HTTPS

对称加密速度快，但是密钥容易泄露，非对称加密更安全，但是加解密速度较慢

HTTPS混合使用对称加密和非对称加密，在明文传输的基础上加密信息，同时保证了性能

HTTPS协议需要CA证书，证书是非对称加密的一部分，包含公钥和私钥。私钥保存在服务器，公钥包含在证书里，在响应HTTPS请求的时候发送给客户端，证书还包含电子签名（防止篡改证书）以及有效时间等信息。

客户端会验证证书的颁布机构等信息，如果证书有问题会对用户发出警告。

如果没有问题，客户端就会使用证书内的公钥加密一个随机码，将其发送给服务端，服务端使用私钥解密这个随机码。

此后的数据传输，双方都使用上述随机码作为对称加密的密钥进行加解密。