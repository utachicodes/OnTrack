import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'

export const metadata = {
  title: 'Create account — Aurevon',
}

export default function SignUpPage() {
  return (
    <main className="lux-auth-page">
      <div className="lux-auth-shell">
        <div className="lux-auth-brand">
          <span className="lux-auth-eyebrow">Aurevon — Invitation</span>
          <Link href="/" className="lux-auth-back">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Back
          </Link>
        </div>

        <header>
          <h1 className="lux-auth-title">Join the list.</h1>
          <p className="lux-auth-intro" style={{ marginTop: 14 }}>
            Create your account to reserve a place in our private gallery and unlock the full collection.
          </p>
        </header>

        <AuthForm mode="sign-up" />

        <p className="lux-auth-switch">
          Already have an account?{' '}
          <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
