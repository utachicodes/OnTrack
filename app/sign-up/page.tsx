import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Créer un compte — Aurevon',
}

export default function SignUpPage() {
  return (
    <main className="lux-auth-page">
      <div className="lux-auth-shell">
        <div className="lux-auth-brand">
          <span className="lux-auth-eyebrow">Aurevon — Invitation</span>
          <Link href="/" className="lux-auth-back">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Retour
          </Link>
        </div>

        <header>
          <h1 className="lux-auth-title">Créez votre espace.</h1>
          <p className="lux-auth-intro" style={{ marginTop: 14 }}>
            Un espace privé pour préparer le BAC avec méthode : tâches, examens, sessions de focus et tuteur IA.
          </p>
        </header>

        <AuthForm mode="sign-up" />

        <p className="lux-auth-switch">
          Déjà membre ?{' '}
          <Link href="/sign-in">Se connecter</Link>
        </p>
      </div>
    </main>
  )
}
