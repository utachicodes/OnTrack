import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import DashboardClient from '@/components/dashboard-client'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  return <DashboardClient userName={session.user.name} />
}
