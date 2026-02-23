import { ReactNode } from 'react'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (row: T) => ReactNode
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  rows: T[]
  search: string
  onSearch: (q: string) => void
  page: number
  totalPages: number
  totalRows: number
  pageSize: number
  onPageChange: (p: number) => void
  sortKey?: keyof T | null
  sortDir?: 'asc' | 'desc'
  onSort?: (key: keyof T) => void
  actions?: ReactNode
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  search,
  onSearch,
  page,
  totalPages,
  totalRows,
  pageSize,
  onPageChange,
  sortKey,
  sortDir,
  onSort,
  actions,
  loading,
  emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalRows)

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-transparent border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
          <span className="input-group-text"><i className="bi bi-search text-muted"></i></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-outline-secondary" onClick={() => onSearch('')}>
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
        <div className="d-flex gap-2">{actions}</div>
      </div>

      <div className="card-body p-0">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  {columns.map(col => (
                    <th
                      key={String(col.key)}
                      style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                      onClick={() => col.sortable && onSort && onSort(col.key as keyof T)}
                    >
                      <div className="d-flex align-items-center gap-1">
                        {col.label}
                        {col.sortable && (
                          <i className={`bi bi-arrow-${
                            sortKey === col.key
                              ? sortDir === 'asc' ? 'up' : 'down'
                              : 'down-up'
                          } text-muted small`}></i>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? rows.map((row, i) => (
                  <tr key={i}>
                    {columns.map(col => (
                      <td key={String(col.key)}>
                        {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                      </td>
                    ))}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center text-muted py-5">
                      <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25"></i>
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalRows > 0 && (
        <div className="card-footer bg-transparent border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <small className="text-muted">
            Showing {start}–{end} of {totalRows} results
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(page - 1)}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = totalPages <= 5 ? i + 1 : Math.max(1, page - 2) + i
                if (p > totalPages) return null
                return (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
                  </li>
                )
              })}
              <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(page + 1)}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
