export default function Header({ streak, soundOn, onToggleSound, auth }) {
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
        {auth?.isSupabaseConfigured && (
          <>
            {auth.user ? (
              <button
                onClick={auth.signOut}
                className="h-10 px-3 rounded-full glass flex items-center gap-2 text-sm font-medium hover:bg-white/10 transition"
                title="Sair"
              >
                {auth.user.user_metadata?.avatar_url ? (
                  <img src={auth.user.user_metadata.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-[#0a2e1c]">
                    {(auth.user.user_metadata?.full_name || auth.user.email || '?')[0].toUpperCase()}
                  </span>
                )}
                <span className="hidden sm:inline">Sair</span>
              </button>
            ) : (
              <button
                onClick={auth.signInWithGoogle}
                className="h-10 px-3 rounded-full glass flex items-center gap-2 text-sm font-medium hover:bg-white/10 transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}
          </>
        )}

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
