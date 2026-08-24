'use client'

import { useState } from 'react'
import { Loader2, Send, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const SUBJECTS = ['Mathématiques', 'Physique', 'Français', 'Histoire', 'Philosophie', 'SVT', 'Anglais']

export function AITutorPanel() {
  const [subject, setSubject] = useState('Mathématiques')
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<Message[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed || pending) return
    setError('')
    setHistory((h) => [...h, { role: 'user', text: trimmed }])
    setQuestion('')
    setPending(true)
    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, question: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Le tuteur IA est momentanément indisponible.')
        setPending(false)
        return
      }
      setHistory((h) => [...h, { role: 'assistant', text: data.answer ?? '' }])
    } catch {
      setError('Connexion impossible. Réessaie dans un instant.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="tutor-panel">
      <div className="tutor-head">
        <span className="tutor-icon"><Sparkles size={16} aria-hidden="true" /></span>
        <div>
          <p className="eyebrow">Tuteur IA</p>
          <h3>Une question ? Demande.</h3>
        </div>
      </div>

      {history.length > 0 && (
        <ul className="tutor-history" aria-live="polite">
          {history.map((m, i) => (
            <li key={i} className={`tutor-msg tutor-msg-${m.role}`}>
              {m.text}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={ask} className="tutor-form">
        <div className="tutor-row">
          <label className="tutor-subject">
            <span>Matière</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>
        <label className="tutor-field">
          <span>Question</span>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex. Comment dériver une fonction composée ?"
            rows={3}
            maxLength={2000}
            required
          />
        </label>
        {error && <p className="tutor-error" role="alert">{error}</p>}
        <button type="submit" className="tutor-submit" disabled={pending || !question.trim()}>
          {pending ? <Loader2 size={16} className="auth-spin" /> : <Send size={15} />}
          {pending ? 'Réflexion…' : 'Demander'}
        </button>
      </form>
    </div>
  )
}