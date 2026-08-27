import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { lessonById, trackOf, TRACKS } from '@/lib/curriculum'
import { AppChrome } from '@/components/app-chrome'
import { db } from '@/lib/db'
import { lessonProgress } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { LessonDrawer } from '@/components/learn/lesson-drawer'
import { LessonClient } from './lesson-client'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = lessonById(id)
  return { title: lesson ? `${lesson.title} · Apprendre · OnTrack` : 'Leçon · OnTrack' }
}

export default async function LessonRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = lessonById(id)
  if (!lesson) notFound()
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const track = trackOf(id)
  const rows = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .where(eq(lessonProgress.userId, session.user.id))
    .orderBy(desc(lessonProgress.completedAt))
    .catch(() => [] as { lessonId: string }[])
  const completedIds = rows.map((r) => r.lessonId)
  const alreadyDone = completedIds.includes(lesson.id)

  return (
    <AppChrome userName={session.user.name} userImage={session.user.image} active="learn">
      <div className="learn-shell">
        <section className="learn-hero">
          <p className="auth-eyebrow">{track ? track.title : 'Leçon'}</p>
          <h1>{lesson.title}</h1>
          <p className="learn-hero-sub">
            {lesson.minutes} min · {lesson.quiz.length} questions · score minimum 80 % pour valider.
          </p>
        </section>
        <LessonClient lesson={lesson} alreadyDone={alreadyDone} completedIds={completedIds} allLessonsCount={TRACKS.reduce((s, t) => s + t.lessons.length, 0)} />
      </div>
    </AppChrome>
  )
}
