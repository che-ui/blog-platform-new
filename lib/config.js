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
    darkMode: true,
    codeHighlight: true,
    tableOfContents: true,
    backToTop: true,
    rssFeed: true
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
