import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Connexion · OnTrack',
}

export default function SignInPage() {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Link href="/" className="auth-brand">
          OnTrack
        </Link>

        <div className="auth-aside-content">
          <p className="auth-eyebrow">Espace privé · BAC 2026</p>
          <h1>
            Bon retour<span>.</span>
          </h1>
          <p className="auth-aside-copy">
            Retrouve tes tâches, tes examens, tes sessions de focus et ton tuteur IA — réunis au même endroit.
          </p>
        </div>

        <p className="auth-fineprint">© OnTrack · Prépare ton BAC, pas la panique.</p>
      </section>

      <section className="auth-form-pane">
        <div className="auth-card">
          <AuthForm mode="sign-in" />
          <p className="auth-switch">
            Nouveau sur OnTrack ? <Link href="/sign-up">Créer un compte</Link>
          </p>
        </div>
      </section>
    </main>
  )
}