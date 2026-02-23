import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_SCANS = [
  { id:'1', name:'Q1 Finance Audit', policy:'PCI-DSS Scan', status:'COMPLETED', total_files:142850, matches:234, start:'2025-02-20 02:00', end:'2025-02-20 06:42', created_by:'admin' },
  { id:'2', name:'HR Data Inventory', policy:'HIPAA Discovery', status:'RUNNING', total_files:89200, matches:0, start:'2025-02-22 08:00', end:null, created_by:'compliance.mgr' },
  { id:'3', name:'Legal Document Review', policy:'IP Classification', status:'PENDING', total_files:0, matches:0, start:null, end:null, created_by:'it.admin' },
  { id:'4', name:'Annual Compliance Scan', policy:'Full DLP Scan', status:'FAILED', total_files:28000, matches:0, start:'2025-02-18 00:00', end:'2025-02-18 01:15', created_by:'admin' },
]

const MOCK_RESULTS = [
  { id:'1', file:'patient_db_export.csv', path:'C:\\HR\\Exports\\', size:'45 MB', sensitivity:'CRITICAL', patterns:'SSN(x847), Name(x847)', computer:'WS-HR-05', user:'a.jones', found:'2025-02-20 04:22' },
  { id:'2', file:'payment_history.xlsx', path:'D:\\Finance\\2024\\', size:'8.2 MB', sensitivity:'HIGH', patterns:'Credit Card(x234)', computer:'WS-FINANCE-01', user:'j.smith', found:'2025-02-20 03:45' },
  { id:'3', file:'contracts_archive.zip', path:'E:\\Legal\\Archive\\', size:'220 MB', sensitivity:'MEDIUM', patterns:'IP Keywords(x52)', computer:'WS-LEGAL-03', user:'r.patel', found:'2025-02-20 05:12' },
]

const STATUS_CONFIG: Record<string, {color:string, icon:string}> = {
  COMPLETED: {color:'success', icon:'bi-check-circle'},
  RUNNING: {color:'primary', icon:'bi-arrow-repeat'},
  PENDING: {color:'secondary', icon:'bi-clock'},
  FAILED: {color:'danger', icon:'bi-x-circle'},
  CANCELLED: {color:'warning', icon:'bi-stop-circle'},
}

const SENSITIVITY_COLOR: Record<string,string> = { CRITICAL:'danger', HIGH:'warning', MEDIUM:'info', LOW:'secondary' }

export default function EDiscovery() {
  const [tab, setTab] = useState<'scans'|'results'>('scans')

  return (
    <>
      <ContentHeader title="eDiscovery" breadcrumbs={[{label:'Home'},{label:'eDiscovery'}]} />

      <div className="row g-3 mb-4">
        {[
          {label:'Total Scans', value:'24', icon:'bi-search', color:'primary'},
          {label:'Running Now', value:'1', icon:'bi-arrow-repeat', color:'info'},
          {label:'Files with Matches', value:'1,081', icon:'bi-file-earmark-exclamation', color:'warning'},
          {label:'Critical Findings', value:'234', icon:'bi-exclamation-triangle', color:'danger'},
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
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <ul className="nav nav-tabs card-header-tabs">
              {([['scans','Scans','bi-play-circle'],['results','Results','bi-file-earmark-text']] as const).map(([k,l,i])=>(
                <li className="nav-item" key={k}>
                  <button className={`nav-link d-flex align-items-center gap-1 border-0 bg-transparent ${tab===k?'active':''}`} onClick={()=>setTab(k)}>
                    <i className={`bi ${i}`}/> {l}
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary btn-sm"><i className="bi bi-play-fill me-1"/> New Scan</button>
          </div>
        </div>
        <div className="card-body p-4 pt-0">
          {tab === 'scans' && (
            <DataTable
              columns={[
                {key:'name', label:'Scan Name', sortable:true, render:(v:string)=><span className="fw-semibold">{v}</span>},
                {key:'policy', label:'Policy'},
                {key:'status', label:'Status', render:(v:string)=>{
                  const c = STATUS_CONFIG[v]||{color:'secondary',icon:'bi-question'}
                  return <span className={`badge bg-${c.color} d-inline-flex align-items-center gap-1`}><i className={`bi ${c.icon}`}/>{v}</span>
                }},
                {key:'total_files', label:'Files Scanned', render:(v:number)=>v.toLocaleString()},
                {key:'matches', label:'Matches Found', render:(v:number)=><span className={v>0?'text-danger fw-bold':''}>{v.toLocaleString()}</span>},
                {key:'start', label:'Started', sortable:true, render:(v:string)=>v||'—'},
                {key:'created_by', label:'Created By'},
                {key:'id', label:'Actions', render:(_:any, row:any)=>(
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary" title="View Results"><i className="bi bi-eye"/></button>
                    {row.status==='RUNNING' && <button className="btn btn-sm btn-outline-warning" title="Cancel"><i className="bi bi-stop-fill"/></button>}
                    <button className="btn btn-sm btn-outline-secondary" title="Export"><i className="bi bi-download"/></button>
                  </div>
                )},
              ]}
              data={MOCK_SCANS} searchable sortable paginate title="Discovery Scans"
            />
          )}
          {tab === 'results' && (
            <DataTable
              columns={[
                {key:'file', label:'File Name', sortable:true, render:(v:string)=><span className="fw-semibold">{v}</span>},
                {key:'path', label:'Path', render:(v:string)=><code className="small text-muted">{v}</code>},
                {key:'size', label:'Size'},
                {key:'sensitivity', label:'Sensitivity', render:(v:string)=><span className={`badge bg-${SENSITIVITY_COLOR[v]||'secondary'}`}>{v}</span>},
                {key:'patterns', label:'Matched Patterns', render:(v:string)=><span className="small text-muted">{v}</span>},
                {key:'computer', label:'Computer'},
                {key:'user', label:'User'},
                {key:'found', label:'Found', sortable:true},
                {key:'id', label:'Actions', render:()=>(
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-danger" title="Delete"><i className="bi bi-trash"/></button>
                    <button className="btn btn-sm btn-outline-warning" title="Quarantine"><i className="bi bi-archive"/></button>
                    <button className="btn btn-sm btn-outline-secondary" title="Mark False Positive"><i className="bi bi-flag"/></button>
                  </div>
                )},
              ]}
              data={MOCK_RESULTS} searchable sortable paginate title="Discovery Results"
            />
          )}
        </div>
      </div>
    </>
  )
}
