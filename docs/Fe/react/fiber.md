# Fiber

fiber可以理解为一种工作单元的结构，它记录要工作的内容，并且便于随时暂停和继续工作

每个render方法内的JSX都会被转换为React.createElement，而React.createElement会为JSX的最外层元素设置为一个数据结构（比如就是一个span元素的JSX）：

```js
{
  $$typeof: Symbol(react.element),
  type: 'span',
  key:null
  props: {
      children: 0
  }
}

```

$$typeof标识了一个react element，每一个react element都对应一个fiber

- fiber就是一个对象结构，包含了一串需要完成的任务
- 每一个react element都对应一个fiber，element树就对应了fiber树
- fiber不会在re-render过程中重新创建，它是可变的，保留了组件状态和dom

## 第一棵fiber树

[createFiberFromTypeAndProps](https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js#L414)方法创建第一棵fiber树，之后就会重用fiber节点

## why fiber

使用fiber就是为了：

- 暂停任务，并且可以稍后继续
- 为不同的任务设置优先级
- 重用之前完成过的任务
- 终止不再需要的任务

## 原理

react15时还没有fiber结构，调和过程是树的递归，会使用大量调用栈，而且持续占用主线程。

fiber树就是一个偏线性的结构，它的主体是一个单链表，沿着链表检查fiber节点避免了递归这样不能中断的操作，并且根据是否有时间执行下一个任务来判断是否需要归还主线程。

## fiber tree

fiber树的父节点只和第一个子节点通过child引用相连，同级兄弟节点通过sibling引用相连，每个兄弟节点都有一个return引用指向父节点。

两颗fiber树（current和wIP）的节点之间应该是有对应的引用的

节点大概有这些关键属性：

```
{
    stateNode, // 引用此fiber节点对应的DOM节点，组件，其它fiber节点
    child,	// 子节点
    return,	// effect列表通过return引用回传给上级节点
    sibling, 
    key,
    effectTag, // 副作用类型，新增，更新，删除，移动等，例如PLACEMENT表示新增节点
    nextEffect, // 很重要，react通过这个找到下一个effect工作
    firstEffect,
}
```

### 遍历fiber tree

0. 把当前遍历节点作为a
1. 完成a节点需要做的任务
2. 是否有a.child
3. 有a.child，把a.child作为a，回到1
4. 为空，则判断是否有a.sibling，如有，将a.sibling作为a，回到1
5. 如果没有，也就是a.child和a.sibling都没有了，就认为当前这一层的节点都遍历过了，那就返回父节点寻找sibling，如果父节点有sibling，将其作为a，回到1
6. 如果已经到根结点了，就结束

补充：第一步“完成该节点的任务”不够明确，其实是执行beginWork方法，它根据原本的fiber节点创建新的fiber（因为这个过程实际上就是在构建wIP树，最好结合下面的一起理解）。另外还有一个completeWork方法，发生在第四步中，在前往a.sibling之前，会执行completeWork方法，收集当前节点的副作用交给父级fiber节点，然后再前往兄弟节点从第一步开始

## 构建workInProgress fiber tree

复用current fiber tree，构建workInProgress fiber tree

1. 如果当前节点不需要更新，就直接把节点复制过来，并转到5；需要更新则在tag属性上进行标记
2. 更新当前节点的状态（props，state，context等）
3. 调用shouldComponentUpdate，如果是false，转到5
4. 调用render获取新的子节点，从现有的fiber节点为它创建一个新的fiber节点
5. 如果没有产生child fiber节点，那么本节点的工作就结束了，effect list被交给return引用的父节点，下一个工作节点将会是当前节点的sibling。如果产生了child fiber节点，那么产生的这个节点就是下一个工作节点
6. 检查剩余可用时间，如果有空就开始下一个工作节点的任务，否则等待主线程空闲
7. 如果没有下一个工作节点，（此时已经返回了fiber树的根节点，wIP树构建完成）进入pendingCommit状态

结束后，根结点的effect list就保存着完整的effect list fiber tree，所有effect工作就会被连在一起，这样react在执行这些effect工作的时候就可以跳过其它的节点

## Effect

就是处理更新之外还需要完成的工作，例如修改DOM

## fiber树根

对fiber树的引用可以通过react根元素的DOM引用找到：

```js
const fiberRoot = query('#container')._reactRootContainer._internalRoot

const hostRootFiberNode = fiberRoot.current
```

## 双缓冲

就是wIP树构造完毕，就会成为新的current fiber tree，旧的current tree就不再引用了（被回收）。这样复用了一整颗树



