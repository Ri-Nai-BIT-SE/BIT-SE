<template>
  <div v-if="showHeader" class="page-header">
    <div class="page-header-content">
      <!-- 基本信息组 -->
      <div class="info-group basic-info">
        <div v-if="pageData.course" class="header-item course-info">
          <div class="header-label">课程</div>
          <div class="header-value">{{ pageData.course }}</div>
        </div>
        <div v-if="pageData.credit" class="header-item credit-info">
          <div class="header-label">学分</div>
          <div class="header-value">{{ pageData.credit }}</div>
        </div>
        <div v-if="pageData.semester" class="header-item semester-info">
          <div class="header-label">学期</div>
          <div class="header-value">{{ pageData.semester }}</div>
        </div>
        
        <div v-if="pageData.teacher" class="header-item teacher-info">
          <div class="header-label">教师</div>
          <div class="header-value">{{ pageData.teacher }}</div>
        </div>
        
        <div v-if="pageData.author" class="header-item author-info">
          <div class="header-label">作者</div>
          <div class="header-value">{{ pageData.author }}</div>
        </div>
        
        <div v-if="pageData.lastUpdated" class="header-item date-info">
          <div class="header-label">更新时间</div>
          <div class="header-value">{{ formatDate(pageData.lastUpdated) }}</div>
        </div>
      </div>
      
      <!-- 标签和属性组 -->
      <div class="info-group meta-info">
        <div v-if="pageData.tags && pageData.tags.length > 0" class="header-item tags-info full-width">
          <div class="header-label">标签</div>
          <div class="header-tags">
            <span v-for="tag in pageData.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        
        <div v-if="pageData.difficulty" class="header-item difficulty-info">
          <div class="header-label">难度</div>
          <div class="header-value" :class="`difficulty-${pageData.difficulty.toLowerCase()}`">
            {{ getDifficultyText(pageData.difficulty) }}
          </div>
        </div>
        
        <div v-if="pageData.status" class="header-item status-info">
          <div class="header-label">状态</div>
          <div class="header-value" :class="`status-${pageData.status.toLowerCase()}`">
            {{ getStatusText(pageData.status) }}
          </div>
        </div>
      </div>
      
      <!-- 评分组 -->
      <div v-if="pageData.courseRating || pageData.teacherRating" class="info-group rating-group">
        <div v-if="pageData.courseRating" class="header-item rating-info">
          <div class="header-label">课程评价</div>
          <div class="header-rating">
            <div class="stars">
              <span 
                v-for="star in 5" 
                :key="`course-${star}`" 
                class="star"
                :class="{ 'filled': getStarFilled(pageData.courseRating, star) }"
              >
                ★
              </span>
            </div>
            <span class="rating-score">{{ pageData.courseRating }}/10</span>
          </div>
        </div>
        
        <div v-if="pageData.teacherRating" class="header-item rating-info">
          <div class="header-label">老师评价</div>
          <div class="header-rating">
            <div class="stars">
              <span 
                v-for="star in 5" 
                :key="`teacher-${star}`" 
                class="star"
                :class="{ 'filled': getStarFilled(pageData.teacherRating, star) }"
              >
                ★
              </span>
            </div>
            <span class="rating-score">{{ pageData.teacherRating }}/10</span>
          </div>
        </div>
      </div>
      
      <!-- 成绩分布组 -->
      <div v-if="hasGradeData" class="info-group grade-group">
        <div v-if="pageData.grades?.maxScore" class="header-item grade-info">
          <div class="header-label">最高分</div>
          <div class="header-value grade-max">{{ pageData.grades.maxScore }}</div>
        </div>
        
        <div v-if="pageData.grades?.avgScore" class="header-item grade-info">
          <div class="header-label">平均分</div>
          <div class="header-value grade-avg">{{ pageData.grades.avgScore }}</div>
        </div>
        
        <div v-if="pageData.grades?.myScore" class="header-item grade-info">
          <div class="header-label">个人成绩</div>
          <div class="header-value grade-my" :class="getGradeClass(pageData.grades.myScore, pageData.grades.avgScore)">
            {{ pageData.grades.myScore }}
          </div>
        </div>
        
        <div v-if="pageData.grades?.classPercentile" class="header-item percentile-info">
          <div class="header-label">班级排名</div>
          <div class="header-value">
            <div class="percentile-display">
              <span class="percentile-text">前 {{ pageData.grades.classPercentile }}%</span>
              <div class="percentile-bar">
                <div class="percentile-fill" :style="{ width: `${100 - pageData.grades.classPercentile}%` }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="pageData.grades?.majorPercentile" class="header-item percentile-info">
          <div class="header-label">专业排名</div>
          <div class="header-value">
            <div class="percentile-display">
              <span class="percentile-text">前 {{ pageData.grades.majorPercentile }}%</span>
              <div class="percentile-bar">
                <div class="percentile-fill" :style="{ width: `${100 - pageData.grades.majorPercentile}%` }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="pageData.grades?.overallPercentile != null" class="header-item percentile-info">
          <div class="header-label">全校排名</div>
          <div class="header-value">
            <div class="percentile-display">
              <span class="percentile-text">前 {{ pageData.grades.overallPercentile }}%</span>
              <div class="percentile-bar">
                <div class="percentile-fill" :style="{ width: `${100 - pageData.grades.overallPercentile}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 资源链接组 -->
      <div v-if="hasResourceLinks" class="info-group resource-group">
        <div v-if="pageData.materialLinks && pageData.materialLinks.length > 0" class="header-item resource-info full-width">
          <div class="header-label">课程资料</div>
          <div class="header-links">
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
        
        <div v-if="pageData.noteLinks && pageData.noteLinks.length > 0" class="header-item resource-info full-width">
          <div class="header-label">课程笔记</div>
          <div class="header-links">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
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
  return grades && (grades.maxScore || grades.avgScore || grades.myScore || 
                   grades.classPercentile || grades.majorPercentile || grades.overallPercentile)
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
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.page-header-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 信息组样式 */
.info-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  align-items: center;
}

