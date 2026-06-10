import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, Heart, FileText, BarChart2, LogOut, Sparkles
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/matches', icon: Heart, label: 'Matches' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F0EC]">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 bg-[#1A1218] flex flex-col overflow-y-auto">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/8">
          <div className="font-serif text-[22px] text-white tracking-tight">TDC</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Matchmaker CRM</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-5 pb-4">
          <div className="text-[10px] uppercase tracking-widest text-white/30 px-2 mb-3">Main Menu</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 text-[13.5px] transition-all duration-150
                ${isActive
                  ? 'bg-[#C84B5A] text-white'
                  : 'text-white/60 hover:bg-white/7 hover:text-white'}`
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* AI Badge */}
        <div className="mx-3 mb-3 px-3 py-2.5 rounded-lg bg-[#B8860B]/15 border border-[#E8D48A]/20">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-[#E8D48A]" />
            <span className="text-[11px] text-[#E8D48A] font-medium">Gemini AI Active</span>
          </div>
          <div className="text-[10px] text-white/30 mt-0.5 pl-5">AI Matchmaking Enabled</div>
        </div>

        {/* User */}
        <div className="border-t border-white/8 px-4 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C84B5A] flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
            {user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'SJ'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-white font-medium truncate">{user?.name || 'Matchmaker'}</div>
            <div className="text-[11px] text-white/40 capitalize">{user?.role?.replace('_', ' ') || 'Matchmaker'}</div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-white/70 transition-colors p-1"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
