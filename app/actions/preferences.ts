'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferences } from '@/lib/db/schema'

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

  revalidatePath('/settings')
  revalidatePath('/', 'layout')
}

export async function getPreferences() {
  const { data: session } = await auth.getSession()
  if (!session?.user?.id) return null
  const rows = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1)
  return rows[0] ?? { themePreference: 'system' as ThemePreference, accentColor: 'coral' as AccentColor }
}
