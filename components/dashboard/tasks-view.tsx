'use client'

import { useMemo, useState } from 'react'
import { IconAdd, IconClose, IconCheck, IconSearch, IconTrending } from '@/components/icons'
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

const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const

export function TasksView({ tasks, nowMs, onToggle, onDelete, onAdd }: TasksProps) {
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all')
  const [subject, setSubject] = useState('all')
  const [priority, setPriority] = useState<'all' | Task['priority']>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'due' | 'priority' | 'created'>('due')

  const subjects = useMemo(() => [...new Set(tasks.map((t) => t.subject || 'Général'))].sort(), [tasks])
  const doneCount = tasks.filter((t) => t.status === 'done').length
  const overdue = tasks.filter((t) => t.status !== 'done' && t.dueAt && new Date(t.dueAt).getTime() < nowMs).length
  const totalMinutes = tasks.filter((t) => t.status !== 'done').reduce((s, t) => s + (t.estimatedMinutes || 0), 0)
  const pctDone = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => filter === 'all' || t.status === filter)
    if (subject !== 'all') list = list.filter((t) => (t.subject || 'Général') === subject)
    if (priority !== 'all') list = list.filter((t) => t.priority === priority)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((t) => t.title.toLowerCase().includes(q) || (t.subject || '').toLowerCase().includes(q))
    }
    const rank = { high: 0, medium: 1, low: 2 } as const
    return [...list].sort((a, b) => {
      if (sort === 'priority') return rank[a.priority] - rank[b.priority]
      if (sort === 'created') return (a.id < b.id ? 1 : -1)
      const da = a.dueAt ? new Date(a.dueAt).getTime() : Infinity
      const db = b.dueAt ? new Date(b.dueAt).getTime() : Infinity
      return da - db
    })
  }, [tasks, filter, subject, priority, query, sort])

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Espace de travail</p><h2>Tâches</h2></div></div>

      <div className="task-stats">
        <div className="stat-card"><p className="eyebrow">À faire</p><strong>{tasks.length - doneCount}</strong><span>tâche{tasks.length - doneCount > 1 ? 's' : ''} ouverte{tasks.length - doneCount > 1 ? 's' : ''}</span></div>
        <div className="stat-card"><p className="eyebrow">En retard</p><strong className={overdue ? 'is-neg' : ''}>{overdue}</strong><span>échéance dépassée</span></div>
        <div className="stat-card"><p className="eyebrow">Temps restant</p><strong>{Math.round(totalMinutes / 60)}h{totalMinutes % 60}m</strong><span>estimé à planifier</span></div>
        <div className="stat-card"><p className="eyebrow">Progression</p><strong>{pctDone}%</strong><span>{doneCount} terminée{doneCount > 1 ? 's' : ''}</span></div>
      </div>

      {overdue > 0 && (
        <div className="overdue-banner">
          <IconTrending size={15} />
          <span>Tu as <strong>{overdue}</strong> tâche{overdue > 1 ? 's' : ''} en retard. Démarre par la plus proche.</span>
        </div>
      )}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>{filtered.length} tâche{filtered.length > 1 ? 's' : ''}</h3>
            <span>Clique pour terminer - croix pour supprimer</span>
          </div>
          <button className="round-add" onClick={onAdd} aria-label="Ajouter"><IconAdd size={16} /></button>
        </div>

        <div className="filterbar">
          <div className="segmented">
            {(['all', 'todo', 'done'] as const).map((k) => (
              <button key={k} className={filter === k ? 'is-active' : ''} onClick={() => setFilter(k)}>
                {k === 'all' ? 'Toutes' : k === 'todo' ? 'À faire' : 'Faites'}
              </button>
            ))}
          </div>
          <div className="filter-controls">
            <div className="filter-search">
              <IconSearch size={13} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" />
            </div>
            {(subjects.length > 0) && (
              <select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Matière">
                <option value="all">Toutes matières</option>
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </select>
            )}
            <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} aria-label="Priorité">
              <option value="all">Toute priorité</option>
              {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p === 'high' ? 'Haute' : p === 'medium' ? 'Moyenne' : 'Basse'}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Trier">
              <option value="due">Par échéance</option>
              <option value="priority">Par priorité</option>
              <option value="created">Récentes d'abord</option>
            </select>
          </div>
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
                  <small>
                    <span className={`pill ${accentClass(task.priority)}`}>{task.subject || 'Général'}</span>
                    {task.priority === 'high' && <span className="pill pill-coral">prioritaire</span>}
                    - {task.estimatedMinutes || 25} min
                  </small>
                </div>
                <span className="task-due" style={{ color: due.color }}>{due.label}</span>
                <Button variant="ghost" size="icon-xs" onClick={() => onDelete(task.id)} aria-label="Supprimer">
                  <IconClose size={12} />
                </Button>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="empty-line">Aucune tâche ne correspond à ces filtres.</p>}
        </div>
      </section>
    </>
  )
}