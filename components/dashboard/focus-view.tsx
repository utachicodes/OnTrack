'use client'

import { IconFlame } from '@/components/icons'
import { Pomodoro } from '@/components/pomodoro'

export function FocusView({ thisWeek, onFocusComplete }: { thisWeek: number; onFocusComplete?: () => void }) {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Sessions</p><h2>Focus</h2></div></div>
      <div className="dashboard-grid two">
        <section className="panel">
          <div className="panel-header"><div><h3>Pomodoro</h3><span>25 minutes, sans interruption</span></div></div>
          <Pomodoro defaultMinutes={25} onComplete={onFocusComplete} />
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