.info-group:not(:last-child) {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider-light);
}

/* 评分组特殊布局 */
.rating-group {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* 成绩组特殊布局 */
.grade-group {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* 基本项目样式 */
.header-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 24px;
  padding: 0.25rem 0;
}

.header-item.full-width {
  grid-column: 1 / -1;
}

.header-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  min-width: 50px;
}

.header-value {
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  flex: 1;
}

/* 标签样式 */
.header-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--vp-c-brand-lighter);
  color: var(--vp-c-brand-1);
  border-radius: 1rem;
  border: 1px solid var(--vp-c-brand-light);
  transition: all 0.2s ease;
}

.tag:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-1px);
}

/* 评分样式 */
.header-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.stars {
  display: flex;
  gap: 0.1rem;
}

.star {
  font-size: 1rem;
  color: #e5e7eb;
  transition: all 0.2s ease;
  cursor: default;
  line-height: 1;
}

.star.filled {
  color: #fbbf24;
}

.rating-score {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  font-weight: 600;
  background: var(--vp-c-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  border: 1px solid var(--vp-c-divider);
}

/* 成绩样式 */
.grade-max {
  color: #ef4444;
  font-weight: 700;
}

.grade-avg {
  color: #6b7280;
  font-weight: 600;
}

.grade-excellent {
  color: #10b981;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.grade-good {
  color: #3b82f6;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.grade-average {
  color: #f59e0b;
  font-weight: 600;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

.grade-below {
  color: #ef4444;
  font-weight: 600;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
}

/* 百分比样式 */
.percentile-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.percentile-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  min-width: 50px;
}

.percentile-bar {
  flex: 1;
  height: 8px;
  background: var(--vp-c-bg);
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

/* 难度样式 */
.difficulty-easy {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.difficulty-medium {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.difficulty-hard {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

/* 状态样式 */
.status-draft {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.status-published {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.status-archived {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.status-wip {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

/* 资源链接样式 */
.header-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex: 1;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  min-width: 120px;
}

.resource-link:hover {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-light);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.material-link:hover {
  background: rgba(59, 130, 246, 0.05);
  border-color: #3b82f6;
  color: #3b82f6;
}

.note-link:hover {
  background: rgba(16, 185, 129, 0.05);
  border-color: #10b981;
  color: #10b981;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }
  
  .page-header-content {
    gap: 1rem;
  }
  
  .info-group {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .rating-group,
  .grade-group {
    grid-template-columns: 1fr;
  }
  
  .header-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--vp-c-bg);
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider-light);
  }
  
  .header-label {
    min-width: auto;
    font-size: 0.8rem;
    color: var(--vp-c-text-3);
  }
  
  .header-value {
    font-size: 0.9rem;
  }
  
  .header-rating,
  .percentile-display {
    width: 100%;
    justify-content: space-between;
  }
  
  .header-links {
    gap: 0.5rem;
  }
  
  .resource-link {
    min-width: 100px;
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .header-tags {
    gap: 0.25rem;
  }
  
  .tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
  
  .star {
    font-size: 1rem;
  }
  
  .rating-score {
    font-size: 0.75rem;
  }
  
  .percentile-text {
    font-size: 0.7rem;
    min-width: 45px;
  }
  
  .percentile-bar {
    height: 6px;
  }
}
</style> 
