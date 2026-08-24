'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
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
  IconTimer,
  IconFlame,
  IconArrow,
  IconCheck,
  IconTrending,
  IconSend,
  IconHourglass,
  IconReset,
} from '@/components/icons'
import { BrandMark } from '@/components/brand-mark'
import { createTask, toggleTask, deleteTask } from '@/app/actions/tasks'
import { createExam, updateExamProgress, deleteExam } from '@/app/actions/exams'
import { Pomodoro } from '@/components/pomodoro'
import { AITutorPanel } from '@/components/ai-tutor-panel'

interface Task {
  id: string
  title: string
  subject: string
  estimatedMinutes: number
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'done'
  dueAt: string | null
}

interface Exam {
  id: string
  title: string
  subject: string
  examAt: string
  preparationPercent: number
}

interface DashboardProps {
  userName: string
  initialTasks: Task[]
  initialExams: Exam[]
  focusThisWeek: number
}

const SUBJECTS = ['Mathématiques', 'Physique', 'Français', 'Histoire', 'Philosophie', 'SVT', 'Anglais']

type NavKey = 'overview' | 'tasks' | 'exams' | 'planning' | 'focus' | 'learn' | 'documents' | 'goals' | 'habits' | 'finance'

interface NavItem {
  key: NavKey
  label: string
  icon: (p: { size?: number }) => JSX.Element
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

function formatDue(iso: string | null): { label: string; urgent: boolean; color: string } {
  if (!iso) return { label: 'Pas d’échéance', urgent: false, color: '#7d8291' }
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.round((d.getTime() - now.getTime()) / 86400000)
  const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  if (diff < 0) return { label: `En retard · ${date}`, urgent: true, color: '#d8553f' }
  if (diff === 0) return { label: `Aujourd’hui · ${date}`, urgent: true, color: '#ee705f' }
  if (diff === 1) return { label: `Demain · ${date}`, urgent: true, color: '#ee705f' }
  if (diff <= 7) return { label: `Dans ${diff} j · ${date}`, urgent: false, color: '#5b6066' }
  return { label: date, urgent: false, color: '#5b6066' }
}

function daysUntil(iso: string): number {
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 86400000))
}

function accentClass(p: Task['priority']): string {
  if (p === 'low') return 'pill-emerald'
  if (p === 'medium') return 'pill-amber'
  return 'pill-coral'
}

