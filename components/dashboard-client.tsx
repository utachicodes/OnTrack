'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Command,
  FileText,
  Flame,
  Focus,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  WalletCards,
  X,
} from 'lucide-react'
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

function formatDue(iso: string | null): { label: string; urgent: boolean } {
  if (!iso) return { label: 'Pas d’échéance', urgent: false }
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.round((d.getTime() - now.getTime()) / 86400000)
  const date = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
  if (diff < 0) return { label: `En retard · ${date}`, urgent: true }
  if (diff === 0) return { label: `Aujourd’hui · ${date}`, urgent: true }
  if (diff === 1) return { label: `Demain · ${date}`, urgent: true }
  if (diff <= 7) return { label: `Dans ${diff} j · ${date}`, urgent: false }
  return { label: date, urgent: false }
}

function daysUntil(iso: string): number {
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 86400000))
}

export function DashboardClient({ userName, initialTasks, initialExams, focusThisWeek }: DashboardProps) {
  const firstName = userName.trim().split(/\s+/)[0] || 'toi'
  const initials = userName.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()

  const [nav, setNav] = useState<NavKey>('overview')
  const [tasks, setTasks] = useState(initialTasks)
  const [exams, setExams] = useState(initialExams)
  const [showQuickAdd, setShowQuickAdd] = useState<TaskKind | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showPush, setShowPush] = useState(false)
  const [installAvailable, setInstallAvailable] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallAvailable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const completed = useMemo(() => tasks.filter((t) => t.status === 'done').length, [tasks])
  const nextExam = exams[0]
  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeLabel = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <main className="app-shell">
      <aside className={`sidebar ${showSidebar ? 'is-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Sparkles size={16} /></div><span>OnTrack</span></div>
        <div className="profile-card">
          <div className="avatar">{initials}</div>
          <div><strong>{userName}</strong><span>Terminale · BAC 2026</span></div>
          <MoreHorizontal size={18} />
        </div>
        <nav className="nav-list" aria-label="Navigation principale">
          <p className="nav-label">Espace de travail</p>
          <NavButton id="overview" label="Vue d’ensemble" icon={LayoutDashboard} active={nav} onSelect={setNav} />
          <NavButton id="learn" label="Apprendre" icon={BookOpen} active={nav} onSelect={setNav} badge={4} />
          <NavButton id="exams" label="Examens" icon={GraduationCap} active={nav} onSelect={setNav} badge={exams.length} />
          <NavButton id="tasks" label="Tâches" icon={Check} active={nav} onSelect={setNav} badge={tasks.filter((t) => t.status === 'todo').length} />
          <NavButton id="planning" label="Planning" icon={CalendarDays} active={nav} onSelect={setNav} />
          <NavButton id="focus" label="Focus" icon={Focus} active={nav} onSelect={setNav} />
          <NavButton id="documents" label="Connaissances" icon={FileText} active={nav} onSelect={setNav} />

          <p className="nav-label second">Personnel</p>
          <NavButton id="goals" label="Objectifs" icon={Target} active={nav} onSelect={setNav} />
          <NavButton id="habits" label="Habitudes" icon={Flame} active={nav} onSelect={setNav} />
          <NavButton id="finance" label="Finances" icon={WalletCards} active={nav} onSelect={setNav} />
        </nav>
        <div className="sidebar-bottom">
          <Link href="/settings" className="nav-item"><SettingsIcon size={18} /><span>Réglages</span></Link>
          <button className="nav-item" onClick={() => setShowPush(true)}><Bell size={18} /><span>Notifications</span><i /></button>
          <button className="nav-item" onClick={() => installAvailable && window.dispatchEvent(new Event('show-install'))}><Command size={18} /><span>Installer l’app</span></button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setShowSidebar((v) => !v)} aria-label="Ouvrir le menu">
            {showSidebar ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="crumb"><span>Mon espace</span><ChevronRight size={14} /><strong>{NAV_LABEL[nav]}</strong></div>
          <div className="top-actions">
            <button className="search-pill"><Search size={16} /><span>Rechercher</span><kbd>⌘ K</kbd></button>
            <button className="icon-button" aria-label="Notifications" onClick={() => setShowPush(true)}><Bell size={18} /><i /></button>
            <div className="mini-avatar">{initials}</div>
          </div>
        </header>

        {installAvailable && (
          <div className="install-banner">
            <div>
              <strong>Installe OnTrack sur ton téléphone</strong>
              <span>Travaille hors-ligne, reçois les rappels d’examens, ouvre l’app en un geste.</span>
            </div>
            <button className="primary-button" onClick={() => window.dispatchEvent(new Event('show-install'))}>
              Installer
            </button>
          </div>
        )}

        <div className="content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">{todayLabel} · {timeLabel}</p>
              <h1>Bonjour {firstName}<span>.</span></h1>
              <p className="subhead">Une nouvelle journée pour avancer sereinement vers ton BAC.</p>
            </div>
            <button className="primary-button" onClick={() => setShowQuickAdd('task')}>
              <Plus size={17} /> Ajouter une tâche
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
            onAddTask={() => setShowQuickAdd('task')}
            onAddExam={() => setShowQuickAdd('exam')}
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
            onAdd={() => setShowQuickAdd('task')} />}

          {nav === 'exams' && <ExamsView exams={exams}
            onProgress={async (id, p) => {
              await updateExamProgress(id, p)
              setExams((cur) => cur.map((e) => e.id === id ? { ...e, preparationPercent: p } : e))
            }}
            onDelete={async (id) => {
              await deleteExam(id)
              setExams((cur) => cur.filter((e) => e.id !== id))
            }}
            onAdd={() => setShowQuickAdd('exam')} />}

          {nav === 'planning' && <PlanningView exams={exams} tasks={tasks} />}
          {nav === 'focus' && <FocusView thisWeek={focusThisWeek} />}
          {nav === 'learn' && <LearnView />}
          {nav === 'documents' && <DocumentsView />}
          {nav === 'goals' && <GoalsView />}
          {nav === 'habits' && <HabitsView thisWeek={focusThisWeek} />}
          {nav === 'finance' && <FinanceView />}

          <footer className="footer-note">
            <span>OnTrack · Ton espace pour avancer.</span>
            <span>Dernière synchronisation à l’instant</span>
          </footer>
        </div>
      </section>

      {showQuickAdd === 'task' && <TaskModal onClose={() => setShowQuickAdd(null)} onCreate={async (input) => {
        const task = await createTask(input)
        setTasks((cur) => [...cur, {
          id: task.id, title: task.title, subject: task.subject ?? 'Général',
          estimatedMinutes: task.estimatedMinutes, priority: task.priority as 'low' | 'medium' | 'high',
          status: task.status as 'todo' | 'done', dueAt: task.dueAt ? task.dueAt.toISOString() : null,
        }])
        setShowQuickAdd(null)
      }} />}

      {showQuickAdd === 'exam' && <ExamModal onClose={() => setShowQuickAdd(null)} onCreate={async (input) => {
        const exam = await createExam(input)
        setExams((cur) => [...cur, {
          id: exam.id, title: exam.title, subject: exam.subject,
          examAt: exam.examAt.toISOString(), preparationPercent: exam.preparationPercent,
        }])
        setShowQuickAdd(null)
      }} />}

      {showPush && <PushModal onClose={() => setShowPush(false)} />}
      {showSidebar && <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)} />}
    </main>
  )
}

const NAV_LABEL: Record<NavKey, string> = {
  overview: 'Vue d’ensemble',
  tasks: 'Tâches',
  exams: 'Examens',
  planning: 'Planning',
  focus: 'Focus',
  learn: 'Apprendre',
  documents: 'Connaissances',
  goals: 'Objectifs',
  habits: 'Habitudes',
  finance: 'Finances',
}

type TaskKind = 'task' | 'exam'

interface NavButtonProps {
  id: NavKey
  label: string
  icon: React.ComponentType<{ size?: number }>
  active: NavKey
  onSelect: (id: NavKey) => void
  badge?: number
}

function NavButton({ id, label, icon: Icon, active, onSelect, badge }: NavButtonProps) {
  return (
    <button className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onSelect(id)}>
      <Icon size={18} /><span>{label}</span>
      {badge !== undefined && badge > 0 ? <em>{badge}</em> : null}
    </button>
  )
}

/* ---------- Overview ---------- */
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
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Aujourd’hui</p><h2>Ton attention, au bon endroit</h2></div></div>
      <div className="dashboard-grid">
        <section className="panel tasks-panel">
          <div className="panel-header"><div><h3>Tâches du jour</h3><span>{completed} sur {tasks.length} terminées</span></div><button className="round-add" onClick={onAddTask} aria-label="Ajouter"><Plus size={17} /></button></div>
          <div className="progress-line"><span style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }} /></div>
          <div className="task-list">
            {tasks.slice(0, 6).map((task) => {
              const due = formatDue(task.dueAt)
              return (
                <button className={`task-row ${task.status === 'done' ? 'done' : ''}`} key={task.id} onClick={() => onTaskToggle(task.id)}>
                  <span className={`check-circle ${task.status === 'done' ? 'checked' : ''}`}>{task.status === 'done' && <Check size={12} />}</span>
                  <span className="task-details"><strong>{task.title}</strong><small><i className={toneClass(task.priority)} />{task.subject}</small></span>
                  <span className={`task-time ${due.urgent ? 'urgent' : ''}`}><Clock3 size={14} />{due.label}</span>
                </button>
              )
            })}
            {tasks.length === 0 && <p className="empty">Aucune tâche. Clique sur <strong>Ajouter une tâche</strong> pour commencer.</p>}
          </div>
        </section>

        <section className="panel exam-panel">
          <div className="panel-header"><div><h3>Prochain examen</h3><span>{nextExam ? nextExam.subject : '—'}</span></div>{nextExam && <span className="days-badge">J−{daysUntil(nextExam.examAt)}</span>}</div>
          {nextExam ? (
            <>
              <div className="exam-date">
                <strong>{new Date(nextExam.examAt).getDate()}</strong>
                <div><span>{new Date(nextExam.examAt).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span><b>{new Date(nextExam.examAt).getFullYear()}</b></div>
              </div>
              <div className="exam-progress">
                <div className="progress-label"><span>Préparation globale</span><strong>{nextExam.preparationPercent}%</strong></div>
                <div className="progress-line"><span style={{ width: `${nextExam.preparationPercent}%` }} /></div>
              </div>
              <div className="exam-meta"><span><Check size={14} /> {nextExam.title}</span><span><Timer size={14} /> Écrit</span></div>
            </>
          ) : (
            <div className="empty-state">
              <p>Aucun examen enregistré.</p>
              <button className="panel-footer" onClick={onAddExam}>Ajouter un examen <ArrowUpRight size={14} /></button>
            </div>
          )}
        </section>

        <section className="panel habit-panel">
          <div className="panel-header"><div><h3>Régularité</h3><span>Ton rythme cette semaine</span></div><TrendingUp size={19} className="trend" /></div>
          <div className="streak"><strong>{focusThisWeek}</strong><span>sessions<br />de focus<br />terminées</span><Flame size={28} /></div>
          <div className="week-bars">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => <div key={`${day}-${i}`}><span className={`bar level-${Math.min(5, Math.max(0, focusThisWeek > 0 ? (i < focusThisWeek ? (i % 5) + 1 : 0) : 0))}`} /><small>{day}</small></div>)}</div>
        </section>
      </div>

      <div className="lower-grid">
        <section className="panel agenda-panel">
          <div className="panel-header"><div><h3>Prochaines échéances</h3><span>Les dates qui comptent</span></div></div>
          {exams.slice(0, 4).map((exam) => {
            const date = new Date(exam.examAt)
            const days = daysUntil(exam.examAt)
            return (
              <div className="agenda-row" key={exam.id}>
                <div className={`date-chip ${days <= 7 ? 'urgent' : ''}`}><strong>{date.getDate()}</strong><span>{date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span></div>
                <div><strong>{exam.title}</strong><span>{exam.subject} · {exam.preparationPercent}% prêt</span></div>
                <span className={`agenda-tag ${days <= 7 ? 'urgent' : ''}`}>{days <= 1 ? `Demain` : days === 0 ? 'Aujourd’hui' : `J−${days}`}</span>
              </div>
            )
          })}
          {exams.length === 0 && <p className="empty">Aucun examen planifié.</p>}
        </section>

        <section className="panel tutor-panel-card">
          <AITutorPanel />
        </section>
      </div>
    </>
  )
}

function toneClass(priority: Task['priority']): string {
  if (priority === 'low') return 'green'
  if (priority === 'medium') return 'gold'
  return ''
}

/* ---------- Tasks ---------- */
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
        <div><p className="eyebrow">Espace de travail</p><h2>Tâches</h2></div>
        <div className="segmented">
          {(['all', 'todo', 'done'] as const).map((k) => (
            <button key={k} className={filter === k ? 'is-active' : ''} onClick={() => setFilter(k)}>
              {k === 'all' ? 'Toutes' : k === 'todo' ? 'À faire' : 'Faites'}
            </button>
          ))}
        </div>
      </div>
      <section className="panel tasks-panel">
        <div className="panel-header"><div><h3>{filtered.length} tâche{filtered.length > 1 ? 's' : ''}</h3><span>Clique pour terminer, double-clique pour supprimer</span></div><button className="round-add" onClick={onAdd} aria-label="Ajouter"><Plus size={17} /></button></div>
        <div className="task-list">
          {filtered.map((task) => {
            const due = formatDue(task.dueAt)
            return (
              <div className={`task-row ${task.status === 'done' ? 'done' : ''}`} key={task.id}>
                <button className="check-btn" onClick={() => onToggle(task.id)} aria-label="Basculer">
                  <span className={`check-circle ${task.status === 'done' ? 'checked' : ''}`}>{task.status === 'done' && <Check size={12} />}</span>
                </button>
                <div className="task-details"><strong>{task.title}</strong><small><i className={toneClass(task.priority)} />{task.subject} · {task.estimatedMinutes} min</small></div>
                <span className={`task-time ${due.urgent ? 'urgent' : ''}`}>{due.label}</span>
                <button className="ghost-button small" onClick={() => onDelete(task.id)} aria-label="Supprimer"><X size={14} /></button>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="empty">Rien à afficher ici.</p>}
        </div>
      </section>
    </>
  )
}

/* ---------- Exams ---------- */
interface ExamsProps {
  exams: Exam[]
  onProgress: (id: string, percent: number) => void
  onDelete: (id: string) => void
  onAdd: () => void
}
function ExamsView({ exams, onProgress, onDelete, onAdd }: ExamsProps) {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Préparation</p><h2>Examens</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Tes examens à venir</h3><span>Ajuste ta progression au fil de tes révisions</span></div><button className="round-add" onClick={onAdd} aria-label="Ajouter"><Plus size={17} /></button></div>
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
                    min={0}
                    max={100}
                    step={5}
                    value={exam.preparationPercent}
                    onChange={(e) => onProgress(exam.id, Number(e.target.value))}
                    aria-label="Progression"
                  />
                  <strong>{exam.preparationPercent}%</strong>
                </div>
                <button className="ghost-button small" onClick={() => onDelete(exam.id)}>
                  <X size={14} /> Retirer
                </button>
              </div>
            )
          })}
          {exams.length === 0 && <p className="empty">Aucun examen. Clique sur <strong>+</strong> pour en ajouter un.</p>}
        </div>
      </section>
    </>
  )
}

/* ---------- Planning ---------- */
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
                  <span>{d.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                </div>
                <div className="timeline-body">
                  <strong>{item.title}</strong>
                  <span>{item.sub}</span>
                </div>
                <span className={`agenda-tag ${item.kind === 'exam' ? 'urgent' : ''}`}>{item.kind === 'exam' ? 'Examen' : 'Tâche'}</span>
              </div>
            )
          })}
          {items.length === 0 && <p className="empty">Pas d’échéance programmée. Ajoute une tâche ou un examen pour remplir ton planning.</p>}
        </div>
      </section>
    </>
  )
}

/* ---------- Focus ---------- */
function FocusView({ thisWeek }: { thisWeek: number }) {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Sessions</p><h2>Focus</h2></div></div>
      <div className="dashboard-grid two">
        <section className="panel"><div className="panel-header"><div><h3>Pomodoro</h3><span>25 minutes, sans interruption</span></div></div><Pomodoro defaultMinutes={25} /></section>
        <section className="panel"><div className="panel-header"><div><h3>Cette semaine</h3><span>Ton rythme</span></div></div><div className="streak"><strong>{thisWeek}</strong><span>sessions<br />terminées</span><Flame size={28} /></div><p className="empty">Continue à ce rythme pour garder ta série.</p></section>
      </div>
    </>
  )
}

/* ---------- Learn ---------- */
function LearnView() {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Apprendre</p><h2>Apprendre</h2></div></div>
      <section className="panel learn-cta">
        <div>
          <h3>4 pistes interactives</h3>
          <p>Code, Python, Physique, Maths : leçons courtes, simulations vivantes, quiz.</p>
        </div>
        <Link href="/learn" className="primary-button">Ouvrir l’académie <ArrowUpRight size={16} /></Link>
      </section>
    </>
  )
}

/* ---------- Documents ---------- */
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
      {success && <p className="empty" role="status">{success}</p>}
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
      {docs === null && <p className="empty">Chargement…</p>}
      {docs?.length === 0 && <p className="empty">Aucun document pour le moment.</p>}
      {docs?.map((doc) => (
        <div className="task-row" key={doc.id}>
          <div className="task-details">
            <strong>{doc.filename}</strong>
            <small>{doc.subject ?? 'Sans matière'} · {new Date(doc.createdAt).toLocaleDateString('fr-FR')}</small>
          </div>
          <a href={`/api/documents/file?id=${doc.id}`} target="_blank" rel="noopener noreferrer" className="ghost-button small">Ouvrir</a>
          <button className="ghost-button small" onClick={() => remove(doc.id)} aria-label="Supprimer"><X size={14} /></button>
        </div>
      ))}
    </div>
  )
}

/* ---------- Goals / Habits / Finance (lightweight) ---------- */
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
          <button className="primary-button" type="submit">Ajouter</button>
        </form>
        <ul className="goal-list">
          {items.map((g) => (
            <li key={g.id}>
              <button className={`check-circle ${g.done ? 'checked' : ''}`} onClick={() => {
                const next = items.map((x) => x.id === g.id ? { ...x, done: !x.done } : x)
                setItems(next); writeLocal('ontrack.goals', next)
              }}>{g.done && <Check size={12} />}</button>
              <div><strong style={{ textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</strong><small>{g.target}</small></div>
              <button className="ghost-button small" onClick={() => {
                const next = items.filter((x) => x.id !== g.id); setItems(next); writeLocal('ontrack.goals', next)
              }}><X size={14} /></button>
            </li>
          ))}
          {items.length === 0 && <p className="empty">Aucun objectif pour l’instant.</p>}
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
                <button className={`check-circle ${v ? 'checked' : ''}`} onClick={() => {
                  const next = { ...checks, [k]: !v }; setChecks(next); writeLocal('ontrack.habits', next)
                }}>{v && <Check size={12} />}</button>
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
        <p className="empty">OnTrack se concentre d’abord sur tes révisions. Le suivi financier arrive dans une prochaine mise à jour.</p>
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

/* ---------- Modals ---------- */
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
        <div className="modal-head"><div><p className="eyebrow">Nouvelle action</p><h3>Ajouter une tâche</h3></div><button type="button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div>
        <label className="auth-field"><span>Titre</span><input name="title" autoFocus required placeholder="Ex. Revoir le chapitre 4" /></label>
        <label className="auth-field"><span>Matière</span><select name="subject" defaultValue="Mathématiques">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <div className="modal-row">
          <label className="auth-field"><span>Priorité</span><select name="priority" defaultValue="medium"><option value="low">Basse</option><option value="medium">Moyenne</option><option value="high">Haute</option></select></label>
          <label className="auth-field"><span>Durée (min)</span><input name="minutes" type="number" min={5} max={240} defaultValue={25} /></label>
        </div>
        <label className="auth-field"><span>Échéance (optionnel)</span><input name="due" type="date" /></label>
        <button className="primary-button modal-submit" type="submit"><Plus size={17} /> Ajouter</button>
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
        <div className="modal-head"><div><p className="eyebrow">Nouveau rendez-vous</p><h3>Ajouter un examen</h3></div><button type="button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div>
        <label className="auth-field"><span>Titre</span><input name="title" autoFocus required placeholder="Ex. Bac blanc de maths" /></label>
        <label className="auth-field"><span>Matière</span><select name="subject" defaultValue="Mathématiques">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="auth-field"><span>Date</span><input name="examAt" type="date" required /></label>
        <button className="primary-button modal-submit" type="submit"><Plus size={17} /> Ajouter</button>
      </form>
    </div>
  )
}

function PushModal({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<string>('')

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
        <div className="modal-head"><div><p className="eyebrow">Notifications</p><h3>Activer les rappels</h3></div><button type="button" onClick={onClose} aria-label="Fermer"><X size={18} /></button></div>
        <p className="empty">OnTrack peut t’envoyer des notifications pour les fins de session de focus et les rappels d’examens. Aucune pub, jamais.</p>
        <button className="primary-button modal-submit" onClick={enable} disabled={pending}>{pending ? 'Activation…' : 'Activer les notifications'}</button>
        {status && <p className="empty" role="status">{status}</p>}
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