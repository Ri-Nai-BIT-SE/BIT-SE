<template>
  <div class="waline-wrapper">
    <Waline
      :serverURL="serverURL"
      :path="path"
      :lang="lang"
      :meta="meta"
      :requiredMeta="requiredMeta"
      :avatar="avatar"
      :pageSize="pageSize"
      :search="search"
      :reaction="reaction"
      :emoji="emoji"
      :imageUploader="imageUploader"
      :highlighter="highlighter"
      :texRenderer="texRenderer"
      :copyright="copyright"
      :login="login"
      :wordLimit="wordLimit"
      :requiredFields="requiredFields"
      :level="level"
      :pageview="pageview"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { Waline } from '@waline/client/component'
import '@waline/client/style'

// Waline 服务器配置
// 请替换为你自己的 Waline 服务器地址
// 临时测试可以使用: https://waline.vercel.app/
const serverURL = 'https://waline.vercel.app/'

// 获取当前路由路径
const route = useRoute()
const path = computed(() => route.path)

// Waline 基础配置
const lang = 'zh-CN'
const meta = ['nick', 'mail', 'link']
const requiredMeta = ['nick']
const avatar = 'retro'
const pageSize = 10
const search = false

// 表情投票功能（和 guide 项目保持一致）
const reaction = true

// 高级功能配置
const emoji = true              // 支持表情符号输入
const imageUploader = true      // 支持图片上传
const highlighter = true       // 代码高亮
const texRenderer = false      // 数学公式渲染 (可选: 'mathjax', 'katex', false)
const copyright = true         // 版权信息显示
const login = 'enable'         // 登录模式: 'enable'(可选登录), 'disable'(禁用), 'force'(强制登录)

// 安全配置
const wordLimit = [0, 1000]    // 评论字数限制 [最少, 最多]
const requiredFields = ['nick'] // 必填字段

// 等级标签配置（根据评论数量显示用户等级）
const level = [0, 10, 20, 50, 100, 200] // 等级判断标准

// 页面浏览量统计
const pageview = true
</script>

<style scoped>
.waline-wrapper {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* 自定义 Waline 样式 */
:deep(.wl-panel) {
  margin: 16px 0 0;
}

:deep([data-waline]) {
  --waline-font-size: 16px;
  --waline-theme-color: var(--vp-c-brand-1);
  --waline-text-color: var(--vp-c-text-1);
  --waline-bgcolor: var(--vp-c-bg);
  --waline-bgcolor-light: var(--vp-c-bg-soft);
  --waline-border-color: var(--vp-c-divider);
}
</style> 