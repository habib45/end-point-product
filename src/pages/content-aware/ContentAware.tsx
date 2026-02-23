import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_POLICIES = [
  { id:'1', name:'PCI-DSS Credit Card', desc:'Block credit card number transfers', action:'BLOCK', status:'ACTIVE', violations_today:42, created:'2025-01-15' },
  { id:'2', name:'HIPAA Patient Data', desc:'Notify on medical record transfers', action:'NOTIFY', status:'ACTIVE', violations_today:8, created:'2025-01-20' },
  { id:'3', name:'SSN Protection', desc:'Block Social Security Number transfers', action:'BLOCK', status:'ACTIVE', violations_today:19, created:'2025-01-22' },
  { id:'4', name:'IP Classification', desc:'Encrypt intellectual property transfers', action:'ENCRYPT', status:'ACTIVE', violations_today:3, created:'2025-02-01' },
  { id:'5', name:'Executive Comms', desc:'Monitor executive communication channels', action:'NOTIFY', status:'DRAFT', violations_today:0, created:'2025-02-10' },
]

const MOCK_RESULTS = [
  { id:'1', file:'Q4_Financial_Report.xlsx', type:'XLSX', size:'2.4 MB', user:'j.smith', computer:'WS-FINANCE-01', action:'BLOCK', matches:'Credit Card (x3)', time:'2025-02-22 09:12' },
  { id:'2', file:'patient_records_export.csv', type:'CSV', size:'15.8 MB', user:'a.jones', computer:'WS-HR-05', action:'QUARANTINE', matches:'SSN (x47), Name (x47)', time:'2025-02-22 08:48' },
  { id:'3', file:'design_mockups_v3.zip', type:'ZIP', size:'89.2 MB', user:'m.chen', computer:'MBP-DEV-12', action:'ALLOW', matches:'-', time:'2025-02-22 08:30' },
  { id:'4', file:'contract_draft_v2.docx', type:'DOCX', size:'0.8 MB', user:'r.patel', computer:'WS-LEGAL-03', action:'ENCRYPT', matches:'IP Keywords (x12)', time:'2025-02-22 07:55' },
]

const ACTION_COLOR: Record<string,string> = { BLOCK:'danger', ALLOW:'success', ENCRYPT:'info', QUARANTINE:'warning', NOTIFY:'secondary' }

export default function ContentAware() {
  const [tab, setTab] = useState<'policies'|'results'|'patterns'>('results')

  return (
    <>
      <ContentHeader title="Content Aware Protection" breadcrumbs={[{label:'Home'},{label:'Content Aware'}]} />

      <div className="row g-3 mb-4">
        {[
          {label:'Active Policies', value:'4', icon:'bi-shield', color:'primary'},
          {label:'Blocked Today', value:'61', icon:'bi-slash-circle', color:'danger'},
          {label:'Quarantined', value:'8', icon:'bi-archive', color:'warning'},
          {label:'Encrypted', value:'14', icon:'bi-lock', color:'info'},
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
              {([['results','Inspection Results','bi-file-earmark-check'],['policies','Policies','bi-shield'],['patterns','Content Patterns','bi-regex']] as const).map(([k,l,i])=>(
                <li className="nav-item" key={k}>
                  <button className={`nav-link d-flex align-items-center gap-1 border-0 bg-transparent ${tab===k?'active':''}`} onClick={()=>setTab(k)}>
                    <i className={`bi ${i}`}/> {l}
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1">
              <i className="bi bi-plus-lg"/> Create Policy
            </button>
          </div>
        </div>
        <div className="card-body p-4 pt-0">
          {tab === 'results' && (
            <DataTable
              columns={[
                {key:'file', label:'File', sortable:true, render:(v:string,row:any)=><span><i className="bi bi-file-earmark me-1 text-muted"/>{v}</span>},
                {key:'type', label:'Type', render:(v:string)=><span className="badge bg-secondary">{v}</span>},
                {key:'size', label:'Size'},
                {key:'user', label:'User'},
                {key:'computer', label:'Computer'},
                {key:'matches', label:'Matches', render:(v:string)=><span className="small text-muted">{v}</span>},
                {key:'action', label:'Action', render:(v:string)=><span className={`badge bg-${ACTION_COLOR[v]||'secondary'}`}>{v}</span>},
                {key:'time', label:'Time', sortable:true},
              ]}
              data={MOCK_RESULTS} searchable sortable paginate title="Content Inspection Log"
            />
          )}
          {tab === 'policies' && (
            <DataTable
              columns={[
                {key:'name', label:'Policy Name', sortable:true, render:(v:string)=><span className="fw-semibold">{v}</span>},
                {key:'desc', label:'Description'},
                {key:'action', label:'Action', render:(v:string)=><span className={`badge bg-${ACTION_COLOR[v]||'secondary'}`}>{v}</span>},
                {key:'status', label:'Status', render:(v:string)=><span className={`badge ${v==='ACTIVE'?'bg-success':'bg-secondary'}`}>{v}</span>},
                {key:'violations_today', label:'Violations Today', sortable:true},
                {key:'id', label:'Actions', render:()=>(
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary"><i className="bi bi-pencil"/></button>
                    <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"/></button>
                  </div>
                )},
              ]}
              data={MOCK_POLICIES} searchable sortable paginate title="Content Aware Policies"
            />
          )}
          {tab === 'patterns' && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-regex fs-1 mb-3 d-block"/>
              <p>Content pattern management — REGEX, Keywords, Fingerprints, ML Models</p>
              <button className="btn btn-primary"><i className="bi bi-plus-lg me-1"/> Add Pattern</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
