import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { customerService } from '../services/customerService'
import {
  Avatar, StatusBadge, InfoRow, SectionTitle, ProfileCompletion,
  Button, Spinner, Card, ScoreBar
} from '../components/ui'
import AIAssistantPanel from '../components/AIAssistantPanel'
import JourneyTimeline from '../components/JourneyTimeline'
import NotesPanel from '../components/NotesPanel'
import MatchCard from '../components/MatchCard'
import SendMatchModal from '../components/SendMatchModal'
import { parseJsonField, formatCurrency } from '../utils/helpers'
import { ArrowLeft, Sparkles, Users } from 'lucide-react'

export default function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [matches, setMatches] = useState([])
  const [lastMatchSentAt, setLastMatchSentAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [view, setView] = useState('profile') // 'profile' | 'matches'
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    setLoading(true)
    try {
      const [custRes, historyRes] = await Promise.allSettled([
        customerService.getById(id),
        import('../services/customerService').then(m => m.matchService.getHistory(id)),
      ])
      if (custRes.status === 'fulfilled') setCustomer(custRes.value.data)
      else navigate('/customers')
      if (historyRes.status === 'fulfilled' && historyRes.value.data?.length > 0) {
        setLastMatchSentAt(historyRes.value.data[0].sentAt)
      }
    } catch {
      navigate('/customers')
    } finally {
      setLoading(false)
    }
  }

  const fetchMatches = async () => {
    if (matches.length > 0) { setView('matches'); return }
    setLoadingMatches(true)
    try {
      const res = await customerService.getMatches(id)
      setMatches(res.data)
      setView('matches')
    } catch {
      setMatches([])
    } finally {
      setLoadingMatches(false)
    }
  }

  const handleSend = (match) => {
    setSelectedMatch(match)
    setModalOpen(true)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64"><Spinner size={32} /></div>
  )
  if (!customer) return null

  const c = customer
  const hobbies = parseJsonField(c.hobbies)
  const languages = parseJsonField(c.languages)

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-5">
        <Button variant="secondary" size="sm" onClick={() => navigate('/customers')}>
          <ArrowLeft size={14} /> Back
        </Button>
        <div className="flex-1">
          <h1 className="font-serif text-2xl text-[#1A1218]">{c.firstName} {c.lastName}</h1>
          <p className="text-[13px] text-[#6B5565]">{c.profession} · {c.city}</p>
        </div>
        <StatusBadge status={c.status} />
        <Button
          variant={view === 'matches' ? 'secondary' : 'primary'}
          onClick={view === 'matches' ? () => setView('profile') : fetchMatches}
          disabled={loadingMatches}
        >
          {loadingMatches ? <Spinner size={14} /> : view === 'matches' ? <><ArrowLeft size={14} /> Profile</> : <><Sparkles size={14} /> View Matches</>}
        </Button>
      </div>

      {view === 'profile' ? (
        <div className="grid grid-cols-[300px_1fr] gap-5">
          {/* LEFT: Profile card */}
          <div className="flex flex-col gap-4">
            <Card>
              {/* Header */}
              <div className="bg-gradient-to-br from-[#1A1218] to-[#3D1525] px-6 py-6 text-center rounded-t-xl">
                <Avatar firstName={c.firstName} lastName={c.lastName} colorIdx={c.colorIdx} size={76} />
                <div className="font-serif text-[18px] text-white mt-3">{c.firstName} {c.lastName}</div>
                <div className="text-[12.5px] text-white/60 mt-1">{c.age} yrs · {c.city} · {c.gender}</div>
                <div className="mt-4 px-2">
                  <ProfileCompletion pct={c.completion || 0} />
                </div>
              </div>

              {/* Personal */}
              <div className="px-5 py-4 border-b border-black/[0.06]">
                <SectionTitle>Personal</SectionTitle>
                <InfoRow label="Full Name" value={`${c.firstName} ${c.lastName}`} />
                <InfoRow label="Date of Birth" value={c.dateOfBirth} />
                <InfoRow label="Height" value={c.height ? `${c.height} cm` : null} />
                <InfoRow label="Mother Tongue" value={c.motherTongue} />
                <InfoRow label="Languages" value={languages.join(', ')} />
              </div>

              {/* Contact */}
              <div className="px-5 py-4 border-b border-black/[0.06]">
                <SectionTitle>Contact</SectionTitle>
                <InfoRow label="Email" value={c.email} />
                <InfoRow label="Phone" value={c.phone} />
              </div>

              {/* Career */}
              <div className="px-5 py-4 border-b border-black/[0.06]">
                <SectionTitle>Career & Education</SectionTitle>
                <InfoRow label="Profession" value={c.profession} />
                <InfoRow label="Company" value={c.company} />
                <InfoRow label="Designation" value={c.designation} />
                <InfoRow label="Income" value={formatCurrency(c.income)} />
                <InfoRow label="College" value={c.college} />
                <InfoRow label="Degree" value={c.degree} />
              </div>

              {/* Family */}
              <div className="px-5 py-4 border-b border-black/[0.06]">
                <SectionTitle>Family & Religion</SectionTitle>
                <InfoRow label="Marital Status" value={c.maritalStatus} />
                <InfoRow label="Religion" value={c.religion} />
                <InfoRow label="Caste" value={c.caste} />
                <InfoRow label="Family Type" value={c.familyType} />
                <InfoRow label="Family Values" value={c.familyValues} />
                <InfoRow label="Siblings" value={c.siblings} />
              </div>

              {/* Lifestyle */}
              <div className="px-5 py-4 border-b border-black/[0.06]">
                <SectionTitle>Lifestyle & Personality</SectionTitle>
                <InfoRow label="Diet" value={c.diet} />
                <InfoRow label="Smoking" value={c.smoking} />
                <InfoRow label="Drinking" value={c.drinking} />
                <InfoRow label="Horoscope" value={c.horoscope} />
                <InfoRow label="Manglik" value={c.manglik} />
                <InfoRow label="Lifestyle" value={c.lifestyle} />
                <InfoRow label="Personality" value={c.personality} />
                {hobbies.length > 0 && (
                  <div className="py-1.5">
                    <span className="text-[13px] text-[#6B5565]">Hobbies</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {hobbies.map(h => (
                        <span key={h} className="px-2.5 py-0.5 bg-[#F5F0EC] rounded-full text-[12px] text-[#3D2E38]">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences */}
              <div className="px-5 py-4">
                <SectionTitle>Partner Preferences</SectionTitle>
                <InfoRow label="Age Range" value={c.prefAgeMin && c.prefAgeMax ? `${c.prefAgeMin}–${c.prefAgeMax} yrs` : null} />
                <InfoRow label="Preferred City" value={c.prefCity} />
                <InfoRow label="Religion" value={c.prefReligion} />
                <InfoRow label="Caste" value={c.prefCaste} />
                <InfoRow label="Education" value={c.prefEducation} />
                <InfoRow label="Income Min" value={c.prefIncomeMin ? `₹${c.prefIncomeMin}L+` : null} />
                <InfoRow label="Wants Kids" value={c.wantsKids} />
                <InfoRow label="Open to Relocate" value={c.openToRelocate} />
                <InfoRow label="Open to Pets" value={c.openToPets} />
              </div>
            </Card>
          </div>

          {/* RIGHT: Journey + AI + Notes */}
          <div className="flex flex-col gap-4">
            <JourneyTimeline journeyStep={c.journeyStep || 0} customer={c} lastMatchSentAt={lastMatchSentAt} />
            <AIAssistantPanel customer={c} />
            <NotesPanel customerId={c.id} />
          </div>
        </div>
      ) : (
        /* MATCHES VIEW */
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-xl text-[#1A1218]">Top 10 Matches for {c.firstName}</h2>
              <p className="text-[13px] text-[#6B5565] mt-0.5">Powered by TDC Compatibility Engine · AI-scored</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#6B5565]">
              <Users size={14} />
              {matches.length} matches found
            </div>
          </div>
          {matches.length === 0 ? (
            <div className="text-center py-16 text-[#6B5565]">No matches found</div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {matches.map(m => (
                <MatchCard key={m.id} match={m} onSend={handleSend} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Send Match Modal */}
      <SendMatchModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedMatch(null) }}
        customer={c}
        match={selectedMatch}
      />
    </div>
  )
}
