import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_ALLOWLIST = [
  { id:'1', type:'SERIAL_NUMBER', value:'KT-FINANCE-001', desc:'CFO laptop USB allowed', created_by:'admin', created:'2025-01-15', expires:null },
  { id:'2', type:'VENDOR_ID', value:'05ac', desc:'Apple devices trusted', created_by:'it.admin', created:'2025-01-20', expires:null },
  { id:'3', type:'SERIAL_NUMBER', value:'ST7-EXEC-PRO', desc:'Executive SSD - temporary', created_by:'ciso', created:'2025-02-10', expires:'2025-03-10' },
]

const MOCK_DENYLIST = [
  { id:'1', type:'SERIAL_NUMBER', value:'SD64-DEF-004', desc:'Confiscated device', created_by:'admin', created:'2025-02-01', expires:null },
  { id:'2', type:'VENDOR_ID', value:'ffff', desc:'Generic USB hubs blocked', created_by:'it.admin', created:'2025-01-05', expires:null },
  { id:'3', type:'PRODUCT_ID', value:'5581', desc:'SanDisk Ultra series blocked in Finance', created_by:'sec.admin', created:'2025-02-15', expires:'2025-04-01' },
]

const MOCK_URL_CATS = [
  { id:'1', name:'Cloud Storage', custom:false, patterns:12, action:'BLOCK' },
  { id:'2', name:'Social Media', custom:false, patterns:28, action:'BLOCK' },
  { id:'3', name:'File Sharing', custom:false, patterns:15, action:'BLOCK' },
  { id:'4', name:'Corporate Approved', custom:true, patterns:5, action:'ALLOW' },
]

export default function AllowDenyLists() {
  const [tab, setTab] = useState<'allowlist'|'denylist'|'filetypes'|'urls'>('allowlist')

  return (
    <>
      <ContentHeader title="Allowlists & Denylists" breadcrumbs={[{label:'Home'},{label:'Lists'}]} />

      <div className="card border-0 shadow-sm" style={{borderRadius:16}}>
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <ul className="nav nav-tabs card-header-tabs">
              {([
                ['allowlist','Device Allowlist','bi-check-circle-fill','success'],
                ['denylist','Device Denylist','bi-slash-circle-fill','danger'],
                ['filetypes','File Types','bi-file-earmark','secondary'],
                ['urls','URL Categories','bi-globe','info'],
              ] as const).map(([k,l,i,c])=>(
                <li className="nav-item" key={k}>
                  <button className={`nav-link d-flex align-items-center gap-1 border-0 bg-transparent ${tab===k?'active':''}`} onClick={()=>setTab(k)}>
                    <i className={`bi ${i} text-${c}`}/> {l}
                  </button>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary btn-sm"><i className="bi bi-plus-lg me-1"/> Add Entry</button>
          </div>
        </div>
        <div className="card-body p-4 pt-0">
          {(tab === 'allowlist' || tab === 'denylist') && (
            <DataTable
              columns={[
                {key:'type', label:'Type', render:(v:string)=><span className="badge bg-secondary">{v.replace('_',' ')}</span>},
                {key:'value', label:'Value', render:(v:string)=><code>{v}</code>},
                {key:'desc', label:'Description'},
                {key:'created_by', label:'Created By'},
                {key:'created', label:'Created'},
                {key:'expires', label:'Expires', render:(v:string|null)=>v||<span className="text-muted small">Never</span>},
                {key:'id', label:'Actions', render:()=>(
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-warning"><i className="bi bi-pencil"/></button>
                    <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"/></button>
                  </div>
                )},
              ]}
              data={tab === 'allowlist' ? MOCK_ALLOWLIST : MOCK_DENYLIST}
              searchable sortable paginate title={tab === 'allowlist' ? 'Allowed Devices' : 'Denied Devices'}
            />
          )}
          {tab === 'filetypes' && (
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fw-bold text-success mb-3"><i className="bi bi-check-circle me-1"/>Allowed File Types</h6>
                {['.pdf','.docx','.xlsx','.pptx','.jpg','.png'].map(ext=>(
                  <div key={ext} className="d-flex align-items-center justify-content-between mb-2 p-2 rounded" style={{background:'var(--bs-success-bg-subtle)'}}>
                    <code className="text-success">{ext}</code>
                    <button className="btn btn-sm btn-outline-danger py-0"><i className="bi bi-x"/></button>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold text-danger mb-3"><i className="bi bi-slash-circle me-1"/>Denied File Types</h6>
                {['.exe','.bat','.cmd','.ps1','.vbs','.sh'].map(ext=>(
                  <div key={ext} className="d-flex align-items-center justify-content-between mb-2 p-2 rounded" style={{background:'var(--bs-danger-bg-subtle)'}}>
                    <code className="text-danger">{ext}</code>
                    <button className="btn btn-sm btn-outline-danger py-0"><i className="bi bi-x"/></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'urls' && (
            <DataTable
              columns={[
                {key:'name', label:'Category', render:(v:string)=><span className="fw-semibold">{v}</span>},
                {key:'custom', label:'Type', render:(v:boolean)=>v
                  ? <span className="badge bg-info">Custom</span>
                  : <span className="badge bg-secondary">System</span>},
                {key:'patterns', label:'URL Patterns', render:(v:number)=>`${v} patterns`},
                {key:'action', label:'Action', render:(v:string)=><span className={`badge bg-${v==='ALLOW'?'success':'danger'}`}>{v}</span>},
                {key:'id', label:'Actions', render:()=>(
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary"><i className="bi bi-eye"/></button>
                    <button className="btn btn-sm btn-outline-warning"><i className="bi bi-pencil"/></button>
                  </div>
                )},
              ]}
              data={MOCK_URL_CATS} searchable sortable paginate title="URL Categories"
            />
          )}
        </div>
      </div>
    </>
  )
}
