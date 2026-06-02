import { useState, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import ATSPanel from './ATSPanel'
import QuestionsPanel from './QuestionsPanel'
import SkillGapPanel from './SkillGapPanel'
import InsightsPanel from './InsightsPanel'

const suggestions = [
  'What are the main skills?',
  'Summarize the experience',
  'What projects are mentioned?',
  'Educational background?',
  'Any certifications?',
]

// Simple markdown renderer
function renderMarkdown(text) {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  text = text.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 text-xs font-mono">$1</code>')
  text = text.replace(/^[-•]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
  text = text.replace(/\n/g, '<br/>')
  return text
}

const MessageBubble = memo(function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold
        ${msg.role === 'ai'
          ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/50'
          : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/50'
        }`}>
        {msg.role === 'ai' ? 'AI' : 'R'}
      </div>

      <div className="flex flex-col gap-1 max-w-lg">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg
            ${msg.role === 'ai'
              ? 'glass text-gray-200 rounded-tl-sm'
              : 'glass-strong text-white rounded-tr-sm shadow-blue-500/20'
            }`}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
        />

        {msg.role === 'ai' && (
          <button
            onClick={handleCopy}
            className="self-start opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1 px-1"
          >
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
        )}
      </div>
    </motion.div>
  )
})

export default function ChatPanel({ activeTab, sessionId }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `👋 Hi! I've analyzed the resume. Ask me anything about skills, experience, education, or projects!`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setLoading(true)
    try {
      const res = await axios.post('http://127.0.0.1:8000/ask', {
        session_id: sessionId,
        question: q,
      })
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }])
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: '❌ Error getting response. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'ai',
        text: `👋 Hi! I've analyzed the resume. Ask me anything about skills, experience, education, or projects!`,
      },
    ])
  }

  if (activeTab === 'ats') return <ATSPanel sessionId={sessionId} />
  if (activeTab === 'questions') return <QuestionsPanel sessionId={sessionId} />
  if (activeTab === 'skills') return <SkillGapPanel sessionId={sessionId} />
  if (activeTab === 'insights') return <InsightsPanel sessionId={sessionId} />

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative z-10">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 glass flex items-center justify-between shadow-lg">
        <div>
          <h2 className="text-white font-semibold">Resume Chat</h2>
          <p className="text-gray-500 text-xs">Answers only from resume context</p>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-3 py-1.5 rounded-lg hover:glass border border-transparent hover:border-white/10"
        >
          🗑 Clear chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/50">AI</div>
            <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center shadow-lg">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-6 pb-2 flex gap-2 flex-wrap">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full glass text-gray-400 hover:text-white hover:glass-strong transition-all disabled:opacity-40 shadow-md"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 glass flex gap-3 shadow-lg">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about this resume..."
          disabled={loading}
          className="flex-1 glass rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-400/50 transition-all disabled:opacity-50 shadow-inner"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl px-4 py-2.5 text-white text-sm font-medium hover:opacity-85 transition-all disabled:opacity-40 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
        >
          Send
        </button>
      </div>
    </div>
  )
}