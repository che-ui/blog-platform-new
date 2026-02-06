# GitHub 风格博客平台

基于 Next.js 开发的 GitHub 风格博客框架，严格遵循 GitHub 的视觉设计语言、布局规范与交互模式，提供完整的博客功能和优秀的用户体验。

## 📋 项目概述

这是一个功能完整的 GitHub 风格博客平台，采用 Next.js 静态生成技术，支持 Markdown 文章、分类筛选、标签过滤、全文搜索等核心功能。项目设计注重模块化、可扩展性和性能优化，为开发者提供了一个快速搭建专业博客的解决方案。

### ✨ 核心功能

- **GitHub 风格 UI**：严格遵循 GitHub 的视觉设计语言和交互模式
- **响应式布局**：完美适配桌面端、平板和移动设备
- **Markdown 支持**：直接使用 .md 文件管理博客文章
- **语法高亮**：支持代码块的 GitHub 风格语法高亮
- **主题切换**：内置亮色/暗色主题，支持自动切换
- **文章目录**：自动生成文章目录导航
- **分类筛选**：按文章分类进行筛选
- **标签系统**：支持多标签管理和筛选
- **全文搜索**：支持标题、内容和标签的全文搜索
- **相关文章**：基于标签相似度的相关文章推荐
- **SEO 友好**：内置结构化数据，提升搜索引擎优化

### 🛠 技术栈

- **框架**：Next.js 13.4.19
- **前端**：React 18.2.0
- **Markdown**：gray-matter + remark + remark-gfm
- **语法高亮**：内置 GitHub 风格代码高亮
- **样式**：原生 CSS + CSS 变量
- **部署**：支持 Vercel、GitHub Pages 等平台

## 🚀 快速开始

### 1. 环境要求

- Node.js 16.8 或更高版本
- npm 7.0 或更高版本

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001 查看博客。

### 4. 构建生产版本

```bash
npm run build
```

### 5. 启动生产服务器

```bash
npm start
```

## 📁 项目结构

```
blog-platform/
├── pages/               # Next.js 页面
│   ├── _app.js          # 应用入口（含主题切换）
│   ├── index.js         # 博客首页（含搜索和筛选）
│   ├── 404.js           # 404错误页面
│   └── posts/           # 文章详情页
│       └── [id].js      # 动态路由
├── posts/               # Markdown 文章目录
│   ├── first-post.md    # 示例文章1
│   └── second-post.md   # 示例文章2
├── lib/                 # 工具函数
│   ├── config.js        # 站点配置
│   └── posts.js         # 文章数据处理
├── styles/              # 样式文件
│   └── globals.css      # 全局样式（含暗色主题）
├── .gitignore           # Git 忽略文件
├── package.json         # 项目配置
├── next.config.js       # Next.js 配置
└── README.md            # 项目文档
```

## 📝 如何添加新文章

### 1. 创建 Markdown 文件

在 `posts` 目录中创建新的 `.md` 文件，文件名将作为文章的 slug。

例如：`my-awesome-post.md`

### 2. 文章格式

每篇文章需要包含 YAML 前置元数据和 Markdown 内容：

```markdown
---
title: "文章标题"
date: "2026-02-01"
category: "技术"
tags: ["Next.js", "React", "博客"]
excerpt: "文章摘要，将显示在文章列表中"
---

# 文章内容

这是文章的正文内容，支持完整的 Markdown 语法。

## 二级标题

- 列表项1
- 列表项2

```javascript
// 代码块示例
console.log('Hello, GitHub Style Blog!');
```

### 3. 保存并查看

- **开发环境**：保存文件后，开发服务器会自动热重载，刷新页面即可查看
- **生产环境**：需要重新运行 `npm run build` 来构建新的文章

## ⚙️ 配置详情

### 站点配置

修改 `lib/config.js` 文件来自定义站点信息：

```javascript
// 站点配置文件
export const siteConfig = {
  // 基本信息
  title: 'GitHub Style Blog',
  description: '基于Next.js开发的GitHub风格博客框架',
  author: 'Blog Author',
  url: 'https://your-blog-domain.com',
  
  // 社交媒体
  social: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  },
  
  // 功能配置
  features: {
    darkMode: true,           // 启用暗色模式
    codeHighlight: true,      // 启用代码高亮
    tableOfContents: true,    // 启用目录导航
    backToTop: true,          // 启用回到顶部按钮
    rssFeed: true             // 启用RSS订阅
  },
  
  // 分页配置
  pagination: {
    postsPerPage: 10
  },
  
  // 其他配置
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  copyright: `© ${new Date().getFullYear()} GitHub Style Blog. All rights reserved.`
};

export default siteConfig;
```

### 样式配置

在 `styles/globals.css` 文件中，您可以修改 CSS 变量来自定义样式：

```css
:root {
  /* GitHub Brand Colors */
  --color-primary: #2185D0;       /* 主色调 */
  --color-primary-light: #64B5F6;  /* 浅色主调 */
  --color-primary-dark: #1976D2;   /* 深色主调 */
  
  /* GitHub Neutral Colors */
  --color-text-primary: #24292e;   /* 主要文本 */
  --color-text-secondary: #586069; /* 次要文本 */
  
  /* GitHub Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  /* 其他变量 */
  /* ... */
}

