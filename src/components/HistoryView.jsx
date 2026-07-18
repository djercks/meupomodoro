import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSessionHistory } from '../hooks/useSessionHistory.js'
import HeatmapGrid from './HeatmapGrid.jsx'
import {
  bestWeekday,
  bucketSessions,
  buildHeatmap,
  computeStreak,
  computeSummary,
} from '../lib/historyStats.js'

const PERIODS = [
  { id: 'day', label: 'Dia', count: 14 },
  { id: 'week', label: 'Semana', count: 12 },
  { id: 'month', label: 'Mês', count: 12 },
  { id: 'quarter', label: 'Trimestre', count: 8 },
  { id: 'year', label: 'Ano', count: 5 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass !bg-[#1a1226]/95 rounded-lg px-3 py-2 text-xs">
      <p className="text-white/60 mb-0.5">{label}</p>
      <p className="font-semibold">{payload[0].value}h de foco</p>
    </div>
  )
}

export default function HistoryView({ open, onClose, userId, isSupabaseConfigured }) {
  const [period, setPeriod] = useState('week')
  const { sessions, loading } = useSessionHistory(userId)

  const activePeriod = PERIODS.find((p) => p.id === period)
  const chartData = useMemo(
    () => bucketSessions(sessions, period, activePeriod.count),
    [sessions, period, activePeriod.count]
  )
  const summary = useMemo(() => computeSummary(sessions), [sessions])
  const streak = useMemo(() => computeStreak(sessions), [sessions])
  const best = useMemo(() => bestWeekday(sessions), [sessions])
  const heatmap = useMemo(() => buildHeatmap(sessions, 14), [sessions])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#120a1c]/98 overflow-y-auto text-white">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl">Histórico de produtividade</h2>
          <button
            onClick={onClose}
            aria-label="Fechar histórico"
            className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        {!isSupabaseConfigured || !userId ? (
          <div className="glass rounded-2xl p-8 text-center text-white/60">
            <p>Entre com sua conta Google para começar a acompanhar seu histórico de foco.</p>
          </div>
        ) : loading ? (
          <div className="glass rounded-2xl p-8 text-center text-white/60">Carregando histórico...</div>
        ) : sessions.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-white/60">
            Ainda não há sessões de foco concluídas. Complete um Pomodoro para ver seus dados aqui.
          </div>
        ) : (
          <>
            {/* Cartões de resumo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1">Total de horas</p>
                <p className="font-display font-bold text-xl">{summary.totalHours}h</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1">Média por dia ativo</p>
                <p className="font-display font-bold text-xl">{summary.avgPerActiveDay}h</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1">Sessões concluídas</p>
                <p className="font-display font-bold text-xl">{summary.sessionCount}</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wide text-white/40 mb-1">Sequência atual</p>
                <p className="font-display font-bold text-xl flex items-center gap-1">
                  {streak} <span className="text-sm font-normal">dias 🔥</span>
                </p>
              </div>
            </div>

            {best && (
              <p className="text-sm text-white/60 mb-6">
                Seu dia mais produtivo costuma ser <span className="text-white font-semibold">{best.label}</span>,
                com uma média acumulada de {best.hours}h de foco.
              </p>
            )}

            {/* Gráfico por período */}
            <div className="glass rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex items-center gap-1 mb-4 flex-wrap">
                {PERIODS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    className={`text-xs px-3 py-1.5 rounded-full transition ${
                      period === p.id
                        ? 'bg-[var(--accent)] text-[#0a0e1a] font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="hours" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mapa de calor */}
            <div className="glass rounded-2xl p-4 sm:p-5 mb-6">
              <p className="text-sm font-semibold mb-3">Últimas 14 semanas</p>
              <HeatmapGrid weeks={heatmap} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
