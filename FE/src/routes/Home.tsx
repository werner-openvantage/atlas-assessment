import React, { useEffect, useState, useRef } from 'react'
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router-dom'
import lottie from 'lottie-web'
import { fetchPosts, getCurrentUser } from '../utils/api'
import BlogPostsGrid, { type Post } from '../shared/BlogPostsGrid'
import PlusIcon from '../shared/PlusIcon'
import mountainsAnimation from '../../assets/Mountains.json'

type LoaderData = { user: any | null }

const Home: React.FC = () => {
  const data = useLoaderData() as LoaderData
  const [user, setUser] = useState(data?.user || null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()
  const mountainsContainer = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (!mountainsContainer.current) return

    const anim = lottie.loadAnimation({
      container: mountainsContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: mountainsAnimation as any
    })

    setTimeout(() => {
      const svg = mountainsContainer.current?.querySelector('svg')
      if (svg) {
        svg.style.width = '100%'
        svg.style.height = '100%'
        svg.style.display = 'block'
        svg.setAttribute('preserveAspectRatio', 'none')
      }
    }, 100)

    return () => anim.destroy()
  }, [])

  const truncateHtml = (html: string, maxLength: number = 150): string => {
    const text = html.replace(/<[^>]*>/g, '')
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const isAuthenticated = user || localStorage.getItem('authToken')

  if (isAuthenticated) {
    return (
      <div className="home-logged-in">
        <section className="create-post-section">
          <h1>Share Your Blog Post</h1>
          <Link to="/posts/new" className="auth-btn home-write-new-post-link">
            <PlusIcon className="nav-icon" />
            Write New Post
          </Link>
        </section>

        <section className="posts-grid-section">
          <h2>Recent Posts</h2>
          <BlogPostsGrid
            posts={posts}
            loading={loading}
            hasMore={hasMore}
            page={page}
            onLoadMore={() => setPage((prev) => prev + 1)}
            emptyMessage="No posts yet. Be the first to share!"
          />
        </section>
      </div>
    )
  }

  return (
    <div className="home-hero-container home-hero-container-inner">
      <section className="home-hero-card">
        <div className="home-hero-content">
          <h1 className="text-gradient">Welcome to Atlas</h1>
          <p className="muted home-hero-description">
            Atlas is a community platform where you can share blog posts, explore ideas, and connect with others.
            Whether you're here to learn, contribute, or discover — Atlas gives you a space to build and share freely.
          </p>
          <div className="home-hero-ctas">
            <Link to="/register" className="auth-btn">
              Get Started Free
            </Link>
            <Link to="/login" className="auth-btn auth-btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="home-features-section">
        <div className="features-content">
          <h2>Why Choose Atlas?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📝 Easy Publishing</h3>
              <p>Create and publish beautiful blog posts with our intuitive editor. No technical skills needed.</p>
            </div>
            <div className="feature-card">
              <h3>🌍 Global Community</h3>
              <p>Connect with thousands of creators and readers from around the world sharing their stories.</p>
            </div>
            <div className="feature-card">
              <h3>💡 Discover Ideas</h3>
              <p>Explore trending topics, find inspiration, and engage with content that matters to you.</p>
            </div>
            <div className="feature-card">
              <h3>🔒 Secure & Private</h3>
              <p>Your content is protected with enterprise-grade security and privacy controls.</p>
            </div>
          </div>
        </div>
      </section>

      <div ref={mountainsContainer} className="home-mountains-container" />
    </div>
  )
}

export default Home
