import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const MAX_LEN = 400 * 1024 // ~300 KB of base64, comfortably under Neon text limits

export async function POST(request: Request) {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const uri = typeof body?.image === 'string' ? body.image : null

  if (!uri) return NextResponse.json({ error: 'Image is required' }, { status: 400 })
  if (!/^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(uri)) {
    return NextResponse.json({ error: 'Invalid image format' }, { status: 415 })
  }
  if (uri.length > MAX_LEN) return NextResponse.json({ error: 'Image must be under 300 KB' }, { status: 413 })

  await db.update(user).set({ image: uri, updatedAt: new Date() }).where(eq(user.id, session.user.id))

  return NextResponse.json({ image: uri })
}

export async function DELETE() {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await db.update(user).set({ image: null, updatedAt: new Date() }).where(eq(user.id, session.user.id))
  return NextResponse.json({ ok: true })
}