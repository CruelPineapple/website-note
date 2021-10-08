# 实现Promise.all

## Promise.all做了什么

接收一个数组，执行数组里面的每个promise（如果不是promise就转换一下），把resolve出来的值存在数组里面作为整体的resolve，第一个reject的返回值会被reject返回。整体resolve返回的数组顺序是按promise数组传入顺序来的，不过内部它们并不一定按顺序执行。

## 手动实现就照抄一遍

```js
function promiseAll(promises){
  return new Promise(function(resolve, reject){
    if (!isArray(promises)){
      return reject(new TypeError('arguments must be an array'))
    }
    let resolvedNum = 0
    let promiseNum = promises.length
    let resolvedValues = new Array(promiseNum)
    for(let i = 0; i < promiseNum; i++){
			(function(i){
        Promise.resolve(promises[i]).then((res)=>{
        resolvedNum++
        resolvedValues[i] = res
        if(resolvedNum === promiseNum){
          	return resolve(resolvedValues)
        	}
      	},(e)=>{
        return reject(e)
      	})
      })(i)
    }
  })
}
```

Promise.resolve的功能就是包装一个东西，不管它是不是promise，如果是就执行它，不是就变成一个resolve原来的值的promise，反正promise.resolve之后，就能部署处理resolve值的函数了