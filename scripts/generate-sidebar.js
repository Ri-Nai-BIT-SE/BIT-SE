import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 递归读取目录结构并生成VitePress侧边栏配置
 * @param {string} dirPath 目录路径
 * @param {string} basePath 基础路径用于生成链接
 * @returns {Array} 侧边栏配置数组
 */
function generateSidebarFromDir(dirPath, basePath = '') {
  const items = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    // 对条目进行排序，确保目录在前，文件在后
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name, 'zh-CN');
    });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const linkPath = path.join(basePath, entry.name).replace(/\\/g, '/');
      
      if (entry.isDirectory()) {
        // 递归处理子目录
        const subItems = generateSidebarFromDir(fullPath, linkPath);
        const indexPath = path.join(fullPath, 'index.md');
        const hasIndex = fs.existsSync(indexPath);
        
        if (subItems.length > 0) {
          const item = {
            text: entry.name,
            collapsed: true,
            items: subItems
          };
          
          // 如果目录有 index.md，添加链接
          if (hasIndex) {
            item.link = `/${linkPath}/`;
          }
          
          items.push(item);
        } else if (hasIndex) {
          // 如果子目录为空但有 index.md
          items.push({
            text: entry.name,
            link: `/${linkPath}/`
          });
        }
      } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
        // 处理 markdown 文件
        const fileName = entry.name.replace('.md', '');
        items.push({
          text: fileName,
          link: `/${linkPath.replace('.md', '')}`
        });
      }
    }
  } catch (error) {
    console.error(`读取目录 ${dirPath} 时出错:`, error.message);
  }
  
  return items;
}

/**
 * 生成完整的侧边栏配置
 */
function generateFullSidebar() {
  const docsPath = path.join(__dirname, '../docs');
  const sidebar = [];
  
  // 自动生成课程目录
  const courseItems = generateSidebarFromDir(docsPath);
  
  // 按学期分组
  const semesters = ['大一上', '大一下', '大二上', '大二下'];
  
  for (const semester of semesters) {
    const semesterItem = courseItems.find(item => item.text === semester);
    if (semesterItem) {
      sidebar.push(semesterItem);
    }
  }
  
  return sidebar;
}

/**
 * 生成侧边栏数据文件
 */
function generateSidebarDataFile() {
  const sidebar = generateFullSidebar();
  
  const dataContent = `// 此文件由 scripts/generate-sidebar.js 自动生成
// 请不要手动修改此文件

export const sidebarData = ${JSON.stringify(sidebar, null, 2)}
`;
  
  const outputPath = path.join(__dirname, '../.vitepress/data/sidebar.js');
  
  // 确保目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, dataContent, 'utf-8');
  
  console.log(`✅ 已生成侧边栏数据文件: ${outputPath}`);
  console.log(`📊 共生成 ${sidebar.length} 个主要学期分组`);
  
  if (sidebar.length > 0) {
    console.log('📚 侧边栏结构:');
    sidebar.forEach(item => {
      console.log(`  - ${item.text} (${item.items ? item.items.length : 0} 个子项)`);
    });
  }
  
  return sidebar;
}

// 如果直接运行此脚本
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, '/'))) {
  console.log('🚀 开始生成侧边栏数据...');
  try {
    generateSidebarDataFile();
  } catch (error) {
    console.error('❌ 生成侧边栏数据失败:', error.message);
    process.exit(1);
  }
}

export {
  generateSidebarFromDir,
  generateFullSidebar,
  generateSidebarDataFile
} 
