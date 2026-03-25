import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

const protectedRoutes = ['/dashboard', '/api/links', '/profile'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Get token from cookies
  const token = request.cookies.get('session')?.value;

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access protected route with token, verify it
  if (isProtectedRoute && token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET || '');
      await jwtVerify(token, secret);
      // Token is valid, allow access
      return NextResponse.next();
    } catch {
      // Token is invalid or expired, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If trying to access login/register with token, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET || '');
      await jwtVerify(token, secret);
      // Valid token, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch {
      // Invalid token, allow access to auth pages
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
