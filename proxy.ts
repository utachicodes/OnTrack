import { auth } from '@/lib/auth'

export default auth.middleware({
  loginUrl: '/sign-in',
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|manifest.webmanifest|sw.js|sign-in|sign-up|legal|$).*)',
  ],
}
