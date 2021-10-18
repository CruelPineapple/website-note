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

