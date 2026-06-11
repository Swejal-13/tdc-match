export const AVATAR_COLORS = [
  '#C84B5A', '#2653A3', '#2D7A5A', '#B8860B',
  '#7B4FB8', '#C06B2A', '#1A7A7A', '#8B3A6A',
]

export function getAvatarColor(idx = 0) {
  return AVATAR_COLORS[idx % AVATAR_COLORS.length]
}

export function getInitials(firstName = '', lastName = '') {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
}

export function getCompatibility(score) {
  if (score >= 90) return { label: 'Exceptional Match', color: '#2D7A5A', cls: 'exceptional' }
  if (score >= 80) return { label: 'High Potential', color: '#3B8BD4', cls: 'high' }
  if (score >= 70) return { label: 'Good Match', color: '#B8860B', cls: 'good' }
  if (score >= 60) return { label: 'Moderate Match', color: '#B06A12', cls: 'moderate' }
  return { label: 'Weak Match', color: '#C84B5A', cls: 'weak' }
}

export function formatCurrency(amount) {
  if (!amount) return '—'
  return `₹${amount}L p.a.`
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export function parseJsonField(field) {
  if (!field) return []
  if (Array.isArray(field)) return field
  try { return JSON.parse(field) } catch { return [] }
}

export const STATUS_STYLES = {
  'New': 'bg-blue-50 text-blue-700',
  'Active Search': 'bg-emerald-50 text-emerald-700',
  'Match Sent': 'bg-amber-50 text-amber-700',
  'Meeting Scheduled': 'bg-indigo-50 text-indigo-700',
  'Engaged': 'bg-rose-50 text-rose-700',
}

export const JOURNEY_STEPS = [
  'Profile Created',
  'Verified',
  'Active Search',
  'Match Sent',
  'Meeting Scheduled',
  'Engaged',
]

export const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Delhi', 'Ahmedabad']
export const STATUSES = ['New', 'Active Search', 'Match Sent', 'Meeting Scheduled', 'Engaged']
