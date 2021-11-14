# this绑定

调用位置决定了this的绑定。通过调用栈分析调用位置：

```js
function baz(){
  //当前调用栈是baz
  //因此当前调用位置是全局作用域
  bar() //bar的调用位置
}

function bar(){
  //当前调用栈是baz -> bar
  //因此当前调用位置是baz
  foo()
}

function foo(){
  //当前调用栈是baz -> bar -> foo
  //因此当前调用位置是bar
}

baz() // <--baz的调用位置
```

## 绑定规则

### 默认绑定

没有任何规则适用的时候使用默认绑定。主要情况有独立函数调用

```js
function foo(){
  console.log(this.a)
}

var a = 2
foo() // 2
```

foo是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定。需要注意的是，全局对象无法使用默认绑定，在严格模式下，上述代码会打印undefined

### 隐式绑定

```js
function foo(){
  console.log(this.a)
}

var obj = {
  a : 2,
  foo : foo
}
obj.foo() // 2
```

只有最后一层引用链会影响调用位置：

```js
function foo(){
  console.log(this.a)
}
var obj2 = {
  a : 42,
  foo: foo
}
var obj1 = {
  a : 2,
  obj2: obj2
}
obj1.obj2.foo() // 42
```

#### 隐式丢失

丢失了隐式绑定的this值从而使用了默认绑定规则的情况

```js
function foo(){
  console.log(this.a)
}

var obj = {
  a: 2,
  foo: foo
}
var bar = obj.foo
var a = 'oops, global'
bar() // oops, global
```

虽然bar引用了obj.foo，但是实际上它引用的是foo本身（因为这里传递的是foo的引用）。此时bar其实是一个不带修饰的函数调用，应用了默认绑定

```js
function foo(){
  console.log(this.a)
}
function doFoo(fn){
  fn()
}

var obj = {
  a: 2,
  foo: foo
}
var a = 'global'
doFoo(obj.foo) // global
```

参数传递实际上就是一种隐式的赋值，在doFoo内，实际上发生了：

```js
fn = obj.foo
fn()
```

这就和上面的例子类似了，fn实际引用的是foo，fn()也就成了一个不带修饰的引用，应用了默认绑定。这种是更常见的回调函数丢失this绑定，同样也发生在语言内置的函数：

```js
function foo(){
  console.log(this.a)
}

var obj = {
  a: 2,
  foo: foo
}

var a = 'global'
setTimeout(obj.foo, 100) //global
```

同样，在实参赋值给形参的时候丢失了this绑定

### 显式绑定

使用call和apply强制一个函数使用指定的this，部分方法带有的上下文参数同样是这个效果。但是即使用了显示绑定，隐式丢失仍然存在：

```js
function foo(){
  console.log(this.a)
}
function doFoo(fn){
  fn()
}

var obj = {
  a: 2,
  foo: foo
}
var a = 'global'
doFoo.call(obj, obj.foo) // global
```

还是那个原因，就算给doFoo绑定了obj作为上下文，doFoo的形参隐式传值的时候还是把this弄丢了，到了foo这儿就又是默认绑定规则，所以这样绑定是8行的。

给foo进行显示的绑定就好了

```js
function foo(){
    console.log(this.a)
}

function doFoo(fn){
    fn()
}

var obj = {
    a: 2,
    foo: foo
}
var a = 'global'
obj.foo = foo.bind(obj)
doFoo(obj.foo) // 2
```

## new绑定

使用new操作时，会执行如下操作

1. 创建一个全新的对象
2. 对这个对象执行[[原型]]链接（跟现在研究的this没啥关系）
3. 函数的this会被绑定到新对象
4. 如果函数没有返回对象，那就会自动返回这个对象

new是最后一种可以影响函数调用时this指向的行为，称为new绑定

## 优先级

这些绑定规则的优先级如下：

new > 显式 > 隐式

判断规则如下：

