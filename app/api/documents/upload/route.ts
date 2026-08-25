import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { learningDocuments } from '@/lib/db/schema'

// Vercel serverless functions cap request bodies at 4.5 MB.
const MAX_FILE_SIZE = 4 * 1024 * 1024
const ALLOWED_TYPES = new Set(['application/pdf', 'text/plain', 'text/markdown'])

export async function POST(request: Request) {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file')
  const subject = formData.get('subject')

  if (!(file instanceof File)) return NextResponse.json({ error: 'A file is required' }, { status: 400 })
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Only PDF, TXT, and Markdown files are supported' }, { status: 415 })
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Files must be 4 MB or smaller' }, { status: 413 })

  const data = Buffer.from(await file.arrayBuffer())
  const [document] = await db.insert(learningDocuments).values({
    userId: session.user.id,
    subject: typeof subject === 'string' && subject.length <= 80 ? subject : null,
    filename: file.name,
    mimeType: file.type,
    data,
  }).returning({ id: learningDocuments.id })

  return NextResponse.json({ id: document.id, filename: file.name, status: 'uploaded' }, { status: 201 })
}

export async function GET() {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const documents = await db.select({ id: learningDocuments.id, filename: learningDocuments.filename, subject: learningDocuments.subject, status: learningDocuments.status, createdAt: learningDocuments.createdAt }).from(learningDocuments).where(and(eq(learningDocuments.userId, session.user.id))).orderBy(learningDocuments.createdAt)
  return NextResponse.json({ documents })
}

export async function DELETE(request: Request) {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json().catch(() => ({}))
  if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'Document id is required' }, { status: 400 })
  const deleted = await db.delete(learningDocuments).where(and(eq(learningDocuments.id, id), eq(learningDocuments.userId, session.user.id))).returning({ id: learningDocuments.id })
  if (!deleted.length) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
