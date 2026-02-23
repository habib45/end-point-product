import { useState } from 'react'
import { NavLink } from 'react-router-dom'

interface NavChild { label: string; path: string }
interface NavItem { label: string; icon: string; path?: string; badge?: string; badgeColor?: string; children?: NavChild[] }
interface NavGroup { heading: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    heading: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
      { label: 'Analytics', icon: 'bi-bar-chart-line', path: '/analytics' },
    ],
  },
  {
    heading: 'Device Control',
    items: [
      { label: 'Device Dashboard', icon: 'bi-usb-symbol', path: '/device-control/dashboard' },
      { label: 'Computers', icon: 'bi-pc-display', path: '/device-control/computers' },
      { label: 'Device Classes', icon: 'bi-tag', path: '/device-control/classes' },
      {
        label: 'Groups', icon: 'bi-diagram-3',
        children: [
          { label: 'User Groups', path: '/groups' },
          { label: 'Computer Groups', path: '/groups' },
        ],
      },
      { label: 'Policies', icon: 'bi-shield-check', path: '/policies' },
    ],
  },
  {
    heading: 'Protection',
    items: [
      { label: 'Content Aware', icon: 'bi-file-earmark-text', path: '/content-aware' },
      { label: 'eDiscovery', icon: 'bi-search', path: '/ediscovery' },
      { label: 'Encryption', icon: 'bi-lock', path: '/encryption' },
      {
        label: 'Denylist / Allowlist', icon: 'bi-list-check',
        children: [
          { label: 'Denylists', path: '/allowlists' },
          { label: 'Allowlists', path: '/allowlists' },
          { label: 'URL Categories', path: '/allowlists' },
        ],
      },
    ],
  },
  {
    heading: 'Logs & Reports',
    items: [
      { label: 'Alerts', icon: 'bi-bell', path: '/alerts', badge: '6', badgeColor: 'danger' },
      { label: 'Violations', icon: 'bi-shield-exclamation', path: '/reports/violations' },
      { label: 'File Transfers', icon: 'bi-arrow-left-right', path: '/logs/transfers' },
      { label: 'System Logs', icon: 'bi-journal-text', path: '/logs/system' },
      { label: 'Audit Trail', icon: 'bi-journal-check', path: '/logs/audit' },
      {
        label: 'Reports', icon: 'bi-file-earmark-bar-graph',
        children: [
          { label: 'Report Center', path: '/reports' },
          { label: 'Log Report', path: '/reports/logs' },
        ],
      },
    ],
  },
  {
    heading: 'Management',
    items: [
      { label: 'Users', icon: 'bi-people', path: '/users' },
    ],
  },
  {
    heading: 'System',
    items: [
      { label: 'System Admin', icon: 'bi-gear-wide-connected', path: '/admin/system' },
      { label: 'License', icon: 'bi-key', path: '/system/license' },
      { label: 'Integrations', icon: 'bi-plug', path: '/system/integrations' },
      { label: 'Backup & Maintenance', icon: 'bi-hdd', path: '/system/backup' },
      { label: 'Settings', icon: 'bi-gear', path: '/settings' },
    ],
  },
]

function NavItemComponent({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)

  if (item.children) {
    return (
      <li className="nav-item">
        <button
          className={`nav-link d-flex align-items-center gap-2 w-100 ${open ? 'active-parent' : ''}`}
          onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', textAlign: 'left' }}
        >
          <i className={`bi ${item.icon} nav-icon`}></i>
          <p className="mb-0 flex-grow-1">{item.label}</p>
          <i className={`bi bi-chevron-${open ? 'up' : 'down'} small`}></i>
        </button>
        {open && (
          <ul className="nav nav-treeview ms-3">
            {item.children.map(child => (
              <li key={child.label} className="nav-item">
                <NavLink
                  to={child.path}
                  className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
                >
                  <i className="bi bi-dash nav-icon"></i>
                  <p className="mb-0">{child.label}</p>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li className="nav-item">
      <NavLink
        to={item.path!}
        className={({ isActive }) => `nav-link d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
      >
        <i className={`bi ${item.icon} nav-icon`}></i>
        <p className="mb-0 flex-grow-1">{item.label}</p>
        {item.badge && (
          <span className={`badge bg-${item.badgeColor || 'primary'} rounded-pill`}>{item.badge}</span>
        )}
      </NavLink>
    </li>
  )
}

export default function Sidebar() {
  return (
    <aside className="app-sidebar bg-dark sidebar-dark-primary shadow" data-bs-theme="dark">
      {/* Brand */}
      <div className="sidebar-brand">
        <a href="/" className="brand-link d-flex align-items-center px-3 py-3 text-decoration-none">
          <div className="d-flex align-items-center justify-content-center bg-primary rounded-2 me-2" style={{ width: 36, height: 36 }}>
            <i className="bi bi-shield-fill-check text-white fs-6"></i>
          </div>
          <span className="brand-text fw-bold text-white fs-6">SentinelGo</span>
          <span className="badge bg-danger ms-1" style={{fontSize:'0.6rem'}}>PRO</span>
        </a>
      </div>

      {/* Nav */}
      <div className="sidebar-wrapper">
        <nav className="mt-2 pb-3">
          <ul className="nav sidebar-menu flex-column" role="menu">
            {navGroups.map(group => (
              <li key={group.heading}>
                <p className="nav-header text-uppercase px-3 mt-3 mb-1"
                  style={{ fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
                  {group.heading}
                </p>
                {group.items.map(item => (
                  <NavItemComponent key={item.label} item={item} />
                ))}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-top border-secondary mt-auto" style={{flexShrink:0}}>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-center bg-success rounded-circle"
            style={{ width: 8, height: 8, flexShrink: 0 }}></div>
          <small className="text-white-50">System Online</small>
        </div>
        <div className="mt-2">
          <small className="text-white-50 d-block">Endpoints Protected</small>
          <div className="d-flex align-items-center gap-2 mt-1">
            <div className="progress flex-grow-1" style={{ height: 4 }}>
              <div className="progress-bar bg-primary" style={{ width: '71%' }}></div>
            </div>
            <small className="text-white-50">712/1000</small>
          </div>
        </div>
      </div>
    </aside>
  )
}
