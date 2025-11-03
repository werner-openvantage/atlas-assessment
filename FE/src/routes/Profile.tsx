import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLoaderData, useRevalidator } from 'react-router-dom'
import { getCurrentUser, updateUser } from '../utils/api'

type LoaderData = { user: any | null }
type EditFormData = { firstName: string; lastName: string; email: string }

const Profile: React.FC = () => {
  const data = useLoaderData() as LoaderData
  const [user, setUser] = useState(data?.user || null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const revalidator = useRevalidator()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFormData>({
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
    }
  })

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('authToken')) {
        try {
          const userResponse = await getCurrentUser()
          if (userResponse?.data) {
            setUser(userResponse.data)
            // Reset form with new user data
            reset({
              firstName: userResponse.data.first_name || '',
              lastName: userResponse.data.last_name || '',
              email: userResponse.data.email || '',
            })
          }
        } catch (err) {
          setUser(null)
        }
      }
    }
    checkAuth()
  }, [reset])

  if (!user) return <div>Please login to view your profile.</div>

  const onSubmit = async (data: EditFormData) => {
    try {
      setIsSubmitting(true)
      const response = await updateUser(user.id, {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      })
      
      // Update local state with the response data from backend
      const updatedUser = response?.data || response
      if (updatedUser) {
        setUser(updatedUser)
        // Also update localStorage to reflect new user data
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      }
      
      setIsEditing(false)
      // Revalidate to refresh header with new user data
      revalidator.revalidate()
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Account</h1>
        <button onClick={() => setIsEditing(!isEditing)} className="auth-btn">
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {!isEditing ? (
        <div className="profile-info">
          <div className="profile-field">
            <label>First Name</label>
            <p>{user.first_name || 'Not provided'}</p>
          </div>
          <div className="profile-field">
            <label>Last Name</label>
            <p>{user.last_name || 'Not provided'}</p>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="profile-edit-form">
          <div className="profile-field">
            <label>First Name</label>
            <input 
              {...register('firstName', { 
                maxLength: { value: 20, message: 'First name must be 20 characters or less' } 
              })} 
              disabled={isSubmitting}
            />
            {errors.firstName && <p className="error">{errors.firstName.message}</p>}
          </div>
          <div className="profile-field">
            <label>Last Name</label>
            <input 
              {...register('lastName', { 
                maxLength: { value: 20, message: 'Last name must be 20 characters or less' } 
              })} 
              disabled={isSubmitting}
            />
            {errors.lastName && <p className="error">{errors.lastName.message}</p>}
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
              })} 
              disabled={isSubmitting}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>
          <div className="profile-actions">
            <button type="submit" className="auth-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="auth-btn secondary" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Profile
