import { useState, useMemo } from 'react'

interface UseTableOptions<T> {
  data: T[]
  searchFields?: (keyof T)[]
  defaultPageSize?: number
}

export function useTable<T extends Record<string, unknown>>({
  data,
  searchFields = [],
  defaultPageSize = 10,
}: UseTableOptions<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    if (!search || searchFields.length === 0) return data
    const q = search.toLowerCase()
    return data.filter(row =>
      searchFields.some(field => String(row[field]).toLowerCase().includes(q))
    )
  }, [data, search, searchFields])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey])
      const bv = String(b[sortKey])
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const handleSearch = (q: string) => {
    setSearch(q)
    setPage(1)
  }

  return {
    rows: paginated,
    search,
    setSearch: handleSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalRows: sorted.length,
    sortKey,
    sortDir,
    handleSort,
  }
}
