import { get } from '@vercel/blob'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { learningDocuments } from '@/lib/db/schema'

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pathname = new URL(request.url).searchParams.get('pathname')
  if (!pathname || !pathname.startsWith(`documents/${session.user.id}/`)) {
    return NextResponse.json({ error: 'Invalid document path' }, { status: 400 })
  }

  const [document] = await db.select({ pathname: learningDocuments.pathname }).from(learningDocuments).where(and(eq(learningDocuments.pathname, pathname), eq(learningDocuments.userId, session.user.id)))
  if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

  const result = await get(document.pathname, { access: 'private', ifNoneMatch: request.headers.get('if-none-match') ?? undefined })
  if (!result) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  if (result.statusCode === 304) return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, 'Cache-Control': 'private, no-cache' } })

  return new NextResponse(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType,
      'Content-Disposition': `inline; filename="${document.pathname.split('/').pop()?.replace(/^[^-]+-/, '') ?? 'document'}"`,
      ETag: result.blob.etag,
      'Cache-Control': 'private, no-cache',
    },
  })
}
