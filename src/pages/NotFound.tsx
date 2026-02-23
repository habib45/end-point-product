import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: 120, fontWeight: 900, color: '#dee2e6', lineHeight: 1 }}>404</div>
      <h3 className="fw-bold mt-2">Page Not Found</h3>
      <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary">
        <i className="bi bi-house-fill me-2"></i>Back to Dashboard
      </Link>
    </div>
  )
}
