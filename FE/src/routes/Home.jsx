import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>Welcome to Atlas</h1>
      <p>
        <Link to="/posts">View Posts</Link>
      </p>
    </div>
  )
}

export const loader = async () => {
  return null
}
