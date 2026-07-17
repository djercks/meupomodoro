export default function Header({ streak, soundOn, onToggleSound }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight">Pomodoro Timer</h1>
        <span className="flex items-center gap-1 text-sm font-semibold glass rounded-full px-3 py-1">
          <span aria-hidden="true">🔥</span>
          <span>{streak}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          aria-label="Alternar som"
          aria-pressed={soundOn}
          className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            {!soundOn && <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" />}
          </svg>
        </button>

        <button aria-label="Idioma" className="h-10 px-3 rounded-full glass flex items-center gap-1.5 text-sm font-medium hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
          </svg>
          PT
        </button>

        <button aria-label="Configurações" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  )
}
