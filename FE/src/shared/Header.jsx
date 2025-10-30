import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../utils/api'

export default function Header({ user }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="app-header">
      <nav>
        <Link to="/">Home</Link> | <Link to="/posts">Posts</Link>
        {user ? (
          <span style={{ float: 'right' }}>
            <strong>{user.email}</strong>
            {' '}
            <Link to="/profile">Profile</Link>
            {' '}
            <button onClick={handleLogout}>Logout</button>
          </span>
        ) : (
          <span style={{ float: 'right' }}>
            <Link to="/login">Login</Link>
          </span>
        )}
      </nav>
    </header>
  )
}
