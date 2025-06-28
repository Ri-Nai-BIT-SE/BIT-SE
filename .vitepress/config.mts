import { defineConfig } from 'vitepress'
import { sidebarData } from './data/sidebar.js'

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
      { text: '文章', link: '/articles' },
      { text: '关于', link: '/about' }
    ],

    sidebar: sidebarData,
    outline: [2, 5],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Ri-Nai-BIT-SE/BIT-SE' }
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
