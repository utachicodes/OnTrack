'use server'

import { and, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { tasks } from '@/lib/db/schema'

async function requireUserId() {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) redirect('/sign-in')
  return session.user.id
}

function cleanText(value: unknown, fallback: string, maxLength: number) {
  const text = String(value ?? '').trim().slice(0, maxLength)
  return text || fallback
}

export async function listTasks() {
  const userId = await requireUserId()
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt))
}

export async function createTask(input: {
  title: string
  subject?: string
  priority?: string
  estimatedMinutes?: number
  dueAt?: string
}) {
  const userId = await requireUserId()
  const estimatedMinutes = Number(input.estimatedMinutes ?? 25)
  if (!Number.isInteger(estimatedMinutes) || estimatedMinutes < 5 || estimatedMinutes > 480) {
    throw new Error('Invalid duration')
  }
  const [task] = await db
    .insert(tasks)
    .values({
      userId,
      title: cleanText(input.title, 'Nouvelle tâche', 160),
      subject: cleanText(input.subject, 'Général', 80),
      priority: ['low', 'medium', 'high'].includes(input.priority ?? '') ? input.priority : 'medium',
      estimatedMinutes,
      dueAt: input.dueAt ? new Date(input.dueAt) : undefined,
    })
    .returning()
  revalidatePath('/dashboard')
  return task
}

export async function toggleTask(taskId: string) {
  const userId = await requireUserId()
  const existing = await db
    .select({ id: tasks.id, status: tasks.status })
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .limit(1)
  if (!existing[0]) throw new Error('Task not found')
  const done = existing[0].status === 'done'
  const [task] = await db
    .update(tasks)
    .set({ status: done ? 'todo' : 'done', completedAt: done ? null : new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .returning()
  revalidatePath('/dashboard')
  return task
}

export async function deleteTask(taskId: string) {
  const userId = await requireUserId()
  await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
  revalidatePath('/dashboard')
}
