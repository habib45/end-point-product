import { User, Order, Product, BlogPost } from '@/types'

export const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15', phone: '+1 555-0101', location: 'New York, US' },
  { id: 2, name: 'Bob Martin', email: 'bob@example.com', role: 'Editor', status: 'Active', joined: '2024-02-20', phone: '+1 555-0102', location: 'Los Angeles, US' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-03-10', phone: '+1 555-0103', location: 'Chicago, US' },
  { id: 4, name: 'David Clark', email: 'david@example.com', role: 'Editor', status: 'Active', joined: '2024-04-05', phone: '+1 555-0104', location: 'Houston, US' },
  { id: 5, name: 'Eva Brown', email: 'eva@example.com', role: 'Viewer', status: 'Active', joined: '2024-05-22', phone: '+1 555-0105', location: 'Phoenix, US' },
  { id: 6, name: 'Frank Davis', email: 'frank@example.com', role: 'Editor', status: 'Active', joined: '2024-06-01', phone: '+1 555-0106', location: 'Philadelphia, US' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-06-15', phone: '+1 555-0107', location: 'San Antonio, US' },
  { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'Admin', status: 'Active', joined: '2024-07-01', phone: '+1 555-0108', location: 'San Diego, US' },
]

export const mockOrders: Order[] = [
  { id: '#ORD-1001', customer: 'John Smith', date: '2024-09-01', amount: '$320.00', status: 'Completed', items: 3, paymentMethod: 'Credit Card' },
  { id: '#ORD-1002', customer: 'Sarah Lee', date: '2024-09-02', amount: '$150.50', status: 'Pending', items: 1, paymentMethod: 'PayPal' },
  { id: '#ORD-1003', customer: 'Mike Brown', date: '2024-09-03', amount: '$89.00', status: 'Processing', items: 2, paymentMethod: 'Credit Card' },
  { id: '#ORD-1004', customer: 'Emily Davis', date: '2024-09-04', amount: '$560.00', status: 'Completed', items: 5, paymentMethod: 'Bank Transfer' },
  { id: '#ORD-1005', customer: 'Tom Wilson', date: '2024-09-05', amount: '$210.00', status: 'Cancelled', items: 2, paymentMethod: 'Credit Card' },
  { id: '#ORD-1006', customer: 'Lucy Martin', date: '2024-09-06', amount: '$99.00', status: 'Completed', items: 1, paymentMethod: 'PayPal' },
  { id: '#ORD-1007', customer: 'James Clark', date: '2024-09-07', amount: '$430.00', status: 'Processing', items: 4, paymentMethod: 'Credit Card' },
  { id: '#ORD-1008', customer: 'Anna White', date: '2024-09-08', amount: '$175.00', status: 'Pending', items: 2, paymentMethod: 'Bank Transfer' },
]

export const mockProducts: Product[] = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 79.99, stock: 142, status: 'In Stock', sku: 'EL-001', sales: 284 },
  { id: 2, name: 'Running Shoes Pro', category: 'Sports', price: 129.99, stock: 56, status: 'In Stock', sku: 'SP-002', sales: 178 },
  { id: 3, name: 'Coffee Maker Deluxe', category: 'Kitchen', price: 199.99, stock: 0, status: 'Out of Stock', sku: 'KT-003', sales: 95 },
  { id: 4, name: 'Yoga Mat Premium', category: 'Sports', price: 49.99, stock: 230, status: 'In Stock', sku: 'SP-004', sales: 512 },
  { id: 5, name: 'Smart Watch Series X', category: 'Electronics', price: 349.99, stock: 12, status: 'Low Stock', sku: 'EL-005', sales: 89 },
  { id: 6, name: 'Desk Lamp LED', category: 'Office', price: 39.99, stock: 87, status: 'In Stock', sku: 'OF-006', sales: 203 },
  { id: 7, name: 'Blender Pro 900W', category: 'Kitchen', price: 89.99, stock: 34, status: 'In Stock', sku: 'KT-007', sales: 67 },
  { id: 8, name: 'Ergonomic Chair', category: 'Office', price: 449.99, stock: 8, status: 'Low Stock', sku: 'OF-008', sales: 41 },
]

export const mockBlogPosts: BlogPost[] = [
  { id: 1, title: 'Getting Started with React 18', category: 'Technology', author: 'Alice Johnson', date: '2024-09-01', status: 'Published', views: 1240, tags: ['React', 'JavaScript'] },
  { id: 2, title: 'Top 10 UI Design Trends in 2024', category: 'Design', author: 'Bob Martin', date: '2024-09-03', status: 'Published', views: 892, tags: ['UI', 'Design', 'Trends'] },
  { id: 3, title: 'Building Scalable APIs with Node.js', category: 'Backend', author: 'Carol White', date: '2024-09-05', status: 'Draft', views: 0, tags: ['Node.js', 'API'] },
  { id: 4, title: 'The Future of AI in Web Development', category: 'Technology', author: 'David Clark', date: '2024-09-08', status: 'Published', views: 2100, tags: ['AI', 'Web Dev'] },
  { id: 5, title: 'CSS Grid vs Flexbox: When to Use Each', category: 'Design', author: 'Eva Brown', date: '2024-09-10', status: 'Draft', views: 0, tags: ['CSS', 'Layout'] },
]

export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [42000, 53000, 48000, 61000, 55000, 72000, 68000, 79000, 74000, 89000, 82000, 94320],
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13,110,253,0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Expenses',
      data: [30000, 38000, 35000, 42000, 38000, 51000, 48000, 55000, 51000, 62000, 58000, 67000],
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220,53,69,0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}

export const salesByCategory = {
  labels: ['Electronics', 'Sports', 'Kitchen', 'Office', 'Fashion', 'Books'],
  datasets: [{
    data: [35, 20, 15, 12, 10, 8],
    backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#0dcaf0', '#6f42c1', '#fd7e14'],
    borderWidth: 0,
  }],
}

export const weeklyVisitors = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Visitors',
    data: [1200, 1900, 1500, 2100, 1800, 900, 700],
    backgroundColor: 'rgba(13,110,253,0.7)',
    borderRadius: 6,
  }],
}
