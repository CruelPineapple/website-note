module.exports = {
  base: "/note/",
  title: "Rice Shower",
  description: "一马当先，万马无光",
  themeConfig: {
    sidebar: [
      {
        title: "Vue",
        children: [
            "/Fe/关于mounted的bug",
            "/Fe/element事件绑定",
            "/Fe/分页展示"
        ],
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
        title: "小程序",
        children: [
            '/Fe/使用Array.unshift.md',
            '/minip/关于setdata'
        ],
      },
      {
          title:"力扣笔记",
          children:['/lc/雪糕']
      }
    ],
    nav: [
      { text: "Note", link: "/Fe/" },
      { text: "Guide", link: "/guide/" },
      { text: "GitHub", link: "https://github.com/CruelPineapple" },
    ],
  },
};
