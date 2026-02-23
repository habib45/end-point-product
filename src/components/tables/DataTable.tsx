import { useState, useMemo, ReactNode } from 'react'

export interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  searchable?: boolean
  pageSize?: number
  actions?: ReactNode
  loading?: boolean
  emptyMessage?: string
  title?: string
  sortable?: boolean
  paginate?: boolean
}

export default function DataTable({
  columns,
  data = [],
  searchable = false,
  pageSize = 10,
  actions,
  loading = false,
  emptyMessage = 'No data found.',
}: DataTableProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(row =>
      Object.values(row).some(v =>
        v !== null && v !== undefined && String(v).toLowerCase().includes(q)
      )
    )
  }, [data, search])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalRows = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const rows = sorted.slice(start, start + pageSize)

  const handleSearch = (q: string) => {
    setSearch(q)
    setPage(1)
  }

  // Page numbers to show (up to 5 around current page)
  const pageNums = useMemo(() => {
    const nums: number[] = []
    const lo = Math.max(1, safePage - 2)
    const hi = Math.min(totalPages, lo + 4)
    for (let i = lo; i <= hi; i++) nums.push(i)
    return nums
  }, [safePage, totalPages])

  return (
    <div>
      {/* Toolbar */}
      {(searchable || actions) && (
        <div className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
          {searchable && (
            <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
              <span className="input-group-text border-end-0 bg-white">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary" onClick={() => handleSearch('')}>
                  <i className="bi bi-x" />
                </button>
              )}
            </div>
          )}
          {actions && <div className="d-flex gap-2 ms-auto">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="d-flex align-items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <i className={`bi small text-muted bi-arrow-${
                          sortKey === col.key
                            ? sortDir === 'asc' ? 'up' : 'down'
                            : 'down-up'
                        }`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? rows.map((row, i) => (
                <tr key={row.id ?? i}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] !== null && row[col.key] !== undefined
                          ? String(row[col.key])
                          : <span className="text-muted">—</span>
                      }
                    </td>
                  ))}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length} className="text-center text-muted py-5">
                    <i className="bi bi-inbox fs-2 d-block mb-2 opacity-25" />
                    {search ? `No results for "${search}"` : emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalRows > 0 && (
        <div className="px-3 py-2 border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <small className="text-muted">
            Showing {totalRows === 0 ? 0 : start + 1}–{Math.min(start + pageSize, totalRows)} of {totalRows}
          </small>
          {totalPages > 1 && (
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>
                    <i className="bi bi-chevron-left" />
                  </button>
                </li>
                {pageNums.map(p => (
                  <li key={p} className={`page-item ${p === safePage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${safePage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                    <i className="bi bi-chevron-right" />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  )
}
