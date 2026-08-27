'use client'

import { useState } from 'react'
import { IconCheck, IconFlame } from '@/components/icons'
import { readLocal, writeLocal } from './helpers'

const DEFAULT_HABITS = ['Lire 20 min', 'Réviser les flashcards', 'Boire 1,5L d\'eau', 'Marcher 30 min']
const HABIT_KEY = 'ontrack.habits.list'

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

function weekDays(anchor: Date) {
  const days: Date[] = []
  const base = new Date(anchor)
  const dow = (base.getDay() + 6) % 7 // Monday = 0
  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() - dow + i)
    days.push(d)
  }
  return days
}

const WEEK_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function HabitsView({ thisWeek }: { thisWeek: number }) {
  const [habits, setHabits] = useState<string[]>(() => readLocal<string[]>(HABIT_KEY, DEFAULT_HABITS))
  const [newHabit, setNewHabit] = useState('')
  const [checks, setChecks] = useState<Record<string, boolean>>(() => readLocal('ontrack.habits', {}))
  const [anchor, setAnchor] = useState(() => new Date())
  const days = weekDays(anchor)

  const today = dayKey(new Date())
  const doneToday = habits.filter((h) => checks[`${today}|${h}`]).length
  const doneThisWeek = habits.reduce((acc, h) => acc + days.filter((d) => checks[`${dayKey(d)}|${h}`]).length, 0)

  function toggle(day: Date, habit: string) {
    const k = `${dayKey(day)}|${habit}`
    const next = { ...checks, [k]: !checks[k] }
    setChecks(next); writeLocal('ontrack.habits', next)
  }

  function addHabit() {
    const h = newHabit.trim()
    if (!h) return
    const next = [...habits, h]
    setHabits(next); writeLocal(HABIT_KEY, next)
    setNewHabit('')
  }

  function removeHabit(h: string) {
    const next = habits.filter((x) => x !== h)
    setHabits(next); writeLocal(HABIT_KEY, next)
  }

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Rythme</p><h2>Habitudes</h2></div></div>
      <section className="panel">
        <div className="panel-header">
          <div><h3>Cette semaine</h3><span>{doneThisWeek} cases cochées - {doneToday}/{habits.length} aujourd&apos;hui</span></div>
          <div className="habit-nav">
            <button onClick={() => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d) }} aria-label="Semaine précédente">‹</button>
            <button onClick={() => setAnchor(new Date())} className="habit-today">Aujourd&apos;hui</button>
            <button onClick={() => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d) }} aria-label="Semaine suivante">›</button>
          </div>
        </div>

        <div className="habit-board">
          <div className="habit-head">
            <span className="habit-name-col">Habitude</span>
            {days.map((d, i) => (
              <span key={dayKey(d)} className={dayKey(d) === today ? 'is-today' : ''}>
                {WEEK_LABELS[i]}
                <small>{d.getDate()}</small>
              </span>
            ))}
          </div>
          {habits.map((h) => (
            <div className="habit-row" key={h}>
              <strong className="habit-name-col">
                {h}
                <button className="habit-del" onClick={() => removeHabit(h)} aria-label={`Supprimer ${h}`}>×</button>
              </strong>
              {days.map((d) => {
                const k = `${dayKey(d)}|${h}`
                const v = !!checks[k]
                return (
                  <button
                    key={k}
                    className={`habit-cell ${v ? 'is-checked' : ''} ${dayKey(d) === today ? 'is-today' : ''}`}
                    onClick={() => toggle(d, h)}
                    aria-label={`${h} le ${dayKey(d)}`}
                  >
                    {v && <IconCheck size={11} />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="habit-add">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Nouvelle habitude… (ex. Réviser l'anglais)"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHabit() } }}
          />
          <button onClick={addHabit}>Ajouter</button>
        </div>

        <div className="panel-footer">
          <span><IconFlame size={13} /> {thisWeek} sessions de focus cette semaine</span>
        </div>
      </section>
    </>
  )
}