import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'
import { mockBlogPosts } from '@/services/mockData'

const STATUS_COLOR: Record<string,string> = { Published:'success', Draft:'warning' }

export default function BlogPosts() {
  const columns = [
    { key:'title', label:'Title', sortable:true, render:(_:any,row:any)=>(
      <div>
        <div className="fw-semibold small">{row.title}</div>
        <div className="text-muted" style={{fontSize:'0.75rem'}}>{row.tags?.join(', ')}</div>
      </div>
    )},
    { key:'category', label:'Category', render:(v:any)=><span className="badge bg-secondary">{v}</span> },
    { key:'author', label:'Author', sortable:true },
    { key:'date', label:'Date', sortable:true },
    { key:'views', label:'Views', sortable:true, render:(v:any)=>v.toLocaleString() },
    { key:'status', label:'Status', sortable:true, render:(v:any)=>
      <span className={`badge bg-${STATUS_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'id', label:'Actions', render:()=>(
      <div className="btn-group btn-group-sm">
        <button className="btn btn-outline-primary"><i className="bi bi-eye"/></button>
        <button className="btn btn-outline-secondary"><i className="bi bi-pencil"/></button>
        <button className="btn btn-outline-danger"><i className="bi bi-trash"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Blog Posts" breadcrumbs={[{label:'Blog'},{label:'All Posts'}]} />
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-semibold">All Posts</h6>
          <Link to="/blog/create" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-lg me-1"/>New Post
          </Link>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={mockBlogPosts as any[]} searchable />
        </div>
      </div>
    </>
  )
}
