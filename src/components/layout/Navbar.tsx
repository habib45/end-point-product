import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { getInitials } from '@/utils/helpers'

interface NavbarProps {
  onToggleSidebar: () => void
}

const notifications = [
  { icon: 'bi-envelope', color: 'primary', text: '4 new messages', time: '3 mins ago' },
  { icon: 'bi-cart-check', color: 'success', text: 'Order #1027 completed', time: '15 mins ago' },
  { icon: 'bi-exclamation-triangle', color: 'warning', text: 'Server usage at 88%', time: '1 hr ago' },
  { icon: 'bi-person-plus', color: 'info', text: 'New user registered', time: '2 hrs ago' },
]

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth()
  const { toggleTheme, isDark } = useTheme()

  return (
    <nav className="app-header navbar navbar-expand bg-body border-bottom">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button className="nav-link btn btn-link px-2" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
              <i className="bi bi-list fs-4"></i>
            </button>
          </li>
          <li className="nav-item d-none d-md-flex align-items-center ms-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-body border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input type="text" className="form-control border-start-0 ps-0" placeholder="Search..." style={{ width: 220 }} />
            </div>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto gap-1">
          {/* Theme Toggle */}
          <li className="nav-item">
            <button className="nav-link btn btn-link px-2" onClick={toggleTheme} title="Toggle theme">
              <i className={`bi bi-${isDark ? 'sun' : 'moon'} fs-5`}></i>
            </button>
          </li>

          {/* Notifications */}
          <li className="nav-item dropdown">
            <button className="nav-link btn btn-link px-2 position-relative" data-bs-toggle="dropdown">
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-1 start-75 badge rounded-pill bg-danger" style={{ fontSize: 9 }}>4</span>
            </button>
            <div className="dropdown-menu dropdown-menu-end shadow" style={{ width: 300 }}>
              <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                <span className="fw-semibold">Notifications</span>
                <span className="badge bg-primary rounded-pill">4 new</span>
              </div>
              {notifications.map((n, i) => (
                <a key={i} href="#" className="dropdown-item d-flex align-items-start gap-2 py-2 px-3">
                  <div className={`bg-${n.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1`}
                    style={{ width: 34, height: 34 }}>
                    <i className={`bi ${n.icon} text-${n.color} small`}></i>
                  </div>
                  <div>
                    <p className="mb-0 small fw-semibold">{n.text}</p>
                    <small className="text-muted">{n.time}</small>
                  </div>
                </a>
              ))}
              <div className="border-top px-3 py-2 text-center">
                <a href="#" className="text-primary small">View all notifications</a>
              </div>
            </div>
          </li>

          {/* Messages */}
          <li className="nav-item dropdown">
            <button className="nav-link btn btn-link px-2 position-relative" data-bs-toggle="dropdown">
              <i className="bi bi-chat-dots fs-5"></i>
              <span className="position-absolute top-1 start-75 badge rounded-pill bg-success" style={{ fontSize: 9 }}>2</span>
            </button>
            <div className="dropdown-menu dropdown-menu-end shadow" style={{ width: 280 }}>
              <div className="px-3 py-2 border-bottom fw-semibold">Messages</div>
              {[
                { name: 'Alice Johnson', msg: 'Hey, can you check the latest report?', time: '2m' },
                { name: 'Bob Martin', msg: 'The design files are ready for review.', time: '1h' },
              ].map((m, i) => (
                <a key={i} href="#" className="dropdown-item d-flex align-items-start gap-2 py-2 px-3">
                  <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle flex-shrink-0"
                    style={{ width: 36, height: 36, color: '#0d6efd', fontWeight: 700, fontSize: 13 }}>
                    {getInitials(m.name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="mb-0 small fw-semibold">{m.name}</p>
                    <small className="text-muted text-truncate d-block">{m.msg}</small>
                    <small className="text-muted">{m.time}</small>
                  </div>
                </a>
              ))}
              <div className="border-top px-3 py-2 text-center">
                <a href="#" className="text-primary small">View all messages</a>
              </div>
            </div>
          </li>

          {/* User Menu */}
          <li className="nav-item dropdown">
            <button className="nav-link btn btn-link px-2 d-flex align-items-center gap-2" data-bs-toggle="dropdown">
              <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle"
                style={{ width: 32, height: 32, color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {user ? getInitials(user.name) : 'A'}
              </div>
              <span className="d-none d-md-inline small fw-semibold">{user?.name}</span>
              <i className="bi bi-chevron-down small"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li className="px-3 py-2 border-bottom">
                <p className="mb-0 fw-semibold small">{user?.name}</p>
                <small className="text-muted">{user?.email}</small>
              </li>
              <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
              <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Sign Out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  )
}
