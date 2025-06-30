// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PageHeader from './components/PageHeader.vue'
import ArticleList from './components/ArticleList.vue'
import GiscusComment from './components/GiscusComment.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-before': () => h(PageHeader),
      'doc-after': () => h(GiscusComment)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('PageHeader', PageHeader)
    app.component('ArticleList', ArticleList)
    app.component('GiscusComment', GiscusComment)
  }
} satisfies Theme
