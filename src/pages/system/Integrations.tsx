import { useState } from 'react'
import ContentHeader from '@/components/ui/ContentHeader'

const MOCK_DIRECTORIES = [
  {
    id:'1', type:'AD', name:'Corporate Active Directory', host:'dc01.corp.local', port:389,
    ssl:false, status:'CONNECTED', last_sync:'2025-02-22 08:00:00', users_synced:715,
    groups_synced:34, base_dn:'DC=corp,DC=local',
  },
  {
    id:'2', type:'AZURE_AD', name:'Azure Active Directory', host:'login.microsoftonline.com', port:443,
    ssl:true, status:'CONNECTED', last_sync:'2025-02-22 09:00:00', users_synced:312,
    groups_synced:18, base_dn:'tenant-id-abcd-1234',
  },
  {
    id:'3', type:'LDAP', name:'Legacy LDAP Server', host:'ldap.corp.local', port:636,
    ssl:true, status:'DISCONNECTED', last_sync:'2025-02-20 12:00:00', users_synced:0,
    groups_synced:0, base_dn:'OU=Users,DC=corp,DC=local',
  },
]

const MOCK_SIEMS = [
  { id:'1', name:'Splunk Enterprise', type:'SYSLOG', host:'splunk.corp.local', port:514, protocol:'UDP', status:'ACTIVE', events_sent:847234, last_event:'2025-02-22 09:14:55' },
  { id:'2', name:'IBM QRadar', type:'LEEF', host:'qradar.corp.local', port:514, protocol:'TCP', status:'ACTIVE', events_sent:421087, last_event:'2025-02-22 09:14:52' },
  { id:'3', name:'Microsoft Sentinel', type:'API', host:'management.azure.com', port:443, protocol:'HTTPS', status:'INACTIVE', events_sent:0, last_event:null },
]

const DIR_TYPE_ICON: Record<string,string> = { AD:'microsoft', AZURE_AD:'cloud', LDAP:'server' }
const DIR_TYPE_COLOR: Record<string,string> = { AD:'primary', AZURE_AD:'info', LDAP:'secondary' }

