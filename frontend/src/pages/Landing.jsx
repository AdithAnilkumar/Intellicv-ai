import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

const features = [
  {
    icon: '🤖',
    title: 'AI Resume Chat',
    desc: 'Ask anything about a resume. Get instant, context-aware answers powered by RAG.',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/20',
    accent: 'text-blue-400',
  },
  {
    icon: '📊',
    title: 'ATS Score Analyzer',
    desc: 'Get a real ATS score with keyword analysis and actionable improvement suggestions.',
    color: 'from-cyan-500/20 to-teal-500/10',
    border: 'border-cyan-500/20',
    accent: 'text-cyan-400',
  },
  {
    icon: '🎯',
    title: 'Skill Gap Detection',
    desc: 'Compare resume skills against any target role and get a clear gap analysis.',
    color: 'from-indigo-500/20 to-blue-500/10',
    border: 'border-indigo-500/20',
    accent: 'text-indigo-400',
  },
  {
    icon: '👁️',
    title: 'Recruiter Insights',
    desc: "See your resume through a recruiter's eyes — strengths, weaknesses, and fit.",
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20',
    accent: 'text-violet-400',
  },
  {
    icon: '❓',
    title: 'Interview Questions',
    desc: 'Auto-generate HR, technical, project, and viva questions from the resume.',
    color: 'from-sky-500/20 to-blue-500/10',
    border: 'border-sky-500/20',
    accent: 'text-sky-400',
  },
  {
    icon: '⚡',
    title: 'Instant Parsing',
    desc: 'Extract name, skills, education, projects and experience in seconds.',
    color: 'from-teal-500/20 to-cyan-500/10',
    border: 'border-teal-500/20',
    accent: 'text-teal-400',
  },
]

const stack = ['LangChain', 'FAISS', 'Groq', 'FastAPI', 'React', 'Tailwind']

const stats = [
  { value: '99%', label: 'Parse Accuracy' },
  { value: '<2s', label: 'Response Time' },
  { value: '6+', label: 'AI Features' },
  { value: '3', label: 'File Formats' },
]

