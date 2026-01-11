import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

async function getUser(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        authProviders: true
      }
    })
    return user
  } catch (error) {
    throw new Error('Failed to fetch user.')
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data
          const user = await getUser(username)
          if (!user) return null
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

          if (passwordsMatch) {
            return {
              id: user.id,
              name: user.fullName || user.username,
              email: user.email,
            }
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
