import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) { setError('Please enter both username and password.'); return }
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Try matchmaker / password123')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1218] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#C84B5A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[400px]">
        {/* Card */}
        <div className="bg-[#FDFAF8] rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1A1218] to-[#3D1525] px-8 pt-8 pb-7">
            <div className="flex items-center gap-2.5 mb-1.5">
              <Heart size={20} className="text-[#E8B4BC]" fill="#E8B4BC" />
              <span className="font-serif text-[26px] text-white tracking-tight">TDC Matchmaker</span>
            </div>
            <p className="text-[13px] text-white/50 ml-8">Premium Matchmaking CRM</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8">
            <h2 className="font-serif text-[20px] text-[#1A1218] mb-1.5">Sign In</h2>
            <p className="text-[13px] text-[#6B5565] mb-6">Access your matchmaking dashboard</p>

            <div className="mb-4">
              <label className="block text-[12px] font-semibold text-[#3D2E38] tracking-wide uppercase mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="matchmaker"
                className="w-full px-4 py-2.5 border-[1.5px] border-[#3D2E38]/16 rounded-lg text-[14px] font-sans bg-[#F5F0EC] text-[#1A1218] outline-none focus:border-[#C84B5A] focus:ring-2 focus:ring-[#C84B5A]/10 transition-all"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold text-[#3D2E38] tracking-wide uppercase mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-2.5 border-[1.5px] border-[#3D2E38]/16 rounded-lg text-[14px] font-sans bg-[#F5F0EC] text-[#1A1218] outline-none focus:border-[#C84B5A] focus:ring-2 focus:ring-[#C84B5A]/10 transition-all"
              />
            </div>

            {error && (
              <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C84B5A] hover:bg-[#b04050] disabled:bg-[#C84B5A]/60 text-white rounded-lg py-3 text-[15px] font-semibold font-sans transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
              ) : 'Sign In →'}
            </button>

            <div className="mt-5 p-3 bg-[#F5F0EC] rounded-lg">
              <p className="text-[11.5px] text-[#6B5565] text-center">
                Demo credentials: <span className="font-semibold text-[#3D2E38]">matchmaker</span> / <span className="font-semibold text-[#3D2E38]">password123</span>
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-[12px] text-white/30 mt-5">
          © 2025 TDC Matchmaker · Premium CRM Platform
        </p>
      </div>
    </div>
  )
}
