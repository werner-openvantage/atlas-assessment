import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchPosts, getCurrentUser } from '../utils/api'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        // ensure user signed in
        await getCurrentUser()
      } catch (err) {
        navigate('/login')
        return
      }

      const res = await fetchPosts(page, 5)
      if (!res || res.length === 0) {
        setHasMore(false)
        return
      }
      setPosts((prev) => [...prev, ...res])
      if (res.length < 5) setHasMore(false)
    }

    load()
  }, [page])

  return (
    <div>
      <h2>Posts</h2>
      <Link to="/posts/new">Create New Post</Link>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
            {' '}
            <Link to={`/posts/${p.id}/edit`}>edit</Link>
            {' '}
            <Link to={`/posts/${p.id}/delete`}>delete</Link>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <button onClick={() => setPage((s) => s + 1)}>Load more</button>
      ) : (
        <p>No more posts</p>
      )}
    </div>
  )
}

export const loader = async ({ request }) => {
  // loader placeholder; actual prefetching done in component to handle auth redirect
  return null
}
