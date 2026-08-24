'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Helper hook for HiDPI canvas drawing that scales to its CSS box.
 */
function useCanvas<T>(setup: (ctx: CanvasRenderingContext2D, w: number, h: number) => T, deps: unknown[] = []) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const stateRef = useRef<T | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas || !ctx) return
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stateRef.current = setup(ctx, rect.width, rect.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      ro.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ref, state: stateRef }
}

/* ============================================================
   Projectile
   ============================================================ */
export function Projectile() {
  const [v0, setV0] = useState(20)
  const [angle, setAngle] = useState(45)
  const [g, setG] = useState(9.81)
  const { ref } = useCanvas<{ t: number }>((ctx, w, h) => {
    ctx.fillStyle = '#0f1115'; ctx.fillRect(0, 0, w, h)
    return { t: 0 }
  })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = '#0f1115'; ctx.fillRect(0, 0, rect.width, rect.height)

      const rad = (angle * Math.PI) / 180
      const vx = v0 * Math.cos(rad)
      const vy0 = v0 * Math.sin(rad)
      const range = (v0 * v0 * Math.sin(2 * rad)) / g
      const maxHeight = (vy0 * vy0) / (2 * g)
      const flightTime = (2 * vy0) / g

      const scaleX = (rect.width - 40) / Math.max(1, range * 1.1)
      const scaleY = (rect.height - 60) / Math.max(1, maxHeight * 1.2)

      // Ground
      ctx.fillStyle = '#1c2030'
      ctx.fillRect(0, rect.height - 30, rect.width, 30)

      // Trajectory
      ctx.strokeStyle = '#ee705f'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i <= 80; i++) {
        const t = (i / 80) * flightTime
        const x = vx * t
        const y = vy0 * t - 0.5 * g * t * t
        if (y < 0 && i > 0) break
        ctx.lineTo(20 + x * scaleX, rect.height - 30 - y * scaleY)
      }
      ctx.stroke()

      // Range label
      ctx.fillStyle = '#e8e9ee'
      ctx.font = '11px ui-monospace, monospace'
      ctx.fillText(`Portée ≈ ${range.toFixed(1)} m`, 20, 20)
      ctx.fillText(`Flèche ≈ ${maxHeight.toFixed(1)} m`, 20, 36)
      ctx.fillText(`Tir : v₀ ${v0} m/s · θ ${angle}° · g ${g} m/s²`, 20, rect.height - 8)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [v0, angle, g, ref])

  return (
    <SimFrame title="Projectile">
      <div className="sim-canvas-wrap"><canvas ref={ref} /></div>
      <Controls>
        <Slider label="Vitesse v₀" min={5} max={50} step={1} value={v0} onChange={setV0} unit="m/s" />
        <Slider label="Angle θ" min={5} max={85} step={1} value={angle} onChange={setAngle} unit="°" />
        <Slider label="Gravité g" min={1.6} max={25} step={0.1} value={g} onChange={setG} unit="m/s²" />
      </Controls>
    </SimFrame>
  )
}

/* ============================================================
   Pendule
   ============================================================ */
export function Pendule() {
  const [L, setL] = useState(1.5)
  const [theta0, setTheta0] = useState(25)
  const [damping, setDamping] = useState(0.02)
  const { ref } = useCanvas<{ theta: number; omega: number; t: number }>((ctx) => {
    return { theta: (theta0 * Math.PI) / 180, omega: 0, t: 0 }
  })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    let theta = (theta0 * Math.PI) / 180
    let omega = 0
    let last = performance.now()

    const draw = () => {
      const now = performance.now()
      const dt = Math.min(0.04, (now - last) / 1000)
      last = now
      const g = 9.81
      const alpha = -(g / L) * Math.sin(theta) - damping * omega
      omega += alpha * dt
      theta += omega * dt

      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = '#0f1115'; ctx.fillRect(0, 0, rect.width, rect.height)

      const cx = rect.width / 2
      const cy = 40
      const px = cx + Math.sin(theta) * L * 80
      const py = cy + Math.cos(theta) * L * 80

      ctx.strokeStyle = '#ee705f'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke()

      ctx.fillStyle = '#ee705f'
      ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill()

      const T = 2 * Math.PI * Math.sqrt(L / g)
      ctx.fillStyle = '#e8e9ee'
      ctx.font = '11px ui-monospace, monospace'
      ctx.fillText(`Période T = ${T.toFixed(2)} s`, 20, 20)
      ctx.fillText(`Angle = ${((theta * 180) / Math.PI).toFixed(1)}°`, 20, 36)
      ctx.fillText(`L = ${L.toFixed(2)} m · g = 9.81 m/s²`, 20, rect.height - 8)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [L, theta0, damping, ref])

  return (
    <SimFrame title="Pendule">
      <div className="sim-canvas-wrap"><canvas ref={ref} /></div>
      <Controls>
        <Slider label="Longueur L" min={0.2} max={3} step={0.05} value={L} onChange={setL} unit="m" />
        <Slider label="Angle initial" min={5} max={60} step={1} value={theta0} onChange={setTheta0} unit="°" />
        <Slider label="Amortissement" min={0} max={0.3} step={0.01} value={damping} onChange={setDamping} unit="" />
      </Controls>
    </SimFrame>
  )
}

