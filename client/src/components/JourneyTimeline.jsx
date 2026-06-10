import { JOURNEY_STEPS } from '../utils/helpers'

function fmt(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function JourneyTimeline({ journeyStep = 0, customer = {}, lastMatchSentAt = null }) {
  // Resolve a display date for each completed step
  function stepDate(idx) {
    if (idx === 0) return fmt(customer.createdAt)
    if (idx === 2) return fmt(lastMatchSentAt)
    if (idx >= 3) return fmt(customer.updatedAt)
    return null
  }

  return (
    <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-black/[0.08]">
        <h3 className="font-semibold text-[14px] text-[#1A1218]">Customer Journey</h3>
      </div>
      <div className="p-5 space-y-4">
        {JOURNEY_STEPS.map((step, idx) => {
          const done = idx <= journeyStep
          const current = idx === journeyStep
          const date = done ? stepDate(idx) : null
          return (
            <div key={step} className="flex items-start gap-3">
              {/* Dot */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 transition-all
                ${done
                  ? 'bg-[#2D7A5A] text-white shadow-sm'
                  : current
                    ? 'bg-[#C84B5A] text-white shadow-sm'
                    : 'bg-[#EDE5E0] border-2 border-dashed border-[#3D2E38]/20 text-[#6B5565]'
                }`}
              >
                {done ? '✓' : idx + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`text-[13.5px] font-medium ${done ? 'text-[#1A1218]' : 'text-[#6B5565]'}`}>
                  {step}
                </div>
                {done && date && (
                  <div className="text-[11.5px] text-[#6B5565] mt-0.5">{date}</div>
                )}
                {current && !done && (
                  <div className="text-[11.5px] text-[#C84B5A] mt-0.5 font-medium">In Progress</div>
                )}
              </div>

              {/* Connector line */}
              {idx < JOURNEY_STEPS.length - 1 && (
                <div className="absolute ml-3 mt-7 w-px h-4 bg-[#EDE5E0]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
