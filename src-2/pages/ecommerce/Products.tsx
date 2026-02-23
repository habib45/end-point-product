import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'
import { useTable } from '@/hooks/useTable'
import { mockProducts } from '@/services/mockData'
import { formatCurrency, getStatusColor } from '@/utils/helpers'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function Products() {
  const table = useTable<Record<string, unknown>>({
    data: mockProducts as unknown as Record<string, unknown>[],
    searchFields: ['name', 'category', 'sku'],
    defaultPageSize: 6,
  })

  const columns = [
    {
      key: 'name', label: 'Product', sortable: true,
      render: (row: Record<string, unknown>) => {
        const p = row as unknown as Product
        return (
          <div className="d-flex align-items-center gap-2">
            <div className="bg-body-tertiary rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 44, height: 44, fontSize: 20 }}>
              📦
            </div>
            <div>
              <Link to={`/ecommerce/products/${p.id}`} className="fw-semibold text-decoration-none text-body">{p.name}</Link>
              <div className="small text-muted">SKU: {p.sku}</div>
            </div>
          </div>
        )
      }
    },
    { key: 'category', label: 'Category', sortable: true },
    {
      key: 'price', label: 'Price', sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="fw-semibold">{formatCurrency(Number(row.price))}</span>
      )
    },
    {
      key: 'stock', label: 'Stock', sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className={`fw-semibold ${Number(row.stock) === 0 ? 'text-danger' : Number(row.stock) < 15 ? 'text-warning' : 'text-success'}`}>
          {String(row.stock)}
        </span>
      )
    },
    {
      key: 'status', label: 'Status',
      render: (row: Record<string, unknown>) => {
        const color = getStatusColor(String(row.status))
        return <span className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle`}>{String(row.status)}</span>
      }
    },
    {
      key: 'sales', label: 'Sales', sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="text-muted">{String(row.sales)} units</span>
      )
    },
    {
      key: 'actions', label: 'Actions',
      render: (row: Record<string, unknown>) => (
        <div className="btn-group btn-group-sm">
          <Link to={`/ecommerce/products/${row.id}`} className="btn btn-outline-primary">
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
      <ContentHeader title="Products" breadcrumbs={[{ label: 'E-Commerce' }, { label: 'Products' }]} />

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Products', value: '248', icon: 'bi-box-seam', color: 'primary' },
          { label: 'In Stock', value: '201', icon: 'bi-check-circle', color: 'success' },
          { label: 'Low Stock', value: '32', icon: 'bi-exclamation-circle', color: 'warning' },
          { label: 'Out of Stock', value: '15', icon: 'bi-x-circle', color: 'danger' },
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
          <button className="btn btn-sm btn-primary" onClick={() => toast.success('Add Product')}>
            <i className="bi bi-plus-lg me-1"></i> Add Product
          </button>
        }
      />
    </>
  )
}
