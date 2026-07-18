import { useState } from 'react'

const AMBIENT_SOUNDS = [
  { id: 'off', label: 'Desligado' },
  { id: 'rain', label: 'Chuva' },
  { id: 'cafe', label: 'Café' },
  { id: 'white', label: 'Ruído branco' },
  { id: 'waves', label: 'Ondas do mar' },
]

export default function MusicPanel({ open, onClose, settings, update, music }) {
  const [tab, setTab] = useState('ambiente')
  const [urlInput, setUrlInput] = useState(settings.musicUrl || '')

  function handleLoadMusic(e) {
    e.preventDefault()
    const ok = music.loadUrl(urlInput)
    if (!ok) {
      alert('Cole um link válido do YouTube.')
      return
    }
    update({ musicUrl: urlInput })
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
                Som gerado no navegador — continua tocando mesmo com este painel fechado.
              </p>
            </>
          ) : (
            <>
              <form onSubmit={handleLoadMusic} className="flex gap-2 mb-3">
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
                  Carregar
                </button>
              </form>

              {music.videoId ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={music.togglePlay}
                    className="w-9 h-9 rounded-full bg-[var(--accent)] text-[#0a0e1a] flex items-center justify-center flex-shrink-0"
                    aria-label={music.playing ? 'Pausar música' : 'Tocar música'}
                  >
                    {music.playing ? '⏸' : '▶'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="70"
                    onChange={(e) => music.setVolume(Number(e.target.value))}
                    className="flex-1 accent-[var(--accent)]"
                    aria-label="Volume da música"
                  />
                  <button
                    onClick={music.stopAndClear}
                    aria-label="Remover música"
                    className="text-white/40 hover:text-white/70 transition text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-white/40 text-xs">Cole o link de um vídeo do YouTube para tocar.</p>
              )}
              <p className="text-white/40 text-xs mt-3">
                O player continua tocando em segundo plano enquanto você foca.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
