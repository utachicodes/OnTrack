import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Créer un compte · OnTrack',
}

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <section className="auth-form-pane">
        <Link href="/" className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true" />
          <span className="auth-brand-text">OnTrack</span>
        </Link>

        <div className="auth-card">
          <p className="auth-eyebrow">Espace privé · BAC 2026</p>
          <header className="auth-head">
            <h1>
              Crée ton espace<span>.</span>
            </h1>
            <p>Tâches, examens, focus et tuteur IA. Tout y est.</p>
          </header>

          <AuthForm mode="sign-up" />

          <p className="auth-switch">
            Déjà membre ? <Link href="/sign-in">Se connecter</Link>
          </p>
        </div>

        <p className="auth-fineprint">© OnTrack · Prépare ton BAC, pas la panique.</p>
      </section>
    </main>
  )
}