export function DashboardClient({ userName, initialTasks, initialExams, focusThisWeek }: DashboardProps) {
  const firstName = userName.trim().split(/\s+/)[0] || 'toi'
  const initials = userName.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  const [nav, setNav] = useState<NavKey>('overview')
  const [tasks, setTasks] = useState(initialTasks)
  const [exams, setExams] = useState(initialExams)
  const [collapsed, setCollapsed] = useState(true)
  const [modal, setModal] = useState<TaskKind | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showPush, setShowPush] = useState(false)
  const [showInstallPill, setShowInstallPill] = useState(false)
  const [activeBadge, setActiveBadge] = useState<NavKey | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setCollapsed(localStorage.getItem('ontrack.sidebar.collapsed') !== 'false')
    const deferred = (e: Event) => {
      e.preventDefault()
      window.deferredInstallPrompt = e
      setTimeout(() => setShowInstallPill(true), 2500)
    }
    window.addEventListener('beforeinstallprompt', deferred)
    return () => window.removeEventListener('beforeinstallprompt', deferred)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ontrack.sidebar.collapsed', collapsed ? '1' : '0')
    }
  }, [collapsed])

  const completed = useMemo(() => tasks.filter((t) => t.status === 'done').length, [tasks])
  const nextExam = exams[0]
  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase())
  const timeLabel = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  const badgesByKey = useMemo(() => {
    const m: Partial<Record<NavKey, number>> = {}
    m.tasks = tasks.filter((t) => t.status === 'todo').length
    m.exams = exams.length
    m.learn = 4
    return m
  }, [tasks, exams])

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

        <Link href="/dashboard" className="brand" aria-label="OnTrack · Utachi Industries">
          <BrandMark height={collapsed ? 24 : 28} variant={collapsed ? 'mark' : 'full'} priority />
        </Link>

        <div className="profile-card">
          <div className="avatar">{initials}</div>
          {!collapsed && (
            <div className="profile-meta">
              <strong>{userName}</strong>
              <span>Terminale · BAC 2026</span>
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
              badge={badgesByKey[item.key] ?? 0}
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
            {collapsed && <span className="sr-only">Notifications</span>}
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
            <span className="crumb-emoji">✦</span>
            <span>Mon espace</span>
            <IconChevron size={12} />
            <strong>{NAV.find((n) => n.key === nav)?.label}</strong>
          </div>
          <div className="top-actions">
            <button className="search-pill">
              <IconSearch size={14} />
              <span>Rechercher</span>
              <kbd>⌘K</kbd>
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
              <p className="eyebrow"><span className="dot-coral" /> {todayLabel} · {timeLabel}</p>
              <h1>Bonjour {firstName}<span className="wave">.</span></h1>
              <p className="subhead">Une nouvelle journée pour avancer sereinement vers ton BAC.</p>
            </div>
            <button className="primary-button" onClick={() => setModal('task')}>
              <IconAdd size={16} /> Ajouter une tâche
            </button>
          </div>

          {nav === 'overview' && <OverviewView
            tasks={tasks} completed={completed}
            exams={exams} nextExam={nextExam}
            focusThisWeek={focusThisWeek}
            onTaskToggle={async (id) => {
              const updated = await toggleTask(id)
              setTasks((cur) => cur.map((t) => t.id === id ? { ...t, status: updated.status as 'todo' | 'done' } : t))
            }}
            onAddTask={() => setModal('task')}
            onAddExam={() => setModal('exam')}
          />}

          {nav === 'tasks' && <TasksView tasks={tasks}
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
            onProgress={async (id, p) => {
              await updateExamProgress(id, p)
              setExams((cur) => cur.map((e) => e.id === id ? { ...e, preparationPercent: p } : e))
            }}
            onDelete={async (id) => {
              await deleteExam(id)
              setExams((cur) => cur.filter((e) => e.id !== id))
            }}
            onAdd={() => setModal('exam')} />}

          {nav === 'planning' && <PlanningView exams={exams} tasks={tasks} />}
          {nav === 'focus' && <FocusView thisWeek={focusThisWeek} />}
          {nav === 'learn' && <LearnView />}
          {nav === 'documents' && <DocumentsView />}
          {nav === 'goals' && <GoalsView />}
          {nav === 'habits' && <HabitsView thisWeek={focusThisWeek} />}
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

type TaskKind = 'task' | 'exam'

interface NavButtonProps {
  item: NavItem
  collapsed: boolean
  active: boolean
  badge?: number
  onSelect: () => void
}

function NavButton({ item, collapsed, active, badge, onSelect }: NavButtonProps) {
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
      {!collapsed && badge !== undefined && badge > 0 ? <em className="nav-badge">{badge}</em> : null}
      {collapsed && badge !== undefined && badge > 0 ? <span className="nav-badge-pill">{badge}</span> : null}
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

/* ============================================================
   OVERVIEW — viewport-fit, no scroll
   ============================================================ */
interface OverviewProps {
  tasks: Task[]
  completed: number
  exams: Exam[]
  nextExam: Exam | undefined
  focusThisWeek: number
  onTaskToggle: (id: string) => void
  onAddTask: () => void
  onAddExam: () => void
}
function OverviewView({ tasks, completed, exams, nextExam, focusThisWeek, onTaskToggle, onAddTask, onAddExam }: OverviewProps) {
  const recent = tasks.slice(0, 5)
  return (
    <div className="overview-grid">
      <section className="panel hero-panel">
        <div className="hero-head">
          <span className="kicker"><IconSparkles size={13} /> Aujourd’hui</span>
          <span className="kicker-meta"><IconHourglass size={12} /> {focusThisWeek} sessions cette semaine</span>
        </div>
        <h2>Ton attention, au bon endroit.</h2>
        <p className="hero-sub">Tu as <strong>{tasks.filter((t) => t.status === 'todo').length} tâche{tasks.filter((t) => t.status === 'todo').length > 1 ? 's' : ''}</strong> en cours et <strong>{exams.length} examen{exams.length > 1 ? 's' : ''}</strong> à préparer. Continue.</p>
        <div className="progress-line"><span style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }} /></div>
        <div className="hero-meta">
          <span><IconCheck size={13} /> {completed} terminées</span>
          <span><IconTimer size={13} /> {tasks.reduce((s, t) => s + (t.status === 'done' ? 0 : t.estimatedMinutes), 0)} min restantes</span>
        </div>
      </section>

      <section className="panel tasks-panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">À faire</p>
            <h3>Tâches du jour</h3>
          </div>
          <button className="round-add" onClick={onAddTask} aria-label="Ajouter une tâche"><IconAdd size={16} /></button>
        </header>
        <div className="task-list compact">
          {recent.map((task) => {
            const due = formatDue(task.dueAt)
            return (
              <button className={`task-row ${task.status === 'done' ? 'is-done' : ''}`} key={task.id} onClick={() => onTaskToggle(task.id)}>
                <span className={`check-circle ${task.status === 'done' ? 'is-checked' : ''}`}>
                  {task.status === 'done' && <IconCheck size={10} />}
                </span>
                <div className="task-body">
                  <strong>{task.title}</strong>
                  <small><span className={`pill ${accentClass(task.priority)}`}>{task.subject}</span> · {task.estimatedMinutes} min</small>
                </div>
                <span className="task-due" style={{ color: due.color }}>{due.label}</span>
              </button>
            )
          })}
          {recent.length === 0 && (
            <div className="empty">
              <IconSparkles size={20} />
              <p>Aucune tâche. <button onClick={onAddTask}>Ajouter une première</button>.</p>
            </div>
          )}
        </div>
      </section>

      <section className="panel focus-card">
        <header className="panel-header">
          <div>
            <p className="eyebrow"><IconFlame size={11} /> Régularité</p>
            <h3>Focus cette semaine</h3>
          </div>
          <IconTrending size={18} className="trend-icon" />
        </header>
        <div className="streak">
          <strong>{focusThisWeek}</strong>
          <span>sessions<br />complétées</span>
          <div className="streak-flame"><IconFlame size={28} /></div>
        </div>
        <div className="week-bars">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => {
            const fill = i < focusThisWeek ? Math.min(5, (i % 5) + 1) : 0
            return (
              <div key={`${day}-${i}`}>
                <span className={`bar level-${fill}`} />
                <small>{day}</small>
              </div>
            )
          })}
        </div>
        <Link href="#" onClick={(e) => { e.preventDefault(); document.dispatchEvent(new CustomEvent('nav:focus')) }} className="panel-footer">
          Démarrer une session <IconArrow size={13} />
        </Link>
      </section>

      <section className="panel exam-panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">À surveiller</p>
            <h3>Prochain examen</h3>
          </div>
          {nextExam && <span className="days-badge">J−{daysUntil(nextExam.examAt)}</span>}
        </header>
        {nextExam ? (
          <>
            <div className="exam-card-mini">
              <div className="exam-date-block">
                <strong>{new Date(nextExam.examAt).getDate()}</strong>
                <div>
                  <span>{new Date(nextExam.examAt).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                  <b>{new Date(nextExam.examAt).getFullYear()}</b>
                </div>
              </div>
              <div className="exam-body">
                <strong>{nextExam.title}</strong>
                <small>{nextExam.subject}</small>
              </div>
            </div>
            <div className="progress-row">
              <span>Préparation</span>
              <div className="progress-line thin"><span style={{ width: `${nextExam.preparationPercent}%` }} /></div>
              <strong>{nextExam.preparationPercent}%</strong>
            </div>
            <button className="panel-footer" onClick={onAddExam}>
              <span>Ajouter un examen</span><IconArrow size={13} />
            </button>
          </>
        ) : (
          <div className="empty">
            <p>Aucun examen enregistré.</p>
            <button className="primary-button small" onClick={onAddExam}>
              <IconAdd size={14} /> Ajouter
            </button>
          </div>
        )}
      </section>

      <section className="panel tutor-panel-card">
        <AITutorPanel />
      </section>

      <section className="panel agenda-panel">
        <header className="panel-header">
          <div>
            <p className="eyebrow">Calendrier</p>
            <h3>Échéances à venir</h3>
          </div>
        </header>
        <div className="agenda-list">
          {exams.slice(0, 3).map((exam) => {
            const d = new Date(exam.examAt)
            const days = daysUntil(exam.examAt)
            return (
              <div className="agenda-row" key={exam.id}>
                <div className={`date-chip ${days <= 7 ? 'urgent' : ''}`}>
                  <strong>{d.getDate()}</strong>
                  <span>{d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                </div>
                <div className="agenda-body">
                  <strong>{exam.title}</strong>
                  <small>{exam.subject} · {exam.preparationPercent}% prêt</small>
                </div>
                <span className={`agenda-tag ${days <= 7 ? 'urgent' : ''}`}>{days <= 1 ? 'Demain' : days === 0 ? 'Aujourd’hui' : `J−${days}`}</span>
              </div>
            )
          })}
          {exams.length === 0 && <p className="empty-line">Aucun examen planifié.</p>}
        </div>
      </section>
    </div>
  )
}

/* ============================================================
   TASKS view (full)
   ============================================================ */
interface TasksProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}
function TasksView({ tasks, onToggle, onDelete, onAdd }: TasksProps) {
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all')
  const filtered = tasks.filter((t) => filter === 'all' || t.status === filter)
  return (
    <>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Espace de travail</p>
          <h2>Tâches</h2>
        </div>
        <div className="segmented">
          {(['all', 'todo', 'done'] as const).map((k) => (
            <button key={k} className={filter === k ? 'is-active' : ''} onClick={() => setFilter(k)}>
              {k === 'all' ? 'Toutes' : k === 'todo' ? 'À faire' : 'Faites'}
            </button>
          ))}
        </div>
      </div>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>{filtered.length} tâche{filtered.length > 1 ? 's' : ''}</h3>
            <span>Clique pour terminer · utilise la croix pour supprimer</span>
          </div>
          <button className="round-add" onClick={onAdd} aria-label="Ajouter"><IconAdd size={16} /></button>
        </div>
        <div className="task-list">
          {filtered.map((task) => {
            const due = formatDue(task.dueAt)
            return (
              <div className={`task-row ${task.status === 'done' ? 'is-done' : ''}`} key={task.id}>
                <button className="check-btn" onClick={() => onToggle(task.id)} aria-label="Basculer">
                  <span className={`check-circle ${task.status === 'done' ? 'is-checked' : ''}`}>
                    {task.status === 'done' && <IconCheck size={10} />}
                  </span>
                </button>
                <div className="task-body">
                  <strong>{task.title}</strong>
                  <small><span className={`pill ${accentClass(task.priority)}`}>{task.subject}</span> · {task.estimatedMinutes} min</small>
                </div>
                <span className="task-due" style={{ color: due.color }}>{due.label}</span>
                <button className="ghost-button small" onClick={() => onDelete(task.id)} aria-label="Supprimer">
                  <IconClose size={12} />
                </button>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="empty-line">Rien à afficher ici.</p>}
        </div>
      </section>
    </>
  )
}

/* ============================================================
   EXAMS view
   ============================================================ */
interface ExamsProps {
  exams: Exam[]
  onProgress: (id: string, percent: number) => void
  onDelete: (id: string) => void
  onAdd: () => void
}
function ExamsView({ exams, onProgress, onDelete, onAdd }: ExamsProps) {
  return (
    <>
      <div className="section-heading">
        <div><p className="eyebrow">Préparation</p><h2>Examens</h2></div>
      </div>
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Tes examens à venir</h3>
            <span>Ajuste ta progression au fil de tes révisions</span>
          </div>
          <button className="round-add" onClick={onAdd} aria-label="Ajouter"><IconAdd size={16} /></button>
        </div>
        <div className="exams-list">
          {exams.map((exam) => {
            const days = daysUntil(exam.examAt)
            return (
              <div className="exam-card" key={exam.id}>
                <div className="exam-card-head">
                  <div>
                    <strong>{exam.title}</strong>
                    <span>{exam.subject} · {new Date(exam.examAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <span className={`days-badge ${days <= 14 ? 'urgent' : ''}`}>J−{days}</span>
                </div>
                <div className="progress-row">
                  <input
                    type="range"
                    min={0} max={100} step={5}
                    value={exam.preparationPercent}
                    onChange={(e) => onProgress(exam.id, Number(e.target.value))}
                    aria-label="Progression"
                  />
                  <strong>{exam.preparationPercent}%</strong>
                </div>
                <button className="ghost-button small" onClick={() => onDelete(exam.id)}>
                  <IconClose size={12} /> Retirer
                </button>
              </div>
            )
          })}
          {exams.length === 0 && <p className="empty-line">Aucun examen. Clique sur + pour en ajouter un.</p>}
        </div>
      </section>
    </>
  )
}

function PlanningView({ exams, tasks }: { exams: Exam[]; tasks: Task[] }) {
  const items = [
    ...exams.map((e) => ({ kind: 'exam' as const, at: e.examAt, title: e.title, sub: e.subject })),
    ...tasks.filter((t) => t.dueAt).map((t) => ({ kind: 'task' as const, at: t.dueAt!, title: t.title, sub: t.subject })),
  ].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Calendrier</p><h2>Planning</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Échéances à venir</h3><span>Tâches et examens, triés par date</span></div></div>
        <div className="timeline">
          {items.slice(0, 30).map((item, i) => {
            const d = new Date(item.at)
            return (
              <div className="timeline-row" key={`${item.kind}-${i}`}>
                <div className="timeline-date">
                  <strong>{d.getDate()}</strong>
                  <span>{d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase()}</span>
                </div>
                <div className="timeline-body">
                  <strong>{item.title}</strong>
                  <span>{item.sub}</span>
                </div>
                <span className={`agenda-tag ${item.kind === 'exam' ? 'urgent' : ''}`}>{item.kind === 'exam' ? 'Examen' : 'Tâche'}</span>
              </div>
            )
          })}
          {items.length === 0 && <p className="empty-line">Pas d’échéance programmée. Ajoute une tâche ou un examen.</p>}
        </div>
      </section>
    </>
  )
}

function FocusView({ thisWeek }: { thisWeek: number }) {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Sessions</p><h2>Focus</h2></div></div>
      <div className="dashboard-grid two">
        <section className="panel">
          <div className="panel-header"><div><h3>Pomodoro</h3><span>25 minutes, sans interruption</span></div></div>
          <Pomodoro defaultMinutes={25} />
        </section>
        <section className="panel">
          <div className="panel-header"><div><h3>Cette semaine</h3><span>Ton rythme</span></div></div>
          <div className="streak">
            <strong>{thisWeek}</strong>
            <span>sessions<br />terminées</span>
            <div className="streak-flame"><IconFlame size={28} /></div>
          </div>
          <p className="empty-line">Continue à ce rythme pour garder ta série.</p>
        </section>
      </div>
    </>
  )
}

function LearnView() {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Apprendre</p><h2>Apprendre</h2></div></div>
      <section className="panel learn-cta">
        <div>
          <h3>4 pistes interactives</h3>
          <p>Code, Python, Physique, Maths : leçons courtes, simulations vivantes, quiz.</p>
        </div>
        <Link href="/learn" className="primary-button">Ouvrir l’académie <IconArrow size={14} /></Link>
      </section>
    </>
  )
}

function DocumentsView() {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Bibliothèque</p><h2>Connaissances</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Mes documents</h3><span>PDF, TXT, Markdown — 4 Mo max</span></div></div>
        <DocumentUpload />
        <DocumentList />
      </section>
    </>
  )
}

function DocumentUpload() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function upload(formData: FormData) {
    setError('')
    setSuccess('')
    startTransition(async () => {
      const res = await fetch('/api/documents/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Échec de l’upload.')
        return
      }
      setSuccess('Document enregistré.')
      window.setTimeout(() => window.location.reload(), 800)
    })
  }

  return (
    <form action={upload} className="doc-upload" encType="multipart/form-data">
      <label className="auth-field">
        <span>Fichier</span>
        <input type="file" name="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" required />
      </label>
      <label className="auth-field">
        <span>Matière (optionnel)</span>
        <select name="subject" defaultValue=""><option value="">—</option>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      <button type="submit" className="primary-button" disabled={pending}>{pending ? 'Envoi…' : 'Téléverser'}</button>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {success && <p className="empty-line" role="status">{success}</p>}
    </form>
  )
}

