'use client'

import { useEffect, useState } from 'react'
import { Flower2 } from 'lucide-react'

export function Navbar({
  overlayOpen,
  onToggleOverlay,
}: {
  overlayOpen: boolean
  onToggleOverlay: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMounted(true), 100)
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(mountTimer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Left — logo */}
        <a
          href="/"
          aria-label="Aurevon home"
          className={`text-white text-xl md:text-2xl font-semibold tracking-tight z-50 transition-[transform,opacity] duration-700 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: mounted ? '0ms' : '0ms' }}
        >
          Aurevon
        </a>

        {/* Center — desktop pill */}
        <button
          type="button"
          onClick={onToggleOverlay}
          aria-expanded={overlayOpen}
          aria-controls="lux-overlay"
          className={`hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10 transition-[transform,opacity] duration-700 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: mounted ? '200ms' : '0ms' }}
        >
          {overlayOpen ? 'Close' : 'Navigate'}
        </button>

        {/* Right — desktop flower */}
        <div
          className={`hidden md:flex transition-[transform,opacity] duration-700 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: mounted ? '400ms' : '0ms' }}
        >
          <Flower2 className="w-7 h-7 text-white/90" aria-hidden="true" />
        </div>

        {/* Right — mobile hamburger */}
        <button
          type="button"
          onClick={onToggleOverlay}
          aria-label="Toggle menu"
          aria-expanded={overlayOpen}
          aria-controls="lux-overlay"
          className={`md:hidden flex flex-col items-center justify-center gap-1.5 w-8 h-8 transition-[transform,opacity] duration-700 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: mounted ? '200ms' : '0ms' }}
        >
          <span
            className={`block w-6 h-[2px] bg-white transition-transform duration-500 ease-overlay ${
              overlayOpen ? 'translate-y-[4px] rotate-45' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-transform duration-500 ease-overlay ${
              overlayOpen ? '-translate-y-[4px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>
    </nav>
  )
}
