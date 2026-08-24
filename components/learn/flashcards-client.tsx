'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { IconAdd, IconCheck, IconChevron, IconClose, IconSparkles } from '@/components/icons'
import { BAC_TRACKS, type TrackId, type TrackProgram, type Chapter } from '@/lib/bac-curriculum'

interface FlashcardRow {
  id: string
  trackId: string
  chapterId: string | null
  front: string
  back: string
  ease: number
  intervalDays: number
  repetitions: number
  dueAt: string
  createdAt: string
}

interface FlashcardsClientProps {
  initial: { cards: FlashcardRow[]; track: { id: string; title: string; color: string } | null; stats: { total: number; dueCount: number; mastered: number } } | null
}

interface ReviewCard { id: string; front: string; back: string }

export function FlashcardsClient({ initial }: FlashcardsClientProps) {
  const [trackId, setTrackId] = useState<TrackId | null>(initial?.track?.id as TrackId | null ?? null)
  const [chapterId, setChapterId] = useState<string | null>(null)
  const [cards, setCards] = useState<FlashcardRow[]>(initial?.cards ?? [])
  const [stats, setStats] = useState(initial?.stats ?? { total: 0, dueCount: 0, mastered: 0 })
  const [review, setReview] = useState<ReviewCard[]>([])
  const [loading, setLoading] = useState(false)
  const [activeCardIdx, setActiveCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [pending, setPending] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')
  const [error, setError] = useState('')

  const track: TrackProgram | undefined = useMemo(() => trackId ? BAC_TRACKS.find((t) => t.id === trackId) : undefined, [trackId])
  const chapters: Chapter[] = track?.chapters ?? []

  async function loadCards(tid: TrackId, cid: string | null) {
    setLoading(true)
    try {
      const url = cid ? `/api/flashcards?trackId=${tid}&chapterId=${cid}` : `/api/flashcards?trackId=${tid}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Erreur')
      const data = await res.json()
      setCards(data.cards)
      setStats(data.stats)
      // Auto-start session on first card.
      startReviewSession(data.cards)
    } catch (e) {
      setError('Impossible de charger les flashcards.')
    } finally {
      setLoading(false)
    }
  }

  function startReviewSession(all: FlashcardRow[]) {
    const now = Date.now()
    const due = all.filter((c) => new Date(c.dueAt).getTime() <= now)
    setReview(due.slice(0, 20).map((c) => ({ id: c.id, front: c.front, back: c.back })))
    setActiveCardIdx(0)
    setFlipped(false)
  }

  useEffect(() => {
    if (trackId) loadCards(trackId, chapterId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId, chapterId])

  async function rate(quality: 'again' | 'hard' | 'good' | 'easy') {
    if (!review[activeCardIdx]) return
    setPending(true)
    try {
      await fetch('/api/flashcards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: review[activeCardIdx].id, rating: quality }),
      })
      if (quality === 'again') {
        // Push back to end of queue
        setReview((q) => [...q.slice(activeCardIdx + 1), review[activeCardIdx], ...q.slice(0, activeCardIdx)])
      } else {
        setReview((q) => q.filter((_, i) => i !== activeCardIdx))
      }
      setFlipped(false)
      if (quality === 'again') {
        // stay at same index (next card shifts into slot)
      } else {
        // activeCardIdx stays at 0 (next card already moved into slot)
      }
      // Reload stats
      if (trackId) loadCards(trackId, chapterId)
    } catch {
      setError('Échec de la sauvegarde.')
    } finally {
      setPending(false)
    }
  }

  async function addCard(e: React.FormEvent) {
    e.preventDefault()
    if (!trackId || !newFront.trim() || !newBack.trim()) return
    setPending(true)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          chapterId,
          front: newFront.trim(),
          back: newBack.trim(),
        }),
      })
      if (res.ok) {
        setNewFront('')
        setNewBack('')
        setShowAdd(false)
        loadCards(trackId, chapterId)
      }
    } finally {
      setPending(false)
    }
  }

  async function removeCard(id: string) {
    await fetch(`/api/flashcards?id=${id}`, { method: 'DELETE' })
    if (trackId) loadCards(trackId, chapterId)
  }

  const activeCard = review[activeCardIdx]
  const masteredPct = stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0

  return (
    <div className="fc-layout">
      <aside className="fc-sidebar">
        <h3>Matières</h3>
        <ul className="fc-track-list">
          {BAC_TRACKS.map((t) => (
            <li key={t.id}>
              <button
                className={`fc-track ${trackId === t.id ? 'is-active' : ''}`}
                onClick={() => { setTrackId(t.id); setChapterId(null) }}
                style={{ ['--track-color' as string]: t.color } as React.CSSProperties}
              >
                <span className="fc-track-dot" />
                <span>{t.title}</span>
              </button>
            </li>
          ))}
        </ul>

        {chapters.length > 0 && (
          <>
            <h3>Chapitres</h3>
            <ul className="fc-chapter-list">
              <li>
                <button className={`fc-chapter ${!chapterId ? 'is-active' : ''}`} onClick={() => setChapterId(null)}>
                  Tout le programme
                </button>
              </li>
              {chapters.map((c) => (
                <li key={c.id}>
                  <button className={`fc-chapter ${chapterId === c.id ? 'is-active' : ''}`} onClick={() => setChapterId(c.id)}>
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      <section className="fc-main">
        {track && (
          <header className="fc-head">
            <div>
              <p className="eyebrow">Flashcards · {track.title}</p>
              <h1>{chapterId ? chapters.find((c) => c.id === chapterId)?.title ?? track.title : `Tout ${track.title}`}</h1>
            </div>
            <div className="fc-stats">
              <div><strong>{stats.dueCount}</strong><span>à revoir</span></div>
              <div><strong>{stats.total - stats.mastered}</strong><span>en cours</span></div>
              <div><strong>{stats.mastered}</strong><span>maîtrisées</span></div>
            </div>
          </header>
        )}

        {!track && (
          <div className="fc-empty">
            <IconSparkles size={28} />
            <h2>Choisis une matière pour réviser.</h2>
            <p>Flashcards avec répétition espacée (SM-2). Le contenu est pré-rempli pour chaque chapitre.</p>
          </div>
        )}

        {track && activeCard && (
          <div className="fc-review">
            <div className={`fc-card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
              <div className="fc-card-face fc-card-front">
                <span className="fc-label">Question</span>
                <p>{activeCard.front}</p>
              </div>
              <div className="fc-card-face fc-card-back">
                <span className="fc-label">Réponse</span>
                <p>{activeCard.back}</p>
              </div>
            </div>

            <div className="fc-actions">
              <button className="fc-rating fc-again" disabled={pending} onClick={() => rate('again')}>
                <strong>Encore</strong>
                <small>≤ 1 min</small>
              </button>
              <button className="fc-rating fc-hard" disabled={pending} onClick={() => rate('hard')}>
                <strong>Difficile</strong>
                <small>~ 10 min</small>
              </button>
              <button className="fc-rating fc-good" disabled={pending} onClick={() => rate('good')}>
                <strong>Bien</strong>
                <small>~ 1 jour</small>
              </button>
              <button className="fc-rating fc-easy" disabled={pending} onClick={() => rate('easy')}>
                <strong>Facile</strong>
                <small>~ 4 jours</small>
              </button>
            </div>

            <p className="fc-progress">{review.length - activeCardIdx} carte{(review.length - activeCardIdx) > 1 ? 's' : ''} restante{(review.length - activeCardIdx) > 1 ? 's' : ''} dans cette session</p>
          </div>
        )}

        {track && !activeCard && stats.total > 0 && (
          <div className="fc-empty success">
            <IconCheck size={28} />
            <h2>Tu es à jour !</h2>
            <p>{stats.mastered} carte{stats.mastered > 1 ? 's' : ''} maîtrisée{stats.mastered > 1 ? 's' : ''} · {masteredPct}% du deck.</p>
            <button className="ghost-button" onClick={() => startReviewSession(cards)}>Réviser tout</button>
          </div>
        )}

        {track && stats.total === 0 && !loading && (
          <div className="fc-empty">
            <h2>Aucune carte dans ce chapitre.</h2>
            <p>Choisis un chapitre ou ajoute ta première carte.</p>
            <button className="primary-button" onClick={() => setShowAdd(true)}>
              <IconAdd size={16} /> Créer une carte
            </button>
          </div>
        )}

        <div className="fc-list">
          <div className="fc-list-head">
            <h3>Toutes les cartes ({stats.total})</h3>
            <button className="ghost-button small" onClick={() => setShowAdd((v) => !v)}>
              <IconAdd size={14} /> Nouvelle
            </button>
          </div>
          {showAdd && (
            <form className="fc-add-form" onSubmit={addCard}>
              <label><span>Recto</span><input value={newFront} onChange={(e) => setNewFront(e.target.value)} required placeholder="Question ou terme" /></label>
              <label><span>Verso</span><textarea value={newBack} onChange={(e) => setNewBack(e.target.value)} required rows={2} placeholder="Réponse, formule, définition…" /></label>
              <div className="fc-add-actions">
                <button type="button" className="ghost-button small" onClick={() => setShowAdd(false)}>Annuler</button>
                <button type="submit" className="primary-button small" disabled={pending}>Enregistrer</button>
              </div>
            </form>
          )}
          <ul>
            {cards.slice(0, 50).map((c) => (
              <li key={c.id}>
                <span className="fc-card-front-line">{c.front}</span>
                <small>{c.repetitions >= 5 ? 'Maîtrisée' : `Répétée ${c.repetitions}×`}</small>
                <button className="ghost-button small" onClick={() => removeCard(c.id)} aria-label="Supprimer">
                  <IconClose size={12} />
                </button>
              </li>
            ))}
          </ul>
          {error && <p className="auth-error" role="alert">{error}</p>}
        </div>
      </section>
    </div>
  )
}