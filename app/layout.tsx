import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { GridToggle } from '@/components/landing/grid-toggle'
import { ThemeInit } from '@/components/theme-init'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferences } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-mono',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  title: 'orbite — Ton espace pour avancer',
  description:
    'Tâches, examens, sessions de focus et tuteur IA — tout ce qu’il te faut pour préparer le BAC avec sérénité.',
  generator: 'next.js',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111315' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()
  let themePreference: 'light' | 'dark' | 'system' = 'system'
  let accentColor: string = 'coral'

  if (session?.user?.id) {
    const rows = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1)
    if (rows[0]) {
      themePreference = rows[0].themePreference
      accentColor = rows[0].accentColor
    }
  }

  // Resolve 'system' to the user's OS preference at SSR time so the first
  // paint already matches what ThemeInit will compute client-side.
  const resolvedTheme = themePreference // ThemeInit refines for system later

  return (
    <html
      lang="fr"
      data-theme={resolvedTheme}
      data-accent={accentColor}
      className={`${inter.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="antialiased">
        {children}
        <ThemeInit preference={themePreference} />
        <GridToggle />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
