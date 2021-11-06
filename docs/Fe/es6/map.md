# Map

js的对象，本质上是键值对的集合，但是传统上只能用字符串当作键。可以参考这个例子来理解：

```js
var data = {};
var element = document.getElementById('myDiv');

data[element] = 'metadata';
data['[object HTMLDivElement]'] // "metadata"
```

这里直接拿element当作key，就给变成字符串了，如果是在map里面，element就会正确地变成一个key。

简单来说，Object提供“字符串-值”的对应，而map提供“值-值”对应，是一种更完善的Hash结构。

```js
var m = new Map();
var o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

map可以接受一个数组作为构造函数的参数，数组元素是表示键值对的数组：

```js
var map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

实际上上面的代码是这样工作的：

```js
var items = [
  ['name', '张三'],
  ['title', 'Author']
];
var map = new Map();
items.forEach(([key, value]) => map.set(key, value));
```

作为key，字符串true和布尔值true是不一样的。

对同一个key多次赋值，后面的值会覆盖前面的。

读取一个未知key，返回undefined（和Object表现一样）

如果key是一个引用类型，那么实际上使用的是它的地址，所以两个相同的数组作为key，map会认为它们是不一样的：

```js
var map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

注意，NaN不严格相等于NaN，但是map认为两个NaN是同一个key

## 方法

### size

返回成员总数

### set（key，value）

设置key所对应的value，并返回整个map。会返回本身，因此可以采用链式写法：

```js
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
```

### get（key）

读取，找不到会返回undefined

### has（key）

返回一个布尔值，表示key是否存在

### delete（key）

删除key，返回布尔值表示是否删除成功

### clear

删除所有成员，啥都不返回

