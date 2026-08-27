'use client'

import { IconSparkles, IconCheck, IconTimer, IconFlame, IconTrending, IconAdd, IconArrow } from '@/components/icons'
import { AITutorPanel } from '@/components/ai-tutor-panel'
import type { Task, Exam } from './types'
import { formatDue, daysUntil, accentClass, examsForAgenda } from './helpers'

interface OverviewProps {
  tasks: Task[]
  completed: number
  nextExam: Exam | undefined
  focusThisWeek: number
  nowMs: number
  onTaskToggle: (id: string) => void
  onAddTask: () => void
  onAddExam: () => void
}

function IconHourglassInline() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M7 3h10M7 21h10" />
    <path d="M7 4c0 4 5 5 5 8s-5 4-5 8" />
    <path d="M17 4c0 4-5 5-5 8s5 4 5 8" />
  </svg>
}

export function OverviewView({ tasks, completed, nextExam, focusThisWeek, nowMs, onTaskToggle, onAddTask, onAddExam }: OverviewProps) {
  const recent = tasks.slice(0, 4)
  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const totalMinutes = tasks.reduce((s, t) => s + (t.status === 'done' ? 0 : t.estimatedMinutes), 0)

  return (
    <div className="overview-grid">
      <section className="panel hero-panel">
        <div className="hero-main">
          <div className="hero-head">
            <span className="kicker"><IconSparkles size={13} /> Aujourd&apos;hui</span>
            <span className="kicker-meta"><IconHourglassInline /> {focusThisWeek} sessions cette semaine</span>
          </div>
          <h2>Ton attention, au bon endroit.</h2>
          <p className="hero-sub">
            Tu as <strong>{todoCount} tâche{todoCount > 1 ? 's' : ''}</strong> en cours et <strong>{nextExam ? 1 : 0} examen{nextExam ? '' : ''}</strong> à préparer. Continue.
          </p>
        </div>
        <div className="hero-side">
          <div className="progress-line"><span style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }} /></div>
          <div className="hero-meta">
            <span><IconCheck size={13} /> {completed} terminées</span>
            <span><IconTimer size={13} /> {totalMinutes} min restantes</span>
          </div>
        </div>
      </section>

      <section className="panel tasks-panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">À faire</p>
            <h3>Tâches du jour</h3>
          </div>
          <button className="round-add" onClick={onAddTask} aria-label="Ajouter une tâche"><IconAdd size={16} /></button>
        </header>
        <div className="task-list compact">
          {recent.map((task) => {
            const due = formatDue(task.dueAt, nowMs)
            return (
              <button className={`task-row ${task.status === 'done' ? 'is-done' : ''}`} key={task.id} onClick={() => onTaskToggle(task.id)}>
                <span className={`check-circle ${task.status === 'done' ? 'is-checked' : ''}`}>
                  {task.status === 'done' && <IconCheck size={10} />}
                </span>
                <div className="task-body">
                  <strong>{task.title}</strong>
                  <small><span className={`pill ${accentClass(task.priority)}`}>{task.subject}</span> - {task.estimatedMinutes} min</small>
                </div>
                <span className="task-due" style={{ color: due.color }}>{due.label}</span>
              </button>
            )
          })}
          {recent.length === 0 && (
            <p className="empty">Aucune tâche. <button onClick={onAddTask}>Ajouter une première</button>.</p>
          )}
        </div>
      </section>

      <section className="panel focus-card">
        <header className="panel-header">
          <div>
            <p className="eyebrow"><IconFlame size={11} /> Régularité</p>
            <h3>Focus cette semaine</h3>
          </div>
          <IconTrending size={18} className="trend-icon" />
        </header>
        <div className="streak">
          <strong>{focusThisWeek}</strong>
          <span>sessions<br />de focus<br />terminées</span>
          <div className="streak-flame"><IconFlame size={28} /></div>
        </div>
        <div className="week-bars">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => {
            const fill = i < focusThisWeek ? Math.min(5, (i % 5) + 1) : 0
            return (
              <div key={`${day}-${i}`}>
                <span className={`bar level-${fill}`} />
                <small>{day}</small>
              </div>
            )
          })}
        </div>
      </section>

      <section className="panel exam-panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">À surveiller</p>
            <h3>Prochain examen</h3>
          </div>
          {nextExam && <span className="days-badge">J-{daysUntil(nextExam.examAt, nowMs)}</span>}
        </header>
        {nextExam ? (
          <>
            <div className="exam-card-mini">
              <div className="exam-date-block">
                <strong>{new Date(nextExam.examAt).getDate()}</strong>
                <div>
                  <span>{new Date(nextExam.examAt).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                  <b>{new Date(nextExam.examAt).getFullYear()}</b>
                </div>
              </div>
              <div className="exam-body">
                <strong>{nextExam.title}</strong>
                <small>{nextExam.subject}</small>
              </div>
            </div>
            <div className="progress-row">
              <span>Préparation</span>
              <div className="progress-line thin"><span style={{ width: `${nextExam.preparationPercent}%` }} /></div>
              <strong>{nextExam.preparationPercent}%</strong>
            </div>
            <button className="panel-footer" onClick={onAddExam}>
              <span>Ajouter un examen</span><IconArrow size={13} />
            </button>
          </>
        ) : (
          <div className="empty">
            <p>Aucun examen enregistré.</p>
            <button className="primary-button small" onClick={onAddExam}>
              <IconAdd size={14} /> Ajouter
            </button>
          </div>
        )}
      </section>

      <section className="panel tutor-panel-card">
        <AITutorPanel />
      </section>

      <section className="panel agenda-panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">Calendrier</p>
            <h3>Échéances à venir</h3>
          </div>
        </header>
        <div className="agenda-list">
          {examsForAgenda(tasks, []).slice(0, 3).map((item, i) => {
            const d = new Date(item.at)
            const days = daysUntil(item.at, nowMs)
            return (
              <div className="agenda-row" key={`${item.kind}-${i}`}>
                <div className={`date-chip ${days <= 7 ? 'urgent' : ''}`}>
                  <strong>{d.getDate()}</strong>
                  <span>{d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                </div>
                <div className="agenda-body">
                  <strong>{item.title}</strong>
                  <small>{item.sub}</small>
                </div>
                <span className={`agenda-tag ${days <= 7 ? 'urgent' : ''}`}>
                  {days <= 1 ? 'Demain' : days === 0 ? 'Aujourd\'hui' : `J-${days}`}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
