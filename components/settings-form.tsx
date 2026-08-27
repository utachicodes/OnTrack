'use client'

import { useState, useTransition } from 'react'
import { updatePreferences } from '@/app/actions/preferences'
import { Button } from '@/components/ui/button'

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

interface NotifState {
  reminders: boolean
  examAlerts: boolean
  quietStart: string
  quietEnd: string
}

export function SettingsForm({
  initialTheme,
  initialAccent,
  initialNotif,
  userName,
}: {
  initialTheme: ThemeValue
  initialAccent: AccentValue
  initialNotif?: Partial<NotifState>
  userName: string
}) {
  const [theme, setTheme] = useState<ThemeValue>(initialTheme)
  const [accent, setAccent] = useState<AccentValue>(initialAccent)
  const [notif, setNotif] = useState<NotifState>({
    reminders: initialNotif?.reminders ?? true,
    examAlerts: initialNotif?.examAlerts ?? true,
    quietStart: initialNotif?.quietStart ?? '22:00',
    quietEnd: initialNotif?.quietEnd ?? '07:00',
  })
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const dirty = theme !== initialTheme || accent !== initialAccent
  const notifDirty = notif.reminders !== (initialNotif?.reminders ?? true)
    || notif.examAlerts !== (initialNotif?.examAlerts ?? true)
    || notif.quietStart !== (initialNotif?.quietStart ?? '22:00')
    || notif.quietEnd !== (initialNotif?.quietEnd ?? '07:00')

  function save() {
    const fd = new FormData()
    fd.set('themePreference', theme)
    fd.set('accentColor', accent)
    fd.set('reminders', notif.reminders ? 'on' : 'off')
    fd.set('examAlerts', notif.examAlerts ? 'on' : 'off')
    fd.set('quietStart', notif.quietStart)
    fd.set('quietEnd', notif.quietEnd)
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
        <legend className="settings-group-title">Couleur d&apos;accent</legend>
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

      <fieldset className="settings-group">
        <legend className="settings-group-title">Notifications</legend>
        <div className="settings-notif">
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={notif.reminders}
              onChange={(e) => setNotif((n) => ({ ...n, reminders: e.target.checked }))}
            />
            <span className="settings-toggle-track"><span /></span>
            <span className="settings-toggle-copy">
              <strong>Rappels de tâches</strong>
              <small>Sois notifié des échéances qui approchent.</small>
            </span>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={notif.examAlerts}
              onChange={(e) => setNotif((n) => ({ ...n, examAlerts: e.target.checked }))}
            />
            <span className="settings-toggle-track"><span /></span>
            <span className="settings-toggle-copy">
              <strong>Alertes d&apos;examens</strong>
              <small>Un rappel quelques jours avant chaque examen.</small>
            </span>
          </label>
          <div className="settings-quiet">
            <span className="settings-toggle-copy">
              <strong>Heures de tranquillité</strong>
              <small>Aucune notification pendant cette plage.</small>
            </span>
            <div className="settings-quiet-row">
              <input
                type="time"
                value={notif.quietStart}
                onChange={(e) => setNotif((n) => ({ ...n, quietStart: e.target.value }))}
                aria-label="Début"
              />
              <span>→</span>
              <input
                type="time"
                value={notif.quietEnd}
                onChange={(e) => setNotif((n) => ({ ...n, quietEnd: e.target.value }))}
                aria-label="Fin"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <div className="settings-actions">
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={(!dirty && !notifDirty) || pending}
          className="max-w-[320px]"
        >
          {pending ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
        </Button>
        <span className="settings-hint">Connecté en tant que {userName}</span>
      </div>
    </form>
  )
}
