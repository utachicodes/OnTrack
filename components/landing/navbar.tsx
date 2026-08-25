'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Navbar() {
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
        <Link
          href="/"
          aria-label="OnTrack, accueil"
          className={`text-white text-xl md:text-2xl font-semibold tracking-tight z-50 transition-[transform,opacity] duration-700 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          OnTrack
        </Link>

        <Link
          href="/sign-in"
          className={`inline-flex items-center px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10 transition-[transform,opacity] duration-700 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: mounted ? '200ms' : '0ms' }}
        >
          Connexion
        </Link>

        <Link
          href="/sign-in"
          aria-label="Connexion"
          className={`md:hidden flex flex-col items-center justify-center w-8 h-8 transition-[transform,opacity] duration-700 ease-entrance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: mounted ? '200ms' : '0ms' }}
        >
          <span className="block w-6 h-[2px] bg-white" />
          <span className="block w-6 h-[2px] bg-white mt-1.5" />
        </Link>
      </div>
    </nav>
  )
}
