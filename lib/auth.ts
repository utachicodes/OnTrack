import { createNeonAuth } from '@neondatabase/auth/next/server'

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
})

export async function getSession() {
  const { data } = await auth.getSession()
  return data
}
