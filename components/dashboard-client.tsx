'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Command,
  FileText,
  Flame,
  Focus,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  WalletCards,
  Settings as SettingsIcon,
  X,
} from 'lucide-react'
import Link from 'next/link'
type Task = { id: number; title: string; subject: string; time: string; done: boolean; tone: string }

const navItems = [
  { label: 'Vue d’ensemble', icon: LayoutDashboard },
  { label: 'Apprendre', icon: BookOpen },
  { label: 'Examens', icon: GraduationCap },
  { label: 'Tâches', icon: Check },
  { label: 'Planning', icon: CalendarDays },
  { label: 'Focus', icon: Focus },
  { label: 'Connaissances', icon: FileText },
]

const initialTasks: Task[] = [
  { id: 1, title: 'Relire le chapitre sur les suites', subject: 'Mathématiques', time: '45 min', done: false, tone: 'coral' },
  { id: 2, title: 'Fiche de synthèse — Guerre froide', subject: 'Histoire-Géo', time: '30 min', done: true, tone: 'blue' },
  { id: 3, title: 'Exercices de génétique', subject: 'SVT', time: '50 min', done: false, tone: 'green' },
  { id: 4, title: 'Préparer l’oral de français', subject: 'Français', time: '25 min', done: false, tone: 'gold' },
]

