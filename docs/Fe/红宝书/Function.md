# Function类型
函数名是一个指向函数的指针，这也是没有重载的原因：新定义的同名函数会更改该函数名的引用。  
## 函数声明/函数表达式
这是一个函数声明：
```
function foo(bar){
    return bar;
}
```
在代码执行之前，存在一个函数声明提升的过程，把所有的函数声明添加到执行环境中，因此在函数声明之前对其调用是没有问题的。  
这是一个函数表达式：
```
let foo = function(bar){
    return bar;
};
```
这时候没有提升过程，foo仅仅进行了初始化，在赋值之前调用会出现错误  
## 函数作为返回值
函数不仅可以作为参数传给另一个函数，也可以作为返回值被返回。一个例子：现有一个对象数组，我们需要根据对象中某一属性为数组排序。
```
function compareBy(propertyName){
    return function(object1, object2){
        let val1 = object1[propertyName];
        let val2 = object2[propertyName];
        if(val1 > val2){
            return 1;
        }else{
            return -1;
        }
    }
}
```
这时候就可以用sort方法进行排序了：
```
let data = [
    {
        "name": "Nicholas",
        "age": "29"
    },
    {
        "name": "Zachary",
        "age": "28"
    }
];

data.sort(compareBy("name"));
console.log(data);

data.sort(compareBy("age"));
console.log(data);
```
## 函数内部属性
### arguments
保存着参数的类数组，还有一个callee属性，指向拥有此arguments对象的函数，可以用于递归时不借助函数名字进行调用。
### this
调用函数的环境对象的引用
### caller
调用当前函数的函数的引用
## 函数属性和方法
### length
指示函数的参数个数
### prototype

### call和apply
apply有单独记录过，call与其类似，然而接收参数时必须将其一一列举  
这两个方法真正强大之处在于能够扩充函数作用域，对象和方法不需要有任何的耦合关系，值得咀嚼：
```
window.color = "red";
let o = {
    color: "blue"
};

function getColor(){
    return this.color;
}

getColor.call(o);//得到blue

o.getColor();//也能得到blue，但是存在将函数放入o中这一多余的步骤
```
