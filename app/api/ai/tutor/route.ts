import { google } from '@ai-sdk/google'
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
  if (!question || question.length > 2000) {
    return NextResponse.json(
      { error: 'Question is required and must be under 2,000 characters' },
      { status: 400 },
    )
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: 'AI tutor is not configured. Set GOOGLE_GENERATIVE_AI_API_KEY in env.' },
      { status: 503 },
    )
  }

  try {
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system:
        'Tu es le tuteur IA OnTrack, bienveillant pour un candidat au BAC français. Explique clairement, donne des étapes concrètes, et ne fais pas les devoirs à la place de l’élève.',
      prompt: `Matière: ${subject}\nQuestion: ${question}`,
      maxOutputTokens: 700,
    })
    return NextResponse.json({ answer: result.text })
  } catch (error) {
    console.error('[v0] AI tutor request failed', error)
    return NextResponse.json({ error: 'Tutor unavailable' }, { status: 503 })
  }
}
