'use server'

import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { exams, tasks } from '@/lib/db/schema'

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) redirect('/sign-in')
  return session.user.id
}

/**
 * Seeds 3 example tasks + 1 exam if the user has none.
 * Each entry is tagged "exemple" in the title so the user knows it's a demo.
 * Idempotent: if the user already has tasks/exams, this is a no-op.
 */
export async function seedStarterContent() {
  const userId = await requireUserId()

  const existingTasks = await db.select({ id: tasks.id }).from(tasks)
    .where(eq(tasks.userId, userId)).limit(1)
  const existingExams = await db.select({ id: exams.id }).from(exams)
    .where(eq(exams.userId, userId)).limit(1)

  const now = new Date()
  const inDays = (d: number) => { const x = new Date(now); x.setDate(x.getDate() + d); return x }

  if (existingTasks.length === 0) {
    await db.insert(tasks).values([
      { userId, title: 'exemple — Relire le chapitre sur les suites', subject: 'Mathématiques', priority: 'high', status: 'todo', estimatedMinutes: 45, dueAt: inDays(1) },
      { userId, title: 'exemple — Fiche de synthèse philo', subject: 'Philosophie', priority: 'medium', status: 'todo', estimatedMinutes: 30, dueAt: inDays(2) },
      { userId, title: 'exemple — Préparer l’oral de français', subject: 'Français', priority: 'low', status: 'todo', estimatedMinutes: 25, dueAt: inDays(4) },
    ])
  }

  if (existingExams.length === 0) {
    await db.insert(exams).values([
      { userId, title: 'exemple — Bac blanc de Mathématiques', subject: 'Mathématiques', examAt: inDays(21), preparationPercent: 25 },
    ])
  }

  revalidatePath('/dashboard')
}