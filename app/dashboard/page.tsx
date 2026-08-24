import { redirect } from 'next/navigation'
import { eq, and, gte, asc } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { tasks, exams, focusSessions } from '@/lib/db/schema'
import { DashboardClient } from '@/components/dashboard-client'

export const metadata = {
  title: 'Tableau de bord · OnTrack',
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const userId = session.user.id
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)

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
    />
  )
}