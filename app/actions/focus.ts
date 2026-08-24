'use server'

import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { focusSessions } from '@/lib/db/schema'

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) redirect('/sign-in')
  return session.user.id
}

export async function listFocusSessions(limit = 20) {
  const userId = await requireUserId()
  return db
    .select()
    .from(focusSessions)
    .where(eq(focusSessions.userId, userId))
    .orderBy(desc(focusSessions.startedAt))
    .limit(limit)
}

export async function startFocusSession(input: { durationMinutes: number; taskId?: string }) {
  const userId = await requireUserId()
  const duration = Math.max(5, Math.min(120, Math.round(Number(input.durationMinutes) || 25)))
  const [session] = await db
    .insert(focusSessions)
    .values({
      userId,
      durationMinutes: duration,
      taskId: input.taskId || null,
      status: 'active',
      startedAt: new Date(),
    })
    .returning()
  revalidatePath('/dashboard')
  return session
}

export async function completeFocusSession(sessionId: string, status: 'completed' | 'cancelled' = 'completed') {
  const userId = await requireUserId()
  const [session] = await db
    .update(focusSessions)
    .set({ status, completedAt: new Date() })
    .where(and(eq(focusSessions.id, sessionId), eq(focusSessions.userId, userId)))
    .returning()
  revalidatePath('/dashboard')
  return session
}