'use client'

import type { SVGProps } from 'react'

/**
 * Custom hand-drawn-feel icons for OnTrack.
 * Rounded, slightly varied stroke widths, friendly fills — designed
 * to feel like a study notebook doodled with markers, not an AI grid.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function baseProps(p: IconProps): SVGProps<SVGSVGElement> {
  const { size = 18, ...rest } = p
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    ...rest,
  }
}

/* --- Brand mark: smiling sun + paper plane --- */
export function OnTrackMark(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <defs>
        <linearGradient id="ot-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb084" />
          <stop offset="100%" stopColor="#ee705f" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#ot-sun)" />
      <circle cx="9" cy="11" r="1" fill="#3b1d16" />
      <circle cx="15" cy="11" r="1" fill="#3b1d16" />
      <path d="M9.5 14.5c1 .8 3 1 5 0" stroke="#3b1d16" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M3 12c-.8-.3-1.6-.2-2 .2M21 12c.8-.3 1.6-.2 2 .2M12 3c-.3-.8-.2-1.6.2-2M12 21c-.3.8-.2 1.6.2 2" stroke="#ee705f" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  )
}

/* --- Overview: a hand with sparkle --- */
export function IconOverview(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="3" width="8.5" height="8.5" rx="2.5" fill="#ffd4a8" stroke="#ee705f" strokeWidth="1.4" />
      <rect x="12.5" y="3" width="8.5" height="5" rx="2.5" fill="#fff" stroke="#252938" strokeWidth="1.4" />
      <rect x="3" y="13" width="5" height="8" rx="2.5" fill="#fff" stroke="#252938" strokeWidth="1.4" />
      <rect x="9.5" y="9.5" width="11.5" height="11.5" rx="2.5" fill="#5fb87e" stroke="#252938" strokeWidth="1.4" />
      <path d="M14 14l.8 1.6 1.7.2-1.3 1.1.4 1.7-1.6-.9-1.6.9.4-1.7-1.3-1.1 1.7-.2z" fill="#fff" />
    </svg>
  )
}

/* --- Learn: open book with pencil --- */
export function IconLearn(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 5.5c2-1 4-1 6 .5 2-1.5 4-1.5 6-.5v13c-2-1-4-1-6 .5-2-1.5-4-1.5-6-.5z" fill="#fff" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 6v13M9 8c1-.4 2-.4 3 0M9 11c1-.4 2-.4 3 0M9 14c1-.4 2-.4 3 0" stroke="#ee705f" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M16 16l4-4 1.5 1.5L17 18l-2 .5z" fill="#d4a05a" stroke="#252938" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

/* --- Exams: certificate ribbon --- */
export function IconExams(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="3" width="14" height="14" rx="2" fill="#5266b6" stroke="#252938" strokeWidth="1.4" />
      <path d="M10 17v3.5L13 19l3 1.5V17" fill="#5266b6" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2.5" fill="#ffd4a8" stroke="#fff" strokeWidth="1.2" />
      <path d="M10 12l-.7 1.5L10 14l.7-.5z" fill="#fff" />
    </svg>
  )
}

/* --- Tasks: clipboard + check --- */
export function IconTasks(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="5" y="4" width="14" height="17" rx="2.5" fill="#fff" stroke="#252938" strokeWidth="1.4" />
      <rect x="8" y="2.5" width="8" height="3" rx="1.2" fill="#ee705f" stroke="#252938" strokeWidth="1.3" />
      <circle cx="9" cy="11" r="1.6" fill="#5fb87e" />
      <path d="M8.2 11l.6.7 1.4-1.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M12.5 10.5h5M12.5 14h5" stroke="#252938" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/* --- Planning: calendar --- */
export function IconPlanning(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" fill="#fff" stroke="#252938" strokeWidth="1.4" />
      <path d="M3 9.5h18" stroke="#252938" strokeWidth="1.4" />
      <path d="M8 3v4M16 3v4" stroke="#252938" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="14" r="1.4" fill="#ee705f" />
      <circle cx="13" cy="14" r="1.4" fill="#d4a05a" />
      <circle cx="17" cy="14" r="1.4" fill="#5fb87e" />
      <circle cx="9" cy="18" r="1.4" fill="#5266b6" />
    </svg>
  )
}

