import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { learningDocuments } from '@/lib/db/schema'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: Request) {
  const { data: session } = await auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(request.url).searchParams.get('id') ?? ''
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid document id' }, { status: 400 })

  const [document] = await db
    .select({
      filename: learningDocuments.filename,
      mimeType: learningDocuments.mimeType,
      data: learningDocuments.data,
    })
    .from(learningDocuments)
    .where(and(eq(learningDocuments.id, id), eq(learningDocuments.userId, session.user.id)))
  if (!document?.data) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  return new NextResponse(new Uint8Array(document.data), {
    headers: {
      'Content-Type': document.mimeType,
      'Content-Disposition': `inline; filename="${document.filename.replace(/["\\]/g, '')}"`,
      'Cache-Control': 'private, no-cache',
    },
  })
}
