import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister, checkEmailUnique } from '../utils/api'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export default function Register() {
  const { register, handleSubmit, reset, formState: { errors }, setError } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      // check email uniqueness (assumes backend endpoint exists)
      const res = await checkEmailUnique(data.email)
      if (res.exists) {
        setError('email', { type: 'manual', message: 'Email already in use' })
        setSubmitting(false)
        return
      }

      await apiRegister(data)
      // registration should trigger a verification email from backend (ethereal)
      navigate('/login')
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input {...register('email', { required: 'Email required', pattern: { value: /\\S+@\\S+\\.\\S+/, message: 'Invalid email' } })} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: 'Password required', pattern: { value: passwordRegex, message: 'Password does not meet requirements' } })} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={submitting}>Submit</button>
        <button type="button" onClick={() => reset()}>Reset</button>
      </form>
    </div>
  )
}
