import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "BIT-SE",
  srcDir: './docs',
  base: '/BIT-SE/',
  description: "北京理工大学软件工程专业仓库",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
            text: '大一上',
            collapsed: true,
            items: [
                  {
                        text: '工科数学分析I',
                        link: '/大一上/工科数学分析I/'
                  },
                  {
                        text: '线性代数B',
                        link: '/大一上/线性代数B/'
                  }
            ]
      }
],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
