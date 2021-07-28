# apply和函数参数
## Function.prototype.apply()
apply方法接收两个参数，第一个用于指定为function的this值，第二个是参数数组，数组的元素会挨个作为函数的参数传入：
```
let a = [1, 2, 3];
a.push.apply(a,[4,5,6]);
```
## 函数的arguments属性
函数不介意参数的数目，不论声明的时候的参数个数如何，所有参数会以数组的形式交给函数（因此js没有重载）  
arguments对象可以在函数内部如同数组一样访问，它的length属性表示参数个数。如果手动指定arguments中元素的值，传入的参数值就会被覆盖