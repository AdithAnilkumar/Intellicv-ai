import { motion } from 'framer-motion'

const navItems = [
  { id: 'chat', icon: '💬', label: 'Resume Chat' },
  { id: 'ats', icon: '📊', label: 'ATS Analysis' },
  { id: 'questions', icon: '❓', label: 'Interview Qs' },
  { id: 'skills', icon: '🎯', label: 'Skill Gap' },
  { id: 'insights', icon: '👁️', label: 'Recruiter View' },
]

export default function Sidebar({ activeTab, setActiveTab, parsedData, onBack }) {
  return (
    <div className="w-52 glass border-r border-white/10 flex flex-col p-3 gap-1 shadow-xl relative z-10">
      {/* Logo */}
      <div className="mb-4 px-2 pt-2">
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 font-bold text-lg drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          IntelliCV AI
        </div>
        <div className="text-gray-500 text-xs font-mono">v2.0</div>
      </div>

      {/* Candidate Info */}
      {parsedData && (
        <div className="glass rounded-xl p-3 mb-3 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/50">
              {parsedData.name?.[0] || 'R'}
            </div>
            <div>
              <div className="text-white text-xs font-semibold truncate w-28">
                {parsedData.name || 'Candidate'}
              </div>
              <div className="text-gray-500 text-xs truncate w-28">
                {parsedData.email || ''}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <div className="text-gray-600 text-xs uppercase tracking-widest px-2 mb-1">
        Navigation
      </div>
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ x: 2 }}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left
            ${activeTab === item.id
              ? 'glass text-blue-400 shadow-lg shadow-blue-500/20'
              : 'text-gray-400 hover:glass hover:text-white'
            }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </motion.button>
      ))}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="mt-auto flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white hover:glass transition-all"
      >
        ← Back
      </button>
    </div>
  )
}