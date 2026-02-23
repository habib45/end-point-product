import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'
import { useTable } from '@/hooks/useTable'
import { mockUsers } from '@/services/mockData'
import { getInitials, getStatusColor } from '@/utils/helpers'
import { User } from '@/types'
import toast from 'react-hot-toast'

export default function Users() {
  const table = useTable<Record<string, unknown>>({
    data: mockUsers as unknown as Record<string, unknown>[],
    searchFields: ['name', 'email', 'role'],
    defaultPageSize: 5,
  })

  const columns = [
    {
      key: 'name', label: 'User', sortable: true,
      render: (row: Record<string, unknown>) => {
        const u = row as unknown as User
        return (
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle flex-shrink-0"
              style={{ width: 36, height: 36, color: '#0d6efd', fontWeight: 700, fontSize: 13 }}>
              {getInitials(u.name)}
            </div>
            <div>
              <Link to={`/users/${u.id}`} className="fw-semibold text-decoration-none text-body">{u.name}</Link>
              <div className="small text-muted">{u.email}</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'role', label: 'Role', sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
          {String(row.role)}
        </span>
      )
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (row: Record<string, unknown>) => {
        const color = getStatusColor(String(row.status))
        return (
          <span className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle`}>
            <i className={`bi bi-circle-fill me-1`} style={{ fontSize: 6 }}></i>
            {String(row.status)}
          </span>
        )
      }
    },
    {
      key: 'location', label: 'Location',
      render: (row: Record<string, unknown>) => (
        <span className="text-muted small"><i className="bi bi-geo-alt me-1"></i>{String(row.location ?? '—')}</span>
      )
    },
    { key: 'joined', label: 'Joined', sortable: true },
    {
      key: 'actions', label: 'Actions',
      render: (row: Record<string, unknown>) => (
        <div className="btn-group btn-group-sm">
          <Link to={`/users/${row.id}`} className="btn btn-outline-primary">
            <i className="bi bi-eye"></i>
          </Link>
          <button className="btn btn-outline-secondary" onClick={() => toast.success('Edit clicked')}>
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn btn-outline-danger" onClick={() => toast.error('Delete clicked')}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    },
  ]

  return (
    <>
      <ContentHeader title="Users" breadcrumbs={[{ label: 'Users' }]} />

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Users', value: '12,842', icon: 'bi-people', color: 'primary' },
          { label: 'Active', value: '10,204', icon: 'bi-person-check', color: 'success' },
          { label: 'Inactive', value: '2,638', icon: 'bi-person-dash', color: 'warning' },
          { label: 'Admins', value: '24', icon: 'bi-shield-check', color: 'danger' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3">
              <div className={`bg-${s.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2`}
                style={{ width: 48, height: 48 }}>
                <i className={`bi ${s.icon} text-${s.color} fs-5`}></i>
              </div>
              <h5 className="mb-0 fw-bold">{s.value}</h5>
              <small className="text-muted">{s.label}</small>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={table.rows}
        search={table.search}
        onSearch={table.setSearch}
        page={table.page}
        totalPages={table.totalPages}
        totalRows={table.totalRows}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        sortKey={table.sortKey}
        sortDir={table.sortDir}
        onSort={table.handleSort}
        actions={
          <button className="btn btn-sm btn-primary" onClick={() => toast.success('Add User clicked')}>
            <i className="bi bi-plus-lg me-1"></i> Add User
          </button>
        }
      />
    </>
  )
}
