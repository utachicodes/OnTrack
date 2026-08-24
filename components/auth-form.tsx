'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
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
          ? "Impossible de créer votre compte. Vérifiez vos informations et réessayez."
          : "Connexion impossible avec ces identifiants. Réessayez.",
      )
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form className="lux-auth-form" onSubmit={submit} noValidate={false}>
      {isSignUp && (
        <label className="lux-auth-field">
          Nom complet
          <input
            className="lux-auth-input"
            name="name"
            required
            autoComplete="name"
            placeholder="Votre nom"
          />
        </label>
      )}
      <label className="lux-auth-field">
        Email
        <input
          className="lux-auth-input"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.com"
        />
      </label>
      <label className="lux-auth-field">
        Mot de passe
        <input
          className="lux-auth-input"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          placeholder={isSignUp ? 'Au moins 8 caractères' : 'Votre mot de passe'}
        />
      </label>
      {error && (
        <p className="lux-auth-error" role="alert">
          {error}
        </p>
      )}
      <button className="lux-auth-submit" type="submit" disabled={pending}>
        {pending
          ? isSignUp
            ? 'Création du compte…'
            : 'Connexion…'
          : isSignUp
            ? 'Créer mon compte'
            : 'Se connecter'}
      </button>
    </form>
  )
}
