import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_ENCRYPTED = [
  { id:'1', device:'Samsung T7 500GB', serial:'ST7-XYZ-002', computer:'WS-FINANCE-01', user:'j.smith', algo:'AES-256', encrypted:'2025-02-10 09:00', last_access:'2025-02-22 08:45', status:'Active' },
  { id:'2', device:'Kingston DT 32GB', serial:'KT32-SEC-007', computer:'MBP-DEV-12', user:'m.chen', algo:'AES-256', encrypted:'2025-02-14 14:22', last_access:'2025-02-21 16:30', status:'Active' },
  { id:'3', device:'SanDisk Extreme Pro', serial:'SD-EXP-003', computer:'WS-LEGAL-03', user:'r.patel', algo:'AES-256', encrypted:'2025-01-30 10:15', last_access:'2025-02-20 11:00', status:'Active' },
]

const MOCK_OPS = [
  { id:'1', type:'ENCRYPT', file:'Q4_Reports.zip', size:'245 MB', device:'Samsung T7 500GB', user:'j.smith', computer:'WS-FINANCE-01', status:'SUCCESS', time:'2025-02-22 09:00' },
  { id:'2', type:'DECRYPT', file:'contract_final.pdf', size:'1.2 MB', device:'Kingston DT 32GB', user:'m.chen', computer:'MBP-DEV-12', status:'SUCCESS', time:'2025-02-22 08:20' },
  { id:'3', type:'PASSWORD_CHANGE', file:'-', size:'-', device:'SanDisk Extreme Pro', user:'r.patel', computer:'WS-LEGAL-03', status:'SUCCESS', time:'2025-02-21 15:30' },
]

export default function Encryption() {
  return (
    <>
      <ContentHeader title="Enforced Encryption (EasyLock)" breadcrumbs={[{label:'Home'},{label:'Encryption'}]} />

      <div className="row g-3 mb-4">
        {[
          {label:'Encrypted Devices', value:'128', icon:'bi-lock-fill', color:'success'},
          {label:'Operations Today', value:'47', icon:'bi-arrow-repeat', color:'primary'},
          {label:'Bypass Attempts', value:'3', icon:'bi-unlock', color:'danger'},
          {label:'Temp Passwords', value:'7', icon:'bi-key', color:'warning'},
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

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm" style={{borderRadius:16}}>
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 fw-bold">Encrypted Devices</h6>
              <button className="btn btn-primary btn-sm"><i className="bi bi-key me-1"/>Generate Temp Password</button>
            </div>
            <div className="card-body p-4">
              <DataTable
                columns={[
                  {key:'device', label:'Device', render:(v:string)=><span className="fw-semibold">{v}</span>},
                  {key:'serial', label:'Serial', render:(v:string)=><code className="small">{v}</code>},
                  {key:'user', label:'User'},
                  {key:'algo', label:'Algorithm', render:(v:string)=><span className="badge bg-success">{v}</span>},
                  {key:'last_access', label:'Last Access'},
                  {key:'id', label:'', render:()=>(<button className="btn btn-sm btn-outline-secondary"><i className="bi bi-three-dots"/></button>)},
                ]}
                data={MOCK_ENCRYPTED}
                searchable
              />
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100" style={{borderRadius:16}}>
            <div className="card-header bg-transparent border-0 pt-4 px-4 pb-2">
              <h6 className="mb-0 fw-bold">Encryption Operations Log</h6>
            </div>
            <div className="card-body p-4 pt-2">
              {MOCK_OPS.map(op => (
                <div key={op.id} className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                  <div className={`rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 ${op.type==='ENCRYPT'?'bg-success-subtle':'bg-info-subtle'}`} style={{width:36,height:36}}>
                    <i className={`bi ${op.type==='ENCRYPT'?'bi-lock text-success':op.type==='DECRYPT'?'bi-unlock text-info':'bi-key text-warning'}`}/>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-semibold small">{op.type.replace('_',' ')}: {op.file}</div>
                    <div className="text-muted small">{op.user} · {op.device}</div>
                    <div className="text-muted" style={{fontSize:'0.72rem'}}>{op.time}</div>
                  </div>
                  <span className={`badge bg-${op.status==='SUCCESS'?'success':'danger'} flex-shrink-0`}>{op.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
