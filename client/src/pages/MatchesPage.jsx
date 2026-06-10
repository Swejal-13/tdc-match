import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { matchService } from '../services/customerService'
import { Avatar, StatusBadge, PageHeader, Spinner, EmptyState, Card } from '../components/ui'
import { getCompatibility } from '../utils/helpers'
import { ArrowRight } from 'lucide-react'

export default function MatchesPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const res = await matchService.getAll()
      setCustomers(res.data)
    } catch {
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Active Matches"
        subtitle="Customers currently in the active matchmaking pipeline"
      />

      <Card>
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : customers.length === 0 ? (
          <EmptyState icon="💫" title="No active matches" subtitle="Customers in Active Search or beyond will appear here" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Customer', 'Status', 'Profession', 'City', 'Journey Step', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B5565] bg-[#F5F0EC]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr
                    key={c.id}
                    className="border-t border-black/[0.06] hover:bg-[#F5F0EC] cursor-pointer transition-colors group"
                    onClick={() => navigate(`/customers/${c.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar firstName={c.firstName} lastName={c.lastName} colorIdx={c.colorIdx} size={36} />
                        <div>
                          <div className="text-[13.5px] font-medium text-[#1A1218] group-hover:text-[#C84B5A] transition-colors">
                            {c.firstName} {c.lastName}
                          </div>
                          <div className="text-[11.5px] text-[#6B5565]">{c.age} yrs · {c.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-[13px] text-[#3D2E38]">{c.profession}</td>
                    <td className="px-4 py-3 text-[13px] text-[#3D2E38]">{c.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[0,1,2,3,4,5].map(i => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-sm ${i <= (c.journeyStep || 0) ? 'bg-[#C84B5A]' : 'bg-[#EDE5E0]'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#6B5565]">Step {(c.journeyStep || 0) + 1}/6</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-[12px] text-[#C84B5A] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
