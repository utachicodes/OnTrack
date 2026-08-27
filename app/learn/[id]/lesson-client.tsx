'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronLeft, ChevronRight, Clock, Layers, Sparkles } from 'lucide-react'
import type { Lesson } from '@/lib/curriculum'
import { LessonDrawer } from '@/components/learn/lesson-drawer'
import { LessonWidget } from '@/components/learn/lesson-widget'
import { FormulaGrid } from '@/components/learn/formula-card'

interface LessonClientProps {
  lesson: Lesson
  alreadyDone: boolean
  completedIds: string[]
  allLessonsCount: number
}

export function LessonClient({ lesson, alreadyDone, completedIds, allLessonsCount }: LessonClientProps) {
  const [done, setDone] = useState<Set<string>>(new Set(completedIds))
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDone(new Set(completedIds))
  }, [completedIds])

  const handleOpen = () => setDrawerOpen(true)
  const handleClose = () => setDrawerOpen(false)

  return (
    <>
      <article className="lesson-lecture">
        <header className="lesson-lecture-header">
          <div className="lesson-lecture-meta">
            <span className="legal-eyebrow">{lesson.minutes} min de lecture</span>
            <span className="lesson-difficulty">{lesson.quiz.length} questions au quiz</span>
          </div>
          <h1>{lesson.title}</h1>
        </header>

        <div className="lesson-lecture-body">
          <section className="lesson-section">
            <h2>Introduction</h2>
            <div className="lesson-prose">
              {lesson.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {lesson.formulaCards?.length && (
            <section className="lesson-section lesson-formulas">
              <h2>Formules clés</h2>
              <FormulaGrid cards={lesson.formulaCards} />
            </section>
          )}

          {lesson.widget && (
            <section className="lesson-section lesson-widget-section">
              <h2>Exercice interactif</h2>
              <div className="lesson-widget-wrap">
                <LessonWidget spec={lesson.widget} />
              </div>
              <p className="lesson-widget-hint">
                Joue avec les curseurs pour visualiser les concepts. Essaie de prédire le résultat avant de bouger les contrôles.
              </p>
            </section>
          )}

          <section className="lesson-section">
            <h2>À retenir</h2>
            <ul className="lesson-keypoints">
              {lesson.keyPoints.map((k, i) => (
                <li key={i}>
                  <Check size={16} className="keypoint-icon" />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </section>

          <footer className="lesson-lecture-footer">
            <Link href="/learn" className="text-button">
              <ChevronLeft size={14} /> Toutes les pistes
            </Link>
            <button className="primary-button" onClick={handleOpen}>
              <Sparkles size={14} /> {alreadyDone ? 'Revoir le quiz' : "Démarrer l'entraînement"}
            </button>
          </footer>
        </div>

        <aside className="lesson-sidebar">
          <div className="lesson-meta-card">
            <Clock size={18} />
            <div>
              <strong>{lesson.minutes} min</strong>
              <small>estimées</small>
            </div>
          </div>
          <div className="lesson-meta-card">
            <Layers size={18} />
            <div>
              <strong>{lesson.quiz.length}</strong>
              <small>questions</small>
            </div>
          </div>
          <div className="lesson-meta-card">
            <Check size={18} />
            <div>
              <strong>{done.has(lesson.id) ? 'Validée' : 'À valider'}</strong>
              <small>score minimum 80 %</small>
            </div>
          </div>
        </aside>
      </article>

      {drawerOpen && (
        <LessonDrawer
          lesson={lesson}
          onClose={handleClose}
          alreadyDone={done.has(lesson.id)}
          onCompleted={(lessonId) => {
            setDone((cur) => {
              const next = new Set(cur)
              next.add(lessonId)
              return next
            })
          }}
        />
      )}
    </>
  )
}