import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'

// ── Core Pages ──────────────────────────────────────────────
import Dashboard from '@/pages/Dashboard'
import Analytics from '@/pages/Analytics'
import Users from '@/pages/Users'
import UserDetail from '@/pages/UserDetail'
import Settings from '@/pages/Settings'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'

// ── Auth ────────────────────────────────────────────────────
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'

// ── Device Control ──────────────────────────────────────────
import DeviceDashboard from '@/pages/device-control/DeviceDashboard'
import Computers from '@/pages/device-control/Computers'
import DeviceClasses from '@/pages/device-control/DeviceClasses'

// ── Groups & Policies ────────────────────────────────────────
import Groups from '@/pages/groups/Groups'
import Policies from '@/pages/policies/Policies'

// ── Protection Modules ───────────────────────────────────────
import ContentAware from '@/pages/content-aware/ContentAware'
import EDiscovery from '@/pages/ediscovery/EDiscovery'
import Encryption from '@/pages/encryption/Encryption'
import AllowDenyLists from '@/pages/allowlists/AllowDenyLists'

// ── Logs & Reports ───────────────────────────────────────────
import Alerts from '@/pages/alerts/Alerts'
import Violations from '@/pages/reports/Violations'
import FileTransfers from '@/pages/logs/FileTransfers'
import SystemLogs from '@/pages/logs/SystemLogs'
import AuditTrail from '@/pages/logs/AuditTrail'
import Reports from '@/pages/reports/Reports'
import LogsReport from '@/pages/reports/LogsReport'

// ── System ───────────────────────────────────────────────────
import SystemAdmin from '@/pages/admin/SystemAdmin'
import License from '@/pages/system/License'
import Integrations from '@/pages/system/Integrations'
import Backup from '@/pages/system/Backup'

// ── UI Kit ───────────────────────────────────────────────────
import UIComponents from '@/pages/UIComponents'
import Tables from '@/pages/Tables'
import Charts from '@/pages/Charts'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      </Route>

      {/* Protected */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Core */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />

        {/* Device Control */}
        <Route path="/device-control/dashboard" element={<DeviceDashboard />} />
        <Route path="/device-control/computers" element={<Computers />} />
        <Route path="/device-control/classes" element={<DeviceClasses />} />

        {/* Groups & Policies */}
        <Route path="/groups" element={<Groups />} />
        <Route path="/policies" element={<Policies />} />

        {/* Protection */}
        <Route path="/content-aware" element={<ContentAware />} />
        <Route path="/ediscovery" element={<EDiscovery />} />
        <Route path="/encryption" element={<Encryption />} />
        <Route path="/allowlists" element={<AllowDenyLists />} />

        {/* Alerts & Logs */}
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports/violations" element={<Violations />} />
        <Route path="/logs/transfers" element={<FileTransfers />} />
        <Route path="/logs/system" element={<SystemLogs />} />
        <Route path="/logs/audit" element={<AuditTrail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/logs" element={<LogsReport />} />

        {/* System */}
        <Route path="/admin/system" element={<SystemAdmin />} />
        <Route path="/system/license" element={<License />} />
        <Route path="/system/integrations" element={<Integrations />} />
        <Route path="/system/backup" element={<Backup />} />

        {/* Account */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* UI Kit */}
        <Route path="/ui/components" element={<UIComponents />} />
        <Route path="/ui/tables" element={<Tables />} />
        <Route path="/ui/charts" element={<Charts />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
