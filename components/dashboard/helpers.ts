import type { Task, Exam } from './types'

export function formatDue(iso: string | null, nowMs: number): { label: string; urgent: boolean; color: string } {
  if (!iso) return { label: 'Pas d\'échéance', urgent: false, color: '#7d8291' }
  const d = new Date(iso)
  const diff = Math.round((d.getTime() - nowMs) / 86400000)
  const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  if (diff < 0) return { label: `En retard - ${date}`, urgent: true, color: '#d8553f' }
  if (diff === 0) return { label: `Aujourd'hui - ${date}`, urgent: true, color: '#ee705f' }
  if (diff === 1) return { label: `Demain - ${date}`, urgent: true, color: '#ee705f' }
  if (diff <= 7) return { label: `Dans ${diff} j - ${date}`, urgent: false, color: '#5b6066' }
  return { label: date, urgent: false, color: '#5b6066' }
}

export function daysUntil(iso: string, nowMs: number): number {
  return Math.max(0, Math.round((new Date(iso).getTime() - nowMs) / 86400000))
}

export function accentClass(p: Task['priority']): string {
  if (p === 'low') return 'pill-emerald'
  if (p === 'medium') return 'pill-amber'
  return 'pill-coral'
}

export function examsForAgenda(tasks: Task[], exams: Exam[]) {
  const items: Array<{ kind: 'exam' | 'task'; at: string; title: string; sub: string }> = [
    ...exams.map((e) => ({ kind: 'exam' as const, at: e.examAt, title: e.title, sub: e.subject })),
    ...tasks.filter((t) => t.dueAt).map((t) => ({ kind: 'task' as const, at: t.dueAt!, title: t.title, sub: t.subject })),
  ]
  return items.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
}

export function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback } catch { return fallback }
}

export function writeLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ }
}
