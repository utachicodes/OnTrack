import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'
import { AUTH_PERKS } from '@/lib/auth-perks'

export const metadata = {
  title: 'Connexion · OnTrack',
}

export default function SignInPage() {
  return (
    <main className="auth-page">
      <section className="auth-side" aria-hidden="true">
        <Link href="/" className="auth-brand">OnTrack</Link>

        <div className="auth-pitch">
          <p className="auth-eyebrow">Espace privé · BAC 2026</p>
          <h2 className="auth-pitch-title">
            Prépare ton BAC,
            <br />
            <em>pas la panique.</em>
          </h2>
          <p className="auth-pitch-sub">
            Retrouve ton planning, tes tâches et ton tuteur IA exactement où tu les as laissés.
          </p>
          <ul className="auth-perks">
            {AUTH_PERKS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="auth-perk-icon"><Icon size={15} aria-hidden="true" /></span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-fineprint">Gratuit · Sans carte bancaire</p>
      </section>

      <section className="auth-main">
        <Link href="/" className="auth-back">
          <ArrowLeft size={14} aria-hidden="true" /> Retour à l&apos;accueil
        </Link>

        <div className="auth-card">
          <Link href="/" className="auth-brand auth-brand-mobile">OnTrack</Link>

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
      </section>
    </main>
  )
}
