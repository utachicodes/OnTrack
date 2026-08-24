import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { GridToggle } from '@/components/landing/grid-toggle'

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
  colorScheme: 'light',
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased bg-white text-[var(--ink)]">
        {children}
        <GridToggle />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
