'use server'

import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { aiConversations } from '@/lib/db/schema'

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) redirect('/sign-in')
  return session.user.id
}

export type AIMessage = { role: 'user' | 'assistant'; text: string }

export async function listConversations() {
  const userId = await requireUserId()
  return db.select().from(aiConversations).where(eq(aiConversations.userId, userId)).orderBy(desc(aiConversations.createdAt)).limit(20)
}

export async function getConversation(id: string) {
  const userId = await requireUserId()
  const rows = await db.select().from(aiConversations).where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId))).limit(1)
  if (!rows[0]) return null
  const row = rows[0]
  return { ...row, messages: JSON.parse(row.messages) as AIMessage[] }
}

export async function createConversation(subject?: string) {
  const userId = await requireUserId()
  const [row] = await db.insert(aiConversations).values({ userId, subject: subject ?? null }).returning()
  return row
}

export async function appendMessage(id: string, messages: AIMessage[]) {
  const userId = await requireUserId()
  await db.update(aiConversations).set({ messages: JSON.stringify(messages) }).where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId)))
}

export async function deleteConversation(id: string) {
  const userId = await requireUserId()
  await db.delete(aiConversations).where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId)))
}
