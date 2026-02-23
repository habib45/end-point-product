import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'
import { mockOrders } from '@/services/mockData'
import toast from 'react-hot-toast'

const STATUS_COLOR: Record<string,string> = { Completed:'success', Pending:'warning', Processing:'info', Cancelled:'danger' }

export default function Orders() {
  const columns = [
    { key:'id', label:'Order ID', sortable:true, render:(v:any)=><span className="fw-semibold font-monospace">{v}</span> },
    { key:'customer', label:'Customer', sortable:true },
    { key:'date', label:'Date', sortable:true },
    { key:'items', label:'Items', render:(v:any)=><span className="badge bg-secondary">{v}</span> },
    { key:'amount', label:'Amount', sortable:true, render:(v:any)=><span className="fw-semibold">{v}</span> },
    { key:'paymentMethod', label:'Payment' },
    { key:'status', label:'Status', sortable:true, render:(v:any)=>
      <span className={`badge bg-${STATUS_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'id', label:'Actions', render:(_:any,row:any)=>(
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary" onClick={()=>toast.success(`Viewing ${row.id}`)}><i className="bi bi-eye"/></button>
        <button className="btn btn-outline-secondary"><i className="bi bi-printer"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Orders" breadcrumbs={[{label:'E-Commerce'},{label:'Orders'}]} />
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <DataTable columns={columns} data={mockOrders as any[]} searchable />
        </div>
      </div>
    </>
  )
}
