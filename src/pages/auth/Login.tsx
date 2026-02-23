import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: 'admin@example.com', password: 'password' }
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    const success = await login(data.email, data.password)
    setLoading(false)
    if (success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error('Invalid credentials. Use admin@example.com')
    }
  }

  return (
    <>
      <h4 className="fw-bold mb-1">Sign in to your account</h4>
      <p className="text-muted mb-4">Enter your credentials to access the dashboard</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Email address</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-envelope text-muted"></i></span>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="admin@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' }
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <label className="form-label fw-semibold">Password</label>
            <Link to="/forgot-password" className="small text-primary">Forgot password?</Link>
          </div>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-lock text-muted"></i></span>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
            />
            <button type="button" className="input-group-text" onClick={() => setShowPassword(s => !s)}>
              <i className={`bi bi-eye${showPassword ? '-slash' : ''} text-muted`}></i>
            </button>
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
        </div>

        <div className="mb-4">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="remember" {...register('remember')} />
            <label className="form-check-label text-muted" htmlFor="remember">Remember me for 30 days</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
          ) : 'Sign In'}
        </button>
      </form>

      <hr className="my-4" />
      <p className="text-center text-muted mb-0">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary fw-semibold">Create one</Link>
      </p>

      <div className="alert alert-info mt-3 mb-0 small">
        <i className="bi bi-info-circle me-1"></i>
        Demo: <strong>admin@example.com</strong> / any password
      </div>
    </>
  )
}
