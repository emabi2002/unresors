import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🧪 TESTING MODE: Authentication temporarily disabled
// To re-enable authentication, uncomment the code below and delete the "return NextResponse.next();" line

export async function middleware(request: NextRequest) {
  // ⚠️ TESTING MODE - BYPASS AUTHENTICATION
  // Remove this line to re-enable authentication
  return NextResponse.next();

  /* UNCOMMENT TO RE-ENABLE AUTHENTICATION:

  const { pathname } = request.nextUrl;

  // Only protect /portal routes
  if (!pathname.startsWith('/portal')) {
    return NextResponse.next();
  }

  // Check for Supabase session cookie
  const supabaseAuth = request.cookies.get('sb-kemnvfkdybsujxerhcqi-auth-token');

  // If no session, redirect to login
  if (!supabaseAuth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to continue
  return NextResponse.next();

  */
}

export const config = {
  matcher: [
    '/portal/:path*',
  ],
};
