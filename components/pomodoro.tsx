'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { startFocusSession, completeFocusSession } from '@/app/actions/focus'

interface FocusSessionRow {
  id: string
  durationMinutes: number
  startedAt: Date
}

type TimerId = ReturnType<typeof setInterval>

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function Pomodoro({ defaultMinutes = 25 }: { defaultMinutes?: number }) {
  const [active, setActive] = useState<FocusSessionRow | null>(null)
  const [remaining, setRemaining] = useState(defaultMinutes * 60)
  const [completed, setCompleted] = useState(0)
  const intervalRef = useRef<TimerId | null>(null)

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          void finish('completed')
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id])

  async function start() {
    const row = await startFocusSession({ durationMinutes: defaultMinutes })
    setActive({
      id: row.id,
      durationMinutes: row.durationMinutes,
      startedAt: new Date(row.startedAt!),
    })
    setRemaining(row.durationMinutes * 60)
  }

  async function finish(status: 'completed' | 'cancelled') {
    if (!active) return
    await completeFocusSession(active.id, status)
    setActive(null)
    setRemaining(defaultMinutes * 60)
    if (status === 'completed') setCompleted((c) => c + 1)
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Session de focus terminée', {
          body: 'Bravo, prends une vraie pause.',
          silent: false,
        })
      }
    } catch {
      /* notifications disabled or unsupported */
    }
  }

  const total = (active?.durationMinutes ?? defaultMinutes) * 60
  const progress = Math.max(0, Math.min(1, 1 - remaining / total))

  return (
    <div className="pomodoro">
      <div className="pomodoro-ring" style={{ ['--progress' as string]: progress } as React.CSSProperties}>
        <div className="pomodoro-face">
          <span className="pomodoro-time">{formatTime(remaining)}</span>
          <span className="pomodoro-label">{active ? 'En cours' : 'Prêt'}</span>
        </div>
      </div>
      <div className="pomodoro-actions">
        {!active && (
          <button className="primary-button" onClick={start}>
            <Play size={16} fill="currentColor" /> Démarrer {defaultMinutes} min
          </button>
        )}
        {active && (
          <button className="primary-button" onClick={() => finish('completed')}>
            <Pause size={16} /> Terminer
          </button>
        )}
        {active && (
          <button className="ghost-button" onClick={() => finish('cancelled')}>
            <RotateCcw size={15} /> Annuler
          </button>
        )}
      </div>
      <p className="pomodoro-meta">
        <strong>{completed}</strong> session{completed > 1 ? 's' : ''} terminée{completed > 1 ? 's' : ''} aujourd’hui
      </p>
    </div>
  )
}