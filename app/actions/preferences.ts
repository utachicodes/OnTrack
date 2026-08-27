'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferences, notificationPreferences } from '@/lib/db/schema'

const VALID_THEMES = ['light', 'dark', 'system'] as const
const VALID_ACCENTS = ['coral', 'indigo', 'emerald', 'amber', 'violet', 'rose'] as const

type ThemePreference = (typeof VALID_THEMES)[number]
type AccentColor = (typeof VALID_ACCENTS)[number]

async function requireUserId() {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) redirect('/sign-in')
  return session.user.id
}

function parseTheme(value: unknown): ThemePreference {
  return VALID_THEMES.includes(value as ThemePreference) ? (value as ThemePreference) : 'system'
}

function parseAccent(value: unknown): AccentColor {
  return VALID_ACCENTS.includes(value as AccentColor) ? (value as AccentColor) : 'coral'
}

function parseBool(value: unknown): boolean {
  return value === 'on' || value === 'true' || value === '1'
}

function parseTime(value: unknown, fallback: string): string {
  const v = String(value ?? '').trim()
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v) ? v : fallback
}

export async function updatePreferences(formData: FormData) {
  const userId = await requireUserId()
  const themePreference = parseTheme(formData.get('themePreference'))
  const accentColor = parseAccent(formData.get('accentColor'))

  await db
    .insert(userPreferences)
    .values({ userId, themePreference, accentColor })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: { themePreference, accentColor, updatedAt: new Date() },
    })

  const reminders = parseBool(formData.get('reminders'))
  const examAlerts = parseBool(formData.get('examAlerts'))
  const quietStart = parseTime(formData.get('quietStart'), '22:00')
  const quietEnd = parseTime(formData.get('quietEnd'), '07:00')

  await db
    .insert(notificationPreferences)
    .values({ userId, reminders, examAlerts, quietStart, quietEnd })
    .onConflictDoUpdate({
      target: notificationPreferences.userId,
      set: { reminders, examAlerts, quietStart, quietEnd, updatedAt: new Date() },
    })

  revalidatePath('/settings')
  revalidatePath('/', 'layout')
}

export async function getPreferences() {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) return null
  const [prefs, notif] = await Promise.all([
    db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1),
    db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, session.user.id))
      .limit(1),
  ])
  return {
    themePreference: (prefs[0]?.themePreference ?? 'system') as ThemePreference,
    accentColor: (prefs[0]?.accentColor ?? 'coral') as AccentColor,
    notifications: notif[0] ?? { reminders: true, examAlerts: true, quietStart: '22:00', quietEnd: '07:00' as string },
  }
}
