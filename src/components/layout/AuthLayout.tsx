import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="auth-layout min-vh-100 d-flex align-items-center justify-content-center">
      <div className="auth-container">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-3 mb-3"
            style={{ width: 56, height: 56 }}>
            <i className="bi bi-hexagon-fill text-white fs-3"></i>
          </div>
          <h2 className="fw-bold text-dark">AdminPanel Pro</h2>
          <p className="text-muted">Powerful dashboard for modern teams</p>
        </div>
        <div className="card border-0 shadow-lg" style={{ borderRadius: 16 }}>
          <div className="card-body p-4 p-md-5">
            <Outlet />
          </div>
        </div>
        <p className="text-center text-muted small mt-3">
          © {new Date().getFullYear()} AdminPanel Pro. All rights reserved.
        </p>
      </div>
    </div>
  )
}
