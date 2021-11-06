# Set

ES6新数据结构，类似于数组但是成员值都是唯一的

```js
var s = new Set();

[2, 3, 5, 4, 5, 2, 2].map(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4
```

使用add方法为set结构加入成员，重复值会被忽略。为set构造函数传递一个数组或者类数组（例三）可以初始化一个set：

```js
// 例一
var set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]

// 例二
var items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size // 5

// 例三
function divs () {
  return [...document.querySelectorAll('div')];
}

var set = new Set(divs());
set.size // 56

// 类似于
divs().forEach(div => set.add(div));
set.size // 56
```

上例展示了如何使用set内的东西：使用拓展运算符（数组扁平化那篇有做记录）直接使用的话不是数组：

```js
console.log(set)
// Set(5) { 1, 2, 3, 4, 5 }
```

所以数组去重就是一行：

```js
[...new Set(array)]
```

为set加入值的时候，不会发生类型转换，所以5和“5”是两个不同的值，判断是否相等的逻辑是和map一样的：NaN被map认为是同一个值，引用类型会被认为是不一样的，尽管它们的值可能相同

## 属性和方法

### size

返回set的成员总数

### add（value）

添加一个值，返回set结构本身（因此可以链式添加）

### delete（value）

删除一个值，返回布尔值表示是否成功

### has（value）

返回布尔值，表示是否有此成员

### clear（）

清除所有成员，没有返回值

```js
s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false
```

### keys，values和entries（遍历）

由于set没有key只有value，这两个方法的行为是完全一样的，就返回值的遍历器。而entries返回的遍历器包括key和value，也就是一样的两个东西：

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

set可以用for of遍历（扩展运算符实际上内部使用的就是for of），可以用forEach对每个成员应用操作

数组的map和filter也可以用于set（就像对数组一样对待set，但是会返回set结构）：

```js
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```

### 通过set实现交集并集和差集

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```

## WeakSet

与set类似，但是WeakSet的成员只能是对象，而且都是弱引用，即垃圾回收机制不会考虑WeakSet对其中对象的引用。

WeakSet不能遍历，因为成员都是弱引用的，随时可能消失，遍历机制不能保证成员存在。它的一个用处是储存DOM节点，而不用担心这些节点从文档移除的时候引发内存泄漏

这是另一个用例：

```js
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
```

这个例子中，foos对实例的引用不会计入内存回收机制，删除实例的时候不考虑foos也不会出现内存泄露