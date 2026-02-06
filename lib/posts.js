import { remark } from 'remark'
import html from 'remark-html'
import gfm from 'remark-gfm'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')
let postsCache = null
let lastCacheTime = 0
const CACHE_DURATION = 60 * 1000 // 1分钟缓存

/**
 * 获取所有文章数据并缓存
 * @returns {Promise<Array>} 排序后的文章数据数组
 */
async function getCachedPostsData() {
  const now = Date.now()
  
  // 检查缓存是否有效
  if (postsCache && (now - lastCacheTime) < CACHE_DURATION) {
    return postsCache
  }
  
  try {
    // 检查posts目录是否存在
    const dirExists = await fs.access(postsDirectory).then(() => true).catch(() => false)
    if (!dirExists) {
      console.warn('Posts directory not found, returning empty array')
      postsCache = []
      lastCacheTime = now
      return postsCache
    }
    
    // 读取目录中的所有文件
    const fileNames = await fs.readdir(postsDirectory)
    
    // 并行处理所有文件
    const allPostsData = await Promise.all(
      fileNames.map(async (fileName) => {
        try {
          const id = fileName.replace(/\.md$/, '')
          const fullPath = path.join(postsDirectory, fileName)
          
          // 读取文件内容
          const fileContents = await fs.readFile(fullPath, 'utf8')
          
          // 解析YAML前置元数据
          const matterResult = matter(fileContents)
          
          return {
            id,
            content: matterResult.content, // 保存原始内容用于搜索
            ...matterResult.data
          }
        } catch (error) {
          console.error(`Error processing file ${fileName}:`, error.message)
          return null
        }
      })
    )
    
    // 过滤掉处理失败的文件
    const validPosts = allPostsData.filter(post => post !== null)
    
    // 按日期排序
    const sortedPosts = validPosts.sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
    
    // 更新缓存
    postsCache = sortedPosts
    lastCacheTime = now
    
    return sortedPosts
  } catch (error) {
    console.error('Error getting posts data:', error.message)
    return []
  }
}

/**
 * 获取排序后的文章数据
 * @returns {Promise<Array>} 排序后的文章数据数组
 */
export async function getSortedPostsData() {
  return await getCachedPostsData()
}

/**
 * 获取所有文章ID
 * @returns {Promise<Array>} 文章ID数组
 */
export async function getAllPostIds() {
  try {
    const posts = await getCachedPostsData()
    return posts.map(post => ({
      params: {
        id: post.id
      }
    }))
  } catch (error) {
    console.error('Error getting post IDs:', error.message)
    return []
  }
}

/**
 * 获取文章详细数据
 * @param {string} id 文章ID
 * @returns {Promise<Object|null>} 文章详细数据
 */
export async function getPostData(id) {
  try {
    // 验证ID参数
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid post ID')
    }
    
    const fullPath = path.join(postsDirectory, `${id}.md`)
    
    // 检查文件是否存在
    const fileExists = await fs.access(fullPath).then(() => true).catch(() => false)
    if (!fileExists) {
      console.warn(`Post file not found: ${id}`)
      return null
    }
    
    // 读取文件内容
    const fileContents = await fs.readFile(fullPath, 'utf8')
    
    // 解析YAML前置元数据
    const matterResult = matter(fileContents)
    
    // 处理Markdown内容
    try {
      const processedContent = await remark()
        .use(gfm)
        .use(html)
        .process(matterResult.content)
      
      const contentHtml = processedContent.toString()
      
      return {
        id,
        contentHtml,
        ...matterResult.data
      }
    } catch (markdownError) {
      console.error(`Error processing markdown for post ${id}:`, markdownError.message)
      // 即使Markdown处理失败，也返回基本数据
      return {
        id,
        contentHtml: `<p>Error processing markdown content</p>`,
        ...matterResult.data
      }
    }
  } catch (error) {
    console.error(`Error getting post data for ${id}:`, error.message)
    return null
  }
}

/**
 * 按分类获取文章
 * @param {string} category 分类名称
 * @returns {Promise<Array>} 分类下的文章数组
 */
export async function getPostsByCategory(category) {
  try {
    const allPosts = await getCachedPostsData()
    const lowerCategory = category.toLowerCase()
    return allPosts.filter(post => 
      post.category && post.category.toLowerCase() === lowerCategory
    )
  } catch (error) {
    console.error(`Error getting posts by category ${category}:`, error.message)
    return []
  }
}

/**
 * 按标签获取文章
 * @param {string} tag 标签名称
 * @returns {Promise<Array>} 标签下的文章数组
 */
export async function getPostsByTag(tag) {
  try {
    const allPosts = await getCachedPostsData()
    const lowerTag = tag.toLowerCase()
    return allPosts.filter(post => 
      post.tags && post.tags.some(t => t.toLowerCase() === lowerTag)
    )
  } catch (error) {
    console.error(`Error getting posts by tag ${tag}:`, error.message)
    return []
  }
}

/**
 * 搜索文章
 * @param {string} query 搜索关键词
 * @returns {Promise<Array>} 搜索结果数组
 */
export async function searchPosts(query) {
  try {
    const allPosts = await getCachedPostsData()
    const lowerQuery = query.toLowerCase()
    
    return allPosts.filter(post => {
      // 搜索标题
      if (post.title && post.title.toLowerCase().includes(lowerQuery)) {
        return true
      }
      
      // 搜索摘要
      if (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) {
        return true
      }
      
      // 搜索标签
      if (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        return true
      }
      
      // 搜索内容
      if (post.content && post.content.toLowerCase().includes(lowerQuery)) {
        return true
      }
      
      return false
    })
  } catch (error) {
    console.error(`Error searching posts:`, error.message)
    return []
  }
}

/**
 * 获取所有分类
 * @returns {Promise<Array>} 分类数组
 */
export async function getAllCategories() {
  try {
    const allPosts = await getCachedPostsData()
    const categories = new Set()
    allPosts.forEach(post => {
      if (post.category) {
        categories.add(post.category)
      }
    })
    return Array.from(categories)
  } catch (error) {
    console.error('Error getting all categories:', error.message)
    return []
  }
}

/**
 * 获取所有标签
 * @returns {Promise<Array>} 标签数组
 */
export async function getAllTags() {
  try {
    const allPosts = await getCachedPostsData()
    const tags = new Set()
    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags)
  } catch (error) {
    console.error('Error getting all tags:', error.message)
    return []
  }
}

/**
 * 清除缓存
 */
export function clearCache() {
  postsCache = null
  lastCacheTime = 0
  console.log('Posts cache cleared')
}