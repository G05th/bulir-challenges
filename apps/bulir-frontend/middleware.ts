import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = {
  '/manage': ['PROVIDER'],
  '/history': ['CLIENT', 'PROVIDER'],
};

const publicOnlyRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('accessToken')?.value;

  if (publicOnlyRoutes.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (Object.keys(protectedRoutes).includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/manage', '/history'],
};
