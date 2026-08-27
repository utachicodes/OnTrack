'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createTask, toggleTask, deleteTask } from '@/app/actions/tasks'
import { createExam, updateExamProgress, deleteExam } from '@/app/actions/exams'
import { AppChrome } from '@/components/app-chrome'
import type { Task, Exam, NavKey } from './dashboard/types'
import { OverviewView } from './dashboard/overview-view'
import { TasksView } from './dashboard/tasks-view'
import { ExamsView } from './dashboard/exams-view'
import { PlanningView } from './dashboard/planning-view'
import { FocusView } from './dashboard/focus-view'
import { DocumentsView } from './dashboard/documents-view'
import { GoalsView } from './dashboard/goals-view'
import { HabitsView } from './dashboard/habits-view'
import { FinanceView } from './dashboard/finance-view'
import { TaskModal, ExamModal } from './dashboard/modals'
import { IconAdd } from '@/components/icons'

interface DashboardProps {
  userName: string
  initialTasks: Task[]
  initialExams: Exam[]
  focusThisWeek: number
  nowMs: number
  initialView?: NavKey
}

export function DashboardClient({ userName, initialTasks, initialExams, focusThisWeek, nowMs, initialView = 'overview' }: DashboardProps) {
  const firstName = userName.trim().split(/\s+/)[0] || 'toi'

  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [exams, setExams] = useState<Exam[]>(initialExams)
  const [focusCount, setFocusCount] = useState(focusThisWeek)
  const [modal, setModal] = useState<'task' | 'exam' | null>(null)
  const [nav, setNav] = useState<NavKey>(initialView)

  const [clientNow, setClientNow] = useState<number | null>(null)
  useEffect(() => { setClientNow(nowMs) }, [nowMs])
  const todayLabel = clientNow
    ? new Date(clientNow).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase())
    : ''
  const timeLabel = clientNow
    ? new Date(clientNow).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : ''

  const completed = useMemo(() => tasks.filter((t) => t.status === 'done').length, [tasks])
  const nextExam = exams[0]

  return (
    <AppChrome
      userName={userName}
      active={nav}
      onNav={setNav}
      searchIndex={[
        ...tasks.map((t) => ({
          label: t.title,
          hint: `${t.subject} · ${t.status === 'done' ? 'terminée' : 'à faire'}`,
          onPick: () => { setNav('tasks') },
        })),
        ...exams.map((e) => ({
          label: e.title,
          hint: `${e.subject} · préparation ${e.preparationPercent}%`,
          onPick: () => { setNav('exams') },
        })),
      ]}
    >
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
      {nav === 'documents' && <DocumentsView />}
      {nav === 'goals' && <GoalsView />}
      {nav === 'habits' && <HabitsView thisWeek={focusCount} />}
      {nav === 'finance' && <FinanceView />}

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
    </AppChrome>
  )
}