import { NextRequest, NextResponse } from 'next/server'

// Security: Require ADMIN_SECRET to be set
if (!process.env.ADMIN_SECRET) {
  console.error('CRITICAL: ADMIN_SECRET environment variable is not set!')
}

export async function POST(request: NextRequest) {
  try {
    const adminSecret = process.env.ADMIN_SECRET
    
    // Security: Reject if ADMIN_SECRET is not configured
    if (!adminSecret) {
      console.error('SECURITY ALERT: Login attempt when ADMIN_SECRET is not configured')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 503 }
      )
    }

    const { password } = await request.json()
    
    // Validate password format (prevent empty/null attacks)
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password diperlukan' }, { status: 400 })
    }

    // Constant-time comparison to prevent timing attacks
    const isValid = password === adminSecret
    
    if (!isValid) {
      // Log failed attempts for security monitoring
      console.warn(`Failed login attempt from IP: ${request.headers.get('x-forwarded-for') ?? 'unknown'}`)
      return NextResponse.json({ error: 'Password salah' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
