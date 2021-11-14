# instanceof

```js
function newInstanceOf (leftValue, rightValue) {
    if (typeof leftValue !== 'object' || rightValue == null) { 
        return false;
    }
    
    let rightProto = rightValue.prototype;
    let leftValue = Object.getPrototypeOf(leftValue);
    
    while (true) {
        if (leftValue === null) return false;
        if (leftValue === rightProto) return true;
        leftValue = Object.getPrototypeOf(leftValue);
    }
}
```

instanceof的原理就是顺着原型链查找，是否有一个原型是目标对象的原型对象。

由于\_proto_已经不再使用了，应该改为使用getPrototypeOf，另外，印象中函数应该避免修改自己的参数，也做了修改

顺便搞清楚一下\_proto_：\_proto\_是对象对其原型的引用，跟prototype不一样，prototype是函数的原型对象，放在原型对象里面的东西可以被这个函数new出来的实例共享。看proto的时候正好发现一篇[原型经典误会文章](https://segmentfault.com/a/1190000011801127)，我一开始也愣了一下，然后反应过来，它错误地认为，一个函数可以通过函数名调用到自身原型对象的内容。然而实际上并不是这样，一个函数的原型对象，只能被这个函数创建的实例所共享，因为这些实例的原型（也就是proto）指向了这个函数的原型对象，但是这个函数自己是没法通过函数名调用自身原型对象的内容，因为它的原型引用指向了function，而function的原型指向object，object的原型是null，整个原型链上就没有自己的原型对象，所以会产生错误。

## 函数的原型链

首先明确一点：所有对象（除了null）都有\_proto\_属性，这个属性指向该对象的原型，而所有函数都有一个prototype属性，它引用着一个原型对象，在这个函数被作为构造函数使用的时候，产生的实例对象的\_proto\_属性指向构造函数的prototype所引用的原型对象。这时候实例对象就继承了构造函数的原型对象里面的属性。

理解了上面这一通话，就很容易理解，所有函数的原型都是Function的原型对象，即：

```js
函数.__proto__ === Function.prototype
// 特别的，有：
Function.__proto__ === Function.prototype
// 因为Function也是一个函数（其他函数的构造函数）

// 构造函数生成的实例，其原型属性指向构造函数的原型对象：
实例对象.__proto__ === 构造函数.prototype

Object.__proto__ === Function.prototype
// Object是构造函数

Object.prototype.__proto__ === null
// 原型链的终点，实例的__proto__一层一层指向原型，直到最初创建的对象，它的__proto__指向Object.prototype，再继续访问__proto__就是null了
```

Object.prototype，是所有对象实例最终的原型对象，是原型链的尽头。它是引擎创建的

Function.prototype，所有函数的原型对象，它也是引擎创建的