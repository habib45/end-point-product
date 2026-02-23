import { useParams, Link } from 'react-router-dom'
import ContentHeader from '@/components/ui/ContentHeader'
import { mockProducts } from '@/services/mockData'
import { formatCurrency, getStatusColor } from '@/utils/helpers'

export default function ProductDetail() {
  const { id } = useParams()
  const product = mockProducts.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-box-seam fs-1 text-muted d-block mb-3"></i>
        <h4>Product not found</h4>
        <Link to="/ecommerce/products" className="btn btn-primary mt-2">Back to Products</Link>
      </div>
    )
  }

  const color = getStatusColor(product.status)

  return (
    <>
      <ContentHeader
        title="Product Detail"
        breadcrumbs={[{ label: 'E-Commerce' }, { label: 'Products', path: '/ecommerce/products' }, { label: product.name }]}
      />
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="bg-body-tertiary rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 120, height: 120, fontSize: 60 }}>
                📦
              </div>
              <span className={`badge bg-${color}-subtle text-${color} border border-${color}-subtle mb-2`}>
                {product.status}
              </span>
              <h5 className="fw-bold">{product.name}</h5>
              <p className="text-muted small">{product.category}</p>
              <h3 className="text-primary fw-bold">{formatCurrency(product.price)}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Product Details</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { label: 'Product Name', value: product.name },
                  { label: 'SKU', value: product.sku },
                  { label: 'Category', value: product.category },
                  { label: 'Price', value: formatCurrency(product.price) },
                  { label: 'Stock', value: `${product.stock} units` },
                  { label: 'Total Sales', value: `${product.sales} units` },
                ].map(f => (
                  <div key={f.label} className="col-md-6">
                    <small className="text-muted d-block mb-1">{f.label}</small>
                    <p className="mb-0 fw-semibold">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 d-flex gap-2">
                <button className="btn btn-primary"><i className="bi bi-pencil me-1"></i>Edit Product</button>
                <button className="btn btn-outline-danger"><i className="bi bi-trash me-1"></i>Delete</button>
                <Link to="/ecommerce/products" className="btn btn-outline-secondary ms-auto">
                  <i className="bi bi-arrow-left me-1"></i>Back
                </Link>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom">
              <h5 className="mb-0 fw-semibold">Sales Performance</h5>
            </div>
            <div className="card-body">
              <div className="row g-2 text-center">
                {[
                  { label: 'Revenue', value: formatCurrency(product.price * product.sales), color: 'success' },
                  { label: 'Units Sold', value: product.sales, color: 'primary' },
                  { label: 'In Stock', value: product.stock, color: 'info' },
                  { label: 'Rating', value: '4.5 ★', color: 'warning' },
                ].map(m => (
                  <div key={m.label} className="col-3">
                    <div className={`p-3 rounded-2 bg-${m.color} bg-opacity-10`}>
                      <div className={`fw-bold text-${m.color}`} style={{ fontSize: 15 }}>{m.value}</div>
                      <small className="text-muted">{m.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
