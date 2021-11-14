# 手写Promise

抄了一个，原版是这样的。这应该是简单版

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
  console.log('jsliang'); // jsliang
})

```



把that = this都优化掉了：

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

  const resolve = function resolve(value) {
    if (this.status === PENDING) {
      this.status = RESOLVED;
      this.value = value;
      this.resolvedCallbacks.map(cb => cb(value));
    }
  }.bind(this)

  const reject = function reject(reason) {
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
  console.log('结果：', res); 
}).then(() => {
  console.log('then'); 
})
```



