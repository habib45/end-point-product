import ContentHeader from '@/components/ui/ContentHeader'

const LICENSE = {
  key: 'SNTGO-ENTE-RPRI-SE-2025-ABCD-1234-EFGH',
  product: import.meta.env.VITE_APP_NAME,
  version: '4.3.2',
  edition: 'Enterprise',
  max_endpoints: 1000,
  current_endpoints: 712,
  expires_at: '2025-12-31',
  modules: [
    { name: 'Device Control', enabled: true },
    { name: 'Content Aware Protection', enabled: true },
    { name: 'eDiscovery', enabled: true },
    { name: 'EasyLock Encryption', enabled: true },
    { name: 'Deep Packet Inspection', enabled: true },
    { name: 'SIEM Integration', enabled: true },
    { name: 'Active Directory Sync', enabled: true },
    { name: 'API Access', enabled: true },
  ],
  support: {
    level: 'Enterprise 24/7',
    contact: 'support@sentinelgo.com',
    expires: '2025-12-31',
  }
}

const USAGE_PCT = Math.round((LICENSE.current_endpoints / LICENSE.max_endpoints) * 100)
const DAYS_LEFT = Math.round((new Date(LICENSE.expires_at).getTime() - Date.now()) / (1000*60*60*24))

export default function License() {
  return (
    <>
      <ContentHeader title="License Management" breadcrumbs={[{label:'System'},{label:'License'}]} />

      {/* License Key Card */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h6 className="mb-0 fw-semibold">License Details</h6>
            </div>
            <div className="card-body">
              <div className="p-3 bg-light rounded-3 mb-4 font-monospace text-center fw-semibold" style={{letterSpacing:'0.05em'}}>
                {LICENSE.key}
              </div>
              <div className="row g-3">
                {[
                  { label:'Product', value: LICENSE.product },
                  { label:'Edition', value: <span className="badge bg-primary">{LICENSE.edition}</span> },
                  { label:'Version', value: LICENSE.version },
                  { label:'Expires', value: <span className={`fw-semibold ${DAYS_LEFT < 30 ? 'text-danger' : 'text-success'}`}>{LICENSE.expires_at} ({DAYS_LEFT} days)</span> },
                  { label:'Support Level', value: LICENSE.support.level },
                  { label:'Support Contact', value: <a href={`mailto:${LICENSE.support.contact}`}>{LICENSE.support.contact}</a> },
                ].map(r=>(
                  <div className="col-md-6" key={r.label}>
                    <div className="text-muted small mb-1">{r.label}</div>
                    <div className="fw-semibold">{r.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 d-flex gap-2">
                <button className="btn btn-primary"><i className="bi bi-arrow-repeat me-1"/>Renew License</button>
                <button className="btn btn-outline-secondary"><i className="bi bi-upload me-1"/>Import License</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold small">Endpoint Usage</span>
                <span className={`badge bg-${USAGE_PCT>90?'danger':USAGE_PCT>75?'warning':'success'}`}>{USAGE_PCT}%</span>
              </div>
              <div className="progress mb-2" style={{height:12}}>
                <div className={`progress-bar bg-${USAGE_PCT>90?'danger':USAGE_PCT>75?'warning':'success'}`} style={{width:`${USAGE_PCT}%`}}/>
              </div>
              <div className="text-muted small">{LICENSE.current_endpoints.toLocaleString()} of {LICENSE.max_endpoints.toLocaleString()} endpoints</div>
            </div>
          </div>

          {DAYS_LEFT < 60 && (
            <div className={`alert alert-${DAYS_LEFT<30?'danger':'warning'} d-flex align-items-start gap-2`}>
              <i className="bi bi-exclamation-triangle-fill mt-1"/>
              <div>
                <div className="fw-semibold">License Expiring Soon</div>
                <div className="small">Your license expires in {DAYS_LEFT} days. Renew now to avoid service interruption.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Module Entitlements */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h6 className="mb-0 fw-semibold">Licensed Modules</h6>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {LICENSE.modules.map(m=>(
              <div className="col-md-6 col-lg-3" key={m.name}>
                <div className={`card border h-100 ${m.enabled?'border-success-subtle':'border-danger-subtle'}`}>
                  <div className="card-body p-3 d-flex align-items-center gap-3">
                    <div className={`d-flex align-items-center justify-content-center rounded-circle ${m.enabled?'bg-success':'bg-danger'}`}
                      style={{width:32,height:32,flexShrink:0}}>
                      <i className={`bi ${m.enabled?'bi-check-lg':'bi-x-lg'} text-white`} style={{fontSize:'0.8rem'}}/>
                    </div>
                    <div>
                      <div className="small fw-semibold">{m.name}</div>
                      <div className={`small ${m.enabled?'text-success':'text-danger'}`}>{m.enabled?'Active':'Not Licensed'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
