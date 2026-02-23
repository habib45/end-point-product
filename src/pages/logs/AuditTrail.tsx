import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_ACTIONS = [
  { id:'1', admin:'admin', type:'CREATE_POLICY', target_type:'POLICY', target:'Global USB Block Policy', ip:'192.168.1.50', time:'2025-02-22 09:00:00', old:null, new:{name:'Global USB Block Policy',status:'ACTIVE',priority:10} },
  { id:'2', admin:'j.smith', type:'MODIFY_USER', target_type:'USER', target:'m.chen', ip:'192.168.1.101', time:'2025-02-22 08:45:00', old:{is_active:true,department:'Engineering'}, new:{is_active:true,department:'DevOps'} },
  { id:'3', admin:'admin', type:'ADD_ALLOWLIST', target_type:'DEVICE', target:'Samsung T7 (ST7-XYZ-002)', ip:'192.168.1.50', time:'2025-02-22 08:30:00', old:null, new:{entity_type:'SERIAL_NUMBER',entity_value:'ST7-XYZ-002'} },
  { id:'4', admin:'admin', type:'DELETE_POLICY', target_type:'POLICY', target:'Legacy Bluetooth Policy', ip:'192.168.1.50', time:'2025-02-22 08:15:00', old:{name:'Legacy Bluetooth Policy',status:'INACTIVE'}, new:null },
  { id:'5', admin:'r.patel', type:'GRANT_TEMP_ACCESS', target_type:'DEVICE', target:'WD Passport 2TB', ip:'192.168.1.403', time:'2025-02-22 08:00:00', old:null, new:{duration:'2h',reason:'Client meeting'} },
  { id:'6', admin:'admin', type:'MODIFY_SETTING', target_type:'SYSTEM', target:'security.session_timeout', ip:'192.168.1.50', time:'2025-02-22 07:45:00', old:{value:'1800'}, new:{value:'3600'} },
  { id:'7', admin:'admin', type:'ASSIGN_POLICY', target_type:'USER_GROUP', target:'Finance Team', ip:'192.168.1.50', time:'2025-02-22 07:30:00', old:null, new:{policy:'PCI-DSS Credit Card Protection'} },
  { id:'8', admin:'k.wilson', type:'CREATE_SCAN', target_type:'EDISCOVERY', target:'Q1 Compliance Scan', ip:'192.168.1.601', time:'2025-02-22 07:00:00', old:null, new:{scope:'Finance,HR',schedule:'WEEKLY'} },
]

const TYPE_COLOR: Record<string,string> = {
  CREATE_POLICY:'success', DELETE_POLICY:'danger', MODIFY_USER:'warning', MODIFY_SETTING:'info',
  ADD_ALLOWLIST:'success', ASSIGN_POLICY:'primary', GRANT_TEMP_ACCESS:'warning', CREATE_SCAN:'info',
}

export default function AuditTrail() {
  const [showDiff, setShowDiff] = useState<any>(null)

  const columns = [
    { key:'time', label:'Timestamp', sortable:true, render:(v:string)=>
      <span className="font-monospace text-muted" style={{fontSize:'0.78rem'}}>{v}</span>
    },
    { key:'admin', label:'Admin', render:(v:string)=>(
      <div className="d-flex align-items-center gap-2">
        <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle text-white fw-bold"
          style={{width:28,height:28,fontSize:'0.7rem',flexShrink:0}}>
          {v.slice(0,2).toUpperCase()}
        </div>
        <span className="fw-semibold small">{v}</span>
      </div>
    )},
    { key:'type', label:'Action', render:(v:string)=>
      <span className={`badge bg-${TYPE_COLOR[v]||'secondary'}`} style={{fontSize:'0.72rem'}}>{v.replace(/_/g,' ')}</span>
    },
    { key:'target_type', label:'Target Type', render:(v:string)=>
      <span className="badge bg-light text-dark border" style={{fontSize:'0.7rem'}}>{v.replace('_',' ')}</span>
    },
    { key:'target', label:'Target', render:(v:string)=>
      <span className="small fw-semibold">{v}</span>
    },
    { key:'ip', label:'IP Address', render:(v:string)=>
      <code className="small text-muted">{v}</code>
    },
    { key:'id', label:'Changes', render:(_:string, row:any)=>(
      (row.old || row.new) ? (
        <button className="btn btn-sm btn-outline-primary" onClick={()=>setShowDiff(row)}>
          <i className="bi bi-code-square me-1"/>Diff
        </button>
      ) : <span className="text-muted small">—</span>
    )},
  ]

  return (
    <>
      <ContentHeader title="Audit Trail" breadcrumbs={[{label:'Logs'},{label:'Audit Trail'}]} />

      <div className="row g-3 mb-4">
        {[
          { label:'Actions Today', value:MOCK_ACTIONS.length, icon:'bi-journal-check', color:'primary' },
          { label:'Policy Changes', value:MOCK_ACTIONS.filter(a=>a.target_type==='POLICY').length, icon:'bi-shield-check', color:'info' },
          { label:'User Changes', value:MOCK_ACTIONS.filter(a=>a.target_type==='USER').length, icon:'bi-person-check', color:'warning' },
          { label:'Admin Users', value:new Set(MOCK_ACTIONS.map(a=>a.admin)).size, icon:'bi-person-lock', color:'success' },
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
        <div className="card-header bg-white border-0 py-3 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-semibold"><i className="bi bi-journal-check me-2 text-primary"/>Administrative Actions</h6>
          <button className="btn btn-sm btn-outline-secondary"><i className="bi bi-download me-1"/>Export</button>
        </div>
        <div className="card-body p-0">
          <DataTable columns={columns} data={MOCK_ACTIONS} searchable />
        </div>
      </div>

      {/* Diff Modal */}
      {showDiff && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <span className={`badge bg-${TYPE_COLOR[showDiff.type]||'secondary'} me-2`}>{showDiff.type.replace(/_/g,' ')}</span>
                  {showDiff.target}
                </h5>
                <button className="btn-close" onClick={()=>setShowDiff(null)}/>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-muted small">Admin</div>
                    <div className="fw-semibold">{showDiff.admin}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">IP Address</div>
                    <code>{showDiff.ip}</code>
                  </div>
                  <div className="col-md-4">
                    <div className="text-muted small">Timestamp</div>
                    <div className="fw-semibold">{showDiff.time}</div>
                  </div>
                </div>
                <hr/>
                <div className="row g-3">
                  {showDiff.old && (
                    <div className="col-md-6">
                      <div className="text-danger fw-semibold mb-2"><i className="bi bi-dash-circle me-1"/>Before</div>
                      <pre className="bg-danger-subtle rounded p-3 small mb-0">{JSON.stringify(showDiff.old, null, 2)}</pre>
                    </div>
                  )}
                  {showDiff.new && (
                    <div className="col-md-6">
                      <div className="text-success fw-semibold mb-2"><i className="bi bi-plus-circle me-1"/>After</div>
                      <pre className="bg-success-subtle rounded p-3 small mb-0">{JSON.stringify(showDiff.new, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={()=>setShowDiff(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
