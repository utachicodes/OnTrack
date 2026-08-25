/**
 * Inline SVG of three classical columns (Doric/Tuscan — simple capital + base,
 * vertical fluting). Used as the right-side decoration on the auth pages.
 * Pure CSS for color so it adapts to the surrounding dark panel.
 */
export function AuthColumnsArt() {
  return (
    <svg
      className="auth-art"
      viewBox="0 0 520 560"
      role="img"
      aria-label="Illustration décorative — colonnes classiques"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Soft top-down highlight on the panel */}
        <radialGradient id="auth-art-light" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Subtle vertical shading on each column shaft */}
        <linearGradient id="auth-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
        {/* Reusable single column with fluting (vertical lines) */}
        <symbol id="auth-column" viewBox="0 0 110 520" overflow="visible">
          {/* Capital (top): abacus + echinus */}
          <rect x="6" y="14" width="98" height="8" rx="1" fill="currentColor" opacity="0.95" />
          <rect x="14" y="22" width="82" height="6" rx="2" fill="currentColor" opacity="0.9" />
          {/* Necking groove */}
          <rect x="20" y="28" width="70" height="3" fill="rgba(0,0,0,0.35)" />
          {/* Shaft with fluting */}
          <rect
            x="22"
            y="34"
            width="66"
            height="420"
            fill="url(#auth-shaft)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          {/* Flutes — vertical grooves */}
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1={28 + i * 9}
              y1="42"
              x2={28 + i * 9}
              y2="446"
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="0.9"
            />
          ))}
          {/* Highlight ridge on the left of the shaft */}
          <rect x="24" y="36" width="2" height="416" fill="rgba(255,255,255,0.18)" />
          {/* Base (bottom): torus + plinth */}
          <rect x="20" y="454" width="70" height="4" fill="currentColor" opacity="0.9" />
          <rect x="14" y="458" width="82" height="10" rx="2" fill="currentColor" opacity="0.95" />
          <rect x="6" y="468" width="98" height="10" rx="1" fill="currentColor" opacity="0.95" />
        </symbol>
      </defs>

      {/* Top highlight wash */}
      <rect x="0" y="0" width="520" height="560" fill="url(#auth-art-light)" />

      {/* Three columns, slightly varying height for rhythm */}
      <g className="auth-art-columns">
        <use href="#auth-column" x="40" y="20" width="110" height="520" />
        <use href="#auth-column" x="205" y="0" width="110" height="540" />
        <use href="#auth-column" x="370" y="20" width="110" height="520" />
      </g>

      {/* Ground line */}
      <line x1="20" y1="510" x2="500" y2="510" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  )
}
