'use client'

import { useState, useTransition } from 'react'
import { updatePreferences } from '@/app/actions/preferences'

const THEMES = [
  { value: 'light', label: 'Clair', desc: 'Fond clair, texte sombre.' },
  { value: 'dark', label: 'Sombre', desc: 'Fond sombre, texte clair.' },
  { value: 'system', label: 'Système', desc: 'Suit les réglages de ton appareil.' },
] as const

const ACCENTS = [
  { value: 'coral', label: 'Corail', hex: '#ee705f' },
  { value: 'indigo', label: 'Indigo', hex: '#5266b6' },
  { value: 'emerald', label: 'Émeraude', hex: '#5fb87e' },
  { value: 'amber', label: 'Ambre', hex: '#d4a05a' },
  { value: 'violet', label: 'Violet', hex: '#7d5fb8' },
  { value: 'rose', label: 'Rose', hex: '#d85f8d' },
] as const

type ThemeValue = (typeof THEMES)[number]['value']
type AccentValue = (typeof ACCENTS)[number]['value']

export function SettingsForm({
  initialTheme,
  initialAccent,
  userName,
}: {
  initialTheme: ThemeValue
  initialAccent: AccentValue
  userName: string
}) {
  const [theme, setTheme] = useState<ThemeValue>(initialTheme)
  const [accent, setAccent] = useState<AccentValue>(initialAccent)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const dirty = theme !== initialTheme || accent !== initialAccent

  function save() {
    const fd = new FormData()
    fd.set('themePreference', theme)
    fd.set('accentColor', accent)
    startTransition(async () => {
      await updatePreferences(fd)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2200)
    })
  }

  return (
    <form
      className="settings-form"
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <fieldset className="settings-group">
        <legend className="settings-group-title">Thème</legend>
        <div className="settings-options">
          {THEMES.map((t) => (
            <label
              key={t.value}
              className={`settings-option ${theme === t.value ? 'is-selected' : ''}`}
            >
              <input
                type="radio"
                name="themePreference"
                value={t.value}
                checked={theme === t.value}
                onChange={() => setTheme(t.value)}
              />
              <span className="settings-option-label">{t.label}</span>
              <span className="settings-option-desc">{t.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="settings-group">
        <legend className="settings-group-title">Couleur d’accent</legend>
        <div className="settings-accents">
          {ACCENTS.map((a) => (
            <label
              key={a.value}
              className={`settings-accent ${accent === a.value ? 'is-selected' : ''}`}
              title={a.label}
            >
              <input
                type="radio"
                name="accentColor"
                value={a.value}
                checked={accent === a.value}
                onChange={() => setAccent(a.value)}
              />
              <span className="settings-accent-swatch" style={{ background: a.hex }} aria-hidden="true" />
              <span className="settings-option-label">{a.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="settings-actions">
        <button
          type="submit"
          className="lux-auth-submit"
          disabled={!dirty || pending}
          style={{ maxWidth: 320 }}
        >
          {pending ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
        <span className="settings-hint">Connecté en tant que {userName}</span>
      </div>
    </form>
  )
}
