# RegExp类型
## 创建正则表达式
pattern指示需要匹配的字符串，flags指定匹配模式，模式有g，i，m三种，分别是匹配全部模式（而不是仅匹配首个）；不区分大小写模式；换行模式（到达行尾也会继续匹配下一行）。
```
let expression = / pattern / flags;

let exp1 = /at/g;  //匹配所有“at”  
let exp2 = /[bc]at/i;  //匹配首个“bat”或“cat”，不区分大小写
let exp3 = /.at/gi;  //匹配所有以at结尾的3字符组合，不区分大小写

//用构造函数创建正则表达式
let exp4 = new RegExp("[bc]at","i");  //与exp2相同
```
需要注意使用构造函数时，参数为字符串，存在二次转义的问题，即原本pattern中的\转义符在字符串中需要被再次转义为\\，不然就变成字符串字面量了
## exec
RegExp对象的主要方法，接受一个参数，即要应用匹配模式的字符串，返回一个数组，第一项是完全匹配的内容，后续每项是每个分组捕获匹配的内容。同时，此RegExp对象的lastIndex属性记录了下一次匹配的起点。
```
// Match "quick brown" followed by "jumps", ignoring characters in between
// Remember "brown" and "jumps"
// Ignore case
var re = /quick\s(brown).+?(jumps)/ig;
var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
```
result:  
|属性/索引|描述|例子|
|----|----|----|
|[0]|匹配的全部字符串|Quick Brown Fox Jumps|
|[1], ...[n ]|括号中的分组捕获|[1] = Brown [2] = Jumps|
|index|匹配到的字符位于原始字符串的基于0的索引值|4|
|input|原始字符串|The Quick Brown Fox Jumps Over The Lazy Dog|
## test
test方法仅返回布尔值，判断传入字符串是否存在匹配的模式