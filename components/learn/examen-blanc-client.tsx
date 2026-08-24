'use client'

import { useEffect, useMemo, useState } from 'react'
import { IconArrow, IconCheck, IconChevron, IconClose, IconSparkles } from '@/components/icons'
import { BAC_TRACKS, type TrackId } from '@/lib/bac-curriculum'
import { questionsByTrack } from '@/lib/bac-questions'

interface Question {
  id: string
  q: string
  options: string[]
  chapterId: string
  difficulty: number
}

interface PastExam {
  id: string
  trackId: string
  score: number | null
  total: number
  status: string
  startedAt: string
  completedAt: string | null
}

interface Detail {
  id: string
  q: string
  options: string[]
  answer: number
  given: number
  isCorrect: boolean
  explanation: string
  chapterId: string
  difficulty: number
}

interface ExamClientProps {
  initial: {
    poolSize: number
    past: PastExam[]
    lastByTrack: Record<string, { score: number; date: string }>
  }
}

const DIFFICULTY_LABELS = ['', 'Facile', 'Accessible', 'Intermédiaire', 'Difficile', 'Expert']

export function ExamenBlancClient({ initial }: ExamClientProps) {
  const [trackId, setTrackId] = useState<TrackId>('maths')
  const [count, setCount] = useState(20)
  const [duration, setDuration] = useState(60)
  const [phase, setPhase] = useState<'config' | 'running' | 'results'>('config')
  const [examId, setExamId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [remainingSec, setRemainingSec] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<{
    score: number
    total: number
    correct: number
    detail: Detail[]
  } | null>(null)
  const [past, setPast] = useState<PastExam[]>(initial.past)

  const pool = useMemo(() => questionsByTrack(trackId), [trackId])
  const track = useMemo(() => BAC_TRACKS.find((t) => t.id === trackId)!, [trackId])

  // Timer
  useEffect(() => {
    if (phase !== 'running') return
    const id = setInterval(() => {
      setRemainingSec((s) => {
        if (s <= 1) { clearInterval(id); void submit(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  async function start() {
    const res = await fetch('/api/examen-blanc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackId, count, duration }),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error ?? 'Erreur'); return }
    setExamId(data.examId)
    setQuestions(data.questions)
    setAnswers({})
    setRemainingSec(duration * 60)
    setPhase('running')
  }

  async function submit() {
    if (!examId || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/examen-blanc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, answers }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error ?? 'Erreur'); return }
      setResults(data)
      setPhase('results')
      // Refresh history
      fetch('/api/examen-blanc').then((r) => r.ok ? r.json() : null).then((d) => {
        if (d) setPast(d.past)
      })
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setExamId(null)
    setQuestions([])
    setAnswers({})
    setResults(null)
    setRemainingSec(0)
    setPhase('config')
  }

  const totalAnswered = Object.keys(answers).length
  const mm = Math.floor(remainingSec / 60)
  const ss = remainingSec % 60

  return (
    <div className="exam-layout">
      <aside className="exam-sidebar">
        <h3>Matière</h3>
        <ul className="fc-track-list">
          {BAC_TRACKS.map((t) => (
            <li key={t.id}>
              <button
                className={`fc-track ${trackId === t.id ? 'is-active' : ''}`}
                onClick={() => { setTrackId(t.id); reset() }}
                style={{ ['--track-color' as string]: t.color } as React.CSSProperties}
                disabled={phase === 'running'}
              >
                <span className="fc-track-dot" />
                <span>{t.title}</span>
              </button>
            </li>
          ))}
        </ul>

        <h3>Historique</h3>
        <ul className="exam-history">
          {past.filter((p) => p.trackId === trackId).slice(0, 5).map((p) => (
            <li key={p.id}>
              <strong>{p.score ?? 0}%</strong>
              <span>{p.total} questions · {new Date(p.startedAt).toLocaleDateString('fr-FR')}</span>
            </li>
          ))}
          {past.filter((p) => p.trackId === trackId).length === 0 && (
            <li className="empty-line">Aucun examen passé.</li>
          )}
        </ul>
      </aside>

      <section className="exam-main">
        {phase === 'config' && (
          <div className="exam-config">
            <div className="exam-config-head">
              <p className="eyebrow">Examen blanc</p>
              <h1>{track.title}</h1>
              <p className="subhead">
                {pool.length} questions disponibles · génère un sujet chronométré, mélange les questions,
                note tes réponses puis obtiens un score détaillé avec explications et corrections.
              </p>
            </div>

            <div className="exam-config-grid">
              <label className="auth-field">
                <span>Nombre de questions</span>
                <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                  {[10, 15, 20, 25, 30].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="auth-field">
                <span>Durée (minutes)</span>
                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                  {[20, 30, 45, 60, 90, 120].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <div className="auth-field">
                <span>Coefficient</span>
                <strong className="exam-coef">{track.coefficient}</strong>
              </div>
              <div className="auth-field">
                <span>Format</span>
                <strong className="exam-coef">{track.examDuration}</strong>
              </div>
            </div>

            <div className="exam-config-cta">
              <button className="primary-button" onClick={start} disabled={pool.length < count}>
                <IconSparkles size={16} /> Démarrer l’examen blanc
              </button>
              {pool.length < count && (
                <p className="empty-line">Pas assez de questions ({pool.length}) dans ce pool.</p>
              )}
            </div>
          </div>
        )}

        {phase === 'running' && (
          <div className="exam-running">
            <header className="exam-run-head">
              <div>
                <p className="eyebrow">En cours</p>
                <h2>{track.title} · {questions.length} questions</h2>
              </div>
              <div className="exam-timer">
                <span className="timer-label">Temps restant</span>
                <span className="timer-value">{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}</span>
              </div>
              <div className="exam-progress-mini">
                <span>{totalAnswered}/{questions.length} répondues</span>
              </div>
            </header>

            <ol className="exam-questions">
              {questions.map((q, idx) => (
                <li key={q.id}>
                  <div className="exam-q-head">
                    <strong>Question {idx + 1}</strong>
                    <small>{DIFFICULTY_LABELS[q.difficulty] ?? ''} · {q.chapterId}</small>
                  </div>
                  <p className="exam-q-text">{q.q}</p>
                  <div className="quiz-options">
                    {q.options.map((opt, o) => {
                      const selected = answers[q.id] === o
                      return (
                        <button
                          key={o}
                          type="button"
                          className={`quiz-option ${selected ? 'is-selected' : ''}`}
                          onClick={() => setAnswers((cur) => ({ ...cur, [q.id]: o }))}
                        >
                          <span className="quiz-letter">{String.fromCharCode(65 + o)}</span>
                          <span>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ol>

            <div className="exam-run-foot">
              <button className="ghost-button" onClick={reset}>Annuler</button>
              <button className="primary-button" disabled={submitting} onClick={submit}>
                <IconCheck size={16} /> Rendre la copie ({totalAnswered}/{questions.length})
              </button>
            </div>
          </div>
        )}

        {phase === 'results' && results && (
          <div className="exam-results">
            <header className="exam-result-head">
              <div className={`exam-score-circle ${results.score >= 80 ? 'is-pass' : results.score >= 50 ? 'is-mid' : 'is-fail'}`}>
                <strong>{results.score}</strong>
                <span>/ 100</span>
              </div>
              <div>
                <p className="eyebrow">Résultat</p>
                <h2>{track.title}</h2>
                <p className="subhead">
                  {results.correct} bonne{results.correct > 1 ? 's' : ''} réponse{results.correct > 1 ? 's' : ''} sur {results.total}.
                  {results.score >= 80 && ' Excellent !'}
                  {results.score >= 50 && results.score < 80 && ' Continue, tu peux y arriver.'}
                  {results.score < 50 && ' Révise les flashcards et recommence.'}
                </p>
              </div>
              <div className="exam-result-actions">
                <button className="ghost-button" onClick={reset}>Nouvel examen</button>
                <a href="/flashcards" className="primary-button">Réviser avec les flashcards <IconChevron size={14} /></a>
              </div>
            </header>

            <h3>Corrigé détaillé</h3>
            <ol className="exam-detail">
              {results.detail.map((d, i) => (
                <li key={d.id} className={d.isCorrect ? 'is-correct' : 'is-wrong'}>
                  <div className="exam-q-head">
                    <strong>Question {i + 1}</strong>
                    <small>{DIFFICULTY_LABELS[d.difficulty] ?? ''} · {d.chapterId}</small>
                    <span className={`exam-verdict ${d.isCorrect ? 'is-correct' : 'is-wrong'}`}>
                      {d.isCorrect ? 'Juste' : 'Faux'}
                    </span>
                  </div>
                  <p className="exam-q-text">{d.q}</p>
                  <div className="quiz-options">
                    {d.options.map((opt, o) => {
                      const isCorrect = d.answer === o
                      const wasChosen = d.given === o
                      return (
                        <div
                          key={o}
                          className={`quiz-option ${isCorrect ? 'is-correct' : ''} ${wasChosen && !isCorrect ? 'is-wrong' : ''}`}
                        >
                          <span className="quiz-letter">{String.fromCharCode(65 + o)}</span>
                          <span>{opt}</span>
                          {isCorrect && <IconCheck size={14} aria-hidden="true" />}
                        </div>
                      )
                    })}
                  </div>
                  <p className="exam-explanation">{d.explanation}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  )
}