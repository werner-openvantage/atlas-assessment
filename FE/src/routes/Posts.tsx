import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchPosts, getCurrentUser } from '../utils/api'
import BlogPostsGrid, { type Post } from '../shared/BlogPostsGrid'

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        await getCurrentUser()
      } catch (err) {
        navigate('/login')
        return
      }

      try {
        const res = await fetchPosts(page, 5)
        const postList = Array.isArray(res) ? res : ((res as any)?.data || [])
        if (!postList || postList.length === 0) {
          setHasMore(false)
          return
        }
        setPosts((prev) => [...prev, ...postList])
        if (postList.length < 5) setHasMore(false)
      } catch (err) {
        console.error('Error loading posts:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page, navigate])

  return (
    <div className="posts-page">
      <h2>All Posts</h2>
      <Link to="/posts/new" className="auth-btn" style={{ display: 'inline-block', textDecoration: 'none', marginBottom: '2rem' }}>
        Create New Post
      </Link>
      <BlogPostsGrid
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        page={page}
        onLoadMore={() => setPage((prev) => prev + 1)}
        emptyMessage="No posts found. Create one to get started!"
      />
    </div>
  )
}

export default Posts