export default function Integrations() {
  const [tab, setTab] = useState<'directory'|'siem'>('directory')
  const [showModal, setShowModal] = useState<'directory'|'siem'|null>(null)

  return (
    <>
      <ContentHeader title="Integrations" breadcrumbs={[{label:'System'},{label:'Integrations'}]} />

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <ul className="nav nav-tabs border-0 mb-0">
            <li className="nav-item">
              <button className={`nav-link ${tab==='directory'?'active fw-semibold':''}`} onClick={()=>setTab('directory')}>
                <i className="bi bi-diagram-3 me-1"/>Directory Services
                <span className="badge bg-primary ms-2">{MOCK_DIRECTORIES.length}</span>
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${tab==='siem'?'active fw-semibold':''}`} onClick={()=>setTab('siem')}>
                <i className="bi bi-broadcast-pin me-1"/>SIEM Integration
                <span className="badge bg-info ms-2">{MOCK_SIEMS.length}</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {tab === 'directory' ? (
            <>
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary btn-sm" onClick={()=>setShowModal('directory')}>
                  <i className="bi bi-plus-lg me-1"/>Add Directory
                </button>
              </div>
              <div className="row g-3">
                {MOCK_DIRECTORIES.map(d=>(
                  <div className="col-md-6 col-lg-4" key={d.id}>
                    <div className="card border h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className={`d-flex align-items-center justify-content-center rounded-2 bg-${DIR_TYPE_COLOR[d.type]}-subtle`} style={{width:36,height:36}}>
                              <i className={`bi bi-${DIR_TYPE_ICON[d.type]} text-${DIR_TYPE_COLOR[d.type]} fs-5`}/>
                            </div>
                            <div>
                              <div className="fw-semibold small">{d.name}</div>
                              <span className={`badge bg-${DIR_TYPE_COLOR[d.type]}`} style={{fontSize:'0.65rem'}}>{d.type}</span>
                            </div>
                          </div>
                          <span className={`badge bg-${d.status==='CONNECTED'?'success':'danger'}`}>{d.status}</span>
                        </div>
                        <div className="row g-2" style={{fontSize:'0.78rem'}}>
                          <div className="col-6">
                            <div className="text-muted">Host</div>
                            <code className="small">{d.host}:{d.port}</code>
                          </div>
                          <div className="col-6">
                            <div className="text-muted">SSL</div>
                            <div>{d.ssl ? <span className="text-success">Enabled</span> : <span className="text-muted">Disabled</span>}</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted">Users Synced</div>
                            <div className="fw-semibold">{d.users_synced.toLocaleString()}</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted">Groups Synced</div>
                            <div className="fw-semibold">{d.groups_synced}</div>
                          </div>
                          <div className="col-12">
                            <div className="text-muted">Last Sync</div>
                            <div>{d.last_sync}</div>
                          </div>
                        </div>
                        <div className="d-flex gap-2 mt-3">
                          <button className="btn btn-sm btn-outline-primary flex-grow-1">
                            <i className="bi bi-arrow-repeat me-1"/>Sync Now
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" title="Test Connection">
                            <i className="bi bi-wifi"/>
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" title="Edit">
                            <i className="bi bi-gear"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary btn-sm" onClick={()=>setShowModal('siem')}>
                  <i className="bi bi-plus-lg me-1"/>Add SIEM
                </button>
              </div>
              <div className="row g-3">
                {MOCK_SIEMS.map(s=>(
                  <div className="col-md-6" key={s.id}>
                    <div className="card border h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between mb-3">
                          <div>
                            <div className="fw-semibold">{s.name}</div>
                            <span className="badge bg-secondary" style={{fontSize:'0.65rem'}}>{s.type}</span>
                          </div>
                          <div className="form-check form-switch mb-0">
                            <input className="form-check-input" type="checkbox" defaultChecked={s.status==='ACTIVE'}/>
                          </div>
                        </div>
                        <div className="row g-2 mb-3" style={{fontSize:'0.78rem'}}>
                          <div className="col-6">
                            <div className="text-muted">Endpoint</div>
                            <code className="small">{s.host}:{s.port}</code>
                          </div>
                          <div className="col-6">
                            <div className="text-muted">Protocol</div>
                            <div className="fw-semibold">{s.protocol}</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted">Events Sent</div>
                            <div className="fw-semibold">{s.events_sent.toLocaleString()}</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted">Last Event</div>
                            <div>{s.last_event || '—'}</div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-info flex-grow-1">
                            <i className="bi bi-send me-1"/>Test Send
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-gear"/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add {showModal==='directory'?'Directory Service':'SIEM Integration'}</h5>
                <button className="btn-close" onClick={()=>setShowModal(null)}/>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">{showModal==='directory'?'Service':'SIEM'} Type</label>
                    <select className="form-select">
                      {showModal==='directory'
                        ? <><option>AD</option><option>AZURE_AD</option><option>LDAP</option></>
                        : <><option>SYSLOG</option><option>CEF</option><option>LEEF</option><option>API</option></>
                      }
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Display Name</label>
                    <input className="form-control" placeholder="e.g. Corporate AD"/>
                  </div>
                  <div className="col-8">
                    <label className="form-label fw-semibold">Host / URL</label>
                    <input className="form-control" placeholder="dc01.corp.local"/>
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-semibold">Port</label>
                    <input className="form-control" type="number" placeholder="389"/>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="sslSwitch"/>
                      <label className="form-check-label" htmlFor="sslSwitch">Use SSL/TLS</label>
                    </div>
                  </div>
                  {showModal==='directory' && (
                    <>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Bind Username</label>
                        <input className="form-control" placeholder="svc-sentinelgo@corp.local"/>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Bind Password</label>
                        <input className="form-control" type="password"/>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">Base DN</label>
                        <input className="form-control font-monospace" placeholder="DC=corp,DC=local"/>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-info me-auto"><i className="bi bi-wifi me-1"/>Test Connection</button>
                <button className="btn btn-secondary" onClick={()=>setShowModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={()=>setShowModal(null)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
