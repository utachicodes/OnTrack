import { redirect } from 'next/navigation'
import { eq, and, gte, asc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { tasks, exams, focusSessions } from '@/lib/db/schema'
import { DashboardClient } from '@/components/dashboard-client'
import { seedStarterContent } from '@/app/actions/seed'
import type { NavKey } from '@/components/dashboard/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Tableau de bord · OnTrack',
}

const NAV_KEYS = ['overview', 'tasks', 'exams', 'planning', 'focus', 'learn', 'documents', 'goals', 'habits', 'finance'] as const

export default async function DashboardPage(props: { searchParams?: Promise<{ view?: string }> }) {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const sp = (await props.searchParams) ?? {}
  const view = (NAV_KEYS as readonly string[]).includes(sp.view ?? '') ? (sp.view as NavKey) : undefined

  // Seed example tasks/exams if the user has none, and force light theme.
  await seedStarterContent()

  const userId = session.user.id
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)
  const nowMs = now.getTime()

  const [userTasks, userExams, recentFocus] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(asc(tasks.dueAt)),
    db.select().from(exams).where(eq(exams.userId, userId)).orderBy(asc(exams.examAt)),
    db.select().from(focusSessions).where(
      and(eq(focusSessions.userId, userId), gte(focusSessions.startedAt, weekStart)),
    ),
  ])

  return (
    <DashboardClient
      userName={session.user.name}
      nowMs={nowMs}
      initialTasks={userTasks.map((t) => ({
        id: t.id,
        title: t.title,
        subject: t.subject ?? 'Général',
        estimatedMinutes: t.estimatedMinutes,
        priority: t.priority as 'low' | 'medium' | 'high',
        status: t.status as 'todo' | 'done',
        dueAt: t.dueAt ? t.dueAt.toISOString() : null,
      }))}
      initialExams={userExams.map((e) => ({
        id: e.id,
        title: e.title,
        subject: e.subject,
        examAt: e.examAt.toISOString(),
        preparationPercent: e.preparationPercent,
      }))}
      focusThisWeek={recentFocus.filter((f) => f.status === 'completed').length}
      initialView={view}
    />
  )
}