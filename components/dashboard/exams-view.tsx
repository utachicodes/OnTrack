'use client'

import { IconAdd, IconClose } from '@/components/icons'
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

export function ExamsView({ exams, nowMs, onProgress, onDelete, onAdd }: ExamsProps) {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Préparation</p><h2>Examens</h2></div></div>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Tes examens à venir</h3>
            <span>Ajuste ta progression au fil de tes révisions</span>
          </div>
          <button className="round-add" onClick={onAdd} aria-label="Ajouter"><IconAdd size={16} /></button>
        </div>
        <div className="exams-list">
          {exams.map((exam) => {
            const days = daysUntil(exam.examAt, nowMs)
            return (
              <div className="exam-card" key={exam.id}>
                <div className="exam-card-head">
                  <div>
                    <strong>{exam.title}</strong>
                    <span>{exam.subject} - {new Date(exam.examAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <span className={`days-badge ${days <= 14 ? 'urgent' : ''}`}>J-{days}</span>
                </div>
                <div className="progress-row">
                  <input
                    type="range"
                    min={0} max={100} step={5}
                    value={exam.preparationPercent}
                    onChange={(e) => onProgress(exam.id, Number(e.target.value))}
                    aria-label="Progression"
                  />
                  <strong>{exam.preparationPercent}%</strong>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onDelete(exam.id)}>
                  <IconClose size={12} /> Retirer
                </Button>
              </div>
            )
          })}
          {exams.length === 0 && <p className="empty-line">Aucun examen. Clique sur + pour en ajouter un.</p>}
        </div>
      </section>
    </>
  )
}
