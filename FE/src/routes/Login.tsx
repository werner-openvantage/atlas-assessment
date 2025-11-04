import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useRevalidator, Link } from 'react-router-dom'
import { login } from '../utils/api'
import FormInput from '../shared/FormInput'
import { emailValidationRules, passwordValidationRules } from '../utils/validation'

type LoginForm = {
  email: string
  password: string
}

const Login: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginForm>()
  const navigate = useNavigate()
  const revalidator = useRevalidator()

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
      // Revalidate the root loader to refresh user data
      revalidator.revalidate()
      // Navigate after a small delay to let revalidation start
      setTimeout(() => navigate('/'), 100)
    } catch (err) {
      console.error(err)
      navigate('/login')
    }
  }

  return (
    <div className="auth-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          type="email"
          register={register('email', emailValidationRules)}
          error={errors.email}
        />

        <FormInput
          label="Password"
          type="password"
          register={register('password', passwordValidationRules)}
          error={errors.password}
        />

        <div>
          <button type="submit" className="auth-btn">Submit</button>
          <Link to="/register" className="auth-btn secondary">
            Sign Up
          </Link>
        </div>

        <p className="auth-footer-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
