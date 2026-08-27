'use client'

import { useEffect, useState } from 'react'
import { IconFlame, IconTimer } from '@/components/icons'
import { Pomodoro } from '@/components/pomodoro'
import { listFocusSessions } from '@/app/actions/focus'

interface SessionRow {
  id: string
  durationMinutes: number
  status: string
  startedAt: Date | null
  completedAt: Date | null
}

function fmtTime(d: Date | null) {
  if (!d) return '—'
  return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function FocusView({ thisWeek, onFocusComplete }: { thisWeek: number; onFocusComplete?: () => void }) {
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [minutesToday, setMinutesToday] = useState(0)

  useEffect(() => {
    let cancelled = false
    listFocusSessions(8).then((rows) => {
      if (cancelled) return
      const today = new Date().toDateString()
      const todaySessions = rows.filter((r) => r.startedAt && new Date(r.startedAt).toDateString() === today && r.status === 'completed')
      setMinutesToday(todaySessions.reduce((s, r) => s + r.durationMinutes, 0))
      setSessions(rows as SessionRow[])
    }).catch(() => setSessions([]))
    return () => { cancelled = true }
  }, [])

  const completed = sessions.filter((s) => s.status === 'completed')

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Sessions</p><h2>Focus</h2></div></div>

      <div className="task-stats">
        <div className="stat-card"><p className="eyebrow">Cette semaine</p><strong>{thisWeek}</strong><span>sessions terminées</span></div>
        <div className="stat-card"><p className="eyebrow">Aujourd&apos;hui</p><strong>{minutesToday}</strong><span>minutes de focus</span></div>
        <div className="stat-card"><p className="eyebrow">Total de la semaine</p><strong>{completed.reduce((s, r) => s + r.durationMinutes, 0)}</strong><span>minutes concentrées</span></div>
        <div className="stat-card stat-accent"><p className="eyebrow"><IconFlame size={12} /> Régularité</p><strong>{thisWeek > 3 ? 'En forme' : thisWeek > 0 ? 'Lancé' : 'Début'}</strong><span>{thisWeek > 3 ? 'continue !' : 'lance une session'}</span></div>
      </div>

      <div className="dashboard-grid two">
        <section className="panel">
          <div className="panel-header"><div><h3>Pomodoro</h3><span>Choisis ta durée</span></div></div>
          <Pomodoro defaultMinutes={25} onComplete={onFocusComplete} />
        </section>
        <section className="panel">
          <div className="panel-header"><div><h3>Historique</h3><span>tes {completed.length} dernières sessions</span></div></div>
          <div className="task-list compact">
            {sessions.map((s) => (
              <div className="task-row" key={s.id}>
                <span className={`tx-dot ${s.status === 'completed' ? 'is-in' : 'is-out'}`} />
                <div className="task-body">
                  <strong>{s.durationMinutes} min de focus</strong>
                  <small>{new Date(s.startedAt ?? new Date()).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} · {fmtTime(s.startedAt)}</small>
                </div>
                <span className={`agenda-tag ${s.status === 'completed' ? '' : 'urgent'}`}>
                  {s.status === 'completed' ? 'terminée' : 'annulée'}
                </span>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="empty-line">
                <IconTimer size={16} />
                <p>Aucune session pour l&apos;instant. Lance ton premier pomodoro.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}