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
通过id和tagname查找