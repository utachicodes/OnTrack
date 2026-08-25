export interface Task {
  id: string
  title: string
  subject: string
  estimatedMinutes: number
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'done'
  dueAt: string | null
}

export interface Exam {
  id: string
  title: string
  subject: string
  examAt: string
  preparationPercent: number
}

export interface DashboardProps {
  userName: string
  initialTasks: Task[]
  initialExams: Exam[]
  focusThisWeek: number
  nowMs: number
}

export const SUBJECTS = ['Mathématiques', 'Physique', 'Français', 'Histoire', 'Philosophie', 'SVT', 'Anglais'] as const

export type NavKey = 'overview' | 'tasks' | 'exams' | 'planning' | 'focus' | 'learn' | 'documents' | 'goals' | 'habits' | 'finance'
