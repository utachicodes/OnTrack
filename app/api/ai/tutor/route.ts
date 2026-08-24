import { generateText } from 'ai'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const question = typeof body.question === 'string' ? body.question.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : 'général'
  if (!question || question.length > 2000) return NextResponse.json({ error: 'Question is required and must be under 2,000 characters' }, { status: 400 })

  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: 'Tu es Orbit, un tuteur bienveillant pour un candidat au BAC français. Explique clairement, donne des étapes concrètes, et ne fais pas les devoirs à la place de l’élève.',
      prompt: `Matière: ${subject}\nQuestion: ${question}`,
      maxOutputTokens: 700,
    })
    return NextResponse.json({ answer: result.text })
  } catch (error) {
    console.error('[v0] AI tutor request failed', error)
    return NextResponse.json({ error: 'Tutor unavailable' }, { status: 503 })
  }
}
