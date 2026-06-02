export default function RightPanel({ parsedData }) {
  return (
    <div className="w-56 glass border-l border-white/10 p-4 overflow-y-auto flex flex-col gap-4 shadow-xl relative z-10">
      <div>
        <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Candidate</div>
        {parsedData && (
          <div className="glass rounded-xl p-3 shadow-lg">
            <div className="text-white text-sm font-semibold">{parsedData.name || 'Unknown'}</div>
            <div className="text-gray-500 text-xs mt-0.5">{parsedData.email || ''}</div>
            <div className="text-gray-500 text-xs">{parsedData.phone || ''}</div>
          </div>
        )}
      </div>

      {parsedData?.skills?.length > 0 && (
        <div>
          <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Detected Skills</div>
          <div className="flex flex-wrap gap-1.5">
            {parsedData.skills.slice(0, 12).map((s) => (
              <span key={s} className="text-xs px-2 py-1 glass text-blue-400 rounded-lg shadow-md">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-gray-600 text-xs uppercase tracking-widest mb-3">Quick Tips</div>
        <div className="flex flex-col gap-2">
          {[
            'Ask about specific skills',
            'Request a summary',
            'Check ATS score',
            'Generate interview questions',
          ].map((tip) => (
            <div key={tip} className="text-xs text-gray-500 glass-subtle rounded-lg p-2 shadow-sm">
              💡 {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}