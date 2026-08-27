import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getPreferences } from '@/app/actions/preferences'
import { SettingsForm } from '@/components/settings-form'
import { AppChrome } from '@/components/app-chrome'

export const metadata = {
  title: 'Réglages · OnTrack',
}

export default async function SettingsPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const prefs = await getPreferences()

  return (
    <AppChrome userName={session.user.name} active="settings">
      <div className="section-heading"><div><p className="eyebrow">Préférences</p><h2>Réglages</h2></div></div>
      <SettingsForm
        initialTheme={prefs?.themePreference ?? 'system'}
        initialAccent={prefs?.accentColor ?? 'coral'}
        initialNotif={prefs?.notifications ?? { reminders: true, examAlerts: true, quietStart: '22:00', quietEnd: '07:00' }}
        userName={session.user.name}
      />
    </AppChrome>
  )
}