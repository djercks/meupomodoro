const WEEKDAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function dayKey(date) {
  return date.toISOString().slice(0, 10) // YYYY-MM-DD
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = domingo
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfQuarter(date) {
  const q = Math.floor(date.getMonth() / 3)
  return new Date(date.getFullYear(), q * 3, 1)
}

/**
 * Agrupa as sessões de foco em "baldes" por período (dia/semana/mês/trimestre/ano)
 * e retorna os últimos `count` baldes, preenchendo com zero onde não houve foco.
 */
export function bucketSessions(sessions, granularity, count) {
  const now = new Date()
  const buckets = []

  for (let i = count - 1; i >= 0; i--) {
    let start, label
    if (granularity === 'day') {
      start = new Date(now)
      start.setDate(start.getDate() - i)
      start.setHours(0, 0, 0, 0)
      label = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    } else if (granularity === 'week') {
      const base = startOfWeek(now)
      start = new Date(base)
      start.setDate(start.getDate() - i * 7)
      label = start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    } else if (granularity === 'month') {
      const base = startOfMonth(now)
      start = new Date(base.getFullYear(), base.getMonth() - i, 1)
      label = start.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
    } else if (granularity === 'quarter') {
      const base = startOfQuarter(now)
      start = new Date(base.getFullYear(), base.getMonth() - i * 3, 1)
      const q = Math.floor(start.getMonth() / 3) + 1
      label = `T${q}/${String(start.getFullYear()).slice(2)}`
    } else {
      start = new Date(now.getFullYear() - i, 0, 1)
      label = String(start.getFullYear())
    }
    buckets.push({ start, label, minutes: 0 })
  }

  for (const s of sessions) {
    const completed = new Date(s.completed_at)
    for (let i = buckets.length - 1; i >= 0; i--) {
      if (completed >= buckets[i].start) {
        buckets[i].minutes += s.duration_minutes
        break
      }
    }
  }

  return buckets.map((b) => ({ label: b.label, hours: Math.round((b.minutes / 60) * 10) / 10 }))
}

export function computeSummary(sessions) {
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
  const activeDays = new Set(sessions.map((s) => dayKey(new Date(s.completed_at)))).size
  return {
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    avgPerActiveDay: activeDays > 0 ? Math.round((totalMinutes / activeDays / 60) * 10) / 10 : 0,
    sessionCount: sessions.length,
  }
}

export function computeStreak(sessions) {
  const days = new Set(sessions.map((s) => dayKey(new Date(s.completed_at))))
  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  // Se hoje ainda não teve sessão, a sequência conta a partir de ontem
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (days.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function bestWeekday(sessions) {
  const totals = [0, 0, 0, 0, 0, 0, 0]
  for (const s of sessions) {
    const d = new Date(s.completed_at)
    totals[d.getDay()] += s.duration_minutes
  }
  const maxIndex = totals.indexOf(Math.max(...totals))
  if (totals[maxIndex] === 0) return null
  return { label: WEEKDAY_LABELS[maxIndex], hours: Math.round((totals[maxIndex] / 60) * 10) / 10 }
}

/**
 * Monta uma grade estilo "GitHub contributions" das últimas `weeks` semanas.
 * Retorna um array de semanas, cada uma com 7 dias (domingo a sábado).
 */
export function buildHeatmap(sessions, weeks = 14) {
  const minutesByDay = new Map()
  for (const s of sessions) {
    const key = dayKey(new Date(s.completed_at))
    minutesByDay.set(key, (minutesByDay.get(key) || 0) + s.duration_minutes)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const gridStart = startOfWeek(today)
  gridStart.setDate(gridStart.getDate() - (weeks - 1) * 7)

  const result = []
  for (let w = 0; w < weeks; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart)
      date.setDate(date.getDate() + w * 7 + d)
      const key = dayKey(date)
      week.push({
        date,
        key,
        minutes: minutesByDay.get(key) || 0,
        isFuture: date > today,
      })
    }
    result.push(week)
  }
  return result
}
