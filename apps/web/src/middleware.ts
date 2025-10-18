import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './constants';

const protectedRoutes = ['/admin', '/me']; // Add all protected routes here

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => path.startsWith(route) // Check if path starts with any protected route
  );
  const accessToken = req.cookies.get('accessToken')?.value;
  // Handle protected routes
  if (isProtectedRoute && !accessToken) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(
      new URL(ROUTES.LOGIN, req.nextUrl)
    );
  }
  if(path.startsWith(ROUTES.LOGIN) && accessToken){
    // Redirect to profile if trying to access login while authenticated
    return NextResponse.redirect(new URL(ROUTES.PROFILE, req.nextUrl));
  }
  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}
