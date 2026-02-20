import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/torneos/crear',
  '/perfil',
  '/admin',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  // Leer token de cookies
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/torneos/crear', '/perfil', '/admin'],
};
