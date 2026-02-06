import Head from 'next/head'
import Link from 'next/link'
import { siteConfig } from '../lib/config'

export default function Custom404() {
  return (
    <div className="container">
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content={`Page not found on ${siteConfig.title}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="not-found">
          <h1>404</h1>
          <h2>Page not found</h2>
          <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--border-radius-md)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-dark)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)'
              }}
            >
              Back to Home
            </Link>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                backgroundColor: 'var(--color-bg-secondary)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-md)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-tertiary)'
                e.target.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg-secondary)'
                e.target.style.color = 'var(--color-text-secondary)'
              }}
            >
              Search Posts
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}