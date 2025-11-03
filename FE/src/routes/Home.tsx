import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import { fetchPosts, getCurrentUser } from '../utils/api'
import LoadingOverlay from '../shared/LoadingOverlay'

type Post = {
  id: number
  title: string
  heading: string
  content?: string
  image_url?: string
  created_at?: string
}
type LoaderData = { user: any | null }

const Home: React.FC = () => {
  const data = useLoaderData() as LoaderData
  const [user, setUser] = useState(data?.user || null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('authToken')) {
        try {
          const userResponse = await getCurrentUser()
          if (userResponse?.data) {
            setUser(userResponse.data)
          }
        } catch (err) {
          setUser(null)
        }
      }
    }
    checkAuth()
  }, [])

  // Reset posts and page when user state changes
  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
  }, [user])

  useEffect(() => {
    if (!user) return

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetchPosts(page, 12)
        const postList = Array.isArray(res) ? res : ((res as any)?.data || [])
        if (!postList || postList.length === 0) {
          setHasMore(false)
        } else {
          if (page === 1) {
            setPosts(postList)
          } else {
            setPosts((prev) => [...prev, ...postList])
          }
          if (postList.length < 12) setHasMore(false)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user, page])

  const truncateHtml = (html: string, maxLength: number = 150): string => {
    const text = html.replace(/<[^>]*>/g, '')
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  if (user) {
    return (
      <div className="home-logged-in">
        <LoadingOverlay isLoading={loading} />
        <section className="create-post-section">
          <h1>Share Your Blog Post</h1>
          <Link to="/posts/new" className="auth-btn" style={{ display: 'inline-block', textDecoration: 'none', marginTop: '1rem' }}>
            Write New Post
          </Link>
        </section>

        <section className="posts-grid-section">
          <h2>Recent Posts</h2>
          {page === 1 && posts.length === 0 && !loading ? (
            <p>No posts yet. Be the first to share!</p>
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
                    onClick={() => setPage((prev) => prev + 1)}
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
        </section>
      </div>
    )
  }

  return (
    <div className="home-hero">
      <section className="hero-card" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1>Welcome to Atlas</h1>
        <p className="muted" style={{ maxWidth: '600px', margin: '1rem auto', lineHeight: '1.6' }}>
          Atlas is a community platform where you can share blog posts, explore ideas, and connect with others.
          Whether you're here to learn, contribute, or discover — Atlas gives you a space to build and share freely.
        </p>
      </section>
    </div>
  )
}

export default Home
