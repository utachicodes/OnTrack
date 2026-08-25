import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
import { AuthColumnsArt } from '@/components/auth-columns-art'

export const metadata = {
  title: 'Connexion · OnTrack',
}

export default function SignInPage() {
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
              Bon retour<span>.</span>
            </h1>
            <p>Connecte-toi pour retrouver ton espace.</p>
          </header>

          <AuthForm mode="sign-in" />

          <p className="auth-switch">
            Nouveau sur OnTrack ? <Link href="/sign-up">Créer un compte</Link>
          </p>
        </div>

        <p className="auth-fineprint">© OnTrack · Prépare ton BAC, pas la panique.</p>
      </section>

      <aside className="auth-art-pane" aria-hidden="true">
        <AuthColumnsArt />
      </aside>
    </main>
  )
}
