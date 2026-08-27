// OnTrack service worker — minimal shell + offline fallback.
// Cached pages: landing, sign-in, sign-up, legal, dashboard.
// API calls bypass cache. Static assets: stale-while-revalidate.
const VERSION = 'ontrack-v4'
const CORE = [
  '/',
  '/sign-in',
  '/sign-up',
  '/legal',
  '/dashboard',
  '/learn',
  '/flashcards',
  '/examen-blanc',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION)
    await cache.addAll(CORE).catch(() => undefined)
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    await self.clients.claim()
  })())
})

function isCacheable(res) {
  return res && res.ok && res.type === 'basic'
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req)
        if (isCacheable(fresh)) {
          const cache = await caches.open(VERSION)
          await cache.put(req, fresh.clone()).catch(() => undefined)
        }
        return fresh
      } catch {
        const cached = await caches.match(req)
        if (cached) return cached
        const fallback = await caches.match('/dashboard')
        if (fallback) return fallback
        return new Response('Hors ligne', { status: 503, statusText: 'offline' })
      }
    })())
    return
  }

  event.respondWith((async () => {
    const cached = await caches.match(req).catch(() => undefined)
    if (cached) return cached
    try {
      const res = await fetch(req)
      if (isCacheable(res)) {
        const clone = res.clone()
        caches.open(VERSION).then((c) => c.put(req, clone)).catch(() => undefined)
      }
      return res
    } catch {
      if (cached) return cached
      return new Response('', { status: 503, statusText: 'offline' })
    }
  })())
})

self.addEventListener('push', (event) => {
  let payload = { title: 'OnTrack', body: 'Tu as une notification OnTrack.', url: '/dashboard' }
  try {
    if (event.data) payload = { ...payload, ...event.data.json() }
  } catch { /* malformed payload */ }

  event.waitUntil((async () => {
    await self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: payload.url },
    })
  })())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/dashboard'
  event.waitUntil((async () => {
    const all = await clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of all) {
      if ('focus' in client) { await client.focus(); return }
    }
    if (clients.openWindow) await clients.openWindow(url)
  })())
})