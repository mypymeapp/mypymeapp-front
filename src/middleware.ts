import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { PATHROUTES } from './constants/pathroutes';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isProtectedRoute = pathname.startsWith(PATHROUTES.pymes.dashboard);
  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isPublicAuthRoute = pathname === PATHROUTES.login || pathname === PATHROUTES.register;

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL(PATHROUTES.login, req.url));
    }
    if (token && !token.companyId) {
      return NextResponse.redirect(new URL(PATHROUTES.onboarding.create_company, req.url));
    }
  }

  if (isOnboardingRoute) {
    if (!token) {
      return NextResponse.redirect(new URL(PATHROUTES.login, req.url));
    }
    if (token && token.companyId) {
      return NextResponse.redirect(new URL(PATHROUTES.pymes.dashboard, req.url));
    }
  }

  if (isPublicAuthRoute && token) {
    const redirectUrl = token.companyId 
      ? PATHROUTES.pymes.dashboard 
      : PATHROUTES.onboarding.create_company;
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/pymes/:path*',
    '/onboarding/:path*',
    '/login',
    '/register',
  ],
};