import { useRef } from 'react'
import DurationStepper from './DurationStepper.jsx'
import ToggleSwitch from './ToggleSwitch.jsx'
import { ACCENT_COLORS, BACKGROUND_PRESETS } from '../hooks/useSettings.js'

const AMBIENT_OPTIONS = [
  { id: 'off', label: 'Desligado' },
  { id: 'particles', label: 'Partículas' },
  { id: 'stars', label: 'Estrelas' },
  { id: 'rain', label: 'Chuva' },
  { id: 'bubbles', label: 'Bolhas' },
]

const ALARM_OPTIONS = [
  { id: 'carrilhao', label: 'Carrilhão' },
  { id: 'sino', label: 'Sino' },
  { id: 'digital', label: 'Digital' },
]

export default function SettingsPanel({ open, onClose, settings, update, setDuration, setCustomBackground }) {
  const fileInputRef = useRef(null)

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) {
      alert('Escolha uma imagem menor que 4MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setCustomBackground(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-[320px] sm:w-[360px] glass !bg-[#1a1226]/95 z-50 overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 bg-[#1a1226]/95 backdrop-blur z-10 border-b border-white/10">
          <h2 className="font-display font-bold text-base">Configurações</h2>
          <button
            onClick={onClose}
            aria-label="Fechar configurações"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-6 text-sm">
          {/* APARÊNCIA */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Aparência</h3>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between py-2 text-left hover:text-white/80 transition"
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true">🖼️</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-[var(--accent)] text-[#0a0e1a] font-bold rounded px-1.5 py-0.5">NOVO</span>
                  Use sua própria foto de fundo
                </span>
              </span>
              <span aria-hidden="true">›</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">🌄</span> Fundo
              </span>
              <div className="flex items-center gap-1 glass rounded-full p-1">
                {['aurora', 'foto', 'propria'].map((mode) => {
                  const active =
                    (mode === 'propria' && settings.backgroundMode === 'custom') ||
                    (mode !== 'propria' && settings.backgroundMode === 'preset' &&
                      (mode === 'aurora' ? settings.backgroundPreset === 'aurora' : settings.backgroundPreset !== 'aurora'))
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        if (mode === 'propria') {
                          if (settings.customBackground) update({ backgroundMode: 'custom' })
                          else fileInputRef.current?.click()
                        } else if (mode === 'aurora') {
                          update({ backgroundMode: 'preset', backgroundPreset: 'aurora' })
                        } else {
                          update({ backgroundMode: 'preset', backgroundPreset: settings.backgroundPreset === 'aurora' ? 'sunset' : settings.backgroundPreset })
                        }
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full capitalize transition ${
                        active ? 'bg-[var(--accent)] text-[#0a0e1a] font-semibold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {mode === 'propria' ? 'Própria' : mode}
                    </button>
                  )
                })}
              </div>
            </div>

            {settings.backgroundMode === 'preset' && (
              <div className="flex flex-wrap gap-2 pb-2">
                {BACKGROUND_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => update({ backgroundPreset: p.id })}
                    className={`text-xs px-2.5 py-1 rounded-full transition ${
                      settings.backgroundPreset === p.id
                        ? 'bg-[var(--accent)] text-[#0a0e1a] font-semibold'
                        : 'glass text-white/60 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">🎨</span> Destaque
              </span>
              <div className="flex items-center gap-1.5">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update({ accentColor: c.id })}
                    aria-label={`Cor ${c.id}`}
                    className={`w-5 h-5 rounded-full transition ${
                      settings.accentColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1226]' : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="py-2">
              <span className="flex items-center gap-2 mb-2">
                <span aria-hidden="true">✨</span> Efeito ambiente
              </span>
              <div className="flex flex-wrap gap-2">
                {AMBIENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => update({ ambientEffect: opt.id })}
                    className={`text-xs px-2.5 py-1 rounded-full transition ${
                      settings.ambientEffect === opt.id
                        ? 'bg-[var(--accent)] text-[#0a0e1a] font-semibold'
                        : 'glass text-white/60 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px bg-white/10" />

          {/* TIMER */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Timer</h3>

            <DurationStepper
              icon="🎯"
              label="Concentração"
              value={settings.durations.focus}
              onChange={(v) => setDuration('focus', v)}
            />
            <DurationStepper
              icon="☕"
              label="Descanso curto"
              value={settings.durations.short}
              onChange={(v) => setDuration('short', v)}
            />
            <DurationStepper
              icon="🛋️"
              label="Descanso longo"
              value={settings.durations.long}
              onChange={(v) => setDuration('long', v)}
            />

            <div className="flex items-center justify-between py-2">
              <span className="text-white/80">Início automático: descanso</span>
              <ToggleSwitch
                checked={settings.autoStartBreak}
                onChange={(v) => update({ autoStartBreak: v })}
                label="Início automático do descanso"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-white/80">Início automático: concentração</span>
              <ToggleSwitch
                checked={settings.autoStartFocus}
                onChange={(v) => update({ autoStartFocus: v })}
                label="Início automático da concentração"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2">
                <span aria-hidden="true">🔔</span> Alarme
              </span>
              <ToggleSwitch
                checked={settings.alarmOn}
                onChange={(v) => update({ alarmOn: v })}
                label="Alarme"
              />
            </div>

            {settings.alarmOn && (
              <>
                <div className="flex flex-wrap gap-2 pb-2">
                  {ALARM_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => update({ alarmType: opt.id })}
                      className={`text-xs px-2.5 py-1 rounded-full transition ${
                        settings.alarmType === opt.id
                          ? 'bg-[var(--accent)] text-[#0a0e1a] font-semibold'
                          : 'glass text-white/60 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pb-2">
                  <span aria-hidden="true">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.alarmVolume}
                    onChange={(e) => update({ alarmVolume: Number(e.target.value) })}
                    className="flex-1 accent-[var(--accent)]"
                    aria-label="Volume do alarme"
                  />
                </div>
              </>
            )}
          </section>

          <div className="h-px bg-white/10" />

          {/* GERAL */}
          <section className="pb-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Geral</h3>

            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-white/50">
                <span aria-hidden="true">🔕</span> Notificações
              </span>
              <span className="text-[10px] bg-white/10 text-white/50 rounded px-2 py-1 font-semibold uppercase tracking-wide">
                Em breve
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-white/50">
                <span aria-hidden="true">🏷️</span> Gerenciar etiquetas
              </span>
              <span className="text-[10px] bg-white/10 text-white/50 rounded px-2 py-1 font-semibold uppercase tracking-wide">
                Em breve
              </span>
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}
