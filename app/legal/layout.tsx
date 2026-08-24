import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales · OnTrack',
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}