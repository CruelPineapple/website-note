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
            "/Fe/element事件绑定"
        ],
      },
      {
        title: "红宝书笔记",
        children: ["/Fe/parseInt.md"],
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
