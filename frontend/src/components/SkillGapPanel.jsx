import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const roles = ['Software Engineer', 'ML Engineer', 'Data Analyst', 'DevOps Engineer', 'Full Stack Developer']

export default function SkillGapPanel({ sessionId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('Software Engineer')
  const [error, setError] = useState('')

  const analyze = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://127.0.0.1:8000/skill-gap', {
        session_id: sessionId,
        target_role: role,
      })
      const raw = res.data.gap_analysis
      const clean = raw.replace(/```json|```/g, '').trim()
      setData(JSON.parse(clean))
    } catch {
      setError('Failed to analyze. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-lg">Skill Gap Analysis</h2>
        <p className="text-gray-500 text-xs">Compare resume skills against target role</p>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex-1 glass rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-blue-400/50 shadow-inner"
        >
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
        <button
          onClick={analyze}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl px-5 py-2.5 text-white text-sm font-medium hover:opacity-85 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!data && !loading && (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4">🎯</div>
          <p>Select a role and click Analyze</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Analyzing skill gap...</p>
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Readiness */}
          <div className="glass rounded-2xl p-5 text-center shadow-xl">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-1 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              {data.readiness_percentage}%
            </div>
            <div className="text-gray-400 text-sm">Ready for {role}</div>
            <div className="w-full glass-subtle rounded-full h-2 mt-3 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.readiness_percentage}%` }}
                transition={{ duration: 1 }}
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 shadow-lg border border-green-500/20">
              <h3 className="text-green-400 text-sm font-semibold mb-3">✅ Matching Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.matching_skills?.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 glass text-green-400 rounded-lg shadow-md">{s}</span>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-4 shadow-lg border border-red-500/20">
              <h3 className="text-red-400 text-sm font-semibold mb-3">❌ Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.missing_skills?.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 glass text-red-400 rounded-lg shadow-md">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 shadow-lg">
            <h3 className="text-white text-sm font-semibold mb-3">💡 Recommendations</h3>
            {data.recommendations?.map((r, i) => (
              <div key={i} className="flex gap-3 text-sm text-gray-400 glass-subtle rounded-xl p-3 mb-2 shadow-sm">
                <span className="text-cyan-400">→</span>{r}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}