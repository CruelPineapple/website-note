# 块格式化上下文

## 触发BFC

* html标签（根元素）
* 浮动元素
* 绝对定位元素
* inline-block
* overflow不为visible的块级元素
* display为flow-root（没有副作用）
* display flex或inline-flex，grid或inline-grid

还有一些比较冷门的触发方法

## BFC效果

让BFC内部的东西不会影响外部，也不会收到外部元素的影响。在外部元素看来这一大坨东西等同于一个块

## BFC作用

清除浮动导致外面盒子的高度坍缩。让外面的盒子形成BFC后，内部所有元素都会参与BFC，因此浮动的元素会被正确包裹在BFC内部。

消除两个div之间的上下margin合并问题

