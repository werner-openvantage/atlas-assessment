import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPost, deletePost } from '../utils/api'

export default function DeletePost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const p = await fetchPost(id)
        setPost(p)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    try {
      await deletePost(id)
      navigate('/')
    } catch (err) {
      console.error(err)
      navigate('/login')
    }
  }

  if (!post) return <div>Loading...</div>

  return (
    <div>
      <h2>Delete Post</h2>
      <p>Are you sure you want to delete "{post.title}"?</p>
      <button onClick={handleDelete}>Yes, delete</button>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  )
}
