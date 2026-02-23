interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  change?: string
  changeType?: 'up' | 'down'
}

export default function StatCard({ title, value, icon, color, change, changeType }: StatCardProps) {
  return (
    <div className="col-xl-3 col-md-6">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted small text-uppercase fw-semibold mb-1" style={{ letterSpacing: '0.06em', fontSize: '0.7rem' }}>
                {title}
              </p>
              <h3 className="fw-bold mb-1">{value}</h3>
              {change && (
                <small className={`text-${changeType === 'up' ? 'success' : 'danger'} fw-semibold`}>
                  <i className={`bi bi-arrow-${changeType}-short`}></i> {change}
                </small>
              )}
            </div>
            <div className={`bg-${color} bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0`}
              style={{ width: 54, height: 54 }}>
              <i className={`bi ${icon} text-${color} fs-4`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
