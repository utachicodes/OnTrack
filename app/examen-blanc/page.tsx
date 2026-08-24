import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { headers } from 'next/headers'
import { getSession } from '@/lib/auth'
import { ExamenBlancClient } from '@/components/learn/examen-blanc-client'
import { db } from '@/lib/db'
import { mockExams } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

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

  return (
    <main className="learn-page">
      <header className="learn-header">
        <Link href="/dashboard" className="legal-back">
          <ArrowLeft size={14} /> Tableau de bord
        </Link>
        <span className="legal-eyebrow">Évaluation chronométrée</span>
      </header>

      <div className="learn-shell">
        <ExamenBlancClient
          initial={{
            poolSize: 999,
            past: past.map((e) => ({
              id: e.id,
              trackId: e.trackId,
              score: e.score,
              total: e.totalQuestions,
              status: e.status,
              startedAt: e.startedAt.toISOString(),
              completedAt: e.completedAt?.toISOString() ?? null,
            })),
            lastByTrack: {},
          }}
        />
      </div>
    </main>
  )
}