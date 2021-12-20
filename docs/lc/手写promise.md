# 手写promise

因为不熟练class所以开始只会用function的形式来实现。这是自动转换为class的形式，另外把bind改成了箭头函数（现在偏爱箭头函数）

```js
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

class myPromise {
    constructor(fn) {

        this.status = PENDING
        this.value = null
        this.reason = null

        this.resolvedCallbacks = []
        this.rejectedCallbacks = []

        const resolve = value => {
            if (this.status === PENDING) {
                this.status = RESOLVED
                this.value = value
                this.resolvedCallbacks.map(cb => cb(value))
            }
        }

        const reject = reason => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                this.rejectedCallbacks.map(cb => cb(reason))
            }
        }

        try {
            fn(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    
    then(onFullfilled, onRejected) {

        if (this.status === PENDING) {
            this.resolvedCallbacks.push(onFullfilled)
            this.rejectedCallbacks.push(onRejected)
        }

        if (this.status === RESOLVED) {
            onFullfilled(this.value)
        }

        if (this.status === REJECTED) {
            onRejected(this.reason)
        }

        return this
    }
}
```

