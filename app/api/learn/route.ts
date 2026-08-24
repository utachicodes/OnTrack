import { sql } from 'drizzle-orm'
import { and, eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { lessonProgress, userXp } from '@/lib/db/schema'
import { ALL_LESSONS, BADGES, levelForXp, levelTitle, xpForLesson, earnedBadges } from '@/lib/curriculum'

interface XpRow { xp: number | null }

function readXp(result: unknown): number {
  if (!result || typeof result !== 'object') return 0
  const rows = (result as { rows?: unknown }).rows
  if (!Array.isArray(rows) || rows.length === 0) return 0
  const first = rows[0]
  if (!first || typeof first !== 'object') return 0
  return readXpRow(first)
}

function readXpRow(row: unknown): number {
  if (!row || typeof row !== 'object') return 0
  if (!('xp' in row)) return 0
  const xp = (row as { xp: unknown }).xp
  return typeof xp === 'number' ? xp : 0
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [completions, xpRow] = await Promise.all([
    db
      .select({ lessonId: lessonProgress.lessonId, score: lessonProgress.score, xpAwarded: lessonProgress.xpAwarded, completedAt: lessonProgress.completedAt })
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId))
      .orderBy(desc(lessonProgress.completedAt)),
    db.select({ xp: userXp.xp }).from(userXp).where(eq(userXp.userId, userId)).limit(1),
  ])

  const xp = xpRow[0]?.xp ?? 0
  const level = levelForXp(xp)

  return NextResponse.json({
    xp,
    level,
    levelTitle: levelTitle(level),
    completions,
    badges: [...earnedBadges(completions.map((c) => ({ lessonId: c.lessonId, score: c.score })))],
    allLessons: ALL_LESSONS.length,
    badgeCatalog: BADGES,
  })
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const lessonId = typeof body.lessonId === 'string' ? body.lessonId : ''
  const rawScore = Number(body.score)
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0

  if (!lessonId || !ALL_LESSONS.find((l) => l.id === lessonId)) {
    return NextResponse.json({ error: 'Leçon inconnue' }, { status: 400 })
  }

  const earned = xpForLesson(score)

  const existing = await db
    .select({ id: lessonProgress.id, xpAwarded: lessonProgress.xpAwarded })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)))
    .limit(1)

  if (existing[0]) {
    return NextResponse.json({
      alreadyCompleted: true,
      xpAwarded: existing[0].xpAwarded,
      totalXp: await fetchXp(userId),
    })
  }

  await db.insert(lessonProgress).values({
    userId,
    lessonId,
    score,
    xpAwarded: earned,
  })

  const total = await incrementXp(userId, earned)

  return NextResponse.json({
    alreadyCompleted: false,
    xpAwarded: earned,
    totalXp: total,
    level: levelForXp(total),
    levelTitle: levelTitle(levelForXp(total)),
  })
}

async function fetchXp(userId: string): Promise<number> {
  const [row] = await db.select({ xp: userXp.xp }).from(userXp).where(eq(userXp.userId, userId)).limit(1)
  return row?.xp ?? 0
}

async function incrementXp(userId: string, amount: number): Promise<number> {
  const updated = await db.execute(sql`
    INSERT INTO user_xp (user_id, xp, updated_at)
    VALUES (${userId}, ${amount}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET xp = user_xp.xp + ${amount}, updated_at = NOW()
    RETURNING xp
  `)
  return readXp(updated)
}