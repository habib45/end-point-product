import ContentHeader from '@/components/ui/ContentHeader'
import { mockUsers } from '@/services/mockData'
import { getStatusColor, getInitials } from '@/utils/helpers'

export default function Tables() {
  return (
    <>
      <ContentHeader title="Tables" breadcrumbs={[{ label: 'UI Kit' }, { label: 'Tables' }]} />

      <div className="row g-3">
        {/* Basic Table */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Basic Table</div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {mockUsers.slice(0, 4).map(u => (
                    <tr key={u.id}>
                      <td className="text-muted">{u.id}</td>
                      <td className="fw-semibold">{u.name}</td>
                      <td className="text-muted">{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(u.status)}-subtle text-${getStatusColor(u.status)} border`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hover + Striped */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Striped & Hover</div>
            <div className="table-responsive">
              <table className="table table-hover table-striped align-middle mb-0">
                <thead className="table-dark">
                  <tr><th>Name</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {mockUsers.slice(0, 4).map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.role}</td>
                      <td className="text-muted small">{u.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Avatar Table */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">With Avatars</div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr><th>User</th><th>Location</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {mockUsers.slice(0, 4).map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle"
                            style={{ width: 32, height: 32, color: '#0d6efd', fontWeight: 700, fontSize: 12 }}>
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <p className="mb-0 small fw-semibold">{u.name}</p>
                            <small className="text-muted">{u.email}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted small">{u.location ?? '—'}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(u.status)}-subtle text-${getStatusColor(u.status)} border`}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
