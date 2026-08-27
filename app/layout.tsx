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
    // black-translucent = the app content extends under the status bar
    // giving a true full-screen feel on iPhone (like a native app).
    statusBarStyle: 'black-translucent',
    title: 'OnTrack',
    startupImage: [
      // iPhone 15 Pro Max / 14 Pro Max
      { url: '/splash/apple-splash-1290-2796.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 15 Pro / 14 Pro
      { url: '/splash/apple-splash-1179-2556.png', media: '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 14 Plus / 13 Pro Max / 12 Pro Max
      { url: '/splash/apple-splash-1284-2778.png', media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone 14 / 13 / 12
      { url: '/splash/apple-splash-1170-2532.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)' },
      // iPhone SE (3rd gen)
      { url: '/splash/apple-splash-750-1334.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)' },
    ],
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  other: {
    // Forces Safari to treat the site as a full-screen web app
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'OnTrack',
    // Microsoft tiles
    'msapplication-TileColor': '#ee705f',
    'msapplication-TileImage': '/icon-192.png',
  },
}

export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#13151c' },
  ],
  width: 'device-width',
  initialScale: 1,
  // Prevent iOS auto-zoom on input focus (big UX issue on iPhone)
  maximumScale: 1,
  userScalable: false,
  // viewportFit=cover makes content go under the iPhone notch
  viewportFit: 'cover',
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