'use client'

import { useEffect, useState } from 'react'
import { Navbar } from './navbar'
import { OverlayMenu } from './overlay-menu'
import { Hero } from './hero'

export function Landing() {
  const [overlayOpen, setOverlayOpen] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = overlayOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [overlayOpen])

  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOverlayOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [overlayOpen])

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        overlayOpen={overlayOpen}
        onToggleOverlay={() => setOverlayOpen((v) => !v)}
      />
      <OverlayMenu open={overlayOpen} onClose={() => setOverlayOpen(false)} />
      <Hero />
    </div>
  )
}
