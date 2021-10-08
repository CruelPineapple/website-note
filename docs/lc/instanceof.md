# instanceof

```js
function newInstanceOf (leftValue, rightValue) {
    if (typeof leftValue !== 'object' || rightValue == null) { 
        return false;
    }
    
    let rightProto = rightValue.prototype;
    leftValue = leftValue.__proto__;
    
    while (true) {
        if (leftValue === null) return false;
        if (leftValue === rightProto) return true;
        leftValue = leftValue.__proto__;
    }
}
```

instanceof的原理就是顺着原型链查找，是否有一个原型是目标对象的原型对象。

顺便搞清楚一下\_proto_：\_proto\_是对象对其原型的引用，跟prototype不一样，prototype是函数的原型对象，放在原型对象里面的东西可以被这个函数new出来的实例共享。看proto的时候正好发现一篇[原型经典误会文章](https://segmentfault.com/a/1190000011801127)，我一开始也愣了一下，然后反应过来，它错误地认为，一个函数可以通过函数名调用到自身原型对象的内容。然而实际上并不是这样，一个函数的原型对象，只能被这个函数创建的实例所共享，因为这些实例的原型（也就是proto）指向了这个函数的原型对象，但是这个函数自己是没法通过函数名调用自身原型对象的内容，因为它的原型引用指向了function，而function的原型指向object，object的原型是null，整个原型链上就没有自己的原型对象，所以会产生错误。