'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [googlePending, setGooglePending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function handleGoogleSignIn() {
    setError('')
    setGooglePending(true)
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      })
    } catch {
      setError('Connexion Google impossible. Réessayez.')
      setGooglePending(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setPending(true)
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const password = String(data.get('password') ?? '')

    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password })

    setPending(false)
    if (result.error) {
      setError(
        isSignUp
          ? "Impossible de créer votre compte. Vérifiez vos informations puis réessayez."
          : "Connexion impossible avec ces identifiants. Réessayez.",
      )
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="auth-form">
      <button
        className="auth-google-btn"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googlePending}
      >
        {googlePending ? (
          <Loader2 size={18} className="auth-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        {googlePending ? 'Connexion…' : 'Continuer avec Google'}
      </button>

      <div className="auth-divider">
        <span>ou</span>
      </div>

      <form onSubmit={submit} noValidate>
        {isSignUp && (
          <div className="auth-field">
            <span>Nom complet</span>
            <div className="auth-input-wrap">
              <User className="auth-input-icon" size={17} aria-hidden="true" />
              <input
                name="name"
                required
                autoComplete="name"
                placeholder="Votre nom"
                className="auth-input"
              />
            </div>
          </div>
        )}

        <div className="auth-field">
          <span>Email</span>
          <div className="auth-input-wrap">
            <Mail className="auth-input-icon" size={17} aria-hidden="true" />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
              className="auth-input"
            />
          </div>
        </div>

        <div className="auth-field">
          <span>Mot de passe</span>
          <div className="auth-input-wrap">
            <Lock className="auth-input-icon" size={17} aria-hidden="true" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              placeholder={isSignUp ? 'Au moins 8 caractères' : 'Votre mot de passe'}
              className="auth-input"
            />
            <button
              type="button"
              className="auth-eye"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="auth-error" role="alert">
            <AlertCircle size={15} aria-hidden="true" />
            {error}
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={pending}>
          {pending && <Loader2 size={16} className="auth-spin" aria-hidden="true" />}
          {pending
            ? isSignUp
              ? 'Création du compte…'
              : 'Connexion…'
            : isSignUp
              ? 'Créer mon compte'
              : 'Se connecter'}
        </button>

        <p className="auth-footnote">
          En continuant, tu acceptes nos <Link href="/legal">conditions</Link> et notre <Link href="/legal#confidentialite">politique de confidentialité</Link>.
        </p>

        {!isSignUp && (
          <p className="auth-hint">Pas encore de compte ? C&apos;est gratuit et ça prend une minute.</p>
        )}
      </form>
    </div>
  )
}
