'use client'

import { useState } from 'react'
import { IconCheck } from '@/components/icons'
import { readLocal, writeLocal } from './helpers'

export function HabitsView({ thisWeek }: { thisWeek: number }) {
  const [checks, setChecks] = useState<Record<string, boolean>>(() => readLocal('ontrack.habits', {}))
  const habits = ['Lire 20 min', 'Réviser les flashcards', 'Boire 1,5L d\'eau', 'Marcher 30 min']
  const today = new Date().toISOString().slice(0, 10)
  const done = Object.values(checks[`${today}`] ?? {}).filter(Boolean).length
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Rythme</p><h2>Habitudes</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Aujourd&apos;hui</h3><span>{done}/{habits.length} faites - {thisWeek} sessions de focus</span></div></div>
        <ul className="goal-list">
          {habits.map((h) => {
            const k = `${today}|${h}`
            const v = !!checks[k]
            return (
              <li key={h}>
                <button className={`check-circle ${v ? 'is-checked' : ''}`} onClick={() => {
                  const next = { ...checks, [k]: !v }; setChecks(next); writeLocal('ontrack.habits', next)
                }}>{v && <IconCheck size={10} />}</button>
                <strong style={{ flex: 1, textDecoration: v ? 'line-through' : 'none' }}>{h}</strong>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
