import { useState, useEffect } from 'react'
import { Modal, Avatar, ScoreBar, Button, Spinner } from './ui'
import { aiService, matchService } from '../services/customerService'
import { useToast } from '../context/ToastContext'
import { Sparkles } from 'lucide-react'

export default function SendMatchModal({ open, onClose, customer, match }) {
  const [introMessage, setIntroMessage] = useState('')
  const [loadingIntro, setLoadingIntro] = useState(false)
  const [sending, setSending] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    if (open && customer && match) {
      generateIntro()
    }
  }, [open, match])

  const generateIntro = async () => {
    setLoadingIntro(true)
    try {
      const res = await aiService.generateIntro({
        customerId: customer.id,
        matchId: match.id,
        score: match.score,
      })
      setIntroMessage(res.data.message)
    } catch {
      setIntroMessage(
        `Hi ${customer.firstName}, we'd like to introduce ${match.firstName}, a ${match.profession} from ${match.city} who shares your ${customer.familyValues?.toLowerCase() || 'family'} values and vision for the future. We believe this could be a meaningful connection worth exploring.`
      )
    } finally {
      setLoadingIntro(false)
    }
  }

  const handleSend = async () => {
    setSending(true)
    try {
      await matchService.sendMatch({
        customerId: customer.id,
        matchId: match.id,
        score: match.score,
        compatibilityLevel: match.compatibilityLevel,
        reasons: match.reasons || [],
        introMessage,
      })
      addToast('Match sent successfully! 💫')
      onClose()
    } catch {
      addToast('Failed to send match. Please try again.', 'error')
    } finally {
      setSending(false)
    }
  }

  if (!match || !customer) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Send Match Introduction"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSend} disabled={sending}>
            {sending ? <Spinner size={14} /> : '✓'} Send Match
          </Button>
        </>
      }
    >
      {/* Match profile preview */}
      <div className="flex items-center gap-3 p-4 bg-[#F5F0EC] rounded-xl mb-5">
        <Avatar firstName={match.firstName} lastName={match.lastName} colorIdx={match.colorIdx} size={48} />
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-[#1A1218]">
            {match.firstName} {match.lastName}
          </div>
          <div className="text-[12px] text-[#6B5565] mt-0.5">
            {match.age} · {match.profession} · {match.city}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[20px] font-serif font-bold text-[#C84B5A]">{match.score}%</div>
          <div className="text-[11px] text-[#6B5565]">match score</div>
        </div>
      </div>

      <div className="mb-4">
        <ScoreBar score={match.score} />
      </div>

      {/* AI Intro */}
      <div className="bg-[#FDF8E8] border border-[#E8D48A]/60 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={13} className="text-[#B8860B]" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#B8860B]">
            AI Introduction Message
          </span>
        </div>
        {loadingIntro ? (
          <div className="flex items-center gap-2 text-[13px] text-[#6B5565] italic">
            <Spinner size={14} /> Gemini is writing the introduction…
          </div>
        ) : (
          <textarea
            value={introMessage}
            onChange={e => setIntroMessage(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-[13px] text-[#3D2E38] leading-relaxed resize-none outline-none font-sans"
          />
        )}
      </div>

      <button
        onClick={generateIntro}
        className="mt-2 text-[12px] text-[#B8860B] hover:text-[#96700A] transition-colors flex items-center gap-1"
      >
        <Sparkles size={11} /> Regenerate with AI
      </button>
    </Modal>
  )
}
