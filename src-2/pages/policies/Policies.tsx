import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_POLICIES = [
  { id:'1', name:'Global USB Block Policy', type:'DEVICE_CONTROL', status:'ACTIVE', priority:10, version:3, rules:5, assignments:12, created:'2025-01-10', created_by:'admin' },
  { id:'2', name:'PCI-DSS Credit Card Protection', type:'CONTENT_AWARE', status:'ACTIVE', priority:5, version:2, rules:3, assignments:8, created:'2025-01-15', created_by:'j.smith' },
  { id:'3', name:'HIPAA Patient Data Policy', type:'CONTENT_AWARE', status:'ACTIVE', priority:5, version:1, rules:4, assignments:6, created:'2025-01-20', created_by:'a.jones' },
  { id:'4', name:'EasyLock Encryption Enforcement', type:'ENCRYPTION', status:'ACTIVE', priority:20, version:1, rules:2, assignments:15, created:'2025-01-22', created_by:'admin' },
  { id:'5', name:'Executive Communications Monitor', type:'CONTENT_AWARE', status:'DRAFT', priority:50, version:1, rules:1, assignments:0, created:'2025-02-10', created_by:'k.wilson' },
  { id:'6', name:'Developer Machine Exception', type:'DEVICE_CONTROL', status:'ACTIVE', priority:30, version:2, rules:3, assignments:4, created:'2025-01-25', created_by:'admin' },
  { id:'7', name:'Contractor USB Read-Only', type:'DEVICE_CONTROL', status:'INACTIVE', priority:40, version:1, rules:2, assignments:3, created:'2025-01-30', created_by:'r.patel' },
  { id:'8', name:'SSN Protection Policy', type:'CONTENT_AWARE', status:'ACTIVE', priority:5, version:3, rules:2, assignments:9, created:'2025-01-12', created_by:'j.smith' },
]

const TYPE_COLOR: Record<string,string> = {
  DEVICE_CONTROL: 'primary',
  CONTENT_AWARE: 'info',
  ENCRYPTION: 'warning',
  EDISCOVERY: 'secondary',
}

const STATUS_COLOR: Record<string,string> = {
  ACTIVE: 'success', INACTIVE: 'secondary', DRAFT: 'warning', DEPRECATED: 'danger'
}

export default function Policies() {
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)

  const filtered = MOCK_POLICIES.filter(p => {
    if (typeFilter !== 'ALL' && p.type !== typeFilter) return false
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false
    return true
  })

  const columns = [
    { key: 'priority', label: 'Priority', sortable: true, render: (v: number) =>
      <span className="badge bg-dark"># {v}</span>
    },
    { key: 'name', label: 'Policy Name', sortable: true, render: (v: string, row: any) => (
      <div>
        <div className="fw-semibold small">{v}</div>
        <div className="text-muted" style={{fontSize:'0.75rem'}}>{row.rules} rule{row.rules!==1?'s':''} · {row.assignments} assignment{row.assignments!==1?'s':''}</div>
      </div>
    )},
    { key: 'type', label: 'Type', render: (v: string) =>
      <span className={`badge bg-${TYPE_COLOR[v]||'secondary'}`}>{v.replace('_',' ')}</span>
    },
    { key: 'status', label: 'Status', render: (v: string) =>
      <span className={`badge bg-${STATUS_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key: 'version', label: 'Ver', render: (v: number) => <span className="text-muted">v{v}</span> },
    { key: 'created_by', label: 'Author' },
    { key: 'created', label: 'Created', sortable: true },
    { key: 'id', label: 'Actions', render: (_: string) => (
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-primary" title="Edit"><i className="bi bi-pencil"/></button>
        <button className="btn btn-sm btn-outline-info" title="Rules"><i className="bi bi-list-ul"/></button>
        <button className="btn btn-sm btn-outline-secondary" title="Assign"><i className="bi bi-people"/></button>
        <button className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi bi-trash"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Policies" breadcrumbs={[{label:'Home'},{label:'Policies'}]} />

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label:'Total Policies', value: MOCK_POLICIES.length, icon:'bi-shield-check', color:'primary' },
          { label:'Active', value: MOCK_POLICIES.filter(p=>p.status==='ACTIVE').length, icon:'bi-check-circle', color:'success' },
          { label:'Draft', value: MOCK_POLICIES.filter(p=>p.status==='DRAFT').length, icon:'bi-clock', color:'warning' },
          { label:'Total Assignments', value: MOCK_POLICIES.reduce((s,p)=>s+p.assignments,0), icon:'bi-diagram-3', color:'info' },
        ].map(s => (
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`rounded-3 d-flex align-items-center justify-content-center bg-${s.color}-subtle`} style={{width:44,height:44}}>
                  <i className={`bi ${s.icon} text-${s.color} fs-5`}/>
                </div>
                <div>
                  <div className="small text-muted">{s.label}</div>
                  <div className="fw-bold fs-5">{s.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 flex-wrap">
            {/* Type filter */}
            <div className="btn-group btn-group-sm">
              {['ALL','DEVICE_CONTROL','CONTENT_AWARE','ENCRYPTION'].map(t => (
                <button key={t} className={`btn btn-${typeFilter===t?'dark':'outline-secondary'}`}
                  onClick={()=>setTypeFilter(t)}>{t==='ALL'?'All Types':t.replace('_',' ')}</button>
              ))}
            </div>
            {/* Status filter */}
            <div className="btn-group btn-group-sm">
              {['ALL','ACTIVE','DRAFT','INACTIVE'].map(s => (
                <button key={s} className={`btn btn-${statusFilter===s?'dark':'outline-secondary'}`}
                  onClick={()=>setStatusFilter(s)}>{s==='ALL'?'All Status':s}</button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(true)}>
            <i className="bi bi-plus-lg me-1"/>New Policy
          </button>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={filtered} searchable />
        </div>
      </div>

      {/* Create Policy Modal */}
      {showModal && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Policy</h5>
                <button className="btn-close" onClick={()=>setShowModal(false)}/>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Policy Name</label>
                    <input className="form-control" placeholder="e.g. Finance USB Block Policy"/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Policy Type</label>
                    <select className="form-select">
                      <option>DEVICE_CONTROL</option>
                      <option>CONTENT_AWARE</option>
                      <option>ENCRYPTION</option>
                      <option>EDISCOVERY</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Priority (lower = higher)</label>
                    <input className="form-control" type="number" defaultValue={100}/>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" rows={3} placeholder="Describe what this policy does..."/>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Initial Status</label>
                    <select className="form-select">
                      <option>DRAFT</option>
                      <option>ACTIVE</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={()=>setShowModal(false)}>Create Policy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
