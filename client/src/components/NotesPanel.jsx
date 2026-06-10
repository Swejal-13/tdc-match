import { useState, useEffect } from 'react'
import { noteService } from '../services/customerService'
import { useToast } from '../context/ToastContext'
import { Button, Textarea, Spinner } from './ui'
import { Pencil, Trash2, Plus } from 'lucide-react'

const NOTE_TYPES = ['Consultation', 'Shortlisting', 'Family Meeting', 'Follow-up', 'Profile Review', 'Meeting', 'Note']

export default function NotesPanel({ customerId }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newText, setNewText] = useState('')
  const [newType, setNewType] = useState('Note')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetchNotes()
  }, [customerId])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const res = await noteService.getAll(customerId)
      setNotes(res.data)
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newText.trim()) return
    setSaving(true)
    try {
      const res = await noteService.create({ customerId, text: newText, type: newType })
      setNotes([res.data, ...notes])
      setNewText('')
      addToast('Note added')
    } catch {
      addToast('Failed to add note', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (id) => {
    try {
      const res = await noteService.update(id, { text: editText })
      setNotes(notes.map(n => n.id === id ? res.data : n))
      setEditId(null)
      addToast('Note updated')
    } catch {
      addToast('Failed to update note', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await noteService.delete(id)
      setNotes(notes.filter(n => n.id !== id))
      addToast('Note deleted')
    } catch {
      addToast('Failed to delete note', 'error')
    }
  }

  const typeColors = {
    'Consultation': 'bg-blue-50 text-blue-700',
    'Shortlisting': 'bg-emerald-50 text-emerald-700',
    'Family Meeting': 'bg-purple-50 text-purple-700',
    'Follow-up': 'bg-amber-50 text-amber-700',
    'Profile Review': 'bg-indigo-50 text-indigo-700',
    'Meeting': 'bg-rose-50 text-rose-700',
    'Note': 'bg-gray-100 text-gray-700',
  }

  return (
    <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-black/[0.08]">
        <h3 className="font-semibold text-[14px] text-[#1A1218]">Matchmaker Notes</h3>
      </div>

      {/* Add note */}
      <div className="p-4 border-b border-black/[0.06]">
        <div className="flex gap-2 mb-2">
          <select
            value={newType}
            onChange={e => setNewType(e.target.value)}
            className="px-2.5 py-1.5 border border-[#3D2E38]/16 rounded-lg text-[12px] bg-[#F5F0EC] text-[#3D2E38] outline-none"
          >
            {NOTE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <Textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Add a matchmaker note…"
          rows={3}
        />
        <Button
          variant="primary"
          size="sm"
          className="mt-2 w-full justify-center"
          onClick={handleAdd}
          disabled={saving || !newText.trim()}
        >
          {saving ? <Spinner size={13} /> : <Plus size={13} />}
          Add Note
        </Button>
      </div>

      {/* Notes list */}
      <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : notes.length === 0 ? (
          <p className="text-center text-[13px] text-[#6B5565] py-6">No notes yet. Add the first one above.</p>
        ) : notes.map(n => (
          <div key={n.id} className="bg-[#F5F0EC] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full ${typeColors[n.type] || typeColors['Note']}`}>
                {n.type}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#6B5565]">
                  {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <button onClick={() => { setEditId(n.id); setEditText(n.text) }} className="text-[#6B5565] hover:text-[#C84B5A] transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => handleDelete(n.id)} className="text-[#6B5565] hover:text-red-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {editId === n.id ? (
              <div>
                <Textarea value={editText} onChange={e => setEditText(e.target.value)} rows={3} />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="primary" onClick={() => handleEdit(n.id)}>Save</Button>
                  <Button size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-[#3D2E38] leading-relaxed">{n.text}</p>
            )}

            <div className="text-[11px] text-[#6B5565] mt-2 italic">
              — {n.user?.name || 'Matchmaker'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
