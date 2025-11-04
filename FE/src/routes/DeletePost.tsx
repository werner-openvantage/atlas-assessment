import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPost, deletePost } from '../utils/api'
import OverlayLoader from '../shared/OverlayLoader'
import ConfirmModal from '../shared/ConfirmModal'

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
    <ConfirmModal
      title="Delete Post"
      message={`Are you sure you want to delete "${post.title}"?`}
      confirmLabel="Yes, delete"
      cancelLabel="Cancel"
      isDangerous={true}
      isLoading={isDeleting}
      onConfirm={handleDelete}
      onCancel={handleCancel}
    />
  )
}

export default DeletePost
