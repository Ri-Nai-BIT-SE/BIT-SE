import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 递归遍历目录，获取所有markdown文件
 */
function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList)
    } else if (file.endsWith('.md')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

/**
 * 处理markdown文件，提取frontmatter
 */
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const { data: frontmatter } = matter(content)
  
  // 生成URL路径
  const relativePath = path.relative('docs', filePath)
  const url = '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '/').replace(/\/index\/$/, '/')
  
  return {
    url,
    frontmatter
  }
}

/**
 * 生成文章数据
 */
function generateArticlesData() {
  const docsDir = path.join(__dirname, '../docs')
  const markdownFiles = getAllMarkdownFiles(docsDir)
  
  const articles = markdownFiles
    .map(processMarkdownFile)
    .filter(page => {
      // 过滤条件：
      // 1. 不是首页、关于页面、文章列表页面
      // 2. 必须有course字段（课程页面的标识）
      // 3. 状态必须是published
      return page.url !== '/' && 
             page.url !== '/about/' && 
             page.url !== '/articles/' &&
             page.frontmatter.course && 
             page.frontmatter.status === 'published'
    })
    .sort((a, b) => {
      // 按学期和课程名排序
      const semesterOrder = ['大一上', '大一下', '大二上', '大二下', '大三上', '大三下', '大四上', '大四下']
      const aSemesterIndex = semesterOrder.indexOf(a.frontmatter.semester || '')
      const bSemesterIndex = semesterOrder.indexOf(b.frontmatter.semester || '')
      
      if (aSemesterIndex !== bSemesterIndex) {
        return aSemesterIndex - bSemesterIndex
      }
      
      // 如果学期相同，按课程名称排序
      return (a.frontmatter.course || '').localeCompare(b.frontmatter.course || '', 'zh-CN')
    })
  
  return articles
}

/**
 * 生成数据文件
 */
function generateDataFile() {
  const articles = generateArticlesData()
  
  const dataContent = `// 此文件由 scripts/generate-articles-data.js 自动生成
// 请不要手动修改此文件

export const articlesData = ${JSON.stringify(articles, null, 2)}
`
  
  const outputPath = path.join(__dirname, '../.vitepress/theme/data/articles.js')
  
  // 确保目录存在
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  fs.writeFileSync(outputPath, dataContent, 'utf-8')
  
  console.log(`✅ 已生成文章数据文件: ${outputPath}`)
  console.log(`📊 共找到 ${articles.length} 篇已发布的课程文章`)
  
  if (articles.length > 0) {
    console.log('📚 文章列表:')
    articles.forEach(article => {
      console.log(`  - ${article.frontmatter.course} (${article.frontmatter.semester})`)
    })
  }
}

// 如果直接运行此脚本
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, '/'))) {
  try {
    generateDataFile()
  } catch (error) {
    console.error('❌ 生成文章数据失败:', error.message)
    process.exit(1)
  }
}

export { generateArticlesData, generateDataFile } 
