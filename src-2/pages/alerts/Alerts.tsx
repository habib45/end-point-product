import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_ALERTS = [
  { id:'1', type:'DEVICE', title:'Unauthorized USB Device Connected', message:'High-capacity USB storage detected on finance workstation', severity:'CRITICAL', status:'OPEN', source:'WS-FINANCE-01', user:'j.smith', created_at:'2025-02-22 09:15' },
  { id:'2', type:'CONTENT', title:'Sensitive Data Transfer Blocked', message:'Credit card numbers detected in file transfer attempt', severity:'HIGH', status:'OPEN', source:'WS-HR-05', user:'a.jones', created_at:'2025-02-22 08:50' },
  { id:'3', type:'SYSTEM', title:'License Expiring Soon', message:'License expires in 14 days. Renew to maintain protection.', severity:'MEDIUM', status:'ACKNOWLEDGED', source:'System', user:'-', created_at:'2025-02-22 08:00' },
  { id:'4', type:'ENCRYPTION', title:'Encryption Bypass Attempt', message:'User attempted to disable encryption on monitored device', severity:'CRITICAL', status:'OPEN', source:'WS-LEGAL-03', user:'r.patel', created_at:'2025-02-22 07:45' },
  { id:'5', type:'DEVICE', title:'Blacklisted Device Connection Attempt', message:'Known blacklisted serial number attempted connection', severity:'HIGH', status:'RESOLVED', source:'WS-OPS-07', user:'s.taylor', created_at:'2025-02-22 07:20' },
  { id:'6', type:'CONTENT', title:'DLP Policy Violation', message:'SSN pattern matched in outbound email attachment', severity:'HIGH', status:'OPEN', source:'WS-MGMT-01', user:'k.wilson', created_at:'2025-02-22 06:58' },
]

const SEV_COLOR: Record<string,string> = { CRITICAL:'danger', HIGH:'warning', MEDIUM:'info', LOW:'secondary' }
const TYPE_ICON: Record<string,string> = { DEVICE:'usb-symbol', CONTENT:'file-earmark-text', SYSTEM:'server', ENCRYPTION:'lock' }

export default function Alerts() {
  const [filter, setFilter] = useState('ALL')
  
  const filtered = filter === 'ALL' ? MOCK_ALERTS : MOCK_ALERTS.filter(a => a.status === filter)

  const columns = [
    { key:'severity', label:'Severity', render:(v:string)=><span className={`badge bg-${SEV_COLOR[v]||'secondary'}`}>{v}</span> },
    { key:'type', label:'Type', render:(v:string)=>(
      <span className="badge bg-secondary d-inline-flex align-items-center gap-1">
        <i className={`bi bi-${TYPE_ICON[v]||'bell'}`}/> {v}
      </span>
    )},
    { key:'title', label:'Alert', sortable:true, render:(v:string,row:any)=>(
      <div>
        <div className="fw-semibold small">{v}</div>
        <div className="text-muted" style={{fontSize:'0.78rem'}}>{row.message}</div>
      </div>
    )},
    { key:'source', label:'Source' },
    { key:'user', label:'User' },
    { key:'status', label:'Status', render:(v:string)=>{
      const c:Record<string,string> = {OPEN:'danger',ACKNOWLEDGED:'warning',RESOLVED:'success'}
      return <span className={`badge bg-${c[v]||'secondary'}`}>{v}</span>
    }},
    { key:'created_at', label:'Time', sortable:true },
    { key:'id', label:'Actions', render:()=>(
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-warning" title="Acknowledge"><i className="bi bi-check"/></button>
        <button className="btn btn-sm btn-outline-success" title="Resolve"><i className="bi bi-check-all"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Alerts & Notifications" breadcrumbs={[{label:'Home'},{label:'Alerts'}]} />

      <div className="row g-3 mb-4">
        {[
          {label:'Open', value: MOCK_ALERTS.filter(a=>a.status==='OPEN').length, icon:'bi-exclamation-circle', color:'danger'},
          {label:'Critical', value: MOCK_ALERTS.filter(a=>a.severity==='CRITICAL').length, icon:'bi-shield-exclamation', color:'danger'},
          {label:'Acknowledged', value: MOCK_ALERTS.filter(a=>a.status==='ACKNOWLEDGED').length, icon:'bi-check-circle', color:'warning'},
          {label:'Resolved Today', value: MOCK_ALERTS.filter(a=>a.status==='RESOLVED').length, icon:'bi-check-all', color:'success'},
        ].map(s=>(
          <div className="col-6 col-lg-3" key={s.label}>
            <div className="card border-0 shadow-sm" style={{borderRadius:12}}>
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

      <div className="card border-0 shadow-sm" style={{borderRadius:16}}>
        <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="mb-0 fw-bold">Alert Feed</h6>
            <div className="d-flex gap-2">
              {['ALL','OPEN','ACKNOWLEDGED','RESOLVED'].map(s=>(
                <button key={s} onClick={()=>setFilter(s)}
                  className={`btn btn-sm ${filter===s?'btn-primary':'btn-outline-secondary'}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body p-4 pt-0">
          <DataTable columns={columns} data={filtered} searchable sortable paginate />
        </div>
      </div>
    </>
  )
}
