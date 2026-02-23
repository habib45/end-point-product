export interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
  status: 'Active' | 'Inactive'
  joined: string
  phone?: string
  location?: string
  avatar?: string
}

export interface Order {
  id: string
  customer: string
  date: string
  amount: string
  status: 'Completed' | 'Pending' | 'Processing' | 'Cancelled'
  items: number
  paymentMethod: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 'In Stock' | 'Out of Stock' | 'Low Stock'
  sku: string
  sales: number
}

export interface BlogPost {
  id: number
  title: string
  category: string
  author: string
  date: string
  status: 'Published' | 'Draft'
  views: number
  tags: string[]
}

export interface CalendarEvent {
  id: number
  title: string
  date: string
  time?: string
  type: 'meeting' | 'deadline' | 'reminder' | 'event'
  color: string
}

export interface NavItem {
  label: string
  icon: string
  path: string
  badge?: string | number
  children?: NavItem[]
}
