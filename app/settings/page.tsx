import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { getPreferences } from '@/app/actions/preferences'
import { SettingsForm } from '@/components/settings-form'

export const metadata = {
  title: 'Réglages — orbite',
}

export default async function SettingsPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const prefs = await getPreferences()

  return (
    <main className="settings-page">
      <header className="settings-header">
        <Link href="/dashboard" className="settings-back">
          <ArrowLeft className="w-4 h-4" /> Tableau de bord
        </Link>
        <span className="settings-eyebrow">Réglages</span>
      </header>

      <div className="settings-shell">
        <h1 className="settings-title">Personnalise ton espace.</h1>
        <p className="settings-intro">
          Choisis un thème et une couleur d’accent. Les réglages sont enregistrés sur ton compte et
          s’appliquent à toutes tes sessions, sur tous tes appareils.
        </p>

        <SettingsForm
          initialTheme={prefs?.themePreference ?? 'system'}
          initialAccent={prefs?.accentColor ?? 'coral'}
          userName={session.user.name}
        />
      </div>
    </main>
  )
}
