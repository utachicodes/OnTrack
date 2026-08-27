import { redirect } from 'next/navigation'
import { eq, and, gte } from 'drizzle-orm'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { tasks, exams, focusSessions, userXp } from '@/lib/db/schema'
import { AppChrome } from '@/components/app-chrome'
import { SignOutButton } from '@/components/signout-button'
import { IconPen, IconCheck, IconTimer, IconSparkles } from '@/components/icons'
import { levelForXp, levelTitle, xpFloor, xpCeil } from '@/lib/curriculum'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Profil · OnTrack',
}

export default async function ProfilePage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')

  const userId = session.user.id
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)

  const [doneTasks, allExams, recentFocus, xpRow] = await Promise.all([
    db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, 'done'))),
    db.select().from(exams).where(eq(exams.userId, userId)),
    db.select().from(focusSessions).where(
      and(eq(focusSessions.userId, userId), gte(focusSessions.startedAt, weekStart)),
    ),
    db.select({ xp: userXp.xp }).from(userXp).where(eq(userXp.userId, userId)).limit(1),
  ])

  const weeksSessions = recentFocus.filter((f) => f.status === 'completed').length
  const xp = xpRow[0]?.xp ?? 0
  const level = levelForXp(xp)
  const floor = xpFloor(level)
  const ceil = xpCeil(level)
  const xpPct = ceil > floor ? Math.min(100, Math.round(((xp - floor) / (ceil - floor)) * 100)) : 100

  return (
    <AppChrome userName={session.user.name} active="profile">
      <div className="profile-head">
        <div className="profile-avatar">
          {session.user.name.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div className="profile-id">
          <p className="eyebrow">Ton profil</p>
          <h1>{session.user.name}</h1>
          <p>{session.user.email}</p>
        </div>
        <div className="profile-actions">
          <SignOutButton />
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <p className="eyebrow" style={{ color: '#ee705f' }}><IconSparkles size={14} /> Niveau {level}</p>
          <strong>{levelTitle(level)}</strong>
          <span>{xp} XP</span>
          <div className="progress-line thin"><span style={{ width: `${xpPct}%` }} /></div>
        </div>
        <div className="profile-stat">
          <p className="eyebrow" style={{ color: '#5fb87e' }}><IconCheck size={14} /> Progression</p>
          <strong>{doneTasks.length}</strong>
          <span>tâches terminées</span>
        </div>
        <div className="profile-stat">
          <p className="eyebrow" style={{ color: '#d4a05a' }}><IconPen size={14} /> Examens</p>
          <strong>{allExams.length}</strong>
          <span>préparés dans l'espace</span>
        </div>
        <div className="profile-stat">
          <p className="eyebrow" style={{ color: '#5266b6' }}><IconTimer size={14} /> Focus</p>
          <strong>{weeksSessions}</strong>
          <span>sessions 7 derniers jours</span>
        </div>
      </div>
    </AppChrome>
  )
}