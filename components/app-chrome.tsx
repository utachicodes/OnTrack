'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  IconOverview,
  IconLearn,
  IconExams,
  IconTasks,
  IconPlanning,
  IconFocus,
  IconDocs,
  IconGoals,
  IconHabits,
  IconFinance,
  IconSettings,
  IconBell,
  IconSearch,
  IconChevron,
  IconMenu,
  IconClose,
  IconLayers,
  IconPen,
  IconUser,
} from '@/components/icons'
import { PushModal } from '@/components/dashboard/modals'
import type { NavKey } from '@/components/dashboard/types'

export type ChromeKey = NavKey | 'flashcards' | 'examen-blanc' | 'learn' | 'profile' | 'settings'

interface NavItem {
  key: ChromeKey
  label: string
  icon: ComponentType<{ size?: number }>
  accent: string
  group: 'work' | 'me' | 'tools' | 'bottom'
}

interface PaletteEntry {
  label: string
  hint?: string
  icon?: ReactNode
  onPick: () => void
}

const NAV: NavItem[] = [
  { key: 'overview', label: "Vue d'ensemble", icon: IconOverview, accent: '#ee705f', group: 'work' },
  { key: 'learn', label: 'Apprendre', icon: IconLearn, accent: '#5266b6', group: 'work' },
  { key: 'exams', label: 'Examens', icon: IconExams, accent: '#d4a05a', group: 'work' },
  { key: 'tasks', label: 'Tâches', icon: IconTasks, accent: '#5fb87e', group: 'work' },
  { key: 'planning', label: 'Planning', icon: IconPlanning, accent: '#7d5fb8', group: 'work' },
  { key: 'focus', label: 'Focus', icon: IconFocus, accent: '#ee705f', group: 'work' },
  { key: 'documents', label: 'Bibliothèque', icon: IconDocs, accent: '#d4a05a', group: 'work' },
  { key: 'goals', label: 'Objectifs', icon: IconGoals, accent: '#ee705f', group: 'me' },
  { key: 'habits', label: 'Habitudes', icon: IconHabits, accent: '#ff8a76', group: 'me' },
  { key: 'finance', label: 'Finances', icon: IconFinance, accent: '#7d5fb8', group: 'me' },
  { key: 'flashcards', label: 'Flashcards', icon: IconLayers, accent: '#5266b6', group: 'tools' },
  { key: 'examen-blanc', label: 'Examen blanc', icon: IconPen, accent: '#d4a05a', group: 'tools' },
  { key: 'settings', label: 'Réglages', icon: IconSettings, accent: '#7d8291', group: 'bottom' },
]

const EXT_LINKS: Record<string, string> = {
  flashcards: '/flashcards',
  'examen-blanc': '/examen-blanc',
  learn: '/learn',
  profile: '/profile',
  settings: '/settings',
}

