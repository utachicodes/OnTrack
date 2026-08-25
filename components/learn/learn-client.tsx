'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Circle, Loader2, Play, X } from 'lucide-react'
import type { Lesson, Track } from '@/lib/curriculum'
import { LessonDrawer } from '@/components/learn/lesson-drawer'
import { Button } from '@/components/ui/button'

interface LearnClientProps {
  tracks: Track[]
  completedIds: string[]
}

export function LearnClient({ tracks, completedIds }: LearnClientProps) {
  const [active, setActive] = useState<Lesson | null>(null)
  const [done, setDone] = useState<Set<string>>(new Set(completedIds))
  const total = useMemo(() => tracks.reduce((sum, t) => sum + t.lessons.length, 0), [tracks])
  const completedCount = done.size

  return (
    <>
      <div className="tracks-grid">
        {tracks.map((track) => {
          const lessons = track.lessons
          const trackDone = lessons.filter((l) => done.has(l.id)).length
          const pct = lessons.length ? (trackDone / lessons.length) * 100 : 0
          return (
            <article key={track.id} className="track-card" style={{ ['--track-color' as string]: track.color } as React.CSSProperties}>
              <header className="track-head">
                <div>
                  <p className="legal-eyebrow">Piste</p>
                  <h3>{track.title}</h3>
                  <p className="track-tag">{track.tagline}</p>
                </div>
                <div className="track-progress-ring" style={{ ['--p' as string]: `${pct}%` } as React.CSSProperties}>
                  <span>{Math.round(pct)}%</span>
                </div>
              </header>

              <ol className="track-lessons">
                {lessons.map((lesson, i) => {
                  const isDone = done.has(lesson.id)
                  return (
                    <li key={lesson.id}>
                      <button className={`track-lesson ${isDone ? 'is-done' : ''}`} onClick={() => setActive(lesson)}>
                        <span className="lesson-num">{isDone ? <Check size={12} /> : i + 1}</span>
                        <div className="lesson-meta">
                          <strong>{lesson.title}</strong>
                          <small><span>{lesson.minutes} min</span><Circle size={6} fill="currentColor" /><span>{lesson.quiz.length} questions</span></small>
                        </div>
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  )
                })}
              </ol>

              <footer className="track-foot">
                <span>{trackDone} / {lessons.length} leçons</span>
                <button className="text-button" onClick={() => setActive(lessons[0])}>
                  Démarrer <ArrowRight size={14} />
                </button>
              </footer>
            </article>
          )
        })}
      </div>

      <p className="learn-foot">
        <strong>{completedCount}</strong> / {total} leçons terminées. Continue pour débloquer des badges.
      </p>

      {active && (
        <LessonDrawer
          lesson={active}
          onClose={() => setActive(null)}
          onCompleted={(lessonId, score) => {
            setDone((cur) => {
              const next = new Set(cur)
              next.add(lessonId)
              return next
            })
          }}
          alreadyDone={done.has(active.id)}
        />
      )}
    </>
  )
}