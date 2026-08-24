import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Connexion — Aurevon',
}

export default function SignInPage() {
  return (
    <main className="lux-auth-page">
      <div className="lux-auth-shell">
        <div className="lux-auth-brand">
          <span className="lux-auth-eyebrow">Aurevon — Membres</span>
          <Link href="/" className="lux-auth-back">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Retour
          </Link>
        </div>

        <header>
          <h1 className="lux-auth-title">Bon retour.</h1>
          <p className="lux-auth-intro" style={{ marginTop: 14 }}>
            Connectez-vous pour retrouver vos tâches, vos examens et votre tuteur IA.
          </p>
        </header>

        <AuthForm mode="sign-in" />

        <p className="lux-auth-switch">
          Nouveau sur Aurevon ?{' '}
          <Link href="/sign-up">Créer un compte</Link>
        </p>
      </div>
    </main>
  )
}