/* ============================================================
   Orbites
   ============================================================ */
export function Orbites() {
  const [vx, setVx] = useState(3.5)
  const { ref } = useCanvas<{ x: number; y: number; vx: number; vy: number }>((ctx) => {
    return { x: 180, y: 160, vx, vy: 0 }
  })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    let trail: Array<{ x: number; y: number }> = []
    let x = 180, y = 160, vxi = vx, vyi = 0
    const M = 1500
    const G = 1

    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = '#0f1115'; ctx.fillRect(0, 0, rect.width, rect.height)

      const cx = rect.width / 2
      const cy = rect.height / 2

      const rx = x - cx, ry = y - cy
      const r2 = rx * rx + ry * ry
      const r = Math.sqrt(r2)
      const a = -(G * M) / Math.max(20, r2)
      const ax = a * (rx / r)
      const ay = a * (ry / r)
      vxi += ax * 0.02
      vyi += ay * 0.02
      x += vxi
      y += vyi

      trail.push({ x, y })
      if (trail.length > 200) trail.shift()

      ctx.strokeStyle = 'rgba(238, 112, 95, 0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      trail.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y) })
      ctx.stroke()

      ctx.fillStyle = '#5266b6'
      ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = '#ee705f'
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = '#e8e9ee'
      ctx.font = '11px ui-monospace, monospace'
      ctx.fillText(`v initiale : ${vx.toFixed(2)}`, 16, 20)
      ctx.fillText(`v actuelle : ${Math.sqrt(vxi * vxi + vyi * vyi).toFixed(2)}`, 16, 36)
      ctx.fillText(`Distance : ${r.toFixed(1)}`, 16, 52)

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [vx, ref])

  return (
    <SimFrame title="Orbites">
      <div className="sim-canvas-wrap"><canvas ref={ref} /></div>
      <Controls>
        <Slider label="Vitesse tangentielle" min={0.5} max={6} step={0.05} value={vx} onChange={setVx} unit="" />
      </Controls>
    </SimFrame>
  )
}

/* ============================================================
   Grapheur (ax² + bx + c)
   ============================================================ */
export function Grapheur() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)
  const { ref } = useCanvas(() => ({}), [a, b, c])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.fillStyle = '#0f1115'; ctx.fillRect(0, 0, rect.width, rect.height)

    const cx = rect.width / 2
    const cy = rect.height / 2
    const scale = 30

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let x = -cx; x < rect.width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x + cx, 0); ctx.lineTo(x + cx, rect.height); ctx.stroke()
    }
    for (let y = -cy; y < rect.height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y + cy); ctx.lineTo(rect.width, y + cy); ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(rect.width, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, rect.height); ctx.stroke()

    // Curve
    ctx.strokeStyle = '#ee705f'
    ctx.lineWidth = 2
    ctx.beginPath()
    let started = false
    for (let px = 0; px < rect.width; px++) {
      const x = (px - cx) / scale
      const y = a * x * x + b * x + c
      const py = cy - y * scale
      if (!started) { ctx.moveTo(px, py); started = true } else ctx.lineTo(px, py)
    }
    ctx.stroke()

    // Roots
    const disc = b * b - 4 * a * c
    if (a !== 0 && disc >= 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a)
      const r2 = (-b - Math.sqrt(disc)) / (2 * a)
      ctx.fillStyle = '#5fb87e'
      ctx.beginPath(); ctx.arc(cx + r1 * scale, cy, 5, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx + r2 * scale, cy, 5, 0, Math.PI * 2); ctx.fill()
    }
  }, [a, b, c, ref])

  return (
    <SimFrame title="Grapheur">
      <div className="sim-canvas-wrap"><canvas ref={ref} /></div>
      <Controls>
        <Slider label="a (ouverture)" min={-3} max={3} step={0.1} value={a} onChange={setA} />
        <Slider label="b (obliquité)" min={-3} max={3} step={0.1} value={b} onChange={setB} />
        <Slider label="c (hauteur)" min={-3} max={3} step={0.1} value={c} onChange={setC} />
      </Controls>
    </SimFrame>
  )
}

/* ============================================================
   Cercle trigonométrique
   ============================================================ */
