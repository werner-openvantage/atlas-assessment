import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPost } from '../utils/api'

type Post = { id: number; title: string; description: string }

const PostDetails: React.FC = () => {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)

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

  if (!post) return <div>Loading...</div>

  return (
    <div>
      <h2>{post.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: post.description }} />
    </div>
  )
}

export default PostDetails
