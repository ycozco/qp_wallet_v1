import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signIn } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validar campos
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        authProviders: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Si las credenciales son correctas, hacer signIn con NextAuth
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/dashboard',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    )
  }
}
