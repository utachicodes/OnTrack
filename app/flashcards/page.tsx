import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { FlashcardsClient } from '@/components/learn/flashcards-client'
import { AppChrome } from '@/components/app-chrome'

export const metadata = {
  title: 'Flashcards · OnTrack',
}

export default async function FlashcardsPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  return (
    <AppChrome userName={session.user.name} active="flashcards">
      <div className="learn-shell">
        <FlashcardsClient initial={null} />
      </div>
    </AppChrome>
  )
}