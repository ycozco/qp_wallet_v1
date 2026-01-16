import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export default NextAuth(authConfig).auth

export const config = {
  // Don't invoke middleware on auth routes and static files
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
