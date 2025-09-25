import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { PATHROUTES } from './constants/pathroutes';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isPymesRoute = pathname.startsWith('/pymes');
  const isSuperAdminRoute = pathname.startsWith('/superadmin');
  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isPublicAuthRoute = pathname === PATHROUTES.login || pathname === PATHROUTES.register;

  if (!token) {
    if (isPymesRoute || isSuperAdminRoute || isOnboardingRoute) {
      return NextResponse.redirect(new URL(PATHROUTES.login, req.url));
    }
    return NextResponse.next();
  }

  if (isPublicAuthRoute) {
    const redirectUrl = token.companyId 
      ? PATHROUTES.pymes.dashboard 
      : PATHROUTES.onboarding.create_company;
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  if (!token.companyId && pathname !== PATHROUTES.onboarding.create_company && isPymesRoute) {
    return NextResponse.redirect(new URL(PATHROUTES.onboarding.create_company, req.url));
  }
  
  if (token.companyId && isOnboardingRoute) {
    return NextResponse.redirect(new URL(PATHROUTES.pymes.dashboard, req.url));
  }
  
  if (token.subscriptionStatus !== 'PREMIUM' && pathname.startsWith(PATHROUTES.pymes.reportes)) {
    return NextResponse.redirect(new URL(PATHROUTES.pymes.suscripcion, req.url));
  }

  // Solo OWNER puede acceder a Miembros del Equipo
  if (pathname.startsWith(PATHROUTES.pymes.miembros) && token.role !== 'OWNER') {
    return NextResponse.redirect(new URL(PATHROUTES.pymes.configuracion, req.url));
  }

  if (token.role !== 'SUPERADMIN' && isSuperAdminRoute) {
    return NextResponse.redirect(new URL(PATHROUTES.pymes.dashboard, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/pymes/:path*',
    '/onboarding/:path*',
    '/login',
    '/register',
    '/superadmin/:path*',
  ],
};