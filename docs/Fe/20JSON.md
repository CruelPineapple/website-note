# JSON

JSON没有undefined，对象中的属性名需要使用引号，且没有末尾的分号。

早期，使用eval解析json对象，因为它是js的语法子集（但是比较危险）

后来，使用stringify和parse将json对象和json字符串（传输时使用）互相转换

stringify还能接收参数：

```js
var book = {
  "title": "Professional JS",
  "authors": [
    "Nicholas"
  ],
  "edition": 3,
  "year": 2011
};

var text = JSON.stringify(book, ["title", "edition"]);
```

这样就能让序列化出来的字符串中只包含指定的属性。第二个参数还能用函数，这个函数接收两个参数，属性名和属性值，可以更详细地过滤并做出修改：

```js
var book = {
  "title": "Professional JS",
  "authors": [
    "Nicholas",
    "Someone"
  ],
  "edition": 3,
  "year": 2011
};

var text = JSON.stringify(book, function(key, value){
  switch(key){
    case "authors":
      return value.join(",")
    case "year":
      return 5000;
    case "edition":
      return undefined;
    default:
      return value;
  }
});
```

这时候，根据函数所示，作者数组会被逗号分开变成字符串，年份会被变成5000，edition返回undefined表示将删除这个属性，其他的保持不变。

stringily的第三个参数用于控制结果中的缩进，缩进的同时会换行，最大有效值为10，大于10的值会被当作10

类似的，parse方法也接收过滤函数