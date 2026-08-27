'use client'

import { useMemo, useState } from 'react'
import {
  Check, ChevronRight, Circle,
  Sigma, Zap, Leaf, Brain, BookOpen,
  Map, BarChart2, Terminal, Code2, FlaskConical,
  BookMarked, Atom
} from 'lucide-react'
import type { Lesson, Track } from '@/lib/curriculum'
import { LessonDrawer } from '@/components/learn/lesson-drawer'

interface LearnClientProps {
  tracks: Track[]
  completedIds: string[]
}

type IconComponent = React.ComponentType<{ size?: number; className?: string }>

const SUBJECT_ICONS: Record<string, IconComponent> = {
  maths:    Sigma,
  physique: Zap,
  svt:      Leaf,
  philo:    Brain,
  francais: BookOpen,
  histoire: Map,
  ses:      BarChart2,
  nsi:      Terminal,
  code:     Code2,
  python:   FlaskConical,
}

function widgetBadge(lesson: Lesson) {
  if (!lesson.widget) return null
  if (lesson.widget.type === 'python') return { Icon: Code2, label: 'Python', cls: 'badge-python' }
  return { Icon: Atom, label: 'Sim', cls: 'badge-sim' }
}

export function LearnClient({ tracks, completedIds }: LearnClientProps) {
  const [activeTrackId, setActiveTrackId] = useState(tracks[0]?.id ?? '')
  const [active, setActive] = useState<Lesson | null>(null)
  const [done, setDone] = useState<Set<string>>(new Set(completedIds))

  const activeTrack = useMemo(
    () => tracks.find(t => t.id === activeTrackId) ?? tracks[0],
    [tracks, activeTrackId]
  )
  const lessons   = activeTrack?.lessons ?? []
  const trackDone = lessons.filter(l => done.has(l.id)).length
  const pct       = lessons.length ? Math.round((trackDone / lessons.length) * 100) : 0

  return (
    <div className="lhub">
      {/* ── Subject tab bar ── */}
      <nav className="lhub-tabs" role="tablist" aria-label="Matières">
        {tracks.map(track => {
          const tdone   = track.lessons.filter(l => done.has(l.id)).length
          const tpct    = track.lessons.length ? Math.round((tdone / track.lessons.length) * 100) : 0
          const isActive = track.id === activeTrackId
          const Icon    = SUBJECT_ICONS[track.id] ?? BookMarked
          return (
            <button
              key={track.id}
              role="tab"
              aria-selected={isActive}
              className={`lhub-tab${isActive ? ' is-active' : ''}`}
              style={{ '--tc': track.color } as React.CSSProperties}
              onClick={() => setActiveTrackId(track.id)}
            >
              <Icon size={15} className="lhub-tab-icon" />
              <span className="lhub-tab-name">{track.title.replace(/^Bonus · /, '')}</span>
              {tpct === 100
                ? <span className="lhub-tab-check"><Check size={10} /></span>
                : tpct > 0
                  ? <span className="lhub-tab-pct">{tpct}%</span>
                  : null}
            </button>
          )
        })}
      </nav>

      {/* ── Track panel ── */}
      <div className="lhub-panel">
        {/* Header */}
        <div className="lhub-panel-head">
          <div>
            <p className="lhub-eyebrow">
              {activeTrack?.bonus ? 'Bonus · Hors programme' : 'Programme officiel BAC 2026'}
            </p>
            <h2 className="lhub-title">{activeTrack?.title}</h2>
            <p className="lhub-tagline">{activeTrack?.tagline}</p>
          </div>
          <div
            className="lhub-ring"
            style={{ '--p': `${pct}%`, '--tc': activeTrack?.color } as React.CSSProperties}
          >
            <span>{pct}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="lhub-progress">
          <div className="lhub-progress-bar">
            <span style={{ width: `${pct}%`, background: activeTrack?.color }} />
          </div>
          <span className="lhub-progress-label">{trackDone} / {lessons.length} leçons</span>
        </div>

        {/* Lesson list */}
        <ol className="lhub-lessons">
          {lessons.map((lesson, i) => {
            const isDone      = done.has(lesson.id)
            const badge       = widgetBadge(lesson)
            const hasFormulas = !!(lesson.formulaCards?.length)
            return (
              <li key={lesson.id}>
                <button
                  className={`lhub-lesson${isDone ? ' is-done' : ''}`}
                  onClick={() => setActive(lesson)}
                >
                  <span
                    className="lhub-num"
                    style={{ '--tc': activeTrack?.color } as React.CSSProperties}
                  >
                    {isDone ? <Check size={12} /> : i + 1}
                  </span>
                  <span className="lhub-lesson-body">
                    <span className="lhub-lesson-title">{lesson.title}</span>
                    <span className="lhub-lesson-meta">
                      <Circle size={4} fill="currentColor" />
                      <span>{lesson.minutes} min</span>
                      <Circle size={4} fill="currentColor" />
                      <span>{lesson.quiz.length} q.</span>
                      {badge && (
                        <span className={`lhub-badge ${badge.cls}`}>
                          <badge.Icon size={10} /> {badge.label}
                        </span>
                      )}
                      {hasFormulas && (
                        <span className="lhub-badge badge-formula">
                          <Sigma size={10} /> Formules
                        </span>
                      )}
                    </span>
                  </span>
                  <ChevronRight size={15} className="lhub-arrow" />
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {active && (
        <LessonDrawer
          lesson={active}
          onClose={() => setActive(null)}
          alreadyDone={done.has(active.id)}
          onCompleted={(lessonId) => {
            setDone(cur => { const n = new Set(cur); n.add(lessonId); return n })
          }}
        />
      )}
    </div>
  )
}
