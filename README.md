# 📚 BIT-SE

> 北京理工大学软件工程课程资料仓库

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://ri-nai-bit-se.github.io/BIT-SE/)
[![License](https://img.shields.io/github/license/Ri-Nai/BIT-SE)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/Ri-Nai/BIT-SE)](https://github.com/Ri-Nai/BIT-SE/stargazers)

## 🌟 项目简介

本项目是北京理工大学软件工程专业的课程资料仓库，致力于打破信息差，为 BIT-SE 的同学们提供学习资源和参考资料。

### 🏫 **Beijing Institute of Technology (BIT)**
北京理工大学

### 💻 **Software Engineering (SE)**
软件工程专业

## 🚀 在线访问

**📖 文档网站**: [https://ri-nai-bit-se.github.io/BIT-SE/](https://ri-nai-bit-se.github.io/BIT-SE/)

## 📁 项目结构

```
BIT-SE/
├── docs/                   # 文档源文件
│   ├── 大一上/            # 大一上学期课程
│   ├── 大一下/            # 大一下学期课程
│   ├── 大二上/            # 大二上学期课程
│   └── 大二下/            # 大二下学期课程
├── scripts/               # 构建脚本
│   ├── generate-articles-data.js
│   └── generate-sidebar.js
├── package.json           # 项目依赖配置
└── README.md             # 项目说明文档
```

## 🛠️ 技术栈

- **文档框架**: [VitePress](https://vitepress.dev/) - 基于 Vite 和 Vue 的静态站点生成器
- **部署平台**: GitHub Pages
- **包管理器**: pnpm

## 💻 本地开发

### 环境要求

- Node.js >= 16
- pnpm

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
# 启动开发服务器
pnpm run docs:dev

# 生成数据并启动开发服务器
pnpm run generate-data
```

### 构建部署

```bash
# 构建生产版本
pnpm run docs:build

# 预览构建结果
pnpm run docs:preview
```

## 📚 课程资源

### 📥 资料下载

由于 Git 仓库不适合存放大量二进制文件（如课件、试卷、教材等），这些资料已上传至 [GitHub Releases](https://github.com/Ri-Nai/BIT-SE/releases)，请前往下载。

### 🔗 相关仓库

项目中涉及的课程代码和项目已分别存储在独立仓库中：

- **编程题代码**: [BIT-Lexue-Code](https://github.com/Ri-Nai/BIT-Lexue-Code)
- **Portal 2D 项目**: [Portal-2D](https://github.com/Ri-Nai/Portal-2D)
- **面向对象程序设计**: [BIT-OOP-Java](https://github.com/Ri-Nai/BIT-OOP-Java)
- **数据库课程**: [BIT-Database-zxl](https://github.com/Ri-Nai/BIT-Database-zxl)

## 🤝 贡献指南

欢迎同学们为项目贡献资料和改进建议！

### 如何贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 贡献内容

- 课程笔记和总结
- 实验报告和作业
- 学习心得和经验分享
- 项目优化和 Bug 修复

## ⚠️ 免责声明

> **重要提醒**: 本项目仅供学习交流使用，严禁用于商业用途。拿开源资料卖钱的行为是不被允许的！

- 本仓库内容仅供参考，请勿直接抄袭
- 使用本仓库资料时请遵守学术诚信原则
- 如有侵权问题，请及时联系删除

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 许可证。

## 🙏 致谢

感谢所有为本项目贡献资料和代码的同学们！

---

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**
