import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirm: string
  agree: boolean
}

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    const success = await registerUser(data.name, data.email, data.password)
    setLoading(false)
    if (success) {
      toast.success('Account created!')
      navigate('/dashboard')
    } else {
      toast.error('Registration failed')
    }
  }

  return (
    <>
      <h4 className="fw-bold mb-1">Create an account</h4>
      <p className="text-muted mb-4">Fill in the details to get started</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="John Doe"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email address</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="you@example.com"
            {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Min. 8 characters"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
          />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${errors.confirm ? 'is-invalid' : ''}`}
            placeholder="Repeat password"
            {...register('confirm', {
              required: 'Please confirm your password',
              validate: v => v === password || 'Passwords do not match'
            })}
          />
          {errors.confirm && <div className="invalid-feedback">{errors.confirm.message}</div>}
        </div>

        <div className="mb-4">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="agree"
              {...register('agree', { required: 'You must agree to continue' })} />
            <label className="form-check-label text-muted" htmlFor="agree">
              I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
            </label>
            {errors.agree && <div className="invalid-feedback d-block">{errors.agree.message}</div>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</> : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        Already have an account? <Link to="/login" className="text-primary fw-semibold">Sign in</Link>
      </p>
    </>
  )
}
