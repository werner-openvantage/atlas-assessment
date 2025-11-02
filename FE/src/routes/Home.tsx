import React, { useMemo } from 'react'
import { Link, useLoaderData } from 'react-router-dom'

type LoaderData = { user: any | null }

const greetings = [
  'Welcome to Atlas — build something awesome today.',
  'Hello there — explore the latest posts and ideas.',
  'Good to see you — share a thought with the community.',
  'Welcome — your atlas of posts starts here.'
]

const Home: React.FC = () => {
  const data = useLoaderData() as LoaderData
  const user = data?.user

  // pick a pseudo-random greeting per page load
  const greeting = useMemo(() => {
    const idx = Math.floor(Math.random() * greetings.length)
    return greetings[idx]
  }, [])

  return (
    <div className="home-hero">
      <section className="hero-card">
        <h1>{user ? `Welcome back, ${user.first_name ?? user.email}` : greeting}</h1>
        <p className="muted">{user ? 'Here are the latest posts from your community.' : 'Sign up or log in to create and manage posts.'}</p>

        <div className="hero-cta">
          <Link to="/posts" className="btn">View Posts</Link>
          {user ? (
            <Link to="/posts/new" className="btn btn-primary">Create Post</Link>
          ) : (
            <>
              <Link to="/register" className="btn">Register</Link>
              <Link to="/login" className="btn btn-primary">Login</Link>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
