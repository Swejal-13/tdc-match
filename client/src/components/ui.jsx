import { getAvatarColor, getInitials, STATUS_STYLES, getCompatibility } from '../utils/helpers'

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ firstName = '', lastName = '', colorIdx = 0, size = 36 }) {
  const bg = getAvatarColor(colorIdx)
  const initials = getInitials(firstName, lastName)
  const fontSize = size * 0.35
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
      style={{ width: size, height: size, background: bg, fontSize }}
    >
      {initials}
    </div>
  )
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-medium ${cls}`}>
      {status}
    </span>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, change, up }) {
  return (
    <div className="bg-[#FDFAF8] border border-black/[0.08] rounded-xl p-4">
      <div className="text-[11px] uppercase tracking-wide text-[#6B5565] mb-2 font-medium">{label}</div>
      <div className="font-serif text-3xl text-[#1A1218] leading-none">{value}</div>
      {change && (
        <div className={`text-[11px] mt-1.5 font-medium ${up ? 'text-[#2D7A5A]' : 'text-[#C84B5A]'}`}>
          {change} this month
        </div>
      )}
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#FDFAF8] border border-black/[0.08] rounded-xl ${className}`}>
      {children}
    </div>
  )
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <div className="text-[10px] uppercase tracking-widest text-[#6B5565] font-semibold mb-3">
      {children}
    </div>
  )
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────
export function InfoRow({ label, value }) {
  if (!value && value !== 0 && value !== false) return null
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
  return (
    <div className="flex justify-between items-center py-1.5 text-[13px]">
      <span className="text-[#6B5565]">{label}</span>
      <span className="font-medium text-[#1A1218] text-right max-w-[58%] break-words">{display}</span>
    </div>
  )
}

// ─── ScoreBar ─────────────────────────────────────────────────────────────────
export function ScoreBar({ score }) {
  const compat = getCompatibility(score)
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11.5px] font-medium" style={{ color: compat.color }}>{compat.label}</span>
        <span className="text-[13px] font-semibold text-[#1A1218]">{score}%</span>
      </div>
      <div className="h-1 bg-[#EDE5E0] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full score-${compat.cls} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <div
      className="rounded-full border-2 border-[#E8B4BC] border-t-[#C84B5A] animate-spin-slow"
      style={{ width: size, height: size }}
    />
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-medium text-[#3D2E38] text-[15px] mb-1">{title}</div>
      {subtitle && <div className="text-[13px] text-[#6B5565]">{subtitle}</div>}
    </div>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-serif text-2xl text-[#1A1218]">{title}</h1>
        {subtitle && <p className="text-[13px] text-[#6B5565] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button' }) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'text-[12px] px-3 py-1.5',
    md: 'text-[13px] px-3.5 py-2',
    lg: 'text-[14px] px-5 py-2.5',
  }
  const variants = {
    primary: 'bg-[#C84B5A] text-white hover:bg-[#b04050]',
    secondary: 'bg-[#F5F0EC] border border-[#3D2E38]/16 text-[#3D2E38] hover:bg-[#EDE5E0]',
    ghost: 'text-[#6B5565] hover:bg-[#F5F0EC] hover:text-[#1A1218]',
    danger: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-[#FDFAF8] rounded-2xl shadow-2xl w-[520px] max-w-[95vw] max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 pt-6 pb-4 border-b border-black/[0.08]">
            <h3 className="font-serif text-xl text-[#1A1218]">{title}</h3>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="px-6 pb-5 flex justify-end gap-2.5 border-t border-black/[0.08] pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 border border-[#3D2E38]/16 rounded-lg text-[13px] font-sans bg-[#F5F0EC] text-[#1A1218] outline-none resize-none focus:border-[#C84B5A] focus:ring-2 focus:ring-[#C84B5A]/10 transition-all"
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options, placeholder, className = '' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`px-3 py-2 border border-[#3D2E38]/16 rounded-lg text-[13px] bg-[#F5F0EC] text-[#1A1218] outline-none cursor-pointer focus:border-[#C84B5A] transition-all ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  )
}

// ─── SearchInput ──────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 max-w-[280px] px-3 py-2 border border-[#3D2E38]/16 rounded-lg text-[13px] bg-[#F5F0EC] text-[#1A1218] outline-none focus:border-[#C84B5A] focus:ring-2 focus:ring-[#C84B5A]/10 transition-all"
    />
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 border-t border-black/[0.08]">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 rounded-md border border-[#3D2E38]/16 bg-[#FDFAF8] text-[13px] text-[#3D2E38] flex items-center justify-center hover:bg-[#F5F0EC] disabled:opacity-40 transition-all"
      >
        ‹
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-md text-[13px] font-medium transition-all
            ${p === page
              ? 'bg-[#C84B5A] text-white border-[#C84B5A]'
              : 'border border-[#3D2E38]/16 bg-[#FDFAF8] text-[#3D2E38] hover:bg-[#F5F0EC]'
            }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-md border border-[#3D2E38]/16 bg-[#FDFAF8] text-[13px] text-[#3D2E38] flex items-center justify-center hover:bg-[#F5F0EC] disabled:opacity-40 transition-all"
      >
        ›
      </button>
      <span className="ml-2 text-[12px] text-[#6B5565]">Page {page} of {totalPages}</span>
    </div>
  )
}

// ─── ProfileCompletion ────────────────────────────────────────────────────────
export function ProfileCompletion({ pct }) {
  const color = pct >= 80 ? '#2D7A5A' : pct >= 50 ? '#B8860B' : '#C84B5A'
  return (
    <div>
      <div className="flex justify-between text-[12px] text-white/60 mb-1.5">
        <span>Profile Completion</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
