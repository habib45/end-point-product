import { useParams, Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import { mockUsers } from '@/services/mockData'
import { getInitials, getStatusColor } from '@/utils/helpers'

export default function UserDetail() {
  const { id } = useParams()
  const user = mockUsers.find(u => u.id === Number(id))

  if (!user) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-person-x fs-1 text-muted d-block mb-3"></i>
        <h4>User not found</h4>
        <Link to="/users" className="btn btn-primary mt-2">Back to Users</Link>
      </div>
    )
  }

  const color = getStatusColor(user.status)

  return (
    <>
      <ContentHeader
        title="User Detail"
        breadcrumbs={[{ label: 'Users', path: '/users' }, { label: user.name }]}
      />
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4">
            <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mx-auto mb-3"
              style={{ width: 80, height: 80, color: '#0d6efd', fontWeight: 700, fontSize: 28 }}>
              {getInitials(user.name)}
            </div>
            <h5 className="fw-bold mb-1">{user.name}</h5>
            <p className="text-muted mb-2">{user.email}</p>
            <span className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle mb-3`}>
              {user.status}
            </span>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-sm btn-primary"><i className="bi bi-pencil me-1"></i>Edit</button>
              <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash me-1"></i>Delete</button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">User Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { label: 'Full Name', value: user.name, icon: 'bi-person' },
                  { label: 'Email', value: user.email, icon: 'bi-envelope' },
                  { label: 'Phone', value: user.phone ?? '—', icon: 'bi-telephone' },
                  { label: 'Location', value: user.location ?? '—', icon: 'bi-geo-alt' },
                  { label: 'Role', value: user.role, icon: 'bi-shield' },
                  { label: 'Joined', value: user.joined, icon: 'bi-calendar' },
                ].map(f => (
                  <div key={f.label} className="col-md-6">
                    <label className="small text-muted d-block mb-1">
                      <i className={`bi ${f.icon} me-1`}></i>{f.label}
                    </label>
                    <p className="mb-0 fw-semibold">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Activity Summary</h5>
            </div>
            <div className="card-body">
              <div className="row g-2 text-center">
                {[
                  { label: 'Orders', value: 14, color: 'primary' },
                  { label: 'Reviews', value: 7, color: 'success' },
                  { label: 'Posts', value: 3, color: 'warning' },
                  { label: 'Logins', value: 42, color: 'info' },
                ].map(m => (
                  <div key={m.label} className="col-3">
                    <div className={`p-3 rounded-2 bg-${m.color} bg-opacity-10`}>
                      <div className={`fw-bold fs-5 text-${m.color}`}>{m.value}</div>
                      <small className="text-muted">{m.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
