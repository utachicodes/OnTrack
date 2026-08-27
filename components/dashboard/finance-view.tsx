'use client'

import { useState } from 'react'
import { IconAdd, IconClose, IconTrending } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { readLocal, writeLocal } from './helpers'

interface Tx {
  id: string
  kind: 'income' | 'expense'
  label: string
  amount: number
  category: string
  at: string // yyyy-mm-dd
}

const CATEGORIES = ['Sorties', 'Courses', 'Transports', 'Téléphone', 'Loisirs', 'Cantine', 'Autre']
const LOCAL_KEY = 'ontrack.finance'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function eur(n: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n)
}

export function FinanceView() {
  const [txs, setTxs] = useState<Tx[]>(() => readLocal<Tx[]>(LOCAL_KEY, []))
  const [kind, setKind] = useState<'income' | 'expense'>('expense')
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [month, setMonth] = useState(() => todayISO().slice(0, 7))

  const balance = txs.reduce((s, t) => s + (t.kind === 'income' ? t.amount : -t.amount), 0)
  const monthTxs = txs.filter((t) => t.at.startsWith(month))
  const income = monthTxs.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
  const spent = monthTxs.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)
  const byCat = monthTxs
    .filter((t) => t.kind === 'expense')
    .reduce<Record<string, number>>((m, t) => { m[t.category] = (m[t.category] ?? 0) + t.amount; return m }, {})

  function commit() {
    const n = Number(amount)
    if (!label.trim() || !n || n <= 0) return
    const next = [{ id: crypto.randomUUID(), kind, label: label.trim(), amount: n, category: kind === 'expense' ? category : 'Revenu', at: todayISO() }, ...txs]
    setTxs(next); writeLocal(LOCAL_KEY, next)
    setLabel(''); setAmount('')
  }

  function remove(id: string) {
    const next = txs.filter((t) => t.id !== id)
    setTxs(next); writeLocal(LOCAL_KEY, next)
  }

  const maxCat = Math.max(1, ...Object.values(byCat))

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Portefeuille</p><h2>Finances</h2></div></div>

      <div className="finance-stats">
        <div className="stat-card stat-balance">
          <p className="eyebrow">Solde</p>
          <strong className={balance < 0 ? 'is-neg' : ''}>{eur(balance)}</strong>
          <span>toutes opérations confondues</span>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Entrées ce mois</p>
          <strong>{eur(income)}</strong>
          <span>{month.replace('-', ' / ')}</span>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Dépenses ce mois</p>
          <strong>{eur(spent)}</strong>
          <span>{income > 0 ? `${Math.round((spent / income) * 100)}% des entrées` : 'aucune entrée enregistrée'}</span>
        </div>
      </div>

      <div className="finance-layout">
        <section className="panel">
          <div className="panel-header">
            <div><h3>Nouvelle opération</h3><span>Argent de poche, cours, sorties…</span></div>
          </div>
          <div className="segmented">
            <button className={kind === 'expense' ? 'is-active' : ''} onClick={() => setKind('expense')}>Dépense</button>
            <button className={kind === 'income' ? 'is-active' : ''} onClick={() => setKind('income')}>Entrée</button>
          </div>
          <form
            className="finance-form"
            onSubmit={(e) => { e.preventDefault(); commit() }}
          >
            <Label>
              Intitulé
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex. Cinéma, bourse de la semaine" />
            </Label>
            <Label>
              Montant (€)
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="0" step="0.5" placeholder="0,00" inputMode="decimal" />
            </Label>
            {kind === 'expense' && (
              <Label>
                Catégorie
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </Select>
              </Label>
            )}
            <Button type="submit" variant="default"><IconAdd size={14} /> Ajouter</Button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div><h3>Dépenses par catégorie</h3><span>{month.replace('-', ' / ')}</span></div>
            <IconTrending size={16} className="trend-icon" />
          </div>
          {Object.keys(byCat).length === 0 ? (
            <p className="empty-line">Aucune dépense ce mois-ci. Ajoute un achat pour voir la répartition.</p>
          ) : (
            <div className="cat-bars">
              {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
                <div className="cat-row" key={cat}>
                  <span className="cat-name">{cat}</span>
                  <div className="cat-track"><span style={{ width: `${(val / maxCat) * 100}%` }} /></div>
                  <strong>{eur(val)}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div><h3>Historique</h3><span>{monthTxs.length} mouvement{monthTxs.length > 1 ? 's' : ''} sur ce mois</span></div>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="month-input" aria-label="Mois" />
        </div>
        <div className="tx-list">
          {monthTxs.length === 0 && <p className="empty-line">Rien pour ce mois-ci.</p>}
          {monthTxs.map((t) => (
            <div className="tx-row" key={t.id}>
              <span className={`tx-dot ${t.kind === 'income' ? 'is-in' : 'is-out'}`} />
              <div className="tx-body">
                <strong>{t.label}</strong>
                <small>{t.category} · {new Date(t.at + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</small>
              </div>
              <span className={`tx-amount ${t.kind === 'income' ? 'is-in' : 'is-out'}`}>
                {t.kind === 'income' ? '+' : '−'}{eur(t.amount)}
              </span>
              <Button variant="ghost" size="icon-xs" onClick={() => remove(t.id)} aria-label="Supprimer"><IconClose size={12} /></Button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}