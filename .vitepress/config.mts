import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "BIT-SE",
  description: "北京理工大学软件工程专业课程资料",
  base: '/BIT-SE/',
  srcDir: "docs",

  head: [
    ['link', { rel: 'icon', href: '/BIT-SE/favicon.ico' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' },
      { text: '文章', link: '/articles' }
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
      },
      {
        text: '大一下',
        collapsed: true,
        items: [
          {
            text: 'C语言程序设计',
            link: '/大一下/C语言程序设计/'
          }
        ]
      },
      {
        text: '大二上',
        link: '/大二上/'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/BIT-SE' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  }
})
