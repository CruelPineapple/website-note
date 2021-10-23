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

虽然bar引用了obj.foo，但是实际上它引用的是foo本身。此时bar其实是一个不带修饰的函数调用，应用了默认绑定

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

参数传递实际上就是一种隐式的赋值，和上面的例子类似的。这种是更常见的回调函数丢失this绑定

### 显式绑定

使用call和apply强制一个函数使用指定的this，部分方法带有的上下文参数同样是这个效果

