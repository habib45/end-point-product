import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_VIOLATIONS = [
  { id:'1', type:'USB_STORAGE_BLOCK', severity:'HIGH', desc:'Unauthorized USB storage device connected and blocked', user:'j.smith', dept:'Finance', computer:'WS-FINANCE-01', policy:'Global USB Policy', action:'BLOCKED', time:'2025-02-22 09:12', resolved:false },
  { id:'2', type:'SENSITIVE_DATA_TRANSFER', severity:'CRITICAL', desc:'Credit card numbers detected in file transfer attempt (x3 matches)', user:'a.jones', dept:'HR', computer:'WS-HR-05', policy:'PCI-DSS Policy', action:'BLOCKED', time:'2025-02-22 08:50', resolved:false },
  { id:'3', type:'BLACKLISTED_DEVICE', severity:'HIGH', desc:'Known blacklisted device serial number attempted connection', user:'s.taylor', dept:'Operations', computer:'WS-OPS-07', policy:'Device Denylist', action:'BLOCKED', time:'2025-02-22 07:20', resolved:true },
  { id:'4', type:'ENCRYPTION_BYPASS', severity:'CRITICAL', desc:'User attempted to disable EasyLock encryption on monitored device', user:'r.patel', dept:'Legal', computer:'WS-LEGAL-03', policy:'Encryption Policy', action:'PREVENTED', time:'2025-02-22 07:45', resolved:false },
  { id:'5', type:'FILE_TYPE_VIOLATION', severity:'MEDIUM', desc:'Blocked executable file transfer to removable media', user:'m.chen', dept:'Engineering', computer:'MBP-DEV-12', policy:'File Type Policy', action:'BLOCKED', time:'2025-02-22 07:00', resolved:true },
]

const SEV: Record<string,string> = { CRITICAL:'danger', HIGH:'warning', MEDIUM:'info', LOW:'secondary' }

export default function Violations() {
  const [filter, setFilter] = useState('ALL')
  const filtered = filter === 'ALL' ? MOCK_VIOLATIONS : MOCK_VIOLATIONS.filter(v => filter === 'OPEN' ? !v.resolved : v.resolved)

  return (
    <>
      <ContentHeader title="Policy Violations" breadcrumbs={[{label:'Reports',path:'/reports'},{label:'Violations'}]} />

      <div className="row g-3 mb-4">
        {[
          {label:'Total Today', value:187, icon:'bi-shield-exclamation', color:'danger'},
          {label:'Critical', value:42, icon:'bi-exclamation-triangle', color:'danger'},
          {label:'Unresolved', value:134, icon:'bi-hourglass', color:'warning'},
          {label:'Resolved', value:53, icon:'bi-check-circle', color:'success'},
        ].map(s=>(
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="card border-0 shadow-sm" style={{borderRadius:12}}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`rounded-3 d-flex align-items-center justify-content-center bg-${s.color}-subtle`} style={{width:44,height:44}}>
                  <i className={`bi ${s.icon} text-${s.color} fs-5`}/>
                </div>
                <div><div className="small text-muted">{s.label}</div><div className="fw-bold fs-5">{s.value}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm" style={{borderRadius:16}}>
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold mb-0">Violation Log</h6>
            <div className="d-flex gap-2">
              {['ALL','OPEN','RESOLVED'].map(s=>(
                <button key={s} onClick={()=>setFilter(s)} className={`btn btn-sm ${filter===s?'btn-danger':'btn-outline-secondary'}`}>{s}</button>
              ))}
              <button className="btn btn-sm btn-outline-primary"><i className="bi bi-download me-1"/>Export</button>
            </div>
          </div>
        </div>
        <div className="card-body p-4 pt-0">
          <DataTable
            columns={[
              {key:'severity', label:'Severity', render:(v:string)=><span className={`badge bg-${SEV[v]||'secondary'}`}>{v}</span>},
              {key:'type', label:'Violation Type', render:(v:string)=><code className="small">{v}</code>},
              {key:'desc', label:'Description', render:(v:string)=><span className="small">{v}</span>},
              {key:'user', label:'User'},
              {key:'computer', label:'Computer'},
              {key:'policy', label:'Policy'},
              {key:'action', label:'Action', render:(v:string)=><span className="badge bg-danger-subtle text-danger">{v}</span>},
              {key:'time', label:'Time', sortable:true},
              {key:'resolved', label:'Status', render:(v:boolean)=>v
                ? <span className="badge bg-success">RESOLVED</span>
                : <span className="badge bg-danger">OPEN</span>},
              {key:'id', label:'Actions', render:(_:any,row:any)=>(
                !row.resolved ? <button className="btn btn-sm btn-outline-success">Resolve</button> : null
              )},
            ]}
            data={filtered} searchable
          />
        </div>
      </div>
    </>
  )
}
