import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_TRANSFERS = [
  { id:'1', file:'Q4_Financial_Report.xlsx', size:'2.4 MB', hash:'3f2a...c8e1', src:'C:\\Users\\j.smith\\Documents', dst:'USB Drive E:', type:'COPY', action:'BLOCK', user:'j.smith', computer:'WS-FINANCE-01', device:'Kingston 32GB', time:'2025-02-22 09:12', violation:true },
  { id:'2', file:'employee_data_export.csv', size:'15.8 MB', hash:'8b1d...4f2a', src:'C:\\HR\\Reports', dst:'USB Drive F:', type:'COPY', action:'BLOCK', user:'a.jones', computer:'WS-HR-05', device:'SanDisk 64GB', time:'2025-02-22 08:48', violation:true },
  { id:'3', file:'design_mockups_v3.zip', size:'89.2 MB', hash:'c4e2...1d9f', src:'D:\\Projects\\Design', dst:'USB Drive E:', type:'COPY', action:'ALLOW', user:'m.chen', computer:'MBP-DEV-12', device:'Samsung T7', time:'2025-02-22 08:30', violation:false },
  { id:'4', file:'contract_draft_v2.docx', size:'0.8 MB', hash:'7d3b...9a1c', src:'C:\\Legal\\Contracts', dst:'USB Drive G:', type:'MOVE', action:'ENCRYPT', user:'r.patel', computer:'WS-LEGAL-03', device:'WD Passport', time:'2025-02-22 07:55', violation:false },
  { id:'5', file:'installer_setup.exe', size:'45.2 MB', hash:'2e9f...6b3d', src:'D:\\Downloads', dst:'USB Drive F:', type:'COPY', action:'BLOCK', user:'s.taylor', computer:'WS-OPS-07', device:'Kingston 32GB', time:'2025-02-22 07:20', violation:true },
  { id:'6', file:'company_logo.png', size:'0.2 MB', hash:'1a4c...8f2e', src:'C:\\Assets', dst:'USB Drive E:', type:'COPY', action:'ALLOW', user:'k.wilson', computer:'WS-MGMT-01', device:'Samsung T7', time:'2025-02-22 06:45', violation:false },
  { id:'7', file:'database_backup.sql', size:'312.5 MB', hash:'9b7e...3c1a', src:'D:\\Backups', dst:'USB Drive G:', type:'COPY', action:'BLOCK', user:'t.nguyen', computer:'WS-IT-02', device:'SanDisk 64GB', time:'2025-02-22 06:30', violation:true },
  { id:'8', file:'presentation_final.pptx', size:'8.7 MB', hash:'4f1d...5e8b', src:'C:\\Documents', dst:'USB Drive E:', type:'COPY', action:'ALLOW', user:'p.garcia', computer:'WS-SALES-04', device:'Kingston 32GB', time:'2025-02-22 06:00', violation:false },
]

const ACTION_COLOR: Record<string,string> = { ALLOW:'success', BLOCK:'danger', ENCRYPT:'info', READ_ONLY:'warning' }
const TYPE_COLOR: Record<string,string> = { COPY:'primary', MOVE:'warning', UPLOAD:'info', DOWNLOAD:'secondary' }

export default function FileTransfers() {
  const [actionFilter, setActionFilter] = useState('ALL')
  const [showDetail, setShowDetail] = useState<any>(null)

  const filtered = actionFilter === 'ALL' ? MOCK_TRANSFERS
    : MOCK_TRANSFERS.filter(t => t.action === actionFilter)

  const columns = [
    { key:'time', label:'Time', sortable:true },
    { key:'file', label:'File', sortable:true, render:(v:string, row:any)=>(
      <div>
        <div className="fw-semibold small d-flex align-items-center gap-1">
          {row.violation && <i className="bi bi-exclamation-triangle-fill text-danger" style={{fontSize:'0.7rem'}}/>}
          {v}
        </div>
        <div className="text-muted" style={{fontSize:'0.72rem'}}>{row.size} · {row.hash}</div>
      </div>
    )},
    { key:'type', label:'Type', render:(v:string)=>
      <span className={`badge bg-${TYPE_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'action', label:'Action', render:(v:string)=>
      <span className={`badge bg-${ACTION_COLOR[v]||'secondary'}`}>{v}</span>
    },
    { key:'user', label:'User', render:(v:string)=>
      <span className="fw-semibold small">{v}</span>
    },
    { key:'computer', label:'Computer' },
    { key:'device', label:'Device', render:(v:string)=>
      <span className="text-muted small"><i className="bi bi-usb-symbol me-1"/>{v}</span>
    },
    { key:'id', label:'', render:(_:string, row:any)=>(
      <button className="btn btn-sm btn-outline-primary" onClick={()=>setShowDetail(row)} title="Details">
        <i className="bi bi-info-circle"/>
      </button>
    )},
  ]

  const stats = [
    { label:'Total Transfers', value:MOCK_TRANSFERS.length, icon:'bi-arrow-left-right', color:'primary' },
    { label:'Blocked', value:MOCK_TRANSFERS.filter(t=>t.action==='BLOCK').length, icon:'bi-slash-circle', color:'danger' },
    { label:'Encrypted', value:MOCK_TRANSFERS.filter(t=>t.action==='ENCRYPT').length, icon:'bi-lock', color:'info' },
    { label:'Violations', value:MOCK_TRANSFERS.filter(t=>t.violation).length, icon:'bi-exclamation-triangle', color:'warning' },
  ]

  return (
    <>
      <ContentHeader title="File Transfers" breadcrumbs={[{label:'Logs'},{label:'File Transfers'}]} />

      <div className="row g-3 mb-4">
        {stats.map(s=>(
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
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <div className="btn-group btn-group-sm">
            {['ALL','ALLOW','BLOCK','ENCRYPT'].map(a=>(
              <button key={a} className={`btn btn-${actionFilter===a?'dark':'outline-secondary'}`}
                onClick={()=>setActionFilter(a)}>{a==='ALL'?'All Actions':a}</button>
            ))}
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-download me-1"/>Export CSV</button>
          </div>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={filtered} searchable />
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transfer Detail</h5>
                <button className="btn-close" onClick={()=>setShowDetail(null)}/>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small">File Name</label>
                    <div className="fw-semibold">{showDetail.file}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">File Size</label>
                    <div className="fw-semibold">{showDetail.size}</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted small">SHA-256 Hash</label>
                    <code className="d-block p-2 bg-light rounded">{showDetail.hash}...full-hash</code>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Source</label>
                    <code className="d-block small">{showDetail.src}</code>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Destination</label>
                    <code className="d-block small">{showDetail.dst}</code>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small">User</label>
                    <div className="fw-semibold">{showDetail.user}</div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small">Computer</label>
                    <div className="fw-semibold">{showDetail.computer}</div>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small">Device</label>
                    <div className="fw-semibold">{showDetail.device}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Action Taken</label>
                    <div><span className={`badge bg-${ACTION_COLOR[showDetail.action]||'secondary'} fs-6`}>{showDetail.action}</span></div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small">Timestamp</label>
                    <div className="fw-semibold">{showDetail.time}</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {showDetail.violation && (
                  <button className="btn btn-warning me-auto"><i className="bi bi-exclamation-triangle me-1"/>View Violation</button>
                )}
                <button className="btn btn-secondary" onClick={()=>setShowDetail(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
