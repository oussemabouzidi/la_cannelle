import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ Allow public routes
  if (
    pathname === '/login' ||
    pathname.startsWith('/api') ||
    !pathname.startsWith('/admin')
  ) {
    return NextResponse.next()
  }

  // 🔒 Protect admin routes only
  const token = req.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const payload = await verifyToken(token)
    if (payload.role !== 'admin') throw new Error()
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
