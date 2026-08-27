import { BookOpen, Sparkles } from 'lucide-react'
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
      .orderBy(desc(lessonProgress.completedAt)),
    db.select({ xp: userXp.xp }).from(userXp).where(eq(userXp.userId, userId)).limit(1),
  ])

  const xp = xpRow[0]?.xp ?? 0
  const level = levelForXp(xp)
  const earned = earnedBadges(completions.map((c) => ({ lessonId: c.lessonId, score: c.score })))

  const floor = xpFloor(level)
  const ceil = xpCeil(level)
  const pct = ceil > floor ? Math.min(100, ((xp - floor) / (ceil - floor)) * 100) : 100

  const totalLessons = TRACKS.reduce((s, t) => s + t.lessons.length, 0)
  const completedLessons = completions.length

  return (
    <AppChrome userName={session.user.name} userImage={session.user.image} active="learn">
      <div className="learn-page">
        <div className="learn-page-band">
          <div className="learn-header">
            <p className="legal-eyebrow" style={{ color: 'rgba(244,245,247,0.7)' }}>
              Apprendre · {TRACKS.length} pistes · {totalLessons} leçons · {completedLessons} validées
            </p>
          </div>
          <section className="learn-hero">
            <p className="auth-eyebrow">Programme officiel du BAC 2026</p>
            <h1>Dix pistes, un seul élan.</h1>
            <p className="learn-hero-sub">
              Mathématiques, Physique-Chimie, SVT, Philosophie, Français, Histoire-Géographie, SES, NSI — plus Code et Python en bonus. Leçons courtes, simulations vivantes, quiz. Gagne des points d’XP et débloque des badges.
            </p>
            <div className="xp-card">
              <div className="xp-head">
                <div>
                  <p className="legal-eyebrow" style={{ color: '#a4a8b5' }}>Niveau {level}</p>
                  <h2>{levelTitle(level)}</h2>
                </div>
                <div className="xp-readout">
                  <Sparkles size={18} aria-hidden="true" />
                  <strong>{xp}</strong>
                  <span>XP</span>
                </div>
              </div>
              <div className="xp-bar"><span style={{ width: `${pct}%` }} /></div>
              <p className="xp-foot">{xp - floor} / {ceil - floor} XP jusqu’au niveau suivant</p>
            </div>
          </section>
        </div>

        <div className="learn-shell">
          <LearnClient tracks={TRACKS} completedIds={completions.map((c) => c.lessonId)} />

          <section className="badges-section">
            <header className="badges-head">
              <p className="legal-eyebrow">Récompenses</p>
              <h2>Badges</h2>
              <span>{earned.size} / {BADGES.length}</span>
            </header>
            <ul className="badges-grid">
              {BADGES.map((badge) => {
                const isEarned = earned.has(badge.id)
                return (
                  <li key={badge.id} className={`badge ${isEarned ? 'is-earned' : ''}`}>
                    <span className="badge-icon" aria-hidden="true">
                      <BookOpen size={20} />
                    </span>
                    <strong>{badge.label}</strong>
                    <small>{badge.description}</small>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>
    </AppChrome>
  )
}
