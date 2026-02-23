import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'

const STATS = [
  { label: 'Endpoints Online', value: '712', sub: 'of 1,000 licensed', icon: 'bi-pc-display', color: 'success', link: '/device-control/computers' },
  { label: 'Active Alerts', value: '6', sub: '2 critical', icon: 'bi-bell-fill', color: 'danger', link: '/alerts' },
  { label: 'Violations Today', value: '187', sub: '42 critical', icon: 'bi-shield-exclamation', color: 'warning', link: '/reports/violations' },
  { label: 'Active Policies', value: '8', sub: '3 types', icon: 'bi-shield-check', color: 'primary', link: '/policies' },
  { label: 'Files Blocked Today', value: '61', sub: 'DLP enforcement', icon: 'bi-slash-circle', color: 'danger', link: '/content-aware' },
  { label: 'Devices Monitored', value: '2,341', sub: 'across all classes', icon: 'bi-usb-symbol', color: 'info', link: '/device-control/dashboard' },
  { label: 'eDiscovery Scans', value: '3', sub: '1 running now', icon: 'bi-search', color: 'secondary', link: '/ediscovery' },
  { label: 'Encrypted Devices', value: '234', sub: 'AES-256', icon: 'bi-lock-fill', color: 'success', link: '/encryption' },
]

const RECENT_EVENTS = [
  { icon: 'bi-slash-circle-fill', color: 'danger', msg: 'Blacklisted USB blocked on WS-FINANCE-01', user: 'j.smith', time: '2m ago' },
  { icon: 'bi-file-earmark-x-fill', color: 'danger', msg: 'Credit card data transfer blocked (PCI-DSS policy)', user: 'a.jones', time: '8m ago' },
  { icon: 'bi-lock-fill', color: 'warning', msg: 'USB device connected without required encryption', user: 'm.chen', time: '22m ago' },
  { icon: 'bi-exclamation-triangle-fill', color: 'warning', msg: 'Encryption bypass attempt detected', user: 'r.patel', time: '31m ago' },
  { icon: 'bi-pc-display', color: 'success', msg: 'New endpoint enrolled and policy applied', user: 'system', time: '45m ago' },
  { icon: 'bi-file-earmark-check-fill', color: 'success', msg: 'eDiscovery scan completed — 84,231 files scanned', user: 'system', time: '1h ago' },
  { icon: 'bi-person-plus-fill', color: 'info', msg: 'User synced from Active Directory', user: 'system', time: '1h ago' },
  { icon: 'bi-exclamation-octagon-fill', color: 'danger', msg: 'SSN pattern match in outbound email blocked', user: 'k.wilson', time: '2h ago' },
]

const SYSTEM_STATUS = [
  { label: 'Policy Engine', status: 'Operational', color: 'success' },
  { label: 'Content Inspection', status: 'Operational', color: 'success' },
  { label: 'eDiscovery Scanner', status: '1 Running', color: 'warning' },
  { label: 'Encryption Service', status: 'Operational', color: 'success' },
  { label: 'Alert Engine', status: 'Operational', color: 'success' },
  { label: 'SIEM Forwarding', status: 'Operational', color: 'success' },
  { label: 'AD Sync', status: 'Last: 1h ago', color: 'info' },
  { label: 'Database', status: '75% capacity', color: 'warning' },
]

const TOP_VIOLATORS = [
  { user: 'j.smith', dept: 'Finance', violations: 14, color: 'danger' },
  { user: 'a.jones', dept: 'HR', violations: 9, color: 'warning' },
  { user: 'r.patel', dept: 'Legal', violations: 7, color: 'warning' },
  { user: 'k.wilson', dept: 'Management', violations: 5, color: 'info' },
  { user: 'm.chen', dept: 'Engineering', violations: 3, color: 'info' },
]

export default function Dashboard() {
  return (
    <>
      <ContentHeader title="Dashboard" breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]} />

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {STATS.map(s => (
          <div className="col-6 col-lg-3" key={s.label}>
            <Link to={s.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }}>
                <div className="card-body p-3 d-flex align-items-center gap-3">
                  <div className={`rounded-3 d-flex align-items-center justify-content-center bg-${s.color}-subtle`} style={{ width: 48, height: 48, flexShrink: 0 }}>
                    <i className={`bi ${s.icon} text-${s.color} fs-4`} />
                  </div>
                  <div className="min-w-0">
                    <div className="small text-muted text-truncate">{s.label}</div>
                    <div className="fw-bold fs-5 text-dark">{s.value}</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{s.sub}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Events */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-semibold"><i className="bi bi-activity me-2 text-primary" />Security Events Feed</h6>
              <Link to="/logs/system" className="btn btn-sm btn-outline-secondary">View All</Link>
            </div>
            <div className="card-body p-0">
              {RECENT_EVENTS.map((e, i) => (
                <div key={i} className="d-flex align-items-start gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  <div className={`d-flex align-items-center justify-content-center rounded-circle bg-${e.color}-subtle`} style={{ width: 34, height: 34, flexShrink: 0 }}>
                    <i className={`bi ${e.icon} text-${e.color}`} style={{ fontSize: '0.85rem' }} />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="small fw-semibold text-truncate">{e.msg}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-person me-1" />{e.user} · {e.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          {/* System Status */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-semibold"><i className="bi bi-server me-2 text-success" />System Status</h6>
            </div>
            <div className="card-body p-0">
              {SYSTEM_STATUS.map(s => (
                <div key={s.label} className="d-flex align-items-center justify-content-between px-3 py-2" style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  <span className="small">{s.label}</span>
                  <span className={`badge bg-${s.color}-subtle text-${s.color} border`} style={{ fontSize: '0.7rem' }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Violators */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-semibold"><i className="bi bi-person-exclamation me-2 text-warning" />Top Violators Today</h6>
              <Link to="/reports/violations" className="btn btn-sm btn-outline-secondary">All</Link>
            </div>
            <div className="card-body p-0">
              {TOP_VIOLATORS.map((v, i) => (
                <div key={i} className="d-flex align-items-center gap-3 px-3 py-2" style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  <div className="d-flex align-items-center justify-content-center bg-secondary-subtle rounded-circle fw-bold text-secondary"
                    style={{ width: 30, height: 30, flexShrink: 0, fontSize: '0.75rem' }}>
                    {v.user.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-semibold">{v.user}</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{v.dept}</div>
                  </div>
                  <span className={`badge bg-${v.color}`}>{v.violations}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
