import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Space_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { ThemeInit } from '@/components/theme-init'
import { PWABootstrap } from '@/components/pwa-bootstrap'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferences } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
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
  title: 'OnTrack · Utachi Industries',
  description:
    'Tâches, examens, sessions de focus et tuteur IA. Un espace privé pour préparer le BAC avec sérénité.',
  generator: 'next.js',
  applicationName: 'OnTrack',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OnTrack',
  },
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession()
  // Default to LIGHT. Only flip to dark if user explicitly chose dark.
  // The 'system' preference is intentionally rendered as 'light' on the
  // server to avoid hydration mismatches with clients whose OS is dark.
  // ThemeInit upgrades to the OS preference after mount, which does not
  // cause hydration warnings because it only runs post-mount.
  let storedPreference: 'light' | 'dark' | 'system' = 'system'
  let resolvedTheme: 'light' | 'dark' = 'light'
  let accentColor: string = 'coral'

  if (session?.user?.id) {
    try {
      const rows = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, session.user.id))
        .limit(1)
      if (rows[0]) {
        storedPreference = rows[0].themePreference as 'light' | 'dark' | 'system'
        resolvedTheme = storedPreference === 'dark' ? 'dark' : 'light'
        accentColor = rows[0].accentColor
      }
    } catch {
      // Prefs table unreachable — fall back to defaults so the page still renders.
    }
  }

  return (
    <html
      lang="fr"
      data-theme={resolvedTheme}
      data-accent={accentColor}
      className={`${jakarta.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        {children}
        <ThemeInit preference={storedPreference} />
        <PWABootstrap />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}