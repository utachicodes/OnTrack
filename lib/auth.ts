import { createNeonAuth, type NeonAuth } from '@neondatabase/auth/next/server'

let instance: NeonAuth | null | undefined

function getAuth(): NeonAuth | null {
  if (instance === undefined) {
    const baseUrl = process.env.NEON_AUTH_BASE_URL
    const secret = process.env.NEON_AUTH_COOKIE_SECRET
    if (!baseUrl || !secret) {
      instance = null
      return instance
    }
    instance = createNeonAuth({ baseUrl, cookies: { secret } })
  }
  return instance
}

export const auth = new Proxy({} as NeonAuth, {
  get(_target, prop) {
    const real = getAuth()
    if (!real) throw new Error('Neon Auth is not configured')
    const value = (real as Record<string, unknown>)[prop as string]
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(real) : value
  },
})

export function isAuthConfigured() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET)
}

export async function getSession() {
  const real = getAuth()
  if (!real) return null
  const { data } = await real.getSession()
  return data
}