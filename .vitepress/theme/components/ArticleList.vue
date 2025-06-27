<template>
  <div class="article-list-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>📚 课程列表</h1>
      <p class="page-description">浏览所有已发布的课程资料，支持按标签筛选</p>
    </div>

    <!-- 统计信息 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">总课程数：</span>
        <span class="stat-value">{{ articles.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">显示课程数：</span>
        <span class="stat-value">{{ filteredArticles.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">总标签数：</span>
        <span class="stat-value">{{ allTags.length }}</span>
      </div>
    </div>

      <!-- 标签筛选器 -->
      <div class="filter-section">
        <h3>🏷️ 标签筛选</h3>
        <div class="tag-filters">
          <button 
            class="tag-filter" 
            :class="{ active: selectedTags.length === 0 }"
            @click="clearFilters"
          >
            全部 ({{ articles.length }})
          </button>
          <button
            v-for="tag in allTags"
            :key="tag.name"
            class="tag-filter"
            :class="{ active: selectedTags.includes(tag.name) }"
            @click="toggleTag(tag.name)"
          >
            {{ tag.name }} ({{ tag.count }})
          </button>
        </div>
        
        <!-- 已选标签 -->
        <div v-if="selectedTags.length > 0" class="selected-tags">
          <span class="selected-label">已选标签：</span>
          <span
            v-for="tag in selectedTags"
            :key="tag"
            class="selected-tag"
            @click="removeTag(tag)"
          >
            {{ tag }} ×
          </span>
          <button class="clear-all" @click="clearFilters">清空</button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="articles-grid">
        <div
          v-for="article in filteredArticles"
          :key="article.url"
          class="article-card"
        >
          <div class="card-header">
            <h3 class="course-title">
              <a :href="withBase(article.url)" class="course-link">
                {{ article.frontmatter.course }}
              </a>
            </h3>
            <div class="course-meta">
              <span v-if="article.frontmatter.semester" class="semester">
                {{ article.frontmatter.semester }}
              </span>
              <span v-if="article.frontmatter.credit" class="credit">
                {{ article.frontmatter.credit }}学分
              </span>
            </div>
          </div>

          <div class="card-content">
            <div v-if="article.frontmatter.description" class="description">
              {{ article.frontmatter.description }}
            </div>
            
            <div class="course-info">
              <div v-if="article.frontmatter.teacher" class="info-item">
                <span class="info-label">👨‍🏫 教师：</span>
                <span class="info-value">{{ article.frontmatter.teacher }}</span>
              </div>
              <div v-if="article.frontmatter.author" class="info-item">
                <span class="info-label">✍️ 作者：</span>
                <span class="info-value">{{ article.frontmatter.author }}</span>
              </div>
              <div v-if="article.frontmatter.difficulty" class="info-item">
                <span class="info-label">📊 难度：</span>
                <span class="info-value" :class="`difficulty-${article.frontmatter.difficulty}`">
                  {{ getDifficultyText(article.frontmatter.difficulty) }}
                </span>
              </div>
            </div>

            <!-- 评分 -->
            <div v-if="article.frontmatter.courseRating != null || article.frontmatter.teacherRating != null" class="ratings">
              <div v-if="article.frontmatter.courseRating != null" class="rating-item">
                <span class="rating-label">课程评分：</span>
                <div class="stars">
                  <span
                    v-for="i in 10"
                    :key="i"
                    class="star"
                    :class="{ filled: i <= article.frontmatter.courseRating }"
                  >
                    ★
                  </span>
                </div>
                <span class="rating-score">{{ article.frontmatter.courseRating }}/10</span>
              </div>
              <div v-if="article.frontmatter.teacherRating != null" class="rating-item">
                <span class="rating-label">教师评分：</span>
                <div class="stars">
                  <span
                    v-for="i in 10"
                    :key="i"
                    class="star"
                    :class="{ filled: i <= article.frontmatter.teacherRating }"
                  >
                    ★
                  </span>
                </div>
                <span class="rating-score">{{ article.frontmatter.teacherRating }}/10</span>
              </div>
            </div>

            <!-- 成绩信息 -->
            <div v-if="article.frontmatter.grades?.myScore" class="grades">
              <div class="grade-item">
                <span class="grade-label">个人成绩：</span>
                <span class="grade-score my-score">{{ article.frontmatter.grades.myScore }}</span>
              </div>
              <div v-if="article.frontmatter.grades.avgScore" class="grade-item">
                <span class="grade-label">平均分：</span>
                <span class="grade-score avg-score">{{ article.frontmatter.grades.avgScore }}</span>
              </div>
            </div>

            <!-- 标签 -->
            <div v-if="article.frontmatter.tags?.length" class="article-tags">
              <span
                v-for="tag in article.frontmatter.tags"
                :key="tag"
                class="article-tag"
                @click="addTag(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="update-time">
              <span v-if="article.frontmatter.lastUpdated">
                最后更新：{{ formatDate(article.frontmatter.lastUpdated) }}
              </span>
            </div>
            <a :href="withBase(article.url)" class="view-link">
              查看详情 →
            </a>
          </div>
        </div>
      </div>

    <!-- 空状态 -->
    <div v-if="filteredArticles.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>没有找到匹配的课程</h3>
      <p>尝试调整筛选条件或<button @click="clearFilters" class="link-button">清空所有筛选</button></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { articlesData } from '../../data/articles.js'
import { withBase } from 'vitepress'

// 类型定义
export interface ArticleData {
  url: string
  frontmatter: {
    course?: string
    title?: string
    description?: string
    tags?: string[]
    semester?: string
    teacher?: string
    author?: string
    difficulty?: string
    status?: string
    courseRating?: number
    teacherRating?: number
    credit?: number
    date?: string
    lastUpdated?: string
    grades?: {
      maxScore?: number
      avgScore?: number
      myScore?: number
      classPercentile?: number
      majorPercentile?: number
      overallPercentile?: number
    }
    materialLinks?: Array<{
      url: string
      title: string
    }>
    noteLinks?: Array<{
      url: string
      title: string
    }>
  }
}

// 使用导入的数据
const articles = articlesData

const selectedTags = ref<string[]>([])

// 从URL参数中读取标签
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const tagParam = urlParams.get('tag')
  if (tagParam) {
    selectedTags.value = [tagParam]
  }
})

// 计算所有标签及其数量
const allTags = computed(() => {
  const tagMap = new Map<string, number>()
  
  articles.forEach(article => {
    article.frontmatter.tags?.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// 筛选后的文章
const filteredArticles = computed(() => {
  if (selectedTags.value.length === 0) {
    return articles
  }
  
  return articles.filter(article => {
    return selectedTags.value.every(selectedTag => 
      article.frontmatter.tags?.includes(selectedTag)
    )
  })
})

// 标签操作
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const addTag = (tag: string) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
}

const removeTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
}

const clearFilters = () => {
  selectedTags.value = []
}

// 工具函数
const getDifficultyText = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return difficultyMap[difficulty] || difficulty
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.article-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.stats-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--vp-c-brand-1);
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section h3 {
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.tag-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag-filter {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.tag-filter:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-lighter);
}

.tag-filter.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.selected-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.selected-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.selected-tag {
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selected-tag:hover {
  background: var(--vp-c-brand-dark);
}

.clear-all {
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-danger);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-all:hover {
  background: var(--vp-c-danger-dark);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.article-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand-1);
}

.card-header {
  margin-bottom: 1rem;
}

.course-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}

.course-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s ease;
}

.course-link:hover {
  color: var(--vp-c-brand-1);
}

.course-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.semester {
  background: var(--vp-c-brand-lighter);
  color: var(--vp-c-brand-1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.credit {
  background: var(--vp-c-bg-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.card-content {
  margin-bottom: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.description {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.course-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.info-value {
  color: var(--vp-c-text-1);
}

.difficulty-easy {
  color: #10b981;
  font-weight: 600;
}

.difficulty-medium {
  color: #f59e0b;
  font-weight: 600;
}

.difficulty-hard {
  color: #ef4444;
  font-weight: 600;
}

.ratings {
  margin-bottom: 1rem;
}

.rating-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.rating-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.stars {
  display: flex;
  gap: 0.1rem;
}

.star {
  font-size: 0.8rem;
  color: #e5e7eb;
  transition: all 0.2s ease;
}

.star.filled {
  color: #fbbf24;
}

.rating-score {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.grades {
  margin-bottom: 1rem;
}

.grade-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.grade-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.grade-score {
  font-weight: 700;
  font-size: 1rem;
}

.my-score {
  color: #10b981;
}

.avg-score {
  color: #6b7280;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  margin-bottom: 0;
}

.article-tag {
  padding: 0.25rem 0.5rem;
  background: var(--vp-c-brand-lighter);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.article-tag:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.update-time {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.view-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.view-link:hover {
  color: var(--vp-c-brand-dark);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.link-button {
  background: none;
  border: none;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.link-button:hover {
  color: var(--vp-c-brand-dark);
}

@media (max-width: 768px) {
  .article-list-container {
    padding: 1rem 0.5rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .stats-bar {
    flex-direction: column;
    gap: 1rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .article-card {
    padding: 1rem;
  }
  
  .tag-filters {
    gap: 0.25rem;
  }
  
  .tag-filter {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style> 
