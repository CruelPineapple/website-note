# bind，new和类数组转换

## bind

用来理解bind的实现

最新优化，十分简洁：

```js
Function.prototype.myBind = function(thisArg, ...args){
	return () => this.apply(thisArg, args)
}
```

以前的：

```js
Function.prototype.myBind = function(){
  const args = Array.prototype.slice.call(arguments)
  const thisRef = args.shift()
  const self = this
  return function(){
    return self.apply(thisRef, args)
  }
}
```

首先将参数转为数组（后面总结类数组转为数组），然后取得参数第一项作为指定的this引用，最后取得调用myBind的this引用传入返回的函数，调用apply

个人认为可以用扩展运算符实现参数数组化， ~~不一定对~~ 应该是对的：

```js
function.prototype.myBind = function(){
  const args = [...arguments]
  const thisRef = args.shift()
  const self = this
  return function(){
    return self.apply(thisRef, args)
  }
}
```



## new

```js
function myNew(obj, ...args){
  const newObj = Object.create(object.prototype)
  const result = obj.apply(newObj, args)
  return (typeof result ==='object' && result !== null)? result:newObj
}
```

首先需要搞清楚new做了什么，[参考](https://juejin.cn/post/6844903937405878280)。简单来说，就是：

创建一个新对象

继承父类原型上的方法

添加属性到对象上

如果执行结果返回了对象，那么返回执行结果，否则返回创建的对象

上面的代码就是这么干的，基于obj的原型创建一个新对象，把属性添加到新对象，同时获取obj的执行结果，如果obj有返回而且是个对象，那就把返回值作为结果返回，否则返回新建的对象。

