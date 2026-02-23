import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'
import { useTable } from '@/hooks/useTable'
import { mockBlogPosts } from '@/services/mockData'
import { getStatusColor } from '@/utils/helpers'
import { BlogPost } from '@/types'
import toast from 'react-hot-toast'

export default function BlogPosts() {
  const table = useTable<Record<string, unknown>>({
    data: mockBlogPosts as unknown as Record<string, unknown>[],
    searchFields: ['title', 'author', 'category'],
    defaultPageSize: 5,
  })

  const columns = [
    {
      key: 'title', label: 'Title', sortable: true,
      render: (row: Record<string, unknown>) => {
        const p = row as unknown as BlogPost
        return (
          <div>
            <p className="mb-0 fw-semibold">{p.title}</p>
            <div className="d-flex gap-1 mt-1">
              {p.tags.map(t => (
                <span key={t} className="badge bg-secondary-subtle text-secondary border" style={{ fontSize: 10 }}>{t}</span>
              ))}
            </div>
          </div>
        )
      }
    },
    { key: 'category', label: 'Category', sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="badge bg-info-subtle text-info border border-info-subtle">{String(row.category)}</span>
      )
    },
    { key: 'author', label: 'Author', sortable: true },
    { key: 'date', label: 'Date', sortable: true,
      render: (row: Record<string, unknown>) => <span className="text-muted">{String(row.date)}</span>
    },
    {
      key: 'views', label: 'Views', sortable: true,
      render: (row: Record<string, unknown>) => (
        <span><i className="bi bi-eye me-1 text-muted"></i>{Number(row.views).toLocaleString()}</span>
      )
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (row: Record<string, unknown>) => {
        const color = getStatusColor(String(row.status))
        return <span className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle`}>{String(row.status)}</span>
      }
    },
    {
      key: 'actions', label: 'Actions',
      render: (row: Record<string, unknown>) => (
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-primary" onClick={() => toast.success(`View: ${String(row.title)}`)}>
            <i className="bi bi-eye"></i>
          </button>
          <button className="btn btn-outline-secondary" onClick={() => toast.success('Edit')}>
            <i className="bi bi-pencil"></i>
          </button>
          <button className="btn btn-outline-danger" onClick={() => toast.error('Delete')}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    },
  ]

  return (
    <>
      <ContentHeader title="Blog Posts" breadcrumbs={[{ label: 'Blog' }, { label: 'Posts' }]} />

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Posts', value: '124', icon: 'bi-journal-text', color: 'primary' },
          { label: 'Published', value: '98', icon: 'bi-check-circle', color: 'success' },
          { label: 'Drafts', value: '26', icon: 'bi-pencil-square', color: 'warning' },
          { label: 'Total Views', value: '48.2K', icon: 'bi-eye', color: 'info' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`bg-${s.color} bg-opacity-10 rounded-2 d-flex align-items-center justify-content-center flex-shrink-0`}
                  style={{ width: 48, height: 48 }}>
                  <i className={`bi ${s.icon} text-${s.color} fs-5`}></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">{s.value}</h5>
                  <small className="text-muted">{s.label}</small>
                </div>
              </div>
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
          <Link to="/blog/create" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg me-1"></i> New Post
          </Link>
        }
      />
    </>
  )
}
