export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const STATUS_COLORS: Record<string, string> = {
  Completed: 'success',
  Published: 'success',
  Active: 'success',
  'In Stock': 'success',
  Pending: 'warning',
  Draft: 'warning',
  'Low Stock': 'warning',
  Processing: 'info',
  Inactive: 'secondary',
  Cancelled: 'danger',
  'Out of Stock': 'danger',
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'secondary'
}
