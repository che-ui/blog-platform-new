import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { getPostData, getAllPostIds, getSortedPostsData } from '../../lib/posts'
import { siteConfig } from '../../lib/config'
import { useRouter } from 'next/router'

// 代码高亮组件
function CodeHighlight() {
  useEffect(() => {
    // 动态导入Prism.js
    const loadPrism = async () => {
      try {
        const Prism = await import('prismjs')
        // 导入主题和语言支持
        await import('prismjs/themes/prism-tomorrow.css')
        await import('prismjs/components/prism-javascript')
        await import('prismjs/components/prism-jsx')
        await import('prismjs/components/prism-tsx')
        await import('prismjs/components/prism-bash')
        await import('prismjs/components/prism-markdown')
        await import('prismjs/components/prism-json')
        await import('prismjs/components/prism-css')
        await import('prismjs/components/prism-python')
        
        // 初始化代码高亮
        Prism.highlightAll()
      } catch (error) {
        console.error('Error loading Prism.js:', error.message)
      }
    }

    loadPrism()
  }, [])

  return null
}

// 目录组件
function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([])
  const [contentWithIds, setContentWithIds] = useState(content)

  useEffect(() => {
    if (!content) return

    // 从HTML内容中提取标题并添加ID
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headingElements = doc.querySelectorAll('h2, h3')
    
    const extractedHeadings = []
    
    // 为标题添加ID并提取信息
    headingElements.forEach((heading, index) => {
      const id = `heading-${index}`
      heading.id = id
      extractedHeadings.push({
        id,
        text: heading.textContent,
        level: parseInt(heading.tagName.charAt(1))
      })
    })
    
    setHeadings(extractedHeadings)
    
    // 更新带有ID的内容
    setContentWithIds(doc.body.innerHTML)
  }, [content])

  if (headings.length === 0) {
    return null
  }

  return (
    <>
      <div className="table-of-contents">
        <h3>Table of Contents</h3>
        <ul>
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 10}px` }}>
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </div>
      {contentWithIds}
    </>
  )
}

// 内容组件（处理目录和内容渲染）
function ContentRenderer({ contentHtml }) {
  const [showToc, setShowToc] = useState(siteConfig.features.tableOfContents)

  if (showToc) {
    return <TableOfContents content={contentHtml} />
  } else {
    return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
  }
}

export async function getStaticPaths() {
  try {
    const paths = await getAllPostIds()
    return {
      paths,
      fallback: true // 使用fallback: true处理动态路径
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error.message)
    return {
      paths: [],
      fallback: false
    }
  }
}

export async function getStaticProps({ params }) {
  try {
    const postData = await getPostData(params.id)
    
    // 处理文章不存在的情况
    if (!postData) {
      return {
        notFound: true
      }
    }
    
    const allPosts = await getSortedPostsData()
    
    // 计算相关文章（基于标签相似度）
    const relatedPosts = useMemo(() => {
      return allPosts
        .filter(post => post.id !== params.id)
        .map(post => {
          // 计算标签相似度
          const commonTags = post.tags.filter(tag => postData.tags.includes(tag))
          return {
            ...post,
            similarity: commonTags.length
          }
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)
    }, [allPosts, params.id, postData.tags])

    return {
      props: {
        postData,
        relatedPosts
      },
      revalidate: 60 // 60秒重新验证
    }
  } catch (error) {
    console.error(`Error in getStaticProps for post ${params.id}:`, error.message)
    return {
      notFound: true
    }
  }
}

export default function Post({ postData, relatedPosts }) {
  const router = useRouter()

  // 处理fallback状态
  if (router.isFallback) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // 处理文章不存在的情况
  if (!postData) {
    return (
      <div className="container">
        <div className="not-found">
          <h1>404</h1>
          <h2>Post not found</h2>
          <p>The post you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm) var(--spacing-lg)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--border-radius-md)',
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Head>
        <title>{postData.title} - {siteConfig.title}</title>
        <meta name="description" content={postData.excerpt} />
        <link rel="icon" href="/favicon.ico" />
        {/* 添加结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              'headline': postData.title,
              'description': postData.excerpt,
              'datePublished': postData.date,
              'author': {
                '@type': 'Person',
                'name': siteConfig.author
              },
              'publisher': {
                '@type': 'Organization',
                'name': siteConfig.title,
                'logo': {
                  '@type': 'ImageObject',
                  'url': `${siteConfig.url}/favicon.ico`
                }
              }
            })
          }}
        />
      </Head>

      <main>
        <div className="post-header">
          <Link href="/" className="back-link">← Back to Home</Link>
          <h1>{postData.title}</h1>
          <p className="post-meta">
            {postData.date} • {postData.category}
          </p>
          <div className="post-tags">
            {postData.tags.map((tag) => (
              <Link key={tag} href={`/?tag=${tag}`} passHref>
                <span className="tag" style={{ cursor: 'pointer' }}>{tag}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 文章内容 */}
        <div className="post-content">
          <ContentRenderer contentHtml={postData.contentHtml} />
        </div>

        {/* 代码高亮 */}
        {siteConfig.features.codeHighlight && <CodeHighlight />}

        {/* 相关文章 */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <h3>Related Posts</h3>
            <div className="post-list">
              {relatedPosts.map((post) => (
                <div key={post.id} className="post-card" style={{ padding: 'var(--spacing-md)' }}>
                  <h4>
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  </h4>
                  <p className="post-meta" style={{ fontSize: '12px' }}>
                    {post.date} • {post.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 评论系统占位 */}
        <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
          <h3>Comments</h3>
          <p>Comments will be available soon.</p>
        </div>
      </main>
    </div>
  )
}
