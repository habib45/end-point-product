import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
    toast.success('Reset link sent!')
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-3"
          style={{ width: 64, height: 64 }}>
          <i className="bi bi-envelope-check text-success fs-3"></i>
        </div>
        <h4 className="fw-bold">Check your email</h4>
        <p className="text-muted">We sent a password reset link to <strong>{email}</strong></p>
        <Link to="/login" className="btn btn-primary mt-2">Back to Login</Link>
      </div>
    )
  }

  return (
    <>
      <h4 className="fw-bold mb-1">Forgot your password?</h4>
      <p className="text-muted mb-4">Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label fw-semibold">Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        <Link to="/login" className="text-primary"><i className="bi bi-arrow-left me-1"></i>Back to Login</Link>
      </p>
    </>
  )
}
