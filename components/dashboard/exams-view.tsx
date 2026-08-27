'use client'

import { IconAdd, IconTrash } from '@/components/icons'
import { Button } from '@/components/ui/button'
import type { Exam } from './types'
import { daysUntil } from './helpers'

interface ExamsProps {
  exams: Exam[]
  nowMs: number
  onProgress: (id: string, percent: number) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ExamsView({ exams, nowMs, onProgress, onDelete, onAdd }: ExamsProps) {
  const sorted = [...exams].sort((a, b) => new Date(a.examAt).getTime() - new Date(b.examAt).getTime())
  const urgent = sorted.filter((e) => daysUntil(e.examAt, nowMs) <= 14)
  const upcoming = sorted.filter((e) => daysUntil(e.examAt, nowMs) > 14)
  const avg = sorted.length ? Math.round(sorted.reduce((s, e) => s + e.preparationPercent, 0) / sorted.length) : 0
  const soon = sorted[0]

  const renderExam = (exam: Exam) => {
    const days = daysUntil(exam.examAt, nowMs)
    const isSoon = soon?.id === exam.id
    return (
      <div className={`exam-card ${isSoon ? 'is-soon' : ''}`} key={exam.id}>
        <div className="exam-card-head">
          <div>
            <div className="exam-title-row">
              <strong>{exam.title}</strong>
              {isSoon && <span className="days-badge urgent">prochain</span>}
            </div>
            <span>{exam.subject} - {formatDate(exam.examAt)}</span>
          </div>
          <span className={`days-badge ${days <= 14 ? 'urgent' : ''}`}>J-{days}</span>
        </div>
        <div className="progress-row">
          <span className="progress-label">Préparation</span>
          <div className="progress-line thin"><span style={{ width: `${exam.preparationPercent}%` }} /></div>
          <strong>{exam.preparationPercent}%</strong>
        </div>
        <input
          type="range"
          min={0} max={100} step={5}
          value={exam.preparationPercent}
          onChange={(e) => onProgress(exam.id, Number(e.target.value))}
          aria-label="Progression"
        />
        <Button variant="ghost" size="sm" onClick={() => onDelete(exam.id)}>
          <IconTrash size={12} /> Retirer
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Préparation</p><h2>Examens</h2></div></div>

      <div className="task-stats">
        <div className="stat-card"><p className="eyebrow">Examens</p><strong>{sorted.length}</strong><span>enregistré{sorted.length > 1 ? 's' : ''}</span></div>
        <div className="stat-card"><p className="eyebrow">Préparation moyenne</p><strong>{avg}%</strong><span>sur tous les examens</span></div>
        <div className="stat-card"><p className="eyebrow">Imminents</p><strong className={urgent.length ? 'is-neg' : ''}>{urgent.length}</strong><span>dans les 14 jours</span></div>
        {soon && (
          <div className="stat-card stat-accent"><p className="eyebrow">Prochain</p><strong>{daysUntil(soon.examAt, nowMs)} j</strong><span>{soon.title}</span></div>
        )}
      </div>

      {urgent.length > 0 && (
        <section className="panel">
          <div className="panel-header">
            <div><h3>Imminents</h3><span>moins de 14 jours - priorité aux révisions</span></div>
            <button className="round-add" onClick={onAdd} aria-label="Ajouter"><IconAdd size={16} /></button>
          </div>
          <div className="exams-list">{urgent.map(renderExam)}</div>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>{upcoming.length > 0 ? 'Viennent ensuite' : 'Tes examens'}</h3>
            <span>Ajuste ta progression au fil de tes révisions</span>
          </div>
          {upcoming.length === 0 && <button className="round-add" onClick={onAdd} aria-label="Ajouter"><IconAdd size={16} /></button>}
        </div>
        <div className="exams-list">
          {upcoming.map(renderExam)}
          {sorted.length === 0 && <p className="empty-line">Aucun examen. Clique sur + pour en ajouter un.</p>}
        </div>
      </section>
    </>
  )
}