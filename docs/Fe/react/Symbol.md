# Symbol

ES6引入一种新的原始数据类型Symbol，表示独一无二的值，最大用法是定义对象的唯一属性名。它没有new命令

```js
let sy = Symbol("KK");
console.log(sy);   // Symbol(KK)
typeof(sy);        // "symbol"
 
// 相同参数 Symbol() 返回的值不相等
let sy1 = Symbol("KK"); 
sy === sy1;       // false
```

用做属性名：

```js
let sy = Symbol("key1");
 
// 写法1
let syObject = {};
syObject[sy] = "kk";
console.log(syObject);    // {Symbol(key1): "kk"}
 
// 写法2
let syObject = {
  [sy]: "kk"
};
console.log(syObject);    // {Symbol(key1): "kk"}
 
// 写法3
let syObject = {};
Object.defineProperty(syObject, sy, {value: "kk"});
console.log(syObject);   // {Symbol(key1): "kk"}

let syObject = {};
syObject[sy] = "kk";
 
syObject[sy];  // "kk"
syObject.sy;   // undefined
```

定义和取得symbol型对象名不能用. 运算符，而是要使用方括号

## for和keyFor

Symbol的两个方法。和 `Symbol()` 不同的是，用 `Symbol.for()` 方法创建的的 symbol 会被放入一个全局 symbol 注册表中。`Symbol.for() 并不是每次都会创建一个新的 symbol`，它会首先检查给定的 key 是否已经在注册表中了。假如是，则会直接返回上次存储的那个。否则，它会再新建一个。

```js
let yellow = Symbol("Yellow");
let yellow1 = Symbol.for("Yellow");
yellow === yellow1;      // false
 
let yellow2 = Symbol.for("Yellow");
yellow1 === yellow2;     // true
```

keyFor检查一个字符串参数是否被for方法登记为该名称的Symbol对象

