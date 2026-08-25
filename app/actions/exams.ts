'use server'

import { and, asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { exams } from '@/lib/db/schema'

async function requireUserId() {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) redirect('/sign-in')
  return session.user.id
}

export async function listExams() {
  const userId = await requireUserId()
  return db
    .select()
    .from(exams)
    .where(eq(exams.userId, userId))
    .orderBy(asc(exams.examAt))
}

export async function createExam(input: { title: string; subject: string; examAt: string }) {
  const userId = await requireUserId()
  const at = new Date(input.examAt)
  if (Number.isNaN(at.getTime())) throw new Error('Date invalide')
  const [exam] = await db
    .insert(exams)
    .values({
      userId,
      title: input.title.trim().slice(0, 160) || 'Examen',
      subject: input.subject.trim().slice(0, 80) || 'Général',
      examAt: at,
    })
    .returning()
  revalidatePath('/dashboard')
  return exam
}

export async function updateExamProgress(id: string, percent: number) {
  const userId = await requireUserId()
  const value = Math.max(0, Math.min(100, Math.round(percent)))
  const [exam] = await db
    .update(exams)
    .set({ preparationPercent: value })
    .where(and(eq(exams.id, id), eq(exams.userId, userId)))
    .returning()
  revalidatePath('/dashboard')
  return exam
}

export async function deleteExam(id: string) {
  const userId = await requireUserId()
  await db.delete(exams).where(and(eq(exams.id, id), eq(exams.userId, userId)))
  revalidatePath('/dashboard')
}