/* --- Focus: tomato timer --- */
export function IconFocus(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 8c-2 1.5-3 3.5-3 6 0 4 3.6 7 8 7s8-3 8-7c0-2.5-1-4.5-3-6z" fill="#ee705f" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 5c1-.6 4-.6 5 0M11.5 3.5c1 0 1.5.6 1.5 1.5" stroke="#3b1d16" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M11.5 11v3l2 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* --- Documents: folder + page --- */
export function IconDocs(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 7c0-1 .8-2 2-2h4l2 2h8c1 0 2 1 2 2v9c0 1-.9 2-2 2H5c-1.2 0-2-1-2-2z" fill="#d4a05a" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 12h6M9 15h4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/* --- Goals: target --- */
export function IconGoals(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="9" fill="#fff" stroke="#252938" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="6" fill="#fff" stroke="#ee705f" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3" fill="#ee705f" />
      <path d="M19 5l2-2M5 19l-2 2" stroke="#252938" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/* --- Habits: flame --- */
export function IconHabits(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 2c1 4 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 1 1 2 2 2 0-3-1-5 0-7z" fill="#ff8a76" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M10 13c0 1.5 1 2.5 2 2.5s2-1 2-2.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* --- Finance: piggy bank --- */
export function IconFinance(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 13c0-3 3-5 7-5h5c3 0 5 2 5 4 0 3-3 5-7 5h-2l-3 3v-3c-2 0-4-1-5-4z" fill="#7d5fb8" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8" cy="13" r="1" fill="#fff" />
      <path d="M16 8c1-1 2-2 4-1" stroke="#252938" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="6.5" r="0.8" fill="#d4a05a" />
    </svg>
  )
}

/* --- Settings: gear with personality --- */
export function IconSettings(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 2l1.6 2.4 2.8-.4.8 2.7 2.6 1.1-1 2.6 1 2.6-2.6 1.1-.8 2.7-2.8-.4L12 22l-1.6-2.4-2.8.4-.8-2.7-2.6-1.1 1-2.6-1-2.6 2.6-1.1.8-2.7 2.8.4z" fill="#d4a05a" stroke="#252938" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.2" fill="#fff" stroke="#252938" strokeWidth="1.3" />
    </svg>
  )
}

/* --- Bell: friendly notification --- */
export function IconBell(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 16c-1 0-1.4-1-.7-1.7l1-1.2V10c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v3.1l1 1.2c.7.7.3 1.7-.7 1.7z" fill="#ffd4a8" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M10 18c0 1.5 1 2.5 2 2.5s2-1 2-2.5" stroke="#252938" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="5" r="2" fill="#ee705f" stroke="#252938" strokeWidth="1.2" />
    </svg>
  )
}

/* --- Search: lens + handle --- */
export function IconSearch(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="11" cy="11" r="6" fill="#fff" stroke="#252938" strokeWidth="1.6" />
      <path d="M16 16l5 5" stroke="#252938" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 11c.5-1.5 2-2.5 3-2" stroke="#ee705f" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* --- Add: rounded plus with sparkle --- */
export function IconAdd(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="3" width="18" height="18" rx="6" fill="#ee705f" />
      <path d="M12 8v8M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* --- Play: filled triangle with rounded edges --- */
export function IconPlay(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 5.5l11 6.5-11 6.5z" fill="#ee705f" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

/* --- Chevron: chunky right --- */
export function IconChevron(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M9 5l7 7-7 7" stroke="#252938" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/* --- Menu: hamburger --- */
export function IconMenu(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 7h16M4 12h12M4 17h16" stroke="#252938" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="19" cy="12" r="1.4" fill="#ee705f" />
    </svg>
  )
}

/* --- Close: X with rounded caps --- */
export function IconClose(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 6l12 12M18 6L6 18" stroke="#252938" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/* --- AI: sparkle + starburst --- */
export function IconSparkles(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M11 3l1.5 5L17 9l-4.5 1L11 15l-1.5-5L5 9l4.5-1z" fill="#d4a05a" stroke="#252938" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M18 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" fill="#ee705f" stroke="#252938" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

/* --- Timer: clock with chunky numbers --- */
export function IconTimer(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="13" r="8" fill="#fff" stroke="#252938" strokeWidth="1.6" />
      <path d="M12 8v5l3 2" stroke="#ee705f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M9 3h6" stroke="#252938" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/* --- Flame accent for streak --- */
export function IconFlame(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 2c.5 4 3 5 3 9a3 3 0 0 1-6 0c0-1.5.8-2.5 1.5-3 0 .8.5 1.5 1.5 1.5 0-3-1-4.5 0-7.5z" fill="#ee705f" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

/* --- Arrow up-right --- */
export function IconArrow(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 17L17 7M9 7h8v8" stroke="#252938" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/* --- Check --- */
export function IconCheck(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="10" fill="#5fb87e" />
      <path d="M7 12.5l3.5 3.5L17 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/* --- Trending up --- */
export function IconTrending(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 17l6-6 4 4 8-8" stroke="#5fb87e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 7h5v5" stroke="#5fb87e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/* --- Send --- */
export function IconSend(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 12l18-9-6.5 18-3-7.5z" fill="#ee705f" stroke="#252938" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11 13.5L21 3" stroke="#fff" strokeWidth="1.3" fill="none" />
    </svg>
  )
}

/* --- Hourglass for time --- */
export function IconHourglass(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 3h10M7 21h10" stroke="#252938" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 4c0 4 5 5 5 8s-5 4-5 8" stroke="#d4a05a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M17 4c0 4-5 5-5 8s5 4 5 8" stroke="#d4a05a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/* --- Reset --- */
export function IconReset(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M5 12a7 7 0 1 1 2.5 5.4" stroke="#252938" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M5 13V8h5" stroke="#252938" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}