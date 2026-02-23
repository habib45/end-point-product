import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'
import { useTable } from '@/hooks/useTable'
import { mockOrders } from '@/services/mockData'
import { getStatusColor } from '@/utils/helpers'
import { Order } from '@/types'
import toast from 'react-hot-toast'

export default function Orders() {
  const table = useTable<Record<string, unknown>>({
    data: mockOrders as unknown as Record<string, unknown>[],
    searchFields: ['id', 'customer', 'status', 'paymentMethod'],
    defaultPageSize: 5,
  })

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true,
      render: (row: Record<string, unknown>) => <span className="fw-semibold text-primary">{String(row.id)}</span>
    },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'date', label: 'Date', sortable: true,
      render: (row: Record<string, unknown>) => <span className="text-muted">{String(row.date)}</span>
    },
    { key: 'items', label: 'Items',
      render: (row: Record<string, unknown>) => <span>{String(row.items)} items</span>
    },
    { key: 'paymentMethod', label: 'Payment' },
    { key: 'amount', label: 'Amount', sortable: true,
      render: (row: Record<string, unknown>) => <span className="fw-semibold">{String(row.amount)}</span>
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
      render: (row: Record<string, unknown>) => {
        const o = row as unknown as Order
        return (
          <div className="btn-group btn-group-sm">
            <button className="btn btn-outline-primary" onClick={() => toast.success(`Viewing ${o.id}`)}>
              <i className="bi bi-eye"></i>
            </button>
            <button className="btn btn-outline-success" onClick={() => toast.success(`Invoice for ${o.id}`)}>
              <i className="bi bi-receipt"></i>
            </button>
            <button className="btn btn-outline-danger" onClick={() => toast.error(`Cancel ${o.id}`)}>
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        )
      }
    },
  ]

  return (
    <>
      <ContentHeader title="Orders" breadcrumbs={[{ label: 'E-Commerce' }, { label: 'Orders' }]} />

      <div className="row g-3 mb-4">
        {[
          { label: 'Total Orders', value: '1,203', icon: 'bi-cart', color: 'primary' },
          { label: 'Completed', value: '842', icon: 'bi-check-circle', color: 'success' },
          { label: 'Pending', value: '215', icon: 'bi-hourglass-split', color: 'warning' },
          { label: 'Cancelled', value: '146', icon: 'bi-x-circle', color: 'danger' },
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
          <button className="btn btn-sm btn-outline-success" onClick={() => toast.success('Export Orders')}>
            <i className="bi bi-download me-1"></i> Export
          </button>
        }
      />
    </>
  )
}
