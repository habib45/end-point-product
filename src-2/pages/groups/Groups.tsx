import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_USER_GROUPS = [
  { id:'1', name:'Finance Team', desc:'Finance department users', members:128, ad_group:true, ad_dn:'CN=Finance,OU=Groups,DC=corp,DC=local', policies:3, created:'2025-01-05' },
  { id:'2', name:'HR Department', desc:'Human resources staff', members:45, ad_group:true, ad_dn:'CN=HR,OU=Groups,DC=corp,DC=local', policies:2, created:'2025-01-05' },
  { id:'3', name:'Engineering', desc:'Software & IT engineers', members:287, ad_group:true, ad_dn:'CN=Engineering,OU=Groups,DC=corp,DC=local', policies:4, created:'2025-01-05' },
  { id:'4', name:'Privileged Users', desc:'Users with elevated device access', members:12, ad_group:false, ad_dn:null, policies:1, created:'2025-01-20' },
  { id:'5', name:'Contractors', desc:'External contractor accounts', members:34, ad_group:false, ad_dn:null, policies:2, created:'2025-02-01' },
  { id:'6', name:'Executives', desc:'C-suite and senior management', members:8, ad_group:true, ad_dn:'CN=Executives,OU=Groups,DC=corp,DC=local', policies:1, created:'2025-01-05' },
]

const MOCK_COMPUTER_GROUPS = [
  { id:'1', name:'Finance Workstations', desc:'All finance department computers', members:142, policies:3, created:'2025-01-05' },
  { id:'2', name:'Developer Machines', desc:'Engineering laptops and workstations', members:312, policies:4, created:'2025-01-05' },
  { id:'3', name:'Kiosk Terminals', desc:'Public-facing terminal devices', members:23, policies:2, created:'2025-01-10' },
  { id:'4', name:'Remote Workers', desc:'Laptops for remote/hybrid employees', members:87, policies:3, created:'2025-01-15' },
  { id:'5', name:'Server Room Systems', desc:'Backend servers with special permissions', members:18, policies:1, created:'2025-01-05' },
]

export default function Groups() {
  const [tab, setTab] = useState<'user'|'computer'>('user')
  const [showModal, setShowModal] = useState<'user'|'computer'|null>(null)

  const userCols = [
    { key:'name', label:'Group Name', sortable:true, render:(v:string,row:any)=>(
      <div>
        <div className="fw-semibold small">{v}</div>
        <div className="text-muted" style={{fontSize:'0.75rem'}}>{row.desc}</div>
      </div>
    )},
    { key:'members', label:'Members', sortable:true, render:(v:number)=>
      <span className="badge bg-primary rounded-pill">{v}</span>
    },
    { key:'policies', label:'Policies', render:(v:number)=>
      <span className="badge bg-info rounded-pill">{v}</span>
    },
    { key:'ad_group', label:'Source', render:(v:boolean)=>
      v ? <span className="badge bg-secondary"><i className="bi bi-microsoft me-1"/>AD Group</span>
        : <span className="badge bg-light text-dark">Local</span>
    },
    { key:'ad_dn', label:'AD Distinguished Name', render:(v:string|null)=>
      v ? <code className="small text-muted">{v}</code> : <span className="text-muted">—</span>
    },
    { key:'created', label:'Created', sortable:true },
    { key:'id', label:'Actions', render:()=>(
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-primary" title="Manage Members"><i className="bi bi-people"/></button>
        <button className="btn btn-sm btn-outline-info" title="View Policies"><i className="bi bi-shield"/></button>
        <button className="btn btn-sm btn-outline-secondary" title="Edit"><i className="bi bi-pencil"/></button>
        <button className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi bi-trash"/></button>
      </div>
    )},
  ]

  const computerCols = [
    { key:'name', label:'Group Name', sortable:true, render:(v:string,row:any)=>(
      <div>
        <div className="fw-semibold small">{v}</div>
        <div className="text-muted" style={{fontSize:'0.75rem'}}>{row.desc}</div>
      </div>
    )},
    { key:'members', label:'Computers', sortable:true, render:(v:number)=>
      <span className="badge bg-primary rounded-pill">{v}</span>
    },
    { key:'policies', label:'Policies', render:(v:number)=>
      <span className="badge bg-info rounded-pill">{v}</span>
    },
    { key:'created', label:'Created', sortable:true },
    { key:'id', label:'Actions', render:()=>(
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-primary" title="Manage Members"><i className="bi bi-pc-display"/></button>
        <button className="btn btn-sm btn-outline-info" title="View Policies"><i className="bi bi-shield"/></button>
        <button className="btn btn-sm btn-outline-secondary" title="Edit"><i className="bi bi-pencil"/></button>
        <button className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi bi-trash"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Group Management" breadcrumbs={[{label:'Home'},{label:'Groups'}]} />

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label:'User Groups', value: MOCK_USER_GROUPS.length, icon:'bi-people', color:'primary' },
          { label:'Computer Groups', value: MOCK_COMPUTER_GROUPS.length, icon:'bi-pc-display', color:'info' },
          { label:'AD-Synced Groups', value: MOCK_USER_GROUPS.filter(g=>g.ad_group).length, icon:'bi-microsoft', color:'secondary' },
          { label:'Total Members', value: MOCK_USER_GROUPS.reduce((s,g)=>s+g.members,0), icon:'bi-person-check', color:'success' },
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

      {/* Tab + Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <ul className="nav nav-tabs border-0 mb-0">
            <li className="nav-item">
              <button className={`nav-link ${tab==='user'?'active fw-semibold':''}`} onClick={()=>setTab('user')}>
                <i className="bi bi-people me-1"/>User Groups
                <span className="badge bg-primary ms-2">{MOCK_USER_GROUPS.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab==='computer'?'active fw-semibold':''}`} onClick={()=>setTab('computer')}>
                <i className="bi bi-pc-display me-1"/>Computer Groups
                <span className="badge bg-info ms-2">{MOCK_COMPUTER_GROUPS.length}</span>
              </button>
            </li>
          </ul>
          <button className="btn btn-primary btn-sm" onClick={()=>setShowModal(tab)}>
            <i className="bi bi-plus-lg me-1"/>New {tab==='user'?'User':'Computer'} Group
          </button>
        </div>
        <div className="card-body p-0">
          {tab === 'user'
            ? <DataTable columns={userCols} data={MOCK_USER_GROUPS} searchable />
            : <DataTable columns={computerCols} data={MOCK_COMPUTER_GROUPS} searchable />
          }
        </div>
      </div>

      {/* Create Group Modal */}
      {showModal && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create {showModal==='user'?'User':'Computer'} Group</h5>
                <button className="btn-close" onClick={()=>setShowModal(null)}/>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Group Name</label>
                    <input className="form-control" placeholder="e.g. Finance Contractors"/>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" rows={2}/>
                  </div>
                  {showModal === 'user' && (
                    <>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" id="adSwitch"/>
                          <label className="form-check-label fw-semibold" htmlFor="adSwitch">Sync with Active Directory Group</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">AD Group Distinguished Name</label>
                        <input className="form-control font-monospace" placeholder="CN=GroupName,OU=Groups,DC=corp,DC=local"/>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={()=>setShowModal(null)}>Create Group</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
