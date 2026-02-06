import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'next-themes'
import { Moon, Sun, ArrowUp } from 'react-icons/md'
import { siteConfig } from '../lib/config'

// 主题切换组件
function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 仅在客户端执行
    setMounted(true)
  }, [])

  // 服务器端渲染时返回null
  if (!mounted) {
    return null
  }

  return (
    <ThemeToggleClient />
  )
}

// 客户端主题切换组件
function ThemeToggleClient() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // 从localStorage获取主题
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = window.localStorage.getItem('theme')
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    // 仅在客户端执行localStorage操作
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: 'var(--border-radius-sm)',
        transition: 'all var(--transition-fast)'
      }}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}

export default function App({ Component, pageProps }) {
  const [showBackToTop, setShowBackToTop] = useState(false)

  // 回到顶部按钮逻辑
  useEffect(() => {
    // 仅在客户端执行
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setShowBackToTop(window.scrollY > 300)
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    // 仅在客户端执行
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <>
        <header>
          <div className="header-content">
            <div className="logo">
              <a href="/">{siteConfig.title}</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
              <nav className="nav-links">
                <a href="/" className="nav-link">Home</a>
                <a href="/categories" className="nav-link">Categories</a>
                <a href="/tags" className="nav-link">Tags</a>
                <a href="/about" className="nav-link">About</a>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <Component {...pageProps} />
        <footer>
          <p>{siteConfig.copyright}</p>
        </footer>
        <button
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </>
    </ThemeProvider>
  )
}