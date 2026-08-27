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

const INSTALL_SEEN_KEY = 'ontrack-install-prompt-seen'

export function PWABootstrap() {
  const [open, setOpen] = useState(false)
  const [ios, setIos] = useState(false)
  const [showSteps, setShowSteps] = useState(false)

  useEffect(() => {
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
      if (window.localStorage.getItem(INSTALL_SEEN_KEY)) return
      e.preventDefault()
      window.__deferredInstallPrompt = e
      window.localStorage.setItem(INSTALL_SEEN_KEY, '1')
      setShowSteps(false)
      setOpen(true)
    }

    const trigger = () => {
      setShowSteps(false)
      setOpen(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('show-install', trigger as EventListener)

    // iOS never fires "beforeinstallprompt" — show the modal once so the
    // user learns about the Share → Add to Home Screen flow.
    if (isIos && !window.localStorage.getItem(INSTALL_SEEN_KEY)) {
      window.localStorage.setItem(INSTALL_SEEN_KEY, '1')
      setOpen(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('show-install', trigger as EventListener)
    }
  }, [])

  const close = () => setOpen(false)

  const install = async () => {
    if (ios) {
      // No programmatic install on iOS — walk through the share flow.
      setShowSteps(true)
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
    setOpen(false)
  }

  const later = () => {
    window.localStorage.setItem(INSTALL_SEEN_KEY, '1')
    setOpen(false)
    setShowSteps(false)
  }

  if (!open) return null

  return (
    <div className="pwa-modal-backdrop" role="dialog" aria-modal="true" aria-label="Installer OnTrack">
      <div className="pwa-modal">
        {showSteps ? (
          <>
            <h2>Installer OnTrack sur iPhone</h2>
            <p className="pwa-modal-text">
              Touche <strong>Partager</strong>{' '}
              <span className="pwa-ios-share" aria-hidden="true">⎋</span>, puis{' '}
              <strong>Sur l’écran d’accueil</strong>.
            </p>
            <div className="pwa-modal-actions">
              <button type="button" className="pwa-modal-primary" onClick={close}>
                Compris
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Installez OnTrack</h2>
            <p className="pwa-modal-text">
              Accédez rapidement à vos tâches, vos examens et votre espace depuis votre écran d’accueil.
            </p>
            <div className="pwa-modal-actions">
              <button type="button" className="pwa-modal-primary" onClick={install}>
                Installer
              </button>
              <button type="button" className="pwa-modal-secondary" onClick={later}>
                Plus tard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}