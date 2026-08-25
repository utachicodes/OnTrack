import { and, desc, eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mockExamResponses, mockExams } from '@/lib/db/schema'
import { ALL_QUESTIONS, questionsByTrack, shuffleQuestions, questionById, type Question } from '@/lib/bac-questions'
import { BAC_TRACKS, trackById, type TrackId } from '@/lib/bac-curriculum'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

function readTrackId(value: unknown): TrackId | null {
  if (typeof value !== 'string') return null
  const t = trackById(value as TrackId)
  return t ? (t.id as TrackId) : null
}

/** GET /api/examen-blanc?trackId=...&limit=20
 *  Returns: { tracks: [...], poolSizes, examCount, lastScore } */
export async function GET(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const trackId = readTrackId(url.searchParams.get('trackId'))

  const past = await db.select().from(mockExams).where(eq(mockExams.userId, userId)).orderBy(desc(mockExams.startedAt)).limit(10)

  const lastByTrack = new Map<string, { score: number; date: Date }>()
  for (const exam of past) {
    if (!lastByTrack.has(exam.trackId)) lastByTrack.set(exam.trackId, { score: exam.score ?? 0, date: exam.startedAt })
  }

  // Compute pool sizes per track server-side (no answers leaked).
  const poolSizes: Record<string, number> = {}
  for (const t of BAC_TRACKS) {
    poolSizes[t.id] = questionsByTrack(t.id as TrackId).length
  }

  return NextResponse.json({
    poolSizes,
    past: past.map((e) => ({ id: e.id, trackId: e.trackId, score: e.score, total: e.totalQuestions, status: e.status, startedAt: e.startedAt, completedAt: e.completedAt })),
    lastByTrack: Object.fromEntries(lastByTrack),
  })
}

/** POST /api/examen-blanc
 *  { trackId, duration: minutes, count: number } → creates exam + returns questions */
export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const trackId = readTrackId(body.trackId)
  const count = Math.max(5, Math.min(50, Number(body.count) || 20))
  const duration = Math.max(15, Math.min(240, Number(body.duration) || 60))

  if (!trackId) return NextResponse.json({ error: 'Piste inconnue' }, { status: 400 })

  const pool = questionsByTrack(trackId)
  if (pool.length < count) {
    return NextResponse.json({ error: `Pas assez de questions (${pool.length} disponibles)` }, { status: 400 })
  }

  const seed = Date.now() ^ Math.floor(Math.random() * 1e6)
  const selected = shuffleQuestions(pool, seed).slice(0, count)

  const [exam] = await db.insert(mockExams).values({
    userId,
    trackId,
    duration,
    totalQuestions: count,
    status: 'in_progress',
  }).returning()

  return NextResponse.json({ examId: exam.id, duration, totalQuestions: count, questions: selected.map(stripAnswer) })
}

/** PATCH /api/examen-blanc — submit answers.
 *  body: { examId, answers: { [questionId]: choiceIndex } } */
export async function PATCH(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const examId = typeof body.examId === 'string' ? body.examId : ''
  const answers = body.answers && typeof body.answers === 'object' ? body.answers as Record<string, number> : {}

  if (!examId) return NextResponse.json({ error: 'examId requis' }, { status: 400 })

  const [exam] = await db.select().from(mockExams)
    .where(and(eq(mockExams.id, examId), eq(mockExams.userId, userId)))
    .limit(1)
  if (!exam) return NextResponse.json({ error: 'Examen introuvable' }, { status: 404 })
  if (exam.status === 'completed') return NextResponse.json({ error: 'Déjà soumis' }, { status: 400 })

  // Grade
  const pool = questionsByTrack(exam.trackId as TrackId)
  const poolById = new Map(pool.map((q) => [q.id, q]))

  let correct = 0
  const responses: Array<{ questionId: string; response: number; correct: number }> = []
  const detail: Array<{ question: Question; given: number; isCorrect: boolean }> = []

  for (const [qid, given] of Object.entries(answers)) {
    const q = poolById.get(qid)
    if (!q) continue
    const isCorrect = given === q.answer
    if (isCorrect) correct += 1
    responses.push({ questionId: qid, response: given, correct: isCorrect ? 1 : 0 })
    detail.push({ question: q, given, isCorrect })
  }

  // Bulk upsert responses
  if (responses.length > 0) {
    await db.insert(mockExamResponses).values(
      responses.map((r) => ({
        examId,
        questionId: r.questionId,
        response: r.response,
        correct: r.correct,
        reviewed: 1,
      })),
    ).onConflictDoUpdate({
      target: [mockExamResponses.examId, mockExamResponses.questionId],
      set: { response: sql`excluded.response`, correct: sql`excluded.correct` },
    })
  }

  const score = Math.round((correct / exam.totalQuestions) * 100)
  await db.update(mockExams)
    .set({ score, status: 'completed', completedAt: new Date() })
    .where(eq(mockExams.id, examId))

  return NextResponse.json({
    score,
    totalQuestions: exam.totalQuestions,
    correct,
    detail: detail.map((d) => ({
      id: d.question.id,
      q: d.question.q,
      options: d.question.options,
      answer: d.question.answer,
      given: d.given,
      isCorrect: d.isCorrect,
      explanation: d.question.explanation,
      chapterId: d.question.chapterId,
      difficulty: d.question.difficulty,
    })),
  })
}

/** DELETE /api/examen-blanc?id=... */
export async function DELETE(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })
  await db.delete(mockExams).where(and(eq(mockExams.id, id), eq(mockExams.userId, userId)))
  return NextResponse.json({ success: true })
}

function stripAnswer(q: Question) {
  return {
    id: q.id,
    q: q.q,
    options: q.options,
    chapterId: q.chapterId,
    difficulty: q.difficulty,
  }
}