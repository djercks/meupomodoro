const MONTH_LABELS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function intensityClass(minutes, max) {
  if (minutes <= 0) return 'bg-white/[0.06]'
  const ratio = max > 0 ? minutes / max : 0
  if (ratio > 0.75) return 'bg-[var(--accent)]'
  if (ratio > 0.45) return 'opacity-70 bg-[var(--accent)]'
  if (ratio > 0.15) return 'opacity-45 bg-[var(--accent)]'
  return 'opacity-25 bg-[var(--accent)]'
}

export default function HeatmapGrid({ weeks }) {
  const max = Math.max(1, ...weeks.flat().map((d) => d.minutes))

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 mb-1 pl-6">
        {weeks.map((week, i) => {
          const first = week[0].date
          const showLabel = first.getDate() <= 7
          return (
            <div key={i} className="w-3 text-[9px] text-white/40">
              {showLabel ? MONTH_LABELS[first.getMonth()] : ''}
            </div>
          )
        })}
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 pr-1 justify-between text-[9px] text-white/40 h-[92px]">
          <span>dom</span>
          <span>qua</span>
          <span>sáb</span>
        </div>
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.key}
                  title={`${day.date.toLocaleDateString('pt-BR')} — ${
                    day.minutes > 0 ? `${Math.round((day.minutes / 60) * 10) / 10}h de foco` : 'sem foco'
                  }`}
                  className={`w-3 h-3 rounded-sm ${
                    day.isFuture ? 'bg-transparent' : intensityClass(day.minutes, max)
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
