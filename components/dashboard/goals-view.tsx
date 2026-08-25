'use client'

import { useState } from 'react'
import { IconAdd, IconClose, IconCheck } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { readLocal, writeLocal } from './helpers'

export function GoalsView() {
  const [items, setItems] = useState<Array<{ id: string; title: string; target: string; done: boolean }>>(() => readLocal('ontrack.goals', []))
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Vision</p><h2>Objectifs</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Objectifs personnels</h3><span>Stockés sur cet appareil</span></div></div>
        <form
          className="doc-upload"
          onSubmit={(e) => {
            e.preventDefault()
            if (!title.trim()) return
            const next = [...items, { id: crypto.randomUUID(), title: title.trim(), target: target.trim() || '-', done: false }]
            setItems(next); writeLocal('ontrack.goals', next)
            setTitle(''); setTarget('')
          }}
        >
          <Label>
            Intitulé
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex. Avoir 14 de moyenne en maths" />
          </Label>
          <Label>
            Cible / date
            <Input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Ex. Fin mars" />
          </Label>
          <Button type="submit" variant="default"><IconAdd size={14} /> Ajouter</Button>
        </form>
        <ul className="goal-list">
          {items.map((g) => (
            <li key={g.id}>
              <button className={`check-circle ${g.done ? 'is-checked' : ''}`} onClick={() => {
                const next = items.map((x) => x.id === g.id ? { ...x, done: !x.done } : x)
                setItems(next); writeLocal('ontrack.goals', next)
              }}>{g.done && <IconCheck size={10} />}</button>
              <div><strong style={{ textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</strong><small>{g.target}</small></div>
              <Button variant="ghost" size="icon-xs" onClick={() => {
                const next = items.filter((x) => x.id !== g.id); setItems(next); writeLocal('ontrack.goals', next)
              }}><IconClose size={12} /></Button>
            </li>
          ))}
          {items.length === 0 && <p className="empty-line">Aucun objectif pour l&apos;instant.</p>}
        </ul>
      </section>
    </>
  )
}
