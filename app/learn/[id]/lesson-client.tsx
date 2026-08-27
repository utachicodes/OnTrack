'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronLeft, ChevronRight, Clock, Layers, Sparkles } from 'lucide-react'
import type { Lesson } from '@/lib/curriculum'
import { LessonDrawer } from '@/components/learn/lesson-drawer'
import { LessonWidget } from '@/components/learn/lesson-widget'

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
      <section className="lesson-page-card">
        <div className="lesson-page-section">
          <p className="legal-eyebrow">Objectifs</p>
          <ul>
            {lesson.intro.slice(0, Math.min(3, lesson.intro.length)).map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <p className="legal-eyebrow">À retenir</p>
          <ul>
            {lesson.keyPoints.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
        </div>

        {lesson.widget && (
          <div className="lesson-page-widget">
            <LessonWidget spec={lesson.widget} />
          </div>
        )}

        <div className="lesson-page-cta">
          <Link href="/learn" className="text-button">
            <ChevronLeft size={14} /> Toutes les pistes
          </Link>
          <button className="primary-button" onClick={handleOpen}>
            <Sparkles size={14} /> {alreadyDone ? 'Revoir la leçon' : "Démarrer l'entraînement"}
          </button>
        </div>
      </section>

      <section className="lesson-page-meta">
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
      </section>

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
