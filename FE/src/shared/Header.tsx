import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useRevalidator } from 'react-router-dom'
import { logout, getCurrentUser } from '../utils/api'
import ReshotMapIcon from './ReshotMapIcon'
import LoginIcon from './LoginIcon'
import AccountIcon from './AccountIcon'
import HomeIcon from './HomeIcon'

interface HeaderProps {
  user?: { email?: string; first_name?: string; last_name?: string } | null
}

const Header: React.FC<HeaderProps> = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser)
  const navigate = useNavigate()
  const revalidator = useRevalidator()

  useEffect(() => {
    if (propUser) {
      setUser(propUser)
    } else if (!localStorage.getItem('authToken')) {
      setUser(null)
    }
  }, [propUser])

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('authToken') && !user) {
        try {
          const userResponse = await getCurrentUser()
          if (userResponse?.data) {
            setUser(userResponse.data)
          }
        } catch (err) {
          console.error('Error getting user:', err)
          setUser(null)
        }
      } else if (!localStorage.getItem('authToken')) {
        setUser(null)
      }
    }
    checkAuth()
  }, [])

  const displayName = user && (user.first_name || user.last_name) ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : (user?.email || 'User')

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear user state regardless of response
      setUser(null)
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      revalidator.revalidate()
      navigate('/login')
    }
  }

  return (
    <header className="app-header">
    <nav>
      <div className="nav-left">
        <Link to="/" className="brand">
          <ReshotMapIcon className="brand-icon" />
          <span >Atlas</span>
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <Link to="/" className="nav-link">
              <HomeIcon className="nav-icon" />
              <span>Home</span>
            </Link>
            {' '}|{' '}
            <Link to="/profile" className="nav-link">
              <AccountIcon className="nav-icon" />
              <span>{displayName}</span>
            </Link>
            {' '}|{' '}
            <button onClick={handleLogout} className="nav-link logout-button-reset">
              <LoginIcon className="auth-icon" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">
              <LoginIcon className="auth-icon" />
              <span >Login</span>
            </Link>
            {' '}|{' '}
            <Link to="/register" className="auth-link">
              <AccountIcon className="auth-icon" />
              <span >Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  </header>
  )
}

export default Header
