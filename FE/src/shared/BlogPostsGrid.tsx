import React from 'react'
import Loader from './Loader'
import PostCard, { type Post } from './PostCard'
export type { Post }

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
  return (
    <>
      <Loader isLoading={loading && page === 1} />
      {page === 1 && posts.length === 0 && !loading ? (
        <p>{emptyMessage}</p>
      ) : (
        <>
          <div className="blog-posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showActions={true} />
            ))}
          </div>
          {hasMore && (
            <div className="load-more-container">
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
            <p className="no-more-posts-message">
              No more posts
            </p>
          )}
        </>
      )}
    </>
  )
}

export default BlogPostsGrid
