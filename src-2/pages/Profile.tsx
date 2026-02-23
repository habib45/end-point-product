import { useAuth } from '@/context/AuthContext'
import ContentHeader from '@/components/ui/ContentHeader'
import { getInitials } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <>
      <ContentHeader title="My Profile" breadcrumbs={[{ label: 'Profile' }]} />

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4 mb-3">
            <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mx-auto mb-3"
              style={{ width: 96, height: 96, color: '#0d6efd', fontWeight: 700, fontSize: 32 }}>
              {getInitials(user.name)}
            </div>
            <h5 className="fw-bold mb-1">{user.name}</h5>
            <p className="text-muted small mb-1">{user.email}</p>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-3">{user.role}</span>

            <div className="d-flex justify-content-center gap-4 mb-3">
              {[{ label: 'Posts', val: 24 }, { label: 'Followers', val: 140 }, { label: 'Following', val: 52 }].map(m => (
                <div key={m.label} className="text-center">
                  <div className="fw-bold">{m.val}</div>
                  <small className="text-muted">{m.label}</small>
                </div>
              ))}
            </div>

            <button className="btn btn-primary btn-sm" onClick={() => toast.success('Edit profile')}>
              <i className="bi bi-pencil me-1"></i>Edit Profile
            </button>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Skills</div>
            <div className="card-body">
              {[
                { skill: 'React / TypeScript', val: 90 },
                { skill: 'Node.js', val: 75 },
                { skill: 'UI Design', val: 60 },
                { skill: 'Database', val: 70 },
              ].map(s => (
                <div key={s.skill} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="fw-semibold">{s.skill}</small>
                    <small className="text-muted">{s.val}%</small>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div className="progress-bar bg-primary" style={{ width: `${s.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom fw-semibold">Edit Profile</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">First Name</label>
                  <input type="text" className="form-control" defaultValue={user.name.split(' ')[0]} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input type="text" className="form-control" defaultValue={user.name.split(' ')[1] ?? ''} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" defaultValue={user.email} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input type="tel" className="form-control" placeholder="+1 555-0100" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Location</label>
                  <input type="text" className="form-control" placeholder="City, Country" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Bio</label>
                  <textarea className="form-control" rows={3} placeholder="Tell us about yourself..."></textarea>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" onClick={() => toast.success('Profile updated!')}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Recent Activity</div>
            <div className="card-body p-0">
              {[
                { icon: 'bi-journal-plus', color: 'primary', msg: 'Created blog post "React 18 Guide"', time: '2 hours ago' },
                { icon: 'bi-pencil', color: 'success', msg: 'Updated product pricing', time: '1 day ago' },
                { icon: 'bi-person-check', color: 'info', msg: 'Approved 3 new user accounts', time: '2 days ago' },
                { icon: 'bi-gear', color: 'warning', msg: 'Updated system settings', time: '3 days ago' },
              ].map((a, i) => (
                <div key={i} className="d-flex align-items-center gap-3 px-3 py-3 border-bottom">
                  <div className={`bg-${a.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0`}
                    style={{ width: 38, height: 38 }}>
                    <i className={`bi ${a.icon} text-${a.color} small`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-0 small fw-semibold">{a.msg}</p>
                    <small className="text-muted">{a.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
