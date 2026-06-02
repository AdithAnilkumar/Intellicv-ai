import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const categories = [
  { key: 'hr_questions', label: 'HR Questions', color: 'blue', icon: '🧑‍💼' },
  { key: 'technical_questions', label: 'Technical', color: 'cyan', icon: '💻' },
  { key: 'project_questions', label: 'Project-Based', color: 'green', icon: '📁' },
  { key: 'viva_questions', label: 'Viva', color: 'orange', icon: '🎓' },
]

export default function QuestionsPanel({ sessionId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://127.0.0.1:8000/generate-questions', {
        session_id: sessionId,
      })
      const raw = res.data.questions
      const clean = raw.replace(/```json|```/g, '').trim()
      setData(JSON.parse(clean))
    } catch {
      setError('Failed to generate questions. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold text-lg">Interview Questions</h2>
          <p className="text-gray-500 text-xs">AI-generated based on your resume</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl px-5 py-2 text-white text-sm font-medium hover:opacity-85 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {!data && !loading && (
        <div className="text-center py-20 text-gray-600">
          <div className="text-5xl mb-4">❓</div>
          <p>Click "Generate Questions" to get interview questions</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Generating questions from resume...</p>
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          {categories.map((cat) => (
            <div key={cat.key} className="glass rounded-2xl p-4 shadow-lg">
              <h3 className="text-sm font-semibold mb-3 text-white">
                {cat.icon} {cat.label}
              </h3>
              <div className="flex flex-col gap-2">
                {data[cat.key]?.map((q, i) => (
                  <div key={i} className="text-xs text-gray-400 glass-subtle rounded-xl p-3 leading-relaxed shadow-sm">
                    <span className="text-blue-400 font-mono mr-2">Q{i + 1}.</span>{q}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}