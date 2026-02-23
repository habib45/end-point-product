import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'
import { mockProducts } from '@/services/mockData'
import toast from 'react-hot-toast'

const STATUS_COLOR: Record<string,string> = { 'In Stock':'success','Low Stock':'warning','Out of Stock':'danger' }

export default function Products() {
  const columns = [
    { key:'name', label:'Product', sortable:true, render:(_:any,row:any)=>(
      <div>
        <Link to={`/ecommerce/products/${row.id}`} className="fw-semibold text-decoration-none text-body">{row.name}</Link>
        <div className="text-muted small">{row.sku}</div>
      </div>
    )},
    { key:'category', label:'Category', sortable:true, render:(v:any)=><span className="badge bg-secondary">{v}</span> },
    { key:'price', label:'Price', sortable:true, render:(v:any)=>`$${Number(v).toFixed(2)}` },
    { key:'stock', label:'Stock', sortable:true },
    { key:'sales', label:'Sales', sortable:true },
    { key:'status', label:'Status', sortable:true, render:(v:any)=>
      <span className={`badge bg-${STATUS_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'id', label:'Actions', render:(_:any,row:any)=>(
      <div className="btn-group btn-group-sm">
        <Link to={`/ecommerce/products/${row.id}`} className="btn btn-outline-primary"><i className="bi bi-eye"/></Link>
        <button className="btn btn-outline-secondary" onClick={()=>toast.success('Edit')}><i className="bi bi-pencil"/></button>
        <button className="btn btn-outline-danger"><i className="bi bi-trash"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Products" breadcrumbs={[{label:'E-Commerce'},{label:'Products'}]} />
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-semibold">All Products</h6>
          <Link to="/ecommerce/products/new" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg me-1"/>Add Product
          </Link>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={mockProducts as any[]} searchable />
        </div>
      </div>
    </>
  )
}
