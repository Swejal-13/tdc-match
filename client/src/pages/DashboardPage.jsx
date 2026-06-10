import { useState, useEffect } from 'react'
import { customerService } from '../services/customerService'
import CustomerTable from '../components/CustomerTable'
import { StatCard, SearchInput, Select, Pagination, Spinner, EmptyState, PageHeader } from '../components/ui'
import { CITIES, STATUSES } from '../utils/helpers'

export default function DashboardPage() {
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const delay = setTimeout(fetchCustomers, 300)
    return () => clearTimeout(delay)
  }, [search, filterStatus, filterCity, page, sort, order])

  const fetchStats = async () => {
    try {
      const res = await customerService.getStats()
      setStats(res.data)
    } catch {
      setStats({ total: 20, active: 4, sent: 3, meeting: 2, engaged: 1, conversionRate: 5 })
    }
  }

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await customerService.getAll({
        search, status: filterStatus, city: filterCity,
        page, limit: 8, sort, order
      })
      setCustomers(res.data.customers)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.total)
    } catch {
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sort === field) setOrder(o => o === 'asc' ? 'desc' : 'asc')
    else { setSort(field); setOrder('asc') }
    setPage(1)
  }

  const statCards = stats ? [
    { label: 'Total Customers', value: stats.total, change: '+2', up: true },
    { label: 'Active Search', value: stats.active, change: '+1', up: true },
    { label: 'Match Sent', value: stats.sent, change: '0', up: null },
    { label: 'Meetings Scheduled', value: stats.meeting, change: '+1', up: true },
    { label: 'Profiles Reviewed', value: 84, change: '+12', up: true },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, change: '+3%', up: true },
  ] : []

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back — here's an overview of your matchmaking pipeline"
      />

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3.5 mb-6">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Customers Table */}
      <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-black/[0.08] bg-[#FDFAF8] flex-wrap">
          <SearchInput
            value={search}
            onChange={v => { setSearch(v); setPage(1) }}
            placeholder="🔍  Search name, city, profession…"
          />
          <Select
            value={filterStatus}
            onChange={v => { setFilterStatus(v); setPage(1) }}
            options={STATUSES}
            placeholder="All Statuses"
          />
          <Select
            value={filterCity}
            onChange={v => { setFilterCity(v); setPage(1) }}
            options={CITIES}
            placeholder="All Cities"
          />
          <span className="ml-auto text-[12px] text-[#6B5565]">{total} customers</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : customers.length === 0 ? (
          <EmptyState icon="👥" title="No customers found" subtitle="Try adjusting your search or filters" />
        ) : (
          <CustomerTable customers={customers} sort={sort} order={order} onSort={handleSort} />
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}
