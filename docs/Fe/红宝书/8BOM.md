# BOM
BOM是浏览器对象模式，这一章主要介绍window对象的功能，包括窗口位置大小，弹窗对话等等，以及setInterval等等功能，感觉不是很需要深入理解，稍作记忆使用的时候查询即可。
## location
除了href以外，还有端口号，协议查询参数等等属性。要取得每一项查询参数的话，必须创建一个函数去解析查询字符串部分，因为它给的是一整串。
location拥有assign方法，可以改变浏览器的浏览位置，修改href实际上就是调用了assign方法。还有一个replace方法，使用replace定向的页面不产生历史记录，导致不能通过返回按钮回到上一个页面。另外，reload方法在不传递参数的时候会进行懒加载，如果自上次请求开始页面没有发生改变，就会从缓存中重载页面，若希望从服务器重新加载，需要传递一个true。
## navigator
浏览器和用户的一些信息。插件检测，注册处理程序
## screen
屏幕规格，dpi，位置等等属性
## history
保存着历史记录。拥有go方法，可以向前或向后跳转指定次数，也可以指定页面url进行跳转