'use client'

import { useState } from 'react'
import { IconAdd, IconClose, IconCheck, IconPen } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { readLocal, writeLocal } from './helpers'

interface Goal {
  id: string
  title: string
  target: string
  progress: number // 0-100
  done: boolean
  category: string
}

const CATEGORIES = ['Académique', 'Personnel', 'Bien-être', 'Projet']
const GOAL_KEY = 'ontrack.goals'

export function GoalsView() {
  const [items, setItems] = useState<Goal[]>(() => readLocal<Goal[]>(GOAL_KEY, []))
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editProgress, setEditProgress] = useState(0)

  function commit() {
    if (!title.trim()) return
    const next = [...items, { id: crypto.randomUUID(), title: title.trim(), target: target.trim() || '-', progress: 0, done: false, category }]
    setItems(next); writeLocal(GOAL_KEY, next)
    setTitle(''); setTarget('')
  }

  function update(id: string, patch: Partial<Goal>) {
    const next = items.map((g) => g.id === id ? { ...g, ...patch } : g)
    setItems(next); writeLocal(GOAL_KEY, next)
  }

  function remove(id: string) {
    setItems((cur) => { const next = cur.filter((g) => g.id !== id); writeLocal(GOAL_KEY, next); return next })
  }

  const done = items.filter((g) => g.done).length
  const avg = items.length ? Math.round(items.reduce((s, g) => s + (g.done ? 100 : g.progress), 0) / items.length) : 0

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Vision</p><h2>Objectifs</h2></div></div>

      <div className="task-stats">
        <div className="stat-card"><p className="eyebrow">Objectifs</p><strong>{items.length}</strong><span>enregistrés</span></div>
        <div className="stat-card"><p className="eyebrow">Terminés</p><strong>{done}</strong><span>coches complétées</span></div>
        <div className="stat-card stat-accent"><p className="eyebrow">Avancement moyen</p><strong>{avg}%</strong><span>vers tes objectifs</span></div>
      </div>

      <section className="panel">
        <div className="panel-header"><div><h3>Objectifs personnels</h3><span>Stockés sur cet appareil</span></div></div>
        <form
          className="doc-upload"
          onSubmit={(e) => { e.preventDefault(); commit() }}
        >
          <Label>
            Intitulé
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex. Avoir 14 de moyenne en maths" />
          </Label>
          <Label>
            Cible / date
            <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Ex. Fin mars" />
          </Label>
          <div className="goal-cat">
            <Label>
              Catégorie
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Label>
            <Button type="submit" variant="default"><IconAdd size={14} /> Ajouter</Button>
          </div>
        </form>
        <ul className="goal-list">
          {items.map((g) => (
            <li key={g.id}>
              <button className={`check-circle ${g.done ? 'is-checked' : ''}`} onClick={() => update(g.id, { done: !g.done, ...(g.done ? {} : { progress: 100 }) })}>
                {g.done && <IconCheck size={10} />}
              </button>
              <div className="goal-main">
                <div className="goal-title-row">
                  <strong style={{ textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</strong>
                  <span className="pill pill-amber">{g.category}</span>
                </div>
                <small>{g.target}</small>
                {!g.done && (
                  <div className="goal-progress">
                    <div className="progress-line thin"><span style={{ width: `${g.progress}%` }} /></div>
                    <span className="goal-pct">{g.progress}%</span>
                    <button
                      className="goal-edit"
                      onClick={() => { if (editingId === g.id) { setEditingId(null); update(g.id, { progress: editProgress }) } else { setEditingId(g.id); setEditProgress(g.progress) } }}
                      aria-label="Ajuster la progression"
                    >
                      <IconPen size={11} />
                    </button>
                    {editingId === g.id && (
                      <input type="range" min={0} max={100} step={5} value={editProgress} onChange={(e) => setEditProgress(Number(e.target.value))} className="goal-slider" aria-label="Progression" />
                    )}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon-xs" onClick={() => remove(g.id)} aria-label="Supprimer"><IconClose size={12} /></Button>
            </li>
          ))}
          {items.length === 0 && <p className="empty-line">Aucun objectif pour l&apos;instant. Définis ce que tu veux accomplir.</p>}
        </ul>
      </section>
    </>
  )
}