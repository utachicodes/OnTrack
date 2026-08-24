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
          ? "We couldn't create your account. Please check your details and try again."
          : "We couldn't sign you in with those details. Please try again.",
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
          Full name
          <input
            className="lux-auth-input"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
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
          placeholder="you@example.com"
        />
      </label>
      <label className="lux-auth-field">
        Password
        <input
          className="lux-auth-input"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
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
            ? 'Creating account…'
            : 'Signing in…'
          : isSignUp
            ? 'Create account'
            : 'Sign in'}
      </button>
    </form>
  )
}
