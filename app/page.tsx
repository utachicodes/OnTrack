import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Landing } from '@/components/landing/landing'

export const metadata = {
  title: 'OnTrack',
}

export default async function Page() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return <Landing />
}
