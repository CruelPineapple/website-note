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

定义和取得symbol