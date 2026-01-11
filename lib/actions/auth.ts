'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    })
    return 'success'
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas.'
        default:
          return 'Algo salió mal.'
      }
    }
    throw error
  }
}

export async function login(formData: FormData) {
  try {
    await signIn('credentials', {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Credenciales inválidas' }
        default:
          return { error: 'Algo salió mal' }
      }
    }
    // Si es un redirect exitoso (NEXT_REDIRECT), dejarlo pasar
    throw error
  }
}
