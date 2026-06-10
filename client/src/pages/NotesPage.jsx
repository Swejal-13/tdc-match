import { useState, useEffect } from 'react'
import { noteService, customerService } from '../services/customerService'
import { useToast } from '../context/ToastContext'
import { Avatar, PageHeader, Button, Textarea, Spinner, EmptyState, Select } from '../components/ui'
import { Pencil, Trash2, Plus, StickyNote } from 'lucide-react'

const NOTE_TYPES = ['Note', 'Consultation', 'Shortlisting', 'Family Meeting', 'Follow-up', 'Profile Review', 'Meeting']

const TYPE_STYLES = {
  'Consultation': 'bg-blue-50 text-blue-700',
  'Shortlisting': 'bg-emerald-50 text-emerald-700',
  'Family Meeting': 'bg-purple-50 text-purple-700',
  'Follow-up': 'bg-amber-50 text-amber-700',
  'Profile Review': 'bg-indigo-50 text-indigo-700',
  'Meeting': 'bg-rose-50 text-rose-700',
  'Note': 'bg-gray-100 text-gray-700',
}

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newText, setNewText] = useState('')
  const [newType, setNewType] = useState('Note')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    Promise.all([fetchNotes(), fetchCustomers()])
  }, [])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const res = await noteService.getAll()
      setNotes(res.data)
    } catch { setNotes([]) }
    finally { setLoading(false) }
  }

  const fetchCustomers = async () => {
    try {
      const res = await customerService.getAll({ limit: 100 })
      setCustomers(res.data.customers || [])
      if (res.data.customers?.length > 0) setSelectedCustomerId(res.data.customers[0].id)
    } catch { setCustomers([]) }
  }

  const handleAdd = async () => {
    if (!newText.trim() || !selectedCustomerId) return
    setSaving(true)
    try {
      const res = await noteService.create({ customerId: selectedCustomerId, text: newText, type: newType })
      setNotes([res.data, ...notes])
      setNewText('')
      addToast('Note added successfully')
    } catch { addToast('Failed to add note', 'error') }
    finally { setSaving(false) }
  }

  const handleEdit = async (id) => {
    try {
      const res = await noteService.update(id, { text: editText })
      setNotes(notes.map(n => n.id === id ? { ...n, ...res.data } : n))
      setEditId(null)
      addToast('Note updated')
    } catch { addToast('Failed to update', 'error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return
    try {
      await noteService.delete(id)
      setNotes(notes.filter(n => n.id !== id))
      addToast('Note deleted')
    } catch { addToast('Failed to delete', 'error') }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Notes" subtitle="Matchmaker notes and consultation logs" />

      <div className="grid grid-cols-[360px_1fr] gap-5">
        {/* Add Note panel */}
        <div>
          <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <StickyNote size={16} className="text-[#C84B5A]" />
              <h3 className="font-semibold text-[14px] text-[#1A1218]">Add New Note</h3>
            </div>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-wide text-[#6B5565] font-semibold mb-1.5">Customer</label>
              <select
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-[#3D2E38]/16 rounded-lg text-[13px] bg-[#F5F0EC] text-[#1A1218] outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-wide text-[#6B5565] font-semibold mb-1.5">Type</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value)}
                className="w-full px-3 py-2 border border-[#3D2E38]/16 rounded-lg text-[13px] bg-[#F5F0EC] text-[#1A1218] outline-none"
              >
                {NOTE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-wide text-[#6B5565] font-semibold mb-1.5">Note</label>
              <Textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Write your matchmaker note here…"
                rows={5}
              />
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={handleAdd}
              disabled={saving || !newText.trim()}
            >
              {saving ? <Spinner size={14} /> : <Plus size={14} />}
              Add Note
            </Button>
          </div>
        </div>

        {/* Notes timeline */}
        <div>
          {loading ? (
            <div className="flex justify-center py-16"><Spinner size={28} /></div>
          ) : notes.length === 0 ? (
            <EmptyState icon="📝" title="No notes yet" subtitle="Add your first matchmaker note" />
          ) : (
            <div className="space-y-3">
              {notes.map(n => (
                <div key={n.id} className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {n.customer && (
                        <Avatar
                          firstName={n.customer.firstName}
                          lastName={n.customer.lastName}
                          colorIdx={n.customer.colorIdx || 0}
                          size={30}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-medium text-[#1A1218]">
                            {n.customer?.firstName} {n.customer?.lastName}
                          </span>
                          <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium ${TYPE_STYLES[n.type] || TYPE_STYLES.Note}`}>
                            {n.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6B5565] mt-0.5">
                          {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => { setEditId(n.id); setEditText(n.text) }}
                        className="p-1.5 text-[#6B5565] hover:text-[#C84B5A] hover:bg-[#F9EEF0] rounded-md transition-all"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1.5 text-[#6B5565] hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 ml-9">
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
                    <p className="text-[11px] text-[#6B5565] mt-2 italic">— {n.user?.name || 'Matchmaker'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
