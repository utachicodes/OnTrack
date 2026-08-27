'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconPen, IconClose } from '@/components/icons'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function downscale(dataUrl: string, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const ratio = Math.min(1, maxSize / Math.max(img.width, img.height))
      const w = Math.max(1, Math.round(img.width * ratio))
      const h = Math.max(1, Math.round(img.height * ratio))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('canvas'))
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

export function ProfileAvatarUpload({
  name,
  image,
  size,
  rounded = false,
  onChanged,
}: {
  name: string
  image: string | null
  size?: number
  rounded?: boolean
  onChanged?: (url: string | null) => void
}) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const initials = name.trim().split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase()
  const style = { width: size ?? 76, height: size ?? 76, borderRadius: rounded ? '50%' : undefined }

  async function pick(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Formats image uniquement.'); return }
    if (file.size > 3 * 1024 * 1024) { setError('Image trop lourde (max 3 Mo).'); return }
    setBusy(true)
    setError('')
    try {
      const full = await fileToDataUrl(file)
      const small = await downscale(full)
      const res = await fetch('/api/profile/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: small }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Échec de l\u2019enregistrement.')
        return
      }
      const data = await res.json()
      onChanged?.(data.image)
      router.refresh()
    } catch {
      setError('Impossible de lire cette image.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/profile/image', { method: 'DELETE' })
      if (!res.ok) { setError('Échec de la suppression.'); return }
      onChanged?.(null)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="avatar-upload" style={{ textAlign: 'center' }}>
      <div className="avatar-upload-stage" style={{ position: 'relative', display: 'inline-block' }}>
        <div className={`${rounded ? 'avatar' : 'profile-avatar'} avatar-upload-render`} style={style} aria-hidden="true">
          {image ? <img src={image} alt="" /> : initials}
        </div>
        <button
          type="button"
          className="avatar-upload-btn"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          aria-label="Changer la photo"
        >
          <IconPen size={13} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = '' }}
        />
      </div>
      {image && (
        <button type="button" className="avatar-remove" disabled={busy} onClick={remove}>
          <IconClose size={11} /> Retirer
        </button>
      )}
      {error && <p className="auth-error" role="alert">{error}</p>}
    </div>
  )
}