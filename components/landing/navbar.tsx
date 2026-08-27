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
      </div>
    </nav>
  )
}
