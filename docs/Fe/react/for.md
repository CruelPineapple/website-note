# For

for...in和for...of，前者循环的是key，后者循环的是value。因此，遍历数组应该使用for...of，遍历对象则使用for...in。

两者遍历数组的情况如下：

```js
for(let index in aArray){
    console.log(`${aArray[index]}`);
}

for(var value of aArray){
    console.log(value);
}
```

可以看出，for...in取得的是key，在拉取数组元素的时候需要多一个步骤，而且，如果给数组添加了一个属性，例如aArray.name = "demo"，这时候for in就会把name属性也给循环出来

而如果要用for of来循环对象，必须配合Object.keys使用：

```js
var student={
    name:'wujunchuan',
    age:22,
    locate:{
    country:'china',
    city:'xiamen',
    school:'XMUT'
    }
}
for(var key of Object.keys(student)){
    //使用Object.keys()方法获取对象key的数组
    console.log(key+": "+student[key]);
}
```

### forEach

这个只能用于数组遍历，而且不能中途停下来