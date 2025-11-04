import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister, checkEmailUnique } from '../utils/api'
import FormInput from '../shared/FormInput'
import { emailValidationRules, passwordValidationRules } from '../utils/validation'

type RegisterForm = { email: string; password: string; firstName: string; lastName: string }

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
        <FormInput
          label="Email"
          type="email"
          register={register('email', emailValidationRules)}
          error={errors.email}
          disabled={submitting}
        />

        <FormInput
          label="First Name"
          register={register('firstName', { required: 'First name required', minLength: { value: 1, message: 'First name required' }, maxLength: { value: 20, message: 'First name must be 20 characters or less' } })}
          error={errors.firstName}
          disabled={submitting}
        />

        <FormInput
          label="Last Name"
          register={register('lastName', { required: 'Last name required', minLength: { value: 1, message: 'Last name required' }, maxLength: { value: 20, message: 'Last name must be 20 characters or less' } })}
          error={errors.lastName}
          disabled={submitting}
        />

        <FormInput
          label="Password"
          type="password"
          register={register('password', passwordValidationRules)}
          error={errors.password}
          disabled={submitting}
        />

        <div>
          <button type="submit" className="auth-btn" disabled={submitting}>Submit</button>
          <button type="button" className="auth-btn secondary" onClick={() => reset()}>Reset</button>
        </div>
      </form>
    </div>
  )
}

export default Register
