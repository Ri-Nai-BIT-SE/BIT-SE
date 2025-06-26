<template>
  <div v-if="showHeader" class="page-header">
    <!-- 课程标题 -->
    <h1 v-if="pageData.course" class="course-title">{{ pageData.course }}</h1>
    
    <!-- 基本信息标签 -->
    <div class="course-meta">
      <span v-if="pageData.semester" class="semester">{{ pageData.semester }}</span>
      <span v-if="pageData.credit" class="credit">{{ pageData.credit }}学分</span>
    </div>
    
    <!-- 描述 -->
    <div v-if="pageData.description" class="description">
      {{ pageData.description }}
    </div>
    
    <!-- 课程信息 -->
    <div class="course-info">
      <div v-if="pageData.teacher" class="info-item">
        <span class="info-label">👨‍🏫 教师：</span>
        <span class="info-value">{{ pageData.teacher }}</span>
      </div>
      <div v-if="pageData.author" class="info-item">
        <span class="info-label">✍️ 作者：</span>
        <span class="info-value">{{ pageData.author }}</span>
      </div>
      <div v-if="pageData.difficulty" class="info-item">
        <span class="info-label">📊 难度：</span>
        <span class="info-value" :class="`difficulty-${pageData.difficulty}`">
          {{ getDifficultyText(pageData.difficulty) }}
        </span>
      </div>
    </div>

    <!-- 评分 -->
    <div v-if="pageData.courseRating || pageData.teacherRating" class="ratings">
      <div v-if="pageData.courseRating" class="rating-item">
        <span class="rating-label">课程评分：</span>
        <div class="stars">
          <span
            v-for="i in 10"
            :key="i"
            class="star"
            :class="{ filled: i <= pageData.courseRating }"
          >
            ★
          </span>
        </div>
        <span class="rating-score">{{ pageData.courseRating }}/10</span>
      </div>
      <div v-if="pageData.teacherRating" class="rating-item">
        <span class="rating-label">教师评分：</span>
        <div class="stars">
          <span
            v-for="i in 10"
            :key="i"
            class="star"
            :class="{ filled: i <= pageData.teacherRating }"
          >
            ★
          </span>
        </div>
        <span class="rating-score">{{ pageData.teacherRating }}/10</span>
      </div>
    </div>

    <!-- 成绩信息 -->
    <div v-if="hasGradeData" class="grades">
      <div v-if="pageData.grades?.myScore" class="grade-item">
        <span class="grade-label">个人成绩：</span>
        <span class="grade-score my-score">{{ pageData.grades.myScore }}</span>
      </div>
      <div v-if="pageData.grades?.avgScore" class="grade-item">
        <span class="grade-label">平均分：</span>
        <span class="grade-score avg-score">{{ pageData.grades.avgScore }}</span>
      </div>
      <div v-if="pageData.grades?.maxScore" class="grade-item">
        <span class="grade-label">最高分：</span>
        <span class="grade-score max-score">{{ pageData.grades.maxScore }}</span>
      </div>
    </div>

    <!-- 排名信息 -->
    <div v-if="hasPercentileData" class="percentiles">
      <div v-if="pageData.grades?.classPercentile != null" class="percentile-item">
        <span class="percentile-label">班级排名：</span>
        <div class="percentile-display">
          <span class="percentile-text">前 {{ pageData.grades.classPercentile }}%</span>
          <div class="percentile-bar">
            <div class="percentile-fill" :style="{ width: `${100 - pageData.grades.classPercentile}%` }"></div>
          </div>
        </div>
      </div>
      <div v-if="pageData.grades?.majorPercentile != null" class="percentile-item">
        <span class="percentile-label">专业排名：</span>
        <div class="percentile-display">
          <span class="percentile-text">前 {{ pageData.grades.majorPercentile }}%</span>
          <div class="percentile-bar">
            <div class="percentile-fill" :style="{ width: `${100 - pageData.grades.majorPercentile}%` }"></div>
          </div>
        </div>
      </div>
      <div v-if="pageData.grades?.overallPercentile != null" class="percentile-item">
        <span class="percentile-label">全校排名：</span>
        <div class="percentile-display">
          <span class="percentile-text">前 {{ pageData.grades.overallPercentile }}%</span>
          <div class="percentile-bar">
            <div class="percentile-fill" :style="{ width: `${100 - pageData.grades.overallPercentile}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态信息 -->
    <div v-if="pageData.status" class="status-info">
      <span class="status-label">状态：</span>
      <span class="status-value" :class="`status-${pageData.status.toLowerCase()}`">
        {{ getStatusText(pageData.status) }}
      </span>
    </div>

    <!-- 资源链接 -->
    <div v-if="hasResourceLinks" class="resources">
      <div v-if="pageData.materialLinks?.length" class="resource-section">
        <h4 class="resource-title">📚 课程资料</h4>
        <div class="resource-links">
          <a
            v-for="link in pageData.materialLinks"
            :key="link.url"
            :href="link.url"
            :title="link.title"
            class="resource-link material-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="link-icon">📚</span>
            <span class="link-text">{{ link.title || link.url }}</span>
            <span class="link-external">↗</span>
          </a>
        </div>
      </div>
      
      <div v-if="pageData.noteLinks?.length" class="resource-section">
        <h4 class="resource-title">📝 课程笔记</h4>
        <div class="resource-links">
          <a
            v-for="link in pageData.noteLinks"
            :key="link.url"
            :href="link.url"
            :title="link.title"
            class="resource-link note-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="link-icon">📝</span>
            <span class="link-text">{{ link.title || link.url }}</span>
            <span class="link-external">↗</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 标签 -->
    <div v-if="pageData.tags?.length" class="course-tags">
      <a
        v-for="tag in pageData.tags"
        :key="tag"
        :href="withBase(`/articles.html?tag=${encodeURIComponent(tag)}`)"
        class="course-tag"
        :title="`查看所有「${tag}」相关课程`"
      >
        {{ tag }}
      </a>
    </div>

    <!-- 底部信息 -->
    <div class="footer-info">
      <div class="update-time">
        <span v-if="pageData.lastUpdated">
          最后更新：{{ formatDate(pageData.lastUpdated) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

const pageData = computed(() => page.value.frontmatter)

const showHeader = computed(() => {
  const fm = pageData.value
  return fm.course || fm.semester || fm.teacher || fm.author || fm.lastUpdated || 
         (fm.tags && fm.tags.length > 0) || fm.difficulty || fm.status ||
         fm.courseRating || fm.teacherRating || hasGradeData.value || hasResourceLinks.value
})

const hasGradeData = computed(() => {
  const grades = pageData.value.grades
  return grades && (grades.maxScore || grades.avgScore || grades.myScore)
})

const hasPercentileData = computed(() => {
  const grades = pageData.value.grades
  return grades && (grades.classPercentile != null || grades.majorPercentile != null || grades.overallPercentile != null)
})

const hasResourceLinks = computed(() => {
  const fm = pageData.value
  return (fm.materialLinks && fm.materialLinks.length > 0) || 
         (fm.noteLinks && fm.noteLinks.length > 0)
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const getDifficultyText = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    'easy': '简单',
    'medium': '中等',
    'hard': '困难'
  }
  return difficultyMap[difficulty.toLowerCase()] || difficulty
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': '草稿',
    'published': '已发布',
    'archived': '已归档',
    'wip': '进行中'
  }
  return statusMap[status.toLowerCase()] || status
}

// 计算星星是否应该被填充（满分10分对应5颗星）
const getStarFilled = (rating: number, starIndex: number) => {
  const starValue = (rating / 10) * 5 // 将10分制转换为5星制
  return starIndex <= Math.ceil(starValue)
}

// 根据个人成绩与平均分比较返回样式类
const getGradeClass = (myScore: number, avgScore: number) => {
  if (!avgScore) return ''
  if (myScore >= avgScore * 1.1) return 'grade-excellent'
  if (myScore >= avgScore) return 'grade-good'
  if (myScore >= avgScore * 0.8) return 'grade-average'
  return 'grade-below'
}
</script>

<style scoped>
.page-header {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.page-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand-1);
}