function DocumentList() {
  const [docs, setDocs] = useState<Array<{ id: string; filename: string; subject: string | null; createdAt: string }> | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/documents/upload')
      .then((r) => r.ok ? r.json() : { documents: [] })
      .then((data) => { if (!cancelled) setDocs(data.documents ?? []) })
      .catch(() => { if (!cancelled) setDocs([]) })
    return () => { cancelled = true }
  }, [])

  async function remove(id: string) {
    await fetch('/api/documents/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setDocs((cur) => cur?.filter((d) => d.id !== id) ?? null)
  }

  return (
    <div className="task-list">
      {docs === null && <p className="empty-line">Chargement…</p>}
      {docs?.length === 0 && <p className="empty-line">Aucun document pour le moment.</p>}
      {docs?.map((doc) => (
        <div className="task-row" key={doc.id}>
          <div className="task-body">
            <strong>{doc.filename}</strong>
            <small><span className="pill pill-amber">{doc.subject ?? 'Sans matière'}</span></small>
          </div>
          <a href={`/api/documents/file?id=${doc.id}`} target="_blank" rel="noopener noreferrer" className="ghost-button small">Ouvrir</a>
          <button className="ghost-button small" onClick={() => remove(doc.id)} aria-label="Supprimer"><IconClose size={12} /></button>
        </div>
      ))}
    </div>
  )
}

