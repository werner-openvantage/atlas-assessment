import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Atlas</h1>
      <p>
        <Link to="/posts">View Posts</Link>
      </p>
    </div>
  )
}

export default Home
