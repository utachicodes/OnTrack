'use client'

import { useState } from 'react'
import { IconAdd, IconClose, IconCheck } from '@/components/icons'
import { Button } from '@/components/ui/button'
import type { Task } from './types'
import { formatDue, accentClass } from './helpers'

interface TasksProps {
  tasks: Task[]
  nowMs: number
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function TasksView({ tasks, nowMs, onToggle, onDelete, onAdd }: TasksProps) {
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all')
  const filtered = tasks.filter((t) => filter === 'all' || t.status === filter)
  return (
    <>
      <div className="section-heading">
        <div><p className="eyebrow">Espace de travail</p><h2>Tâches</h2></div>
        <div className="segmented">
          {(['all', 'todo', 'done'] as const).map((k) => (
            <button key={k} className={filter === k ? 'is-active' : ''} onClick={() => setFilter(k)}>
              {k === 'all' ? 'Toutes' : k === 'todo' ? 'À faire' : 'Faites'}
            </button>
          ))}
        </div>
      </div>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>{filtered.length} tâche{filtered.length > 1 ? 's' : ''}</h3>
            <span>Clique pour terminer - croix pour supprimer</span>
          </div>
          <button className="round-add" onClick={onAdd} aria-label="Ajouter"><IconAdd size={16} /></button>
        </div>
        <div className="task-list">
          {filtered.map((task) => {
            const due = formatDue(task.dueAt, nowMs)
            return (
              <div className={`task-row ${task.status === 'done' ? 'is-done' : ''}`} key={task.id}>
                <button className="check-btn" onClick={() => onToggle(task.id)} aria-label="Basculer">
                  <span className={`check-circle ${task.status === 'done' ? 'is-checked' : ''}`}>
                    {task.status === 'done' && <IconCheck size={10} />}
                  </span>
                </button>
                <div className="task-body">
                  <strong>{task.title}</strong>
                  <small><span className={`pill ${accentClass(task.priority)}`}>{task.subject}</span> - {task.estimatedMinutes} min</small>
                </div>
                <span className="task-due" style={{ color: due.color }}>{due.label}</span>
                <Button variant="ghost" size="icon-xs" onClick={() => onDelete(task.id)} aria-label="Supprimer">
                  <IconClose size={12} />
                </Button>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="empty-line">Rien à afficher ici.</p>}
        </div>
      </section>
    </>
  )
}
