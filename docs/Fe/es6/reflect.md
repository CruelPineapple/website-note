# Reflect

proxy在vue的部分总结过，这里主要总结reflect

1. Reflect将Object对象的异性明显属于语言内部的方法（例如Object.defineProperty）放到了Reflect上。现阶段，方法同时在Object和Reflect上部署，未来的新方法将只部署在Reflect上

2. Reflect修改了某些Object方法的返回结果，例如Object.defineProperty在无法定义属性的时候会抛出错误，而Reflect.defineProperty会返回false

3. Reflect让Object操作都变成函数行为。某些Object操作是命令式，例如name in obj和delete obj[name]，而Reflect上有相同功能的函数行为

4. Reflect对象的方法与proxy一一对应，只要是Proxy的方法就能在Reflect上找到对应的方法。就是说，Proxy对象可以调用相应的Reflect方法完成默认行为：

   ```js
   Proxy(target, {
     set: function(target, name, value, receiver) {
       var success = Reflect.set(target,name, value, receiver);
       if (success) {
         log('property ' + name + ' on ' + target + ' set to ' + value);
       }
       return success;
     }
   });
   ```

   上例，Proxy方法拦截了target对象的属性赋值行为，采用Reflect.set方法将值赋给对象的属性，然后再部署额外功能

   Reflect让操作更易读：

   ```js
   // 老写法
   Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1
   
   // 新写法
   Reflect.apply(Math.floor, undefined, [1.75]) // 1
   ```

   

## 使用Proxy实现观察者模式

观察者模式指的是函数自动观察数据对象，一旦对象有变化就自动执行

```js
const person = observable({
  name: '张三',
  age: 20
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
// 输出
// 李四, 20
```

observe和observable就是需要实现的一套方法，在person发生变化的时候执行print

```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
```

用一个set保存observe传入的需要执行的方法。observable代理了set方法，返回原始set并执行set中所有需要执行的方法。

