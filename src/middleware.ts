import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create a Supabase client for auth
  const supabase = createServerSupabaseClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Auth routes that don't require authentication
  const authRoutes = ['/auth/login', '/auth/register'];
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/api/webhook/stripe'];
  
  // Check if the route is public or auth
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // If user is not authenticated and trying to access a protected route
  if (!session && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // If user is authenticated and trying to access an auth route
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is authenticated, check role-based access
  if (session) {
    const { data: { user } } = await supabase.auth.getUser();
    const userRole = user?.user_metadata?.role || 'agent';
    
    // Admin routes
    if (pathname.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Broker routes
    if (pathname.startsWith('/broker') && userRole !== 'broker' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}
