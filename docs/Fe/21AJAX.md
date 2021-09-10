# AJAX

总结一下原生XMLHttpRequest对象，首先创建一个这个对象，然后监听readystatechange事件，发生变化的时候检查readyState值，为4表示收到所有响应数据。继续检查status是否为200，根据结果进行操作。接下来调用对象的open方法启动请求，传入请求类型，URL，同步选项，最后使用send方法发送内容（没有内容参数就是null）

## HTTP头部

头部有这些东西：浏览器能够处理的内容，压缩编码，语言，字符集，连接类型，Cookie，发出请求的页面的URL，用户代理字符串。setRequestHeader可以设置自定义头部信息，传入头部字段的名称和值即可，需要在open方法后，send方法前调用。Content-Type是在头部里面的，同样使用上述方法添加。

提一嘴，post用于表单提交的contenttype是application/x-www-form-urlencoded，不是什么form-data，然后再弄清楚FormData对象：

## FormData

用于创建序列化的表单，创建FormData对象后，使用append方法向其中添加键值对，也可以直接用构造函数传入表单元素（html元素）。使用FormData的方便之处在于不需要明确指定头部，XHR对象能够识别到传入的数据类型是FormData实例，自己就会配置头部。文件上传一般就是FormData

## 进度事件

摆了

后面都摆了，今晚看不动

来了，稍微记两笔

### Comet

服务器推送，有两种实现方式

1.浏览器定时向服务器请求，看看有没有更新的数据

2.页面发起一个请求，然后服务器保持连接打开直到需要更新数据，发送完成后，浏览器关闭连接，然后再发起一个请求等下一次更新数据

方法2中，前端需要关注readyState值为3的时刻，每当值变为3，说明responseText中新增了数据，这时候通过比较此前接收到的数据决定从什么位置开始取得新数据：

```js
function createStreamingClient(url, progress, finished){
  var xhr = new XMLHttpRequest(),
      received = 0;
  
  xhr.open("get", url, true);
  xhr.onreadystatechange = function(){
    var result;
    if(xhr.readyState ==3){
      // 取得最新内容
      result = xhr.responseText.substring(received);
      received += result.length;
      
      // 调用progress回调函数，处理目前接收到的数据
      progress(result);
    }else if(xhr.readyState == 4){
      // 完全传输完调用结束回调
      finished(xhr.responseText);
    }
  };
  xhr.send(null);
  return xhr;
}

var client = createStreamingClient("streaming.php",function(data){
  console.log("received:"+data);
}, function(data){
  alert("done");
});
```

围绕Comet出现了SSE API

## WebSockets

摆烂，有空再看