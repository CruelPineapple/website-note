# diff

引入fiber后，diff就是在fiber上工作了，diff过程中会为fiber节点打上effectTag，标志这个节点的变化，如新增（Placement），更新（Update），删除（Deletion）。最终这些拥有effectTag的fiber会被收集成为effect list fiber tree，在commit的过程中被更新到dom（详细的过程在调和篇）

调和篇中提到，diff的过程发生在构建wIP tree的时候，接下来就详细看看

## diff主体

diff的核心函数是reconcileChildFibers，它接受这么几个参数：

1. workInProgress：应该是wIP tree的父节点，因为diff的过程中在构建wIP tree，新fiber节点的return引用指向这个父节点
2. current.child：current fiber tree的节点，生成的新reactElement被加入wIP树之前与其进行比较
3. nextChildren：新生成的reactElement，后续会根据它生成fiber节点（如果可能，会复用current.child节点）
4. renderLanes：本次渲染的优先级，最终会作为新fiber节点的lanes属性

参与diff的两个元素是不同的数据结构：旧fiber节点和新的reactElement。

## diff规则

对于新旧两种结构来说，场景有自身更新，节点增删，节点移动三种情况

* 即使两个元素的子树完全一样，只是父级元素发生变化，按照规则仍然会销毁父节点下所有节点，不会进行复用
* 同级节点通过标签名和key进行识别，如果只是位置发生变化就会尽量复用

## 场景

一个fiber的子元素可能是单节点也可能是多节点，因此场景可以细分为：

* 单节点更新，单节点增删
* 多节点更新，多节点增删，多节点移动

对DOM节点来说，新旧节点的类型（也就是标签）和key都相同的情况下，节点的其他属性发生了变化，属于节点更新，而如果伴随着key和节点类型的变化，diff会认为新旧节点没有关系。

## 单节点

单节点情况指新的reactElement为单一节点（也就是组件只产出了一个节点），又存在三种情况，一个旧的和一个新的，多个旧的和一个新的，只有新的。

单节点diff只有更新操作，不会设计位置变化。react使用reconcileSingleElement方法处理单节点情况，它只区分有没有旧节点两种情况（即oldFiber是否为空）

### oldFiber不为空

会遍历它们，试图找到和新节点key相同的那个，如果找到了就会删掉剩下的oldFiber节点，复用旧节点和新的props生成新的fiber节点。没找到就合oldFiber为空的情况类似，清除所有的oldFiber然后创建新的

### oldFiber为空

直接新建节点

## 多节点

组件产生了一堆同级的DOM元素的情况，react使用reconcileChildArray进行diff。

节点数目没有变化，顺序也没有变化，只是节点自身更新的情况。

### 节点更新

首先考虑节点更新的情况，react会尝试按顺序一个一个对比旧的节点树和新的reactElement列表中的key或者节点类型，如果所有节点的key都成功匹配，就进入节点更新的流程，（我感觉这里应该是打上更新的effectTag，在统一生成wIP树的时候再通过tag进行操作）复用旧fiber节点，更新所有的props为新状态。

如果key或者节点类型有变化，说明不是简单的节点更新，就立刻停止遍历newChildren了，进入之后的逻辑。

### 节点移动

react用最后一个没有移动的节点作为参考位置，这个位置的节点保存在lastPlacedIndex。参考位置后边的节点会被先更新（应该是说更新props），为了在更新的时候方便查找，oldFiber中在参考位置后边的节点会被放进一个map，以key为键。

移动节点的逻辑是这样的：newChildren中的节点，都是不确定要不要移动的，因此遍历它们，对于每一个都试图找到它在oldFiber中的位置：

* 如果旧位置在参考位置后边，就先不动他，把它变成参考位置。
* 如果旧位置在参考位置前边，说明它要往后挪（为啥会有旧位置在参考位置前面的呢？参考位置前面的部分不是都一一对应好了吗），因为新位置在参考位置的后边所以往后挪

带着疑问，来考虑如下情况：

旧：A-B-C-D-E-F

新：A-B-D-C-E

参考位置是B，此时oldFiber剩余CDEF，它们进入map，newChildren剩余D-C-E，这时候开始遍历newChildren

1. 首先发现D，在oldFiber中D在B的后边，因此D成为了新的参考位置（发现了吗，参考位置是跟着newChildren走的，所以自然会有旧位置在前面的情况）然后从map里面把D删掉
2. 然后发现C，在oldFiber中C在D前面，因此需要把它挪到D后面，并且别忘了从map里面把C删掉。
3. 然后发现E，在oldFiber中E在D后面，因此E成为新的参考位置，从map删去E
4. 最后发现，newChildren都遍历完了，oldFiber还剩一个F，就把它删掉（删掉节点）

我的理解是，先更新，再移动，最后构建wIP tree的时候因为已经挪好位置了，就可以狠狠地复用。还是我自己的理解哈，diff虽然做了对比，但是构建wIP树应该是在diff之后统一搞的，因为感觉diff做的事情比较零散（我猜的）

### 节点删除

在newChildren遍历结束，但是oldFiber还没有遍历完，说明剩下的老节点就要删除了，在oldFiber为它打上Deletion的tag，并且把这个被删除的节点添加到父级的effectList中（是这样吗，我还以为effect list只记录增加的）

### 节点新增

与删除相反，oldFiber遍历结束了，但是newChildren还有剩的，那就为剩下的节点生成fiber节点，并连上sibling引用

## Vue Diff

vue在diff的过程中会调用patch将节点的更新同步至DOM，是一个边diff边更新的过程，它对于找到的差异不会在新旧vDOM上修改，而是直接修改DOM