function initialsOf(name: string) {
  return name.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

interface AppChromeProps {
  userName: string
  active: ChromeKey
  onNav?: (key: NavKey) => void
  searchIndex?: PaletteEntry[]
  userImage?: string | null
  children: ReactNode
}

export function AppChrome({ userName, active, onNav, searchIndex = [], userImage = null, children }: AppChromeProps) {
  const router = useRouter()
  const initials = useMemo(() => initialsOf(userName), [userName])
  const firstName = useMemo(() => userName.trim().split(/\s+/)[0] || 'toi', [userName])

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const [showPush, setShowPush] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        setQuery('')
        setCursor(0)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (paletteOpen) {
      setQuery('')
      setCursor(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [paletteOpen])

  const navLabel = NAV.find((n) => n.key === active)?.label ?? 'Mon espace'

  const paletteEntries = useMemo(() => {
    const sections: PaletteEntry[] = NAV.map((item) => ({
      label: item.label,
      icon: <item.icon size={17} />,
      onPick: () => {
        setPaletteOpen(false)
        if (item.key === 'learn' || item.group === 'bottom' || item.group === 'tools') {
          router.push(EXT_LINKS[item.key])
          return
        }
        if (onNav) onNav(item.key as NavKey)
        else router.push(`/dashboard?view=${item.key}`)
      },
    }))
    return [...sections, ...searchIndex]
  }, [onNav, router, searchIndex])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = q ? paletteEntries.filter((e) => e.label.toLowerCase().includes(q) || (e.hint ?? '').toLowerCase().includes(q)) : paletteEntries
    return pool
  }, [query, paletteEntries])

  useEffect(() => {
    setCursor(0)
  }, [query])

  function activateIndex(i: number) {
    const entry = results[i]
    if (!entry) return
    setPaletteOpen(false)
    entry.onPick()
  }

  return (
    <main className={`app-shell ${collapsed ? 'is-rail' : 'is-expanded'}`}>
      <aside className={`sidebar ${mobileOpen ? 'is-mobile-open' : ''}`}>
        <button
          className="rail-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Étendre le menu' : 'Réduire le menu'}
        >
          {collapsed ? <IconMenu size={16} /> : <IconClose size={16} />}
        </button>

        <Link href="/dashboard" className="brand" aria-label="OnTrack, accueil">
          <span className="brand-name">OnTrack</span>
        </Link>

        <nav className="nav-list" aria-label="Navigation principale">
          {!collapsed && <p className="nav-label">Espace de travail</p>}
          {NAV.filter((n) => n.group === 'work').map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            const inner = (
              <>
                <span className="nav-icon"><Icon size={18} /></span>
                {!collapsed && <span className="nav-label-text">{item.label}</span>}
              </>
            )
            if (item.key === 'learn') {
              return (
                <Link
                  key={item.key}
                  href="/learn"
                  className={`nav-item ${isActive ? 'is-active' : ''}`}
                  style={{ ['--nav-accent' as string]: item.accent } as CSSProperties}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {inner}
                </Link>
              )
            }
            if (onNav) {
              return (
                <button
                  key={item.key}
                  className={`nav-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => { onNav(item.key as NavKey); setMobileOpen(false) }}
                  style={{ ['--nav-accent' as string]: item.accent } as CSSProperties}
                  title={collapsed ? item.label : undefined}
                >
                  {inner}
                </button>
              )
            }
            return (
              <Link
                key={item.key}
                href={`/dashboard?view=${item.key}`}
                className={`nav-item ${isActive ? 'is-active' : ''}`}
                style={{ ['--nav-accent' as string]: item.accent } as CSSProperties}
                title={collapsed ? item.label : undefined}
              >
                {inner}
              </Link>
            )
          })}
          {!collapsed && <p className="nav-label second">Personnel</p>}
          {NAV.filter((n) => n.group === 'me').map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            const inner = (
              <>
                <span className="nav-icon"><Icon size={18} /></span>
                {!collapsed && <span className="nav-label-text">{item.label}</span>}
              </>
            )
            if (onNav) {
              return (
                <button
                  key={item.key}
                  className={`nav-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => { onNav(item.key as NavKey); setMobileOpen(false) }}
                  style={{ ['--nav-accent' as string]: item.accent } as CSSProperties}
                  title={collapsed ? item.label : undefined}
                >
                  {inner}
                </button>
              )
            }
            return (
              <Link
                key={item.key}
                href={`/dashboard?view=${item.key}`}
                className={`nav-item ${isActive ? 'is-active' : ''}`}
                style={{ ['--nav-accent' as string]: item.accent } as CSSProperties}
                title={collapsed ? item.label : undefined}
              >
                {inner}
              </Link>
            )
          })}
          {!collapsed && <p className="nav-label second">Outils</p>}
          {NAV.filter((n) => n.group === 'tools').map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <Link
                key={item.key}
                href={EXT_LINKS[item.key]}
                className={`nav-item ${isActive ? 'is-active' : ''}`}
                style={{ ['--nav-accent' as string]: item.accent } as CSSProperties}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon"><Icon size={18} /></span>
                {!collapsed && <span className="nav-label-text">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          {NAV.filter((n) => n.group === 'bottom').map((item) => {
            const Icon = item.icon
            const isActive = active === item.key
            return (
              <Link
                key={item.key}
                href={EXT_LINKS[item.key]}
                className={`nav-item ${isActive ? 'is-active' : ''}`}
                style={{ ['--nav-accent' as string]: item.accent } as CSSProperties}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon"><Icon size={18} /></span>
                {!collapsed && <span className="nav-label-text">{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <IconClose size={18} /> : <IconMenu size={18} />}
          </button>
          <div className="crumb">
            <span>Mon espace</span>
            <IconChevron size={12} />
            <strong>{navLabel}</strong>
          </div>
          <div className="top-actions">
            <button className="search-pill" onClick={() => setPaletteOpen(true)}>
              <IconSearch size={14} />
              <span>Rechercher</span>
              <kbd>⌘ K</kbd>
            </button>
            <button className="icon-button" aria-label="Notifications" onClick={() => setShowPush(true)}>
              <IconBell size={16} />
              <i className="dot" />
            </button>
            <Link href="/profile" aria-label="Voir le profil">
              <div className="mini-avatar">{userImage ? <img src={userImage} alt="" /> : initials}</div>
            </Link>
          </div>
        </header>

        <div className="content">{children}</div>
      </section>

      {paletteOpen && (
        <div className="cmd-backdrop" onClick={() => setPaletteOpen(false)}>
          <div
            className="cmd-window"
            role="dialog"
            aria-modal="true"
            aria-label="Recherche"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
              if (e.key === 'Enter') { e.preventDefault(); activateIndex(cursor) }
            }}
          >
            <div className="cmd-input">
              <IconSearch size={16} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Bonjour ${firstName}, que cherches-tu ?`}
              />
              <kbd>ESC</kbd>
            </div>
            <div className="cmd-list">
              {results.length === 0 && <p className="cmd-empty">Aucun résultat pour « {query} ».</p>}
              {results.map((entry, i) => (
                <button
                  key={`${entry.label}-${i}`}
                  className={`cmd-item ${i === cursor ? 'is-active' : ''}`}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => activateIndex(i)}
                >
                  <span className="cmd-icon">{entry.icon}</span>
                  <span className="cmd-text">
                    <strong>{entry.label}</strong>
                    {entry.hint && <small>{entry.hint}</small>}
                  </span>
                  <span className="cmd-kbd">↵</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPush && <PushModal onClose={() => setShowPush(false)} />}
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
    </main>
  )
}