1. 函数是否被作为构造函数使用？如果是，那么this绑定的是新创建的对象
2. 函数通过call/apply调用或者进行了硬绑定，那么手动指定的上下文就是this的绑定
3. 函数在上下文对象中调用（隐式绑定）如var bar = obj.foo() 注意这里，是直接调用了obj.foo，而不是把obj.foo赋值给了bar
4. 到了这一步就是默认绑定了，this绑定在全局，如果是严格模式那就undefined了

## 例外

如果在call、apply、bind中传入null或者undefined，实际上就会应用默认绑定而不是一个空的上下文。一般在使用apply传入数组参数或是使用bind生成一个柯里化的函数的时候会给上下文参数传入null：

```js
function add(a, b){
  return a + b
}

add.apply(null, [2, 3]) // 5

var add2 = add.bind(null, 2)
add2(3) //5
```

当然，这个函数没有使用this，所以就算绑定了全局对象也没所谓。不过如果某些函数（尤其是第三方库里面的函数）使用了this，那么很有可能就会把重名的全局对象修改了之类的。

为了让函数安全地使用this，可以创建一个空对象，需要上下文参数占位的时候就把它传进去，这样就不会影响全局对象了。创建一个空对象最好的方法是Object.create(null)它和{}相比不会创建prototype这个委托（委托是什么），所以它比{}更空一点

```js
function add(a, b){
  return a + b
}

var ø = Object.create(null)
add.apply(ø, [2,3]) // 5
var add2 = add.bind(ø, 2)
add2(3) // 5
```

书上建议使用option+o组合键打出的ø符号（表示空集的那个符号）作为空对象

## 软绑定

硬绑定可以把this强制绑定到指定的上下文，但是之后就没办法用隐式或者显式绑定修改了。给默认绑定指定一个全局对象或undefined以外的上下文，就能实现和硬绑定相似的效果，同时保留隐式绑定和显式绑定修改this的能力，这就是软绑定：

```js
if(!Function.prototype.softBind){
  Function.prototype.softBind = function(obj){
    var fn = this
    // 因为是在一个函数上调用这个方法，所以fn（this）就是那个函数
    var curried = [].slice.call(arguments, 1)
    var bound = function(){
      return fn.apply(
        (!this||this===(window||global))?
        obj: this,
        curried.concat([...arguments])
       )
    }
    bound.prototype = Object.create(fn.prototype)
    return bound
  }
}
```

原本书里的代码有点小问题，不仅掉了一个逗号，而且在

curried.concat([...arguments]) 这句使用的是 

curried.concat.apply(curried, arguments) 因为需要合并柯里化的那部分参数和实际调用时传入的参数，而第二次传入的参数arguments不是数组，所以这样迂回了一下（因为apply可以使用类数组作为参数）

不过现在有了扩展运算符，直接把arguments变成数组就行了。

这段代码主要的逻辑就是闭包，返回一个被软绑定的函数，判断这个函数的this是不是undefined或者全局环境 !this||this===(window||global)) 如果是就应该舍弃这个this，转而为fn绑定传入的上下文对象obj

同时softBind还提供了柯里化功能（和原生bind一样），收集softBind时传入的额外参数，并在闭包内将这部分参数和实际调用时传入的参数合并。

如果还有问题，看看[一篇不错的解析](https://segmentfault.com/q/1010000006223479) 👀 

## 箭头函数词法

根据外层函数或者全局作用域来决定this。箭头函数可以像bind一样确保this被绑定到词法环境里，它取代的是es6之前被使用的词法作用域方式：

```js
function foo(){
  var self = this;
  setTimeout(function(){
    console.log(self.a)
  },100)
}
```

确保代码风格一致是十分重要的，在同一个函数或程序中，以下两种编码方式最好只居其一：

1. 只使用词法作用域及箭头函数
2. 尽量避免self = this和箭头函数，转而使用bind

