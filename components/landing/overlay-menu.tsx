'use client'

import { useEffect, useState } from 'react'

const links = [
  { index: '01', label: 'Méthode', href: '#methode' },
  { index: '02', label: 'Tuteur IA', href: '#tuteur' },
  { index: '03', label: 'Tableau de bord', href: '/dashboard' },
  { index: '04', label: 'Se connecter', href: '/sign-in' },
]

export function OverlayMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setShown(true)
      return
    }
    const t = window.setTimeout(() => setShown(false), 480)
    return () => window.clearTimeout(t)
  }, [open])

  if (!shown) return null

  return (
    <div
      id="landing-overlay"
      aria-hidden={!open}
      className="fixed inset-0 z-40 bg-white overflow-y-auto"
      style={{
        opacity: open ? 1 : 0,
        transition: 'opacity 480ms cubic-bezier(0.76,0,0.24,1)',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      <section className="spread">
        <div className="wrap" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="grid" style={{ width: '100%' }}>
            <div className="band" style={{ paddingTop: 'calc(var(--lh) * 3)' }}>
              <div style={{ gridColumn: '1 / 13' }} className="kicker">
                <span className="accent">●</span> Index · Sections
              </div>
            </div>

            <div className="band" style={{ paddingTop: 'calc(var(--lh) * 2)' }}>
              <nav
                style={{
                  gridColumn: '1 / 13',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--lh)',
                }}
              >
                {links.map((link, i) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'subgrid',
                      gridColumn: '1 / 13',
                      alignItems: 'baseline',
                      color: 'var(--ink)',
                      textDecoration: 'none',
                      transition: `opacity 600ms cubic-bezier(0.76,0,0.24,1), transform 600ms cubic-bezier(0.76,0,0.24,1)`,
                      transitionDelay: open ? `${150 + i * 80}ms` : '0ms',
                      opacity: open ? 1 : 0,
                      transform: open ? 'translateY(0)' : 'translateY(24px)',
                    }}
                  >
                    <span
                      style={{
                        gridColumn: '1 / 3',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.18em',
                        color: 'var(--accent)',
                      }}
                    >
                      {link.index}
                    </span>
                    <span
                      style={{
                        gridColumn: '3 / 13',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 700,
                        fontSize: 'clamp(40px, 8vw, 96px)',
                        lineHeight: '88px',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {link.label}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="band" style={{ paddingTop: 'calc(var(--lh) * 4)' }}>
              <div style={{ gridColumn: '1 / 7' }} className="cap">
                Ferme avec Échap ou le bouton
              </div>
              <button
                type="button"
                onClick={onClose}
                className="cta-ghost"
                style={{ gridColumn: '11 / 13', justifySelf: 'end' }}
              >
                Fermer <span style={{ fontFamily: 'var(--font-mono)' }}>×</span>
              </button>
            </div>
          </div>

          <div className="guides" aria-hidden="true">
            <div className="cols" />
            <div className="rows" />
            <div className="mline l" />
            <div className="mline r" />
          </div>
        </div>
      </section>
    </div>
  )
}