export default function Landing({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const fileRef = useRef()

  const handleFile = useCallback(async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'txt'].includes(ext)) {
      setError('Only PDF, DOCX, or TXT files are supported.')
      return
    }
    setFileName(file.name)
    setError('')
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post('http://127.0.0.1:8000/upload-resume', form)
      onUploadSuccess(res.data.session_id, res.data.parsed_data)
    } catch {
      setError('Upload failed. Make sure the backend is running.')
    } finally {
      setUploading(false)
    }
  }, [onUploadSuccess])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative">

      {/* Enhanced Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[10%] w-[700px] h-[700px] rounded-full bg-blue-600/12 blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Glassy Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 glass border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-black shadow-lg shadow-blue-500/30">I</div>
          <span className="font-bold text-lg tracking-tight">IntelliCV <span className="text-blue-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Features</a>
          <a href="#how" className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">How it works</a>
          <a href="#upload" className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Try it</a>
        </div>
        <a
          href="#upload"
          className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg font-medium hover:opacity-85 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 backdrop-blur-sm"
        >
          Get Started
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-blue-400 mb-6 shadow-lg shadow-blue-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-lg shadow-blue-400/50" />
            Powered by Groq + LangChain + FAISS
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl">
            Analyze Resumes{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Smarter
            </span>{' '}
            with AI
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any resume and interact with it using an intelligent AI recruiter assistant.
            ATS scoring, skill gaps, interview questions — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#upload"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3.5 rounded-xl font-semibold text-white hover:opacity-85 transition-all shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105"
            >
              Upload Resume →
            </a>
            <a
              href="#features"
              className="glass px-8 py-3.5 rounded-xl font-medium text-gray-300 hover:bg-white/15 transition-all hover:scale-105 shadow-lg"
            >
              See Features
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-20"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Mock dashboard preview */}
      <section className="relative z-10 px-6 pb-24 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="w-full max-w-5xl rounded-2xl glass overflow-hidden shadow-2xl shadow-blue-500/20"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 glass-subtle">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="ml-4 flex-1 bg-white/5 rounded-md h-5 max-w-xs" />
          </div>
          <div className="flex h-64">
            <div className="w-52 border-r border-white/10 p-4 flex flex-col gap-3 glass-subtle">
              {['💬 Resume Chat', '📊 ATS Score', '🎯 Skill Gap', '👁️ Insights', '❓ Questions'].map((item) => (
                <div
                  key={item}
                  className={`text-xs px-3 py-2 rounded-lg ${item.startsWith('💬') ? 'glass text-blue-300 shadow-lg shadow-blue-500/20' : 'text-gray-600'}`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex-1 p-4 flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex-shrink-0 shadow-lg shadow-blue-500/50" />
                <div className="glass rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-300 max-w-xs shadow-lg">
                  Hi! I've analyzed the resume. Ask me anything about skills, experience, or projects!
                </div>
              </div>
              <div className="flex gap-2 flex-row-reverse">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex-shrink-0 shadow-lg shadow-purple-500/50" />
                <div className="glass-strong rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white max-w-xs shadow-lg">
                  What skills does this candidate have?
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex-shrink-0 shadow-lg shadow-blue-500/50" />
                <div className="glass rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-300 max-w-sm shadow-lg">
                  The candidate has expertise in React, Python, FastAPI, Machine Learning, and LangChain...
                </div>
              </div>
            </div>
            <div className="w-48 border-l border-white/10 p-4 flex flex-col gap-3 glass-subtle">
              <div className="text-xs text-gray-500 font-semibold">ATS Score</div>
              <div className="text-3xl font-black text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">87</div>
              <div className="w-full glass-subtle rounded-full h-1.5 shadow-inner">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 w-[87%] shadow-lg" />
              </div>
              <div className="text-xs text-gray-500 font-semibold mt-2">Top Skills</div>
              {['React', 'Python', 'FastAPI'].map((s) => (
                <div key={s} className="text-xs px-2 py-1 glass text-blue-400 rounded-lg shadow-md">{s}</div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</div>
          <h2 className="text-4xl font-black tracking-tight">Everything you need to analyze a resume</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Six powerful AI features wrapped in one clean interface.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass rounded-2xl p-6 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/20`}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</div>
          <h2 className="text-4xl font-black tracking-tight">From upload to insights in seconds</h2>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { step: '01', title: 'Upload Resume', desc: 'Drop a PDF, DOCX, or TXT file. We extract every detail instantly.', icon: '📄' },
            { step: '02', title: 'AI Processes It', desc: 'LangChain chunks the text, FAISS stores embeddings, Groq powers the LLM.', icon: '⚙️' },
            { step: '03', title: 'Ask Anything', desc: 'Chat with the resume, get ATS scores, skill gaps, and interview questions.', icon: '💬' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex gap-6 items-start glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-4xl font-black text-blue-500/20 w-12 flex-shrink-0">{item.step}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span>{item.icon}</span>
                  <h3 className="text-white font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="relative z-10 px-6 pb-16 flex flex-col items-center gap-4">
        <div className="text-gray-600 text-xs uppercase tracking-widest">Built with</div>
        <div className="flex flex-wrap justify-center gap-3">
          {stack.map((s) => (
            <span key={s} className="text-xs px-4 py-2 glass rounded-full text-gray-400 shadow-md hover:shadow-lg hover:text-white transition-all">{s}</span>
          ))}
        </div>
      </section>

      {/* Upload section */}
      <section id="upload" className="relative z-10 px-6 py-24 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Try it now</div>
          <h2 className="text-4xl font-black tracking-tight">Upload a resume to get started</h2>
          <p className="text-gray-500 mt-3">PDF, DOCX, or TXT — we handle the rest.</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => fileRef.current.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`w-full max-w-xl cursor-pointer rounded-2xl border-2 border-dashed transition-all p-12 text-center shadow-xl
            ${dragging ? 'border-blue-400 glass shadow-blue-500/30' : 'glass border-blue-500/25 hover:border-blue-400/60 hover:shadow-blue-500/20'}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Uploading <span className="text-white">{fileName}</span>...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-2xl mb-2 shadow-lg">📄</div>
              <p className="text-white font-semibold">Drop your resume here</p>
              <p className="text-gray-500 text-sm">or click to browse files</p>
              <div className="flex gap-2 mt-2">
                {['PDF', 'DOCX', 'TXT'].map((f) => (
                  <span key={f} className="text-xs px-2 py-1 glass text-blue-400 rounded-md shadow-md">{f}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 glass-subtle">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-black">I</div>
          <span className="text-sm text-gray-500">IntelliCV AI</span>
        </div>
        <p className="text-gray-600 text-xs">Built with React + FastAPI + LangChain + Groq</p>
      </footer>
    </div>
  )
}