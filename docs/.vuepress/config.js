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
        title: "小程序",
        children: [
            '/Fe/使用Array.unshift.md',
            '/minip/关于setdata'
        ],
      },
      {
          title:"题",
          children:[
            '/lc/排序',
            '/lc/周期执行函数',
            '/lc/URL拆解'
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
