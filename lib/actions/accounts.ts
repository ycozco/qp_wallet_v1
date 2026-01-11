'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const AccountSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['cash', 'bank', 'card', 'wallet']),
  currency: z.string().default('PEN'),
  openingBalance: z.number().default(0),
})

export async function createAccount(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const validatedFields = AccountSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    currency: formData.get('currency') || 'PEN',
    openingBalance: Number(formData.get('openingBalance')) || 0,
  })

  if (!validatedFields.success) {
    return { error: 'Datos inválidos' }
  }

  try {
    await prisma.account.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    })

    revalidatePath('/dashboard/accounts')
    return { success: true }
  } catch (error) {
    return { error: 'Error al crear la cuenta' }
  }
}

export async function getAccounts() {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  return await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateAccount(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  const validatedFields = AccountSchema.safeParse({
    name: formData.get('name'),
    type: formData.get('type'),
    currency: formData.get('currency'),
    openingBalance: Number(formData.get('openingBalance')),
  })

  if (!validatedFields.success) {
    return { error: 'Datos inválidos' }
  }

  try {
    await prisma.account.updateMany({
      where: { id, userId: session.user.id },
      data: validatedFields.data,
    })

    revalidatePath('/dashboard/accounts')
    return { success: true }
  } catch (error) {
    return { error: 'Error al actualizar la cuenta' }
  }
}

export async function deleteAccount(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('No autorizado')

  try {
    await prisma.account.deleteMany({
      where: { id, userId: session.user.id },
    })

    revalidatePath('/dashboard/accounts')
    return { success: true }
  } catch (error) {
    return { error: 'Error al eliminar la cuenta' }
  }
}
