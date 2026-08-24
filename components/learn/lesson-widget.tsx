'use client'

import type { WidgetSpec } from '@/lib/curriculum'
import { PythonRunner } from '@/components/learn/python-runner'
import { Projectile, Pendule, Orbites, Grapheur, CercleTrigo, Tangente } from '@/components/learn/sims'

export function LessonWidget({ spec }: { spec: WidgetSpec }) {
  switch (spec.type) {
    case 'python': return <PythonRunner task={spec.task} starter={spec.starter} expected={spec.expected} hint={spec.hint} />
    case 'projectile': return <Projectile />
    case 'pendule': return <Pendule />
    case 'orbites': return <Orbites />
    case 'grapheur': return <Grapheur />
    case 'cercle-trigo': return <CercleTrigo />
    case 'tangente': return <Tangente />
    default: return null
  }
}