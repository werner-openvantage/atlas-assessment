import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPost, getCurrentUser, deletePost } from '../utils/api'
import OverlayLoader from '../shared/OverlayLoader'

type Post = {
  id: number
  title: string
  heading: string
  content: string
  image_url: string
  created_at: string
  user_id: string
}

type User = {
  id: string
  email: string
  first_name: string
  last_name: string
}

const PostDetails: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const p = await fetchPost(id!)
        setPost(p)

        // Fetch current user to check if they own the post
        const userResponse = await getCurrentUser()
        if (userResponse?.data) {
          setCurrentUser(userResponse.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      setIsDeleting(true)
      await deletePost(id!)
      navigate('/')
    } catch (err) {
      console.error('Delete error:', err)
      setIsDeleting(false)
    }
  }

  if (isLoading) return <OverlayLoader />
  if (!post) return <div className="post-not-found">Post not found</div>

  const isOwner = currentUser && String(currentUser.id) === String(post.user_id)
  const publishDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="post-details">
      {post.image_url && (
        <div className="post-featured-image">
          <img src={post.image_url} alt={post.heading} />
        </div>
      )}

      <div className="post-header">
        <h1>{post.title}</h1>
        <h2 className="post-heading">{post.heading}</h2>
        <div className="post-meta">
          <span className="publish-date">Published: {publishDate}</span>
        </div>
      </div>

      <div className="post-content">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {isOwner && (
        <div className="post-actions">
          <button
            onClick={() => navigate(`/posts/${id}/edit`)}
            className="blog-btn primary"
            disabled={isDeleting}
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="blog-btn danger"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      )}
    </article>
  )
}

export default PostDetails
