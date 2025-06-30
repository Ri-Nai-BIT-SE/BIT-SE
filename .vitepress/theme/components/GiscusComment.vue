<template>
  <div class="giscus-wrapper">
    <div ref="giscusContainer" class="giscus-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { isDark } = useData()
const giscusContainer = ref<HTMLElement>()

// Giscus 配置
const giscusConfig = {
  repo: 'Ri-Nai-BIT-SE/BIT-SE',
  repoId: 'R_kgDOOakrAw',
  category: 'Announcements',
  categoryId: 'DIC_kwDOOakrA84CsQ67',
  mapping: 'url',
  strict: '1',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'zh-CN'
}

// 加载 Giscus 脚本
const loadGiscus = () => {
  if (!giscusContainer.value) return

  // 清除之前的 Giscus 实例
  giscusContainer.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', giscusConfig.repo)
  script.setAttribute('data-repo-id', giscusConfig.repoId)
  script.setAttribute('data-category', giscusConfig.category)
  script.setAttribute('data-category-id', giscusConfig.categoryId)
  script.setAttribute('data-mapping', giscusConfig.mapping)
  script.setAttribute('data-strict', giscusConfig.strict)
  script.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled)
  script.setAttribute('data-emit-metadata', giscusConfig.emitMetadata)
  script.setAttribute('data-input-position', giscusConfig.inputPosition)
  script.setAttribute('data-theme', isDark.value ? 'catppuccin_mocha' : 'catppuccin_latte')
  script.setAttribute('data-lang', giscusConfig.lang)
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  giscusContainer.value.appendChild(script)
}

// 切换主题时更新 Giscus 主题
const updateGiscusTheme = () => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (iframe) {
    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: isDark.value ? 'catppuccin_mocha' : 'catppuccin_latte'
          }
        }
      },
      'https://giscus.app'
    )
  }
}

onMounted(() => {
  loadGiscus()
})

// 监听路由变化，重新加载 Giscus
watch(
  () => route.path,
  () => {
    setTimeout(() => {
      loadGiscus()
    }, 100)
  }
)

// 监听主题变化
watch(isDark, () => {
  updateGiscusTheme()
})
</script>

<style scoped>
.giscus-wrapper {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.giscus-container {
  width: 100%;
}

/* 确保样式与 VitePress 主题一致 */
:deep(.giscus) {
  --giscus-primary-color: var(--vp-c-brand-1);
}
</style>
