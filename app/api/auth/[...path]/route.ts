import { auth } from '@/lib/auth'

type AuthRouteContext = { params: { path: string[] } }

export const GET = (request: Request, context: AuthRouteContext) => auth.handler().GET(request, context as never)
export const POST = (request: Request, context: AuthRouteContext) => auth.handler().POST(request, context as never)