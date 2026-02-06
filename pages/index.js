import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { getSortedPostsData, getAllCategories, getAllTags, searchPosts, getPostsByCategory, getPostsByTag } from '../lib/posts'
import { siteConfig } from '../lib/config'

export async function getStaticProps() {
  try {
    const allPostsData = await getSortedPostsData()
    const categories = await getAllCategories()
    const tags = await getAllTags()
    return {
      props: {
        allPostsData,
        categories,
        tags
      }
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error.message)
    return {
      props: {
        allPostsData: [],
        categories: [],
        tags: []
      }
    }
  }
}

export default function Home({ allPostsData, categories, tags }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 处理URL查询参数
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search)
      const tagParam = params.get('tag')
      const categoryParam = params.get('category')
      const searchParam = params.get('search')

      if (tagParam) {
        setSelectedTag(tagParam)
      }
      if (categoryParam) {
        setSelectedCategory(categoryParam)
      }
      if (searchParam) {
        setSearchQuery(searchParam)
      }
    }
  }, [])

  // 使用useMemo缓存过滤结果
  const filteredPosts = useMemo(() => {
    let result = allPostsData

    if (searchQuery) {
      // 这里应该使用searchPosts函数，但由于是客户端，我们直接过滤
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        (post.content && post.content.toLowerCase().includes(lowerQuery))
      )
    }

    if (selectedCategory) {
      const lowerCategory = selectedCategory.toLowerCase()
      result = result.filter(post => 
        post.category && post.category.toLowerCase() === lowerCategory
      )
    }

    if (selectedTag) {
      const lowerTag = selectedTag.toLowerCase()
      result = result.filter(post => 
        post.tags && post.tags.some(tag => tag.toLowerCase() === lowerTag)
      )
    }

    return result
  }, [allPostsData, searchQuery, selectedCategory, selectedTag])

  const handleSearch = (e) => {
    e.preventDefault()
    // 可以添加搜索逻辑，例如更新URL参数
    if (searchQuery) {
      const params = new URLSearchParams()
      params.set('search', searchQuery)
      if (selectedCategory) {
        params.set('category', selectedCategory)
      }
      if (selectedTag) {
        params.set('tag', selectedTag)
      }
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', `/?${params.toString()}`)
      }
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedTag('')
    // 重置URL参数
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/')
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="container">
      <Head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          {siteConfig.title}
        </h1>
        <p className="description">
          {siteConfig.description}
        </p>

        <div className="search-filter-container">
          <form onSubmit={handleSearch} className="search-box" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search posts"
              style={{ paddingRight: '40px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </form>

          <div className="filter-dropdown">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-dropdown">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="filter-select"
              aria-label="Filter by tag"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {(searchQuery || selectedCategory || selectedTag) && (
            <button
              onClick={resetFilters}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all var(--transition-fast)'
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* 筛选结果统计 */}
        {(searchQuery || selectedCategory || selectedTag) && (
          <div style={{ 
            margin: 'var(--spacing-md) 0', 
            padding: 'var(--spacing-sm)', 
            backgroundColor: 'var(--color-bg-secondary)', 
            borderRadius: 'var(--border-radius-md)',
            fontSize: '14px',
            color: 'var(--color-text-secondary)'
          }}>
            Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory && ` in category "${selectedCategory}"`}
            {selectedTag && ` with tag "${selectedTag}"`}
          </div>
        )}

        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span style={{ marginLeft: 'var(--spacing-sm)' }}>Loading...</span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="post-list">
            {filteredPosts.map((post) => (
              <div key={post.id} className="post-card">
                <h2>
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="post-meta">
                  {post.date} • {post.category}
                </p>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/?tag=${tag}`} passHref>
                      <span className="tag" style={{ cursor: 'pointer' }}>{tag}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No posts found</h3>
            <p>Try adjusting your search or filters, or check back later for new content.</p>
            <button
              onClick={resetFilters}
              style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all var(--transition-fast)'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  )
}