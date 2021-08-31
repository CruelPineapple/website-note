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
            "/Fe/Number",
            "/Fe/parseInt.md",
            "/Fe/String",
            "/Fe/apply和参数",
            "/Fe/Array",
            "/Fe/RegExp",
            "/Fe/Function",
            "/Fe/基本包装类型",
            "/Fe/单体内置对象",
            "/Fe/对象基础",
            "/Fe/创建对象",
            "/Fe/原型",
            "/Fe/继承和原型链",
            "/Fe/其他继承",
            "/Fe/7函数表达式/闭包",
            "/Fe/7函数表达式/this",
            "/Fe/7函数表达式/模仿块级作用域",
            "/Fe/7函数表达式/私有变量"
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
