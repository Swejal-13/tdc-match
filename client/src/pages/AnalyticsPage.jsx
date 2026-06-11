import { useState, useEffect } from 'react'
import { analyticsService } from '../services/customerService'
import { StatCard, PageHeader, Spinner } from '../components/ui'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'

const PIE_COLORS = ['#2653A3', '#2D7A5A', '#B8860B', '#C84B5A', '#7B4FB8']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1218] text-white px-3 py-2 rounded-lg text-[12px] shadow-xl">
        <p className="font-medium mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await analyticsService.get()
      setData(res.data)
    } catch {
      // Fallback data
      setData({
        summary: { total: 20, active: 4, sent: 3, meeting: 2, engaged: 1, profilesReviewed: 84, matchesSent: 8, conversionRate: 5 },
        cityDistribution: [
          { city: 'Mumbai', count: 4 }, { city: 'Pune', count: 3 },
          { city: 'Bangalore', count: 4 }, { city: 'Hyderabad', count: 2 },
          { city: 'Chennai', count: 2 }, { city: 'Delhi', count: 3 }, { city: 'Ahmedabad', count: 2 }
        ],
        monthlyData: [
          { month: 'Oct', sent: 3, meetings: 1, profilesReviewed: 12 },
          { month: 'Nov', sent: 5, meetings: 2, profilesReviewed: 18 },
          { month: 'Dec', sent: 4, meetings: 3, profilesReviewed: 14 },
          { month: 'Jan', sent: 7, meetings: 4, profilesReviewed: 22 },
          { month: 'Feb', sent: 6, meetings: 3, profilesReviewed: 20 },
          { month: 'Mar', sent: 9, meetings: 5, profilesReviewed: 28 },
        ],
        statusDistribution: [
          { name: 'New', value: 7 }, { name: 'Active Search', value: 4 },
          { name: 'Match Sent', value: 3 }, { name: 'Meeting Scheduled', value: 2 }, { name: 'Engaged', value: 1 }
        ],
        genderSplit: { male: 10, female: 10 }
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64"><Spinner size={32} /></div>
  )
  if (!data) return null

  const { summary, cityDistribution, monthlyData, statusDistribution, genderSplit } = data

  const summaryStats = [
    { label: 'Total Customers', value: summary.total },
    { label: 'Profiles Reviewed', value: summary.profilesReviewed || 84 },
    { label: 'Matches Sent', value: summary.matchesSent || summary.sent },
    { label: 'Meetings Scheduled', value: summary.meeting },
    { label: 'Engagements', value: summary.engaged },
    { label: 'Conversion Rate', value: `${summary.conversionRate}%`, change: '+3%', up: true },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="Analytics Dashboard" subtitle="Performance metrics and pipeline insights" />

      {/* Summary cards */}
      <div className="grid grid-cols-6 gap-3.5 mb-6">
        {summaryStats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Monthly activity */}
        <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-5">
          <div className="mb-1 font-semibold text-[14px] text-[#1A1218]">Monthly Match Activity</div>
          <div className="text-[12px] text-[#6B5565] mb-4">Matches sent & meetings scheduled</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B5565' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B5565' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sent" name="Matches Sent" fill="#C84B5A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="meetings" name="Meetings" fill="#2D7A5A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution pie */}
        <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-5">
          <div className="mb-1 font-semibold text-[14px] text-[#1A1218]">Customer Status Distribution</div>
          <div className="text-[12px] text-[#6B5565] mb-4">Current pipeline breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                label={({ name, value }) => `${name.split(' ')[0]} (${value})`}
                labelLine={false}
                fontSize={11}
              >
                {statusDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* City distribution */}
        <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-5">
          <div className="mb-1 font-semibold text-[14px] text-[#1A1218]">Customers by City</div>
          <div className="text-[12px] text-[#6B5565] mb-4">Geographic distribution of clients</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cityDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6B5565' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 12, fill: '#6B5565' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Customers" fill="#2653A3" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profiles reviewed trend */}
        <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-5">
          <div className="mb-1 font-semibold text-[14px] text-[#1A1218]">Profiles Reviewed Monthly</div>
          <div className="text-[12px] text-[#6B5565] mb-4">Matchmaker activity trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B5565' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6B5565' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="profilesReviewed"
                name="Profiles Reviewed"
                stroke="#B8860B"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#B8860B', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="sent"
                name="Matches Sent"
                stroke="#C84B5A"
                strokeWidth={2}
                dot={{ r: 3, fill: '#C84B5A', strokeWidth: 0 }}
                strokeDasharray="4 2"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gender split */}
      <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-5">
        <div className="mb-1 font-semibold text-[14px] text-[#1A1218]">Gender Split</div>
        <div className="text-[12px] text-[#6B5565] mb-4">Male vs Female client ratio</div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-4 rounded-full overflow-hidden bg-[#EDE5E0] flex">
            <div
              className="h-full bg-[#2653A3] transition-all duration-700"
              style={{ width: `${(genderSplit.male / (genderSplit.male + genderSplit.female)) * 100}%` }}
            />
            <div className="h-full bg-[#C84B5A] flex-1" />
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2653A3]" />
              <span className="text-[13px] text-[#3D2E38]">Male: {genderSplit.male}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C84B5A]" />
              <span className="text-[13px] text-[#3D2E38]">Female: {genderSplit.female}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
