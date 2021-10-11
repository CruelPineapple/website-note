module.exports = {
  base: "/note/",
  title: "一个云鬼",
  description: "我悲痛欲绝，跳进了家门口的井里",
  themeConfig: {
    sidebar: [
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
            "/Fe/红宝书/map",
            "/Fe/红宝书/set",
            "/Fe/红宝书/reflect",
            "/Fe/红宝书/遍历器",
            "/Fe/红宝书/生成器",
            "/Fe/红宝书/async",
            "/Fe/红宝书/promise",
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
        title: "React",
        children: [
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
            "/Fe/vue/关于mounted的bug",
            "/Fe/vue/element事件绑定",
            "/Fe/vue/分页展示"
        ],
      },
      {
        title: "基础",
        children: [
          '/base/tcp拥塞'
        ]
      },
      {
        title: "小程序",
        children: [
            '/Fe/vue/使用Array.unshift.md',
            '/minip/关于setdata'
        ],
      },
      {
        title: '我不知道的JS',
        children: [
          '/Fe/不js/函数作用域',
          '/Fe/不js/块作用域',
          '/Fe/不js/提升',
          '/Fe/不js/闭包',
          '/Fe/不js/模块'
        ]
      },
      {
          title:"题",
          children:[
            '/lc/排序',
            '/lc/周期执行函数',
            '/lc/URL拆解',
            '/lc/HTTPheader',
            '/lc/数组转树',
            '/lc/数组扁平化',
            '/lc/深浅拷贝',
            '/lc/bind和new',
            '/lc/instanceof',
            '/lc/promiseAll',
            '/lc/防抖节流',
            '/lc/两数之和'
          ]
      }
    ],
    nav: [
      { text: "Note", link: "/Fe/" },
      { text: "Guide", link: "/guide/" },
      { text: "GitHub", link: "https://github.com/CruelPineapple" },
    ],
  },
};
