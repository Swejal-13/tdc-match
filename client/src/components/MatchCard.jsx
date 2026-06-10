import { Avatar, ScoreBar, Button } from './ui'
import { MapPin, Briefcase, GraduationCap, IndianRupee } from 'lucide-react'

export default function MatchCard({ match, onSend }) {
  return (
    <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Header */}
      <div className="p-4 pb-3 flex items-center gap-3 border-b border-black/[0.06]">
        <Avatar firstName={match.firstName} lastName={match.lastName} colorIdx={match.colorIdx} size={44} />
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-[#1A1218] truncate">
            {match.firstName} {match.lastName}
          </div>
          <div className="text-[12px] text-[#6B5565]">{match.age} yrs · {match.gender}</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1">
        <div className="mb-3">
          <ScoreBar score={match.score} />
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-[12px] text-[#6B5565]">
            <MapPin size={12} className="flex-shrink-0" />
            <span>{match.city}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#6B5565]">
            <Briefcase size={12} className="flex-shrink-0" />
            <span>{match.profession}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#6B5565]">
            <GraduationCap size={12} className="flex-shrink-0" />
            <span className="truncate">{match.college}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#6B5565]">
            <IndianRupee size={12} className="flex-shrink-0" />
            <span>₹{match.income}L p.a.</span>
          </div>
        </div>

        {/* AI Snippet */}
        {match.reasons && match.reasons.length > 0 && (
          <div className="bg-[#FDF8E8] border border-[#E8D48A]/50 rounded-lg px-3 py-2 text-[11.5px] text-[#3D2E38] italic leading-relaxed">
            {match.reasons[0]}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <Button variant="primary" className="w-full justify-center" onClick={() => onSend(match)}>
          💫 Send Match
        </Button>
      </div>
    </div>
  )
}
