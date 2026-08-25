'use client'

import Link from 'next/link'
import { IconArrow } from '@/components/icons'

export function LearnView() {
  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Apprendre</p><h2>Apprendre</h2></div></div>
      <section className="panel learn-cta">
        <div>
          <h3>4 pistes interactives</h3>
          <p>Code, Python, Physique, Maths: leçons courtes, simulations vivantes, quiz.</p>
        </div>
        <Link href="/learn" className="primary-button">
          Ouvrir l&apos;académie <IconArrow size={14} />
        </Link>
      </section>
    </>
  )
}
