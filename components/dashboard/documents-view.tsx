'use client'

import { useEffect, useState, useCallback, useTransition } from 'react'
import { IconClose } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { SUBJECTS } from './types'

interface DocRow {
  id: string
  filename: string
  subject: string | null
  createdAt: string
}

function DocumentUpload({ onUploaded }: { onUploaded: (doc: DocRow) => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function upload(formData: FormData) {
    setError('')
    setSuccess('')
    startTransition(async () => {
      const res = await fetch('/api/documents/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Échec de l\'upload.')
        return
      }
      const data = await res.json()
      const fileInput = formData.get('file') as File | null
      onUploaded({
        id: data.id,
        filename: fileInput?.name ?? data.filename,
        subject: (formData.get('subject') as string) || null,
        createdAt: new Date().toISOString(),
      })
      setSuccess('Document enregistré.')
    })
  }

  return (
    <form action={upload} className="doc-upload">
      <Label>
        Fichier
        <Input type="file" name="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" required className="file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground" />
      </Label>
      <Label>
        Matière (optionnel)
        <Select name="subject" defaultValue=""><option value="">—</option>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</Select>
      </Label>
      <Button type="submit" variant="default" disabled={pending}>{pending ? 'Envoi…' : 'Téléverser'}</Button>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {success && <p className="empty-line" role="status">{success}</p>}
    </form>
  )
}

function DocumentList({ docs, onRemove }: { docs: DocRow[] | null; onRemove: (id: string) => void }) {
  return (
    <div className="task-list">
      {docs === null && <p className="empty-line">Chargement…</p>}
      {docs?.length === 0 && <p className="empty-line">Aucun document pour le moment.</p>}
      {docs?.map((doc) => (
        <div className="task-row" key={doc.id}>
          <div className="task-body">
            <strong>{doc.filename}</strong>
            <small><span className="pill pill-amber">{doc.subject ?? 'Sans matière'}</span></small>
          </div>
          <a href={`/api/documents/file?id=${doc.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">Ouvrir</Button>
          </a>
          <Button variant="ghost" size="icon-xs" onClick={() => onRemove(doc.id)} aria-label="Supprimer"><IconClose size={12} /></Button>
        </div>
      ))}
    </div>
  )
}

export function DocumentsView() {
  const [docs, setDocs] = useState<DocRow[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/documents/upload')
      .then((r) => r.ok ? r.json() : { documents: [] })
      .then((data) => { if (!cancelled) setDocs(data.documents ?? []) })
      .catch(() => { if (!cancelled) setDocs([]) })
    return () => { cancelled = true }
  }, [])

  const handleUpload = useCallback((doc: DocRow) => {
    setDocs((cur) => [doc, ...(cur ?? [])])
  }, [])

  const handleRemove = useCallback(async (id: string) => {
    await fetch('/api/documents/upload', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setDocs((cur) => cur?.filter((d) => d.id !== id) ?? null)
  }, [])

  return (
    <>
      <div className="section-heading"><div><p className="eyebrow">Bibliothèque</p><h2>Connaissances</h2></div></div>
      <section className="panel">
        <div className="panel-header"><div><h3>Mes documents</h3><span>PDF, TXT, Markdown - 4 Mo max</span></div></div>
        <DocumentUpload onUploaded={handleUpload} />
        <DocumentList docs={docs} onRemove={handleRemove} />
      </section>
    </>
  )
}
