import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPost, deletePost } from '../utils/api'
import OverlayLoader from '../shared/OverlayLoader'

type Post = { id: number; title: string }

const DeletePost: React.FC = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const p = await fetchPost(id!)
        setPost(p)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePost(id!)
      navigate('/')
    } catch (err) {
      console.error(err)
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!post) return <OverlayLoader />

  return (
    <div className="delete-modal-overlay" onClick={handleCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Post</h2>
        <p>Are you sure you want to delete <strong>{post.title}</strong>?</p>
        <div className="delete-modal-actions">
          <button 
            onClick={handleDelete} 
            className="blog-btn danger"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
          <button 
            onClick={handleCancel}
            className="blog-btn secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletePost
