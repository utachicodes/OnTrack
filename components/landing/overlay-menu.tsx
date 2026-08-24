'use client'

import { useEffect, useState } from 'react'

const links = [
  { label: 'Home', href: '#' },
  { label: 'Story', href: '#' },
  { label: 'Collection', href: '#' },
  { label: 'Inquire', href: '#' },
]

export function OverlayMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Track the "shown" state with a tick so close animations can play,
  // and stagger delays only when opening.
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      // mount immediately for the entry animation
      setShown(true)
    } else {
      // let the exit transition complete before unmounting
      const t = window.setTimeout(() => setShown(false), 700)
      return () => window.clearTimeout(t)
    }
  }, [open])

  if (!shown) return null

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-opacity duration-700 ease-overlay ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <nav className="flex flex-col items-center gap-8">
        {links.map((link, index) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className={`font-instrument text-white text-4xl md:text-6xl hover:opacity-60 transition-[transform,opacity] duration-600 ease-overlay ${
              open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: open ? `${150 + index * 80}ms` : '0ms' }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
