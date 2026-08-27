'use client'

import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconReset, IconHourglass } from '@/components/icons'
import { startFocusSession, completeFocusSession, getActiveFocusSession } from '@/app/actions/focus'
import { Button } from '@/components/ui/button'

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

export function Pomodoro({ defaultMinutes = 25, onComplete }: { defaultMinutes?: number; onComplete?: () => void }) {
  const [duration, setDuration] = useState(defaultMinutes)
  const [active, setActive] = useState<FocusSessionRow | null>(null)
  const [remaining, setRemaining] = useState(defaultMinutes * 60)
  const [completed, setCompleted] = useState(0)
  const intervalRef = useRef<TimerId | null>(null)

  // On mount, check for an active session in the DB and resume it.
  useEffect(() => {
    let cancelled = false
    getActiveFocusSession().then((row) => {
      if (cancelled || !row || !row.startedAt) return
      const startedMs = new Date(row.startedAt!).getTime()
      const elapsedSec = Math.floor((Date.now() - startedMs) / 1000)
      const totalSec = row.durationMinutes * 60
      const remainingSec = Math.max(0, totalSec - elapsedSec)
      setActive({ id: row.id, durationMinutes: row.durationMinutes, startedAt: new Date(row.startedAt!) })
      setRemaining(remainingSec > 0 ? remainingSec : 0)
    }).catch(() => { /* ignore */ })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const row = await startFocusSession({ durationMinutes: duration })
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
    setRemaining(duration * 60)
    if (status === 'completed') {
      setCompleted((c) => c + 1)
      onComplete?.()
    }
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Session de focus terminée', {
          body: 'Bravo, prends une vraie pause.',
          silent: false,
        })
      }
    } catch {
      /* notifications disabled */
    }
  }

  const total = (active?.durationMinutes ?? duration) * 60
  const progress = Math.max(0, Math.min(1, 1 - remaining / total))

  const presets = [15, 25, 45, 60]

  function pick(d: number) {
    if (active) return
    setDuration(d)
    setRemaining(d * 60)
  }

  return (
    <div className="pomodoro">
      <div className="pomodoro-ring" style={{ ['--progress' as string]: progress } as React.CSSProperties}>
        <div className="pomodoro-face">
          <span className="pomodoro-time">{formatTime(remaining)}</span>
          <span className="pomodoro-label">{active ? 'En cours' : 'Prêt'}</span>
        </div>
      </div>
      {!active && (
        <div className="pomodoro-durations">
          {presets.map((d) => (
            <button
              key={d}
              type="button"
              className={`duration-chip ${duration === d ? 'is-active' : ''}`}
              onClick={() => pick(d)}
            >
              {d} min
            </button>
          ))}
        </div>
      )}
      <div className="pomodoro-actions">
        {!active && (
          <Button variant="default" size="lg" onClick={start}>
            <IconHourglass size={16} /> Démarrer {duration} min
          </Button>
        )}
        {active && (
          <Button variant="default" size="lg" onClick={() => finish('completed')}>
            <IconCheck size={16} /> Terminer
          </Button>
        )}
        {active && (
          <Button variant="ghost" size="lg" onClick={() => finish('cancelled')}>
            <IconReset size={15} /> Annuler
          </Button>
        )}
      </div>
      <p className="pomodoro-meta">
        <strong>{completed}</strong> session{completed > 1 ? 's' : ''} terminée{completed > 1 ? 's' : ''} aujourd&apos;hui
      </p>
    </div>
  )
}
