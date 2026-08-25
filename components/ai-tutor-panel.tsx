'use client'

import { useEffect, useState } from 'react'
import { Loader2, Send, Sparkles, MessageSquare, Trash2, Plus } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  listConversations,
  getConversation,
  createConversation,
  appendMessage,
  deleteConversation,
  type AIMessage,
} from '@/app/actions/conversations'

interface ConversationSummary {
  id: string
  title: string
  subject: string | null
  createdAt: Date
}

const SUBJECTS = ['Mathématiques', 'Physique', 'Français', 'Histoire', 'Philosophie', 'SVT', 'Anglais']

export function AITutorPanel() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [subject, setSubject] = useState('Mathématiques')
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<AIMessage[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    listConversations().then((rows) => {
      if (!cancelled) {
        setConversations(rows as ConversationSummary[])
        setLoaded(true)
      }
    }).catch(() => setLoaded(true))
    return () => { cancelled = true }
  }, [])

  async function loadConversation(id: string) {
    const conv = await getConversation(id)
    if (conv) {
      setActiveId(id)
      setHistory(conv.messages)
      if (conv.subject) setSubject(conv.subject)
    }
  }

  async function newConversation() {
    setActiveId(null)
    setHistory([])
    setQuestion('')
  }

  async function removeConversation(id: string) {
    await deleteConversation(id)
    setConversations((cur) => cur.filter((c) => c.id !== id))
    if (activeId === id) { setActiveId(null); setHistory([]) }
  }

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed || pending) return
    setError('')
    const userMsg: AIMessage = { role: 'user', text: trimmed }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
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
      const assistantMsg: AIMessage = { role: 'assistant', text: data.answer ?? '' }
      const finalHistory = [...newHistory, assistantMsg]
      setHistory(finalHistory)

      // Persist to DB
      if (activeId) {
        await appendMessage(activeId, finalHistory)
      } else {
        const conv = await createConversation(subject)
        await appendMessage(conv.id, finalHistory)
        setActiveId(conv.id)
        setConversations((cur) => [{ id: conv.id, title: trimmed.slice(0, 60), subject, createdAt: conv.createdAt }, ...cur])
      }
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

      {loaded && conversations.length > 0 && (
        <div className="tutor-history-list">
          <Button variant="ghost" size="sm" onClick={newConversation} className="w-full justify-start gap-2">
            <Plus size={14} /> Nouvelle conversation
          </Button>
          {conversations.slice(0, 5).map((c) => (
            <div key={c.id} className={`tutor-history-item ${activeId === c.id ? 'is-active' : ''}`}>
              <button onClick={() => loadConversation(c.id)} className="tutor-history-btn">
                <MessageSquare size={13} />
                <span>{c.title}</span>
              </button>
              <button onClick={() => removeConversation(c.id)} className="tutor-history-del" aria-label="Supprimer">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

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
          <Label className="tutor-subject">
            Matière
            <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Label>
        </div>
        <Label className="tutor-field">
          Question
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex. Comment dériver une fonction composée ?"
            rows={3}
            maxLength={2000}
            required
            className="flex min-h-[88px] w-full resize-vertical rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-text-tertiary focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/10 focus-visible:outline-none"
          />
        </Label>
        {error && <p className="tutor-error" role="alert">{error}</p>}
        <Button type="submit" variant="default" disabled={pending || !question.trim()} className="w-full">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
          {pending ? 'Réflexion…' : 'Demander'}
        </Button>
      </form>
    </div>
  )
}
