# String类型
## 转义
\n 换行  
\t tab缩进  
\b 退格  
\ \ 斜杠  
\ ' 单引号  
\ " 双引号
## 字符串不可变
一旦创建一个字符串，它就不能变了。一切变化都会销毁原来的字符串
## toString()
数值，布尔值，对象和字符串都有此方法（字符串调用此方法会返回自己的一个副本）  
null和undefined没有此方法  
可以指定基数，转换为该进制表示数值的字符串  
如果不知道要转换的内容是不是null或undefined，可以使用String()，对此两者将返回“null”和“undefined”，如果该内容具有toString方法，则返回其值。

## 方法

可以在字符串上直接使用方法，例如：

```js
"hello".charAt(0); // "h"
"hello, world".replace("world", "mars"); // "hello, mars"
"hello".toUpperCase(); // "HELLO"
```

