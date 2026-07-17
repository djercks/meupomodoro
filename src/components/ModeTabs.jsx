const TABS = [
  { key: 'focus', label: 'Foco' },
  { key: 'short', label: 'Pausa curta' },
  { key: 'long', label: 'Pausa longa' },
]

export default function ModeTabs({ mode, onChange, counts }) {
  return (
    <div className="glass rounded-full p-1 flex items-center gap-1 text-sm font-semibold" role="tablist" aria-label="Modo de sessão">
      {TABS.map((tab) => {
        const active = tab.key === mode
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              active ? 'pill-active' : 'text-white/70 hover:text-white'
            }`}
          >
            {tab.label}
            <span className={`text-xs rounded-full px-2 py-0.5 ${active ? 'bg-black/20' : 'bg-white/10'}`}>
              {counts[tab.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
