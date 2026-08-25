'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isSignUp = mode === 'sign-up'

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
    <form className="auth-form" onSubmit={submit} noValidate={false}>
      {isSignUp && (
        <Label>
          Nom complet
          <div className="auth-input-wrap">
            <User className="auth-input-icon" size={17} aria-hidden="true" />
            <Input
              name="name"
              required
              autoComplete="name"
              placeholder="Votre nom"
              className="auth-input"
            />
          </div>
        </Label>
      )}

      <Label>
        Email
        <div className="auth-input-wrap">
          <Mail className="auth-input-icon" size={17} aria-hidden="true" />
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="auth-input"
          />
        </div>
      </Label>

      <Label>
        Mot de passe
        <div className="auth-input-wrap">
          <Lock className="auth-input-icon" size={17} aria-hidden="true" />
          <Input
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
      </Label>

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
  )
}
