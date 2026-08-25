'use client'

import type { Task, Exam } from './types'
import { examsForAgenda } from './helpers'

export function PlanningView({ exams, tasks, nowMs }: { exams: Exam[]; tasks: Task[]; nowMs: number }) {
  const items = examsForAgenda(tasks, exams)
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Calendrier</p><h2>Planning</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Échéances à venir</h3><span>Tâches et examens, triés par date</span></div></div>
        <div className="timeline">
          {items.slice(0, 30).map((item, i) => {
            const d = new Date(item.at)
            return (
              <div className="timeline-row" key={`${item.kind}-${i}`}>
                <div className="timeline-date">
                  <strong>{d.getDate()}</strong>
                  <span>{d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                </div>
                <div className="timeline-body">
                  <strong>{item.title}</strong>
                  <span>{item.sub}</span>
                </div>
                <span className={`agenda-tag ${item.kind === 'exam' ? 'urgent' : ''}`}>{item.kind === 'exam' ? 'Examen' : 'Tâche'}</span>
              </div>
            )
          })}
          {items.length === 0 && <p className="empty-line">Pas d&apos;échéance programmée. Ajoute une tâche ou un examen.</p>}
        </div>
      </section>
    </>
  )
}
