import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'

type LoginForm = {
  email: string
  password: string
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

const Login: React.FC = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoginForm>()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
      navigate('/')
    } catch (err) {
      console.error(err)
      navigate('/login')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input {...register('email', { setValueAs: v => v?.trim(), required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register('password', { required: 'Password is required', pattern: { value: passwordRegex, message: 'Password does not meet requirements' } })} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={() => reset()}>Reset</button>
      </form>
    </div>
  )
}

export default Login
