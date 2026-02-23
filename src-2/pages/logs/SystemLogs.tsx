import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_LOGS = [
  { id:'1', level:'CRITICAL', module:'DEVICE_CONTROL', message:'Blacklisted device connection blocked on WS-FINANCE-01', user:'j.smith', computer:'WS-FINANCE-01', time:'2025-02-22 09:15:02', details:'Device: Kingston 32GB (SN: KT32-ABC-001)' },
  { id:'2', level:'ERROR', module:'CONTENT_AWARE', message:'Content inspection engine failed to process encrypted PDF', user:'a.jones', computer:'WS-HR-05', time:'2025-02-22 09:10:15', details:'Error: Unsupported encryption format' },
  { id:'3', level:'WARNING', module:'ENCRYPTION', message:'USB device connected without required EasyLock encryption', user:'m.chen', computer:'MBP-DEV-12', time:'2025-02-22 09:05:44', details:'Device will be blocked until encryption applied' },
  { id:'4', level:'INFO', module:'DEVICE_CONTROL', message:'Policy applied to new endpoint WS-NEW-15', user:null, computer:'WS-NEW-15', time:'2025-02-22 09:00:00', details:'Policy: Global Default Policy v3' },
  { id:'5', level:'CRITICAL', module:'POLICY_VIOLATION', message:'GDPR data exfiltration attempt detected and blocked', user:'r.patel', computer:'WS-LEGAL-03', time:'2025-02-22 08:52:30', details:'Pattern match: Personal data (SSN x12, Name x12)' },
  { id:'6', level:'WARNING', module:'SYSTEM', message:'Database storage utilization reached 75%', user:null, computer:null, time:'2025-02-22 08:45:00', details:'Current: 75.2 GB / 100 GB' },
  { id:'7', level:'INFO', module:'EDISCOVERY', message:'Scheduled scan completed on 3 endpoints', user:null, computer:null, time:'2025-02-22 08:30:00', details:'Files scanned: 84,231. Matches found: 47' },
  { id:'8', level:'ERROR', module:'ALERTS', message:'Email notification delivery failed for alert#1234', user:null, computer:null, time:'2025-02-22 08:15:00', details:'SMTP error: Connection timeout to mail.corp.local' },
  { id:'9', level:'INFO', module:'AUTH', message:'Admin login successful', user:'admin', computer:null, time:'2025-02-22 08:00:00', details:'IP: 192.168.1.50 · Browser: Chrome 121' },
  { id:'10', level:'WARNING', module:'LICENSE', message:'License expiring in 14 days', user:null, computer:null, time:'2025-02-22 07:00:00', details:'License expires: 2025-03-08' },
]

const LEVEL_COLOR: Record<string,string> = { CRITICAL:'danger', ERROR:'warning', WARNING:'info', INFO:'secondary' }
const LEVEL_ICON: Record<string,string> = { CRITICAL:'bi-exclamation-octagon-fill', ERROR:'bi-x-circle-fill', WARNING:'bi-exclamation-triangle-fill', INFO:'bi-info-circle-fill' }
const MODULE_COLOR: Record<string,string> = { DEVICE_CONTROL:'primary', CONTENT_AWARE:'info', ENCRYPTION:'warning', SYSTEM:'secondary', POLICY_VIOLATION:'danger', AUTH:'success', EDISCOVERY:'purple', ALERTS:'dark', LICENSE:'warning' }

export default function SystemLogs() {
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [moduleFilter, setModuleFilter] = useState('ALL')

  const modules = ['ALL', ...Array.from(new Set(MOCK_LOGS.map(l=>l.module)))]

  const filtered = MOCK_LOGS.filter(l => {
    if (levelFilter !== 'ALL' && l.level !== levelFilter) return false
    if (moduleFilter !== 'ALL' && l.module !== moduleFilter) return false
    return true
  })

  const columns = [
    { key:'time', label:'Timestamp', sortable:true, render:(v:string)=>
      <span className="font-monospace text-muted" style={{fontSize:'0.78rem'}}>{v}</span>
    },
    { key:'level', label:'Level', render:(v:string)=>(
      <span className={`badge bg-${LEVEL_COLOR[v]||'secondary'} d-flex align-items-center gap-1`} style={{width:'fit-content'}}>
        <i className={`bi ${LEVEL_ICON[v]||'bi-circle'}`} style={{fontSize:'0.7rem'}}/>
        {v}
      </span>
    )},
    { key:'module', label:'Module', render:(v:string)=>
      <span className={`badge bg-${MODULE_COLOR[v]||'secondary'}-subtle text-${MODULE_COLOR[v]||'secondary'} border`} style={{fontSize:'0.7rem'}}>{v.replace('_',' ')}</span>
    },
    { key:'message', label:'Message', render:(v:string, row:any)=>(
      <div>
        <div className="small fw-semibold">{v}</div>
        {row.details && <div className="text-muted" style={{fontSize:'0.72rem'}}>{row.details}</div>}
      </div>
    )},
    { key:'user', label:'User', render:(v:string|null)=>
      v ? <span className="fw-semibold small">{v}</span> : <span className="text-muted">—</span>
    },
    { key:'computer', label:'Computer', render:(v:string|null)=>
      v ? <span className="small">{v}</span> : <span className="text-muted">—</span>
    },
  ]

  return (
    <>
      <ContentHeader title="System Logs" breadcrumbs={[{label:'Logs'},{label:'System Logs'}]} />

      <div className="row g-3 mb-4">
        {[
          { label:'Total Logs', value:MOCK_LOGS.length, icon:'bi-journal', color:'primary' },
          { label:'Critical', value:MOCK_LOGS.filter(l=>l.level==='CRITICAL').length, icon:'bi-exclamation-octagon', color:'danger' },
          { label:'Errors', value:MOCK_LOGS.filter(l=>l.level==='ERROR').length, icon:'bi-x-circle', color:'warning' },
          { label:'Warnings', value:MOCK_LOGS.filter(l=>l.level==='WARNING').length, icon:'bi-exclamation-triangle', color:'info' },
        ].map(s=>(
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

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3 d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <div className="btn-group btn-group-sm">
              {['ALL','CRITICAL','ERROR','WARNING','INFO'].map(l=>(
                <button key={l} className={`btn btn-${levelFilter===l?'dark':'outline-secondary'}`}
                  onClick={()=>setLevelFilter(l)}>{l==='ALL'?'All Levels':l}</button>
              ))}
            </div>
            <select className="form-select form-select-sm" style={{width:'auto'}} value={moduleFilter} onChange={e=>setModuleFilter(e.target.value)}>
              {modules.map(m=><option key={m} value={m}>{m==='ALL'?'All Modules':m.replace('_',' ')}</option>)}
            </select>
          </div>
          <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-download me-1"/>Export</button>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={filtered} searchable />
        </div>
      </div>
    </>
  )
}
