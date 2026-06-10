import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { aiService } from '../services/customerService'
import { Spinner } from './ui'

const PROMPTS = [
  { label: '📋 Summarize this profile', question: 'Summarize this client profile for a matchmaker.' },
  { label: '💡 Why is this a strong match candidate?', question: 'Why would this client be a strong match candidate? What are their best qualities?' },
  { label: '⚠️ What concerns should I consider?', question: 'What concerns or red flags should a matchmaker consider for this client?' },
  { label: '🎯 Suggest ideal match characteristics', question: 'Based on this profile, what are the top 5 characteristics the ideal match should have?' },
]

export default function AIAssistantPanel({ customer }) {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [activePrompt, setActivePrompt] = useState('')

  const handlePrompt = async (prompt) => {
    setActivePrompt(prompt.label)
    setLoading(true)
    setResponse('')
    try {
      const res = await aiService.assistant({
        customerId: customer.id,
        question: prompt.question,
      })
      setResponse(res.data.answer)
    } catch {
      setResponse('AI assistant is currently unavailable. Please ensure your GEMINI_API_KEY is configured in the backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-black/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#B8860B]" />
          <span className="font-semibold text-[14px] text-[#1A1218]">AI Matchmaker Assistant</span>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FDF8E8] text-[#B8860B] border border-[#E8D48A] font-medium">
          Gemini Powered
        </span>
      </div>

      {/* Prompt Buttons */}
      <div className="p-4 flex flex-col gap-2">
        {PROMPTS.map(p => (
          <button
            key={p.label}
            onClick={() => handlePrompt(p)}
            className={`text-left px-3.5 py-2.5 rounded-lg text-[13px] font-sans border transition-all duration-150
              ${activePrompt === p.label && !loading
                ? 'bg-[#F9EEF0] border-[#E8B4BC] text-[#C84B5A]'
                : 'bg-[#F5F0EC] border-[#3D2E38]/10 text-[#1A1218] hover:bg-[#F9EEF0] hover:border-[#E8B4BC] hover:text-[#C84B5A]'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Response Area */}
      {(loading || response) && (
        <div className="px-5 pb-5 border-t border-black/[0.06] pt-4">
          {loading ? (
            <div className="flex items-center gap-2 text-[13px] text-[#6B5565] italic">
              <Spinner size={14} />
              Gemini is analysing the profile…
            </div>
          ) : (
            <p className="text-[13px] text-[#3D2E38] leading-[1.7] whitespace-pre-line">{response}</p>
          )}
        </div>
      )}
    </div>
  )
}
