import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function InsightsPanel({ sessionId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://127.0.0.1:8000/recruiter-insights', {
        session_id: sessionId,
        target_role: 'Software Engineer',
      })
      const raw = res.data.insights
      const clean = raw.replace(/```json|```/g, '').trim()
      setData(JSON.parse(clean))
    } catch {
      setError('Failed to generate insights. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Recruiter Insights</h2>
          <p className="text-gray-500 text-xs">AI-powered recruiter intelligence report</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl px-5 py-2 text-white text-sm font-medium hover:opacity-85 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!data && !loading && (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4">👁️</div>
          <p>Click "Generate Report" for recruiter insights</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Generating recruiter report...</p>
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Experience Level', value: data.experience_level },
              { label: 'Technical Depth', value: data.technical_depth },
              { label: 'Recommendation', value: data.hiring_recommendation?.slice(0, 20) },
            ].map((item) => (
              <div key={item.label} className="glass rounded-xl p-3 text-center shadow-lg">
                <div className="text-gray-500 text-xs mb-1">{item.label}</div>
                <div className="text-cyan-400 text-sm font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass rounded-2xl p-4 shadow-lg">
            <h3 className="text-white text-sm font-semibold mb-2">📝 Professional Summary</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{data.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 shadow-lg border border-green-500/20">
              <h3 className="text-green-400 text-sm font-semibold mb-3">💪 Strengths</h3>
              {data.strengths?.map((s, i) => (
                <div key={i} className="text-xs text-gray-400 glass-subtle rounded-lg p-2 mb-1.5 shadow-sm">• {s}</div>
              ))}
            </div>
            <div className="glass rounded-2xl p-4 shadow-lg border border-orange-500/20">
              <h3 className="text-orange-400 text-sm font-semibold mb-3">⚠️ Weaknesses</h3>
              {data.weaknesses?.map((w, i) => (
                <div key={i} className="text-xs text-gray-400 glass-subtle rounded-lg p-2 mb-1.5 shadow-sm">• {w}</div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 shadow-lg">
            <h3 className="text-white text-sm font-semibold mb-3">🎯 Suitable Roles</h3>
            <div className="flex flex-wrap gap-2">
              {data.suitable_roles?.map((r) => (
                <span key={r} className="text-xs px-3 py-1 glass text-blue-400 rounded-full shadow-md">{r}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}