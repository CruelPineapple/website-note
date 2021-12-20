# 类型

## typeof安全

typeof在测试未持有值的变量和未声明的变量时都会返回undefined，这是它的安全机制。然而直接试图访问一个不存在的变量会导致Reference Error。

## Array

尝试为数组指定一个非数值的属性，是可以正常访问该属性的，但是数组长度不会改变：

```js
const arr = []
arr['foo'] = 'bar' // arr的length仍然是0
arr['4'] = 5 // length变为5，字符串会被转换为数值
```

## String

字符串是类数组！它虽然可以被当作数组使用，但是它并不是数组

```js
> [...'string']
[ 's', 't', 'r', 'i', 'n', 'g' ]
```

字符串是不可变的，可以对它使用数组的函数式方法，即使字符串并不具有这些方法：

```js
var a = "foo"
a.map // undefined
var b = Array.prototype.map.call(a, (item)=>item.toUpperCase())
b // [ 'F', 'O', 'O' ]
```

但是不能对它使用会修改传入数组的方法例如reverse，所以才会有变通的字符串反转方法split-reverse-join。当然，现在我们知道了字符串是类数组，那么就可以把变通方法简化一下：

```js
var a = "foo"
var reverse = [...a].reverse().join('') // "oof"
```

但是，这种方法不能用于处理多字节字符