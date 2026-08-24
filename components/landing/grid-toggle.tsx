'use client'

import { useEffect } from 'react'

/**
 * GridToggle — Swiss-grid demo control.
 *
 *  • Button + 'G' key flip body.grid-on, fading the .guides overlay
 *    (the same overlay that ships inside every .spread, so its columns
 *    are the content columns).
 *  • On mount, populate each .guides .cols container with numbered
 *    column fields driven by the same :root --cols token.
 *  • OPTICAL ALIGNMENT — large display glyphs carry a left side-bearing,
 *    so a headline whose BOX is on the column line still LOOKS indented.
 *    We measure the actual bounding box of the first character with the
 *    loaded font, then nudge the element so its INK lands on the line.
 *    Scales with fluid type (re-runs on resize + after webfont load).
 */
export function GridToggle() {
  useEffect(() => {
    const btn = document.getElementById('gridToggle')
    const setGrid = (on: boolean) => {
      document.body.classList.toggle('grid-on', on)
      btn?.setAttribute('aria-pressed', on ? 'true' : 'false')
      const lbl = btn?.querySelector('.lbl') as HTMLElement | null
      if (lbl) lbl.textContent = on ? 'Hide grid' : 'Show grid'
    }
    const onClick = () => setGrid(!document.body.classList.contains('grid-on'))
    btn?.addEventListener('click', onClick)
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setGrid(!document.body.classList.contains('grid-on'))
      }
    }
    document.addEventListener('keydown', onKey)

    // populate numbered column fields in every .guides .cols container
    const cols = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--cols').trim() || '12',
      10,
    )
    document.querySelectorAll('.guides .cols').forEach((host) => {
      if (host.children.length > 0) return
      for (let i = 1; i <= cols; i++) {
        const cell = document.createElement('div')
        cell.className = 'col'
        const num = document.createElement('span')
        num.textContent = String(i)
        cell.appendChild(num)
        host.appendChild(cell)
      }
    })

    // optical alignment — measure first glyph ink and shift box so ink lands
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const OPTICAL_SELECTORS = '.masthead, .numeral, .display-h'
    const align = () => {
      document.querySelectorAll<HTMLElement>(OPTICAL_SELECTORS).forEach((el) => {
        el.style.marginLeft = '0px'
        const cs = getComputedStyle(el)
        const raw = (el.textContent || '').trim().charAt(0)
        if (!raw) return
        const ch = cs.textTransform === 'uppercase' ? raw.toUpperCase() : raw
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
        ctx.textAlign = 'left'
        const abl = ctx.measureText(ch).actualBoundingBoxLeft
        if (Number.isFinite(abl)) el.style.marginLeft = `${abl.toFixed(2)}px`
      })
    }
    let raf = 0
    const scheduleAlign = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(align)
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(scheduleAlign)
    }
    scheduleAlign()
    let resizeT = 0
    window.addEventListener('resize', () => {
      clearTimeout(resizeT)
      resizeT = window.setTimeout(scheduleAlign, 120)
    })

    return () => {
      btn?.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', scheduleAlign)
    }
  }, [])

  return (
    <button id="gridToggle" className="grid-toggle" type="button" aria-pressed="false">
      <span className="dot" />
      <span className="lbl">Show grid</span>
    </button>
  )
}
