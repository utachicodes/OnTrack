'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    updateTheme?: (theme: 'light' | 'dark', accent: string) => void
  }
}

/**
 * ThemeInit: applies the user's theme + accent preference to <html>.
 *
 * The initial values are server-rendered onto <html data-theme data-accent>
 * in app/layout.tsx, so there is no FOUC on first paint. This component
 * only handles TWO post-mount concerns:
 *   1. If preference is 'system', listen to matchMedia and update
 *      data-theme to 'light' / 'dark' as the OS preference changes.
 *   2. Expose window.updateTheme(theme, accent) for the settings form
 *      to apply changes instantly after save (without waiting for the
 *      server navigation to land).
 */
export function ThemeInit({ preference }: { preference: 'light' | 'dark' | 'system' }) {
  useEffect(() => {
    if (preference !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = (e: MediaQueryListEvent | MediaQueryList) => {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light'
    }
    apply(mql)
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [preference])

  useEffect(() => {
    window.updateTheme = (theme, accent) => {
      document.documentElement.dataset.theme = theme
      document.documentElement.dataset.accent = accent
    }
  }, [])

  return null
}
