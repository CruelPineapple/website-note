# Scheduler

浏览器无法同时响应JS任务和UI操作任务，如果一个同步任务占用时间很长，就会导致掉帧和卡顿。因此需要把一个耗时的任务及时中断掉，把主线程归还给浏览器去执行更重要的任务（比如用户交互），后续再执行该耗时任务。React采用时间分片的策略，将任务细分为不同优先级，利用浏览器空闲的时间进行任务执行以确保UI操作是流畅的。

scheduler对于单个任务进行节制地执行，多个任务按优先级执行。多个任务会区分未过期任务和已过期任务，已经过期的任务就送进taskQueue，未过期则是timerQueue

进入队列的任务会进行排列（目前优先队列使用小顶堆实现，老版本是循环链表），timerQueue根据任务开始时间排序，开始的早就需要早点执行，taskQueue根据过期时间排序，过期时间小说明过期的早，需要排在前面执行

在归还主线程给浏览器时，react使用了[messageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)来产生一个宏任务，从而让任务在下一个循环中再继续执行。[为什么使用messageChannel 产生宏任务而不是setTimeout或者rAF](https://juejin.cn/post/6953804914715803678)

和scheduler交互主要流程如下：

1. react组件状态更新，向scheduler提交一个任务要求执行更新方法（例如虚拟dom更新等）
2. scheduler调度该任务，执行更新方法
3. react在调和阶段（UI更新的过程）更新了一个fiber之后，会询问scheduleer是否需要暂停，如果不需要才会继续更新下一个fiber
4. 如果要暂停，react就会给scheduler返回一个函数，用于告知scheduler任务还没完成，让它在未来继续调度

第一步中，scheduler需要暴露pushTask方法，让react存入任务

第二步中，scheduler需要暴露scheduleTask方法，用于调度任务

第三步中，scheduler需要暴露shouldYield方法，react通过该方法决定是否需要暂停执行

第四步中，scheduler判断返回值是否为函数，如果是则说明任务未完成，将来还需要调度

## 基础时间分片

浏览器的调度API有两个，高优先级的requestAnimationFrame和低优先级的requestIdleCallback。不过现在react已经不用rAF了

### requestAnimationFrame

这个函数在浏览器绘制每一帧的开始的时候执行，接收一个参数为[DOMHighResTimeStamp](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)的回调函数作为参数，返回一个供calcelAnimationFrame方法取消的id

可以使用这个Api实现一个简单的时间分片调度：

```js
// create 1000 tasks 
const tasks = Array.from({ length: 1000 }, () => () => { console.log('task run'); })
//创建了一个长度1000点array，每个成员是一个任务，任务就是打印task run

const doTasks = (fromIndex = 0) => {
	const start = Date.now();
	let i = fromIndex;
	let end;
	
	do {
		tasks[i++](); // do task
		end = Date.now();
	} while(i < tasks.length && end - start < 2); // Do tasks in 2ms
	// 原本的代码是一帧执行20ms，但是我寻思60hz的一帧也就16.7ms，就改成了2ms
  // 反正意思是一样的，这样我理解起来更方便，就是一帧里面抽空执行了2ms
	console.log('tasks remain: ', 1000 - i);
	// if remaining tasks exsis when timeout. Run at next frame
  // 活没干完，在下一次rAF的时候再干
	if (i < tasks.length) {
		requestAnimationFrame(doTasks.bind(null, i));
	}
}

// start tasks scheduler
requestAnimationFrame(doTasks.bind(null, 0))
// 输出，xx task run这个数字是console里面自动折叠的那个数字，就是表示连续输出了多少个
33 task run
 tasks remain:  967
55 task run
 tasks remain:  912
49 task run
 tasks remain:  863
52 task run
 tasks remain:  811
48 task run
 tasks remain:  763
42 task run
 tasks remain:  721
40 task run
 tasks remain:  681
42 task run
 tasks remain:  639
70 task run
 tasks remain:  569
51 task run
 tasks remain:  518
46 task run
 tasks remain:  472
51 task run
 tasks remain:  421
60 task run
 tasks remain:  361
46 task run
 tasks remain:  315
65 task run
 tasks remain:  250
75 task run
 tasks remain:  175
49 task run
 tasks remain:  126
70 task run
 tasks remain:  56
56 task run
 tasks remain:  0
```

原文说的是“每帧留出20ms执行js任务”但我觉得，每秒60帧的话，一帧就16.7ms，所以感觉不太对，就改成了每次执行2ms的任务，下面也顺着2ms来

然后，这里是2ms全都用来执行任务了，如果一个任务在2ms之内就干完了，多出来的时间怎么办呢，就引入了requestIdleCallback

### requestIdleCallback

优先级比rAF要低，仅当浏览器空闲才会执行的任务调度。接收两个参数，第一个是接受[IdleDeadline](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/zh-CN/docs/Web/API/IdleDeadline)（一个内置属性，用于得知预估的当前闲置周期剩余时间）参数的回调，第二个参数是一个可选的options，包括一个timeout设置项，可以指定回调超时的时间以防它饿死（到达timeout值却还未执行的回调将直接进入事件循环中排队，但是就不保证执行顺序了而且可能影响性能）

使用requestIdleCallback的调度是这样的

```js
const tasks = Array.from({ length: 1000 }, () => () => { console.log('task run'); })
const doTasks = (fromIndex = 0, idleDeadline) => {
	let i = fromIndex;
	let end;
	
	console.log('time remains: ', idleDeadline.timeRemaining());
  // timeRemaining方法取得当前闲置周期预估的剩余时间（ms）
	do {
		tasks[i++](); // do task
	} while(i < tasks.length && idleDeadline.timeRemaining() > 0); // 只要有剩余时间就干活
	
	console.log('tasks remain: ', 1000 - i);
	// if remaining tasks exsis when timeout. Run at next frame
  // 活没干完，在下一个周期有空的时候干
	if (i < tasks.length) {
		requestIdleCallback(doTasks.bind(null, i));
	}
}

// start tasks scheduler
requestIdleCallback(doTasks.bind(null, 0))

// 输出
time remains:  6.8
88 task run
 tasks remain:  912
 time remains:  14.9
282 task run
 tasks remain:  630
 time remains:  15.3
328 task run
 tasks remain:  302
 time remains:  15.3
302 task run
 tasks remain:  0
```

一般剩的时间都有15ms左右。但是在任务复杂的时候，可能会导致任务堆积，这时候可选参数的timeout就可以让某些任务及时执行。

另外requestIdleCallback在safari里面是没有的

## Scheduler

react借鉴了requestIdleCallback的模式。在react中，任务优先级有immediate，UserBlocking，normal，low，idle五种，每一种任务也有各自的超时时间，避免任务饿死。

scheduler的入口是scheduleCallback，它负责生成调度任务，根据任务是否过期将其放入timerQueue和taskQueue，然后触发调度行为，让任务进入调度。大致过程如下：

1. 计算startTime，用作timerQueue排序的依据，getCurrentTime用于获取当前时间
2. 接着计算expirationTime（到期时间），用作taskQueue的排序依据
3. newTask是scheduler中任务单元的数据结构
4. 根据1，2步计算的时间，把task放进对应的队列，然后触发调度

入口的具体实现如下：

```js
function unstable_scheduleCallback(priorityLevel, callback, options) {
  /*
   * (1
   */
  var currentTime = getCurrentTime();

  // timerQueue 根据 startTime 排序
  // 任务进来的时候, 开始时间默认是当前时间, 如果进入调度的时候传了延迟时间
  // 开始时间则是当前时间与延迟时间的和
  var startTime;
  if (typeof options === "object" && options !== null) {
    var delay = options.delay;
    if (typeof delay === "number" && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  /*
   * (2
   */
  // taskQueue 根据 expirationTime 排序
  var timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT; // -1
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT; // 250
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT; // 1073741823 (2^30 - 1)
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT; // 10000
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT; // 5000
      break;
  }

  // 计算任务的过期时间, 任务开始时间 + timeout
  // 若是立即执行的优先级(IMMEDIATE_PRIORITY_TIMEOUT(-1))
  // 它的过期时间是 startTime - 1, 意味着立刻就过期
  var expirationTime = startTime + timeout;

  /*
   * (3
   */
  // 创建调度任务
  var newTask = {
    id: taskIdCounter++,
    callback, // 调度的任务
    priorityLevel, // 任务优先级
    startTime, // 任务开始的时间, 表示任务何时才能执行
    expirationTime, // 任务的过期时间
    sortIndex: -1, // 在小顶堆队列中排序的依据
  };

  if (enableProfiling) {
    newTask.isQueued = false;
  }// 解析没有提到这个，貌似是debug用的

  /*
   * (4
   */
  // startTime > currentTime 说明任务无需立刻执行
  // 故放到 timerQueue 中
  if (startTime > currentTime) {
    // timerQueue 是通过 startTime 判断优先级的,
    // 故将 startTime 设为 sortIndex 作为优先级依据
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);

    // 如果 taskQueue 是空的, 并且当前任务优先级最高
    // 那么这个任务就应该优先被设为 isHostTimeoutScheduled
    // 我对isHostTimeoutScheduled的理解就是，表示现在有没有任务被安排延迟进入任务队列
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // 如果超时调度已经在执行了, 就取消掉（防止被执行多次）
      // 因为当前这个任务是最高优的, 需要先处理当前这个任务
      if (isHostTimeoutScheduled) {
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // startTime <= currentTime 说明任务已过期
    // 需将任务放到 taskQueue
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);

    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    }

    // 如果目前正在对某个过期任务进行调度,
    // 当前任务需要等待下次时间片让出时才能执行
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}
```

## getCurrentTime

获取当前时间用的，优先使用performance.now（返回一个DOMHighResTimeStamp），其次是Date.now

```js
let getCurrentTime;
const hasPerformanceNow =
  typeof performance === "object" && typeof performance.now === "function";

if (hasPerformanceNow) {
  const localPerformance = performance;
  getCurrentTime = () => localPerformance.now();
} else {
  const localDate = Date;
  const initialTime = localDate.now();
  getCurrentTime = () => localDate.now() - initialTime;
}
```

## request/cancel HostTimeout

用来设置/取消执行延迟的一对方法。其实就是个延迟调用，为了让未过期的任务能恰好在过期的时候被调用。它专门处理timerQueue里面的任务

```js
function requestHostTimeout(callback, ms) {
  taskTimeoutID = setTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}

function cancelHostTimeout() {
  clearTimeout(taskTimeoutID);
  taskTimeoutID = -1;
}
```

入口中，传给requestHostTimeout的延迟时间是startTime - currentTime，因为未过期的任务的startTime是未来的一个时刻。其实这个值就等于option中设置的delay。

**具体的运行逻辑还是看看上面入口函数的源码吧**

## handleTimeout

被传给requestHostTimeout的callback，字面意思是处理超时。它主要用来更新timerQueue和taskQueue，发现timerQueue中过期的任务就放入taskQueue，如果接下来没有任务正在调度，就先查看taskQueue中是否存在任务，如果有的话就先flush（就是把它们执行了）如果没有就递归执行requestHostTimeout。

联系上面的requestHostTimeout，这块儿的逻辑应该是这样的：

1. 在调度一个未过期任务进入timerQueue的时候，会让它在过期时刻调用handleTimeout
2. handleTimeout检查两个队列（通过advanceTimers方法，它会把过期的放进taskQueue）
3. 因为handleTimeout一般是在有任务过期的时候调用的，所以这时候taskQueue会有任务，就用requestHostCallback(flushWork)把它执行了
4. 没有任务过期的话，就对timerQueue中的第一个任务设置requestHostTimeout

总之这个方法就是把timerQueue的任务转移到taskQueue中，并调用requestHostCallback执行已过期任务

```js
function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  // 更新 timerQueue 和 taskQueue 两个序列
  // 如果发现 timerQueue 有过期的, 就放到 taskQueue 中
  advanceTimers(currentTime);

  // 检查是否已经开始调度
  // 如果正在调度, 就什么都不做
  if (!isHostCallbackScheduled) {
    // 如果 taskQueue 中有任务, 那就先去执行已过期的任务
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      // 如果没有过期任务, 那就接着对最高优的第一个未过期的任务
      // 继续重复这个过程, 直到它可以被放置到 taskQueue
      const firstTimer = peek(timerQueue);
      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}
```

## advancedTimers

上面提到的，它检查timerQueue中过期的任务，放进taskQueue

```js
function advanceTimers(currentTime) {
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      // Timer was cancelled.
      pop(timerQueue);

      // 开始时间小于等于当前时间, 说明已过期,
      // 从 taskQueue 移走, 放到 taskQueue
    } else if (timer.startTime <= currentTime) {
      pop(timerQueue);
      // taskQueue 是通过 expirationTime 判断优先级的,
      // expirationTime 越小, 说明越紧急, 它就应该放在 taskQueue 的最前面
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);

      if (enableProfiling) {
        markTaskStart(timer, currentTime);
        timer.isQueued = true;
      }
    } else {
      // 开始时间大于当前时间, 说明未过期, 任务仍然保留在 timerQueue
      // 任务进来的时候, 开始时间默认是当前时间, 如果进入调度的时候传了延迟时间, 开始时间则是当前时间与延迟时间的和
      // 开始时间越早, 说明会越早开始, 排在最小堆的前面
      // Remaining timers are pending.
      return;
    }
    timer = peek(timerQueue);
  }
}
```

## requestHostCallback

react废弃了rAF，因为它容易受到用户切换选项卡，滚动页面等操作的影响。目前scheduler通过MessageChannel来人为控制调度频率，默认时间切片是5ms。MessageChannel相关代码如下：

```js
let schedulePerformWorkUntilDeadline;

if (typeof setImmediate === "function") {
  schedulePerformWorkUntilDeadline = () => {
    setImmediate(performWorkUntilDeadline);
  }; // 兼容IE
} else {
  const channel = new MessageChannel();
  const port = channel.port2;

  // port1 接收调度信号, 来执行 performWorkUntilDeadline
  channel.port1.onmessage = performWorkUntilDeadline;

  // port 是调度者
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
}
```

requestHostCallback将传进来的callback赋值给全局变量scheduledHostCallback，只要isMessageLoopRunning是false，即没有任务调度，就把它开启，并发送信号给port1进行调度：

```js
function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;

    // postMessage, 告诉 port1 来执行 performWorkUntilDeadline 方法
    schedulePerformWorkUntilDeadline();
  }
}
```

## performWorkUntilDeadline

实际干活的方法，port1收到信号后执行的函数。它会在时间片内执行任务，没执行完就会用一个新的调度者继续调度。

它首先会判断scheduledHostCallback，存在才说明有任务需要被执行，执行的deadline是当前时刻加上yieldInterval（也就是默认的5ms）。

```js
const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    // 时间分片
    deadline = currentTime + yieldInterval;
    const hasTimeRemaining = true;

    let hasMoreWork = true;
    try {
      // scheduledHostCallback 去执行真正的任务
      // 如果返回 true, 说明当前任务被中断了
      // 会再让调度者调度一个执行者继续执行任务
      // 下面讲 workLoop 方法时会说到中断恢复的逻辑, 先留个坑
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // 如果任务中断了(没执行完), 就说明 hasMoreWork 为 true
        // 这块类似于递归, 就再申请一个调度者来继续执行该任务
        schedulePerformWorkUntilDeadline();
      } else {
        // 否则当前任务就执行完了
        // 关闭 isMessageLoopRunning
        // 并将 scheduledHostCallback 置为 null
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
  // Yielding to the browser will give it a chance to paint, so we can
  // reset this.
  needsPaint = false;
};
```

hasMoreWork字段是判断任务完成的标记，后面workLoop再深入

## flushWork

requestHostCallback(flushWork)的时候传入的参数，被赋值给了全局变量scheduledHostCallback，在performWorkUntilDeadline中也调用了scheduledHostCallback。flushWork，顾名思义，把任务从马桶里面冲下去，它返回一个workLoop，帮助performWorkUntilDeadline中的hasMoreWork进行判断

```js
function flushWork(hasTimeRemaining, initialTime) {
  if (enableProfiling) {
    markSchedulerUnsuspended(initialTime);
  }

  // 由于 requestHostCallback 并不一定立即执行传入的回调函数
  // 所以 isHostCallbackScheduled 状态可能会维持一段时间
  // (isHostCallbackScheduled这块儿逻辑需要仔细看看)
  // 等到 flushWork 开始处理任务时, 则需要释放该状态以支持其他的任务被 schedule 进来
  isHostCallbackScheduled = false;

  // 因为已经在执行 taskQueue 的任务了
  // 所以不需要等 timerQueue 中的任务过期了
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  const previousPriorityLevel = currentPriorityLevel;
  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          const currentTime = getCurrentTime();
          markTaskErrored(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        throw error;
      }
    } else {
      // No catch in prod code path.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    // 执行完任务后还原这些全局状态
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
    if (enableProfiling) {
      const currentTime = getCurrentTime();
      markSchedulerSuspended(currentTime);
    }
  }
}
```

## workLoop

```js
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;

  // 因为是个异步的, 需要再次调整一下 timerQueue 跟 taskQueue
  advanceTimers(currentTime);

  // 最紧急的过期任务
  currentTask = peek(taskQueue);
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused) // 用于 debugger, 不管
  ) {
    // 任务中断!!!
    // 时间片到了, 但 currentTask 未过期, 跳出循环
    // 当前任务就被中断了, 需要放到下次 workLoop 中执行
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }

    const callback = currentTask.callback;
    if (typeof callback === "function") {
      // 清除掉 currentTask.callback
      // 如果下次迭代 callback 为空, 说明任务执行完了
      currentTask.callback = null;

      currentPriorityLevel = currentTask.priorityLevel;

      // 已过期
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      // 判断任务是否过期

      if (enableProfiling) {
        markTaskRun(currentTask, currentTime);
      }

      // 执行任务
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();

      // 如果产生了连续回调, 说明出现了中断
      // 故将新的 continuationCallback 赋值 currentTask.callback
      // 这样下次恢复任务时, callback 就接上趟了
      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;

        if (enableProfiling) {
          markTaskYield(currentTask, currentTime);
        }
      } else {
        if (enableProfiling) {
          markTaskCompleted(currentTask, currentTime);
          currentTask.isQueued = false;
        }
        // 如果 continuationCallback 不是 Function 类型, 说明任务完成!!!
        // 否则, 说明这个任务执行完了, 可以被弹出了
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
      }

      // 上面执行任务会消耗一些时间, 再次重新更新两个队列
      advanceTimers(currentTime);
    } else {
      // 上面的 if 清空了 currentTask.callback, 所以
      // 如果 callback 为空, 说明这个任务就执行完了, 可以被弹出了
      pop(taskQueue);
    }

    // 如果当前任务执行完了, 那么就把下一个最高优的任务拿出来执行, 直到清空了 taskQueue
    // 如果当前任务没执行完, currentTask 实际还是当前的任务, 只不过 callback 变成了 continuationCallback
    currentTask = peek(taskQueue);
  }

  // 任务恢复!!!
  // 上面说到 ddl 到了, 但 taskQueue 还没执行完(也就是任务被中断了)
  // 就返回 true, 这就是恢复任务的标志
  if (currentTask !== null) {
    return true;
  } else {
    // 若任务完成!!!, 去 timerQueue 中找需要最早开始执行的那个任务
    // 进行 requestHostTimeout 调度那一套
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}

```

workLoop在一个时间片内执行currentTask的callback，在开始执行的时候先用continuationCallback把currentTask.callback的值存起来，再把它设置为null，如果执行完成，就把这个任务从堆顶弹出，否则就把currentTask.callback重新设置成新的continuationCallback，这样下一个时间片就能继续了。最后，在执行完任务的情况下，从taskQueue里面再拿一个任务出来作为currentTask。

workLoop的返回值是这样判断的：如果currentTask存在，说明任务被中断了，需要继续，就返回true。否则就去timerQueue里面找一个任务执行requestHostTimeout，并返回false

## 和fiber

所有fiber节点都在工作循环中进行处理，我认为workloop中的任务就是fiber任务，这也解释了为什么在最初认识scheduler的时候会疑惑为什么任务可以暂停和继续：fiber结构就是一个天然的任务列表，每个节点记录了自己的任务，对任务的引用其实就是对fiber节点的引用

这个阶段的工作顺序就是fiber篇中描述的fiber树遍历顺序

在工作结束后进入调和篇提到的提交阶段（commit）
