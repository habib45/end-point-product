import ContentHeader from '@/components/ui/ContentHeader'
import DataTable from '@/components/tables/DataTable'

const MOCK_COMPUTERS = [
  { id:'1', name:'WS-FINANCE-01', domain:'corp.local', ip:'192.168.1.101', os:'Windows 11', os_ver:'23H2', client_ver:'4.2.1', status:'ONLINE', last_seen:'Just now', dept:'Finance' },
  { id:'2', name:'WS-HR-05', domain:'corp.local', ip:'192.168.1.205', os:'Windows 10', os_ver:'22H2', client_ver:'4.2.0', status:'ONLINE', last_seen:'3 min ago', dept:'HR' },
  { id:'3', name:'MBP-DEV-12', domain:'corp.local', ip:'192.168.1.312', os:'macOS', os_ver:'Sonoma 14.3', client_ver:'4.2.1', status:'ONLINE', last_seen:'1 min ago', dept:'Engineering' },
  { id:'4', name:'WS-LEGAL-03', domain:'corp.local', ip:'192.168.1.403', os:'Windows 11', os_ver:'23H2', client_ver:'4.1.8', status:'OFFLINE', last_seen:'2h ago', dept:'Legal' },
  { id:'5', name:'WS-OPS-07', domain:'corp.local', ip:'192.168.1.507', os:'Ubuntu', os_ver:'22.04 LTS', client_ver:'4.2.1', status:'ONLINE', last_seen:'5 min ago', dept:'Operations' },
  { id:'6', name:'WS-MGMT-01', domain:'corp.local', ip:'192.168.1.601', os:'Windows 11', os_ver:'23H2', client_ver:'4.2.1', status:'MAINTENANCE', last_seen:'30 min ago', dept:'Management' },
]

const STATUS_COLORS: Record<string,string> = { ONLINE:'success', OFFLINE:'secondary', MAINTENANCE:'warning', DECOMMISSIONED:'danger' }

export default function Computers() {
  const columns = [
    { key:'name', label:'Computer Name', sortable:true, render:(v:string)=><span className="fw-semibold">{v}</span> },
    { key:'ip', label:'IP Address' },
    { key:'os', label:'OS', render:(v:string,row:any)=><span>{v} <span className="text-muted small">{row.os_ver}</span></span> },
    { key:'client_ver', label:'Client Ver' },
    { key:'dept', label:'Department', sortable:true },
    { key:'status', label:'Status', sortable:true, render:(v:string)=><span className={`badge bg-${STATUS_COLORS[v]||'secondary'}`}>{v}</span> },
    { key:'last_seen', label:'Last Seen', sortable:true },
    { key:'id', label:'Actions', render:()=>(
      <div className="d-flex gap-1">
        <button className="btn btn-sm btn-outline-primary" title="View"><i className="bi bi-eye"/></button>
        <button className="btn btn-sm btn-outline-secondary" title="Push Policy"><i className="bi bi-send"/></button>
      </div>
    )},
  ]

  return (
    <>
      <ContentHeader title="Computer Management" breadcrumbs={[{label:'Device Control',path:'/device-control'},{label:'Computers'}]} />
      <div className="row g-3 mb-4">
        {[
          {label:'Total', value:'2,847', icon:'bi-pc-display', color:'primary'},
          {label:'Online', value:'2,431', icon:'bi-circle-fill', color:'success'},
          {label:'Offline', value:'398', icon:'bi-circle', color:'secondary'},
          {label:'Maintenance', value:'18', icon:'bi-tools', color:'warning'},
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
        <div className="card-body p-4">
          <DataTable columns={columns} data={MOCK_COMPUTERS} searchable />
        </div>
      </div>
    </>
  )
}
