# let

众所周知，let可以绑定一个代码块形成块级作用域

把let用在for循环的迭代变量上会出现很有意思的情况：

```js
for(let i = 0; i < 5; i++){
    setTimeout(()=>console.log(i), i*1000)
}
```

它会输出01234而不是五个5

如果是var声明的i，由于setTimeout被送进了任务队列，等到它执行回调的时候i已经是5了。但是使用闭包留住每次的i值再传给setTimeout就会得到正确的结果，因为正确的i分别留在了五个闭包的活动对象里面。

但是let的情况就不太一样

简单来说，使用let的for循环应该会在每次循环中创建一个单独的作用域然后把本次的i传进这个作用域里面。

一个事实：for后面紧跟的（）中的作用域和循环体花括号包围的代码属于两个作用域：

```js
for (let i = 0 /* 作用域a */; i < 3; console.log("in for expression", i), i++) {
    let i; //这里没有报错，就意味着这里跟作用域a不同，换做k可能更好理解
    console.log("in for block", i);
}

// 运行结果如下
in for block undefined
in for expression 0
in for block undefined
in for expression 1
in for block undefined
in for expression 2
```

因此推测实际上循环体内使用的i是每次循环中单独传入循环体的

[怎么理解for循环中用let声明的迭代变量每次是新的变量？](https://segmentfault.com/q/1010000007541743)