export function CercleTrigo() {
  const [theta, setTheta] = useState(30)
  const { ref } = useCanvas(() => ({}), [theta])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.fillStyle = '#0f1115'; ctx.fillRect(0, 0, rect.width, rect.height)

    const cx = rect.width / 2
    const cy = rect.height / 2
    const r = Math.min(rect.width, rect.height) / 2 - 30
    const rad = (theta * Math.PI) / 180
    const x = Math.cos(rad)
    const y = -Math.sin(rad)

    // Circle
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke()

    // Axes
    ctx.beginPath(); ctx.moveTo(cx - r - 20, cy); ctx.lineTo(cx + r + 20, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy - r - 20); ctx.lineTo(cx, cy + r + 20); ctx.stroke()

    // Radius line
    ctx.strokeStyle = '#ee705f'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + x * r, cy + y * r); ctx.stroke()

    // Projections
    ctx.strokeStyle = '#5fb87e'
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(cx + x * r, cy); ctx.lineTo(cx + x * r, cy + y * r); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy + y * r); ctx.lineTo(cx + x * r, cy + y * r); ctx.stroke()
    ctx.setLineDash([])

    // Dot
    ctx.fillStyle = '#ee705f'
    ctx.beginPath(); ctx.arc(cx + x * r, cy + y * r, 6, 0, Math.PI * 2); ctx.fill()

    // Labels
    ctx.fillStyle = '#e8e9ee'
    ctx.font = '12px ui-monospace, monospace'
    ctx.fillText(`θ = ${theta}°`, 16, 20)
    ctx.fillStyle = '#5fb87e'
    ctx.fillText(`cos θ = ${Math.cos(rad).toFixed(3)}`, 16, 40)
    ctx.fillStyle = '#ee705f'
    ctx.fillText(`sin θ = ${Math.sin(rad).toFixed(3)}`, 16, 60)
    ctx.fillStyle = '#d4a05a'
    ctx.fillText(`tan θ = ${Math.tan(rad).toFixed(3)}`, 16, 80)
  }, [theta, ref])

  return (
    <SimFrame title="Cercle trigonométrique">
      <div className="sim-canvas-wrap"><canvas ref={ref} /></div>
      <Controls>
        <Slider label="Angle θ" min={0} max={360} step={1} value={theta} onChange={setTheta} unit="°" />
      </Controls>
    </SimFrame>
  )
}

/* ============================================================
   Tangente (dérivées)
   ============================================================ */
export function Tangente() {
  const [x0, setX0] = useState(0.5)
  const { ref } = useCanvas(() => ({}), [x0])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.fillStyle = '#0f1115'; ctx.fillRect(0, 0, rect.width, rect.height)

    const cx = rect.width / 2
    const cy = rect.height / 2
    const scale = 60

    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let x = -cx; x < rect.width; x += scale) { ctx.beginPath(); ctx.moveTo(x + cx, 0); ctx.lineTo(x + cx, rect.height); ctx.stroke() }
    for (let y = -cy; y < rect.height; y += scale) { ctx.beginPath(); ctx.moveTo(0, y + cy); ctx.lineTo(rect.width, y + cy); ctx.stroke() }

    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(rect.width, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, rect.height); ctx.stroke()

    // f(x) = x^3 - x (dérivable, présente un extremum en x=±1/√3)
    const f = (x: number) => x * x * x - x
    const fp = (x: number) => 3 * x * x - 1

    ctx.strokeStyle = '#ee705f'
    ctx.lineWidth = 2
    ctx.beginPath()
    let started = false
    for (let px = 0; px < rect.width; px++) {
      const x = (px - cx) / scale
      const y = f(x)
      const py = cy - y * scale
      if (!started) { ctx.moveTo(px, py); started = true } else ctx.lineTo(px, py)
    }
    ctx.stroke()

    const y0 = f(x0)
    const m = fp(x0)
    const px0 = cx + x0 * scale
    const py0 = cy - y0 * scale
    const halfW = rect.width / 2
    const xLeft = (cx - halfW) / scale
    const xRight = (cx + halfW) / scale
    const yLeft = y0 + m * (xLeft - x0)
    const yRight = y0 + m * (xRight - x0)

    ctx.strokeStyle = '#5fb87e'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx + xLeft * scale, cy - yLeft * scale)
    ctx.lineTo(cx + xRight * scale, cy - yRight * scale)
    ctx.stroke()

    ctx.fillStyle = '#ee705f'
    ctx.beginPath(); ctx.arc(px0, py0, 5, 0, Math.PI * 2); ctx.fill()

    ctx.fillStyle = '#e8e9ee'
    ctx.font = '11px ui-monospace, monospace'
    ctx.fillText(`x = ${x0.toFixed(2)}`, 16, 20)
    ctx.fillText(`f(x) = ${y0.toFixed(2)}`, 16, 36)
    ctx.fillText(`f′(x) = ${m.toFixed(2)}`, 16, 52)
  }, [x0, ref])

  return (
    <SimFrame title="Tangente (dérivées)">
      <div className="sim-canvas-wrap"><canvas ref={ref} /></div>
      <Controls>
        <Slider label="Position x" min={-2} max={2} step={0.05} value={x0} onChange={setX0} />
      </Controls>
    </SimFrame>
  )
}

/* ============================================================
   Shared UI
   ============================================================ */
function SimFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sim">
      <div className="sim-head"><span>{title}</span></div>
      <div className="sim-body">{children}</div>
    </div>
  )
}

function Controls({ children }: { children: React.ReactNode }) {
  return <div className="sim-controls">{children}</div>
}

interface SliderProps {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  unit?: string
}
function Slider({ label, min, max, step, value, onChange, unit }: SliderProps) {
  return (
    <label className="sim-slider">
      <span>{label}</span>
      <div className="sim-slider-row">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <strong>{value.toFixed(unit === '°' ? 0 : 2)}{unit ?? ''}</strong>
      </div>
    </label>
  )
}