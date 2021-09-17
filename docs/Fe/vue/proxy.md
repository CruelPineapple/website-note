# Proxy

在vue里面总结proxy...就是因为看的太杂乱了，第一次接触就是vue3与vue2的Object.defineProperty和Proxy区别，然后就看了一下proxy。

## Object.defineProperty

顺便在这里把vue2的总结了：vue2通过defineProperty监听数据更新，给数组和对象的属性设置访问器属性：

```js
var arr = [1,2,3,4]
arr.forEach((item,index)=>{
    Object.defineProperty(arr,index,{
        set:function(val){
            console.log('set')
            item = val
        },
        get:function(val){
            console.log('get')
            return item
        }
    })
})
arr[1]; // get  2
arr[1] = 1; // set  1
```

这样在访问这个属性的时候就会有对应的函数被触发了。然后这里有个小插曲，vue说不能监测通过索引修改数组元素的情况，但是defineProperty实际上是可以监测到数组元素变化的，然后查了一下，这个问题有人[问过](https://segmentfault.com/a/1190000015783546?_ea=4074035)，里面说他试着改了一下源码，发现每当修改数组的一个元素，整个数组就会被遍历两遍（可能是为了实现vue的其他功能吧）。可能是考虑到数组会经常改变而对象改变相对不那么频繁，vue选择不去这样实现，转而提供了但是原因并不是js没法做到。当然，vue3就没这个问题，因为Proxy直接代理了整个对象而不是像vue2那样把属性全遍历一遍然后一个一个拦截。

## Proxy

先来个例子：

```js
const handler = {
  set(target, key, value){
    console.log('set', key);
    target[key] = value;
    return true;
  },
  get(target, key){
    console.log('get', key);
    return target[key];
  }
};
const target = ['a', 'b', 'c'];

const proxy = new Proxy(target, handler);
proxy[0] = 'A'; //set 0
proxy[1]; //get 1
console.log(target); //['A','b','c'];
```

总之就是，指定一个模式去代理一个对象。模式有很多种，get和set是其中最基础的捕捉器，捕捉属性的读取和写入操作，想要设置什么捕捉器，就在handler里面填就行了。捕捉器的参数可能有所不同，建议查阅MDN。

关于代理后对象的使用是这样的：直接用proxy就能获得设置好的代理功能，对proxy进行的一切操作都会发生在target上（比如上面所示，操作了proxy结果target也变了）。target也是可以操作的，不会引起任何代理功能，操作结果也会同步给proxy。

或者也可以这么说：proxy和target根本就是同一个对象（我试了，对上面的proxy使用isArray，是true），只是通过proxy调用的时候，会触发设置好的代理功能，这样就容易理解了。