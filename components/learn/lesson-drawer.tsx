'use client'

import { useEffect, useState } from 'react'
import { IconArrow, IconCheck, IconChevron, IconClose, IconSparkles } from '@/components/icons'
import type { Lesson } from '@/lib/curriculum'
import { LessonWidget } from '@/components/learn/lesson-widget'

const PASS_THRESHOLD = 80

interface LessonDrawerProps {
  lesson: Lesson
  alreadyDone: boolean
  onClose: () => void
  onCompleted: (lessonId: string, score: number) => void
}

type Step = 'intro' | 'practice' | 'quiz' | 'result' | 'done'

interface Result {
  score: number
  passed: boolean
  xpAwarded?: number
  totalXp?: number
  level?: number
  message?: string
}

export function LessonDrawer({ lesson, alreadyDone, onClose, onCompleted }: LessonDrawerProps) {
  const [step, setStep] = useState<Step>(alreadyDone ? 'done' : 'intro')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

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
      if (res.status === 400 && data.passed === false) {
        setResult({ score: data.score, passed: false, message: data.message })
        setStep('result')
        setSubmitting(false)
        return
      }
      if (!res.ok) {
        setError(data.error ?? 'Impossible d\'enregistrer la progression.')
        setSubmitting(false)
        return
      }
      setResult({
        score: pct,
        passed: true,
        xpAwarded: data.xpAwarded,
        totalXp: data.totalXp,
        level: data.level,
      })
      onCompleted(lesson.id, pct)
      setStep('done')
    } catch {
      setError('Connexion impossible. Réessaie.')
    } finally {
      setSubmitting(false)
    }
  }

  function retryQuiz() {
    setAnswers({})
    setResult(null)
    setError('')
    setStep('quiz')
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={lesson.title}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-head">
          <div>
            <p className="legal-eyebrow">Leçon · {lesson.minutes} min</p>
            <h2>{lesson.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer"><IconClose size={20} /></button>
        </header>

        <div className="drawer-progress">
          {(['intro', 'practice', 'quiz', 'done'] as const).map((s) => {
            const order = ['intro', 'practice', 'quiz', 'done']
            const idx = order.indexOf(step === 'result' ? 'quiz' : step)
            const active = order.indexOf(s) <= idx
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
                <div className="lesson-widget-wrap"><LessonWidget spec={lesson.widget} /></div>
              )}
              <button className="primary-button" onClick={() => setStep('practice')}>
                {lesson.widget ? 'J\'ai pratiqué' : 'Commencer le quiz'} <IconChevron size={16} />
              </button>
            </div>
          )}

          {step === 'practice' && lesson.widget && (
            <div className="lesson-section">
              <h3>Entraîne-toi</h3>
              <LessonWidget spec={lesson.widget} />
              <button className="primary-button" onClick={() => setStep('quiz')}>
                Prêt pour le quiz <IconChevron size={16} />
              </button>
            </div>
          )}

          {step === 'practice' && !lesson.widget && (
            <div className="lesson-section">
              <p>Cette leçon n\'a pas d\'exercice interactif. Passe directement au quiz.</p>
              <button className="primary-button" onClick={() => setStep('quiz')}>Démarrer le quiz <IconChevron size={16} /></button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="lesson-section">
              <div className="quiz-gate-banner">
                <IconCheck size={14} />
                <span>Score minimum : <strong>{PASS_THRESHOLD}%</strong>. Tu peux retenter autant de fois que nécessaire.</span>
              </div>
              <h3>Quiz · {lesson.quiz.length} questions</h3>
              <ol className="quiz-list">
                {lesson.quiz.map((q, i) => (
                  <li key={i}>
                    <strong>{q.q}</strong>
                    <div className="quiz-options">
                      {q.options.map((opt, o) => {
                        const selected = answers[i] === o
                        return (
                          <button
                            key={o}
                            type="button"
                            className={`quiz-option ${selected ? 'is-selected' : ''}`}
                            onClick={() => setAnswers((cur) => ({ ...cur, [i]: o }))}
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
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button
                className="primary-button"
                disabled={Object.keys(answers).length < lesson.quiz.length || submitting}
                onClick={submit}
              >
                {submitting ? <IconSparkles size={16} /> : <IconCheck size={16} />}
                {submitting ? 'Validation…' : `Valider (${correctCount}/${lesson.quiz.length})`}
              </button>
            </div>
          )}

          {step === 'result' && result && !result.passed && (
            <div className="lesson-section lesson-result-fail">
              <div className="result-icon fail"><IconClose size={28} /></div>
              <h3>Pas encore validé.</h3>
              <p className="reward">{result.message ?? `Score ${result.score}% — il faut au moins ${PASS_THRESHOLD}% pour valider.`}</p>

              <h4>Voici les bonnes réponses :</h4>
              <ol className="quiz-list">
                {lesson.quiz.map((q, i) => (
                  <li key={i}>
                    <strong>{q.q}</strong>
                    <div className="quiz-options">
                      {q.options.map((opt, o) => {
                        const isCorrect = q.answer === o
                        const wasChosen = answers[i] === o
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
                  </li>
                ))}
              </ol>

              <div className="result-actions">
                <button className="primary-button" onClick={retryQuiz}>
                  Retenter le quiz <IconChevron size={16} />
                </button>
                <button className="ghost-button" onClick={onClose}>Revoir la leçon</button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="lesson-section lesson-done">
              <div className="done-icon"><IconSparkles size={28} aria-hidden="true" /></div>
              <h3>Leçon validée !</h3>
              <p>Tu as marqué <strong>{result?.score ?? 100}%</strong> à ce quiz.</p>
              {result?.xpAwarded !== undefined && (
                <p className="reward">+{result.xpAwarded} XP · Niveau {result.level} · Total {result.totalXp} XP</p>
              )}
              {alreadyDone && !result && (
                <p className="reward">Tu peux la refaire pour t\'entraîner, mais l\'XP a déjà été ajoutée.</p>
              )}
              <button className="primary-button" onClick={onClose}>Continuer <IconArrow size={16} /></button>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}