function GoalsView() {
  const [items, setItems] = useState<Array<{ id: string; title: string; target: string; done: boolean }>>(() => readLocal('ontrack.goals', []))
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Vision</p><h2>Objectifs</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Objectifs personnels</h3><span>Stockés sur cet appareil</span></div></div>
        <form
          className="doc-upload"
          onSubmit={(e) => {
            e.preventDefault()
            if (!title.trim()) return
            const next = [...items, { id: crypto.randomUUID(), title: title.trim(), target: target.trim() || '—', done: false }]
            setItems(next); writeLocal('ontrack.goals', next)
            setTitle(''); setTarget('')
          }}
        >
          <label className="auth-field"><span>Intitulé</span><input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex. Avoir 14 de moyenne en maths" /></label>
          <label className="auth-field"><span>Cible / date</span><input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Ex. Fin mars" /></label>
          <button className="primary-button" type="submit"><IconAdd size={14} /> Ajouter</button>
        </form>
        <ul className="goal-list">
          {items.map((g) => (
            <li key={g.id}>
              <button className={`check-circle ${g.done ? 'is-checked' : ''}`} onClick={() => {
                const next = items.map((x) => x.id === g.id ? { ...x, done: !x.done } : x)
                setItems(next); writeLocal('ontrack.goals', next)
              }}>{g.done && <IconCheck size={10} />}</button>
              <div><strong style={{ textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</strong><small>{g.target}</small></div>
              <button className="ghost-button small" onClick={() => {
                const next = items.filter((x) => x.id !== g.id); setItems(next); writeLocal('ontrack.goals', next)
              }}><IconClose size={12} /></button>
            </li>
          ))}
          {items.length === 0 && <p className="empty-line">Aucun objectif pour l’instant.</p>}
        </ul>
      </section>
    </>
  )
}

function HabitsView({ thisWeek }: { thisWeek: number }) {
  const [checks, setChecks] = useState<Record<string, boolean>>(() => readLocal('ontrack.habits', {}))
  const habits = ['Lire 20 min', 'Réviser les flashcards', 'Boire 1,5L d’eau', 'Marcher 30 min']
  const today = new Date().toISOString().slice(0, 10)
  const done = Object.values(checks[`${today}`] ?? {}).filter(Boolean).length
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Rythme</p><h2>Habitudes</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Aujourd’hui</h3><span>{done}/{habits.length} faites · {thisWeek} sessions de focus</span></div></div>
        <ul className="goal-list">
          {habits.map((h) => {
            const k = `${today}|${h}`
            const v = !!checks[k]
            return (
              <li key={h}>
                <button className={`check-circle ${v ? 'is-checked' : ''}`} onClick={() => {
                  const next = { ...checks, [k]: !v }; setChecks(next); writeLocal('ontrack.habits', next)
                }}>{v && <IconCheck size={10} />}</button>
                <strong style={{ flex: 1, textDecoration: v ? 'line-through' : 'none' }}>{h}</strong>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

function FinanceView() {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Boursier</p><h2>Finances</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Suivi des dépenses</h3><span>Bientôt disponible</span></div></div>
        <p className="empty-line">OnTrack se concentre d’abord sur tes révisions. Le suivi financier arrive dans une prochaine mise à jour.</p>
      </section>
    </>
  )
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback } catch { return fallback }
}
function writeLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* quota */ }
}

function TaskModal({ onClose, onCreate }: { onClose: () => void; onCreate: (input: { title: string; subject?: string; priority?: string; estimatedMinutes?: number; dueAt?: string }) => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="quick-modal" onClick={(e) => e.stopPropagation()} onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        onCreate({
          title: String(fd.get('title') ?? ''),
          subject: String(fd.get('subject') ?? ''),
          priority: String(fd.get('priority') ?? 'medium'),
          estimatedMinutes: Number(fd.get('minutes') ?? 25),
          dueAt: String(fd.get('due') ?? '') || undefined,
        })
      }}>
        <div className="modal-head"><div><p className="eyebrow">Nouvelle action</p><h3>Ajouter une tâche</h3></div><button type="button" onClick={onClose} aria-label="Fermer"><IconClose size={18} /></button></div>
        <label className="auth-field"><span>Titre</span><input name="title" autoFocus required placeholder="Ex. Revoir le chapitre 4" /></label>
        <label className="auth-field"><span>Matière</span><select name="subject" defaultValue="Mathématiques">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <div className="modal-row">
          <label className="auth-field"><span>Priorité</span><select name="priority" defaultValue="medium"><option value="low">Basse</option><option value="medium">Moyenne</option><option value="high">Haute</option></select></label>
          <label className="auth-field"><span>Durée (min)</span><input name="minutes" type="number" min={5} max={240} defaultValue={25} /></label>
        </div>
        <label className="auth-field"><span>Échéance (optionnel)</span><input name="due" type="date" /></label>
        <button className="primary-button modal-submit" type="submit"><IconAdd size={17} /> Ajouter</button>
      </form>
    </div>
  )
}

