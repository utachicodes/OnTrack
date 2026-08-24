'use client'

import Link from 'next/link'

export function Hero() {
  return (
    <section className="spread">
      <div className="wrap">
        <div className="grid">
          {/* Top band — kicker + folio */}
          <div className="band" style={{ paddingTop: 'calc(var(--lh) * 4)' }}>
            <div style={{ gridColumn: '1 / 7' }} className="kicker">
              <span className="accent">●</span> Édition · Terminale · BAC 2026
            </div>
            <div style={{ gridColumn: '12 / 13' }} className="kicker" aria-hidden="true">
              01 / 01
            </div>
          </div>

          {/* Headline band — masthead + big numeral */}
          <div className="band" style={{ paddingTop: 'calc(var(--lh) * 2)' }}>
            <h1
              className="masthead"
              style={{ gridColumn: '1 / 11' }}
              aria-label="Ton espace pour avancer"
            >
              Ton espace
              <br />
              pour <em>avancer.</em>
            </h1>
            <div style={{ gridColumn: '11 / 13', alignSelf: 'end' }}>
              <div className="numeral">
                BAC<span className="unit">26</span>
              </div>
              <div className="cap" style={{ marginTop: '8px' }}>
                Compte à rebours
              </div>
            </div>
          </div>

          {/* Lede band — subcopy + CTAs */}
          <div className="band" style={{ paddingTop: 'calc(var(--lh) * 2)' }}>
            <p className="lede" style={{ gridColumn: '1 / 8' }}>
              Tâches, examens, sessions de focus et tuteur IA. Un espace calme et précis pour préparer le
              BAC avec méthode — pas avec anxiété.
            </p>
            <div
              style={{ gridColumn: '9 / 13', display: 'flex', flexDirection: 'column', gap: 'var(--lh)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bl)' }}>
                <Link href="/sign-up" className="cta">
                  Créer mon espace <span className="arr">→</span>
                </Link>
                <Link href="/sign-in" className="cta-ghost">
                  J’ai déjà un compte
                </Link>
              </div>
              <div className="cap">Gratuit · Sans carte bancaire</div>
            </div>
          </div>

          {/* Feature row — three columns of editorial entries */}
          <div className="band" style={{ paddingTop: 'calc(var(--lh) * 3)' }}>
            <article style={{ gridColumn: '1 / 5' }}>
              <hr className="hairline" />
              <div className="kicker" style={{ paddingTop: 'calc(var(--lh) / 2)' }}>01 — Tâches</div>
              <p className="body" style={{ paddingTop: 'calc(var(--lh) / 2)' }}>
                Liste claire par matière, par jour, par priorité. Coche, avance, recommence.
              </p>
            </article>
            <article style={{ gridColumn: '5 / 9' }}>
              <hr className="hairline" />
              <div className="kicker" style={{ paddingTop: 'calc(var(--lh) / 2)' }}>02 — Focus</div>
              <p className="body" style={{ paddingTop: 'calc(var(--lh) / 2)' }}>
                Sessions de 25 minutes, interruptions comptées, progression visible.
              </p>
            </article>
            <article style={{ gridColumn: '9 / 13' }}>
              <hr className="hairline" />
              <div className="kicker" style={{ paddingTop: 'calc(var(--lh) / 2)' }}>
                03 — Tuteur <span className="accent">IA</span>
              </div>
              <p className="body" style={{ paddingTop: 'calc(var(--lh) / 2)' }}>
                Explique, ne fait pas à ta place. Sur maths, philo, histoire, SVT, français.
              </p>
            </article>
          </div>

          {/* Bottom meta — long rule + folio */}
          <div className="band" style={{ paddingTop: 'calc(var(--lh) * 4)', paddingBottom: 'calc(var(--lh) * 2)' }}>
            <div style={{ gridColumn: '1 / 6' }} className="cap">
              Orbite · Lyon · 2024—2026
            </div>
            <div style={{ gridColumn: '7 / 13' }} className="cap">
              Prépare ton BAC, pas la panique.
            </div>
          </div>
        </div>

        {/* Per-spread grid overlay (same .wrap box → columns match content exactly) */}
        <div className="guides" aria-hidden="true">
          <div className="cols" />
          <div className="rows" />
          <div className="mline l" />
          <div className="mline r" />
        </div>
      </div>
    </section>
  )
}
