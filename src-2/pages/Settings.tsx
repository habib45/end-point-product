import ContentHeader from '@/components/ui/ContentHeader'
import toast from 'react-hot-toast'

export default function Settings() {
  return (
    <>
      <ContentHeader title="Settings" breadcrumbs={[{ label: 'Settings' }]} />

      <div className="row g-3">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <nav className="nav flex-column">
                {[
                  { icon: 'bi-person', label: 'Profile' },
                  { icon: 'bi-lock', label: 'Security' },
                  { icon: 'bi-bell', label: 'Notifications' },
                  { icon: 'bi-palette', label: 'Appearance' },
                  { icon: 'bi-shield', label: 'Privacy' },
                  { icon: 'bi-credit-card', label: 'Billing' },
                ].map((item, i) => (
                  <a key={i} href="#" className={`nav-link d-flex align-items-center gap-2 px-3 py-2 ${i === 0 ? 'active' : 'text-body'}`}>
                    <i className={`bi ${item.icon}`}></i>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          {/* Profile Settings */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom fw-semibold">Profile Settings</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">First Name</label>
                  <input type="text" className="form-control" defaultValue="Admin" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input type="text" className="form-control" defaultValue="User" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input type="email" className="form-control" defaultValue="admin@example.com" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input type="tel" className="form-control" placeholder="+1 555-0100" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Timezone</label>
                  <select className="form-select">
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+5:30 (IST)</option>
                    <option>UTC+6 (BST - Bangladesh)</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Bio</label>
                  <textarea className="form-control" rows={3} placeholder="Write a short bio..."></textarea>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary" onClick={() => toast.success('Profile saved!')}>Save Profile</button>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom fw-semibold">Security</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Current Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">New Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="col-12">
                  <button className="btn btn-warning" onClick={() => toast.success('Password updated!')}>Update Password</button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom fw-semibold">Notification Preferences</div>
            <div className="card-body">
              <div className="row g-2">
                {[
                  { label: 'Email Notifications', desc: 'Receive updates via email', defaultChecked: true },
                  { label: 'SMS Alerts', desc: 'Critical alerts via SMS', defaultChecked: false },
                  { label: 'Two-Factor Authentication', desc: 'Extra security layer', defaultChecked: false },
                  { label: 'Weekly Reports', desc: 'Summary every Monday', defaultChecked: true },
                  { label: 'Marketing Emails', desc: 'Product news & offers', defaultChecked: false },
                  { label: 'Security Alerts', desc: 'Login & security notices', defaultChecked: true },
                ].map(pref => (
                  <div key={pref.label} className="col-md-6">
                    <div className="d-flex align-items-start justify-content-between p-3 border rounded-2">
                      <div>
                        <p className="mb-0 small fw-semibold">{pref.label}</p>
                        <small className="text-muted">{pref.desc}</small>
                      </div>
                      <div className="form-check form-switch ms-3 mt-1">
                        <input className="form-check-input" type="checkbox" defaultChecked={pref.defaultChecked} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary mt-3" onClick={() => toast.success('Preferences saved!')}>Save Preferences</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-0 shadow-sm border-danger">
            <div className="card-header bg-transparent border-bottom fw-semibold text-danger">Danger Zone</div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 p-3 border border-danger rounded-2">
                <div>
                  <p className="mb-0 fw-semibold">Export Account Data</p>
                  <small className="text-muted">Download all your data in JSON format</small>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={() => toast.success('Export started')}>Export Data</button>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-3 border border-danger rounded-2">
                <div>
                  <p className="mb-0 fw-semibold">Delete Account</p>
                  <small className="text-muted">Permanently delete your account and all data</small>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => toast.error('Action cancelled for demo')}>Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
