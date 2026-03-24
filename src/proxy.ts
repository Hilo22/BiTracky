import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
const protectedRoutes = ['/dashboard', '/profile'];
const authRoutes= ['/register','/login'];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  const cookie = req.cookies.get('session')?.value;

  if (isProtectedRoute && !cookie) {
 
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isAuthRoute && cookie) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register'],
}