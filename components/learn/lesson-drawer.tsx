'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, ChevronRight, Sparkles, X } from 'lucide-react'
import type { Lesson } from '@/lib/curriculum'
import { LessonWidget } from '@/components/learn/lesson-widget'

interface LessonDrawerProps {
  lesson: Lesson
  alreadyDone: boolean
  onClose: () => void
  onCompleted: (lessonId: string, score: number) => void
}

export function LessonDrawer({ lesson, alreadyDone, onClose, onCompleted }: LessonDrawerProps) {
  const [step, setStep] = useState<'intro' | 'practice' | 'quiz' | 'done'>(alreadyDone ? 'done' : 'intro')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [score, setScore] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reward, setReward] = useState<{ xpAwarded: number; totalXp: number; level: number } | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const correctCount = lesson.quiz.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
  const pct = lesson.quiz.length ? Math.round((correctCount / lesson.quiz.length) * 100) : 0

  async function submit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, score: pct }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Impossible d’enregistrer la progression.')
        setSubmitting(false)
        return
      }
      setScore(pct)
      setReward({ xpAwarded: data.xpAwarded ?? 0, totalXp: data.totalXp ?? 0, level: data.level ?? 1 })
      onCompleted(lesson.id, pct)
      setStep('done')
    } catch {
      setError('Connexion impossible. Réessaie.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={lesson.title}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-head">
          <div>
            <p className="legal-eyebrow">Leçon · {lesson.minutes} min</p>
            <h2>{lesson.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer"><X size={20} /></button>
        </header>

        <div className="drawer-progress">
          {(['intro', 'practice', 'quiz', 'done'] as const).map((s, i) => {
            const order = ['intro', 'practice', 'quiz', 'done']
            const active = order.indexOf(step) >= i
            return <span key={s} className={`pip ${active ? 'is-active' : ''}`} />
          })}
        </div>

        <div className="drawer-body">
          {step === 'intro' && (
            <div className="lesson-section">
              {lesson.intro.map((p, i) => <p key={i}>{p}</p>)}
              <h3>À retenir</h3>
              <ul>{lesson.keyPoints.map((k, i) => <li key={i}>{k}</li>)}</ul>
              {lesson.widget && (
                <div className="lesson-widget-wrap">
                  <LessonWidget spec={lesson.widget} />
                </div>
              )}
              <button className="primary-button" onClick={() => setStep('practice')}>
                {lesson.widget ? 'J’ai pratiqué' : 'Commencer le quiz'} <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 'practice' && lesson.widget && (
            <div className="lesson-section">
              <h3>Entraîne-toi</h3>
              <LessonWidget spec={lesson.widget} />
              <button className="primary-button" onClick={() => setStep('quiz')}>
                Prêt pour le quiz <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 'practice' && !lesson.widget && (
            <div className="lesson-section">
              <p>Cette leçon n’a pas d’exercice interactif. Passe directement au quiz.</p>
              <button className="primary-button" onClick={() => setStep('quiz')}>Démarrer le quiz <ChevronRight size={16} /></button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="lesson-section">
              <h3>Quiz · {lesson.quiz.length} questions</h3>
              <ol className="quiz-list">
                {lesson.quiz.map((q, i) => (
                  <li key={i}>
                    <strong>{q.q}</strong>
                    <div className="quiz-options">
                      {q.options.map((opt, o) => {
                        const selected = answers[i] === o
                        const correct = lesson.quiz[i].answer === o
                        const showResult = score !== null
                        return (
                          <button
                            key={o}
                            type="button"
                            className={`quiz-option ${selected ? 'is-selected' : ''} ${showResult && correct ? 'is-correct' : ''} ${showResult && selected && !correct ? 'is-wrong' : ''}`}
                            onClick={() => setAnswers((cur) => ({ ...cur, [i]: o }))}
                            disabled={score !== null}
                          >
                            <span className="quiz-letter">{String.fromCharCode(65 + o)}</span>
                            <span>{opt}</span>
                            {showResult && correct && <Check size={14} aria-hidden="true" />}
                          </button>
                        )
                      })}
                    </div>
                  </li>
                ))}
              </ol>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="primary-button" disabled={Object.keys(answers).length < lesson.quiz.length || submitting} onClick={submit}>
                {submitting ? <Loader2 size={16} className="auth-spin" /> : <Sparkles size={16} />}
                {submitting ? 'Validation…' : `Valider (${correctCount}/${lesson.quiz.length})`}
              </button>
            </div>
          )}

          {step === 'done' && (
            <div className="lesson-section lesson-done">
              {reward ? (
                <>
                  <div className="done-icon"><Sparkles size={28} aria-hidden="true" /></div>
                  <h3>Bravo !</h3>
                  <p>Tu as marqué <strong>{score}%</strong> à ce quiz.</p>
                  <p className="reward">+{reward.xpAwarded} XP · Niveau {reward.level} · Total {reward.totalXp} XP</p>
                </>
              ) : (
                <>
                  <div className="done-icon"><Check size={28} aria-hidden="true" /></div>
                  <h3>Leçon déjà terminée</h3>
                  <p>Tu peux la refaire pour t’entraîner, mais l’XP a déjà été ajoutée.</p>
                </>
              )}
              <button className="primary-button" onClick={onClose}>Continuer <ArrowUpRight size={16} /></button>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}