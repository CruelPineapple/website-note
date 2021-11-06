# Promise

理解为一个容器，保存着未来才会结束的事件。Promise对象代表一个异步操作，有三种状态：pending（进行中），fulfilled（已成功），rejected（已失败）。这个状态只能由异步操作的结果决定，并且状态一旦改变，那就不会再变了，任何时候都能得到这个结果。只有两种变化可能：pending变为fulfilled和pending变为rejected，发生变化后，状态就固定了，称为resolved（已定型）。

Promise也有一些缺点：它无法取消，一旦新建就会立刻执行，其次，如果不设置回调函数，Promise内部抛出的错误不会反应到外部

## 用法

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

promise构造函数接收一个函数作为参数，这个函数的两个参数resolve和reject都是js引擎提供的，resolve的作用是将promise对象的状态从未完成变为成功，并将异步操作的结果作为参数传递出去，而reject是从未完成变为失败，同时把错误信息作为参数传递出去。

promise实例生成后，可以通过then方法指定resolve和reject状态的回调函数：

```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```

---

Promise 新建后会立即执行！

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

Promise首先输出，因为promise新建之后立即执行了，然后执行了hi，因为then方法指定的回调函数会在当前脚本所有同步任务执行完之后执行，所以resolve最后执行。

## catch

在catch中单独指定处理reject状态的回调函数，和在then中指定是基本相同的，但是它好在可以把then中的错误一起给捕获了。

promise对象的错误具有冒泡性质，会一直向后传递知道被catch

```js
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

上面有三个promise对象，一个由getJSON产生，两个由then产生。它们之中任何一个抛出错误都会被catch捕获。

## finally

与状态无关的，最后执行的回调

## Promise.all

将多个promise实例包装成一个新的promise实例，内部所有成员fulfilled，外部实例的状态才会变为fulfilled，此时外部实例的回调参数会接收到一个数组，里面是内部的resolved值。只要内部有一个reject，外部实例就是reject状态，此时第一个reject的内部成员的返回值会传给外部实例的回调。

## Promise.race

同样是将多个promise包装成一个新的promise，但是和all不同，race只响应第一个发生状态变化的内部实例，将其的返回值传给外部实例的回调。

## Promise.allSettled

用于希望一组异步操作无论成功或是失败都完成之后再进行下一步。promise all只能用于所有异步操作都成功的情况。这是ES2020引入的。这个方法接收一个成员都为promise实例的数组作为参数，而且包装出来的promise对象，状态只会变为fulfilled。

## Promise.any

ES2021引入，只要有一个内部实例funfilled，包装实例就会fulfilled，所有内部实例rejected，包装实例才会rejected

## Promise.resolve

把现有对象转换为promise对象，它这样工作：

1. 参数是一个Promise实例：resolve不做任何更改

2. 参数是具有then方法的对象：转换为promise对象，然后执行then方法

3. 参数是没有then方法的对象，或者不是对象：返回一个resolved的promise实例（也就是说它的回调会立刻执行）

4. 没有参数：返回一个resolved的promise对象

   

## Promise.reject

返回一个状态为reject的promise对象

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```



## 生成器与promise结合

使用生成器管理流程，遇到异步操作的时候，通常返回一个promise对象。

寄了，看不懂

```js
function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

const g = function* () {
  try {
    const foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  const it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);
```