.course-title {
  font-size: 1.8rem;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
  font-weight: 700;
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.semester {
  background: var(--vp-c-brand-lighter);
  color: var(--vp-c-brand-1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.credit {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.description {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 1rem;
}

.course-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.info-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.info-value {
  color: var(--vp-c-text-1);
  font-weight: 500;
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
  font-size: 0.95rem;
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
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-weight: 600;
  margin-left: 0.5rem;
}

.grades {
  margin-bottom: 1rem;
}

.grade-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.grade-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.grade-score {
  font-weight: 700;
  font-size: 1.1rem;
}

.my-score {
  color: #10b981;
}

.avg-score {
  color: #6b7280;
}

.max-score {
  color: #ef4444;
}

.percentiles {
  margin-bottom: 1rem;
}

.percentile-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.percentile-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.percentile-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  max-width: 250px;
}

.percentile-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  min-width: 60px;
}

.percentile-bar {
  flex: 1;
  height: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.percentile-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.status-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.status-label {
  font-weight: 500;
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.status-value {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.status-draft {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
}

.status-published {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.status-archived {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.status-wip {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.resources {
  margin-bottom: 1rem;
}

.resource-section {
  margin-bottom: 1rem;
}

.resource-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.resource-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  min-width: 120px;
}

.resource-link:hover {
  background: var(--vp-c-bg);
  border-color: var(--vp-c-brand-light);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.material-link {
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.material-link:hover {
  background: rgba(59, 130, 246, 0.05);
  border-color: #3b82f6;
}

.note-link {
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.note-link:hover {
  background: rgba(16, 185, 129, 0.05);
  border-color: #10b981;
}

.link-icon {
  font-size: 1rem;
  line-height: 1;
}

.link-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-external {
  font-size: 0.75rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.resource-link:hover .link-external {
  opacity: 1;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.course-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-lighter);
  color: var(--vp-c-brand-1);
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid transparent;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.course-tag:hover {
  background: var(--vp-c-brand-1);
  color: white;
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.update-time {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }
  
  .course-title {
    font-size: 1.5rem;
  }
  
  .course-meta {
    /* 保持水平布局，让标签保持胶囊形状 */
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .course-tags {
    gap: 0.25rem;
  }
  
  .course-tag {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
  }
  
  /* 保持信息项的水平布局，不换行 */
  .info-item,
  .rating-item,
  .grade-item,
  .percentile-item {
    /* 保持水平布局 */
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  
  .info-label,
  .rating-label,
  .grade-label,
  .percentile-label {
    min-width: 70px;
    font-size: 0.85rem;
  }
  
  /* 优化百分比显示，不要拉满 */
  .percentile-display {
    max-width: 200px;
  }
  
  .percentile-text {
    min-width: 50px;
    font-size: 0.8rem;
  }
  
  .percentile-bar {
    max-width: 120px;
  }
  
  /* 移动端按钮优化 */
  .resource-links {
    gap: 0.5rem;
  }
  
  .resource-link {
    min-width: 120px;
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style> 
