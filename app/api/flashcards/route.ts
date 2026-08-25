import { and, asc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { flashcards, flashcardDecks } from '@/lib/db/schema'
import { sm2Next, ratingToQuality, type ReviewRating } from '@/lib/sm2'
import { chapterById, trackById, type TrackId } from '@/lib/bac-curriculum'
import { seedCardsFor } from '@/lib/seed-flashcards'

async function getUserId() {
  const { data: session } = await auth.getSession()
  return session?.user?.id ?? null
}

function readTrackId(value: unknown): TrackId | null {
  if (typeof value !== 'string') return null
  const t = trackById(value as TrackId)
  return t ? (t.id as TrackId) : null
}

/** GET /api/flashcards?trackId=...&chapterId=...&due=1 */
export async function GET(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const trackId = readTrackId(url.searchParams.get('trackId'))
  const chapterId = url.searchParams.get('chapterId') ?? null

  if (!trackId) return NextResponse.json({ error: 'Piste inconnue' }, { status: 400 })

  // First, query current cards.
  const conditions = [eq(flashcards.userId, userId), eq(flashcards.trackId, trackId)]
  if (chapterId) conditions.push(eq(flashcards.chapterId, chapterId))

  let rows = await db.select().from(flashcards).where(and(...conditions)).orderBy(asc(flashcards.dueAt)).limit(500)

  // Auto-seed: if user has zero cards for this chapter, populate from canonical seed.
  if (chapterId && rows.length === 0) {
    const seed = seedCardsFor(trackId, chapterId)
    if (seed.length > 0) {
      await db.insert(flashcards).values(
        seed.map((s) => ({ userId, trackId, chapterId, front: s.front, back: s.back })),
      ).onConflictDoNothing()
      rows = await db.select().from(flashcards).where(and(...conditions)).orderBy(asc(flashcards.dueAt)).limit(500)
    }
  }

  const track = trackById(trackId)!
  const chapter = chapterId ? chapterById(trackId, chapterId) : undefined

  const now = new Date()
  const dueCount = rows.filter((r) => r.dueAt.getTime() <= now.getTime()).length
  const total = rows.length
  const mastered = rows.filter((r) => r.repetitions >= 5).length

  return NextResponse.json({
    track: { id: track.id, title: track.title, color: track.color },
    chapter: chapter ? { id: chapter.id, title: chapter.title } : null,
    cards: rows,
    stats: { total, dueCount, mastered },
  })
}

/** POST /api/flashcards — add a card. */
export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const trackId = readTrackId(body.trackId)
  const front = typeof body.front === 'string' ? body.front.trim() : ''
  const back = typeof body.back === 'string' ? body.back.trim() : ''
  const chapterId = typeof body.chapterId === 'string' ? body.chapterId : null

  if (!trackId) return NextResponse.json({ error: 'Piste inconnue' }, { status: 400 })
  if (!front || !back) return NextResponse.json({ error: 'Recto et verso requis' }, { status: 400 })
  if (front.length > 240 || back.length > 800) return NextResponse.json({ error: 'Texte trop long' }, { status: 400 })

  // Upsert deck (one per user × track × chapter).
  const decks = await db.select({ id: flashcardDecks.id })
    .from(flashcardDecks)
    .where(and(eq(flashcardDecks.userId, userId), eq(flashcardDecks.trackId, trackId)))
    .limit(20)
  let deckId = decks.find((d) => true)?.id
  if (!deckId) {
    const track = trackById(trackId)!
    const [created] = await db.insert(flashcardDecks).values({
      userId, trackId, chapterId, title: track.title,
    }).returning({ id: flashcardDecks.id })
    deckId = created?.id ?? null
  }

  const existingCard = await db.select({ id: flashcards.id })
    .from(flashcards)
    .where(and(eq(flashcards.userId, userId), eq(flashcards.front, front)))
    .limit(1)
  if (existingCard[0]) {
    return NextResponse.json({ card: existingCard[0], deckId, duplicate: true })
  }

  const [card] = await db.insert(flashcards).values({
    userId, trackId, chapterId, front, back,
  }).returning()

  return NextResponse.json({ card, deckId })
}

/** PATCH /api/flashcards — review a card. */
export async function PATCH(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const cardId = typeof body.cardId === 'string' ? body.cardId : ''
  const rating = body.rating as ReviewRating
  if (!cardId || !['again', 'hard', 'good', 'easy'].includes(rating)) {
    return NextResponse.json({ error: 'cardId + rating requis' }, { status: 400 })
  }

  const rows = await db.select().from(flashcards)
    .where(and(eq(flashcards.id, cardId), eq(flashcards.userId, userId)))
    .limit(1)
  if (!rows[0]) return NextResponse.json({ error: 'Carte introuvable' }, { status: 404 })

  const state = sm2Next({
    ease: rows[0].ease / 100,
    intervalDays: rows[0].intervalDays,
    repetitions: rows[0].repetitions,
    dueAt: rows[0].dueAt,
  }, ratingToQuality(rating))

  await db.update(flashcards)
    .set({
      ease: Math.round(state.ease * 100),
      intervalDays: state.intervalDays,
      repetitions: state.repetitions,
      dueAt: state.dueAt,
    })
    .where(eq(flashcards.id, cardId))

  return NextResponse.json({ state })
}

/** DELETE /api/flashcards?id=... */
export async function DELETE(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

  await db.delete(flashcards).where(and(eq(flashcards.id, id), eq(flashcards.userId, userId)))
  return NextResponse.json({ success: true })
}