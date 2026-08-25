'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
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
  IconAdd,
  IconChevron,
  IconMenu,
  IconClose,
  IconSparkles,
  IconArrow,
} from '@/components/icons'
import { BrandMark } from '@/components/brand-mark'
import { Button } from '@/components/ui/button'
import { createTask, toggleTask, deleteTask } from '@/app/actions/tasks'
import { createExam, updateExamProgress, deleteExam } from '@/app/actions/exams'
import type { Task, Exam, NavKey } from './dashboard/types'
import { OverviewView } from './dashboard/overview-view'
import { TasksView } from './dashboard/tasks-view'
import { ExamsView } from './dashboard/exams-view'
import { PlanningView } from './dashboard/planning-view'
import { FocusView } from './dashboard/focus-view'
import { LearnView } from './dashboard/learn-view'
import { DocumentsView } from './dashboard/documents-view'
import { GoalsView } from './dashboard/goals-view'
import { HabitsView } from './dashboard/habits-view'
import { FinanceView } from './dashboard/finance-view'
import { TaskModal, ExamModal, PushModal } from './dashboard/modals'

interface DashboardProps {
  userName: string
  initialTasks: Task[]
  initialExams: Exam[]
  focusThisWeek: number
  nowMs: number
}

interface NavItem {
  key: NavKey
  label: string
  icon: (p: { size?: number }) => React.JSX.Element
  accent: string
  group: 'work' | 'me'
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
]

function NavButton({ item, collapsed, active, onSelect }: { item: NavItem; collapsed: boolean; active: boolean; onSelect: () => void }) {
  const Icon = item.icon
  return (
    <button
      className={`nav-item ${active ? 'is-active' : ''}`}
      onClick={onSelect}
      style={{ ['--nav-accent' as string]: item.accent } as React.CSSProperties}
      title={collapsed ? item.label : undefined}
    >
      <span className="nav-icon"><Icon size={18} /></span>
      {!collapsed && <span className="nav-label-text">{item.label}</span>}
    </button>
  )
}

function SidebarLink({ href, icon, label, collapsed }: { href: string; icon: React.ReactNode; label: string; collapsed: boolean }) {
  return (
    <Link href={href} className="nav-item" title={collapsed ? label : undefined}>
      <span className="nav-icon">{icon}</span>
      {!collapsed && <span className="nav-label-text">{label}</span>}
    </Link>
  )
}

