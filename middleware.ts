import { NextRequest, NextResponse } from 'next/server'

// Security: Require ADMIN_SECRET to be set
if (!process.env.ADMIN_SECRET) {
  console.error('CRITICAL: ADMIN_SECRET environment variable is not set!')
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public access to login and auth endpoints
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login/') ||
    pathname === '/api/admin/auth'
  ) {
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')
  const adminSecret = process.env.ADMIN_SECRET

  // Security: Block access if ADMIN_SECRET is not configured
  if (!adminSecret) {
    console.error('SECURITY BLOCK: Admin access attempted without ADMIN_SECRET')
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 503 }
      )
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Validate session
  if (!session?.value || session.value !== adminSecret) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
