# this
在闭包中使用this也可能导致一些问题。this是在运行时基于函数执行环境绑定的：全局函数中，this等于window，而当函数被作为某个方法调用当时候，this等于那个对象。不过，匿名函数的执行环境具有全局性，它的this通常指向window，但是由于有些时候编写闭包当方式不同，这一点可能不会那么明显。一个例子：
```
var name = "The Window";

var object = {
    name : "My Object",

    getNameFunc: function(){
        return function(){
            return this.name;
        };
    }
};

alert(object.getNameFunc()());  // The Window 

//上述代码相当于下面的实现：

var name = "The Window";
function getThisName(){
    return this.name
}
var object = {
    name: "My Object",
    getNameFunc: function() {
        return getThisName
    }
};
var getThisNameFunc = object.getNameFunc()
console.log(getThisNameFunc()); 

//getThisName这个被抽离出来的命名函数就相当于之前的匿名函数，它和object的定义没有任何关系，只是 object.getNameFunc 这个函数将这个函数作为返回值。如果是返回的其他标量，自然也不会发生关系。
```
上述代码拥有一个全局变量name和一个包含name属性的对象，这个对象还有一个方法，返回一个返回this.name的匿名函数。由于getNameFunc返回一个函数，因此调用object.getNameFunc()()就会立即调用这个被返回的函数，结果就是返回一个字符串。然而，它返回了全局的name值，这是为什么呢？之前提到过，匿名函数的执行环境具有全局性，它在搜索变量的时候，只会搜索到它的活动对象，因此外部的name值会被先找到。
观察第二种实现并进行理解，匿名函数的this就是全局的this。
把外部作用域的this值保存在一个闭包能访问到的变量里，就可以让闭包访问到该对象了：
```
var name = "The Window";

var object = {
    name : "My Object",

    getNameFunc: function(){
        var that = this;
        return function(){
            return that.name;
        };
    }
};

alert(object.getNameFunc()());  // My Object

```
that是闭包可以访问到的变量，即使函数返回了，that仍然引用object，方法总能返回object的name。
这时候能够感受到js的动态之处，静态语言的this大多在写下代码的地方就已经确定了，而js的this是在方法执行时才获取。
特殊情况下，this的值会出现不同，例如下面的修改代码：
```
var name = "The Window";

var object = {
    name : "My Object",

    getNameFunc: function(){
        return this.name;
    }
};
```
这里的方法简单地返回this.name。以下是几种调用方法及结果
```
object.getName();  //My Object
(object.getName)();  //My Object
(object.getName = object.getName)();  //The Window
```
第三行先执行了一个赋值语句，再调用赋值之后的结果，this的值不能得到维持，返回了The Window（不是特别理解，找了一篇[文章](https://segmentfault.com/a/1190000011490347)）