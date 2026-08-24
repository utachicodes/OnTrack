import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pushSubscriptions } from '@/lib/db/schema'

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export async function POST(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const endpoint = typeof body.endpoint === 'string' ? body.endpoint : ''
  const p256dh = typeof body.keys?.p256dh === 'string' ? body.keys.p256dh : ''
  const authKey = typeof body.keys?.auth === 'string' ? body.keys.auth : ''
  if (!endpoint || !p256dh || !authKey) return NextResponse.json({ error: 'Invalid push subscription' }, { status: 400 })
  const existing = await db.select({ id: pushSubscriptions.id }).from(pushSubscriptions).where(and(eq(pushSubscriptions.userId, user.id), eq(pushSubscriptions.endpoint, endpoint)))
  if (!existing.length) await db.insert(pushSubscriptions).values({ userId: user.id, endpoint, p256dh, auth: authKey })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { endpoint } = await request.json().catch(() => ({}))
  if (typeof endpoint !== 'string' || !endpoint) return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 })
  await db.delete(pushSubscriptions).where(and(eq(pushSubscriptions.userId, user.id), eq(pushSubscriptions.endpoint, endpoint)))
  return NextResponse.json({ success: true })
}
