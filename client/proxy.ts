import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/registrar', '/olvide-contrasena'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;

    const isPublicRoute =
        publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
        pathname === '/reset-password' ||
        pathname.startsWith('/reset-password/');

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && (pathname === '/login' || pathname === '/registrar')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