/* 暗色模式变量 */
.dark {
  --color-primary: #58a6ff;
  --color-text-primary: #e6edf3;
  --color-bg-primary: #0d1117;
  /* 其他暗色模式变量 */
  /* ... */
}
```

## 📖 使用指南

### 首页功能

1. **文章列表**：展示所有博客文章，按发布日期倒序排列
2. **搜索功能**：在顶部搜索框输入关键词，支持标题、内容和标签的全文搜索
3. **分类筛选**：点击左侧分类列表，筛选对应分类的文章
4. **标签筛选**：点击标签云或文章中的标签，筛选包含该标签的文章
5. **主题切换**：点击右上角的主题切换按钮，在亮色和暗色模式之间切换

### 文章详情页

1. **文章内容**：完整显示 Markdown 渲染后的文章内容
2. **目录导航**：右侧显示文章目录，点击可快速跳转到对应章节
3. **代码高亮**：自动为代码块添加 GitHub 风格的语法高亮
4. **相关文章**：底部显示基于标签相似度推荐的相关文章
5. **回到顶部**：滚动到底部时，右下角会出现回到顶部按钮

### 开发流程

1. **启动开发服务器**：`npm run dev`
2. **添加新文章**：在 `posts` 目录创建 `.md` 文件
3. **预览效果**：访问 http://localhost:3001 查看效果
4. **构建生产版本**：`npm run build`
5. **部署**：将构建产物部署到您选择的平台

## 🚢 部署指南

### Vercel 部署（推荐）

1. **登录 Vercel**：访问 [Vercel 官网](https://vercel.com/) 并使用 GitHub 账号登录

2. **导入项目**：
   - 点击 "New Project"
   - 在 "Import Git Repository" 部分找到您的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**：
   - 项目名称：保持默认或自定义
   - 框架预设：选择 "Next.js"
   - 根目录：保持默认 (/)
   - 构建命令：保持默认 (npm run build)
   - 输出目录：保持默认 (.next)
   - 环境变量：无需添加额外变量

4. **部署项目**：
   - 点击 "Deploy" 按钮
   - Vercel 会自动构建和部署您的项目
   - 部署完成后，您会获得一个唯一的 URL

### GitHub Pages 部署

1. **修改 package.json**：
   ```json
   {
     "scripts": {
       "export": "next export"
     }
   }
   ```

2. **构建并导出项目**：
   ```bash
   npm run build
   npm run export
   ```

3. **部署到 GitHub Pages**：
   - 将生成的 `out` 目录部署到 GitHub Pages
   - 可以使用 GitHub Actions 自动部署

### 其他平台部署

- **Netlify**：类似 Vercel 的部署流程
- **AWS Amplify**：连接 GitHub 仓库并配置构建设置
- **Docker**：创建 Dockerfile 并部署到容器平台

## 🔧 开发指南

### 代码规范

- 使用 ES6+ 语法
- 遵循 React 最佳实践
- 保持代码模块化和可读性
- 使用语义化的变量和函数命名
- 添加适当的注释

### 调试技巧

- 使用 `console.log()` 进行简单调试
- 使用 Chrome DevTools 进行高级调试
- 使用 `npm run dev` 启动开发服务器，支持热重载
- 查看浏览器控制台的错误信息

### 性能优化

- 使用 Next.js 的静态生成功能
- 优化图片资源（建议使用 Next.js 的 Image 组件）
- 减少不必要的重新渲染
- 使用代码分割和动态导入
- 利用缓存机制减少重复计算

### 常见问题

#### 1. 文章不显示
- 检查 posts 目录是否存在
- 检查 .md 文件格式是否正确
- 检查文件编码是否为 UTF-8

#### 2. 代码高亮不工作
- 确保 `siteConfig.features.codeHighlight` 为 true
- 检查浏览器控制台是否有错误

#### 3. 暗色模式不生效
- 确保 `siteConfig.features.darkMode` 为 true
- 检查浏览器是否支持 CSS 变量

#### 4. 本地服务器无法访问
- 检查端口是否被占用
- 确保开发服务器正在运行
- 尝试使用不同的浏览器访问

## 🤝 贡献规范

欢迎提交 Issue 和 Pull Request 来改进这个项目！

### 贡献流程

1. **Fork 本仓库**
2. **创建特性分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'Add some amazing feature'`)
4. **推送到分支** (`git push origin feature/amazing-feature`)
5. **打开 Pull Request**

### 代码审查

所有 Pull Request 都会经过代码审查，确保代码质量和一致性。请确保您的代码符合项目的代码规范和最佳实践。

## 🌐 浏览器兼容性

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 📄 许可证

MIT License

## 📞 联系方式

如果您有任何问题或建议，欢迎联系我们。

## 📝 更新日志

### v1.0.0
- ✅ 初始版本发布
- ✅ GitHub 风格 UI 设计
- ✅ Markdown 文章支持
- ✅ 分类和标签筛选
- ✅ 全文搜索功能
- ✅ 响应式布局
- ✅ 暗色模式支持
- ✅ 代码语法高亮
- ✅ 文章目录导航
- ✅ 相关文章推荐
- ✅ 性能优化和缓存机制

### v1.0.1
- ✅ 修复 localhost 访问问题
- ✅ 优化 Markdown 渲染性能
- ✅ 增强错误处理机制
- ✅ 改进 SEO 优化
- ✅ 更新依赖包版本

---

**Happy Blogging!** 🎉

---

*Last updated: 2026-02-06*