'use client'

import { useMemo, useState } from 'react'
import { IconChevronL, IconChevron, IconPen } from '@/components/icons'
import type { Task, Exam } from './types'

interface PlanningProps {
  exams: Exam[]
  tasks: Task[]
  nowMs: number
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, n: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function weekDays(anchor: Date): Date[] {
  const base = startOfDay(anchor)
  const dow = (base.getDay() + 6) % 7 // Monday = 0
  return Array.from({ length: 7 }, (_, i) => addDays(base, -dow + i))
}

function sameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

export function PlanningView({ exams, tasks, nowMs }: PlanningProps) {
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()))
  const days = weekDays(anchor)
  const today = startOfDay(new Date())

  const firstDay = days[0]
  const lastDay = days[6]
  const weekLabel = `${firstDay.getDate()} ${MONTHS[firstDay.getMonth()].slice(0, 3)} — ${lastDay.getDate()} ${MONTHS[lastDay.getMonth()].slice(0, 3)}${firstDay.getMonth() !== lastDay.getMonth() ? ' ' + MONTHS[firstDay.getMonth()].slice(0, 3) : ''}`

  const items = useMemo(() => {
    const todo = tasks.map((t) => ({
      kind: 'task' as const,
      id: t.id,
      title: t.title,
      sub: t.subject,
      at: t.dueAt ? startOfDay(new Date(t.dueAt)) : null,
      status: t.status,
    }))
    const exms = exams.map((e) => ({
      kind: 'exam' as const,
      id: e.id,
      title: e.title,
      sub: e.subject,
      at: startOfDay(new Date(e.examAt)),
      status: 'todo' as const,
    }))
    return [...todo, ...exms].filter((i) => i.at)
  }, [tasks, exams])

  const weekItems = useMemo(() => {
    const map: Record<string, typeof items> = {}
    for (const day of days) {
      const key = day.toISOString().slice(0, 10)
      map[key] = items.filter((i) => i.at && sameDate(i.at!, day))
        .sort((a, b) => (a.kind === 'exam' ? -1 : 1) - (b.kind === 'exam' ? -1 : 1))
    }
    return map
  }, [items, days])

  const totalWeek = items.filter((i) => i.at && days.some((d) => sameDate(i.at!, d))).length
  const examsWeek = items.filter((i) => i.kind === 'exam' && i.at && days.some((d) => sameDate(i.at!, d))).length
  const tasksWeek = totalWeek - examsWeek

  return (
    <>
      <div className="section-heading">
        <div><p className="eyebrow">Calendrier</p><h2>Planning</h2></div>
        <div className="habit-nav">
          <button onClick={() => setAnchor((a) => addDays(a, -7))} aria-label="Semaine précédente"><IconChevronL size={14} /></button>
          <button className="habit-today" onClick={() => setAnchor(new Date())}>Semaine</button>
          <button onClick={() => setAnchor((a) => addDays(a, 7))} aria-label="Semaine suivante"><IconChevron size={14} /></button>
        </div>
      </div>

      <div className="week-stat-row">
        <span className="week-stat-label">{weekLabel}</span>
        <span className="week-stat-chips">
          <span className="pill pill-amber">{tasksWeek} tâche{tasksWeek > 1 ? 's' : ''}</span>
          <span className="pill pill-coral">{examsWeek} examen{examsWeek > 1 ? 's' : ''}</span>
        </span>
      </div>

      <section className="panel week-grid">
        {days.map((day, i) => {
          const key = day.toISOString().slice(0, 10)
          const dayItems = weekItems[key] ?? []
          const isToday = sameDate(day, today)
          const isPast = day.getTime() < today.getTime()
          return (
            <div className={`week-col ${isToday ? 'is-today' : ''} ${isPast ? 'is-past' : ''}`} key={key}>
              <div className="week-col-head">
                <span className="week-day">{DAY_LABELS[i].slice(0, 3)}</span>
                <span className={`week-date ${isToday ? 'is-today' : ''}`}>{day.getDate()}</span>
              </div>
              <div className="week-col-body">
                {dayItems.map((item) => (
                  <div className={`week-item ${item.kind} ${item.status === 'done' ? 'is-done' : ''}`} key={`${item.kind}-${item.id}`}>
                    <strong>{item.title}</strong>
                    <small>{item.sub}</small>
                  </div>
                ))}
                {dayItems.length === 0 && <span className="week-empty">—</span>}
              </div>
            </div>
          )
        })}
      </section>

      <section className="panel">
        <div className="panel-header"><div><h3>Quand est-ce que ça se passe ?</h3><span>Les tâches sans échéance ne sont pas encore planifiées</span></div></div>
        <div className="timeline">
          {items.map((item) => {
            const d = item.at!
            const daysAhead = Math.round((startOfDay(d).getTime() - today.getTime()) / 86400000)
            return (
              <div className="timeline-row" key={`${item.kind}-${item.id}`}>
                <div className="timeline-date">
                  <strong>{d.getDate()}</strong>
                  <span>{d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                </div>
                <div className="timeline-body">
                  <strong>{item.title}</strong>
                  <span>{item.sub}</span>
                </div>
                <span className={`agenda-tag ${item.kind === 'exam' ? 'urgent' : ''}`}>
                  {item.kind === 'exam' ? <IconPen size={11} /> : null} {item.kind === 'exam' ? 'Examen' : daysAhead < 0 ? `En retard (${-daysAhead} j)` : daysAhead === 0 ? "Aujourd'hui" : daysAhead === 1 ? 'Demain' : `Dans ${daysAhead} j`}
                </span>
              </div>
            )
          })}
          {items.length === 0 && <p className="empty-line">Pas d&apos;échéance programmée. Ajoute une tâche ou un examen.</p>}
        </div>
      </section>
    </>
  )
}