import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import { addSecurityHeaders } from '@/lib/security-headers'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect company pages - require authentication and admin/employee role
  if (pathname.startsWith('/company-dashboard') || pathname.startsWith('/company-setup')) {
    const token = request.cookies.get('authToken')?.value
    
    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      loginUrl.searchParams.set('error', 'AUTH_REQUIRED')
      return NextResponse.redirect(loginUrl)
    }

    const user = verifyToken(token)
    
    if (!user) {
      // Invalid token - redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      loginUrl.searchParams.set('error', 'AUTH_INVALID')
      return NextResponse.redirect(loginUrl)
    }

    if (!['admin', 'employee'].includes(user.role)) {
      // Insufficient permissions
      const errorUrl = new URL('/dashboard', request.url)
      errorUrl.searchParams.set('error', 'INSUFFICIENT_PERMISSIONS')
      return NextResponse.redirect(errorUrl)
    }

    // Add user info to headers for the page to access
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.userId)
    response.headers.set('x-user-email', user.email)
    response.headers.set('x-user-role', user.role)
    
    // Add security headers
    return addSecurityHeaders(response)
  }

  // Protect user pages - require authentication for data subjects or any authenticated user
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/create-request')) {
    const token = request.cookies.get('authToken')?.value
    
    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      loginUrl.searchParams.set('error', 'AUTH_REQUIRED')
      return NextResponse.redirect(loginUrl)
    }

    const user = verifyToken(token)
    
    if (!user) {
      // Invalid token - redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      loginUrl.searchParams.set('error', 'AUTH_INVALID')
      return NextResponse.redirect(loginUrl)
    }

    // Add user info to headers for the page to access
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.userId)
    response.headers.set('x-user-email', user.email)
    response.headers.set('x-user-role', user.role)
    
    // Add security headers
    return addSecurityHeaders(response)
  }

  // Protect admin pages - require authentication and super_admin role
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('authToken')?.value
    
    if (!token) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      loginUrl.searchParams.set('error', 'AUTH_REQUIRED')
      return NextResponse.redirect(loginUrl)
    }

    const user = verifyToken(token)
    
    if (!user) {
      // Invalid token - redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('returnTo', pathname)
      loginUrl.searchParams.set('error', 'AUTH_INVALID')
      return NextResponse.redirect(loginUrl)
    }

    if (user.role !== 'super_admin') {
      // Insufficient permissions
      const errorUrl = new URL('/dashboard', request.url)
      errorUrl.searchParams.set('error', 'INSUFFICIENT_PERMISSIONS')
      return NextResponse.redirect(errorUrl)
    }

    // Add user info to headers for the page to access
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.userId)
    response.headers.set('x-user-email', user.email)
    response.headers.set('x-user-role', user.role)
    
    // Add security headers
    return addSecurityHeaders(response)
  }

  // Add security headers to all responses
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    '/company-dashboard/:path*',
    '/company-setup/:path*',
    '/dashboard/:path*',
    '/create-request/:path*',
    '/admin/:path*'
  ]
}