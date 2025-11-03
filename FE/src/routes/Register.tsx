import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister, checkEmailUnique } from '../utils/api'

type RegisterForm = { email: string; password: string; firstName: string; lastName: string }

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const Register: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors }, setError } = useForm<RegisterForm>()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data: RegisterForm) => {
    setSubmitting(true)
    try {
      const res = await checkEmailUnique(data.email)
      if (res.exists) {
        setError('email', { type: 'manual', message: 'Email already in use' })
        setSubmitting(false)
        return
      }

      await apiRegister(data)
      navigate('/login')
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>First Name</label>
          <input {...register('firstName', { required: 'First name required', minLength: { value: 1, message: 'First name required' }, maxLength: { value: 20, message: 'First name must be 20 characters or less' } })} />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>

        <div>
          <label>Last Name</label>
          <input {...register('lastName', { required: 'Last name required', minLength: { value: 1, message: 'Last name required' }, maxLength: { value: 20, message: 'Last name must be 20 characters or less' } })} />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: 'Password required', pattern: { value: passwordRegex, message: 'Password does not meet requirements' } })} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <button type="submit" className="auth-btn" disabled={submitting}>Submit</button>
          <button type="button" className="auth-btn secondary" onClick={() => reset()}>Reset</button>
        </div>
      </form>
    </div>
  )
}

export default Register
