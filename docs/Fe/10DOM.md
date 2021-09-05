# DOM
DOM是文档对象模型
## 节点关系
提供方法获取节点的子节点以及兄弟节点和父节点，红宝书给出了节点间访问方法图。
## 操作节点
可以在尾部新增节点，appendChild会把新增的节点返回。appendChild可以增加已经存在的节点，会把节点移动到新的位置。
insertBefore可以将节点插入特定位置，需要给出参照节点，新节点会在参照节点的前面。
removeChild可以移除节点，并把移除的节点返回。被移除的节点成为孤儿节点
cloneNode可以复制节点，参数可以指定深复制（复制节点和它的所有子节点）。复制后返回的节点是孤儿节点，需要使用上面的某个方法将其添加至文档中。
## Document对象
document.documentElement可以取得html元素，也可以使用document.childNodes[ 0 ]或者document.firstChild。document还有body属性，直接指向body元素，doctype属性指向doctype元素。
document包含文档信息，title，URL，domain。由于跨域安全限制，有时候一个页面会拥有来自其他子域的框架，这时候将domain设置为相同可以让页面的js能互相访问。
## 查找元素
通过id和tagname查找。还可直接访问document.anchors获得所有带name的a标签，document.images获得所有img元素，document.links获得所有带href的a标签等等
## elememt类型
每个元素都有特性，如id，className，title等等，在元素对象上直接访问这些属性即可，也可以通过getAttribute，setAttribute，removeAttribute进行操作
## text类型
纯纯的文本节点，就是文字的部分。一般情况，每个元素只有一个文本子节点：
```
var element = document.createElement("div");
element.className = "message";

var textNode = document.createTextNode("Hello world");
element.appendCHild(textNode);

document.body.appendChild(element);
```
此例创建了一个新dov，指定了class，创建了一个文本节点，将其添加到前面创建的元素中，最后将div添加到body。有助于理解文本节点。
normalize方法，能够合并相邻的文本节点。相反，splitText可以将一个文本节点分成两个
## DOM扩展
querySelector方法接收一个css选择符，返回与该选择符匹配的第一个元素，querySelectorAll方法则会返回匹配的所有元素
```
var myDiv = document.querySelector("#myDiv");
```
## H5新增
getElementByClassName,不多说，返回符合类名的NodeList，可以传入多个类名。
classList属性，操作类名的时候，原本需要做字符串切割，但是h5新增的这个属性拥有add，contains，remove，toggle方法，用于增删以及反转类名等操作
焦点管理，focus方法可以聚焦到该元素，document.hasFocus可以确定文档是否获取到焦点，document.activeElement记录了当前活动元素
innerHTML，该属性以字符串形式保存节点拥有的DOM树，修改时，传入字符串的标签也会被解析为DOM元素。需要注意，传入此属性的内容需要仔细检查
outerHTML，包括调用元素在内的DOM树
大量插入时，innerHTML比多次创建节点更快速，当然，需要一次性调整innerHTML的内容
## innerText
被h5抛弃的属性，与innerHTML类似，但是只生成一个文本子节点