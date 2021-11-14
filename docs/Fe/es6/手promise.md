# 手写Promise

抄了一个应该是简单版实现的，原版用的是词法作用域this，不太喜欢，就把that = this都换掉了：

```js
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function myPromise(fn) {

  this.status = PENDING;
  this.value = null;
  this.reason = null;

  this.resolvedCallbacks = [];
  this.rejectedCallbacks = [];

  const resolve = function(value) {
    if (this.status === PENDING) {
      this.status = RESOLVED;
      this.value = value;
      this.resolvedCallbacks.map(cb => cb(value));
    }
  }.bind(this)

  const reject = function(reason) {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      this.rejectedCallbacks.map(cb => cb(reason));
    }
  }.bind(this)

  try {
    fn(resolve, reject);
  } catch(e) {
    reject(e);
  }
}

myPromise.prototype.then = function(onFullfilled, onRejected) {
  
  if (this.status === PENDING) {
    this.resolvedCallbacks.push(onFullfilled);
    this.rejectedCallbacks.push(onRejected);
  }

  if (this.status === RESOLVED) {
    onFullfilled(this.value);
  }

  if (this.status === REJECTED) {
    onRejected(this.reason);
  }

  return this;
}

const p = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1000);
  }, 1000);
});

p.then((res) => {
  console.log('结果：', res); 
}).then(() => {
  console.log('then'); 
})
```

## 怎么写

可以算是帮助理解了promise的工作过程。首先刚创建的promise是pending状态，设置value和reason对应传给resolve和reject的参数，设定resolve和reject两种状态的回调函数列表。这就是构造的时候需要干的事儿。

接下来实现resolve和reject方法，它们需要确保状态是pending才能运行，将状态改为对应的fulfilled状态，同时将promise的value或reason设置为需要传出的值。最后把回调列表里的函数都运行一遍，这时候把value或reason作为参数传进回调。

最后就是运行fn（fn是被promise包装的函数）并捕捉错误，错误信息使用reject吐出去

然后在原型上实现then方法，then方法是指定funfilled状态回调的，所以如果此时是pending状态，就要把指定的方法放进回调列表里头，而如果状态已经fulfill，那就直接用指定的回调把值（value或者reason）吐出去就行了。最后返回自身，这是链式调用的原理。

## 过程

然后梳理一下运行过程，首先新建了一个promise对象，传入了一个函数：

```js
const p = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1000);
  }, 1000);
});
```

这个被传进去的函数会在promise内部被运行，两个参数会分别被传入内部实现的resolve和reject方法。

接下来调用这个promise对象的then方法，设置resolve后将结果打印出来，再然后打印一个then，它们俩依次进入了resolved状态的回调列表：

```js
p.then((res) => {
  console.log('结果：', res); 
}).then(() => {
  console.log('then'); 
})
```

在一秒后，promise对象resolve了1000这个值，内部的value被设置为1000，状态变为resolved，然后调用resolved回调列表里的两个函数，这两个函数会收到value作为参数。

---

原版是这样的（就this变了下）

```js
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function myPromise(fn) {
  const that = this;
  that.status = PENDING;
  that.value = null;
  that.reason = null;

  that.resolvedCallbacks = [];
  that.rejectedCallbacks = [];

  function resolve(value) {
    if (that.status === PENDING) {
      that.status = RESOLVED;
      that.value = value;
      that.resolvedCallbacks.map(cb => cb(value));
    }
  }

  function reject(reason) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.reason = reason;
      that.rejectedCallbacks.map(cb => cb(reason));
    }
  }

  try {
    fn(resolve, reject);
  } catch(e) {
    reject(e);
  }
}

myPromise.prototype.then = function(onFullfilled, onRejected) {
  
  if (this.status === PENDING) {
    this.resolvedCallbacks.push(onFullfilled);
    this.rejectedCallbacks.push(onRejected);
  }

  if (this.status === RESOLVED) {
    onFullfilled(this.value);
  }

  if (this.status === RESOLVED) {
    onFullfilled(this.reason);
  }

  return this;
}

const p = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1000);
  }, 1000);
});

p.then((res) => {
  console.log('结果：', res); // 结果：1000
}).then(() => {
  console.log('then'); 
})

```