export default function DashboardClient({ userName }: { userName: string }) {
  const firstName = userName.trim().split(/\s+/)[0] || 'toi'
  const initials = userName.trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const [activeNav, setActiveNav] = useState('Vue d’ensemble')
  const [tasks, setTasks] = useState(initialTasks)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [focusStarted, setFocusStarted] = useState(false)
  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks])

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Sparkles size={16} /></div><span>orbite</span></div>
        <div className="profile-card"><div className="avatar">{initials}</div><div><strong>{userName}</strong><span>Terminale · BAC 2026</span></div><MoreHorizontal size={18} /></div>
        <nav className="nav-list" aria-label="Navigation principale">
          <p className="nav-label">Espace de travail</p>
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{label === 'Tâches' && <em>4</em>}</button>)}
          <p className="nav-label second">Personnel</p>
          <button className="nav-item" onClick={() => setActiveNav('Objectifs')}><Target size={18} /><span>Objectifs</span></button>
          <button className="nav-item" onClick={() => setActiveNav('Habitudes')}><Flame size={18} /><span>Habitudes</span></button>
          <button className="nav-item" onClick={() => setActiveNav('Finances')}><WalletCards size={18} /><span>Finances</span></button>
        </nav>
        <div className="sidebar-bottom"><Link href="/settings" className="nav-item"><SettingsIcon size={18} /><span>Réglages</span></Link><button className="nav-item"><Bell size={18} /><span>Notifications</span><i /></button><button className="nav-item"><Command size={18} /><span>Raccourcis</span><kbd>⌘ K</kbd></button></div>
      </aside>

      <section className="workspace">
        <header className="topbar"><button className="mobile-menu" aria-label="Ouvrir le menu"><Menu size={20} /></button><div className="crumb"><span>Mon espace</span><ChevronRight size={14} /><strong>{activeNav}</strong></div><div className="top-actions"><button className="search-pill"><Search size={16} /><span>Rechercher</span><kbd>⌘ K</kbd></button><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="mini-avatar">{initials}</div></div></header>

        <div className="content">
          <div className="welcome-row"><div><p className="eyebrow">Mardi 24 mars 2026 · 08:42</p><h1>Bonjour Marie<span>.</span></h1><p className="subhead">Une nouvelle journée pour avancer sereinement vers ton BAC.</p></div><button className="primary-button" onClick={() => setShowQuickAdd(true)}><Plus size={17} /> Ajouter une tâche</button></div>

          <div className="focus-banner"><div className="focus-icon"><Focus size={22} /></div><div className="focus-copy"><strong>Prête pour une session de focus ?</strong><span>Tu as 2h30 de temps disponible ce matin. Ton prochain objectif est à portée de main.</span></div><button className="focus-button" onClick={() => setFocusStarted(!focusStarted)}>{focusStarted ? <><Clock3 size={16} /> Session en cours</> : <><Play size={15} fill="currentColor" /> Démarrer 25 min</>}</button></div>

          <div className="section-heading"><div><p className="eyebrow">Aujourd’hui</p><h2>Ton attention, au bon endroit</h2></div><button className="text-button">Voir le planning <ArrowUpRight size={15} /></button></div>
          <div className="dashboard-grid">
            <section className="panel tasks-panel"><div className="panel-header"><div><h3>Tâches du jour</h3><span>{completed} sur {tasks.length} terminées</span></div><button className="round-add" onClick={() => setShowQuickAdd(true)} aria-label="Ajouter"><Plus size={17} /></button></div><div className="progress-line"><span style={{ width: `${(completed / tasks.length) * 100}%` }} /></div><div className="task-list">{tasks.map((task) => <button className={`task-row ${task.done ? 'done' : ''}`} key={task.id} onClick={() => toggleTask(task.id)}><span className={`check-circle ${task.done ? 'checked' : ''}`}>{task.done && <Check size={12} />}</span><span className="task-details"><strong>{task.title}</strong><small><i className={task.tone} />{task.subject}</small></span><span className="task-time"><Clock3 size={14} />{task.time}</span></button>)}</div><button className="panel-footer">Voir toutes les tâches <ArrowUpRight size={15} /></button></section>
            <section className="panel exam-panel"><div className="panel-header"><div><h3>Prochain examen</h3><span>Philosophie · Écrit</span></div><span className="days-badge">J−78</span></div><div className="exam-date"><strong>10</strong><div><span>JUIN</span><b>2026</b></div></div><div className="exam-progress"><div className="progress-label"><span>Préparation globale</span><strong>68%</strong></div><div className="progress-line"><span style={{ width: '68%' }} /></div></div><div className="exam-meta"><span><Check size={14} /> 17 notions révisées</span><span><Timer size={14} /> 2h cette semaine</span></div><button className="panel-footer">Ouvrir la préparation <ArrowUpRight size={15} /></button></section>
            <section className="panel habit-panel"><div className="panel-header"><div><h3>Régularité</h3><span>Ton rythme cette semaine</span></div><TrendingUp size={19} className="trend" /></div><div className="streak"><strong>5</strong><span>jours<br />consécutifs</span><Flame size={28} /></div><div className="week-bars">{['L','M','M','J','V','S','D'].map((day, index) => <div key={`${day}-${index}`}><span className={`bar level-${index < 5 ? index + 1 : 0}`} /><small>{day}</small></div>)}</div><button className="panel-footer">Voir mes habitudes <ArrowUpRight size={15} /></button></section>
          </div>

          <div className="lower-grid"><section className="panel agenda-panel"><div className="panel-header"><div><h3>Prochaines échéances</h3><span>Les dates qui comptent</span></div><button className="text-button">Tout voir <ArrowUpRight size={15} /></button></div><div className="agenda-row"><div className="date-chip coral-chip"><strong>28</strong><span>MAR</span></div><div><strong>Devoir surveillé — Mathématiques</strong><span>Suites et fonctions · Salle B204</span></div><span className="agenda-tag urgent">Dans 4 jours</span></div><div className="agenda-row"><div className="date-chip blue-chip"><strong>02</strong><span>AVR</span></div><div><strong>Oral blanc de français</strong><span>Préparer les 12 textes</span></div><span className="agenda-tag">Dans 9 jours</span></div></section><section className="panel tutor-panel"><div className="tutor-orbit"><Sparkles size={23} /></div><div><p className="eyebrow">Ton tuteur IA</p><h3>Une question sur les suites ?</h3><p>Je peux t’expliquer une notion, te faire réviser ou construire un plan de travail.</p></div><button className="tutor-button">Parler à Orbit <ArrowUpRight size={15} /></button></section></div>
          <footer className="footer-note"><span>orbite · Ton espace pour avancer.</span><span>Dernière synchronisation il y a 2 min</span></footer>
        </div>
      </section>
      {showQuickAdd && <div className="modal-backdrop" onClick={() => setShowQuickAdd(false)}><div className="quick-modal" onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">Nouvelle action</p><h3>Ajouter une tâche</h3></div><button onClick={() => setShowQuickAdd(false)} aria-label="Fermer"><X size={18} /></button></div><label>Titre<input autoFocus placeholder="Ex. Revoir le chapitre 4" /></label><label>Matière<select defaultValue="Mathématiques"><option>Mathématiques</option><option>Philosophie</option><option>Histoire-Géo</option><option>SVT</option></select></label><button className="primary-button modal-submit" onClick={() => setShowQuickAdd(false)}><Plus size={17} /> Ajouter</button></div></div>}
    </main>
  )
}
  
