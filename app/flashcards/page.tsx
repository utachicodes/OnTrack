import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { FlashcardsClient } from '@/components/learn/flashcards-client'

export const metadata = {
  title: 'Flashcards · OnTrack',
}

export default async function FlashcardsPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  return (
    <main className="learn-page">
      <header className="learn-header">
        <Link href="/dashboard" className="legal-back">
          <ArrowLeft size={14} /> Tableau de bord
        </Link>
        <span className="legal-eyebrow">Révisions espacées</span>
      </header>

      <div className="learn-shell">
        <FlashcardsClient initial={null} />
      </div>
    </main>
  )
}