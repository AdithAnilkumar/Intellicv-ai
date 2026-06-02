import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function ATSPanel({ sessionId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://127.0.0.1:8000/ats-analysis', {
        session_id: sessionId,
      })
      const raw = res.data.analysis
      const clean = raw.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      // Normalize score to a number
      parsed.score = Number(parsed.score) || 0
      setData(parsed)
    } catch (err) {
      console.error('ATS error:', err)
      setError('Failed to analyze. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = data
    ? data.score >= 75 ? 'from-green-400 to-emerald-400'
    : data.score >= 50 ? 'from-yellow-400 to-orange-400'
    : 'from-red-400 to-rose-400'
    : 'from-blue-500 to-cyan-400'

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">ATS Analysis</h2>
          <p className="text-gray-500 text-xs">AI-powered ATS score and suggestions</p>
        </div>
        <button
          onClick={analyze}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl px-5 py-2 text-white text-sm font-medium hover:opacity-85 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!data && !loading && (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4">📊</div>
          <p>Click "Run Analysis" to get your ATS score</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">AI is analyzing your resume...</p>
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Score Card */}
          <div className="glass rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-400 text-sm mb-1">ATS Compatibility Score</div>
                <div className={`text-7xl font-black bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent leading-none drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]`}>
                  {data.score}
                </div>
                <div className="text-gray-500 text-sm mt-1">out of 100</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
                  {data.score >= 75 ? '✅ Good' : data.score >= 50 ? '⚠️ Average' : '❌ Needs Work'}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {data.score >= 75 ? 'Resume is ATS-friendly' : data.score >= 50 ? 'Some improvements needed' : 'Major improvements needed'}
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full glass-subtle rounded-full h-3 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-3 rounded-full bg-gradient-to-r ${scoreColor} shadow-lg`}
              />
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4 shadow-lg border border-green-500/20">
              <h3 className="text-green-400 text-sm font-semibold mb-3">✅ Found Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {data.keyword_matches?.map((k) => (
                  <span key={k} className="text-xs px-2 py-1 glass text-green-400 rounded-lg shadow-md">{k}</span>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-4 shadow-lg border border-red-500/20">
              <h3 className="text-red-400 text-sm font-semibold mb-3">❌ Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {data.missing_keywords?.map((k) => (
                  <span key={k} className="text-xs px-2 py-1 glass text-red-400 rounded-lg shadow-md">{k}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass rounded-2xl p-4 shadow-lg">
            <h3 className="text-white text-sm font-semibold mb-3">💡 Improvement Suggestions</h3>
            <div className="flex flex-col gap-2">
              {data.suggestions?.map((s, i) => (
                <div key={i} className="flex gap-3 text-sm text-gray-400 glass-subtle rounded-xl p-3 shadow-sm">
                  <span className="text-yellow-400 flex-shrink-0">→</span>{s}
                </div>
              ))}
            </div>
          </div>

          {/* Action verbs & Strengths */}
          {(data.action_verbs?.length > 0 || data.strengths?.length > 0) && (
            <div className="grid grid-cols-2 gap-4">
              {data.action_verbs?.length > 0 && (
                <div className="glass rounded-2xl p-4 shadow-lg">
                  <h3 className="text-blue-400 text-sm font-semibold mb-3">⚡ Action Verbs</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.action_verbs.map((v) => (
                      <span key={v} className="text-xs px-2 py-1 glass text-blue-400 rounded-lg shadow-md">{v}</span>
                    ))}
                  </div>
                </div>
              )}
              {data.strengths?.length > 0 && (
                <div className="glass rounded-2xl p-4 shadow-lg">
                  <h3 className="text-cyan-400 text-sm font-semibold mb-3">💪 Strengths</h3>
                  <div className="flex flex-col gap-1.5">
                    {data.strengths.map((s, i) => (
                      <div key={i} className="text-xs text-gray-400 glass-subtle rounded-lg p-2 shadow-sm">• {s}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}