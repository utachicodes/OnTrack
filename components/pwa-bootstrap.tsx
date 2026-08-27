'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
  interface Window {
    __deferredInstallPrompt?: BeforeInstallPromptEvent
  }
}

function isIOSDevice() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export function PWABootstrap() {
  const [showInstaller, setShowInstaller] = useState(false)
  const [showIosHint, setShowIosHint] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    // Already installed as a PWA — nothing to do.
    if (isStandalone()) {
      navigator.serviceWorker?.register?.('/sw.js').catch(() => undefined)
      return
    }

    const isIos = isIOSDevice()
    setIos(isIos)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      window.__deferredInstallPrompt = e
      setShowInstaller(true)
    }

    const trigger = async () => {
      if (isIos) {
        setShowIosHint(true)
        return
      }
      const prompt = window.__deferredInstallPrompt
      if (!prompt) return
      await prompt.prompt()
      try {
        await prompt.userChoice
      } catch {
        /* ignore */
      }
      window.__deferredInstallPrompt = undefined
      setShowInstaller(false)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('show-install', trigger as EventListener)

    // iOS Safari never fires "beforeinstallprompt" — show a hint button
    // that explains the Share → Add to Home Screen flow.
    if (isIos && !window.localStorage.getItem('ontrack-ios-hint-seen')) {
      setShowInstaller(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('show-install', trigger as EventListener)
    }
  }, [])

  const openIosHint = () => {
    window.localStorage.setItem('ontrack-ios-hint-seen', '1')
    setShowInstaller(false)
    setShowIosHint(true)
  }

  if (showIosHint) {
    return (
      <div className="pwa-ios-hint" role="dialog" aria-label="Installer OnTrack sur iPhone">
        <p>
          Sur iPhone : touche <strong>Partager</strong>{' '}
          <span className="pwa-ios-share" aria-hidden="true">⎋</span>, puis{' '}
          <strong>Sur l’écran d’accueil</strong>.
        </p>
        <button
          type="button"
          className="pwa-ios-close"
          onClick={() => setShowIosHint(false)}
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    )
  }

  if (!showInstaller) return null

  return (
    <button
      className="pwa-floating"
      onClick={ios ? openIosHint : undefined}
      aria-label="Installer OnTrack"
    >
      Installer l’app
    </button>
  )
}