interface BreadcrumbItem {
  label: string
  path?: string
}

interface ContentHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export default function ContentHeader({ title, subtitle, breadcrumbs = [], actions }: ContentHeaderProps) {
  return (
    <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h4 className="fw-bold mb-0">{title}</h4>
        {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
        {breadcrumbs.length > 0 && (
          <ol className="breadcrumb mb-0 mt-1">
            <li className="breadcrumb-item"><a href="/dashboard" className="text-decoration-none">Home</a></li>
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? 'active' : ''}`}>
                {crumb.path && i !== breadcrumbs.length - 1
                  ? <a href={crumb.path} className="text-decoration-none">{crumb.label}</a>
                  : crumb.label}
              </li>
            ))}
          </ol>
        )}
      </div>
      {actions && <div className="d-flex gap-2">{actions}</div>}
    </div>
  )
}
