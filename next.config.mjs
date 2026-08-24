/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js + Vercel AI SDK use eval-free bundles; we still need
      // 'unsafe-inline' for Next's inline boot scripts (style+script).
      // Nonce-based CSP would be stronger but requires per-request
      // middleware; deferred until we move to App Router CSP helpers.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.cloudfront.net https://*.public.blob.vercel-storage.com https://*.blob.vercel-storage.com",
      "media-src 'self' https://*.cloudfront.net https://*.blob.vercel-storage.com",
      // Vercel AI Gateway (if user later swaps back) + Google Gemini endpoints
      "connect-src 'self' https://*.googleapis.com https://generativelanguage.googleapis.com https://*.vercel.ai https://*.gateway.ai.vercel.com https://*.blob.vercel-storage.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
