import { NextRequest, NextResponse } from 'next/server'
import { auth, isAuthConfigured } from '@/lib/auth'

export default async function proxy(request: NextRequest) {
  if (!isAuthConfigured()) return NextResponse.next()
  return auth.middleware({ loginUrl: '/sign-in' })(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.png|manifest.webmanifest|sw.js|sign-in|sign-up|legal|$).*)',
  ],
}