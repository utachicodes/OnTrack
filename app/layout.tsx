import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
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
  title: 'Aurevon',
  description: 'A carefully curated collection beyond compare.',
  generator: 'next.js',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#000000' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
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
  const resolvedTheme = themePreference

  return (
    <html
      lang="en"
      data-theme={resolvedTheme}
      data-accent={accentColor}
      className={`${inter.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="antialiased">
        {children}
        <ThemeInit preference={themePreference} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
