import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import OverlayLoader from '../shared/OverlayLoader'
import PasswordStrengthIndicator from '../shared/PasswordStrengthIndicator'
import { PASSWORD_REGEX } from '../utils/validation'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { id } = useParams()
  const token = id

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token')
        setVerifying(false)
        return
      }

      try {
        const response = await api.get(`/auth/forgot-password/${token}`)
        if (response.data.data?.email) {
          setUserEmail(response.data.data.email)
        }
        setVerifying(false)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid or expired reset token')
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!password || !confirmPassword) {
        setError('Both password fields are required')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters long')
        return
      }

      // Password strength check
      if (!PASSWORD_REGEX.test(password)) {
        setError('Password must contain uppercase, lowercase, and numbers')
        return
      }

      const response = await api.patch(`/auth/forgot-password/${token}`, {
        password,
        password_confirmation: confirmPassword
      })

      if (response.data.data?.success || response.data.success) {
        setSuccess(true)
        // Show loader overlay and redirect to login after 2 seconds
        setRedirecting(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Verifying reset token...</p>
        </div>
      </div>
    )
  }

  if (error && !token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-error-message">
            <h2>Invalid Reset Link</h2>
            <p>{error}</p>
            <Link to="/forgot-password" className="auth-link-button">Request New Reset Link</Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="auth-container">
        <OverlayLoader size={96} message={redirecting ? 'Redirecting to login...' : undefined} />
        <div className="auth-card">
          <div className="auth-success-message">
            <h2>Password Reset Successful</h2>
            <p>Your password has been reset successfully.</p>
            <p className="redirect-message">Redirecting to login...</p>
            <Link to="/login" className="auth-link-button">Go to Login</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Set New Password</h2>
        <p className="auth-subtitle">Reset password for <strong>{userEmail}</strong></p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="form-input"
            />
            <PasswordStrengthIndicator password={password} />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="form-input"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="form-error">Passwords do not match</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="form-success">Passwords match</p>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            disabled={loading || password !== confirmPassword || password.length < 8}
            className="auth-button"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            <Link to="/login" className="auth-link">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
