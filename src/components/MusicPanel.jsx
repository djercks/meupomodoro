import { useState } from 'react'

const AMBIENT_SOUNDS = [
  { id: 'off', label: 'Desligado' },
  { id: 'rain', label: 'Chuva' },
  { id: 'cafe', label: 'Café' },
  { id: 'white', label: 'Ruído branco' },
  { id: 'waves', label: 'Ondas do mar' },
]

const MODE_TABS = [
  { id: 'focus', label: 'Foco' },
  { id: 'short', label: 'Pausa curta' },
  { id: 'long', label: 'Pausa longa' },
]

export default function MusicPanel({ open, onClose, settings, update, music, assignModeUrl, removeMusicUrl, currentMode }) {
  const [tab, setTab] = useState('ambiente')
  const [musicMode, setMusicMode] = useState('focus')
  const [urlInput, setUrlInput] = useState(settings.musicUrls[musicMode] || '')

  function selectMusicMode(id) {
    setMusicMode(id)
    setUrlInput(settings.musicUrls[id] || '')
  }

  function handleSave(e) {
    e.preventDefault()
    if (!urlInput.trim()) {
      assignModeUrl(musicMode, '')
      return
    }
    assignModeUrl(musicMode, urlInput.trim())
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div className="absolute top-14 right-24 sm:right-28 w-[300px] glass !bg-[#1a1226]/95 rounded-2xl z-50 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-1 p-2 border-b border-white/10">
          <button
            onClick={() => setTab('ambiente')}
            className={`flex-1 text-xs font-semibold py-2 rounded-full transition ${
              tab === 'ambiente' ? 'bg-[var(--accent)] text-[#0a0e1a]' : 'text-white/60 hover:text-white'
            }`}
          >
            Som ambiente
          </button>
          <button
            onClick={() => setTab('musica')}
            className={`flex-1 text-xs font-semibold py-2 rounded-full transition ${
              tab === 'musica' ? 'bg-[var(--accent)] text-[#0a0e1a]' : 'text-white/60 hover:text-white'
            }`}
          >
            Música
          </button>
        </div>

        <div className="p-4 text-sm">
          {tab === 'ambiente' ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {AMBIENT_SOUNDS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update({ ambientSoundType: s.id })}
                    className={`text-xs px-2.5 py-1 rounded-full transition ${
                      settings.ambientSoundType === s.id
                        ? 'bg-[var(--accent)] text-[#0a0e1a] font-semibold'
                        : 'glass text-white/60 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {settings.ambientSoundType !== 'off' && (
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.ambientSoundVolume}
                    onChange={(e) => update({ ambientSoundVolume: Number(e.target.value) })}
                    className="flex-1 accent-[var(--accent)]"
                    aria-label="Volume do som ambiente"
                  />
                </div>
              )}
              <p className="text-white/40 text-xs mt-3">
                Toca em paralelo com a música, enquanto o timer estiver rodando.
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1.5">
                Vincular link por tipo de sessão
              </p>
              <div className="flex items-center gap-1 mb-3 glass rounded-full p-1">
                {MODE_TABS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => selectMusicMode(m.id)}
                    className={`flex-1 text-[11px] py-1.5 rounded-full transition relative ${
                      musicMode === m.id ? 'bg-[var(--accent)] text-[#0a0e1a] font-semibold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {m.label}
                    {currentMode === m.id && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSave} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Cole um link do YouTube"
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs placeholder-white/40 focus:bg-white/10 transition"
                />
                <button
                  type="submit"
                  className="px-3 rounded-full bg-[var(--accent)] text-[#0a0e1a] font-semibold text-xs hover:brightness-105 transition"
                >
                  Salvar
                </button>
              </form>

              {settings.musicUrls[musicMode] ? (
                <p className="text-[11px] text-white/50 truncate mb-3" title={settings.musicUrls[musicMode]}>
                  🔗 vinculado — toca automaticamente na {MODE_TABS.find((m) => m.id === musicMode)?.label.toLowerCase()}
                </p>
              ) : (
                <p className="text-[11px] text-white/40 mb-3">
                  Nenhum link vinculado a {MODE_TABS.find((m) => m.id === musicMode)?.label.toLowerCase()} ainda.
                </p>
              )}

              {settings.musicHistory?.length > 0 && (
                <div className="mb-1">
                  <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1.5">Usados recentemente</p>
                  <ul className="flex flex-col gap-1 max-h-28 overflow-y-auto">
                    {settings.musicHistory.map((url) => (
                      <li key={url} className="flex items-center gap-1.5 group">
                        <button
                          onClick={() => {
                            setUrlInput(url)
                            assignModeUrl(musicMode, url)
                          }}
                          className="flex-1 text-left text-[11px] text-white/60 hover:text-white truncate glass rounded-lg px-2 py-1.5 transition"
                          title={url}
                        >
                          🔗 {url}
                        </button>
                        <button
                          onClick={() => removeMusicUrl(url)}
                          aria-label="Remover do histórico"
                          className="text-white/20 hover:text-white/60 transition text-xs opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-white/40 text-xs mt-3">
                Ao trocar de fase, a música muda sozinha — só uma toca por vez.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
