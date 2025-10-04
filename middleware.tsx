import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Protect routes that are not public
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Handle locale from cookies
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';
  
  // Set locale in response headers for next-intl
  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', locale);
  
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};