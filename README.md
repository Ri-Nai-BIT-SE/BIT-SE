# 📚 BIT-SE

> 北京理工大学软件工程课程个人学习经验分享

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://ri-nai-bit-se.github.io/BIT-SE/)
[![License](https://img.shields.io/github/license/Ri-Nai/BIT-SE)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/Ri-Nai/BIT-SE)](https://github.com/Ri-Nai/BIT-SE/stargazers)

## 🌟 项目简介

本项目是我个人的北京理工大学软件工程专业学习经验分享，致力于打破信息差，通过记录和整理自己的学习心得、课程笔记和考试经验，为 BIT-SE 的同学们提供一些参考。

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
# 生成数据
pnpm run generate-data

# 启动开发服务器
pnpm run docs:dev
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


## 🤔 关于贡献

### 🚧 贡献状态

由于我对于多人协作的项目结构和规范还没有完全理清，暂时**没有开放贡献接口**。

### 🎯 作为模板使用

如果你也想搭建类似的个人学习经验分享网站，欢迎**参考本项目的结构和实现方式**：

- Fork 本仓库作为模板
- 根据自己的需求修改配置和内容
- 搭建属于你自己的学习经验分享站点

这样既能让每个人自由地分享自己的学习经验，又能保持各自项目的独立性和特色。

## ⚠️ 免责声明

> **重要提醒**: 本项目仅供学习交流使用，严禁用于商业用途。拿开源资料卖钱的行为是不被允许的！

- 本仓库内容仅供参考，请勿直接抄袭
- 使用本仓库资料时请遵守学术诚信原则
- 如有侵权问题，请及时联系删除

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 许可证。

## 🙏 致谢

感谢所有曾经帮助过我学习的老师和同学们，也感谢那些为开源社区贡献力量的开发者们！

---

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**
