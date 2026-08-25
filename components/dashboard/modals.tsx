'use client'

import { useTransition, useState } from 'react'
import { IconAdd, IconClose } from '@/components/icons'
import { Dialog, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SUBJECTS } from './types'

export function TaskModal({ onClose, onCreate }: { onClose: () => void; onCreate: (input: { title: string; subject?: string; priority?: string; estimatedMinutes?: number; dueAt?: string }) => void }) {
  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        onCreate({
          title: String(fd.get('title') ?? ''),
          subject: String(fd.get('subject') ?? ''),
          priority: String(fd.get('priority') ?? 'medium'),
          estimatedMinutes: Number(fd.get('minutes') ?? 25),
          dueAt: String(fd.get('due') ?? '') || undefined,
        })
      }}>
        <DialogHeader>
          <div>
            <p className="eyebrow">Nouvelle action</p>
            <DialogTitle>Ajouter une tâche</DialogTitle>
          </div>
          <DialogClose onClick={onClose} aria-label="Fermer"><IconClose size={18} /></DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label>
            Titre
            <Input name="title" autoFocus required placeholder="Ex. Revoir le chapitre 4" />
          </Label>
          <Label>
            Matière
            <Select name="subject" defaultValue="Mathématiques">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</Select>
          </Label>
          <div className="modal-row">
            <Label>
              Priorité
              <Select name="priority" defaultValue="medium"><option value="low">Basse</option><option value="medium">Moyenne</option><option value="high">Haute</option></Select>
            </Label>
            <Label>
              Durée (min)
              <Input name="minutes" type="number" min={5} max={240} defaultValue={25} />
            </Label>
          </div>
          <Label>
            Échéance (optionnel)
            <Input name="due" type="date" />
          </Label>
          <Button type="submit" variant="default" size="lg"><IconAdd size={17} /> Ajouter</Button>
        </div>
      </form>
    </Dialog>
  )
}

export function ExamModal({ onClose, onCreate }: { onClose: () => void; onCreate: (input: { title: string; subject: string; examAt: string }) => void }) {
  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        onCreate({
          title: String(fd.get('title') ?? ''),
          subject: String(fd.get('subject') ?? 'Général'),
          examAt: String(fd.get('examAt') ?? ''),
        })
      }}>
        <DialogHeader>
          <div>
            <p className="eyebrow">Nouveau rendez-vous</p>
            <DialogTitle>Ajouter un examen</DialogTitle>
          </div>
          <DialogClose onClick={onClose} aria-label="Fermer"><IconClose size={18} /></DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label>
            Titre
            <Input name="title" autoFocus required placeholder="Ex. Bac blanc de maths" />
          </Label>
          <Label>
            Matière
            <Select name="subject" defaultValue="Mathématiques">{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</Select>
          </Label>
          <Label>
            Date
            <Input name="examAt" type="date" required />
          </Label>
          <Button type="submit" variant="default" size="lg"><IconAdd size={17} /> Ajouter</Button>
        </div>
      </form>
    </Dialog>
  )
}

export function PushModal({ onClose }: { onClose: () => void }) {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState('')

  async function enable() {
    if (!('Notification' in window)) { setStatus('Notifications non supportées sur ce navigateur.'); return }
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') { setStatus('Permission refusée. Active-la dans les paramètres du navigateur.'); return }
    const reg = await navigator.serviceWorker?.ready
    if (!reg) { setStatus('Service worker indisponible.'); return }
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''),
    }).catch(() => null)
    if (!sub) { setStatus('Impossible de s\'abonner. Vérifie la clé VAPID.'); return }
    startTransition(async () => {
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      setStatus(res.ok ? 'Activées. Tu recevras les rappels d\'examens.' : 'Erreur lors de l\'enregistrement.')
    })
  }

  return (
    <Dialog open onClose={onClose}>
      <DialogHeader>
        <div>
          <p className="eyebrow">Notifications</p>
          <DialogTitle>Activer les rappels</DialogTitle>
        </div>
        <DialogClose onClick={onClose} aria-label="Fermer"><IconClose size={18} /></DialogClose>
      </DialogHeader>
      <p className="empty-line">OnTrack peut t&apos;envoyer des notifications pour les fins de session de focus et les rappels d&apos;examens. Aucune pub, jamais.</p>
      <Button variant="default" size="lg" onClick={enable} disabled={pending}>{pending ? 'Activation…' : 'Activer les notifications'}</Button>
      {status && <p className="empty-line" role="status">{status}</p>}
    </Dialog>
  )
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = typeof window === 'undefined' ? '' : window.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) output[i] = rawData.charCodeAt(i)
  return output
}