function ExamModal({ onClose, onCreate }: { onClose: () => void; onCreate: (input: { title: string; subject: string; examAt: string }) => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="quick-modal" onClick={(e) => e.stopPropagation()} onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        onCreate({
          title: String(fd.get('title') ?? ''),
          subject: String(fd.get('subject') ?? 'Général'),
          examAt: String(fd.get('examAt') ?? ''),
        })
      }}>
        <div className="modal-head"><div><p className="eyebrow">Nouveau rendez-vous</p><h3>Ajouter un examen</h3></div><button type="button" onClick={onClose} aria-label="Fermer"><IconClose size={18} /></button></div>
        <label className="auth-field"><span>Titre</span><input name="title" autoFocus required placeholder="Ex. Bac blanc de maths" /></label>
        <label className="auth-field"><span>Matière</span><select name="subject" defaultValue="Mathématiques">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="auth-field"><span>Date</span><input name="examAt" type="date" required /></label>
        <button className="primary-button modal-submit" type="submit"><IconAdd size={17} /> Ajouter</button>
      </form>
    </div>
  )
}

function PushModal({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState('')

  async function enable() {
    if (!('Notification' in window)) { setStatus('Notifications non supportées sur ce navigateur.'); return }
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') { setStatus('Permission refusée. Active-la dans les paramètres du navigateur.'); return }
    const reg = await navigator.serviceWorker?.ready
    if (!reg) { setStatus('Service worker indisponible.'); return }
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''),
    }).catch(() => null)
    if (!sub) { setStatus('Impossible de s’abonner. Vérifie la clé VAPID.'); return }
    startTransition(async () => {
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      setStatus(res.ok ? 'Activées. Tu recevras les rappels d’examens.' : 'Erreur lors de l’enregistrement.')
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="quick-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><div><p className="eyebrow">Notifications</p><h3>Activer les rappels</h3></div><button type="button" onClick={onClose} aria-label="Fermer"><IconClose size={18} /></button></div>
        <p className="empty-line">OnTrack peut t’envoyer des notifications pour les fins de session de focus et les rappels d’examens. Aucune pub, jamais.</p>
        <button className="primary-button modal-submit" onClick={enable} disabled={pending}>{pending ? 'Activation…' : 'Activer les notifications'}</button>
        {status && <p className="empty-line" role="status">{status}</p>}
      </div>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = typeof window === 'undefined' ? '' : window.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) output[i] = rawData.charCodeAt(i)
  return output
}