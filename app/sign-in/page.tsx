import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Sign in — Aurevon',
}

export default function SignInPage() {
  return (
    <main className="lux-auth-page">
      <div className="lux-auth-shell">
        <div className="lux-auth-brand">
          <span className="lux-auth-eyebrow">Aurevon — Members</span>
          <Link href="/" className="lux-auth-back">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back
          </Link>
        </div>

        <header>
          <h1 className="lux-auth-title">Welcome back.</h1>
          <p className="lux-auth-intro" style={{ marginTop: 14 }}>
            Sign in to access your private gallery, saved pieces, and curated recommendations.
          </p>
        </header>

        <AuthForm mode="sign-in" />

        <p className="lux-auth-switch">
          New to Aurevon?{' '}
          <Link href="/sign-up">Request an invitation</Link>
        </p>
      </div>
    </main>
  )
}
