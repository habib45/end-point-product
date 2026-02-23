import { Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'

const REPORT_MODULES = [
  { title:'Logs Report', desc:'Device connections, policy events and system activity logs', icon:'bi-journal-text', link:'/reports/logs', color:'primary', count:'47,823 entries' },
  { title:'File Tracing', desc:'Track files copied to removable devices and network', icon:'bi-file-earmark-arrow-right', link:'/reports/file-tracing', color:'info', count:'2,841 transfers' },
  { title:'Policy Violations', desc:'Content policy breaches and enforcement actions', icon:'bi-shield-exclamation', link:'/reports/violations', color:'danger', count:'187 today' },
  { title:'Admin Actions', desc:'Audit trail of all administrative activities', icon:'bi-person-badge', link:'/reports/admin-actions', color:'secondary', count:'342 this week' },
  { title:'Online Computers', desc:'Currently connected endpoints and client status', icon:'bi-pc-display', link:'/reports/computers', color:'success', count:'2,431 online' },
  { title:'Online Users', desc:'Active user sessions across all endpoints', icon:'bi-people', link:'/reports/users', color:'warning', count:'1,847 active' },
  { title:'Connected Devices', desc:'Currently connected peripheral devices', icon:'bi-usb-symbol', link:'/reports/devices', color:'primary', count:'347 connected' },
  { title:'Statistics', desc:'Usage trends, violation analytics and executive summaries', icon:'bi-bar-chart', link:'/reports/statistics', color:'info', count:'7-day trend' },
]

export default function Reports() {
  return (
    <>
      <ContentHeader title="Reports & Analysis" breadcrumbs={[{label:'Home'},{label:'Reports'}]} />

      <div className="row g-3 mb-4">
        {[
          {label:'Scheduled Reports', value:'12', icon:'bi-calendar-check', color:'primary'},
          {label:'Generated Today', value:'8', icon:'bi-file-earmark', color:'success'},
          {label:'Pending', value:'3', icon:'bi-clock', color:'warning'},
          {label:'Exports This Week', value:'24', icon:'bi-download', color:'info'},
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

      <div className="row g-3">
        {REPORT_MODULES.map(r => (
          <div className="col-md-6 col-lg-3" key={r.title}>
            <Link to={r.link} style={{textDecoration:'none'}}>
              <div className="card border-0 shadow-sm h-100 report-card" style={{borderRadius:16, transition:'all 0.2s', cursor:'pointer'}}
                onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-2px)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='none')}>
                <div className="card-body p-4">
                  <div className={`rounded-3 d-flex align-items-center justify-content-center bg-${r.color}-subtle mb-3`} style={{width:52,height:52}}>
                    <i className={`bi ${r.icon} text-${r.color} fs-4`}/>
                  </div>
                  <h6 className="fw-bold mb-1">{r.title}</h6>
                  <p className="small text-muted mb-2">{r.desc}</p>
                  <span className={`badge bg-${r.color}-subtle text-${r.color}`}>{r.count}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
