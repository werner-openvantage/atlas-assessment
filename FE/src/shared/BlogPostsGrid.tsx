import React from 'react'
import { Link } from 'react-router-dom'
import LoadingOverlay from './LoadingOverlay'

export type Post = {
  id: number
  title: string
  heading: string
  content?: string
  image_url?: string
  created_at?: string
}

interface BlogPostsGridProps {
  posts: Post[]
  loading: boolean
  hasMore: boolean
  page: number
  onLoadMore: () => void
  emptyMessage?: string
}

const BlogPostsGrid: React.FC<BlogPostsGridProps> = ({
  posts,
  loading,
  hasMore,
  page,
  onLoadMore,
  emptyMessage = 'No posts yet. Be the first to share!'
}) => {
  const truncateHtml = (html: string, maxLength: number = 150): string => {
    const text = html.replace(/<[^>]*>/g, '')
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      {page === 1 && posts.length === 0 && !loading ? (
        <p>{emptyMessage}</p>
      ) : (
        <>
          <div className="blog-posts-grid">
            {posts.map((post) => {
              const publishDate = new Date(post.created_at!).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
              return (
                <article key={post.id} className="blog-post-card">
                  {post.image_url && (
                    <div className="blog-post-image">
                      <img src={post.image_url} alt={post.heading} />
                    </div>
                  )}
                  <div className="blog-post-content">
                    <h3>
                      <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </h3>
                    {post.heading && <p className="post-heading">{post.heading}</p>}
                    {post.content && <p className="post-excerpt">{truncateHtml(post.content)}</p>}
                    <div className="post-meta">
                      <span className="publish-date">{publishDate}</span>
                    </div>
                    <div className="post-card-actions">
                      <Link to={`/posts/${post.id}`} className="text-link">Read More</Link>
                      {' '}|{' '}
                      <Link to={`/posts/${post.id}/edit`} className="text-link">Edit</Link>
                      {' '}|{' '}
                      <Link to={`/posts/${post.id}/delete`} className="text-link">Delete</Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={onLoadMore}
                className="auth-btn"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>No more posts</p>
          )}
        </>
      )}
    </>
  )
}

export default BlogPostsGrid
