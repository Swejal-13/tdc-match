import { useNavigate } from 'react-router-dom'
import { Avatar, StatusBadge } from './ui'
import { ChevronUp, ChevronDown } from 'lucide-react'

export default function CustomerTable({ customers, sort, order, onSort }) {
  const navigate = useNavigate()

  const SortHeader = ({ field, label }) => (
    <th
      className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B5565] bg-[#F5F0EC] cursor-pointer select-none hover:text-[#1A1218] transition-colors whitespace-nowrap"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sort === field ? (
          order === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        ) : (
          <ChevronDown size={12} className="opacity-30" />
        )}
      </div>
    </th>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <SortHeader field="firstName" label="Customer" />
            <SortHeader field="age" label="Age" />
            <SortHeader field="city" label="City" />
            <SortHeader field="profession" label="Profession" />
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B5565] bg-[#F5F0EC]">Marital Status</th>
            <SortHeader field="status" label="Status" />
            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#6B5565] bg-[#F5F0EC]">Completion</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr
              key={c.id}
              onClick={() => navigate(`/customers/${c.id}`)}
              className="border-t border-black/[0.06] hover:bg-[#F5F0EC] cursor-pointer transition-colors group"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar firstName={c.firstName} lastName={c.lastName} colorIdx={c.colorIdx} size={36} />
                  <div>
                    <div className="text-[13.5px] font-medium text-[#1A1218] group-hover:text-[#C84B5A] transition-colors">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="text-[11.5px] text-[#6B5565]">{c.gender}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[13px] text-[#3D2E38]">{c.age}</td>
              <td className="px-4 py-3 text-[13px] text-[#3D2E38]">{c.city}</td>
              <td className="px-4 py-3 text-[13px] text-[#3D2E38]">{c.profession}</td>
              <td className="px-4 py-3 text-[13px] text-[#6B5565]">{c.maritalStatus}</td>
              <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-[#EDE5E0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${c.completion || 0}%`,
                        background: (c.completion || 0) >= 80 ? '#2D7A5A' : (c.completion || 0) >= 50 ? '#B8860B' : '#C84B5A'
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-[#6B5565]">{c.completion || 0}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
