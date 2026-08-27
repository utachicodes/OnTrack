import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getSession } from '@/lib/auth'
import { ExamenBlancClient } from '@/components/learn/examen-blanc-client'
import { AppChrome } from '@/components/app-chrome'
import { db } from '@/lib/db'
import { mockExams } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { BAC_TRACKS, type TrackId } from '@/lib/bac-curriculum'
import { questionsByTrack } from '@/lib/bac-questions'

export const metadata = {
  title: 'Examen blanc · OnTrack',
}

async function loadHistory(userId: string) {
  const rows = await db.select().from(mockExams).where(eq(mockExams.userId, userId)).orderBy(desc(mockExams.startedAt)).limit(20)
  return rows
}

export default async function ExamenBlancPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  // Forward the headers so the API doesn't break when this is called from a server
  // action that depends on the request context.
  await headers()

  const past = await loadHistory(session.user.id)

  // Compute lastByTrack server-side so the sidebar shows scores on initial load.
  const lastByTrack: Record<string, { score: number; date: string }> = {}
  for (const exam of past) {
    if (!lastByTrack[exam.trackId]) {
      lastByTrack[exam.trackId] = { score: exam.score ?? 0, date: exam.startedAt.toISOString() }
    }
  }

  // Compute pool sizes server-side (answers never leave the server).
  const poolSizes: Record<string, number> = {}
  for (const t of BAC_TRACKS) {
    poolSizes[t.id] = questionsByTrack(t.id as TrackId).length
  }

  return (
    <AppChrome userName={session.user.name} active="examen-blanc">
      <div className="learn-shell">
        <ExamenBlancClient
          initial={{
            poolSizes,
            past: past.map((e) => ({
              id: e.id,
              trackId: e.trackId,
              score: e.score,
              total: e.totalQuestions,
              status: e.status,
              startedAt: e.startedAt.toISOString(),
              completedAt: e.completedAt?.toISOString() ?? null,
            })),
            lastByTrack,
          }}
        />
      </div>
    </AppChrome>
  )
}