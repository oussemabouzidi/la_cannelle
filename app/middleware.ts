import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const payload = await verifyToken(token)

    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
