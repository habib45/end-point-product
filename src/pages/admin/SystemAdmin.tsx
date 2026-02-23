import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'

export default function SystemAdmin() {
  const [tab, setTab] = useState<'settings'|'license'|'departments'|'security'>('settings')

  const SETTINGS = [
    { key:'system.name', value:import.meta.env.VITE_APP_NAME, type:'STRING', desc:'System display name' },
    { key:'security.session_timeout', value:'3600', type:'INTEGER', desc:'Session timeout (seconds)' },
    { key:'security.password_min_length', value:'8', type:'INTEGER', desc:'Minimum password length' },
    { key:'security.mfa_required', value:'true', type:'BOOLEAN', desc:'Require MFA for admins' },
    { key:'logs.retention_days', value:'90', type:'INTEGER', desc:'Log retention period (days)' },
    { key:'backup.auto_enabled', value:'true', type:'BOOLEAN', desc:'Enable automatic backups' },
    { key:'backup.retention_days', value:'30', type:'INTEGER', desc:'Backup retention period' },
    { key:'alerts.email_enabled', value:'true', type:'BOOLEAN', desc:'Enable email alerts' },
    { key:'dashboard.refresh_interval', value:'30', type:'INTEGER', desc:'Dashboard refresh (seconds)' },
  ]

  const DEPARTMENTS = [
    { name:'Finance', users:128, computers:142, parent:null },
    { name:'Human Resources', users:45, computers:52, parent:null },
    { name:'Engineering', users:287, computers:312, parent:null },
    { name:'Legal', users:38, computers:41, parent:null },
    { name:'Operations', users:194, computers:210, parent:null },
    { name:'Management', users:23, computers:27, parent:null },
  ]

  return (
    <>
      <ContentHeader title="System Administration" breadcrumbs={[{label:'Home'},{label:'System Admin'}]} />

      <div className="card border-0 shadow-sm" style={{borderRadius:16}}>
        <div className="card-header bg-transparent border-0 pt-4 px-4">
          <ul className="nav nav-tabs card-header-tabs">
            {([
              ['settings','System Settings','bi-gear'],
              ['license','Licensing','bi-key'],
              ['departments','Departments','bi-building'],
              ['security','Security','bi-shield-lock'],
            ] as const).map(([k,l,i])=>(
              <li className="nav-item" key={k}>
                <button className={`nav-link d-flex align-items-center gap-1 border-0 bg-transparent ${tab===k?'active':''}`} onClick={()=>setTab(k)}>
                  <i className={`bi ${i}`}/> {l}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body p-4">
          {tab === 'settings' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div><h6 className="fw-bold mb-0">System Settings</h6><small className="text-muted">Global configuration parameters</small></div>
                <button className="btn btn-primary btn-sm"><i className="bi bi-save me-1"/>Save Changes</button>
              </div>
              <div className="row g-3">
                {SETTINGS.map(s=>(
                  <div className="col-md-6" key={s.key}>
                    <label className="form-label small fw-semibold">{s.desc}</label>
                    <div className="d-flex align-items-center gap-2">
                      <code className="small text-muted me-2">{s.key}</code>
                      {s.type === 'BOOLEAN'
                        ? <div className="form-check form-switch"><input className="form-check-input" type="checkbox" defaultChecked={s.value==='true'}/></div>
                        : <input className="form-control form-control-sm" defaultValue={s.value}/>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'license' && (
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card border-success" style={{borderRadius:12}}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="rounded-3 bg-success-subtle d-flex align-items-center justify-content-center" style={{width:56,height:56}}>
                        <i className="bi bi-key-fill text-success fs-3"/>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">Enterprise License</h6>
                        <span className="badge bg-success">ACTIVE</span>
                      </div>
                    </div>
                    <div className="row g-2">
                      {[
                        {label:'Product', value:import.meta.env.VITE_APP_NAME},
                        {label:'Version', value:'4.2.1'},
                        {label:'Max Endpoints', value:'5,000'},
                        {label:'Current Endpoints', value:'2,847'},
                        {label:'Expires', value:'2026-03-08'},
                        {label:'Support Level', value:'Enterprise (24/7)'},
                      ].map(({label,value})=>(
                        <div className="col-6" key={label}>
                          <div className="small text-muted">{label}</div>
                          <div className="fw-semibold small">{value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>Endpoint Usage</span>
                        <span className="fw-bold">2,847 / 5,000 (57%)</span>
                      </div>
                      <div className="progress" style={{height:8}}>
                        <div className="progress-bar bg-success" style={{width:'57%'}}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h6 className="fw-bold mb-3">Licensed Modules</h6>
                {['Device Control','Content Aware Protection','eDiscovery','Enforced Encryption','Advanced Reporting','SIEM Integration','Directory Services','Multi-Factor Authentication'].map(m=>(
                  <div key={m} className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-check-circle-fill text-success"/>
                    <span className="small">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'departments' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div><h6 className="fw-bold mb-0">Departments</h6><small className="text-muted">Organizational structure</small></div>
                <button className="btn btn-primary btn-sm"><i className="bi bi-plus-lg me-1"/>Add Department</button>
              </div>
              <div className="row g-3">
                {DEPARTMENTS.map(d=>(
                  <div className="col-md-6 col-lg-4" key={d.name}>
                    <div className="card border-0" style={{borderRadius:12, background:'var(--bs-tertiary-bg)'}}>
                      <div className="card-body p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h6 className="fw-bold mb-0 small">{d.name}</h6>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-secondary py-0 px-1"><i className="bi bi-pencil"/></button>
                            <button className="btn btn-sm btn-outline-danger py-0 px-1"><i className="bi bi-trash"/></button>
                          </div>
                        </div>
                        <div className="d-flex gap-3">
                          <div><div className="text-muted" style={{fontSize:'0.72rem'}}>Users</div><div className="fw-bold small">{d.users}</div></div>
                          <div><div className="text-muted" style={{fontSize:'0.72rem'}}>Computers</div><div className="fw-bold small">{d.computers}</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="fw-bold mb-3">Password Policy</h6>
                <div className="d-flex flex-column gap-3">
                  {[
                    {label:'Minimum Length', value:'8 characters'},
                    {label:'Complexity Required', value:'Uppercase, Lowercase, Numbers, Symbols'},
                    {label:'Expiration', value:'90 days'},
                    {label:'History', value:'Last 10 passwords'},
                    {label:'Failed Attempts Lockout', value:'5 attempts'},
                  ].map(({label,value})=>(
                    <div key={label} className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <span className="small">{label}</span>
                      <span className="small fw-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold mb-3">Session & Access Controls</h6>
                <div className="d-flex flex-column gap-3">
                  {[
                    {label:'Session Timeout', value:'60 minutes'},
                    {label:'MFA Required', value:'Yes (TOTP/Email)'},
                    {label:'IP Allowlisting', value:'Configured (3 ranges)'},
                    {label:'Brute Force Protection', value:'Active'},
                    {label:'TLS Version', value:'TLS 1.3 minimum'},
                    {label:'Audit Logging', value:'All admin actions'},
                  ].map(({label,value})=>(
                    <div key={label} className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <span className="small">{label}</span>
                      <span className="small fw-semibold text-success">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
