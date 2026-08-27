import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { lessonById } from '@/lib/curriculum'
import { LearnClient } from '@/components/learn/learn-client'
import { AppChrome } from '@/components/app-chrome'
import { db } from '@/lib/db'
import { lessonProgress } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export default async function LessonRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = lessonById(id)
  if (!lesson) notFound()
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const rows = await db.select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, session.user.id))
    .orderBy(desc(lessonProgress.completedAt))
  return (
    <AppChrome userName={session.user.name} active="learn">
      <div className="learn-shell">
        <LearnClient tracks={[{ id: 'code', title: lesson.title, tagline: '', color: '#ee705f', lessons: [lesson] }]} completedIds={rows.map((r) => r.lessonId)} />
      </div>
    </AppChrome>
  )
}