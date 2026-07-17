export default function Controls({ running, onToggle, onReset }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className="btn-start text-[#0a2e1c] font-bold uppercase tracking-wide text-sm px-8 py-3.5 rounded-full flex items-center gap-2 hover:brightness-105 transition"
      >
        {running ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        <span>{running ? 'Pausar' : 'Começar'}</span>
      </button>

      <button
        onClick={onReset}
        aria-label="Reiniciar sessão"
        className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 2.1l4 4-4 4" />
          <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
          <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
        </svg>
      </button>
    </div>
  )
}
