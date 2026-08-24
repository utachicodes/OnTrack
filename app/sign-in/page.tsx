import Link from 'next/link'
import { ArrowLeft, Check, CalendarDays, Focus, Sparkles } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Connexion · OnTrack',
}

const perks = [
  { icon: Check, text: 'Des tâches claires, par matière et par priorité.' },
  { icon: CalendarDays, text: 'Le compte à rebours de tes examens, sans anxiété.' },
  { icon: Focus, text: 'Des sessions Pomodoro pour travailler vraiment.' },
  { icon: Sparkles, text: 'Un tuteur IA qui explique, jamais à ta place.' },
]

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
            {perks.map(({ icon: Icon, text }) => (
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
          <ArrowLeft size={14} aria-hidden="true" /> Retour à l’accueil
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