import ContentHeader from '@/components/ui/ContentHeader'
import StatCard from '@/components/ui/StatCard'

const topPages = [
  { page: '/dashboard', views: 12400, bounce: '32%', time: '3:42' },
  { page: '/ecommerce/products', views: 8900, bounce: '41%', time: '2:18' },
  { page: '/blog/posts', views: 6700, bounce: '28%', time: '4:05' },
  { page: '/users', views: 5200, bounce: '37%', time: '2:55' },
  { page: '/analytics', views: 4100, bounce: '44%', time: '1:38' },
]

const countries = [
  { name: 'United States', flag: '🇺🇸', sessions: 8420, percent: 42 },
  { name: 'United Kingdom', flag: '🇬🇧', sessions: 3210, percent: 16 },
  { name: 'Germany', flag: '🇩🇪', sessions: 2180, percent: 11 },
  { name: 'France', flag: '🇫🇷', sessions: 1940, percent: 9 },
  { name: 'Canada', flag: '🇨🇦', sessions: 1620, percent: 8 },
]

export default function Analytics() {
  return (
    <>
      <ContentHeader title="Analytics" breadcrumbs={[{ label: 'Analytics' }]} />

      <div className="row g-3 mb-4">
        <StatCard title="Total Sessions" value="24,820" icon="bi-activity" color="primary" change="12.5%" changeType="up" />
        <StatCard title="Page Views" value="89,430" icon="bi-eye" color="info" change="8.3%" changeType="up" />
        <StatCard title="Avg. Session" value="3m 42s" icon="bi-clock" color="success" change="0.4%" changeType="down" />
        <StatCard title="Conversion Rate" value="3.8%" icon="bi-percent" color="warning" change="1.2%" changeType="up" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Traffic Overview</h5>
              <select className="form-select form-select-sm" style={{ width: 120 }}>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: 280 }}>
              <div className="text-center text-muted">
                <i className="bi bi-graph-up-arrow fs-1 opacity-25 d-block mb-2"></i>
                <p className="mb-1 fw-semibold">Traffic Chart</p>
                <small>Integrate Chart.js or Recharts here for live traffic data</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Traffic Sources</h5>
            </div>
            <div className="card-body">
              {[
                { label: 'Organic Search', value: 45, color: 'primary' },
                { label: 'Direct', value: 25, color: 'success' },
                { label: 'Social Media', value: 18, color: 'warning' },
                { label: 'Email', value: 12, color: 'info' },
              ].map(s => (
                <div key={s.label} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="fw-semibold">{s.label}</small>
                    <small className="text-muted">{s.value}%</small>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className={`progress-bar bg-${s.color}`} style={{ width: `${s.value}%` }}></div>
                  </div>
                </div>
              ))}
              <hr />
              <div className="row g-2 text-center">
                {[
                  { label: 'New Users', value: '64%', color: 'primary' },
                  { label: 'Returning', value: '36%', color: 'success' },
                ].map(m => (
                  <div key={m.label} className="col-6">
                    <div className={`p-3 rounded-2 bg-${m.color} bg-opacity-10`}>
                      <div className={`fw-bold fs-5 text-${m.color}`}>{m.value}</div>
                      <small className="text-muted">{m.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-7">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Top Pages</h5>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Bounce Rate</th>
                    <th>Avg. Time</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map(p => (
                    <tr key={p.page}>
                      <td><code className="text-primary">{p.page}</code></td>
                      <td>{p.views.toLocaleString()}</td>
                      <td>{p.bounce}</td>
                      <td>{p.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Top Countries</h5>
            </div>
            <div className="card-body">
              {countries.map(c => (
                <div key={c.name} className="d-flex align-items-center gap-3 mb-3">
                  <span style={{ fontSize: 22 }}>{c.flag}</span>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="fw-semibold">{c.name}</small>
                      <small className="text-muted">{c.sessions.toLocaleString()}</small>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-bar bg-primary" style={{ width: `${c.percent}%` }}></div>
                    </div>
                  </div>
                  <small className="text-muted" style={{ width: 30 }}>{c.percent}%</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
