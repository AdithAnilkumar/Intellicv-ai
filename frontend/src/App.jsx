import { useState, useCallback } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'

function App() {
  const [page, setPage] = useState('landing')
  const [sessionId, setSessionId] = useState(null)
  const [parsedData, setParsedData] = useState(null)

  const handleUploadSuccess = useCallback((sid, data) => {
    setSessionId(sid)
    setParsedData(data)
    setPage('dashboard')
  }, [])

  const handleBack = useCallback(() => {
    setPage('landing')
  }, [])

  if (page === 'dashboard') {
    return (
      <Dashboard
        sessionId={sessionId}
        parsedData={parsedData}
        onBack={handleBack}
      />
    )
  }

  return (
    <Landing onUploadSuccess={handleUploadSuccess} />
  )
}

export default App