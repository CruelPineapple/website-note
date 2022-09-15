module.exports = {
  base: "/note/",
  title: "一个云鬼",
  description: "我悲痛欲绝，跳进了家门口的井里",
  themeConfig: {
    sidebar: [

      {
        title: 'ES6',
        children:[
          '/Fe/es6/map',
          '/Fe/es6/set',
          '/Fe/es6/let',
          '/Fe/es6/promise',
          '/Fe/es6/reflect',
          '/Fe/es6/遍历器',
          '/Fe/es6/生成器',
          '/Fe/es6/箭头函数',
          '/Fe/es6/手promise'
        ]
      },
      {
        title: "React",
        children: [
          '/Fe/react/scheduler',
          '/Fe/react/fiber',
          '/Fe/react/调和',
          '/Fe/react/diff',
          '/Fe/react/react哲学',
          '/Fe/react/hook-asd',
          "/Fe/react/asd",
          "/Fe/react/类",
          "/Fe/react/Symbol",
          "/Fe/react/for"
        ]
      },
      {
        title: "Vue",
        children: [
            "/Fe/vue/计算属性和侦听器",
            "/Fe/vue/proxy",
            "/Fe/vue/生命周期",
            '/Fe/vue/数据可观察',
            '/Fe/vue/依赖收集',
            '/Fe/vue/组合式api',
            "/Fe/vue/关于mounted的bug",
            "/Fe/vue/element事件绑定",
            "/Fe/vue/分页展示"
        ],
      },
      {
        title: "基础",
        children: [
          '/base/tcp拥塞',
          '/base/34',
          '/base/http',
          '/base/http缓存',
          '/base/url',
          '/base/get和post',
          '/base/跨域',
          '/base/sql'
        ]
      },
      {
        title:'引擎',
        children:[
          '/Fe/engine/事件循环',
          '/Fe/engine/v8',
          '/Fe/engine/上下文',
          '/Fe/engine/回流重绘',
          '/Fe/engine/gc'
        ]
      },
      {
        title: "红宝书笔记",
        children: [
            "/Fe/红宝书/Number",
            "/Fe/红宝书/parseInt.md",
            "/Fe/红宝书/String",
            "/Fe/红宝书/apply和参数",
            "/Fe/红宝书/Array",
            "/Fe/红宝书/RegExp",
            "/Fe/红宝书/Function",
            "/Fe/红宝书/async",
            "/Fe/红宝书/基本包装类型",
            "/Fe/红宝书/单体内置对象",
            "/Fe/红宝书/对象基础",
            "/Fe/红宝书/创建对象",
            "/Fe/红宝书/原型",
            "/Fe/红宝书/继承和原型链",
            "/Fe/红宝书/其他继承",
            "/Fe/红宝书/7函数表达式/闭包",
            "/Fe/红宝书/7函数表达式/this",
            "/Fe/红宝书/7函数表达式/模仿块级作用域",
            "/Fe/红宝书/7函数表达式/私有变量",
            "/Fe/红宝书/8BOM",
            "/Fe/红宝书/9客户端检测",
            "/Fe/红宝书/10DOM",
            "/Fe/红宝书/11DOM2和DOM3",
            "/Fe/红宝书/13事件",
            "/Fe/红宝书/14表单脚本",
            "/Fe/红宝书/17错误处理",
            "/Fe/红宝书/20JSON",
            "/Fe/红宝书/21AJAX",
            "/Fe/红宝书/22高级技巧",
            "/Fe/红宝书/22高级技巧2"
        ],
      },
      {
        title: '我不知道的JS',
        children: [
          '/Fe/不js/函数作用域',
          '/Fe/不js/块作用域',
          '/Fe/不js/提升',
          '/Fe/不js/闭包',
          '/Fe/不js/模块',
          '/Fe/不js/this',
          '/Fe/不js/作用域',
          '/Fe/不js/查询',
          '/Fe/不js/typeof'
        ]
      },
      {
        title:'面试',
        children:[
          '/面/自我介绍',
          '/面/js',
          '/面/10-28网易1',
          '/面/10-29哔哩哔哩1',
          '/面/11-2商汤1',
          '/面/11-5商汤2',
          '/面/11-9商汤3',
          '/面/11-10哔哩哔哩2',
          '/面/11-12腾讯1',
          '/面/12-14字节1',
          '/面/12-20字节2'
        ]
      },
      {
          title:"题",
          children:[
            '/lc/2两数相加',
            '/lc/5最长回文子串',
            '/lc/10正则表达式匹配',
            '/lc/17电话号码的字母组合',
            '/lc/19删除链表的倒数第n个节点',
            '/lc/排序',
            '/lc/result',
            '/lc/周期执行函数',
            '/lc/URL拆解',
            '/lc/HTTPheader',
            '/lc/数组转树',
            '/lc/字符串方法',
            '/lc/竖式',
            '/lc/数组方法',
            '/lc/数组扁平化',
            '/lc/数组求和',
            '/lc/转换类数组',
            '/lc/深浅拷贝',
            '/lc/bind和new',
            '/lc/柯里化',
            '/lc/instanceof',
            '/lc/手写promise',
            '/lc/promiseAll',
            '/lc/红绿灯',
            '/lc/每秒打印数字',
            '/lc/连续赋值',
            '/lc/防抖节流',
            '/lc/两数之和',
            '/lc/数组乱序',
            '/lc/数组去重',
            '/lc/类型判断',
            '/lc/日期格式化'
          ]
      },
      {
        title: '方法',
        children: [
          '/Fe/方法/undefined',
          '/Fe/方法/nullOrUndefined',
          '/Fe/方法/空对象'
        ]
      },
      {
        title: 'CSS',
        children:[
          '/Fe/css/三列布局',
          '/Fe/css/display',
          '/Fe/css/bfc'
        ]
      },
      {
        title: "小程序",
        children: [
            '/Fe/vue/使用Array.unshift.md',
            '/minip/关于setdata'
        ],
      },
    ],
    nav: [
      { text: "Note", link: "/Fe/" },
      { text: "Guide", link: "/guide/" },
      { text: "GitHub", link: "https://github.com/CruelPineapple" },
    ],
  },
};
