# undefined和null

## 相似

都会在做判断条件时被认为是false，同时==会认为它们是相等的

## 不同

```js
Number(null) === 0
Number(undefined) === NaN
 null + 1 === 1
undefined + 1 === NaN
typeof null === 'object'
typeof undefined === 'undefined'
Object.ptototype.toString.call(null) === '[object null]'
Object.ptototype.toString.call(undefined) === '[object Undefined]'
```

## 总之

null表示一个设定的空值，undefined表示一个原始的空值

继续解读就是，null表示此处不该有这个值，但是undefined表示此处本来该有一个值但是还没有定义