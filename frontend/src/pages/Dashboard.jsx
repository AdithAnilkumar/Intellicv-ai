import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatPanel from '../components/ChatPanel'
import RightPanel from '../components/RightPanel'

export default function Dashboard({ sessionId, parsedData, onBack }) {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background effects - Simplified */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        parsedData={parsedData}
        onBack={onBack}
      />

      {/* Center Panel */}
      <ChatPanel
        activeTab={activeTab}
        sessionId={sessionId}
        parsedData={parsedData}
      />

      {/* Right Panel */}
      <RightPanel
        sessionId={sessionId}
        parsedData={parsedData}
      />
    </div>
  )
}