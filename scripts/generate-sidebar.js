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
        
        if (subItems.length > 0) {
          items.push({
            text: entry.name,
            collapsed: true,
            items: subItems
          });
        } else {
          // 如果子目录为空，检查是否有 index.md
          const indexPath = path.join(fullPath, 'index.md');
          if (fs.existsSync(indexPath)) {
            items.push({
              text: entry.name,
              link: `/${linkPath}/`
            });
          }
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
 * 更新 VitePress 配置文件
 */
function updateConfig() {
  const configPath = path.join(__dirname, '../.vitepress/config.mts');
  const sidebar = generateFullSidebar();
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // 将侧边栏配置转换为字符串
    const sidebarStr = JSON.stringify(sidebar, null, 6)
      .replace(/"([^"]+)":/g, '$1:') // 移除属性名的引号
      .replace(/"/g, "'");          // 使用单引号
    
      // 替换现有的 sidebar 配置
  // 使用函数来正确匹配嵌套的方括号
  function replaceSidebar(content) {
    const sidebarMatch = content.match(/sidebar:\s*\[/);
    if (!sidebarMatch) {
      return null;
    }
    
    let start = sidebarMatch.index + sidebarMatch[0].length - 1; // 指向开始的 '['
    let depth = 0;
    let end = start;
    
    // 从开始的 '[' 位置开始，找到匹配的 ']'
    for (let i = start; i < content.length; i++) {
      if (content[i] === '[') {
        depth++;
      } else if (content[i] === ']') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    
    if (depth === 0) {
      // 找到了匹配的结束位置
      const before = content.substring(0, sidebarMatch.index);
      const after = content.substring(end + 1);
      return before + `sidebar: ${sidebarStr}` + after;
    }
    
    return null;
  }
  
  const updatedContent = replaceSidebar(configContent);
  if (updatedContent) {
    configContent = updatedContent;
  } else {
    // 如果没有找到现有的 sidebar，在 themeConfig 中添加
    configContent = configContent.replace(
      /(themeConfig:\s*{[\s\S]*?nav:\s*\[[\s\S]*?\],?)/,
      `$1\n\n    sidebar: ${sidebarStr},`
    );
  }
    
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('✅ 侧边栏配置已更新到 .vitepress/config.mts');
    
    // 输出生成的配置供查看
    console.log('\n📋 生成的侧边栏配置:');
    console.log(JSON.stringify(sidebar, null, 2));
    
  } catch (error) {
    console.error('❌ 更新配置文件时出错:', error.message);
  }
}

// 如果直接运行此脚本
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, '/'))) {
  console.log('🚀 开始生成侧边栏配置...');
  updateConfig();
}

export {
  generateSidebarFromDir,
  generateFullSidebar,
  updateConfig
} 
