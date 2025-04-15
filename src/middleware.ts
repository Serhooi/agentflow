import { NextRequest, NextResponse } from 'next/server'

// Простое разрешение всех маршрутов — пока без авторизации
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Указываем, на какие маршруты распространяется middleware
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/broker/:path*'],
}
