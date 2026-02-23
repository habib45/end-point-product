import ContentHeader from '@/components/ui/ContentHeader'
import toast from 'react-hot-toast'

export default function UIComponents() {
  return (
    <>
      <ContentHeader title="UI Components" breadcrumbs={[{ label: import.meta.env.VITE_APP_NAME || 'UI Kit' }, { label: 'Components' }]} />

      <div className="row g-3">
        {/* Buttons */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Buttons</div>
            <div className="card-body d-flex flex-wrap gap-2">
              {['primary', 'secondary', 'success', 'danger', 'warning', 'info'].map(c => (
                <button key={c} className={`btn btn-${c}`}
                  onClick={() => toast.success(`${c} clicked`)}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
              <div className="w-100 mt-2 d-flex flex-wrap gap-2">
                {['primary', 'secondary', 'success', 'danger'].map(c => (
                  <button key={c} className={`btn btn-outline-${c}`}>{c}</button>
                ))}
              </div>
              <div className="w-100 mt-2 d-flex flex-wrap gap-2">
                <button className="btn btn-primary btn-sm">Small</button>
                <button className="btn btn-primary">Normal</button>
                <button className="btn btn-primary btn-lg">Large</button>
                <button className="btn btn-primary" disabled><span className="spinner-border spinner-border-sm me-1"></span>Loading</button>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Badges & Alerts</div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {['primary', 'secondary', 'success', 'danger', 'warning', 'info'].map(c => (
                  <span key={c} className={`badge bg-${c}`}>{c}</span>
                ))}
              </div>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {['primary', 'success', 'warning', 'danger'].map(c => (
                  <span key={c} className={`badge bg-${c}-subtle text-${c} border border-${c}-subtle`}>{c}</span>
                ))}
              </div>
              {['success', 'warning', 'danger', 'info'].map(c => (
                <div key={c} className={`alert alert-${c} py-2 px-3 mb-2`} style={{ fontSize: 13 }}>
                  <i className={`bi bi-${c === 'success' ? 'check-circle' : c === 'danger' ? 'x-circle' : c === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2`}></i>
                  This is a {c} alert message.
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Cards</div>
            <div className="card-body">
              <div className="row g-2">
                {['primary', 'success', 'warning', 'danger'].map(c => (
                  <div key={c} className="col-6">
                    <div className={`card border-0 bg-${c} text-white`}>
                      <div className="card-body py-2 px-3">
                        <div className="fw-semibold small">{c.toUpperCase()}</div>
                        <div className="fw-bold fs-5">$12,430</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Elements */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Form Elements</div>
            <div className="card-body">
              <div className="mb-2">
                <input type="text" className="form-control form-control-sm mb-2" placeholder="Text input" />
                <select className="form-select form-select-sm mb-2">
                  <option>Select option...</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultChecked />
                  <label className="form-check-label small">Checkbox</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" defaultChecked />
                  <label className="form-check-label small">Radio</label>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" defaultChecked />
                  <label className="form-check-label small">Toggle</label>
                </div>
              </div>
              <div className="mt-2">
                <input type="range" className="form-range" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Progress Bars</div>
            <div className="card-body">
              {[
                { color: 'primary', val: 72 },
                { color: 'success', val: 55 },
                { color: 'warning', val: 88 },
                { color: 'danger', val: 30 },
                { color: 'info', val: 65 },
              ].map(b => (
                <div key={b.color} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-capitalize fw-semibold">{b.color}</small>
                    <small className="text-muted">{b.val}%</small>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className={`progress-bar bg-${b.color}`} style={{ width: `${b.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spinners & Toast */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom fw-semibold">Spinners & Toasts</div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3 mb-3">
                {['primary', 'secondary', 'success', 'danger'].map(c => (
                  <div key={c} className={`spinner-border text-${c}`} style={{ width: 28, height: 28 }}></div>
                ))}
                {['primary', 'success', 'warning', 'danger'].map(c => (
                  <div key={c + 'g'} className={`spinner-grow text-${c}`} style={{ width: 28, height: 28 }}></div>
                ))}
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-sm btn-success" onClick={() => toast.success('Operation successful!')}>Success Toast</button>
                <button className="btn btn-sm btn-danger" onClick={() => toast.error('Something went wrong!')}>Error Toast</button>
                <button className="btn btn-sm btn-secondary" onClick={() => toast('Info message')}>Info Toast</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
