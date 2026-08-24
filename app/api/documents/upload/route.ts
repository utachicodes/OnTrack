import { put } from '@vercel/blob'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { learningDocuments } from '@/lib/db/schema'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set(['application/pdf', 'text/plain', 'text/markdown'])

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const subject = formData.get('subject')

  if (!(file instanceof File)) return NextResponse.json({ error: 'A file is required' }, { status: 400 })
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Only PDF, TXT, and Markdown files are supported' }, { status: 415 })
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Files must be 10 MB or smaller' }, { status: 413 })

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120) || 'document'
  const pathname = `documents/${session.user.id}/${crypto.randomUUID()}-${safeName}`
  const blob = await put(pathname, file, { access: 'private' })
  const [document] = await db.insert(learningDocuments).values({
    userId: session.user.id,
    subject: typeof subject === 'string' && subject.length <= 80 ? subject : null,
    filename: file.name,
    pathname: blob.pathname,
    mimeType: file.type,
    status: 'uploaded',
  }).returning({ id: learningDocuments.id })

  return NextResponse.json({ id: document.id, filename: file.name, status: 'uploaded' }, { status: 201 })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const documents = await db.select({ id: learningDocuments.id, filename: learningDocuments.filename, subject: learningDocuments.subject, status: learningDocuments.status, createdAt: learningDocuments.createdAt }).from(learningDocuments).where(and(eq(learningDocuments.userId, session.user.id))).orderBy(learningDocuments.createdAt)
  return NextResponse.json({ documents })
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json().catch(() => ({}))
  if (typeof id !== 'string') return NextResponse.json({ error: 'Document id is required' }, { status: 400 })
  const [document] = await db.select({ pathname: learningDocuments.pathname }).from(learningDocuments).where(and(eq(learningDocuments.id, id), eq(learningDocuments.userId, session.user.id)))
  if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  const { del } = await import('@vercel/blob')
  await del(document.pathname)
  await db.delete(learningDocuments).where(and(eq(learningDocuments.id, id), eq(learningDocuments.userId, session.user.id)))
  return NextResponse.json({ success: true })
}
