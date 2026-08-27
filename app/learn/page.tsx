import { Sparkles, Trophy } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { ALL_LESSONS, BADGES, TRACKS, earnedBadges, levelForXp, levelTitle, xpFloor, xpCeil } from '@/lib/curriculum'
import { db } from '@/lib/db'
import { lessonProgress, userXp } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { LearnClient } from '@/components/learn/learn-client'
import { AppChrome } from '@/components/app-chrome'

export const metadata = {
  title: 'Apprendre · OnTrack',
}

export default async function LearnHubPage() {
  const session = await getSession()
  if (!session?.user) redirect('/sign-in')
  const userId = session.user.id

  const [completions, xpRow] = await Promise.all([
    db
      .select({ lessonId: lessonProgress.lessonId, score: lessonProgress.score, xpAwarded: lessonProgress.xpAwarded, completedAt: lessonProgress.completedAt })
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId))
      .orderBy(desc(lessonProgress.completedAt))
      .catch(() => [] as { lessonId: string; score: number; xpAwarded: number; completedAt: Date }[]),
    db.select({ xp: userXp.xp }).from(userXp).where(eq(userXp.userId, userId)).limit(1)
      .catch(() => [] as { xp: number }[]),
  ])

  const xp    = xpRow[0]?.xp ?? 0
  const level = levelForXp(xp)
  const earned = earnedBadges(completions.map((c) => ({ lessonId: c.lessonId, score: c.score })))
  const floor = xpFloor(level)
  const ceil  = xpCeil(level)
  const pct   = ceil > floor ? Math.min(100, ((xp - floor) / (ceil - floor)) * 100) : 100
  const totalLessons     = TRACKS.reduce((s, t) => s + t.lessons.length, 0)
  const completedLessons = completions.length

  return (
    <AppChrome userName={session.user.name} userImage={session.user.image} active="learn">
      <div className="learn-page">

        {/* ── Slim hero: XP card only ── */}
        <header className="lhub-hero">
          <div className="lhub-hero-left">
            <p className="eyebrow">BAC 2026 · {TRACKS.length} matières · {totalLessons} leçons</p>
            <h1>Apprendre</h1>
            <p className="lhub-hero-sub">
              <strong>{completedLessons}</strong> / {totalLessons} leçons validées ·{' '}
              <strong>{earned.size}</strong> / {BADGES.length} badges
            </p>
          </div>
          <div className="xp-card">
            <div className="xp-head">
              <div>
                <p className="eyebrow">Niveau {level}</p>
                <h2>{levelTitle(level)}</h2>
              </div>
              <div className="xp-readout">
                <Sparkles size={16} aria-hidden="true" />
                <strong>{xp}</strong>
                <span>XP</span>
              </div>
            </div>
            <div className="xp-bar"><span style={{ width: `${pct}%` }} /></div>
            <p className="xp-foot">{xp - floor} / {ceil - floor} XP jusqu&apos;au niveau suivant</p>
          </div>
        </header>

        {/* ── Tabbed lesson hub ── */}
        <LearnClient tracks={TRACKS} completedIds={completions.map((c) => c.lessonId)} />

        {/* ── Badges (compact, below fold) ── */}
        <section className="lhub-badges">
          <header className="lhub-badges-head">
            <Trophy size={16} />
            <h2>Badges <span>({earned.size} / {BADGES.length})</span></h2>
          </header>
          <ul className="badges-grid">
            {BADGES.map((badge) => {
              const isEarned = earned.has(badge.id)
              return (
                <li key={badge.id} className={`badge${isEarned ? ' is-earned' : ''}`}>
                  <span className="badge-icon" aria-hidden="true">
                    <Trophy size={16} />
                  </span>
                  <strong>{badge.label}</strong>
                  <small>{badge.description}</small>
                </li>
              )
            })}
          </ul>
        </section>

      </div>
    </AppChrome>
  )
}
