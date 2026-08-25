import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

const origin = (value?: string) => (value ? `https://${value}` : undefined)

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    origin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    origin(process.env.VERCEL_URL) ??
    process.env.V0_RUNTIME_URL,
  emailAndPassword: { enabled: true, autoSignIn: true },
  // Rate limits: per-IP, default 100 req / 60s. Tighter custom rules for
  // sign-in (10/60s) and sign-up (5/60s) to slow brute-force + account
  // enumeration. Sign-out is exempt so legitimate logouts can't be blocked.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': { window: 60, max: 10 },
      '/sign-up/email': { window: 60, max: 5 },
      '/forget-password': { window: 60, max: 5 },
      '/reset-password': { window: 60, max: 5 },
    },
  },
  trustedOrigins: [
    ...(process.env.NODE_ENV === 'development'
      ? [
          'http://localhost:3000',
          ...[process.env.V0_RUNTIME_URL, process.env.V0_DEV_APP_URL, process.env.V0_BUILD_URL, process.env.V0_SANDBOX_URL].filter(Boolean),
        ]
      : []),
    ...(process.env.NODE_ENV === 'production'
      ? [origin(process.env.VERCEL_URL), origin(process.env.VERCEL_PROJECT_PRODUCTION_URL)].filter(Boolean)
      : []),
  ] as string[],
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  // Note: previous dev override (sameSite: 'none', secure: true) silently broke
  // sign-in on http://localhost because modern browsers drop `secure` cookies over
  // http. better-auth defaults to `lax` + http, which works for same-origin dev.
})

export async function getSession() {
  const { headers } = await import('next/headers')
  return auth.api.getSession({ headers: await headers() })
}
