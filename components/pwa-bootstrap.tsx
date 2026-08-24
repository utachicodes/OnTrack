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

export function PWABootstrap() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => undefined)
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      window.__deferredInstallPrompt = e
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const trigger = async () => {
      const prompt = window.__deferredInstallPrompt
      if (!prompt) return
      await prompt.prompt()
      try { await prompt.userChoice } catch { /* ignore */ }
      window.__deferredInstallPrompt = undefined
      setShow(false)
    }
    window.addEventListener('show-install', trigger as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('show-install', trigger as EventListener)
    }
  }, [])

  if (!show) return null

  return (
    <button
      className="pwa-floating"
      onClick={async () => {
        const prompt = window.__deferredInstallPrompt
        if (!prompt) return
        await prompt.prompt()
        try { await prompt.userChoice } catch { /* ignore */ }
        window.__deferredInstallPrompt = undefined
        setShow(false)
      }}
      aria-label="Installer OnTrack"
    >
      Installer l’app
    </button>
  )
}