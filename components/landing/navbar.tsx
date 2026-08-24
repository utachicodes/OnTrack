'use client'

import { useEffect, useState } from 'react'

export function Navbar({
  overlayOpen,
  onToggleOverlay,
}: {
  overlayOpen: boolean
  onToggleOverlay: () => void
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white/85 backdrop-blur-md border-b border-[var(--rule)]' : 'bg-transparent'
      }`}
    >
      <div
        className="grid mx-auto"
        style={{
          maxWidth: 'var(--maxw)',
          padding: 'calc(var(--lh) * 0.75) var(--margin)',
          alignItems: 'center',
        }}
      >
        <a
          href="/"
          aria-label="orbite — accueil"
          className="kicker"
          style={{ gridColumn: '1 / 3', color: 'var(--ink)' }}
        >
          <span className="accent">●</span> orbite
        </a>

        {/* desktop section list */}
        <div
          className="hidden md:flex"
          style={{ gridColumn: '5 / 11', justifyContent: 'center', gap: '32px' }}
        >
          <a href="#methode" className="kicker" style={{ color: 'var(--ink-soft)' }}>
            Méthode
          </a>
          <a href="#tuteur" className="kicker" style={{ color: 'var(--ink-soft)' }}>
            Tuteur IA
          </a>
          <a href="/dashboard" className="kicker" style={{ color: 'var(--ink-soft)' }}>
            Tableau de bord
          </a>
        </div>

        {/* desktop sign-in */}
        <a
          href="/sign-in"
          className="hidden md:inline-flex cta"
          style={{ gridColumn: '12 / 13', justifySelf: 'end', padding: '10px 16px', fontSize: '12px' }}
        >
          Se connecter <span className="arr">→</span>
        </a>

        {/* mobile hamburger */}
        <button
          type="button"
          onClick={onToggleOverlay}
          aria-label="Ouvrir le menu"
          aria-expanded={overlayOpen}
          aria-controls="landing-overlay"
          className="md:hidden"
          style={{
            gridColumn: '11 / 13',
            justifySelf: 'end',
            background: 'transparent',
            border: 0,
            padding: '4px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: 'var(--ink)',
              transition: 'transform 320ms cubic-bezier(0.76,0,0.24,1)',
              transform: overlayOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '2px',
              background: 'var(--ink)',
              transition: 'transform 320ms cubic-bezier(0.76,0,0.24,1)',
              transform: overlayOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>
    </nav>
  )
}
