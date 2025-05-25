import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/admin/login',
  '/mfa-verify',
  '/api/auth',
];

// Add paths that require admin authentication
const adminPaths = [
  '/admin',
  '/api/admin',
];

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth-storage')?.value;
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  // Check if the path requires admin access
  const isAdminPath = adminPaths.some((adminPath) =>
    path.startsWith(adminPath)
  );
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If there's no auth cookie and the path is not public, redirect to login
  if (!authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  // If it's an admin path, check if the user is an admin
  if (isAdminPath && path !== '/admin/login') {
    try {
      const authData = JSON.parse(authCookie);
      const user = authData.state?.user;
      
      // Check if user exists and has admin role
      if (!user || user.role !== 'admin') {
        // Redirect non-admin users to the regular dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Check if MFA is required but not completed
      if (authData.state?.requiresMfa && !authData.state?.isAuthenticated) {
        return NextResponse.redirect(new URL('/mfa-verify', request.url));
      }
    } catch (error) {
      // If we can't parse the token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 