export function DashboardClient({ userName, initialTasks, initialExams, focusThisWeek, nowMs }: DashboardProps) {
  const firstName = userName.trim().split(/\s+/)[0] || 'toi'
  const initials = userName.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [focusCount, setFocusCount] = useState(focusThisWeek)
  const [modal, setModal] = useState<'task' | 'exam' | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showPush, setShowPush] = useState(false)
  const [nav, setNav] = useState<NavKey>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [showInstallPill, setShowInstallPill] = useState(false)

  const [clientNow, setClientNow] = useState<number | null>(null)
  useEffect(() => { setClientNow(nowMs) }, [nowMs])
  const todayLabel = clientNow
    ? new Date(clientNow).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase())
    : ''
  const timeLabel = clientNow
    ? new Date(clientNow).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : ''

  useEffect(() => {
    if (typeof window === 'undefined') return
    const deferred = (e: Event) => {
      e.preventDefault()
      window.deferredInstallPrompt = e as BeforeInstallPromptEvent
      setTimeout(() => setShowInstallPill(true), 2500)
    }
    window.addEventListener('beforeinstallprompt', deferred)
    return () => window.removeEventListener('beforeinstallprompt', deferred)
  }, [])

  const completed = useMemo(() => tasks.filter((t) => t.status === 'done').length, [tasks])
  const nextExam = exams[0]

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

        <Link href="/dashboard" className="brand" aria-label="OnTrack - Utachi Industries">
          <BrandMark height={collapsed ? 24 : 28} variant={collapsed ? 'mark' : 'full'} priority />
        </Link>

        <div className="profile-card">
          <div className="avatar">{initials}</div>
          {!collapsed && (
            <div className="profile-meta">
              <strong>{userName}</strong>
              <span>Terminale - BAC 2026</span>
            </div>
          )}
        </div>

        <nav className="nav-list" aria-label="Navigation principale">
          {!collapsed && <p className="nav-label">Espace de travail</p>}
          {NAV.filter((n) => n.group === 'work').map((item) => (
            <NavButton
              key={item.key}
              item={item}
              collapsed={collapsed}
              active={nav === item.key}
              onSelect={() => { setNav(item.key); setMobileOpen(false) }}
            />
          ))}
          {!collapsed && <p className="nav-label second">Personnel</p>}
          {NAV.filter((n) => n.group === 'me').map((item) => (
            <NavButton
              key={item.key}
              item={item}
              collapsed={collapsed}
              active={nav === item.key}
              onSelect={() => { setNav(item.key); setMobileOpen(false) }}
            />
          ))}
          {!collapsed && <p className="nav-label second">Outils</p>}
          <SidebarLink href="/flashcards" icon={<IconLearn size={16} />} label="Flashcards" collapsed={collapsed} />
          <SidebarLink href="/examen-blanc" icon={<IconExams size={16} />} label="Examen blanc" collapsed={collapsed} />
        </nav>

        <div className="sidebar-bottom">
          <SidebarLink href="/settings" icon={<IconSettings size={16} />} label="Réglages" collapsed={collapsed} />
          <button className="nav-item" onClick={() => setShowPush(true)}>
            <span className="nav-icon"><IconBell size={16} /></span>
            {!collapsed && <span>Notifications</span>}
            {!collapsed && <i className="dot" />}
          </button>
          <button
            className="nav-item"
            onClick={async () => {
              const prompt = window.deferredInstallPrompt
              if (!prompt) return
              await prompt.prompt()
              try { await prompt.userChoice } catch { /* ignore */ }
              window.deferredInstallPrompt = undefined
              setShowInstallPill(false)
            }}
          >
            <span className="nav-icon"><IconSparkles size={16} /></span>
            {!collapsed && <span>Installer</span>}
          </button>
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
            <strong>{NAV.find((n) => n.key === nav)?.label}</strong>
          </div>
          <div className="top-actions">
            <button className="search-pill">
              <IconSearch size={14} />
              <span>Rechercher</span>
              <kbd>⌘ K</kbd>
            </button>
            <button className="icon-button" aria-label="Notifications" onClick={() => setShowPush(true)}>
              <IconBell size={16} />
              <i className="dot" />
            </button>
            <div className="mini-avatar">{initials}</div>
          </div>
        </header>

        {showInstallPill && (
          <button
            className="install-pill"
            onClick={async () => {
              const prompt = window.deferredInstallPrompt
              if (!prompt) { setShowInstallPill(false); return }
              await prompt.prompt()
              try { await prompt.userChoice } catch { /* ignore */ }
              window.deferredInstallPrompt = undefined
              setShowInstallPill(false)
            }}
          >
            <IconSparkles size={14} />
            <span>Installer OnTrack sur ton téléphone</span>
            <IconArrow size={12} />
          </button>
        )}

        <div className="content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">{todayLabel} {timeLabel && `- ${timeLabel}`}</p>
              <h1>Bonjour {firstName}.</h1>
              <p className="subhead">Une nouvelle journée pour avancer sereinement vers ton BAC.</p>
            </div>
            <Button variant="default" size="lg" onClick={() => setModal('task')}>
              <IconAdd size={17} /> Ajouter une tâche
            </Button>
          </div>

          {nav === 'overview' && <OverviewView
            tasks={tasks}
            completed={completed}
            nextExam={nextExam}
            focusThisWeek={focusCount}
            nowMs={nowMs}
            onTaskToggle={async (id) => {
              const updated = await toggleTask(id)
              setTasks((cur) => cur.map((t) => t.id === id ? { ...t, status: updated.status as 'todo' | 'done' } : t))
            }}
            onAddTask={() => setModal('task')}
            onAddExam={() => setModal('exam')}
          />}

          {nav === 'tasks' && <TasksView tasks={tasks}
            nowMs={nowMs}
            onToggle={async (id) => {
              const updated = await toggleTask(id)
              setTasks((cur) => cur.map((t) => t.id === id ? { ...t, status: updated.status as 'todo' | 'done' } : t))
            }}
            onDelete={async (id) => {
              await deleteTask(id)
              setTasks((cur) => cur.filter((t) => t.id !== id))
            }}
            onAdd={() => setModal('task')} />}

          {nav === 'exams' && <ExamsView exams={exams}
            nowMs={nowMs}
            onProgress={async (id, p) => {
              await updateExamProgress(id, p)
              setExams((cur) => cur.map((e) => e.id === id ? { ...e, preparationPercent: p } : e))
            }}
            onDelete={async (id) => {
              await deleteExam(id)
              setExams((cur) => cur.filter((e) => e.id !== id))
            }}
            onAdd={() => setModal('exam')} />}

          {nav === 'planning' && <PlanningView exams={exams} tasks={tasks} nowMs={nowMs} />}
          {nav === 'focus' && <FocusView thisWeek={focusCount} onFocusComplete={() => setFocusCount((c) => c + 1)} />}
          {nav === 'learn' && <LearnView />}
          {nav === 'documents' && <DocumentsView />}
          {nav === 'goals' && <GoalsView />}
          {nav === 'habits' && <HabitsView thisWeek={focusCount} />}
          {nav === 'finance' && <FinanceView />}
        </div>
      </section>

      {modal === 'task' && <TaskModal onClose={() => setModal(null)} onCreate={async (input) => {
        const task = await createTask(input)
        setTasks((cur) => [...cur, {
          id: task.id, title: task.title, subject: task.subject ?? 'Général',
          estimatedMinutes: task.estimatedMinutes, priority: task.priority as 'low' | 'medium' | 'high',
          status: task.status as 'todo' | 'done', dueAt: task.dueAt ? task.dueAt.toISOString() : null,
        }])
        setModal(null)
      }} />}

      {modal === 'exam' && <ExamModal onClose={() => setModal(null)} onCreate={async (input) => {
        const exam = await createExam(input)
        setExams((cur) => [...cur, {
          id: exam.id, title: exam.title, subject: exam.subject,
          examAt: exam.examAt.toISOString(), preparationPercent: exam.preparationPercent,
        }])
        setModal(null)
      }} />}

      {showPush && <PushModal onClose={() => setShowPush(false)} />}
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
    </main>
  )
}
