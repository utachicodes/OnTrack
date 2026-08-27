import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Créer un compte · OnTrack',
}

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Link href="/" className="auth-brand">
          OnTrack
        </Link>

        <div className="auth-aside-content">
          <p className="auth-eyebrow">Espace privé · BAC 2026</p>
          <h1>
            Crée ton espace<span>.</span>
          </h1>
          <p className="auth-aside-copy">
            Tâches, examens, sessions de focus et tuteur IA, réunis au même endroit — gratuit et sans engagement.
          </p>
        </div>

        <p className="auth-fineprint">© OnTrack · Prépare ton BAC, pas la panique.</p>
      </section>

      <section className="auth-form-pane">
        <div className="auth-card">
          <AuthForm mode="sign-up" />
          <p className="auth-switch">
            Déjà membre ? <Link href="/sign-in">Se connecter</Link>
          </p>
        </div>
      </section>
    </main>
  )
}