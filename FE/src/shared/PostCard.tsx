import React from 'react'
import { Link } from 'react-router-dom'

export interface Post {
  id: number
  title: string
  heading: string
  content?: string
  image_url?: string
  created_at?: string
}

interface PostCardProps {
  post: Post
  showActions?: boolean
  truncateLength?: number
}

/**
 * Reusable post card component
 * Displays a single blog post in grid format with optional actions
 */
const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = true,
  truncateLength = 150
}) => {
  const truncateHtml = (html: string, maxLength: number): string => {
    const text = html.replace(/<[^>]*>/g, '')
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const publishDate = new Date(post.created_at!).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const imageUrl = post.image_url?.startsWith('http')
    ? post.image_url
    : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${post.image_url}`

  return (
    <article className="blog-post-card">
      {post.image_url && (
        <div className="blog-post-image">
          <img
            src={imageUrl}
            alt={post.heading}
          />
        </div>
      )}
      <div className="blog-post-content">
        <h3>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h3>
        {post.heading && (
          <p className="post-heading">{post.heading}</p>
        )}
        {post.content && (
          <p className="post-excerpt">{truncateHtml(post.content, truncateLength)}</p>
        )}
        <div className="post-meta">
          <span className="publish-date">{publishDate}</span>
        </div>
        {showActions && (
          <div className="post-card-actions">
            <Link to={`/posts/${post.id}`} className="text-link">
              Read More
            </Link>
            {' | '}
            <Link to={`/posts/${post.id}/edit`} className="text-link">
              Edit
            </Link>
            {' | '}
            <Link to={`/posts/${post.id}/delete`} className="text-link">
              Delete
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}

export default PostCard
